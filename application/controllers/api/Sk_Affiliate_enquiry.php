<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

/**
 * Affiliate programme enquiry (mobile + web).
 * POST /shopkart-api/affiliate/enquiry
 * GET  /shopkart-api/affiliate/enquiry  (own list: auth or ?email=)
 * GET  /shopkart-api/affiliate/enquiry/(:num)
 */
class Sk_Affiliate_enquiry extends Sk_Base_Api {

    public function __construct() {
        parent::__construct();
        $this->_ensure_schema();
    }

    /** POST — submit enquiry (auth optional). */
    public function store() {
        $data = $this->body();
        $name  = trim((string)($data['name'] ?? ''));
        $email = strtolower(trim((string)($data['email'] ?? '')));
        $phone = trim((string)($data['phone'] ?? ''));
        $promo = trim((string)($data['promo_code'] ?? $data['suggested_promo'] ?? ''));
        $message = trim((string)($data['message'] ?? $data['details'] ?? ''));

        if ($name === '') {
            return $this->error('Name is required.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->error('A valid email is required.');
        }
        if ($message === '') {
            return $this->error('Message / details are required.');
        }

        $userId = null;
        $jwt = $this->sk_jwt->get_user_from_request();
        if ($jwt && !empty($jwt['user_id'])) {
            $userId = (int)$jwt['user_id'];
            $user = $this->Sk_User_model->get_by_id($userId);
            if ($user) {
                if ($name === '') {
                    $name = $user['name'] ?? $name;
                }
                if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    $email = strtolower((string)($user['email'] ?? $email));
                }
                if ($phone === '') {
                    $phone = (string)($user['phone'] ?? '');
                }
            }
        }

        $row = [
            'user_id'    => $userId ?: null,
            'name'       => $name,
            'email'      => $email,
            'phone'      => $phone !== '' ? $phone : null,
            'promo_code' => $promo !== '' ? substr($promo, 0, 60) : null,
            'message'    => $message,
            'status'     => 'new',
            'created_at' => date('Y-m-d H:i:s'),
        ];
        $this->db->insert('affiliate_enquiries', $row);
        $id = (int)$this->db->insert_id();

        // Also mirror into contact_enquiries for existing admin Contacts list
        if ($this->db->table_exists('contact_enquiries')) {
            $contactMsg = "Affiliate programme enquiry\n\n"
                . ($phone !== '' ? "Phone: {$phone}\n" : '')
                . ($promo !== '' ? "Suggested promo code: {$promo}\n" : '')
                . "Details:\n{$message}";
            $this->db->insert('contact_enquiries', [
                'name'       => $name,
                'email'      => $email,
                'message'    => $contactMsg,
                'status'     => 'new',
                'created_at' => date('Y-m-d H:i:s'),
            ]);
        }

        $this->load->helper('sk_mailer');
        $mailBody = "Affiliate programme enquiry\n\n"
            . ($phone !== '' ? "Phone: {$phone}\n" : '')
            . ($promo !== '' ? "Suggested promo code: {$promo}\n" : '')
            . "Details:\n{$message}";
        sk_mail_contact_enquiry($name, $email, $mailBody);

        $this->success([
            'id'     => $id,
            'status' => 'new',
        ], 'Thank you! Your affiliate enquiry has been submitted.', 201);
    }

    /**
     * GET — list enquiries.
     * Auth: returns that user's enquiries.
     * Public: require ?email= to list by email (limited fields).
     */
    public function index() {
        $jwt = $this->sk_jwt->get_user_from_request();
        $email = strtolower(trim((string)$this->input->get('email', TRUE)));
        $status = trim((string)$this->input->get('status', TRUE));
        $limit = min(50, max(1, (int)($this->input->get('limit') ?? 20)));
        $page  = max(1, (int)($this->input->get('page') ?? 1));
        $offset = ($page - 1) * $limit;

        $applyScope = function () use ($jwt, $email, $status) {
            if ($jwt && !empty($jwt['user_id'])) {
                $user = $this->Sk_User_model->get_by_id((int)$jwt['user_id']);
                $this->db->group_start()
                    ->where('user_id', (int)$jwt['user_id']);
                if ($user && !empty($user['email'])) {
                    $this->db->or_where('email', strtolower($user['email']));
                }
                $this->db->group_end();
            } elseif ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $this->db->where('email', $email);
            } else {
                return false;
            }
            if (in_array($status, ['new', 'read', 'replied', 'closed'], true)) {
                $this->db->where('status', $status);
            }
            return true;
        };

        if (!$applyScope()) {
            return $this->error('Login or provide email to list enquiries.', 401);
        }
        $total = (int)$this->db->count_all_results('affiliate_enquiries');

        if (!$applyScope()) {
            return $this->error('Login or provide email to list enquiries.', 401);
        }
        $rows = $this->db->order_by('id', 'DESC')->limit($limit, $offset)->get('affiliate_enquiries')->result_array();

        $this->success([
            'enquiries'   => array_map([$this, '_public_row'], $rows),
            'total'       => $total,
            'page'        => $page,
            'limit'       => $limit,
            'total_pages' => $limit > 0 ? (int)ceil($total / $limit) : 0,
        ]);
    }

    /** GET /affiliate/enquiry/:id */
    public function show($id = 0) {
        $id = (int)$id;
        $row = $this->db->where('id', $id)->get('affiliate_enquiries')->row_array();
        if (!$row) {
            return $this->error('Enquiry not found.', 404);
        }

        $jwt = $this->sk_jwt->get_user_from_request();
        $email = strtolower(trim((string)$this->input->get('email', TRUE)));
        $allowed = false;
        if ($jwt && !empty($jwt['user_id'])) {
            if ((int)($row['user_id'] ?? 0) === (int)$jwt['user_id']) {
                $allowed = true;
            } else {
                $user = $this->Sk_User_model->get_by_id((int)$jwt['user_id']);
                if ($user && strtolower((string)$user['email']) === strtolower((string)$row['email'])) {
                    $allowed = true;
                }
            }
        } elseif ($email !== '' && strtolower($email) === strtolower((string)$row['email'])) {
            $allowed = true;
        }

        if (!$allowed) {
            return $this->error('Not allowed to view this enquiry.', 403);
        }

        $this->success($this->_public_row($row));
    }

    private function _public_row(array $row): array {
        return [
            'id'         => (int)$row['id'],
            'name'       => $row['name'],
            'email'      => $row['email'],
            'phone'      => $row['phone'],
            'promo_code' => $row['promo_code'],
            'message'    => $row['message'],
            'status'     => $row['status'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'] ?? null,
        ];
    }

    private function _ensure_schema(): void {
        static $done = false;
        if ($done) {
            return;
        }
        $done = true;
        if ($this->db->table_exists('affiliate_enquiries')) {
            return;
        }
        $this->db->query("CREATE TABLE IF NOT EXISTS `affiliate_enquiries` (
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            `user_id` INT UNSIGNED NULL DEFAULT NULL,
            `name` VARCHAR(150) NOT NULL,
            `email` VARCHAR(150) NOT NULL,
            `phone` VARCHAR(40) NULL DEFAULT NULL,
            `promo_code` VARCHAR(60) NULL DEFAULT NULL,
            `message` TEXT NOT NULL,
            `status` ENUM('new','read','replied','closed') NOT NULL DEFAULT 'new',
            `admin_note` TEXT NULL,
            `created_at` DATETIME NOT NULL,
            `updated_at` DATETIME NULL DEFAULT NULL,
            PRIMARY KEY (`id`),
            KEY `idx_aff_enq_email` (`email`),
            KEY `idx_aff_enq_user` (`user_id`),
            KEY `idx_aff_enq_status` (`status`),
            KEY `idx_aff_enq_created` (`created_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    }
}
