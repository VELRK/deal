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
        $this->db->where('user_id', $userId);
        $this->apply_completed_transactions_scope();
        $total = $this->db->count_all_results('customer_wallet_transactions');
        $this->db->where('user_id', $userId);
        $this->apply_completed_transactions_scope();
        $rows = $this->db->order_by('created_at', 'DESC')
            ->limit($limit, $offset)
            ->get('customer_wallet_transactions')
            ->result_array();
        return ['rows' => $rows, 'total' => $total];
    }

    /** Hide in-progress top-ups from customer history. */
    private function apply_completed_transactions_scope(): void {
        $this->db->where('source !=', 'topup_pending');
        $this->db->not_like('description', 'Pending Razorpay', 'after');
        $this->db->not_like('description', 'Pending ToyyibPay', 'after');
    }

    /** Match pending top-up rows even if legacy ENUM stored an empty source. */
    private function apply_pending_topup_scope(): void {
        $this->db->group_start()
            ->where('source', 'topup_pending')
            ->or_group_start()
                ->like('description', 'Pending Razorpay', 'after')
                ->or_like('description', 'Pending ToyyibPay', 'after')
            ->group_end()
        ->group_end();
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

    /** Credit wallet back when a pending split-payment order is cancelled. */
    public function refund_order_payment(int $userId, int $orderId, float $amount): bool {
        if ($amount <= 0) {
            return true;
        }

        $refundRef = 'ORD-' . $orderId . '-REFUND';
        $already = $this->db->where('user_id', $userId)
            ->where('reference', $refundRef)
            ->count_all_results('customer_wallet_transactions');
        if ($already > 0) {
            return true;
        }

        $wallet = $this->get_wallet($userId);
        if (!$wallet) {
            return false;
        }

        $newBal = round((float)$wallet['balance'] + $amount, 2);

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
            'source'        => 'refund',
            'reference'     => $refundRef,
            'description'   => 'Wallet refund for cancelled order #' . $orderId,
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

    /** Use stored customer wallet balance; repair from latest ledger row if drifted. */
    public function resolve_wallet_balance(int $userId): float {
        $wallet = $this->get_wallet($userId);
        $stored = round((float)$wallet['balance'], 2);

        $this->db->where('user_id', $userId);
        $this->apply_completed_transactions_scope();
        $last = $this->db->select('balance_after')
            ->order_by('created_at', 'DESC')
            ->order_by('id', 'DESC')
            ->limit(1)
            ->get('customer_wallet_transactions')
            ->row_array();

        if ($last !== null) {
            $ledger = round((float)$last['balance_after'], 2);
            if (abs($ledger - $stored) > 0.001) {
                $this->db->where('user_id', $userId)->update('customer_wallets', [
                    'balance'    => $ledger,
                    'updated_at' => date('Y-m-d H:i:s'),
                ]);
                return $ledger;
            }
        }

        return $stored;
    }

    public function get_checkout_info(int $userId): array {
        $balanceRm = $this->resolve_wallet_balance($userId);
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
        $CI->load->helper('sk_isms');
        $user = $CI->Sk_User_model->get_by_id($userId);
        $contact = sk_razorpay_contact($user['phone'] ?? '', $settings);
        if ($contact === '') {
            return ['error' => 'A valid Malaysian mobile number is required for Curlec payment. Update your profile phone (e.g. 0123456789).'];
        }

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
        $email = sk_razorpay_prefill_email($user['email'] ?? '');
        $prefill = [
            'name'    => $user['name'] ?? 'Customer',
            'contact' => $contact,
        ];
        if ($email !== '') {
            $prefill['email'] = $email;
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

    public function complete_topup_by_reference(string $ref, ?int $userId = null): bool {
        if ($this->is_topup_completed($ref, (int)($userId ?? 0))) {
            return true;
        }

        $this->db->where('reference', $ref);
        if ($userId !== null) {
            $this->db->where('user_id', $userId);
        }
        $this->apply_pending_topup_scope();
        $pending = $this->db->order_by('id', 'DESC')->get('customer_wallet_transactions')->row_array();
        if (!$pending) {
            return false;
        }

        $refToCredit = $pending['reference'] ?? $ref;
        if (!$this->credit_topup((int)$pending['user_id'], (float)$pending['amount'], $refToCredit, 'topup')) {
            return false;
        }

        $this->db->where('id', $pending['id'])->delete('customer_wallet_transactions');
        return true;
    }

    public function find_topup_pending(string $ref, int $userId, string $rzpOrderId = ''): ?array {
        $this->db->where('reference', $ref)
            ->where('user_id', $userId);
        $this->apply_pending_topup_scope();
        $pending = $this->db->order_by('id', 'DESC')
            ->get('customer_wallet_transactions')
            ->row_array();
        if ($pending) {
            return $pending;
        }

        if ($rzpOrderId !== '') {
            $pending = $this->db->where('user_id', $userId)
                ->like('description', 'Pending Razorpay ' . $rzpOrderId, 'after')
                ->order_by('id', 'DESC')
                ->get('customer_wallet_transactions')
                ->row_array();
            if ($pending) {
                return $pending;
            }
        }

        return null;
    }

    public function is_topup_completed(string $ref, int $userId): bool {
        $this->db->where('reference', $ref);
        if ($userId > 0) {
            $this->db->where('user_id', $userId);
        }
        $this->db->group_start()
            ->where_in('source', ['topup', 'topup_sandbox'])
            ->or_like('description', 'Wallet recharge RM', 'after')
        ->group_end();
        return $this->db->count_all_results('customer_wallet_transactions') > 0;
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
