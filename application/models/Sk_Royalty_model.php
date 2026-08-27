<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Royalty points ledger — separate from customer wallet (cash top-ups).
 * Earn: RM 5000 purchase → 500 pts (0.1 pts/RM). Redeem value uses wallet_points_per_rm (5 pts = RM 1 → 500 pts = RM 100).
 */
class Sk_Royalty_model extends CI_Model {

    public function get_account(int $userId): array {
        $row = $this->db->where('user_id', $userId)->get('customer_royalty')->row_array();
        if (!$row) {
            $this->db->insert('customer_royalty', [
                'user_id'        => $userId,
                'points_balance' => 0,
                'created_at'     => date('Y-m-d H:i:s'),
                'updated_at'     => date('Y-m-d H:i:s'),
            ]);
            $row = $this->db->where('user_id', $userId)->get('customer_royalty')->row_array();
        }
        return $row;
    }

    public function get_points(int $userId): int {
        $row = $this->get_account($userId);
        return max(0, (int)($row['points_balance'] ?? 0));
    }

    /** Conversion shared with wallet display: 5 pts = RM 1 by default. */
    public function points_per_rm(): float {
        $row = $this->db->where('key', 'wallet_points_per_rm')->get('settings')->row_array();
        $v = (float)($row['value'] ?? 5);
        return $v > 0 ? $v : 5;
    }

    public function points_to_rm(float $points): float {
        return round($points / $this->points_per_rm(), 2);
    }

    public function rm_to_points(float $rm): int {
        return (int)round($rm * $this->points_per_rm());
    }

    public function get_info(int $userId): array {
        $CI =& get_instance();
        $CI->load->helper('sk_royalty');
        $CI->load->model('Sk_Admin_model');
        $settings = $CI->Sk_Admin_model->get_settings();
        $points = $this->get_points($userId);
        $balanceRm = $this->points_to_rm($points);
        $minRedeemRm = sk_royalty_min_redeem_rm($settings);
        $minRedeemPts = sk_royalty_min_redeem_points($settings);
        $enabled = sk_royalty_enabled($settings);
        $testUnlock = sk_royalty_test_unlock($settings);
        // Production: Apply only when royalty balance is RM 100 or above (exact 100 counts).
        $canRedeem = $enabled && (
            $testUnlock
                ? ($points >= 1)
                : (round($balanceRm, 2) >= round($minRedeemRm, 2) && $points >= $minRedeemPts)
        );
        $remainingRm = $canRedeem
            ? 0.0
            : max(0, round($minRedeemRm - $balanceRm, 2));
        $hint = $canRedeem
            ? ('You have ' . $points . ' royalty points (RM ' . number_format($balanceRm, 2)
                . '). Apply on cart/checkout to pay the bill; remaining uses wallet or online.'
                . ($testUnlock ? ' [TEST: RM100 gate off]' : ''))
            : (
                $points > 0
                    ? ('You need RM ' . number_format($remainingRm, 2)
                        . ' more to unlock royalty points (min RM '
                        . number_format($minRedeemRm, 0) . ').')
                    : ('Earn royalty on every paid order (RM 5000 → 500 pts). Reach RM '
                        . number_format($minRedeemRm, 0) . ' in royalty balance to unlock Apply.')
            );
        return [
            'enabled'                 => $enabled,
            'points'                  => $points,
            'balance_rm'              => $balanceRm,
            'min_redeem_points'       => $testUnlock ? 1 : $minRedeemPts,
            'min_redeem_rm'           => $testUnlock ? 0.01 : $minRedeemRm,
            // Always expose production threshold for UI messaging (even in test mode).
            'unlock_min_rm'           => $minRedeemRm,
            'unlock_min_points'       => $minRedeemPts,
            'remaining_rm_to_unlock'  => $remainingRm,
            'can_redeem'              => $canRedeem,
            // Show the royalty card on cart/checkout even when locked (so users see progress).
            'show_on_cart'            => $enabled,
            'test_unlock'             => $testUnlock,
            'points_per_rm'           => $this->points_per_rm(),
            'conversion_label'        => '500 points = RM 100',
            'earn_label'              => 'RM 5000 purchase = 500 pts',
            'hint'                    => $hint,
        ];
    }

    public function credit(int $userId, int $points, float $amountRm, string $reference, string $description, int $orderId = 0): bool {
        if ($points < 1 || $amountRm <= 0) {
            return false;
        }
        $exists = $this->db->where('user_id', $userId)
            ->where('reference', $reference)
            ->where('type', 'earn')
            ->count_all_results('customer_royalty_transactions');
        if ($exists > 0) {
            return true;
        }

        $acc = $this->get_account($userId);
        $newBal = (int)$acc['points_balance'] + $points;

        $this->db->trans_start();
        $this->db->where('user_id', $userId)->update('customer_royalty', [
            'points_balance' => $newBal,
            'updated_at'     => date('Y-m-d H:i:s'),
        ]);
        $this->db->insert('customer_royalty_transactions', [
            'user_id'              => $userId,
            'type'                 => 'earn',
            'points'               => $points,
            'amount_rm'            => $amountRm,
            'balance_after_points' => $newBal,
            'reference'            => $reference,
            'description'          => $description,
            'order_id'             => $orderId > 0 ? $orderId : null,
            'created_at'           => date('Y-m-d H:i:s'),
        ]);
        $this->db->trans_complete();
        return $this->db->trans_status();
    }

    public function debit(int $userId, int $points, float $amountRm, string $reference, string $description, int $orderId = 0): bool {
        if ($points < 1 || $amountRm <= 0) {
            return false;
        }
        $exists = $this->db->where('user_id', $userId)
            ->where('reference', $reference)
            ->where('type', 'redeem')
            ->count_all_results('customer_royalty_transactions');
        if ($exists > 0) {
            return true; // already redeemed (idempotent)
        }

        $acc = $this->get_account($userId);
        if ((int)$acc['points_balance'] < $points) {
            return false;
        }
        $newBal = (int)$acc['points_balance'] - $points;

        $this->db->trans_start();
        $this->db->where('user_id', $userId)->update('customer_royalty', [
            'points_balance' => $newBal,
            'updated_at'     => date('Y-m-d H:i:s'),
        ]);
        $this->db->insert('customer_royalty_transactions', [
            'user_id'              => $userId,
            'type'                 => 'redeem',
            'points'               => $points,
            'amount_rm'            => $amountRm,
            'balance_after_points' => $newBal,
            'reference'            => $reference,
            'description'          => $description,
            'order_id'             => $orderId > 0 ? $orderId : null,
            'created_at'           => date('Y-m-d H:i:s'),
        ]);
        $this->db->trans_complete();
        return $this->db->trans_status();
    }

    /** True when redeem ledger row already exists for this order. */
    public function was_redeemed_for_order(int $userId, int $orderId): bool {
        if ($userId < 1 || $orderId < 1) {
            return false;
        }
        return $this->db->where('user_id', $userId)
            ->where('reference', 'ORD-' . $orderId . '-ROYALTY-REDEEM')
            ->where('type', 'redeem')
            ->count_all_results('customer_royalty_transactions') > 0;
    }

    public function get_transactions(int $userId, int $limit = 20, int $offset = 0): array {
        $total = $this->db->where('user_id', $userId)->count_all_results('customer_royalty_transactions');
        $rows = $this->db->where('user_id', $userId)
            ->order_by('created_at', 'DESC')
            ->limit($limit, $offset)
            ->get('customer_royalty_transactions')
            ->result_array();
        return ['rows' => $rows, 'total' => $total];
    }

    public function get_report(array $filters = [], int $limit = 50, int $offset = 0): array {
        $this->db->from('customer_royalty_transactions t')
            ->join('users u', 'u.id = t.user_id', 'left');
        if (!empty($filters['type']) && in_array($filters['type'], ['earn', 'redeem'], true)) {
            $this->db->where('t.type', $filters['type']);
        }
        if (!empty($filters['from'])) {
            $this->db->where('t.created_at >=', $filters['from'] . ' 00:00:00');
        }
        if (!empty($filters['to'])) {
            $this->db->where('t.created_at <=', $filters['to'] . ' 23:59:59');
        }
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $this->db->group_start()->like('u.name', $s)->or_like('u.email', $s)->or_like('t.reference', $s)->group_end();
        }
        $total = $this->db->count_all_results();

        $this->db->select('t.*, u.name, u.email, u.phone')
            ->from('customer_royalty_transactions t')
            ->join('users u', 'u.id = t.user_id', 'left');
        if (!empty($filters['type']) && in_array($filters['type'], ['earn', 'redeem'], true)) {
            $this->db->where('t.type', $filters['type']);
        }
        if (!empty($filters['from'])) {
            $this->db->where('t.created_at >=', $filters['from'] . ' 00:00:00');
        }
        if (!empty($filters['to'])) {
            $this->db->where('t.created_at <=', $filters['to'] . ' 23:59:59');
        }
        if (!empty($filters['search'])) {
            $s = $filters['search'];
            $this->db->group_start()->like('u.name', $s)->or_like('u.email', $s)->or_like('t.reference', $s)->group_end();
        }
        $rows = $this->db->order_by('t.created_at', 'DESC')->limit($limit, $offset)->get()->result_array();
        foreach ($rows as &$r) {
            $r['royalty_type'] = $r['type'];
            $r['amount_rm'] = (float)$r['amount_rm'];
            $r['balance_after'] = $this->points_to_rm((int)$r['balance_after_points']);
            $r['balance_after_points'] = (int)$r['balance_after_points'];
        }
        unset($r);

        $sumEarn = $this->db->select_sum('points')->select_sum('amount_rm')
            ->where('type', 'earn')
            ->get('customer_royalty_transactions')->row_array();
        $sumRedeem = $this->db->select_sum('points')->select_sum('amount_rm')
            ->where('type', 'redeem')
            ->get('customer_royalty_transactions')->row_array();

        return [
            'rows'  => $rows,
            'total' => $total,
            'summary' => [
                'earned_pts'   => (int)($sumEarn['points'] ?? 0),
                'earned_rm'    => round((float)($sumEarn['amount_rm'] ?? 0), 2),
                'redeemed_pts' => (int)($sumRedeem['points'] ?? 0),
                'redeemed_rm'  => round((float)($sumRedeem['amount_rm'] ?? 0), 2),
            ],
        ];
    }
}
