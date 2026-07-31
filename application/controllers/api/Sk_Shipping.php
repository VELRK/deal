<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Shipping extends Sk_Base_Api {

    public function __construct() {
        parent::__construct();
        $this->load->helper('sk_jt_express');
        sk_jt_express_ensure_schema();
    }

    /**
     * POST /shopkart-api/shipping/track
     * Body: { tracking_number } and/or { order_number }
     * Public — customers can track with AWB / tracking ID even without login.
     */
    public function track() {
        $data = $this->body();
        $tracking = trim((string)($data['tracking_number'] ?? $data['bill_code'] ?? $data['awb'] ?? ''));
        $orderNo  = trim((string)($data['order_number'] ?? ''));

        if ($tracking === '' && $orderNo === '') {
            return $this->error('Enter a tracking number (AWB) or order number.');
        }

        $order = null;
        if ($tracking !== '') {
            $order = $this->Sk_Order_model->get_by_tracking($tracking);
        }
        if (!$order && $orderNo !== '') {
            $order = $this->db->where('order_number', $orderNo)->get('orders')->row_array();
            if ($order) {
                $order['items'] = $this->Sk_Order_model->get_items($order['id']);
            }
        }

        $billCode = '';
        if ($order) {
            $billCode = trim((string)($order['jt_bill_code'] ?? $order['tracking_number'] ?? ''));
        }
        if ($billCode === '' && $tracking !== '') {
            $billCode = $tracking;
        }

        if ($billCode === '' && !$order) {
            return $this->error('Shipment not found. Check your tracking ID or order number.', 404);
        }

        $settings = $this->get_settings();
        $jtOn = !empty($settings['jt_express_enabled']) && $settings['jt_express_enabled'] !== '0';

        // Live JT track when we have an AWB
        if ($jtOn && $billCode !== '') {
            $this->load->library('Jt_express', $settings);
            $result = $this->jt_express->track($billCode);
            $tracks = !empty($result['success']) ? sk_jt_normalize_tracks($result) : [];

            if ($order && !empty($result['success'])) {
                sk_jt_sync_order_tracking((int)$order['id'], $result);
                $order = $this->Sk_Order_model->get_by_id((int)$order['id']);
            }
            // Fall back to last saved scans when live JT call fails
            if (!$tracks && $order) {
                $tracks = sk_jt_tracks_from_order($order);
            }

            // AWB-only lookup (no local order row) still returns JT events
            if (!$order && empty($result['success']) && !$tracks) {
                return $this->error(
                    $result['message'] ?? 'Tracking not found for this ID. Try again later.',
                    404
                );
            }

            $labels = [];
            foreach ($tracks as $ev) {
                $rawDesc = trim((string)($ev['desc'] ?? $ev['remark'] ?? $ev['scanType'] ?? $ev['status'] ?? ''));
                $labels[] = [
                    'time'  => trim((string)($ev['scanTime'] ?? $ev['time'] ?? $ev['acceptTime'] ?? $ev['date'] ?? '')),
                    'desc'  => sk_jt_localize_track_desc($rawDesc),
                    'label' => sk_jt_track_event_label($ev),
                    'raw'   => $ev,
                ];
            }

            $statusLine = $order['jt_courier_status'] ?? ($labels[0]['desc'] ?? null);
            if (is_string($statusLine) && $statusLine !== '') {
                $statusLine = sk_jt_localize_track_desc($statusLine);
            }

            return $this->success([
                'order_number'           => $order['order_number'] ?? null,
                'tracking_number'        => $billCode,
                'order_status'           => $order['status'] ?? null,
                'courier'                => 'jt_express',
                'courier_status'         => $statusLine,
                'processing_at'          => $order['processing_at'] ?? null,
                'jt_shipment_created_at' => $order['jt_shipment_created_at'] ?? null,
                'shipped_at'             => $order['shipped_at'] ?? null,
                'delivered_at'           => $order['delivered_at'] ?? null,
                'tracks'                 => $tracks,
                'events'                 => $labels,
                'has_tracking'           => true,
            ], !empty($result['success']) ? ($result['message'] ?? 'Tracking fetched.') : 'Showing saved tracking.');
        }

        if (!$order) {
            return $this->error('Shipment not found.', 404);
        }

        $stored = sk_jt_tracks_from_order($order);
        $labels = [];
        foreach ($stored as $ev) {
            $rawDesc = trim((string)($ev['desc'] ?? $ev['remark'] ?? $ev['scanType'] ?? $ev['status'] ?? ''));
            $labels[] = [
                'time'  => trim((string)($ev['scanTime'] ?? $ev['time'] ?? $ev['acceptTime'] ?? $ev['date'] ?? '')),
                'desc'  => sk_jt_localize_track_desc($rawDesc),
                'label' => sk_jt_track_event_label($ev),
                'raw'   => $ev,
            ];
        }

        $statusLine = $order['jt_courier_status'] ?? null;
        if (is_string($statusLine) && $statusLine !== '') {
            $statusLine = sk_jt_localize_track_desc($statusLine);
        }

        return $this->success([
            'order_number'    => $order['order_number'],
            'tracking_number' => $billCode ?: null,
            'order_status'    => $order['status'],
            'courier_status'  => $statusLine,
            'tracks'          => $stored,
            'events'          => $labels,
            'has_tracking'    => $billCode !== '',
            'message'         => $billCode === ''
                ? 'No tracking ID yet for this order. It will appear once the shipment is created.'
                : 'Courier live tracking is currently unavailable; showing last known status.',
        ]);
    }

    /**
     * JT Express tracking push (webhook).
     * Register this URL in JT Open Platform Console:
     *   POST {base}/shopkart-api/shipping/jt-webhook
     *
     * Docs: JT POSTs x-www-form-urlencoded with bizContent = JSON array of
     * { billCode, txlogisticId?, details[] }. Expects EXACT JSON ACK:
     *   { "code":"1", "msg":"success", "data":"SUCCESS" }
     * Joint-debugging fails if code!=1 or data is not the string "SUCCESS".
     */
    public function jt_webhook() {
        $this->load->helper('sk_jt_express');

        $raw = (string)$this->input->raw_input_stream;
        $payload = json_decode($raw, true);
        if (!is_array($payload) || !$payload) {
            $payload = $this->input->post(null, true);
            if (!is_array($payload)) {
                $payload = [];
            }
        }
        if (!$payload && !empty($_POST['bizContent'])) {
            $payload = ['bizContent' => $_POST['bizContent']];
        }
        // Raw body may be only bizContent=... (form)
        if (!$payload && $raw !== '' && stripos($raw, 'bizContent=') !== false) {
            parse_str($raw, $parsed);
            if (is_array($parsed) && $parsed) {
                $payload = $parsed;
            }
        }

        log_message('info', 'JT webhook headers apiAccount=' . ($this->input->get_request_header('apiAccount', true) ?: '')
            . ' digest=' . substr((string)($this->input->get_request_header('digest', true) ?: ''), 0, 20)
            . ' body=' . substr($raw !== '' ? $raw : json_encode($payload), 0, 2000));

        // TESTING: email raw webhook JSON to developer inbox
        $this->_jt_webhook_email_debug($raw, $payload);

        // Joint-debug / health probe with empty body — still ACK success so console "Passes".
        if (!$payload) {
            return $this->_jt_webhook_reply(true, 'success', 'SUCCESS');
        }

        $items = $this->_jt_webhook_expand_items($payload);
        if ($items) {
            $results = [];
            foreach ($items as $item) {
                if (is_array($item)) {
                    $results[] = sk_jt_apply_webhook_payload($item);
                }
            }
            $okCount = 0;
            foreach ($results as $r) {
                if (!empty($r['success'])) {
                    $okCount++;
                }
            }
            log_message('info', 'JT webhook processed items=' . count($results) . ' ok=' . $okCount);
        } else {
            log_message('info', 'JT webhook no shipment items (still ACK): ' . substr(json_encode($payload), 0, 1000));
        }

        // Always return JT canonical success shape (do NOT put debug arrays in data).
        return $this->_jt_webhook_reply(true, 'success', 'SUCCESS');
    }

    /**
     * TESTING: email JT webhook payload JSON to velrke@gmail.com.
     * Failures are logged only — must never break JT ACK.
     */
    protected function _jt_webhook_email_debug(string $raw, array $payload): void {
        try {
            $this->load->helper('sk_mailer');
            $json = $payload
                ? json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
                : ($raw !== '' ? $raw : '(empty body)');
            $headers = [
                'apiAccount' => $this->input->get_request_header('apiAccount', true) ?: '',
                'digest'     => $this->input->get_request_header('digest', true) ?: '',
                'timestamp'  => $this->input->get_request_header('timestamp', true) ?: '',
                'method'     => $this->input->method(true),
                'ip'         => $this->input->ip_address(),
            ];
            $html = '<p><strong>JT Tracking Callback received</strong> @ '
                . htmlspecialchars(date('Y-m-d H:i:s')) . '</p>'
                . '<p>Headers:</p><pre style="white-space:pre-wrap;font-size:12px;">'
                . htmlspecialchars(json_encode($headers, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))
                . '</pre>'
                . '<p>Raw body:</p><pre style="white-space:pre-wrap;font-size:12px;">'
                . htmlspecialchars($raw !== '' ? $raw : '(empty)')
                . '</pre>'
                . '<p>Parsed JSON:</p><pre style="white-space:pre-wrap;font-size:12px;">'
                . htmlspecialchars((string)$json)
                . '</pre>';
            sk_send_mail(
                'velrke@gmail.com',
                'JT Debug',
                'JT webhook test — ' . date('Y-m-d H:i:s'),
                $html
            );
        } catch (Throwable $e) {
            log_message('error', 'JT webhook debug email failed: ' . $e->getMessage());
        }
    }

    /**
     * Expand JT push body into a list of shipment objects.
     * Supports: {bizContent:"[...]"}, {bizContent:{...}}, [{...}], {billCode,details}, etc.
     */
    protected function _jt_webhook_expand_items(array $payload): array {
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

        // Numeric list of shipments
        if (isset($payload[0]) && is_array($payload[0])) {
            return array_values(array_filter($payload, 'is_array'));
        }

        // Single shipment object
        if (isset($payload['billCode']) || isset($payload['billcode'])
            || isset($payload['txlogisticId']) || isset($payload['details'])) {
            return [$payload];
        }

        // Nested data list
        if (isset($payload['data']) && is_array($payload['data'])) {
            if (isset($payload['data'][0]) && is_array($payload['data'][0])) {
                return array_values(array_filter($payload['data'], 'is_array'));
            }
            return [$payload['data']];
        }

        return [];
    }

    /**
     * JT Open Platform / joint-debugging expected webhook response.
     * Must keep data as the literal string "SUCCESS".
     */
    protected function _jt_webhook_reply(bool $ok, string $msg = 'success', $data = 'SUCCESS') {
        http_response_code(200);
        header('Content-Type: application/json; charset=UTF-8');
        // Prefer exact JT sample field order / types (strings).
        $out = [
            'code' => $ok ? '1' : '0',
            'msg'  => $msg !== '' ? $msg : ($ok ? 'success' : 'fail'),
            'data' => (is_string($data) && $data !== '') ? $data : 'SUCCESS',
        ];
        echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
