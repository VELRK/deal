<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Affiliates extends Sk_Base {

    public function __construct() {
        parent::__construct();
        $this->require_affiliate_panel_access();
        $this->load->model('Sk_Affiliate_model');
        $this->Sk_Affiliate_model->ensure_vendor_affiliate_schema();
    }

    protected function require_affiliate_panel_access(): void {
        if (!$this->is_super_admin() && !$this->current_vendor_id()) {
            show_error('Access denied.', 403);
        }
    }

    protected function scoped_vendor_id(): ?int {
        return $this->current_vendor_id();
    }

    protected function affiliate_filters(): array {
        $filters = [
            'search'     => $this->input->get('search', TRUE),
            'status'     => $this->input->get('status', TRUE),
            'kyc_status' => $this->input->get('kyc_status', TRUE),
        ];
        if ($vid = $this->scoped_vendor_id()) {
            $filters['vendor_id'] = $vid;
        }
        return $filters;
    }

    protected function assert_affiliate_access(?array $aff): void {
        if (!$aff) {
            show_404();
        }
        $vid = $this->scoped_vendor_id();
        if ($vid && !$this->Sk_Affiliate_model->belongs_to_vendor($aff, $vid)) {
            show_error('Access denied.', 403);
        }
    }

    public function index() {
        $filters = $this->affiliate_filters();
        $page = max(1, (int)($this->input->get('page') ?? 1));
        $limit = 15;
        $result = $this->Sk_Affiliate_model->get_all($filters, $limit, ($page - 1) * $limit);
        $vendorId = $this->scoped_vendor_id();

        $data['title']      = $vendorId ? 'My Affiliates' : 'Affiliates';
        $data['affiliates'] = $result['rows'];
        $data['total']      = $result['total'];
        $data['page']       = $page;
        $data['limit']      = $limit;
        $data['filters']    = $filters;
        $data['counts']     = $this->Sk_Affiliate_model->status_counts($vendorId);
        $data['is_vendor_scope'] = (bool)$vendorId;
        $data['affiliate_discount_enabled'] = $this->Sk_Affiliate_model->is_checkout_discount_globally_enabled();
        $data['enquiry_new_count'] = $this->_enquiry_new_count();
        $data['active_tab'] = 'affiliates';
        $this->render('affiliates/list', $data);
    }

    /**
     * Website + mobile affiliate enquiry form submissions.
     * GET shopkart/affiliates/enquiries
     */
    public function enquiries() {
        if (!$this->is_super_admin()) {
            show_error('Only admin can view affiliate enquiries.', 403);
        }
        $this->_ensure_enquiry_schema();
        $status = trim((string)$this->input->get('status', TRUE));
        $search = trim((string)$this->input->get('search', TRUE));
        $page = max(1, (int)($this->input->get('page') ?? 1));
        $limit = 25;
        $offset = ($page - 1) * $limit;

        if ($status !== '' && in_array($status, ['new', 'read', 'replied', 'closed'], true)) {
            $this->db->where('status', $status);
        }
        if ($search !== '') {
            $this->db->group_start()
                ->like('name', $search)
                ->or_like('email', $search)
                ->or_like('phone', $search)
                ->or_like('promo_code', $search)
                ->or_like('message', $search)
                ->group_end();
        }
        $total = (int)$this->db->count_all_results('affiliate_enquiries');

        if ($status !== '' && in_array($status, ['new', 'read', 'replied', 'closed'], true)) {
            $this->db->where('status', $status);
        }
        if ($search !== '') {
            $this->db->group_start()
                ->like('name', $search)
                ->or_like('email', $search)
                ->or_like('phone', $search)
                ->or_like('promo_code', $search)
                ->or_like('message', $search)
                ->group_end();
        }
        $rows = $this->db->order_by('id', 'DESC')->limit($limit, $offset)
            ->get('affiliate_enquiries')->result_array();

        $data['title'] = 'Affiliate Enquiries';
        $data['enquiries'] = $rows;
        $data['total'] = $total;
        $data['page'] = $page;
        $data['limit'] = $limit;
        $data['filters'] = ['status' => $status, 'search' => $search];
        $data['enquiry_new_count'] = $this->_enquiry_new_count();
        $data['active_tab'] = 'enquiries';
        $data['is_vendor_scope'] = false;
        $this->render('affiliates/enquiries', $data);
    }

    public function enquiry_mark($id = 0) {
        if (!$this->is_super_admin()) {
            return $this->json(['success' => false, 'message' => 'Access denied'], 403);
        }
        $this->_ensure_enquiry_schema();
        $id = (int)$id;
        $status = trim((string)($this->input->post('status') ?: $this->input->get('status') ?: 'read'));
        if (!in_array($status, ['new', 'read', 'replied', 'closed'], true)) {
            $status = 'read';
        }
        $row = $this->db->where('id', $id)->get('affiliate_enquiries')->row_array();
        if (!$row) {
            return $this->json(['success' => false, 'message' => 'Not found'], 404);
        }
        $this->db->where('id', $id)->update('affiliate_enquiries', [
            'status'     => $status,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        return $this->json(['success' => true, 'status' => $status]);
    }

    public function enquiry_delete($id = 0) {
        if (!$this->is_super_admin()) {
            return $this->json(['success' => false, 'message' => 'Access denied'], 403);
        }
        $this->_ensure_enquiry_schema();
        $id = (int)$id;
        $this->db->where('id', $id)->delete('affiliate_enquiries');
        return $this->json(['success' => true]);
    }

    /** Prefill Add Affiliate form from an enquiry. */
    public function enquiry_convert($id = 0) {
        if (!$this->is_super_admin()) {
            show_error('Access denied.', 403);
        }
        $this->_ensure_enquiry_schema();
        $row = $this->db->where('id', (int)$id)->get('affiliate_enquiries')->row_array();
        if (!$row) {
            $this->session->set_flashdata('error', 'Enquiry not found.');
            redirect('admin/affiliates/enquiries');
        }
        $this->db->where('id', (int)$id)->update('affiliate_enquiries', [
            'status'     => 'replied',
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        $qs = http_build_query([
            'name'       => $row['name'] ?? '',
            'email'      => $row['email'] ?? '',
            'phone'      => $row['phone'] ?? '',
            'promo_code' => $row['promo_code'] ?? '',
            'from_enquiry' => (int)$id,
        ]);
        redirect('admin/affiliates/add?' . $qs);
    }

    protected function _enquiry_new_count(): int {
        if (!$this->is_super_admin()) {
            return 0;
        }
        $this->_ensure_enquiry_schema();
        if (!$this->db->table_exists('affiliate_enquiries')) {
            return 0;
        }
        return (int)$this->db->where('status', 'new')->count_all_results('affiliate_enquiries');
    }

    protected function _ensure_enquiry_schema(): void {
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

    public function add() {
        $data['title'] = 'Add Affiliate';
        $data['is_vendor_scope'] = (bool)$this->scoped_vendor_id();
        $this->load->model('Sk_Bank_model');
        $data['banks'] = $this->Sk_Bank_model->get_all(true);
        if ($this->is_super_admin() && !$this->scoped_vendor_id()) {
            $data['vendors'] = $this->Sk_Vendor_model->get_all(['status' => 'approved'], 500, 0)['rows'] ?? [];
        }
        // Prefill from website/mobile enquiry convert link (not an edit record)
        $data['prefill'] = [
            'name'       => trim((string)$this->input->get('name', TRUE)),
            'email'      => trim((string)$this->input->get('email', TRUE)),
            'phone'      => trim((string)$this->input->get('phone', TRUE)),
            'promo_code' => strtoupper(trim((string)$this->input->get('promo_code', TRUE))),
        ];
        $this->render('affiliates/form', $data);
    }

    public function store() {
        $name  = trim($this->input->post('name', TRUE));
        $email = trim($this->input->post('email', TRUE));
        $phone = trim($this->input->post('phone', TRUE));
        $promo = strtoupper(trim($this->input->post('promo_code', TRUE) ?: $this->Sk_Affiliate_model->generate_promo_code($name, $phone)));

        if (!$name || !$email || !$phone) {
            $this->session->set_flashdata('error', 'Name, email and phone are required.');
            redirect('admin/affiliates/add');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->session->set_flashdata('error', 'Please enter a valid email address.');
            redirect('admin/affiliates/add');
        }
        if ($this->Sk_Affiliate_model->get_by_email($email)) {
            $this->session->set_flashdata('error', 'Email already registered.');
            redirect('admin/affiliates/add');
        }
        if (!$this->Sk_Affiliate_model->is_promo_code_available($promo)) {
            $this->session->set_flashdata('error', 'Promo code already exists in affiliates or promo codes.');
            redirect('admin/affiliates/add');
        }

        $payload = array_merge($this->_profile_input(), [
            'email'                     => $email,
            'promo_code'                => $promo,
            'commission_rate'           => $this->input->post('commission_rate') ?: 5,
            'customer_discount_percent' => $this->input->post('customer_discount_percent') ?: 0,
            'discount_active'           => $this->input->post('discount_active') ? 1 : 0,
            'status'                    => $this->input->post('status') ?: 'approved',
            'kyc_status'                => $this->input->post('kyc_status') ?: 'pending',
            'notes'                     => $this->input->post('notes'),
            'must_set_password'         => 1,
        ]);
        // Temporary unusable password until invite link is used
        $payload['password'] = bin2hex(random_bytes(16));

        if ($vid = $this->scoped_vendor_id()) {
            $payload['vendor_id'] = $vid;
        } elseif ($this->is_super_admin()) {
            $postedVendor = (int)$this->input->post('vendor_id');
            if ($postedVendor) {
                $payload['vendor_id'] = $postedVendor;
            }
        }

        $this->Sk_Affiliate_model->ensure_invite_schema();
        $this->Sk_Affiliate_model->ensure_identity_schema();
        $id = $this->Sk_Affiliate_model->create($payload);
        $token = $this->Sk_Affiliate_model->create_invite_token($id);
        $aff = $this->Sk_Affiliate_model->get_by_id($id);
        $sent = $this->Sk_Affiliate_model->send_invite_email($aff, $token);

        $this->activity_log->log_admin('affiliates', 'create', $id);
        $msg = 'Affiliate created. Promo: ' . $promo . '.';
        if ($sent) {
            $msg .= ' Verification link emailed — they must set a password before login.';
        } else {
            $setUrl = $this->Sk_Affiliate_model->invite_set_password_url($aff, $token);
            $msg .= ' Email not sent — check SMTP in Admin → Settings. Share this link: ' . $setUrl;
        }
        $this->session->set_flashdata('success', $msg);
        redirect('admin/affiliates/view/' . $id);
    }

    public function resend_email($id) {
        $id = (int)$id;
        $aff = $this->Sk_Affiliate_model->get_by_id($id);
        $this->assert_affiliate_access($aff);

        $result = $this->Sk_Affiliate_model->resend_notification_email($id);
        $this->activity_log->log_admin('affiliates', 'resend_email', $id);

        if ($result['sent']) {
            $this->session->set_flashdata('success', $result['message']);
        } else {
            $flash = $result['message'];
            $mailErr = trim($result['mail_error'] ?? '');
            if ($mailErr !== '') {
                $flash .= ' Detail: ' . $mailErr;
            }
            if (($result['type'] ?? '') === 'invite' && !empty($result['token']) && $aff) {
                $flash .= ' Manual link: ' . $this->Sk_Affiliate_model->invite_set_password_url($aff, $result['token']);
            }
            $this->session->set_flashdata('error', $flash);
        }

        redirect('admin/affiliates/view/' . $id);
    }

    public function view($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $data['title'] = $aff['name'];
        $data['affiliate'] = $aff;
        $data['stats'] = $this->Sk_Affiliate_model->get_dashboard_stats((int)$id);
        $data['documents'] = $this->Sk_Affiliate_model->get_kyc_documents((int)$id);
        $data['commissions'] = $this->Sk_Affiliate_model->get_commissions((int)$id, 10, 0)['rows'];
        $data['payouts'] = $this->Sk_Affiliate_model->get_payouts((int)$id, 10, 0)['rows'];
        $data['is_vendor_scope'] = (bool)$this->scoped_vendor_id();
        $this->load->helper('sk_mailer');
        $data['mail_status'] = sk_mailer_config_status();
        $this->render('affiliates/view', $data);
    }

    public function edit($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $data['title'] = 'Edit Affiliate';
        $data['affiliate'] = $aff;
        $data['is_vendor_scope'] = (bool)$this->scoped_vendor_id();
        $this->load->model('Sk_Bank_model');
        $data['banks'] = $this->Sk_Bank_model->get_all(true);
        if ($this->is_super_admin() && !$this->scoped_vendor_id()) {
            $data['vendors'] = $this->Sk_Vendor_model->get_all(['status' => 'approved'], 500, 0)['rows'] ?? [];
        }
        $this->render('affiliates/form', $data);
    }

    public function update($id) {
        $id = (int)$id;
        $aff = $this->Sk_Affiliate_model->get_by_id($id);
        $this->assert_affiliate_access($aff);

        $promo = strtoupper(trim($this->input->post('promo_code', TRUE)));
        if ($promo && !$this->Sk_Affiliate_model->is_promo_code_available($promo, $id)) {
            $this->session->set_flashdata('error', 'Promo code already exists.');
            redirect('admin/affiliates/edit/' . $id);
        }

        $payload = array_merge($this->_profile_input(), [
            'email'                     => $this->input->post('email', TRUE),
            'promo_code'                => $promo,
            'commission_rate'           => $this->input->post('commission_rate'),
            'customer_discount_percent' => $this->input->post('customer_discount_percent'),
            'discount_active'           => $this->input->post('discount_active') ? 1 : 0,
            'status'                    => $this->input->post('status'),
            'kyc_status'                => $this->input->post('kyc_status'),
            'notes'                     => $this->input->post('notes'),
            'password'                  => $this->input->post('password', TRUE),
        ]);

        if ($this->is_super_admin() && !$this->scoped_vendor_id()) {
            $postedVendor = (int)$this->input->post('vendor_id');
            $payload['vendor_id'] = $postedVendor ?: null;
        }

        $this->Sk_Affiliate_model->ensure_identity_schema();
        $this->Sk_Affiliate_model->update($id, $payload);
        $this->activity_log->log_admin('affiliates', 'update', $id);
        $this->session->set_flashdata('success', 'Affiliate updated.');
        redirect('admin/affiliates/view/' . $id);
    }

    public function delete($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $this->Sk_Affiliate_model->soft_delete((int)$id);
        $this->activity_log->log_admin('affiliates', 'delete', (int)$id);
        $this->session->set_flashdata('success', 'Affiliate removed.');
        redirect('admin/affiliates');
    }

    /** Admin/vendor auto-login into affiliate portal for this affiliate. */
    public function login_as($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $this->session->set_userdata([
            'sk_affiliate_login'         => true,
            'sk_affiliate_id'            => (int)$aff['id'],
            'sk_affiliate_name'          => $aff['name'],
            'sk_affiliate_impersonating' => true,
        ]);
        $this->activity_log->log_admin('affiliates', 'login_as', (int)$id);
        redirect('admin/affiliate/dashboard');
    }

    public function approve($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $this->Sk_Affiliate_model->update((int)$id, [
            'status'      => 'approved',
            'approved_at' => date('Y-m-d H:i:s'),
            'approved_by' => $this->admin['id'],
        ]);
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->activity_log->log_admin('affiliates', 'approve', (int)$id);
        $msg = 'Affiliate approved.';
        if ($aff && !empty($aff['must_set_password'])) {
            $token = $this->Sk_Affiliate_model->create_invite_token((int)$id);
            $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
            $sent = $this->Sk_Affiliate_model->send_invite_email($aff, $token);
            if ($sent) {
                $msg .= ' Password setup link emailed.';
            } else {
                $msg .= ' Could not send invite email — use Resend Email on the profile or check SMTP settings.';
            }
        } elseif ($aff) {
            $sent = $this->Sk_Affiliate_model->send_approved_email($aff);
            if ($sent) {
                $msg .= ' Approval email sent.';
            } else {
                $msg .= ' Could not send approval email — check SMTP settings.';
            }
        }
        $this->session->set_flashdata('success', $msg);
        redirect('admin/affiliates/view/' . $id);
    }

    public function reject($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $this->Sk_Affiliate_model->update((int)$id, ['status' => 'rejected']);
        $this->activity_log->log_admin('affiliates', 'reject', (int)$id);
        $this->session->set_flashdata('success', 'Affiliate rejected.');
        redirect('admin/affiliates');
    }

    public function verify_kyc($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $this->Sk_Affiliate_model->update((int)$id, [
            'kyc_status'      => 'verified',
            'kyc_verified_at' => date('Y-m-d H:i:s'),
        ]);
        $this->session->set_flashdata('success', 'KYC verified.');
        redirect('admin/affiliates/view/' . $id);
    }

    public function check_promo() {
        $code = strtoupper(trim($this->input->get('code', TRUE)));
        $exclude = (int)$this->input->get('exclude');
        $this->json(['available' => $this->Sk_Affiliate_model->is_promo_code_available($code, $exclude ?: null)]);
    }

    public function settings() {
        if (!$this->is_super_admin() || $this->scoped_vendor_id()) {
            show_error('Access denied.', 403);
        }
        if ($this->input->method() === 'post') {
            $this->Sk_Admin_model->save_settings([
                'affiliate_promo_discount_enabled' => $this->input->post('affiliate_promo_discount_enabled') ? '1' : '0',
            ]);
            $this->session->set_flashdata('success', 'Affiliate checkout discount settings saved.');
        }
        redirect('admin/affiliates');
    }

    public function toggle_discount($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $active = empty($aff['discount_active']) || (int)$aff['discount_active'] !== 1 ? 1 : 0;
        $this->Sk_Affiliate_model->update((int)$id, ['discount_active' => $active]);
        $this->session->set_flashdata('success', 'Checkout discount ' . ($active ? 'activated' : 'deactivated') . ' for ' . $aff['promo_code'] . '.');
        redirect('admin/affiliates');
    }

    public function export() {
        $vendorId = $this->scoped_vendor_id();
        $filters = $vendorId ? ['vendor_id' => $vendorId] : [];
        $result = $this->Sk_Affiliate_model->get_all($filters, 5000, 0);
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="affiliates_' . date('Y-m-d') . '.csv"');
        $out = fopen('php://output', 'w');
        fputcsv($out, ['ID', 'Name', 'Email', 'Phone', 'Promo', 'Status', 'KYC', 'Commission%', 'Pending', 'Paid', 'Checkout Orders']);
        foreach ($result['rows'] as $r) {
            fputcsv($out, [$r['id'], $r['name'], $r['email'], $r['phone'], $r['promo_code'], $r['status'], $r['kyc_status'],
                $r['commission_rate'], $r['pending_commission'], $r['paid_commission'], $r['total_sales']]);
        }
        fclose($out);
    }

    protected function _profile_input(): array {
        return [
            'name'                => $this->input->post('name', TRUE),
            'phone'               => $this->input->post('phone', TRUE),
            'address_line1'       => $this->input->post('address_line1', TRUE),
            'address_line2'       => $this->input->post('address_line2', TRUE),
            'city'                => $this->input->post('city', TRUE),
            'state'               => $this->input->post('state', TRUE),
            'pincode'             => $this->input->post('pincode', TRUE),
            'country'             => $this->input->post('country', TRUE) ?: 'India',
            'about'               => $this->input->post('about', TRUE),
            'mykad_number'        => $this->input->post('mykad_number', TRUE),
            'passport_number'     => $this->input->post('passport_number', TRUE),
            'bank_account_name'   => $this->input->post('bank_account_name', TRUE),
            'bank_account_number' => $this->input->post('bank_account_number', TRUE),
            'bank_name'           => $this->input->post('bank_name', TRUE),
        ];
    }
}
