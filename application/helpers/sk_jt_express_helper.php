<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * JT Express schema + default settings (no CLI required).
 * Runs automatically when admin opens Settings or uses JT Express on an order.
 */
function sk_jt_express_ensure_schema() {
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
        'courier_provider'       => 'VARCHAR(30) NULL DEFAULT NULL',
        'jt_txlogistic_id'       => 'VARCHAR(64) NULL DEFAULT NULL',
        'jt_bill_code'           => 'VARCHAR(64) NULL DEFAULT NULL',
        'jt_courier_status'      => 'VARCHAR(80) NULL DEFAULT NULL',
        'jt_label_data'          => 'MEDIUMTEXT NULL',
        'jt_track_data'          => 'MEDIUMTEXT NULL',
        'jt_shipment_created_at' => 'DATETIME NULL DEFAULT NULL',
        'confirmed_at'           => 'DATETIME NULL DEFAULT NULL',
        'processing_at'          => 'DATETIME NULL DEFAULT NULL',
        'status_updated_at'      => 'DATETIME NULL DEFAULT NULL',
    ];
    foreach ($cols as $col => $def) {
        if (!$CI->db->field_exists($col, 'orders')) {
            $CI->db->query("ALTER TABLE `orders` ADD COLUMN `{$col}` {$def}");
        }
    }

    $defaults = [
        'jt_express_enabled'           => '0',
        'jt_express_sandbox'           => '1',
        'jt_express_api_account'       => '640826271705595946',
        'jt_express_private_key'       => '8e88c8477d4e4939859c560192fcafbc',
        'jt_express_customer_code'     => 'GOLDENEAGLEIMPORTS',
        'jt_express_customer_name'     => 'GOLDENEAGLEIMPORTS',
        'jt_express_customer_password' => '',
        'jt_express_demo_uuid'         => '5ba402abcfdc4dff9cb1c589afcf9682',
        'jt_express_default_weight'    => '1',
        'jt_express_sender_name'       => 'GOLDENEAGLEIMPORTS',
        'jt_express_sender_phone'      => '',
        'jt_express_sender_address'    => '',
        'jt_express_sender_city'       => '',
        'jt_express_sender_state'      => '',
        'jt_express_sender_postcode'   => '',
    ];

    $hasGroup = $CI->db->field_exists('group', 'settings');
    foreach ($defaults as $key => $value) {
        $exists = (int)$CI->db->where('key', $key)->count_all_results('settings');
        if ($exists) {
            continue;
        }
        $row = ['key' => $key, 'value' => $value];
        if ($hasGroup) {
            $row['group'] = 'shipping';
        }
        $CI->db->insert('settings', $row);
    }
}

/** Normalize JT Express trace payload to a flat event list. */
function sk_jt_normalize_tracks(array $result): array {
    $data = $result['data'] ?? $result['raw']['data'] ?? $result['raw'] ?? [];
    if (isset($data['details']) && is_array($data['details'])) {
        return $data['details'];
    }
    if (isset($data[0]['details']) && is_array($data[0]['details'])) {
        return $data[0]['details'];
    }
    if (isset($data['traces']) && is_array($data['traces'])) {
        return $data['traces'];
    }
    if (is_array($data) && isset($data[0]['scanTime'])) {
        return $data;
    }
    return is_array($data) ? $data : [];
}

/** Human-readable line for one JT tracking event. */
function sk_jt_track_event_label(array $event): string {
    $time = trim((string)($event['scanTime'] ?? $event['time'] ?? $event['acceptTime'] ?? $event['date'] ?? ''));
    $desc = trim((string)($event['desc'] ?? $event['remark'] ?? $event['scanType'] ?? $event['status'] ?? ''));
    if ($desc === '') {
        $desc = json_encode($event);
    }
    return $time !== '' ? ($time . ' — ' . $desc) : $desc;
}

/** Parse stored jt_track_data JSON from orders row. */
function sk_jt_tracks_from_order(array $order): array {
    if (empty($order['jt_track_data'])) {
        return [];
    }
    $raw = json_decode((string)$order['jt_track_data'], true);
    if (!is_array($raw)) {
        return [];
    }
    return sk_jt_normalize_tracks(['raw' => $raw]);
}

/** Infer portal order status from latest JT scan text. */
function sk_jt_infer_order_status(array $tracks, string $currentStatus): ?string {
    if (!$tracks) {
        return null;
    }
    $latest = $tracks[0];
    $text = strtolower(sk_jt_track_event_label($latest));
    if (strpos($text, 'deliver') !== false && strpos($text, 'fail') === false) {
        return 'delivered';
    }
    if (preg_match('/pick.?up|picked|ship|transit|out for delivery|depart|arriv/', $text)) {
        if ($currentStatus !== 'delivered') {
            return 'shipped';
        }
    }
    return null;
}

function sk_jt_format_datetime(?string $value): string {
    if (!$value) {
        return '—';
    }
    $ts = strtotime($value);
    return $ts ? date('d M Y, h:i A', $ts) : '—';
}

/** Persist JT tracking payload and optionally bump order status from scan events. */
function sk_jt_sync_order_tracking(int $orderId, array $trackResult): void {
    $CI =& get_instance();
    $CI->load->model('Sk_Order_model');

    $order = $CI->Sk_Order_model->get_by_id($orderId);
    if (!$order) {
        return;
    }

    $tracks = sk_jt_normalize_tracks($trackResult);
    $latestLabel = $tracks ? sk_jt_track_event_label($tracks[0]) : '';
    $update = [
        'jt_track_data' => json_encode($trackResult['raw'] ?? $trackResult['data']),
    ];
    if ($latestLabel !== '') {
        $update['jt_courier_status'] = mb_substr($latestLabel, 0, 80);
    }

    $inferred = sk_jt_infer_order_status($tracks, (string)$order['status']);
    if ($inferred && $inferred !== $order['status']) {
        $CI->Sk_Order_model->update_status($orderId, $inferred);
        $update['status'] = $inferred;
    }

    $CI->Sk_Order_model->update_jt_shipment($orderId, $update);
}

/** Attach JT tracking fields for customer order API responses. */
function sk_order_attach_tracking(array &$order): void {
    $order['tracking_number'] = $order['jt_bill_code'] ?? $order['tracking_number'] ?? null;
    $order['courier_status']  = $order['jt_courier_status'] ?? null;
    $order['jt_tracks']       = sk_jt_tracks_from_order($order);
    $order['latest_track']    = !empty($order['jt_tracks'][0])
        ? sk_jt_track_event_label($order['jt_tracks'][0])
        : null;
}
