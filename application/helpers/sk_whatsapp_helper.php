<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Askeva WhatsApp (backend.askeva.io) — order status utility messages.
 * Prefer free-form text; optional approved utility template fallback when session is closed.
 */

function sk_whatsapp_ensure_settings(): void {
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;
    $CI =& get_instance();
    if (!isset($CI->db)) {
        $CI->load->database();
    }
    $defaults = [
        'askeva_whatsapp_enabled' => '1',
        'askeva_api_url'          => 'https://backend.askeva.io/v1/message/send-message',
        'askeva_api_token'        => '5c9fbbe16cbd3ec293504d7d4d758e1adf160554f488609ef64df040d05f2176e44afba64867f635ae34fa48c296203707809db18d5b13e2609176cf18642f10',
        // Optional Meta-approved UTILITY template name (2 body params: order no, status). Leave empty to text-only.
        'askeva_order_template'   => '',
        'askeva_template_lang'    => 'en',
    ];
    $hasGroup = $CI->db->field_exists('group', 'settings');
    foreach ($defaults as $key => $value) {
        if ((int)$CI->db->where('key', $key)->count_all_results('settings') > 0) {
            continue;
        }
        $row = ['key' => $key, 'value' => $value];
        if ($hasGroup) {
            $row['group'] = 'whatsapp';
        }
        $CI->db->insert('settings', $row);
    }
}

function sk_whatsapp_config(array $settings = null): array {
    sk_whatsapp_ensure_settings();
    if ($settings === null) {
        $CI =& get_instance();
        $CI->load->model('Sk_Admin_model');
        $settings = $CI->Sk_Admin_model->get_settings();
    }
    $CI =& get_instance();
    $CI->config->load('whatsapp', true);
    $fileCfg = $CI->config->item('whatsapp') ?: [];

    $token = trim((string)($settings['askeva_api_token'] ?? ''));
    if ($token === '') {
        $token = trim((string)($fileCfg['api_key'] ?? ''));
    }
    $url = trim((string)($settings['askeva_api_url'] ?? ''));
    if ($url === '') {
        $url = trim((string)($fileCfg['api_url'] ?? 'https://backend.askeva.io/v1/message/send-message'));
    }

    return [
        'enabled'  => ($settings['askeva_whatsapp_enabled'] ?? '1') !== '0',
        'url'      => $url ?: 'https://backend.askeva.io/v1/message/send-message',
        'token'    => $token,
        'template' => trim((string)($settings['askeva_order_template'] ?? '')),
        'lang'     => trim((string)($settings['askeva_template_lang'] ?? 'en')) ?: 'en',
    ];
}

/** Normalize to digits with country code (MY default 60). */
function sk_whatsapp_normalize_phone(string $phone, array $settings = []): string {
    $phone = preg_replace('/\D+/', '', $phone);
    if ($phone === '') {
        return '';
    }
    // Strip leading 00
    if (strpos($phone, '00') === 0) {
        $phone = substr($phone, 2);
    }
    if ($phone[0] === '0') {
        $cc = preg_replace('/\D+/', '', (string)($settings['default_phone_country'] ?? '60'));
        if ($cc === '') {
            $cc = '60';
        }
        $phone = $cc . substr($phone, 1);
    }
    return $phone;
}

function sk_whatsapp_order_phone(array $order, array $settings = []): string {
    $candidates = [
        $order['shipping_phone'] ?? '',
        $order['billing_phone'] ?? '',
        $order['customer_phone'] ?? '',
    ];
    foreach ($candidates as $p) {
        $n = sk_whatsapp_normalize_phone((string)$p, $settings);
        if (strlen($n) >= 10) {
            return $n;
        }
    }
    return '';
}

function sk_whatsapp_status_label(string $status): string {
    $map = [
        'pending'    => 'Order Received',
        'confirmed'  => 'Order Confirmed',
        'processing' => 'Ready to Pick Up',
        'shipped'    => 'Shipped',
        'delivered'  => 'Delivered',
        'cancelled'  => 'Cancelled',
        'returned'   => 'Return Requested',
    ];
    return $map[$status] ?? ucfirst($status);
}

function sk_whatsapp_order_message(array $order, string $status, array $settings = []): string {
    $site = $settings['site_name'] ?? 'ShopKart';
    $orderNo = $order['order_number'] ?? ('#' . ($order['id'] ?? ''));
    $label = sk_whatsapp_status_label($status);
    $name = trim((string)($order['customer_name'] ?? $order['shipping_name'] ?? 'Customer'));
    $lines = [
        "{$site}: Hi {$name},",
        "Your order {$orderNo} is now: {$label}.",
    ];
    $awb = trim((string)($order['jt_bill_code'] ?? $order['tracking_number'] ?? ''));
    if ($awb !== '') {
        $lines[] = "Tracking / AWB: {$awb}";
    }
    $total = isset($order['total']) ? number_format((float)$order['total'], 2) : '';
    $cur = $settings['currency_symbol'] ?? 'RM';
    if ($total !== '') {
        $lines[] = "Amount: {$cur}{$total}";
    }
    $lines[] = 'Thank you for shopping with us.';
    return implode("\n", $lines);
}

/**
 * Low-level POST to Askeva send-message.
 * @return array{success:bool,http?:int,response?:mixed,message?:string}
 */
function sk_whatsapp_api_send(array $payload, array $cfg): array {
    if (empty($cfg['token'])) {
        return ['success' => false, 'message' => 'Askeva token not configured.'];
    }
    $url = rtrim($cfg['url'], '?&');
    $url .= (strpos($url, '?') === false ? '?' : '&') . 'token=' . rawurlencode($cfg['token']);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json', 'Accept: application/json'],
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $raw  = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);

    if ($err) {
        log_message('error', 'Askeva WA curl: ' . $err);
        return ['success' => false, 'http' => $code, 'message' => $err];
    }
    $json = json_decode((string)$raw, true);
    $ok = $code >= 200 && $code < 300;
    if (is_array($json) && (isset($json['error']) || (isset($json['status']) && $json['status'] === 'error'))) {
        $ok = false;
    }
    if (!$ok) {
        log_message('error', 'Askeva WA fail HTTP ' . $code . ': ' . $raw);
    }
    return [
        'success'  => $ok,
        'http'     => $code,
        'response' => $json !== null ? $json : $raw,
        'message'  => is_array($json) ? (string)($json['error'] ?? $json['message'] ?? ($ok ? 'sent' : 'failed')) : ($ok ? 'sent' : (string)$raw),
    ];
}

/** Send plain utility/session text. */
function sk_whatsapp_send_text(string $to, string $body, array $settings = null): array {
    $cfg = sk_whatsapp_config($settings);
    if (!$cfg['enabled']) {
        return ['success' => false, 'message' => 'WhatsApp notifications disabled.'];
    }
    $to = sk_whatsapp_normalize_phone($to, $settings ?: []);
    if ($to === '') {
        return ['success' => false, 'message' => 'Invalid phone.'];
    }
    return sk_whatsapp_api_send([
        'to'   => $to,
        'type' => 'text',
        'text' => ['body' => $body],
    ], $cfg);
}

/** Send approved utility template (body params = strings). */
function sk_whatsapp_send_template(string $to, string $templateName, array $bodyParams, array $settings = null): array {
    $cfg = sk_whatsapp_config($settings);
    if (!$cfg['enabled'] || $templateName === '') {
        return ['success' => false, 'message' => 'Template not configured.'];
    }
    $to = sk_whatsapp_normalize_phone($to, $settings ?: []);
    if ($to === '') {
        return ['success' => false, 'message' => 'Invalid phone.'];
    }
    $params = [];
    foreach ($bodyParams as $p) {
        $params[] = ['type' => 'text', 'text' => (string)$p];
    }
    return sk_whatsapp_api_send([
        'to'       => $to,
        'type'     => 'template',
        'template' => [
            'language'   => ['policy' => 'deterministic', 'code' => $cfg['lang']],
            'name'       => $templateName,
            'components' => [[
                'type'       => 'body',
                'parameters'  => $params,
            ]],
        ],
    ], $cfg);
}

/**
 * Notify customer on order status change via WhatsApp.
 * Tries text first; if session closed and a utility template is set, falls back to template.
 */
function sk_whatsapp_notify_order_status(array $order, string $status, array $settings = null): array {
    $CI =& get_instance();
    if ($settings === null) {
        $CI->load->model('Sk_Admin_model');
        $settings = $CI->Sk_Admin_model->get_settings();
    }
    $cfg = sk_whatsapp_config($settings);
    if (!$cfg['enabled']) {
        return ['success' => false, 'message' => 'disabled'];
    }

    $phone = sk_whatsapp_order_phone($order, $settings);
    if ($phone === '') {
        return ['success' => false, 'message' => 'No customer phone on order.'];
    }

    $msg = sk_whatsapp_order_message($order, $status, $settings);
    $result = sk_whatsapp_send_text($phone, $msg, $settings);

    $needTemplate = !$result['success'] && (
        stripos((string)($result['message'] ?? ''), 'session') !== false
        || stripos((string)($result['message'] ?? ''), 'not opened') !== false
    );

    if ($needTemplate && $cfg['template'] !== '') {
        $orderNo = $order['order_number'] ?? (string)($order['id'] ?? '');
        $label = sk_whatsapp_status_label($status);
        $result = sk_whatsapp_send_template($phone, $cfg['template'], [$orderNo, $label], $settings);
        $result['via'] = 'template';
    } else {
        $result['via'] = 'text';
    }

    log_message('info', 'Askeva WA order ' . ($order['id'] ?? '?') . ' status=' . $status
        . ' via=' . ($result['via'] ?? '?') . ' ok=' . (!empty($result['success']) ? '1' : '0')
        . ' msg=' . ($result['message'] ?? ''));

    return $result;
}
