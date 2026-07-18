<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Customer_wallet_model extends CI_Model {

    public function get_wallet(int $userId): ?array {
        $w = $this->db->where('user_id', $userId)->get('customer_wallets')->row_array();
        if (!$w) {
            $this->db->insert('customer_wallets', [
                'user_id'    => $userId,
                'balance'    => 0,
                'created_at' => date('Y-m-d H:i:s'),
            ]);
            $w = $this->db->where('user_id', $userId)->get('customer_wallets')->row_array();
        }
        return $w;
    }

    public function get_all(array $filters = [], int $limit = 20, int $offset = 0): array {
        $this->db->from('customer_wallets cw')->join('users u', 'u.id = cw.user_id', 'left');
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $this->db->group_start()->like('u.name', $s)->or_like('u.email', $s)->or_like('u.phone', $s)->group_end();
        }
        $total = $this->db->count_all_results();

        $this->db->select('cw.*, u.name, u.email, u.phone')
            ->from('customer_wallets cw')->join('users u', 'u.id = cw.user_id', 'left');
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $this->db->group_start()->like('u.name', $s)->or_like('u.email', $s)->or_like('u.phone', $s)->group_end();
        }
        $rows = $this->db->order_by('cw.balance', 'DESC')->limit($limit, $offset)->get()->result_array();
        return ['rows' => $rows, 'total' => $total];
    }

    public function get_transactions(int $userId, int $limit = 20, int $offset = 0): array {
        $total = $this->db->where('user_id', $userId)->count_all_results('customer_wallet_transactions');
        $rows  = $this->db->where('user_id', $userId)->order_by('created_at', 'DESC')
            ->limit($limit, $offset)->get('customer_wallet_transactions')->result_array();
        return ['rows' => $rows, 'total' => $total];
    }

    public function add_funds(int $userId, float $amount, string $description, ?int $adminId = null): bool {
        if ($amount <= 0) return false;
        $wallet = $this->get_wallet($userId);
        $newBal = (float)$wallet['balance'] + $amount;

        $this->db->trans_start();
        $this->db->where('user_id', $userId)->update('customer_wallets', [
            'balance'    => $newBal,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        $this->db->insert('customer_wallet_transactions', [
            'wallet_id'     => $wallet['id'],
            'user_id'       => $userId,
            'type'          => 'credit',
            'amount'        => $amount,
            'balance_after' => $newBal,
            'source'        => 'admin_add',
            'reference'     => 'ADM-' . time(),
            'description'   => $description,
            'created_by'    => $adminId,
            'created_at'    => date('Y-m-d H:i:s'),
        ]);
        $this->db->trans_complete();
        return $this->db->trans_status();
    }

    public function get_wallet_discount_percent(): float {
        $row = $this->db->where('key', 'customer_wallet_discount_percent')->get('settings')->row_array();
        return (float)($row['value'] ?? 0);
    }

    public function is_enabled(): bool {
        $row = $this->db->where('key', 'customer_wallet_enabled')->get('settings')->row_array();
        return ($row['value'] ?? '1') === '1';
    }

    public function apply_wallet_payment(int $userId, float $amount, int $orderId, string $description = ''): bool {
        if ($amount <= 0) {
            return false;
        }

        $wallet = $this->get_wallet($userId);
        if ((float)$wallet['balance'] < $amount) {
            return false;
        }

        $newBal = (float)$wallet['balance'] - $amount;

        $this->db->trans_start();
        $this->db->where('user_id', $userId)->update('customer_wallets', [
            'balance'    => $newBal,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        $this->db->insert('customer_wallet_transactions', [
            'wallet_id'     => $wallet['id'],
            'user_id'       => $userId,
            'type'          => 'debit',
            'amount'        => $amount,
            'balance_after' => $newBal,
            'source'        => 'order_payment',
            'reference'     => 'ORD-' . $orderId,
            'description'   => $description ?: ('Order #' . $orderId),
            'created_at'    => date('Y-m-d H:i:s'),
        ]);
        $this->db->trans_complete();

        return $this->db->trans_status();
    }

    /** 500 points = 100 RM → 5 points per RM */
    public function points_per_rm(): float {
        $row = $this->db->where('key', 'wallet_points_per_rm')->get('settings')->row_array();
        $v = (float)($row['value'] ?? 5);
        return $v > 0 ? $v : 5;
    }

    public function rm_to_points(float $rm): int {
        return (int)round($rm * $this->points_per_rm());
    }

    public function points_to_rm(float $points): float {
        return round($points / $this->points_per_rm(), 2);
    }

    public function get_checkout_info(int $userId): array {
        $wallet = $this->get_wallet($userId);
        $balanceRm = (float)$wallet['balance'];
        return [
            'enabled'           => $this->is_enabled(),
            'balance'           => $balanceRm,
            'balance_rm'        => $balanceRm,
            'points'            => $this->rm_to_points($balanceRm),
            'points_per_rm'     => $this->points_per_rm(),
            'conversion_label'  => '500 points = RM 100',
            'currency'          => 'MYR',
            'currency_symbol'   => 'RM',
            'discount_percent'  => $this->get_wallet_discount_percent(),
        ];
    }

    public function create_topup_intent(int $userId, float $amountRm): ?string {
        if ($amountRm <= 0) return null;
        return 'TOPUP-' . $userId . '-' . time() . '-' . bin2hex(random_bytes(3));
    }

    public function save_topup_pending(int $userId, float $amountRm, string $ref, string $description): void {
        $wallet = $this->get_wallet($userId);
        $this->db->insert('customer_wallet_transactions', [
            'wallet_id'     => $wallet['id'],
            'user_id'       => $userId,
            'type'          => 'credit',
            'amount'        => $amountRm,
            'balance_after' => (float)$wallet['balance'],
            'source'        => 'topup_pending',
            'reference'     => $ref,
            'description'   => $description,
            'created_at'    => date('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Resolve wallet top-up gateway from admin settings.
     * @return 'razorpay'|'toyyibpay'|'sandbox'|'none'
     */
    public function resolve_topup_gateway(array $settings): string {
        $preferred = strtolower(trim($settings['payment_gateway'] ?? ''));
        $hasRzp = trim($settings['razorpay_key_id'] ?? '') !== ''
            && trim($settings['razorpay_key_secret'] ?? '') !== '';
        $hasToyyib = trim($settings['toyyibpay_secret_key'] ?? '') !== ''
            && trim($settings['toyyibpay_category_code'] ?? '') !== '';

        if ($preferred === 'razorpay' && $hasRzp) return 'razorpay';
        if ($preferred === 'toyyibpay' && $hasToyyib) return 'toyyibpay';
        if ($hasRzp) return 'razorpay';
        if ($hasToyyib) return 'toyyibpay';
        if (ENVIRONMENT !== 'production') return 'sandbox';
        return 'none';
    }

    /**
     * Create Razorpay order for wallet top-up (Malaysia checkout modal).
     */
    public function start_razorpay_topup(int $userId, float $amountRm, string $ref, array $settings): array {
        $keyId = trim($settings['razorpay_key_id'] ?? '');
        $keySecret = trim($settings['razorpay_key_secret'] ?? '');
        if (!$keyId || !$keySecret) {
            return ['error' => 'Razorpay is not configured.'];
        }

        $CI =& get_instance();
        $CI->load->model('Sk_User_model');
        $user = $CI->Sk_User_model->get_by_id($userId);
        $currency = strtoupper($settings['currency_code'] ?? 'MYR');
        if (!in_array($currency, ['MYR', 'INR', 'USD', 'SGD'], true)) {
            $currency = 'MYR';
        }

        $amountPaise = (int)round($amountRm * 100);
        $payload = json_encode([
            'amount'          => $amountPaise,
            'currency'        => $currency,
            'receipt'         => $ref,
            'payment_capture' => 1,
            'notes'           => ['type' => 'wallet_topup', 'reference' => $ref],
        ]);

        $ch = curl_init('https://api.razorpay.com/v1/orders');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_USERPWD        => $keyId . ':' . $keySecret,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT        => 30,
        ]);
        $response = curl_exec($ch);
        $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        $rzp = json_decode((string)$response, true);

        if ($httpCode !== 200 || empty($rzp['id'])) {
            log_message('error', 'Razorpay wallet topup failed: ' . $response);
            return ['error' => 'Failed to start payment. Please try again.'];
        }

        $this->save_topup_pending(
            $userId,
            $amountRm,
            $ref,
            'Pending Razorpay ' . $rzp['id']
        );

        $CI->load->helper('sk_isms');
        $contact = sk_razorpay_contact($user['phone'] ?? '', $settings);
        $email = sk_razorpay_prefill_email($user['email'] ?? '');
        $prefill = [
            'name' => $user['name'] ?? 'Customer',
        ];
        if ($email !== '') {
            $prefill['email'] = $email;
        }
        if ($contact !== '') {
            $prefill['contact'] = $contact;
        }

        return [
            'gateway'           => 'razorpay',
            'razorpay_order_id' => $rzp['id'],
            'amount'            => $amountPaise,
            'currency'          => $currency,
            'key_id'            => $keyId,
            'reference'         => $ref,
            'prefill'           => $prefill,
        ];
    }

    public function credit_topup(int $userId, float $amountRm, string $reference, string $source = 'topup'): bool {
        if ($amountRm <= 0) return false;
        $wallet = $this->get_wallet($userId);
        $newBal = (float)$wallet['balance'] + $amountRm;
        $points = $this->rm_to_points($amountRm);

        $this->db->trans_start();
        $this->db->where('user_id', $userId)->update('customer_wallets', [
            'balance'    => $newBal,
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
        $this->db->insert('customer_wallet_transactions', [
            'wallet_id'     => $wallet['id'],
            'user_id'       => $userId,
            'type'          => 'credit',
            'amount'        => $amountRm,
            'balance_after' => $newBal,
            'source'        => $source,
            'reference'     => $reference,
            'description'   => 'Wallet recharge RM ' . number_format($amountRm, 2) . ' (' . $points . ' pts)',
            'created_at'    => date('Y-m-d H:i:s'),
        ]);
        $this->db->trans_complete();
        return $this->db->trans_status();
    }

    /**
     * Start ToyyibPay bill for wallet top-up (Malaysia).
     * If gateway not configured, credits immediately in non-production.
     */
    public function start_toyyibpay_topup(int $userId, float $amountRm, string $ref): array {
        $CI =& get_instance();
        $CI->load->model('Sk_Admin_model');
        $CI->load->model('Sk_User_model');
        $settings = $CI->Sk_Admin_model->get_settings();
        $secret = trim($settings['toyyibpay_secret_key'] ?? '');
        $category = trim($settings['toyyibpay_category_code'] ?? '');
        $sandbox = ($settings['toyyibpay_sandbox'] ?? '1') === '1';
        $user = $CI->Sk_User_model->get_by_id($userId);

        if (!$secret || !$category) {
            if (ENVIRONMENT !== 'production') {
                if ($this->credit_topup($userId, $amountRm, $ref, 'topup_sandbox')) {
                    $w = $this->get_wallet($userId);
                    return ['gateway' => 'sandbox', 'credited' => true, 'balance' => (float)$w['balance']];
                }
                return ['error' => 'Top-up failed.'];
            }
            return ['error' => 'ToyyibPay is not configured. Ask admin to add payment gateway keys.'];
        }

        $apiBase = $sandbox ? 'https://dev.toyyibpay.com' : 'https://toyyibpay.com';
        $amountCent = (int)round($amountRm * 100);
        $payload = [
            'userSecretKey'           => $secret,
            'categoryCode'            => $category,
            'billName'                => 'Wallet Top-up',
            'billDescription'         => 'Wallet recharge ' . $ref,
            'billPriceSetting'        => 1,
            'billPayorInfo'           => 1,
            'billAmount'              => $amountCent,
            'billReturnUrl'           => site_url('shopkart-api/payment/toyyibpay-return'),
            'billCallbackUrl'         => site_url('shopkart-api/payment/toyyibpay-callback'),
            'billExternalReferenceNo' => $ref,
            'billTo'                  => $user['name'] ?? 'Customer',
            'billEmail'               => $user['email'] ?? '',
            'billPhone'               => $user['phone'] ?? '0000000000',
            'billPaymentChannel'      => '2', // FPX + card
            'billContentEmail'        => 'Thank you for topping up your wallet.',
        ];

        $ch = curl_init($apiBase . '/index.php/api/createBill');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($payload),
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT        => 30,
        ]);
        $response = curl_exec($ch);
        curl_close($ch);
        $json = json_decode($response, true);
        $billCode = $json[0]['BillCode'] ?? null;
        if (!$billCode) {
            log_message('error', 'ToyyibPay createBill failed: ' . $response);
            return ['error' => 'Malaysian payment gateway error. Try again later.'];
        }

        // Persist pending reference for callback
        $this->save_topup_pending($userId, $amountRm, $ref, 'Pending ToyyibPay ' . $billCode);

        return [
            'gateway'   => 'toyyibpay',
            'url'       => $apiBase . '/' . $billCode,
            'bill_code' => $billCode,
            'credited'  => false,
        ];
    }

    public function complete_topup_by_reference(string $ref): bool {
        $pending = $this->db->where('reference', $ref)->where('source', 'topup_pending')
            ->order_by('id', 'DESC')->get('customer_wallet_transactions')->row_array();
        if (!$pending) {
            // Already completed?
            $done = $this->db->where('reference', $ref)->where('source', 'topup')
                ->count_all_results('customer_wallet_transactions');
            return $done > 0;
        }
        // Remove pending marker row then credit
        $this->db->where('id', $pending['id'])->delete('customer_wallet_transactions');
        return $this->credit_topup((int)$pending['user_id'], (float)$pending['amount'], $ref, 'topup');
    }

    public function get_recharge_report(array $filters = [], int $limit = 50, int $offset = 0): array {
        $this->db->from('customer_wallet_transactions t')
            ->join('users u', 'u.id = t.user_id', 'left')
            ->where_in('t.source', ['topup', 'topup_sandbox', 'admin_add']);
        if (!empty($filters['from'])) $this->db->where('t.created_at >=', $filters['from'] . ' 00:00:00');
        if (!empty($filters['to'])) $this->db->where('t.created_at <=', $filters['to'] . ' 23:59:59');
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $this->db->group_start()->like('u.name', $s)->or_like('u.email', $s)->or_like('t.reference', $s)->group_end();
        }
        $total = $this->db->count_all_results();

        $this->db->select('t.*, u.name, u.email, u.phone')
            ->from('customer_wallet_transactions t')
            ->join('users u', 'u.id = t.user_id', 'left')
            ->where_in('t.source', ['topup', 'topup_sandbox', 'admin_add']);
        if (!empty($filters['from'])) $this->db->where('t.created_at >=', $filters['from'] . ' 00:00:00');
        if (!empty($filters['to'])) $this->db->where('t.created_at <=', $filters['to'] . ' 23:59:59');
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $this->db->group_start()->like('u.name', $s)->or_like('u.email', $s)->or_like('t.reference', $s)->group_end();
        }
        $rows = $this->db->order_by('t.created_at', 'DESC')->limit($limit, $offset)->get()->result_array();
        foreach ($rows as &$r) {
            $r['points'] = $this->rm_to_points((float)$r['amount']);
            $r['amount_rm'] = (float)$r['amount'];
        }
        return ['rows' => $rows, 'total' => $total];
    }
}
