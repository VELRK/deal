<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Royalty points — separate from wallet cash.
 * Earn after paid/COD orders; redeem like a coupon (min 100 pts).
 * Rate: 1 point per RM 1 spent → RM 500 = 500 pts = RM 100 credit
 * (redeem value uses wallet_points_per_rm, default 5 pts / RM).
 */
function sk_royalty_ensure_schema() {
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    $CI =& get_instance();
    if (!isset($CI->db)) {
        $CI->load->database();
    }

    $cols = [
        'royalty_earned_points' => 'INT NOT NULL DEFAULT 0',
        'royalty_earned_rm'     => 'DECIMAL(12,2) NOT NULL DEFAULT 0.00',
        'royalty_used_points'   => 'INT NOT NULL DEFAULT 0',
        'royalty_used_rm'       => 'DECIMAL(12,2) NOT NULL DEFAULT 0.00',
    ];
    foreach ($cols as $col => $def) {
        if (!$CI->db->field_exists($col, 'orders')) {
            $CI->db->query("ALTER TABLE `orders` ADD COLUMN `{$col}` {$def}");
        }
    }

    if (!$CI->db->table_exists('customer_royalty')) {
        $CI->db->query("CREATE TABLE `customer_royalty` (
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            `user_id` INT UNSIGNED NOT NULL,
            `points_balance` INT NOT NULL DEFAULT 0,
            `created_at` DATETIME NULL,
            `updated_at` DATETIME NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `user_id` (`user_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    }

    if (!$CI->db->table_exists('customer_royalty_transactions')) {
        $CI->db->query("CREATE TABLE `customer_royalty_transactions` (
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            `user_id` INT UNSIGNED NOT NULL,
            `type` ENUM('earn','redeem') NOT NULL,
            `points` INT NOT NULL DEFAULT 0,
            `amount_rm` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
            `balance_after_points` INT NOT NULL DEFAULT 0,
            `reference` VARCHAR(100) NULL,
            `description` VARCHAR(255) NULL,
            `order_id` INT UNSIGNED NULL,
            `created_at` DATETIME NULL,
            PRIMARY KEY (`id`),
            KEY `user_id` (`user_id`),
            KEY `reference` (`reference`),
            KEY `type` (`type`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    }

    $defaults = [
        'royalty_enabled'           => '1',
        'royalty_min_redeem_points' => '100',
        'royalty_earn_points_per_rm'=> '1',
    ];
    $hasGroup = $CI->db->field_exists('group', 'settings');
    foreach ($defaults as $key => $value) {
        if ((int)$CI->db->where('key', $key)->count_all_results('settings') > 0) {
            continue;
        }
        $row = ['key' => $key, 'value' => $value];
        if ($hasGroup) {
            $row['group'] = 'wallet';
        }
        $CI->db->insert('settings', $row);
    }

    sk_royalty_migrate_wallet_credits();
}

/**
 * One-time: move legacy royalty_earn wallet credits into royalty ledger and reverse wallet RM.
 */
function sk_royalty_migrate_wallet_credits() {
    $CI =& get_instance();
    $flag = $CI->db->where('key', 'royalty_wallet_migrated')->get('settings')->row_array();
    if (($flag['value'] ?? '') === '1') {
        return;
    }

    if (!$CI->db->table_exists('customer_wallet_transactions')
        || !$CI->db->table_exists('customer_royalty_transactions')) {
        return;
    }

    $CI->load->model(['Sk_Royalty_model', 'Sk_Customer_wallet_model']);

    $rows = $CI->db->where('source', 'royalty_earn')
        ->order_by('id', 'ASC')
        ->get('customer_wallet_transactions')
        ->result_array();

    foreach ($rows as $tx) {
        $userId = (int)$tx['user_id'];
        $amountRm = round((float)$tx['amount'], 2);
        $ref = (string)($tx['reference'] ?? '');
        if ($userId < 1 || $amountRm <= 0 || $ref === '') {
            continue;
        }

        $points = 0;
        if (preg_match('/Royalty earn\s+(\d+)\s+pts/i', (string)($tx['description'] ?? ''), $m)) {
            $points = (int)$m[1];
        }
        if ($points < 1) {
            $points = $CI->Sk_Royalty_model->rm_to_points($amountRm);
        }

        $orderId = 0;
        if (preg_match('/ORD-(\d+)/', $ref, $om)) {
            $orderId = (int)$om[1];
        }

        $already = $CI->db->where('user_id', $userId)
            ->where('reference', $ref)
            ->where('type', 'earn')
            ->count_all_results('customer_royalty_transactions');
        if ($already < 1) {
            $CI->Sk_Royalty_model->credit(
                $userId,
                $points,
                $amountRm,
                $ref,
                $tx['description'] ?: ('Royalty earn ' . $points . ' pts'),
                $orderId
            );
        }

        // Reverse from wallet once
        $revRef = $ref . '-UNWALLET';
        $revExists = $CI->db->where('user_id', $userId)
            ->where('reference', $revRef)
            ->count_all_results('customer_wallet_transactions');
        if ($revExists < 1) {
            $wallet = $CI->Sk_Customer_wallet_model->get_wallet($userId);
            $newBal = round(max(0, (float)$wallet['balance'] - $amountRm), 2);
            $CI->db->where('user_id', $userId)->update('customer_wallets', [
                'balance'    => $newBal,
                'updated_at' => date('Y-m-d H:i:s'),
            ]);
            $CI->db->insert('customer_wallet_transactions', [
                'wallet_id'     => $wallet['id'],
                'user_id'       => $userId,
                'type'          => 'debit',
                'amount'        => $amountRm,
                'balance_after' => $newBal,
                'source'        => 'adjustment',
                'reference'     => $revRef,
                'description'   => 'Royalty points moved out of wallet (separate royalty ledger)',
                'created_at'    => date('Y-m-d H:i:s'),
            ]);
        }
    }

    $hasGroup = $CI->db->field_exists('group', 'settings');
    if ($flag) {
        $CI->db->where('key', 'royalty_wallet_migrated')->update('settings', ['value' => '1']);
    } else {
        $ins = ['key' => 'royalty_wallet_migrated', 'value' => '1'];
        if ($hasGroup) {
            $ins['group'] = 'wallet';
        }
        $CI->db->insert('settings', $ins);
    }
}

function sk_royalty_enabled(array $settings = null): bool {
    if ($settings === null) {
        $CI =& get_instance();
        $CI->load->model('Sk_Admin_model');
        $settings = $CI->Sk_Admin_model->get_settings();
    }
    return ($settings['royalty_enabled'] ?? '1') !== '0';
}

function sk_royalty_min_redeem_points(array $settings = null): int {
    if ($settings === null) {
        $CI =& get_instance();
        $CI->load->model('Sk_Admin_model');
        $settings = $CI->Sk_Admin_model->get_settings();
    }
    $n = (int)($settings['royalty_min_redeem_points'] ?? 100);
    return $n > 0 ? $n : 100;
}

/** Points earned for a purchase amount (RM). Default 1 pt per RM. */
function sk_royalty_earn_points_for_amount(float $purchaseRm, array $settings = null): int {
    if ($settings === null) {
        $CI =& get_instance();
        $CI->load->model('Sk_Admin_model');
        $settings = $CI->Sk_Admin_model->get_settings();
    }
    $rate = (float)($settings['royalty_earn_points_per_rm'] ?? 1);
    if ($rate <= 0) {
        $rate = 1;
    }
    return (int)floor(max(0, $purchaseRm) * $rate);
}

/**
 * Credit royalty after order is paid. Idempotent. Does NOT touch wallet.
 * @return array{success:bool,points?:int,rm?:float,message?:string}
 */
function sk_royalty_credit_for_order(array $order): array {
    sk_royalty_ensure_schema();
    $CI =& get_instance();
    $CI->load->model(['Sk_Royalty_model', 'Sk_Admin_model']);
    $settings = $CI->Sk_Admin_model->get_settings();

    if (!sk_royalty_enabled($settings)) {
        return ['success' => false, 'message' => 'Royalty disabled.'];
    }

    $orderId = (int)($order['id'] ?? 0);
    $userId  = (int)($order['user_id'] ?? 0);
    if ($orderId < 1 || $userId < 1) {
        return ['success' => false, 'message' => 'Invalid order.'];
    }
    if (($order['payment_status'] ?? '') !== 'paid'
        && strtolower((string)($order['payment_method'] ?? '')) !== 'cod') {
        return ['success' => false, 'message' => 'Order not paid yet.'];
    }

    $ref = 'ORD-' . $orderId . '-ROYALTY';
    $exists = $CI->db->where('user_id', $userId)
        ->where('reference', $ref)
        ->where('type', 'earn')
        ->count_all_results('customer_royalty_transactions');
    if ($exists > 0 || (int)($order['royalty_earned_points'] ?? 0) > 0) {
        return [
            'success' => true,
            'points'  => (int)($order['royalty_earned_points'] ?? 0),
            'rm'      => (float)($order['royalty_earned_rm'] ?? 0),
            'message' => 'Already credited.',
        ];
    }

    $purchaseRm = round((float)($order['total'] ?? 0), 2);
    $points = sk_royalty_earn_points_for_amount($purchaseRm, $settings);
    if ($points < 1) {
        return ['success' => true, 'points' => 0, 'rm' => 0.0, 'message' => 'No points for this amount.'];
    }

    $rm = $CI->Sk_Royalty_model->points_to_rm($points);
    if ($rm <= 0) {
        return ['success' => false, 'message' => 'Invalid conversion.'];
    }

    $ok = $CI->Sk_Royalty_model->credit(
        $userId,
        $points,
        $rm,
        $ref,
        'Royalty earn ' . $points . ' pts (RM ' . number_format($rm, 2) . ') for order #' . $orderId,
        $orderId
    );
    if (!$ok) {
        return ['success' => false, 'message' => 'Credit failed.'];
    }

    $CI->db->where('id', $orderId)->update('orders', [
        'royalty_earned_points' => $points,
        'royalty_earned_rm'     => $rm,
    ]);

    return ['success' => true, 'points' => $points, 'rm' => $rm, 'message' => 'Royalty credited.'];
}
