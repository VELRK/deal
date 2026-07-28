<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Load JT Express config (sandbox + production credentials).
 * Falls back to direct include if CI config->load fails (common on some deploys).
 *
 * @return array{api_urls?:array,sandbox?:array,production?:array}
 */
function sk_jt_express_config() {
    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }

    $cached = [];
    $CI =& get_instance();

    // Prefer CI loader
    if (isset($CI->config)) {
        $CI->config->load('jt_express', false, true);
        $item = $CI->config->item('jt_express');
        if (is_array($item)) {
            $cached = $item;
        }
    }

    // Direct include fallback (ensures production credentials exist even if config path differs)
    if (empty($cached['production']) || empty($cached['production']['api_account'])) {
        $file = APPPATH . 'config/jt_express.php';
        if (is_file($file)) {
            $config = [];
            include $file;
            if (!empty($config['jt_express']) && is_array($config['jt_express'])) {
                $cached = $config['jt_express'];
            }
        }
    }

    // Absolute last resort — known working production Open Platform credentials
    if (empty($cached['production']) || empty($cached['production']['api_account'])) {
        $cached['production'] = [
            'api_account'       => '838338320232973056',
            'private_key'       => 'c1fe13bc3f7642fd96297248a80533d5',
            'customer_code'     => 'JTMY024627',
            'customer_name'     => 'JTMY024627',
            'customer_password' => '06F4B84632C34F6476EAB9F872587660',
            'demo_uuid'         => '',
            'sender_name'       => 'Golden2Deal (M) Sdn Bhd',
            'sender_phone'      => '60123235454',
            'sender_address'    => 'Lot No. 2A/9 Anzen Business Park, No. 3-9, Jalan 4/37A, Kawasan Industri Taman Bukit Maluri, 52100 Kepong Kuala Lumpur.',
            'sender_city'       => 'Kuala Lumpur',
            'sender_state'      => 'Wilayah Persekutuan',
            'sender_postcode'   => '52100',
        ];
        $cached['api_urls'] = [
            'sandbox'    => 'https://demoopenapi.jtexpress.my/webopenplatformapi',
            'production' => 'https://ylopenapi.jtexpress.my/webopenplatformapi',
        ];
        $cached['sandbox'] = [
            'api_account'       => '640826271705595946',
            'private_key'       => '8e88c8477d4e4939859c560192fcafbc',
            'customer_code'     => 'ITTEST0001',
            'customer_name'     => 'ITTEST0001',
            'customer_password' => 'Sfx6H8d4',
            'demo_uuid'         => '5ba402abcfdc4dff9cb1c589afcf9682',
        ];
    }

    return $cached;
}

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
        // Official JT Signature Tools sandbox sample
        'jt_express_enabled'           => '0',
        'jt_express_sandbox'           => '1',
        'jt_express_api_account'       => '640826271705595946',
        'jt_express_private_key'       => '8e88c8477d4e4939859c560192fcafbc',
        'jt_express_customer_code'     => 'ITTEST0001',
        'jt_express_customer_name'     => 'ITTEST0001',
        'jt_express_customer_password' => 'Sfx6H8d4',
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

/**
 * Normalize JT Express trace / webhook payload to a flat event list (newest first).
 */
function sk_jt_normalize_tracks(array $result): array {
    $data = $result['data'] ?? $result['raw']['data'] ?? $result['raw'] ?? $result;
    $tracks = [];

    if (isset($data['details']) && is_array($data['details'])) {
        $tracks = $data['details'];
    } elseif (isset($data[0]['details']) && is_array($data[0]['details'])) {
        $tracks = $data[0]['details'];
    } elseif (isset($data['traces']) && is_array($data['traces'])) {
        $tracks = $data['traces'];
    } elseif (isset($data['trackList']) && is_array($data['trackList'])) {
        $tracks = $data['trackList'];
    } elseif (is_array($data) && (isset($data[0]['scanTime']) || isset($data[0]['scanType']) || isset($data[0]['desc']))) {
        $tracks = $data;
    } elseif (is_array($data) && (isset($data['scanTime']) || isset($data['scanType']) || isset($data['desc']))) {
        $tracks = [$data];
    }

    $tracks = array_values(array_filter($tracks, 'is_array'));
    if (!$tracks) {
        return [];
    }

    usort($tracks, function ($a, $b) {
        $ta = strtotime((string)($a['scanTime'] ?? $a['time'] ?? $a['acceptTime'] ?? $a['date'] ?? '')) ?: 0;
        $tb = strtotime((string)($b['scanTime'] ?? $b['time'] ?? $b['acceptTime'] ?? $b['date'] ?? '')) ?: 0;
        return $tb <=> $ta;
    });

    return $tracks;
}

/** Human-readable line for one JT tracking event. */
function sk_jt_track_event_label(array $event): string {
    $time = trim((string)($event['scanTime'] ?? $event['time'] ?? $event['acceptTime'] ?? $event['date'] ?? ''));
    $desc = trim((string)($event['desc'] ?? $event['remark'] ?? $event['scanType'] ?? $event['status'] ?? $event['scanCode'] ?? ''));
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

/**
 * Map JT scan text / codes to portal order status.
 * Returns null when no status change should be applied.
 */
function sk_jt_infer_order_status(array $tracks, string $currentStatus): ?string {
    if (!$tracks) {
        return null;
    }
    if (in_array($currentStatus, ['cancelled'], true)) {
        return null;
    }

    $latest = $tracks[0];
    $text = strtolower(sk_jt_track_event_label($latest));
    $scanType = strtolower(trim((string)($latest['scanType'] ?? $latest['scanCode'] ?? $latest['status'] ?? '')));
    $haystack = $text . ' ' . $scanType;

    // Returned / RTO
    if (preg_match('/\b(return|returned|rto|sent back|back to sender)\b/', $haystack)) {
        return 'returned';
    }

    // Delivered (not failed)
    if (
        preg_match('/\b(delivered|signed|pod|success delivery|delivery success)\b/', $haystack)
        && strpos($haystack, 'fail') === false
        && strpos($haystack, 'undeliver') === false
    ) {
        return 'delivered';
    }

    // Out for delivery / in transit / picked up → shipped
    if (preg_match('/\b(out for delivery|ofd|in transit|transit|depart|arriv|hub|warehouse|on the way|dispatch|picked|pick.?up|collection|collected|ship|sorting|scan)\b/', $haystack)) {
        if (!in_array($currentStatus, ['delivered', 'returned'], true)) {
            return 'shipped';
        }
    }

    // Order created / ready at merchant → keep processing
    if (preg_match('/\b(order created|ready for pickup|awaiting pickup|pending pickup|created)\b/', $haystack)) {
        if (in_array($currentStatus, ['pending', 'confirmed'], true)) {
            return 'processing';
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

/**
 * Persist JT tracking payload and bump order status from scan events.
 * Always updates jt_courier_status + jt_track_data when events exist.
 */
function sk_jt_sync_order_tracking(int $orderId, array $trackResult): array {
    $CI =& get_instance();
    $CI->load->model('Sk_Order_model');

    $order = $CI->Sk_Order_model->get_by_id($orderId);
    if (!$order) {
        return ['updated' => false, 'status' => null, 'courier_status' => null];
    }

    $tracks = sk_jt_normalize_tracks($trackResult);
    $latestLabel = $tracks ? sk_jt_track_event_label($tracks[0]) : '';
    $update = [
        'jt_track_data' => json_encode($trackResult['raw'] ?? $trackResult['data'] ?? $trackResult),
    ];
    if ($latestLabel !== '') {
        $update['jt_courier_status'] = mb_substr($latestLabel, 0, 80);
    }

    $newStatus = null;
    $inferred = sk_jt_infer_order_status($tracks, (string)$order['status']);
    if ($inferred && $inferred !== $order['status']) {
        $CI->Sk_Order_model->update_status($orderId, $inferred);
        $update['status'] = $inferred;
        $newStatus = $inferred;
    }

    $CI->Sk_Order_model->update_jt_shipment($orderId, $update);

    return [
        'updated'        => true,
        'status'         => $newStatus ?: $order['status'],
        'courier_status' => $update['jt_courier_status'] ?? ($order['jt_courier_status'] ?? null),
        'tracks'         => $tracks,
    ];
}

/**
 * Apply a JT webhook / status-push payload to the matching order in our DB.
 */
function sk_jt_apply_webhook_payload(array $payload): array {
    $CI =& get_instance();
    $CI->load->model('Sk_Order_model');
    sk_jt_express_ensure_schema();

    // JT may wrap content in bizContent (JSON string or array)
    if (!empty($payload['bizContent'])) {
        $inner = $payload['bizContent'];
        if (is_string($inner)) {
            $decoded = json_decode($inner, true);
            if (is_array($decoded)) {
                $payload = $decoded;
            }
        } elseif (is_array($inner)) {
            $payload = $inner;
        }
    }

    // Some pushes wrap under data
    if (isset($payload['data']) && is_array($payload['data']) && !isset($payload['billCode']) && !isset($payload['billcode'])) {
        $payload = array_merge($payload, $payload['data']);
        if (isset($payload['data'][0]) && is_array($payload['data'][0])) {
            $payload = array_merge($payload, $payload['data'][0]);
        }
    }

    $billCode = trim((string)(
        $payload['billCode']
        ?? $payload['billcode']
        ?? $payload['waybillNo']
        ?? $payload['waybill_no']
        ?? $payload['mailNo']
        ?? ''
    ));
    $txId = trim((string)(
        $payload['txlogisticId']
        ?? $payload['txLogisticId']
        ?? $payload['orderId']
        ?? $payload['customerOrderId']
        ?? ''
    ));

    $order = null;
    if ($billCode !== '') {
        $order = $CI->Sk_Order_model->get_by_tracking($billCode);
    }
    if (!$order && $txId !== '') {
        $order = $CI->db->group_start()
            ->where('jt_txlogistic_id', $txId)
            ->or_where('order_number', $txId)
            ->group_end()
            ->order_by('id', 'DESC')
            ->limit(1)
            ->get('orders')->row_array();
        if ($order) {
            $order['items'] = $CI->Sk_Order_model->get_items($order['id']);
        }
    }

    if (!$order) {
        return ['success' => false, 'message' => 'Order not found for JT payload.', 'bill_code' => $billCode, 'txlogistic_id' => $txId];
    }

    $tracks = sk_jt_normalize_tracks($payload);
    if (!$tracks && (isset($payload['scanType']) || isset($payload['desc']) || isset($payload['scanTime']))) {
        $tracks = sk_jt_normalize_tracks(['data' => [$payload]]);
    }

    $trackResult = [
        'success' => true,
        'data'    => $tracks ?: $payload,
        'raw'     => $payload,
    ];

    $sync = sk_jt_sync_order_tracking((int)$order['id'], $trackResult);

    // Ensure AWB stored if webhook provides it and order was missing it
    $patch = [];
    if ($billCode !== '' && empty($order['jt_bill_code'])) {
        $patch['jt_bill_code'] = $billCode;
        $patch['tracking_number'] = $billCode;
        $patch['courier_provider'] = 'jt_express';
    }
    if ($txId !== '' && empty($order['jt_txlogistic_id'])) {
        $patch['jt_txlogistic_id'] = $txId;
    }
    if ($patch) {
        $CI->Sk_Order_model->update_jt_shipment((int)$order['id'], $patch);
    }

    return [
        'success'        => true,
        'message'        => 'JT status synced to database.',
        'order_id'       => (int)$order['id'],
        'order_number'   => $order['order_number'],
        'order_status'   => $sync['status'] ?? $order['status'],
        'courier_status' => $sync['courier_status'] ?? null,
        'bill_code'      => $billCode ?: ($order['jt_bill_code'] ?? ''),
    ];
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
