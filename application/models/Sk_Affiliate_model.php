<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Affiliate_model extends CI_Model {

    protected $table = 'affiliates';

    public function get_all(array $filters = [], int $limit = 20, int $offset = 0): array {
        $this->_apply_filters($filters);
        $this->db->where('deleted_at IS NULL', null, false);
        $total = $this->db->count_all_results($this->table);

        $this->db->reset_query();
        $this->_apply_filters($filters);
        $this->db->where('deleted_at IS NULL', null, false);
        $rows = $this->db->order_by('created_at', 'DESC')->limit($limit, $offset)->get($this->table)->result_array();

        return ['rows' => $rows, 'total' => $total];
    }

    protected function _apply_filters(array $filters): void {
        if (!empty($filters['vendor_id'])) {
            $this->db->where('vendor_id', (int)$filters['vendor_id']);
        }
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $this->db->group_start()
                     ->like('name', $s)->or_like('email', $s)
                     ->or_like('phone', $s)->or_like('promo_code', $s)
                     ->group_end();
        }
        if (!empty($filters['status'])) {
            $this->db->where('status', $filters['status']);
        }
        if (!empty($filters['kyc_status'])) {
            $this->db->where('kyc_status', $filters['kyc_status']);
        }
    }

    public function get_by_id(int $id): ?array {
        return $this->db->where('id', $id)->where('deleted_at IS NULL', null, false)->get($this->table)->row_array() ?: null;
    }

    public function get_by_email(string $email): ?array {
        return $this->db->where('email', $email)->where('deleted_at IS NULL', null, false)->get($this->table)->row_array() ?: null;
    }

    public function get_by_promo(string $code): ?array {
        return $this->db->where('promo_code', strtoupper(trim($code)))->where('deleted_at IS NULL', null, false)->get($this->table)->row_array() ?: null;
    }

    public function generate_promo_code(string $name, string $phone): string {
        $letters = preg_replace('/[^a-zA-Z]/', '', $name);
        $four    = strtoupper(substr($letters, 0, 4));
        if (strlen($four) < 4) {
            $four = str_pad($four, 4, 'X');
        }
        $digits = preg_replace('/\D/', '', $phone);
        $last4  = substr($digits, -4) ?: '0000';
        return $four . $last4;
    }

    public function is_promo_code_available(string $code, ?int $excludeAffiliateId = null): bool {
        $code = strtoupper(trim($code));
        if ($code === '') return false;

        $this->db->where('promo_code', $code)->where('deleted_at IS NULL', null, false);
        if ($excludeAffiliateId) {
            $this->db->where('id !=', $excludeAffiliateId);
        }
        if ($this->db->count_all_results($this->table) > 0) {
            return false;
        }

        if ($this->db->table_exists('promo_codes')) {
            $exists = $this->db->where('code', $code)->count_all_results('promo_codes');
            if ($exists > 0) return false;
        }
        return true;
    }

    public function create(array $data): int {
        if (empty($data['uuid'])) {
            $data['uuid'] = sprintf('%s-%s-%s-%s-%s',
                bin2hex(random_bytes(4)), bin2hex(random_bytes(2)),
                bin2hex(random_bytes(2)), bin2hex(random_bytes(2)), bin2hex(random_bytes(6)));
        }
        if (empty($data['promo_code'])) {
            $data['promo_code'] = $this->generate_promo_code($data['name'], $data['phone']);
        }
        $data['promo_code'] = strtoupper(trim($data['promo_code']));
        if (!$this->is_promo_code_available($data['promo_code'])) {
            $data['promo_code'] .= substr((string)time(), -2);
        }
        if (!empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        }
        $data['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert($this->table, $data);
        return (int)$this->db->insert_id();
    }

    public function update(int $id, array $data): bool {
        if (isset($data['password']) && $data['password'] !== '') {
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
        } else {
            unset($data['password']);
        }
        if (isset($data['promo_code'])) {
            $data['promo_code'] = strtoupper(trim($data['promo_code']));
        }
        $data['updated_at'] = date('Y-m-d H:i:s');
        return $this->db->where('id', $id)->update($this->table, $data);
    }

    public function verify_password(string $plain, string $hash): bool {
        return password_verify($plain, $hash);
    }

    /** Fields affiliate can update from their portal. */
    public function profile_editable_fields(): array {
        return [
            'name', 'phone', 'address_line1', 'address_line2', 'city', 'state',
            'pincode', 'country', 'about',
            'bank_account_name', 'bank_account_number', 'bank_ifsc', 'bank_name',
        ];
    }

    public function update_profile(int $id, array $data): bool {
        $allowed = array_flip($this->profile_editable_fields());
        $filtered = array_intersect_key($data, $allowed);
        if (empty($filtered)) return false;
        return $this->update($id, $filtered);
    }

    public function set_reset_code(string $email): ?string {
        $aff = $this->get_by_email($email);
        if (!$aff) return null;
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $this->db->where('id', $aff['id'])->update($this->table, [
            'reset_token'   => $code,
            'reset_expires' => date('Y-m-d H:i:s', strtotime('+15 minutes')),
            'updated_at'    => date('Y-m-d H:i:s'),
        ]);
        return $code;
    }

    public function verify_reset_code(string $email, string $code): ?string {
        $aff = $this->db->where('email', $email)
            ->where('reset_token', $code)
            ->where('reset_expires >', date('Y-m-d H:i:s'))
            ->where('deleted_at IS NULL', null, false)
            ->get($this->table)->row_array();
        if (!$aff) return null;

        $token = bin2hex(random_bytes(32));
        $this->db->where('id', $aff['id'])->update($this->table, [
            'reset_token'   => $token,
            'reset_expires' => date('Y-m-d H:i:s', strtotime('+30 minutes')),
            'updated_at'    => date('Y-m-d H:i:s'),
        ]);
        return $token;
    }

    public function reset_password_with_token(string $email, string $token, string $password): bool {
        if (strlen($token) <= 6 || ctype_digit($token)) return false;

        $aff = $this->db->where('email', $email)
            ->where('reset_token', $token)
            ->where('reset_expires >', date('Y-m-d H:i:s'))
            ->where('deleted_at IS NULL', null, false)
            ->get($this->table)->row_array();
        if (!$aff) return false;

        $this->db->where('id', $aff['id'])->update($this->table, [
            'password'      => password_hash($password, PASSWORD_BCRYPT),
            'reset_token'   => null,
            'reset_expires' => null,
            'updated_at'    => date('Y-m-d H:i:s'),
        ]);
        return true;
    }

    public function send_password_reset_email(array $affiliate, string $code): bool {
        $this->load->model('Sk_Admin_model');
        $this->load->helper('sk_mailer');
        $settings = $this->Sk_Admin_model->get_settings();
        return sk_mail_password_reset_code(
            ['email' => $affiliate['email'], 'name' => $affiliate['name']],
            $code,
            $settings,
            'Affiliate Portal'
        );
    }

    public function status_counts(?int $vendorId = null): array {
        $this->db->select('status, COUNT(*) as cnt')
            ->where('deleted_at IS NULL', null, false);
        if ($vendorId) {
            $this->db->where('vendor_id', $vendorId);
        }
        $rows = $this->db->group_by('status')->get($this->table)->result_array();
        $counts = ['pending' => 0, 'approved' => 0, 'rejected' => 0, 'suspended' => 0];
        foreach ($rows as $r) {
            $counts[$r['status']] = (int)$r['cnt'];
        }
        $counts['total'] = array_sum($counts);
        return $counts;
    }

    public function get_dashboard_stats(int $affiliateId): array {
        $aff = $this->get_by_id($affiliateId);

        $commissions = $this->db->where('affiliate_id', $affiliateId)->get('affiliate_commissions')->result_array();
        $confirmed = array_filter($commissions, fn($c) => in_array($c['status'], ['confirmed', 'paid'], true));
        $salesTotal = array_sum(array_column($confirmed, 'order_total'));
        $commTotal  = array_sum(array_column($confirmed, 'commission_amount'));

        return [
            'checkout_orders'    => count($confirmed),
            'total_sales'        => count($confirmed),
            'sales_amount'       => $salesTotal,
            'total_commission'   => (float)($aff['total_commission'] ?? $commTotal),
            'pending_commission' => (float)($aff['pending_commission'] ?? 0),
            'paid_commission'    => (float)($aff['paid_commission'] ?? 0),
            'promo_code'         => $aff['promo_code'] ?? '',
        ];
    }

    public function get_commissions(int $affiliateId, int $limit = 20, int $offset = 0): array {
        $total = $this->db->where('affiliate_id', $affiliateId)->count_all_results('affiliate_commissions');
        $rows  = $this->db->where('affiliate_id', $affiliateId)
            ->order_by('created_at', 'DESC')->limit($limit, $offset)
            ->get('affiliate_commissions')->result_array();
        return ['rows' => $rows, 'total' => $total];
    }

    public function get_ledger(int $affiliateId, int $limit = 20, int $offset = 0): array {
        $total = $this->db->where('affiliate_id', $affiliateId)->count_all_results('affiliate_commission_ledger');
        $rows  = $this->db->where('affiliate_id', $affiliateId)
            ->order_by('created_at', 'DESC')->limit($limit, $offset)
            ->get('affiliate_commission_ledger')->result_array();
        return ['rows' => $rows, 'total' => $total];
    }

    public function get_payouts(int $affiliateId, int $limit = 20, int $offset = 0): array {
        $total = $this->db->where('affiliate_id', $affiliateId)->count_all_results('affiliate_payouts');
        $rows  = $this->db->where('affiliate_id', $affiliateId)
            ->order_by('created_at', 'DESC')->limit($limit, $offset)
            ->get('affiliate_payouts')->result_array();
        return ['rows' => $rows, 'total' => $total];
    }

    public function get_all_payouts(array $filters = [], int $limit = 20, int $offset = 0, ?int $vendorId = null): array {
        $this->_apply_payout_filters($filters, $vendorId);
        $total = $this->db->count_all_results('', false);

        $this->db->reset_query();
        $this->_apply_payout_filters($filters, $vendorId);
        $rows = $this->db->select('p.*, a.name as affiliate_name, a.email, a.promo_code, a.vendor_id')
            ->order_by('p.created_at', 'DESC')->limit($limit, $offset)
            ->get()->result_array();
        return ['rows' => $rows, 'total' => $total];
    }

    protected function _apply_payout_filters(array $filters, ?int $vendorId = null): void {
        $this->db->from('affiliate_payouts p')->join('affiliates a', 'a.id = p.affiliate_id');
        if ($vendorId) {
            $this->db->where('a.vendor_id', $vendorId);
        }
        if (!empty($filters['status'])) {
            $this->db->where('p.status', $filters['status']);
        }
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $this->db->group_start()->like('a.name', $s)->or_like('a.email', $s)->or_like('a.promo_code', $s)->group_end();
        }
    }

    public function get_payout_by_id(int $id): ?array {
        return $this->db->select('p.*, a.name as affiliate_name, a.email, a.promo_code, a.vendor_id')
            ->from('affiliate_payouts p')
            ->join('affiliates a', 'a.id = p.affiliate_id')
            ->where('p.id', $id)
            ->get()->row_array() ?: null;
    }

    public function payout_belongs_to_vendor(array $payout, int $vendorId): bool {
        return (int)($payout['vendor_id'] ?? 0) === $vendorId;
    }

    public function get_payouts_in_period(?int $vendorId, string $from, string $to): array {
        $this->db->select('p.*, a.name, a.promo_code, a.email')
            ->from('affiliate_payouts p')
            ->join('affiliates a', 'a.id = p.affiliate_id')
            ->where("DATE(p.created_at) BETWEEN '$from' AND '$to'", null, false);
        if ($vendorId) {
            $this->db->where('a.vendor_id', $vendorId);
        }
        return $this->db->order_by('p.created_at', 'DESC')->get()->result_array();
    }

    public function get_min_payout(): float {
        $row = $this->db->where('key', 'affiliate_min_payout')->get('settings')->row_array();
        return (float)($row['value'] ?? 100);
    }

    public function next_payout_thursday(): string {
        $d = new DateTime('now');
        $d->modify('next thursday');
        return $d->format('Y-m-d');
    }

    public function request_payout(int $affiliateId, ?float $amount = null): array {
        $aff = $this->get_by_id($affiliateId);
        if (!$aff || $aff['status'] !== 'approved') {
            return ['ok' => false, 'message' => 'Account not approved.'];
        }
        if ($aff['kyc_status'] !== 'verified') {
            return ['ok' => false, 'message' => 'KYC must be verified before payout.'];
        }

        $min = $this->get_min_payout();
        $available = (float)$aff['pending_commission'];
        if ($amount === null) $amount = $available;
        if ($amount < $min) {
            return ['ok' => false, 'message' => "Minimum payout is ₹{$min}. Available: ₹{$available}"];
        }
        if ($amount > $available) {
            return ['ok' => false, 'message' => 'Amount exceeds pending commission.'];
        }

        $pending = $this->db->where('affiliate_id', $affiliateId)
            ->where_in('status', ['pending', 'approved', 'processing'])
            ->count_all_results('affiliate_payouts');
        if ($pending > 0) {
            return ['ok' => false, 'message' => 'You already have an open payout request.'];
        }

        $batch = date('Y') . '-W' . date('W') . '-THU';
        $this->db->insert('affiliate_payouts', [
            'affiliate_id'          => $affiliateId,
            'amount'                => $amount,
            'status'                => 'pending',
            'payout_batch'          => $batch,
            'scheduled_payout_date' => $this->next_payout_thursday(),
            'created_at'            => date('Y-m-d H:i:s'),
        ]);
        return ['ok' => true, 'id' => (int)$this->db->insert_id()];
    }

    public function approve_payout(int $payoutId, int $adminId, ?string $notes = null): bool {
        $p = $this->db->where('id', $payoutId)->get('affiliate_payouts')->row_array();
        if (!$p || $p['status'] !== 'pending') return false;

        $this->db->where('id', $payoutId)->update('affiliate_payouts', [
            'status'      => 'approved',
            'approved_by' => $adminId,
            'approved_at' => date('Y-m-d H:i:s'),
            'admin_notes' => $notes,
            'updated_at'  => date('Y-m-d H:i:s'),
        ]);
        return true;
    }

    public function mark_payout_paid(int $payoutId, int $adminId, string $paymentRef): bool {
        $p = $this->db->where('id', $payoutId)->get('affiliate_payouts')->row_array();
        if (!$p || !in_array($p['status'], ['approved', 'processing'], true)) return false;

        $this->db->trans_start();

        $this->db->where('id', $payoutId)->update('affiliate_payouts', [
            'status'            => 'paid',
            'payment_reference' => $paymentRef,
            'paid_at'           => date('Y-m-d H:i:s'),
            'paid_by'           => $adminId,
            'updated_at'        => date('Y-m-d H:i:s'),
        ]);

        $aff = $this->get_by_id((int)$p['affiliate_id']);
        $newPending = max(0, (float)$aff['pending_commission'] - (float)$p['amount']);
        $newPaid    = (float)$aff['paid_commission'] + (float)$p['amount'];

        $this->db->where('id', $p['affiliate_id'])->update($this->table, [
            'pending_commission' => $newPending,
            'paid_commission'    => $newPaid,
            'updated_at'         => date('Y-m-d H:i:s'),
        ]);

        $this->db->insert('affiliate_commission_ledger', [
            'affiliate_id'  => $p['affiliate_id'],
            'type'          => 'payout',
            'amount'        => -1 * (float)$p['amount'],
            'balance_after' => $newPending,
            'reference_type'=> 'payout',
            'reference_id'  => $payoutId,
            'description'   => 'Payout ' . $paymentRef,
            'created_by'    => $adminId,
            'created_at'    => date('Y-m-d H:i:s'),
        ]);

        $this->db->where('affiliate_id', $p['affiliate_id'])
            ->where('status', 'confirmed')
            ->update('affiliate_commissions', ['status' => 'paid', 'paid_at' => date('Y-m-d H:i:s'), 'payout_id' => $payoutId]);

        $this->db->trans_complete();
        return $this->db->trans_status();
    }

    public function reject_payout(int $payoutId, int $adminId, string $reason): bool {
        return $this->db->where('id', $payoutId)->where('status', 'pending')->update('affiliate_payouts', [
            'status'           => 'rejected',
            'rejection_reason' => $reason,
            'approved_by'      => $adminId,
            'updated_at'       => date('Y-m-d H:i:s'),
        ]);
    }

    public function get_kyc_documents(int $affiliateId): array {
        return $this->db->where('affiliate_id', $affiliateId)->order_by('created_at', 'DESC')
            ->get('affiliate_kyc_documents')->result_array();
    }

    public function add_kyc_document(int $affiliateId, string $type, string $path): int {
        $this->db->insert('affiliate_kyc_documents', [
            'affiliate_id' => $affiliateId,
            'doc_type'     => $type,
            'file_path'    => $path,
            'created_at'   => date('Y-m-d H:i:s'),
        ]);
        $this->db->where('id', $affiliateId)->update($this->table, [
            'kyc_status' => 'submitted',
            'kyc_submitted_at' => date('Y-m-d H:i:s'),
        ]);
        return (int)$this->db->insert_id();
    }

    public function belongs_to_vendor(array $affiliate, int $vendorId): bool {
        return (int)($affiliate['vendor_id'] ?? 0) === $vendorId;
    }

    public function ensure_vendor_affiliate_schema(): void {
        if (!$this->db->table_exists($this->table)) {
            return;
        }
        if (!$this->db->field_exists('vendor_id', $this->table)) {
            $this->db->query('ALTER TABLE `affiliates` ADD COLUMN `vendor_id` int(11) unsigned DEFAULT NULL AFTER `id`, ADD KEY `vendor_id` (`vendor_id`)');
        }
        if ($this->db->table_exists('affiliate_commissions') && !$this->db->field_exists('vendor_id', 'affiliate_commissions')) {
            $this->db->query('ALTER TABLE `affiliate_commissions` ADD COLUMN `vendor_id` int(11) unsigned DEFAULT NULL AFTER `affiliate_id`, ADD KEY `vendor_id` (`vendor_id`)');
        }
        if ($this->db->table_exists('affiliate_clicks') && !$this->db->field_exists('vendor_id', 'affiliate_clicks')) {
            $this->db->query('ALTER TABLE `affiliate_clicks` ADD COLUMN `vendor_id` int(11) unsigned DEFAULT NULL AFTER `affiliate_id`, ADD KEY `vendor_id` (`vendor_id`)');
        }

        if ($this->db->field_exists('vendor_id', 'affiliate_commissions')) {
            $this->db->query(
                'UPDATE affiliate_commissions c
                 INNER JOIN affiliates a ON a.id = c.affiliate_id
                 SET c.vendor_id = a.vendor_id
                 WHERE c.vendor_id IS NULL AND a.vendor_id IS NOT NULL'
            );
        }
        if ($this->db->field_exists('vendor_id', 'affiliate_clicks')) {
            $this->db->query(
                'UPDATE affiliate_clicks c
                 INNER JOIN affiliates a ON a.id = c.affiliate_id
                 SET c.vendor_id = a.vendor_id
                 WHERE c.vendor_id IS NULL AND a.vendor_id IS NOT NULL'
            );
        }
    }

    public function soft_delete(int $id): bool {
        return $this->db->where('id', $id)->update($this->table, [
            'status'     => 'suspended',
            'deleted_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ]);
    }

    public function report_stats(?string $from = null, ?string $to = null, ?int $vendorId = null): array {
        $from = $from ?: date('Y-m-01');
        $to   = $to ?: date('Y-m-d');

        $this->db->where('deleted_at IS NULL', null, false);
        if ($vendorId) {
            $this->db->where('vendor_id', $vendorId);
        }
        $affiliates = (int)$this->db->count_all_results($this->table);

        $this->db->where('status', 'approved')->where('deleted_at IS NULL', null, false);
        if ($vendorId) {
            $this->db->where('vendor_id', $vendorId);
        }
        $approved = (int)$this->db->count_all_results($this->table);

        $this->db->from('affiliate_commissions c');
        if ($vendorId) {
            $this->db->where('c.vendor_id', $vendorId);
        }
        $this->db->where("DATE(c.created_at) BETWEEN '$from' AND '$to'", null, false);
        $comm = $this->db->get()->result_array();
        $confirmed = array_filter($comm, fn($c) => in_array($c['status'], ['confirmed', 'paid'], true));
        $checkoutOrders = count($confirmed);

        $this->db->from('affiliate_payouts p')
            ->join('affiliates a', 'a.id = p.affiliate_id')
            ->where('p.status', 'paid')
            ->where("DATE(p.paid_at) BETWEEN '$from' AND '$to'", null, false);
        if ($vendorId) {
            $this->db->where('a.vendor_id', $vendorId);
        }
        $paidOut = (float)($this->db->select_sum('p.amount')->get()->row()->amount ?? 0);

        return [
            'total_affiliates'    => $affiliates,
            'approved_affiliates' => $approved,
            'checkout_orders'     => $checkoutOrders,
            'conversions'         => $checkoutOrders,
            'commission_earned'   => array_sum(array_column($confirmed, 'commission_amount')),
            'sales_amount'        => array_sum(array_column($confirmed, 'order_total')),
            'payouts_paid'        => $paidOut,
        ];
    }

    public function platform_report_stats(?string $from = null, ?string $to = null): array {
        return $this->report_stats($from, $to, null);
    }

    public function get_top_affiliates(?int $vendorId = null, int $limit = 10, ?string $from = null, ?string $to = null): array {
        $from = $from ?: date('Y-m-01');
        $to   = $to ?: date('Y-m-d');

        $this->db->select('a.id, a.name, a.promo_code, a.total_sales, a.total_commission, a.pending_commission')
            ->from('affiliates a')
            ->where('a.deleted_at IS NULL', null, false);
        if ($vendorId) {
            $this->db->where('a.vendor_id', $vendorId);
        }
        return $this->db->order_by('a.total_commission', 'DESC')->limit($limit)->get()->result_array();
    }

    public function get_daily_checkouts(?int $vendorId = null, ?string $from = null, ?string $to = null): array {
        $from = $from ?: date('Y-m-01');
        $to   = $to ?: date('Y-m-d');

        $sql = "SELECT DATE(c.created_at) AS d, COUNT(*) AS cnt
                FROM affiliate_commissions c
                WHERE DATE(c.created_at) BETWEEN ? AND ?
                AND c.status IN ('confirmed','paid')";
        $params = [$from, $to];
        if ($vendorId) {
            $sql .= ' AND c.vendor_id = ?';
            $params[] = $vendorId;
        }
        $sql .= ' GROUP BY DATE(c.created_at) ORDER BY d';
        return $this->db->query($sql, $params)->result_array();
    }

    /** @deprecated Use get_daily_checkouts — affiliate tracking is checkout promo based. */
    public function get_daily_clicks(?int $vendorId = null, ?string $from = null, ?string $to = null): array {
        return $this->get_daily_checkouts($vendorId, $from, $to);
    }

    public function get_report_sales(?int $vendorId = null, ?string $from = null, ?string $to = null, int $limit = 50): array {
        $from = $from ?: date('Y-m-01');
        $to   = $to ?: date('Y-m-d');

        $this->db->select('c.order_id, c.order_total, c.commission_amount, c.status, c.created_at, a.name AS affiliate_name, a.promo_code')
            ->from('affiliate_commissions c')
            ->join('affiliates a', 'a.id = c.affiliate_id')
            ->where("DATE(c.created_at) BETWEEN '$from' AND '$to'", null, false)
            ->where_in('c.status', ['confirmed', 'paid']);
        if ($vendorId) {
            $this->db->where('c.vendor_id', $vendorId);
        }
        return $this->db->order_by('c.created_at', 'DESC')->limit($limit)->get()->result_array();
    }

    public function get_report_commissions(?int $vendorId = null, ?string $from = null, ?string $to = null, int $limit = 50): array {
        $from = $from ?: date('Y-m-01');
        $to   = $to ?: date('Y-m-d');

        $this->db->select('c.*, a.name AS affiliate_name, a.promo_code, a.commission_rate AS affiliate_rate')
            ->from('affiliate_commissions c')
            ->join('affiliates a', 'a.id = c.affiliate_id')
            ->where("DATE(c.created_at) BETWEEN '$from' AND '$to'", null, false);
        if ($vendorId) {
            $this->db->where('c.vendor_id', $vendorId);
        }
        return $this->db->order_by('c.created_at', 'DESC')->limit($limit)->get()->result_array();
    }

    public function get_report_conversions(?int $vendorId = null, ?string $from = null, ?string $to = null, int $limit = 50): array {
        $from = $from ?: date('Y-m-01');
        $to   = $to ?: date('Y-m-d');

        $this->db->select('a.id, a.name, a.promo_code, a.total_sales, a.total_commission')
            ->from('affiliates a')
            ->where('a.deleted_at IS NULL', null, false);
        if ($vendorId) {
            $this->db->where('a.vendor_id', $vendorId);
        }
        $affiliates = $this->db->order_by('a.total_sales', 'DESC')->limit($limit)->get()->result_array();

        foreach ($affiliates as &$row) {
            $this->db->from('affiliate_commissions c')
                ->where('c.affiliate_id', $row['id'])
                ->where_in('c.status', ['confirmed', 'paid'])
                ->where("DATE(c.created_at) BETWEEN '$from' AND '$to'", null, false);
            if ($vendorId) {
                $this->db->where('c.vendor_id', $vendorId);
            }
            $periodOrders = (int)$this->db->count_all_results();

            $this->db->select_sum('c.order_total')->from('affiliate_commissions c')
                ->where('c.affiliate_id', $row['id'])
                ->where_in('c.status', ['confirmed', 'paid'])
                ->where("DATE(c.created_at) BETWEEN '$from' AND '$to'", null, false);
            if ($vendorId) {
                $this->db->where('c.vendor_id', $vendorId);
            }
            $periodSalesAmount = (float)($this->db->get()->row()->order_total ?? 0);

            $row['period_checkouts'] = $periodOrders;
            $row['period_sales'] = $periodOrders;
            $row['period_sales_amount'] = $periodSalesAmount;
        }
        unset($row);

        return $affiliates;
    }

    public function get_product_requests(int $affiliateId): array {
        $this->ensure_product_requests_table();
        if (!$this->db->table_exists('affiliate_product_requests')) return [];
        return $this->db->where('affiliate_id', $affiliateId)->order_by('created_at', 'DESC')
            ->get('affiliate_product_requests')->result_array();
    }

    public function ensure_product_requests_table(): void {
        if (!$this->db->table_exists('affiliate_product_requests')) {
            $this->db->query("CREATE TABLE `affiliate_product_requests` (
                `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                `affiliate_id` int(11) unsigned NOT NULL,
                `product_id` int(11) unsigned DEFAULT NULL,
                `vendor_id` int(11) unsigned DEFAULT NULL,
                `product_name` varchar(255) DEFAULT NULL,
                `notes` text DEFAULT NULL,
                `admin_notes` text DEFAULT NULL,
                `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
                `reviewed_at` datetime DEFAULT NULL,
                `created_at` datetime NOT NULL,
                PRIMARY KEY (`id`),
                KEY `affiliate_id` (`affiliate_id`),
                KEY `vendor_id` (`vendor_id`),
                KEY `product_id` (`product_id`),
                KEY `status` (`status`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8");
            return;
        }

        if (!$this->db->field_exists('vendor_id', 'affiliate_product_requests')) {
            $this->db->query('ALTER TABLE `affiliate_product_requests` ADD COLUMN `vendor_id` int(11) unsigned DEFAULT NULL AFTER `product_id`');
        }
        if (!$this->db->field_exists('admin_notes', 'affiliate_product_requests')) {
            $this->db->query('ALTER TABLE `affiliate_product_requests` ADD COLUMN `admin_notes` text DEFAULT NULL AFTER `notes`');
        }
        if (!$this->db->field_exists('reviewed_at', 'affiliate_product_requests')) {
            $this->db->query('ALTER TABLE `affiliate_product_requests` ADD COLUMN `reviewed_at` datetime DEFAULT NULL AFTER `status`');
        }

        $this->db->query(
            'UPDATE affiliate_product_requests r
             INNER JOIN products p ON p.id = r.product_id
             SET r.vendor_id = p.vendor_id
             WHERE r.product_id IS NOT NULL AND (r.vendor_id IS NULL OR r.vendor_id = 0) AND p.vendor_id IS NOT NULL'
        );
    }

    public function get_all_product_requests(array $filters = [], ?int $vendorId = null, int $limit = 20, int $offset = 0): array {
        $this->ensure_product_requests_table();
        if (!$this->db->table_exists('affiliate_product_requests')) {
            return ['rows' => [], 'total' => 0, 'counts' => ['pending' => 0, 'approved' => 0, 'rejected' => 0]];
        }

        $this->_apply_product_request_filters($filters, $vendorId);
        $total = $this->db->count_all_results('', false);

        $this->db->reset_query();
        $this->_apply_product_request_filters($filters, $vendorId);
        $rows = $this->db->select('r.*, a.name AS affiliate_name, a.email AS affiliate_email, a.promo_code,
                p.name AS catalog_product_name, p.vendor_id AS product_vendor_id,
                v.business_name AS vendor_name')
            ->order_by('r.created_at', 'DESC')
            ->limit($limit, $offset)
            ->get()->result_array();

        $counts = ['pending' => 0, 'approved' => 0, 'rejected' => 0];
        $this->db->reset_query();
        $this->_apply_product_request_filters($filters, $vendorId);
        $this->db->select('r.status, COUNT(*) AS cnt')->group_by('r.status');
        foreach ($this->db->get()->result_array() as $row) {
            $counts[$row['status']] = (int)$row['cnt'];
        }

        return ['rows' => $rows, 'total' => $total, 'counts' => $counts];
    }

    protected function _apply_product_request_filters(array $filters, ?int $vendorId = null): void {
        $this->db->from('affiliate_product_requests r')
            ->join('affiliates a', 'a.id = r.affiliate_id', 'left')
            ->join('products p', 'p.id = r.product_id', 'left')
            ->join('vendors v', 'v.id = COALESCE(r.vendor_id, p.vendor_id)', 'left', false);

        if ($vendorId) {
            $this->db->group_start()
                ->where('r.vendor_id', $vendorId)
                ->or_where('p.vendor_id', $vendorId)
                ->group_end();
        }

        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $this->db->group_start()
                ->like('r.product_name', $s)
                ->or_like('a.name', $s)
                ->or_like('a.email', $s)
                ->or_like('a.promo_code', $s)
                ->or_like('p.name', $s)
                ->group_end();
        }
        if (!empty($filters['status'])) {
            $this->db->where('r.status', $filters['status']);
        }
    }

    public function get_product_request_by_id(int $id): ?array {
        $this->ensure_product_requests_table();
        if (!$this->db->table_exists('affiliate_product_requests')) return null;

        return $this->db->select('r.*, a.name AS affiliate_name, a.email AS affiliate_email, a.promo_code,
                p.name AS catalog_product_name, p.vendor_id AS product_vendor_id,
                v.business_name AS vendor_name')
            ->from('affiliate_product_requests r')
            ->join('affiliates a', 'a.id = r.affiliate_id', 'left')
            ->join('products p', 'p.id = r.product_id', 'left')
            ->join('vendors v', 'v.id = COALESCE(r.vendor_id, p.vendor_id)', 'left', false)
            ->where('r.id', $id)
            ->get()->row_array() ?: null;
    }

    public function product_request_belongs_to_vendor(array $request, int $vendorId): bool {
        $resolvedVendor = (int)($request['vendor_id'] ?? 0) ?: (int)($request['product_vendor_id'] ?? 0);
        return $resolvedVendor === $vendorId;
    }

    public function update_product_request_status(int $id, string $status, ?string $adminNotes = null): bool {
        $this->ensure_product_requests_table();
        if (!in_array($status, ['approved', 'rejected', 'pending'], true)) {
            return false;
        }

        $data = [
            'status'      => $status,
            'reviewed_at' => date('Y-m-d H:i:s'),
        ];
        if ($adminNotes !== null) {
            $data['admin_notes'] = $adminNotes;
        }

        $this->db->where('id', $id)->update('affiliate_product_requests', $data);
        return $this->db->affected_rows() >= 0;
    }

    public function add_product_request(int $affiliateId, array $data): int {
        $this->ensure_product_requests_table();

        $data['affiliate_id'] = $affiliateId;
        $data['status'] = 'pending';
        $data['created_at'] = date('Y-m-d H:i:s');

        if (!empty($data['product_id'])) {
            $product = $this->db->select('vendor_id, name')
                ->where('id', (int)$data['product_id'])
                ->get('products')->row_array();
            if ($product) {
                if (!empty($product['vendor_id'])) {
                    $data['vendor_id'] = (int)$product['vendor_id'];
                }
                if (empty($data['product_name'])) {
                    $data['product_name'] = $product['name'];
                }
            }
        }

        if (empty($data['product_id'])) {
            $data['product_id'] = null;
        }

        $this->db->insert('affiliate_product_requests', $data);
        return (int)$this->db->insert_id();
    }

    public function is_checkout_discount_globally_enabled(): bool {
        $row = $this->db->where('key', 'affiliate_promo_discount_enabled')->get('settings')->row_array();
        return ($row['value'] ?? '1') === '1';
    }

    /**
     * Validate affiliate promo for customer checkout discount.
     */
    public function validate_checkout_code(string $code, float $orderAmount): array {
        if (!$this->is_checkout_discount_globally_enabled()) {
            return ['valid' => false, 'message' => 'Affiliate promo discounts are currently disabled by admin.'];
        }

        $code = strtoupper(trim($code));
        if ($code === '') {
            return ['valid' => false, 'message' => 'Promo code required.'];
        }

        $aff = $this->get_by_promo($code);
        if (!$aff || $aff['status'] !== 'approved') {
            return ['valid' => false, 'message' => 'Invalid affiliate promo code.'];
        }

        if (empty($aff['discount_active']) || (int)$aff['discount_active'] !== 1) {
            return ['valid' => false, 'message' => 'This affiliate promo code is inactive for checkout.'];
        }

        $pct = (float)($aff['customer_discount_percent'] ?? 0);
        if ($pct <= 0) {
            return ['valid' => false, 'message' => 'No checkout discount configured for this code.'];
        }

        $discount = round($orderAmount * $pct / 100, 2);
        if ($discount <= 0) {
            return ['valid' => false, 'message' => 'Discount could not be calculated.'];
        }

        return [
            'valid'    => true,
            'discount' => $discount,
            'type'     => 'affiliate_percent',
            'value'    => $pct,
            'code'     => $code,
            'affiliate'=> $aff,
        ];
    }

    /**
     * Credit affiliate commission when their promo code is used at checkout.
     */
    public function record_order_commission(int $affiliateId, int $orderId, float $orderTotal, int $userId): bool {
        $aff = $this->get_by_id($affiliateId);
        if (!$aff || $aff['status'] !== 'approved') return false;

        $exists = $this->db->where('affiliate_id', $affiliateId)->where('order_id', $orderId)
            ->count_all_results('affiliate_commissions');
        if ($exists > 0) return true;

        $rate = (float)$aff['commission_rate'];
        $commission = round(max(0, $orderTotal) * $rate / 100, 2);

        $this->db->trans_start();

        $this->db->insert('affiliate_commissions', [
            'affiliate_id'      => $affiliateId,
            'vendor_id'         => !empty($aff['vendor_id']) ? (int)$aff['vendor_id'] : null,
            'order_id'          => $orderId,
            'user_id'           => $userId,
            'order_total'       => $orderTotal,
            'commission_rate'   => $rate,
            'commission_amount' => $commission,
            'status'            => 'confirmed',
            'confirmed_at'      => date('Y-m-d H:i:s'),
            'created_at'        => date('Y-m-d H:i:s'),
        ]);

        $newPending = (float)$aff['pending_commission'] + $commission;
        $newTotal   = (float)$aff['total_commission'] + $commission;
        $newSales   = (int)$aff['total_sales'] + 1;

        $this->db->where('id', $affiliateId)->update($this->table, [
            'pending_commission' => $newPending,
            'total_commission'   => $newTotal,
            'total_sales'        => $newSales,
            'updated_at'         => date('Y-m-d H:i:s'),
        ]);

        $this->db->insert('affiliate_commission_ledger', [
            'affiliate_id'  => $affiliateId,
            'type'          => 'earn',
            'amount'        => $commission,
            'balance_after' => $newPending,
            'reference_type'=> 'order',
            'reference_id'  => $orderId,
            'description'   => 'Commission order #' . $orderId,
            'created_at'    => date('Y-m-d H:i:s'),
        ]);

        $this->db->trans_complete();
        return $this->db->trans_status();
    }
}
