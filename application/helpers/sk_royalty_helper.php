<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Royalty points — earn after paid orders; redeem like a coupon (min 100 pts).
 * Rate: 1 point per RM 1 spent → RM 500 purchase = 500 pts = RM 100 credit
 * (uses wallet_points_per_rm, default 5 pts / RM).
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

    // Ensure royalty_earn is allowed on wallet transaction source
    $src = $CI->db->query("SHOW COLUMNS FROM `customer_wallet_transactions` LIKE 'source'")->row_array();
    $type = (string)($src['Type'] ?? '');
    if ($type !== '' && stripos($type, 'royalty_earn') === false && stripos($type, 'enum(') !== false) {
        $CI->db->query("ALTER TABLE `customer_wallet_transactions`
            MODIFY COLUMN `source` ENUM(
                'admin_add','order_payment','refund','promo','adjustment',
                'topup','topup_pending','topup_sandbox','royalty_earn'
            ) NOT NULL");
    }

    $defaults = [
        'royalty_enabled'           => '1',
        'royalty_min_redeem_points' => '100',
        'royalty_earn_points_per_rm'=> '1', // 1 pt per RM 1 purchase
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
 * Credit royalty after order is paid. Idempotent.
 * @return array{success:bool,points?:int,rm?:float,message?:string}
 */
function sk_royalty_credit_for_order(array $order): array {
    sk_royalty_ensure_schema();
    $CI =& get_instance();
    $CI->load->model(['Sk_Customer_wallet_model', 'Sk_Admin_model']);
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
        ->where('source', 'royalty_earn')
        ->count_all_results('customer_wallet_transactions');
    if ($exists > 0 || (int)($order['royalty_earned_points'] ?? 0) > 0) {
        return [
            'success' => true,
            'points'  => (int)($order['royalty_earned_points'] ?? 0),
            'rm'      => (float)($order['royalty_earned_rm'] ?? 0),
            'message' => 'Already credited.',
        ];
    }

    // Purchase amount = order total (what customer paid for this order)
    $purchaseRm = round((float)($order['total'] ?? 0), 2);
    $points = sk_royalty_earn_points_for_amount($purchaseRm, $settings);
    if ($points < 1) {
        return ['success' => true, 'points' => 0, 'rm' => 0.0, 'message' => 'No points for this amount.'];
    }

    $rm = $CI->Sk_Customer_wallet_model->points_to_rm($points);
    if ($rm <= 0) {
        return ['success' => false, 'message' => 'Invalid conversion.'];
    }

    $ok = $CI->Sk_Customer_wallet_model->credit_royalty($userId, $rm, $points, $ref, $orderId);
    if (!$ok) {
        return ['success' => false, 'message' => 'Credit failed.'];
    }

    $CI->db->where('id', $orderId)->update('orders', [
        'royalty_earned_points' => $points,
        'royalty_earned_rm'     => $rm,
    ]);

    return ['success' => true, 'points' => $points, 'rm' => $rm, 'message' => 'Royalty credited.'];
}
