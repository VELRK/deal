<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Royalty points — separate from wallet cash.
 * Earn after paid/COD orders; unlock redeem when balance ≥ Rs 100 (500 pts).
 * Earn: Rs 5000 purchase → 500 pts (0.1 pts / RM). Redeem: 500 pts → Rs 100 (5 pts / RM).
 * Royalty pays toward any bill amount; remainder uses COD / online / wallet.
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
        'royalty_earned_Rs'     => 'DECIMAL(12,2) NOT NULL DEFAULT 0.00',
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
        // Redeem: 500 pts → Rs 100 (5 pts / RM) via wallet_points_per_rm
        'royalty_min_redeem_points' => '500',
        'royalty_min_redeem_rm'     => '100',
        // Earn: Rs 5000 purchase → 500 pts (0.1 pts / RM)
        'royalty_earn_points_per_rm'=> '0.1',
        // Production: RM 100 unlock gate stays ON
        'royalty_test_unlock'       => '0',
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

    // Turn off legacy QA bypass so Apply stays locked until RM 100 royalty balance.
    $testUnlockRow = $CI->db->where('key', 'royalty_test_unlock')->get('settings')->row_array();
    if ($testUnlockRow && (string)($testUnlockRow['value'] ?? '') === '1') {
        $CI->db->where('key', 'royalty_test_unlock')->update('settings', ['value' => '0']);
    }

    // Legacy min was 100 pts (RM 20) — raise to 500 pts (RM 100) once
    $minPts = $CI->db->where('key', 'royalty_min_redeem_points')->get('settings')->row_array();
    if ($minPts && (int)($minPts['value'] ?? 0) === 100) {
        $CI->db->where('key', 'royalty_min_redeem_points')->update('settings', ['value' => '500']);
    }
    if ((int)$CI->db->where('key', 'royalty_min_redeem_rm')->count_all_results('settings') < 1) {
        $row = ['key' => 'royalty_min_redeem_rm', 'value' => '100'];
        if ($hasGroup) {
            $row['group'] = 'wallet';
        }
        $CI->db->insert('settings', $row);
    }

    // Migrate earn rate 1 → 0.1 (Rs 5000 → 500 pts) once from old 1:1 rule
    $earnRate = $CI->db->where('key', 'royalty_earn_points_per_rm')->get('settings')->row_array();
    if ($earnRate) {
        $rateVal = (float)($earnRate['value'] ?? 0);
        if (abs($rateVal - 1.0) < 0.0001) {
            $CI->db->where('key', 'royalty_earn_points_per_rm')->update('settings', ['value' => '0.1']);
        }
    } else {
        $row = ['key' => 'royalty_earn_points_per_rm', 'value' => '0.1'];
        if ($hasGroup) {
            $row['group'] = 'wallet';
        }
        $CI->db->insert('settings', $row);
    }

    sk_royalty_migrate_wallet_credits();
    sk_royalty_backfill_from_orders();
    sk_royalty_backfill_paid_orders();
}

/**
 * One-time: move legacy royalty_earn wallet credits into royalty ledger and reverse wallet Rs.
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

/**
 * When true, any royalty balance (≥1 pt) can be applied (skips RM 100 gate).
 * Production default is OFF. Set settings royalty_test_unlock=1 only for QA.
 */
function sk_royalty_test_unlock(array $settings = null): bool {
    if ($settings === null) {
        $CI =& get_instance();
        $CI->load->model('Sk_Admin_model');
        $settings = $CI->Sk_Admin_model->get_settings();
    }
    return ($settings['royalty_test_unlock'] ?? '0') === '1';
}

/** Minimum royalty value (Rs) required to show/redeem on cart. Default Rs 100. */
function sk_royalty_min_redeem_rm(array $settings = null): float {
    if ($settings === null) {
        $CI =& get_instance();
        $CI->load->model('Sk_Admin_model');
        $settings = $CI->Sk_Admin_model->get_settings();
    }
    $n = (float)($settings['royalty_min_redeem_rm'] ?? 100);
    return $n > 0 ? $n : 100.0;
}

/** Minimum royalty points to redeem. Default 500 (= Rs 100 at 5 pts/Rs). */
function sk_royalty_min_redeem_points(array $settings = null): int {
    if ($settings === null) {
        $CI =& get_instance();
        $CI->load->model('Sk_Admin_model');
        $settings = $CI->Sk_Admin_model->get_settings();
    }
    $n = (int)($settings['royalty_min_redeem_points'] ?? 500);
    return $n > 0 ? $n : 500;
}

/** Points earned for a purchase amount (Rs). Default 0.1 pts per Rs (Rs 5000 → 500 pts). */
function sk_royalty_earn_points_for_amount(float $purchaseRm, array $settings = null): int {
    if ($settings === null) {
        $CI =& get_instance();
        $CI->load->model('Sk_Admin_model');
        $settings = $CI->Sk_Admin_model->get_settings();
    }
    $rate = (float)($settings['royalty_earn_points_per_rm'] ?? 0.1);
    if ($rate <= 0) {
        $rate = 0.1;
    }
    return (int)floor(max(0, $purchaseRm) * $rate);
}

/**
 * Sync order.royalty_earned_* into royalty ledger when ledger row is missing.
 */
function sk_royalty_backfill_from_orders(): void {
    $CI =& get_instance();
    $flag = $CI->db->where('key', 'royalty_orders_backfilled')->get('settings')->row_array();
    if (($flag['value'] ?? '') === '1') {
        return;
    }
    if (!$CI->db->table_exists('customer_royalty_transactions')
        || !$CI->db->field_exists('royalty_earned_points', 'orders')) {
        return;
    }

    $CI->load->model('Sk_Royalty_model');
    $orders = $CI->db->select('id, user_id, royalty_earned_points, royalty_earned_Rs, created_at')
        ->where('royalty_earned_points >', 0)
        ->get('orders')
        ->result_array();

    foreach ($orders as $o) {
        $userId = (int)$o['user_id'];
        $orderId = (int)$o['id'];
        $points = (int)$o['royalty_earned_points'];
        $Rs = round((float)$o['royalty_earned_Rs'], 2);
        if ($userId < 1 || $points < 1) {
            continue;
        }
        if ($Rs <= 0) {
            $Rs = $CI->Sk_Royalty_model->points_to_rm($points);
        }
        $ref = 'ORD-' . $orderId . '-ROYALTY';
        $CI->Sk_Royalty_model->credit(
            $userId,
            $points,
            $Rs,
            $ref,
            'Royalty earn ' . $points . ' pts (RM ' . number_format($Rs, 2) . ') for order #' . $orderId,
            $orderId
        );
    }

    $hasGroup = $CI->db->field_exists('group', 'settings');
    if ($flag) {
        $CI->db->where('key', 'royalty_orders_backfilled')->update('settings', ['value' => '1']);
    } else {
        $ins = ['key' => 'royalty_orders_backfilled', 'value' => '1'];
        if ($hasGroup) {
            $ins['group'] = 'wallet';
        }
        $CI->db->insert('settings', $ins);
    }
}

/**
 * One-time: credit royalty for paid/COD orders that never got ledger rows
 * (e.g. orders placed while earn path was broken or before separation).
 */
function sk_royalty_backfill_paid_orders(): void {
    $CI =& get_instance();
    $flag = $CI->db->where('key', 'royalty_paid_orders_backfilled')->get('settings')->row_array();
    if (($flag['value'] ?? '') === '1') {
        return;
    }
    if (!$CI->db->table_exists('customer_royalty_transactions')
        || !$CI->db->table_exists('orders')) {
        return;
    }

    $orders = $CI->db->select('*')
        ->group_start()
            ->where('payment_status', 'paid')
            ->or_where('payment_method', 'cod')
            ->or_where('payment_method', 'COD')
        ->group_end()
        ->order_by('id', 'ASC')
        ->get('orders')
        ->result_array();

    foreach ($orders as $order) {
        sk_royalty_credit_for_order($order);
    }

    $hasGroup = $CI->db->field_exists('group', 'settings');
    if ($flag) {
        $CI->db->where('key', 'royalty_paid_orders_backfilled')->update('settings', ['value' => '1']);
    } else {
        $ins = ['key' => 'royalty_paid_orders_backfilled', 'value' => '1'];
        if ($hasGroup) {
            $ins['group'] = 'wallet';
        }
        $CI->db->insert('settings', $ins);
    }
}

/**
 * Credit royalty after order is paid. Idempotent. Does NOT touch wallet.
 * @return array{success:bool,points?:int,Rs?:float,message?:string}
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
    if ($exists > 0) {
        return [
            'success' => true,
            'points'  => (int)($order['royalty_earned_points'] ?? 0),
            'Rs'      => (float)($order['royalty_earned_Rs'] ?? 0),
            'message' => 'Already credited.',
        ];
    }

    // Order flagged as earned but ledger missing (pre-separation) → sync into ledger
    $flaggedPts = (int)($order['royalty_earned_points'] ?? 0);
    if ($flaggedPts > 0) {
        $flaggedRm = round((float)($order['royalty_earned_Rs'] ?? 0), 2);
        if ($flaggedRm <= 0) {
            $flaggedRm = $CI->Sk_Royalty_model->points_to_rm($flaggedPts);
        }
        $ok = $CI->Sk_Royalty_model->credit(
            $userId,
            $flaggedPts,
            $flaggedRm,
            $ref,
            'Royalty earn ' . $flaggedPts . ' pts (RM ' . number_format($flaggedRm, 2) . ') for order #' . $orderId,
            $orderId
        );
        return [
            'success' => (bool)$ok,
            'points'  => $flaggedPts,
            'Rs'      => $flaggedRm,
            'message' => $ok ? 'Royalty synced to ledger.' : 'Sync failed.',
        ];
    }

    // Earn on order total (royalty is a payment toward the bill, not a discount)
    $purchaseRm = round((float)($order['total'] ?? 0), 2);
    if ($purchaseRm <= 0 && isset($order['subtotal'])) {
        $purchaseRm = round((float)$order['subtotal'], 2);
    }

    $points = sk_royalty_earn_points_for_amount($purchaseRm, $settings);
    if ($points < 1) {
        return ['success' => true, 'points' => 0, 'Rs' => 0.0, 'message' => 'No points for this amount.'];
    }

    $Rs = $CI->Sk_Royalty_model->points_to_rm($points);
    if ($Rs <= 0) {
        return ['success' => false, 'message' => 'Invalid conversion.'];
    }

    $ok = $CI->Sk_Royalty_model->credit(
        $userId,
        $points,
        $Rs,
        $ref,
        'Royalty earn ' . $points . ' pts (RM ' . number_format($Rs, 2) . ') for order #' . $orderId,
        $orderId
    );
    if (!$ok) {
        return ['success' => false, 'message' => 'Credit failed.'];
    }

    $CI->db->where('id', $orderId)->update('orders', [
        'royalty_earned_points' => $points,
        'royalty_earned_Rs'     => $Rs,
    ]);

    return ['success' => true, 'points' => $points, 'Rs' => $Rs, 'message' => 'Royalty credited.'];
}

/**
 * Redeem royalty only for confirmed orders. Idempotent.
 * Non-confirmed (payment_attempt / unpaid) orders must not decrease points.
 * @return array{success:bool,points?:int,rm?:float,message?:string}
 */
function sk_royalty_debit_for_order(array $order): array {
    sk_royalty_ensure_schema();
    $CI =& get_instance();
    $CI->load->model('Sk_Royalty_model');

    $orderId = (int)($order['id'] ?? 0);
    $userId  = (int)($order['user_id'] ?? 0);
    $pts     = (int)($order['royalty_used_points'] ?? 0);
    $rm      = round((float)($order['royalty_used_rm'] ?? 0), 2);

    if ($orderId < 1 || $userId < 1 || $pts < 1 || $rm <= 0) {
        return ['success' => true, 'points' => 0, 'rm' => 0.0, 'message' => 'No royalty to redeem.'];
    }

    $status = strtolower((string)($order['status'] ?? ''));
    $confirmedStatuses = ['confirmed', 'processing', 'shipped', 'delivered'];
    if (!in_array($status, $confirmedStatuses, true)) {
        return ['success' => false, 'message' => 'Order not confirmed yet — royalty not redeemed.'];
    }

    if ($CI->Sk_Royalty_model->was_redeemed_for_order($userId, $orderId)) {
        return ['success' => true, 'points' => $pts, 'rm' => $rm, 'message' => 'Already redeemed.'];
    }

    $ok = $CI->Sk_Royalty_model->debit(
        $userId,
        $pts,
        $rm,
        'ORD-' . $orderId . '-ROYALTY-REDEEM',
        'Royalty redeem ' . $pts . ' pts (RM ' . number_format($rm, 2) . ') for order #' . $orderId,
        $orderId
    );
    if (!$ok) {
        return ['success' => false, 'message' => 'Insufficient royalty points to redeem.'];
    }
    return ['success' => true, 'points' => $pts, 'rm' => $rm, 'message' => 'Royalty redeemed.'];
}
