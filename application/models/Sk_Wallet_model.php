<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_Wallet_model extends CI_Model {

    public function get_wallet(int $vendor_id): ?array {
        return $this->db->where('vendor_id', $vendor_id)->get('vendor_wallets')->row_array() ?: null;
    }

    public function get_transactions(int $vendor_id, int $limit = 20, int $offset = 0): array {
        $total = $this->db->where('vendor_id', $vendor_id)->count_all_results('vendor_wallet_transactions');

        $rows = $this->db->where('vendor_id', $vendor_id)
                         ->order_by('created_at', 'DESC')
                         ->limit($limit, $offset)
                         ->get('vendor_wallet_transactions')
                         ->result_array();

        return ['rows' => $rows, 'total' => $total];
    }

    public function get_all_wallets(array $filters = [], int $limit = 20, int $offset = 0): array {
        $this->db->from('vendor_wallets vw')
                 ->join('vendors v', 'v.id = vw.vendor_id', 'left')
                 ->join('vendor_stores vs', 'vs.vendor_id = v.id', 'left')
                 ->where('v.deleted_at IS NULL', null, false);
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $this->db->group_start()->like('v.business_name', $s)->or_like('vs.store_name', $s)->group_end();
        }
        $total = $this->db->count_all_results();

        $this->db->select('vw.*, v.business_name, vs.store_name')
                 ->from('vendor_wallets vw')
                 ->join('vendors v', 'v.id = vw.vendor_id', 'left')
                 ->join('vendor_stores vs', 'vs.vendor_id = v.id', 'left')
                 ->where('v.deleted_at IS NULL', null, false);
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $this->db->group_start()->like('v.business_name', $s)->or_like('vs.store_name', $s)->group_end();
        }
        $rows = $this->db->order_by('vw.balance', 'DESC')->limit($limit, $offset)->get()->result_array();
        return ['rows' => $rows, 'total' => $total];
    }

    public function add_funds(int $vendor_id, float $amount, string $description, ?int $admin_id = null, string $reference = ''): bool {
        if ($amount <= 0) return false;

        $wallet = $this->get_wallet($vendor_id);
        if (!$wallet) {
            $this->db->insert('vendor_wallets', ['vendor_id' => $vendor_id, 'balance' => 0]);
            $wallet = ['balance' => 0];
        }

        if ($reference !== '') {
            $exists = (int)$this->db->where('vendor_id', $vendor_id)
                ->where('reference', $reference)
                ->count_all_results('vendor_wallet_transactions');
            if ($exists > 0) {
                return true;
            }
        }

        $newBalance = (float)$wallet['balance'] + $amount;

        $this->db->trans_start();
        $this->db->where('vendor_id', $vendor_id)->update('vendor_wallets', ['balance' => $newBalance]);
        $this->db->insert('vendor_wallet_transactions', [
            'vendor_id'     => $vendor_id,
            'type'          => 'credit',
            'amount'        => $amount,
            'balance_after' => $newBalance,
            'reference'     => $reference ?: 'ADMIN-' . time(),
            'description'   => $description,
            'created_by'    => $admin_id,
            'created_at'    => date('Y-m-d H:i:s'),
        ]);
        $this->db->trans_complete();

        return $this->db->trans_status();
    }

    /** Credit vendor wallet for one paid order line batch (idempotent per vendor+order). */
    public function credit_order_sale(int $vendor_id, int $order_id, float $amount, string $order_number = ''): bool {
        if ($vendor_id <= 0 || $order_id <= 0 || $amount <= 0) {
            return false;
        }
        $ref = 'ORDER-' . $order_id . '-V' . $vendor_id;
        $label = $order_number !== '' ? ('Sale from order ' . $order_number) : ('Sale from order #' . $order_id);
        return $this->add_funds($vendor_id, $amount, $label, null, $ref);
    }

    /** Credit all vendors for a single paid order. */
    public function credit_order(int $order_id): void {
        if ($order_id <= 0) {
            return;
        }

        $order = $this->db->select('order_number, payment_status')
            ->where('id', $order_id)
            ->get('orders')
            ->row_array();
        if (!$order || ($order['payment_status'] ?? '') !== 'paid') {
            return;
        }

        $this->load->helper('sk_vendor_dashboard');
        sk_vendor_backfill_order_item_vendors(null);

        $rows = $this->db->query(
            'SELECT COALESCE(oi.vendor_id, p.vendor_id) AS vendor_id, SUM(oi.subtotal) AS amount
             FROM order_items oi
             LEFT JOIN products p ON p.id = oi.product_id
             WHERE oi.order_id = ?
               AND COALESCE(oi.vendor_id, p.vendor_id) IS NOT NULL
             GROUP BY COALESCE(oi.vendor_id, p.vendor_id)',
            [$order_id]
        )->result_array();

        foreach ($rows as $row) {
            $this->credit_order_sale(
                (int)$row['vendor_id'],
                $order_id,
                (float)$row['amount'],
                (string)($order['order_number'] ?? '')
            );
        }
    }

    /** Credit vendor wallets for all paid orders missing settlement entries. */
    public function sync_unsettled_sales(?int $vendor_id = null): void {
        $this->load->helper('sk_vendor_dashboard');
        sk_vendor_dashboard_ensure_schema();
        sk_vendor_backfill_order_item_vendors($vendor_id);

        $vendorFilter = $vendor_id ? ' AND COALESCE(oi.vendor_id, p.vendor_id) = ' . (int)$vendor_id : '';

        $rows = $this->db->query(
            'SELECT COALESCE(oi.vendor_id, p.vendor_id) AS vendor_id,
                    oi.order_id,
                    o.order_number,
                    SUM(oi.subtotal) AS amount
             FROM order_items oi
             INNER JOIN orders o ON o.id = oi.order_id
             LEFT JOIN products p ON p.id = oi.product_id
             WHERE o.payment_status = ?
               AND COALESCE(oi.vendor_id, p.vendor_id) IS NOT NULL
               ' . $vendorFilter . '
             GROUP BY COALESCE(oi.vendor_id, p.vendor_id), oi.order_id, o.order_number',
            ['paid']
        )->result_array();

        foreach ($rows as $row) {
            $this->credit_order_sale(
                (int)$row['vendor_id'],
                (int)$row['order_id'],
                (float)$row['amount'],
                (string)($row['order_number'] ?? '')
            );
        }
    }

    public function debit(int $vendor_id, float $amount, string $description, ?int $admin_id = null): bool {
        if ($amount <= 0) return false;
        $wallet = $this->get_wallet($vendor_id);
        if (!$wallet || (float)$wallet['balance'] < $amount) return false;

        $newBalance = (float)$wallet['balance'] - $amount;

        $this->db->trans_start();
        $this->db->where('vendor_id', $vendor_id)->update('vendor_wallets', ['balance' => $newBalance]);
        $this->db->insert('vendor_wallet_transactions', [
            'vendor_id'     => $vendor_id,
            'type'          => 'debit',
            'amount'        => $amount,
            'balance_after' => $newBalance,
            'reference'     => 'DEBIT-' . time(),
            'description'   => $description,
            'created_by'    => $admin_id,
            'created_at'    => date('Y-m-d H:i:s'),
        ]);
        $this->db->trans_complete();

        return $this->db->trans_status();
    }
}
