<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Whether JT Express sandbox mode is active.
 * IMPORTANT: do not use empty() — PHP empty('0') is true, which breaks Sandbox OFF.
 */
function sk_jt_express_is_sandbox(array $settings) {
    return (string)($settings['jt_express_sandbox'] ?? '1') !== '0';
}

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
        'jt_courier_status'      => 'VARCHAR(500) NULL DEFAULT NULL',
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
    // Widen courier status so bilingual EN/MS text is not truncated
    $field = $CI->db->field_data('orders');
    foreach ($field as $f) {
        if ($f->name === 'jt_courier_status' && isset($f->max_length) && (int)$f->max_length < 500) {
            $CI->db->query('ALTER TABLE `orders` MODIFY COLUMN `jt_courier_status` VARCHAR(500) NULL DEFAULT NULL');
            break;
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

/** Human-readable line for one JT tracking event (English + Malay when present). */
function sk_jt_track_event_label(array $event): string {
    $time = trim((string)($event['scanTime'] ?? $event['time'] ?? $event['acceptTime'] ?? $event['date'] ?? ''));
    $desc = trim((string)($event['desc'] ?? $event['remark'] ?? $event['scanType'] ?? $event['status'] ?? $event['scanCode'] ?? ''));
    if ($desc === '') {
        $desc = json_encode($event);
    }
    $desc = sk_jt_localize_track_desc($desc);
    return $time !== '' ? ($time . ' — ' . $desc) : $desc;
}

/**
 * Show English alongside Malay JT scan text.
 * e.g. reason [Pengirim Minta…] → English + original Malay.
 */
function sk_jt_localize_track_desc(string $desc): string {
    $desc = trim($desc);
    if ($desc === '') {
        return $desc;
    }

    // Phrase map (Malay → English). Longer phrases first.
    $map = [
        'Pengirim Minta Untuk Penjadualan Pick-up Semula' => 'Sender requested to reschedule pick-up',
        'Pengirim minta untuk penjadualan pick-up semula' => 'Sender requested to reschedule pick-up',
        'Penjadualan Pick-up Semula' => 'Reschedule pick-up',
        'Penjadualan Pick Up Semula' => 'Reschedule pick-up',
        'Penerima Tidak Di Tempat' => 'Recipient not at address',
        'Penerima tidak di tempat' => 'Recipient not at address',
        'Alamat Tidak Lengkap' => 'Incomplete address',
        'Alamat tidak lengkap' => 'Incomplete address',
        'Alamat Salah' => 'Wrong address',
        'Nombor Telefon Salah' => 'Wrong phone number',
        'Nombor telefon salah' => 'Wrong phone number',
        'Penerima Menolak' => 'Recipient refused delivery',
        'Penerima menolak' => 'Recipient refused delivery',
        'Kawasan Sukar Dihubungi' => 'Hard-to-reach area',
        'Menunggu Pickup' => 'Awaiting pick-up',
        'Dalam Transit' => 'In transit',
        'Dihantar' => 'Delivered',
        'Dibatalkan' => 'Cancelled',
        'Package is being hold' => 'Package is on hold',
        'Package is being held' => 'Package is on hold',
    ];

    $out = $desc;
    $translatedParts = [];

    // Translate content inside [brackets] or 【fullwidth】 (JT MY reason format)
    $out = preg_replace_callback('/[\[\x{3010}]([^\]\x{3011}]+)[\]\x{3011}]/u', function ($m) use ($map, &$translatedParts) {
        $inner = trim($m[1]);
        $en = $map[$inner] ?? null;
        if ($en === null) {
            foreach ($map as $ms => $eng) {
                if (strcasecmp($ms, $inner) === 0) {
                    $en = $eng;
                    break;
                }
            }
        }
        if ($en !== null) {
            $translatedParts[] = $en;
            // Keep same bracket style as input (ASCII or fullwidth)
            $open = mb_substr($m[0], 0, 1);
            $close = mb_substr($m[0], -1);
            return $open . $en . ' / ' . $inner . $close;
        }
        return $m[0];
    }, $out);

    // Replace remaining whole-phrase Malay outside brackets
    foreach ($map as $ms => $en) {
        if ($ms === '' || stripos($ms, 'Package is being') === 0) {
            // English grammar fixes applied separately
            continue;
        }
        if (mb_stripos($out, $ms) !== false && mb_stripos($out, $en) === false) {
            $out = str_ireplace($ms, $en . ' / ' . $ms, $out);
            $translatedParts[] = $en;
        }
    }

    // Light English grammar polish from JT
    $out = str_ireplace('Package is being hold', 'Package is on hold', $out);
    $out = str_ireplace('Package is being held', 'Package is on hold', $out);

    return $out;
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
    $code = trim((string)($latest['scanTypeCode'] ?? $latest['scanCode'] ?? ''));
    $text = strtolower(sk_jt_track_event_label($latest));
    $scanType = strtolower(trim((string)($latest['scanType'] ?? $latest['status'] ?? '')));
    $haystack = $text . ' ' . $scanType;

    // Official Open Platform scanTypeCode (MY docs)
    // 100 = Parcel Signed (delivered), 172/173 = return, 94 = Delivery Scan,
    // 10/20/30 = pickup/depart/arrive, 110/200/300-306 = problem/exception
    if (in_array($code, ['172', '173'], true)
        || preg_match('/\b(return|returned|rto|sent back|back to sender)\b/', $haystack)) {
        return 'returned';
    }

    if ($code === '100'
        || (
            preg_match('/\b(delivered|signed|pod|success delivery|delivery success|parcel signed)\b/', $haystack)
            && strpos($haystack, 'fail') === false
            && strpos($haystack, 'undeliver') === false
        )
    ) {
        return 'delivered';
    }

    if (in_array($code, ['10', '20', '30', '94', '400', '401', '402', '403', '404', '405', '700', '701', '702', '703', '704'], true)
        || preg_match('/\b(out for delivery|on delivery|ofd|in transit|transit|depart|arriv|hub|warehouse|on the way|dispatch|picked|pick.?up|collection|collected|ship|sorting|scan|delivery scan)\b/', $haystack)
    ) {
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
        return ['updated' => false, 'status' => null, 'courier_status' => null, 'status_changed' => false];
    }

    $prevStatus = (string)($order['status'] ?? '');
    $tracks = sk_jt_normalize_tracks($trackResult);
    $latestLabel = $tracks ? sk_jt_track_event_label($tracks[0]) : '';
    $update = [
        'jt_track_data' => json_encode($trackResult['raw'] ?? $trackResult['data'] ?? $trackResult),
    ];
    if ($latestLabel !== '') {
        $update['jt_courier_status'] = mb_substr($latestLabel, 0, 500);
    }

    $newStatus = null;
    $inferred = sk_jt_infer_order_status($tracks, $prevStatus);
    if ($inferred && $inferred !== $prevStatus) {
        $CI->Sk_Order_model->update_status($orderId, $inferred);
        $update['status'] = $inferred;
        $newStatus = $inferred;
    }

    $CI->Sk_Order_model->update_jt_shipment($orderId, $update);

    if ($newStatus) {
        $fresh = $CI->Sk_Order_model->get_by_id($orderId);
        if ($fresh) {
            $CI->load->helper(['sk_mailer', 'sk_whatsapp']);
            $CI->load->model('Sk_Admin_model');
            $settings = $CI->Sk_Admin_model->get_settings();
            // Customer: email + WhatsApp
            sk_mail_order_status($fresh, $newStatus, $settings);
            sk_whatsapp_notify_order_status($fresh, $newStatus, $settings);
            // Admin: email so JT-driven changes are visible in inbox
            sk_mail_jt_order_status_admin($fresh, $prevStatus, $newStatus, $latestLabel, $settings);
        }
    }

    return [
        'updated'         => true,
        'status'          => $newStatus ?: $prevStatus,
        'previous_status' => $prevStatus,
        'status_changed'  => (bool)$newStatus,
        'courier_status'  => $update['jt_courier_status'] ?? ($order['jt_courier_status'] ?? null),
        'tracks'          => $tracks,
    ];
}

/**
 * Notify store admin when JT Express tracking auto-updates portal order status.
 */
function sk_mail_jt_order_status_admin(array $order, string $fromStatus, string $toStatus, string $courierLabel = '', array $settings = []): bool {
    $CI =& get_instance();
    $CI->load->helper('sk_mailer');
    if (empty($settings)) {
        $settings = sk_mailer_settings();
    }
    $adminEmail = sk_mailer_notify_email($settings);
    if ($adminEmail === '') {
        return false;
    }

    $site_name = $settings['site_name'] ?? '2DEAL';
    $orderNo   = htmlspecialchars($order['order_number'] ?? '');
    $awb       = htmlspecialchars($order['jt_bill_code'] ?? $order['tracking_number'] ?? '—');
    $from      = htmlspecialchars(ucfirst($fromStatus ?: '—'));
    $to        = htmlspecialchars(ucfirst($toStatus ?: '—'));
    $courier   = htmlspecialchars($courierLabel !== '' ? $courierLabel : ($order['jt_courier_status'] ?? '—'));
    $orderUrl  = htmlspecialchars(site_url('shopkart/jt-express/view/' . (int)($order['id'] ?? 0)));
    $subject   = "JT Express updated order #{$order['order_number']} → {$toStatus}";

    $body = "
<!DOCTYPE html>
<html><head><meta charset='utf-8'></head>
<body style='margin:0;padding:20px;background:#f8fafc;font-family:Arial,sans-serif;color:#334155;'>
  <div style='max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;border:1px solid #e2e8f0;'>
    <h2 style='margin:0 0 12px;color:#0f172a;'>JT Express status update</h2>
    <p>Order <strong>#{$orderNo}</strong> was auto-updated from JT tracking.</p>
    <p><strong>Order status:</strong> {$from} → <span style='color:#ca8a04;'>{$to}</span><br>
    <strong>AWB:</strong> {$awb}<br>
    <strong>Courier:</strong> {$courier}</p>
    <p style='margin-top:24px;'><a href='{$orderUrl}' style='background:#ca8a04;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:700;'>Open JT shipment</a></p>
    <p style='color:#94a3b8;font-size:13px;margin-top:24px;'>{$site_name}</p>
  </div>
</body></html>";

    return sk_send_mail($adminEmail, $site_name . ' Admin', $subject, $body);
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

    // If still a list of shipments, take the first (controller usually expands batches)
    if (isset($payload[0]) && is_array($payload[0]) && !isset($payload['billCode']) && !isset($payload['billcode'])) {
        $payload = $payload[0];
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
