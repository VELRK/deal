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

    public function get_checkout_info(int $userId): array {
        $wallet = $this->get_wallet($userId);
        return [
            'enabled'           => $this->is_enabled(),
            'balance'           => (float)$wallet['balance'],
            'discount_percent'  => $this->get_wallet_discount_percent(),
        ];
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
}
