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
