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
                $labels[] = [
                    'time'  => trim((string)($ev['scanTime'] ?? $ev['time'] ?? $ev['acceptTime'] ?? $ev['date'] ?? '')),
                    'desc'  => trim((string)($ev['desc'] ?? $ev['remark'] ?? $ev['scanType'] ?? $ev['status'] ?? '')),
                    'label' => sk_jt_track_event_label($ev),
                    'raw'   => $ev,
                ];
            }

            return $this->success([
                'order_number'           => $order['order_number'] ?? null,
                'tracking_number'        => $billCode,
                'order_status'           => $order['status'] ?? null,
                'courier'                => 'jt_express',
                'courier_status'         => $order['jt_courier_status'] ?? ($labels[0]['desc'] ?? null),
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
            $labels[] = [
                'time'  => trim((string)($ev['scanTime'] ?? $ev['time'] ?? $ev['acceptTime'] ?? $ev['date'] ?? '')),
                'desc'  => trim((string)($ev['desc'] ?? $ev['remark'] ?? $ev['scanType'] ?? $ev['status'] ?? '')),
                'label' => sk_jt_track_event_label($ev),
                'raw'   => $ev,
            ];
        }

        return $this->success([
            'order_number'    => $order['order_number'],
            'tracking_number' => $billCode ?: null,
            'order_status'    => $order['status'],
            'courier_status'  => $order['jt_courier_status'] ?? null,
            'tracks'          => $stored,
            'events'          => $labels,
            'has_tracking'    => $billCode !== '',
            'message'         => $billCode === ''
                ? 'No tracking ID yet for this order. It will appear once the shipment is created.'
                : 'Courier live tracking is currently unavailable; showing last known status.',
        ]);
    }

    /**
     * JT Express status push webhook.
     * Register in JT Open Platform:
     *   POST {base}/shopkart-api/shipping/jt-webhook
     *
     * Every scan / status change must update our orders table
     * (jt_courier_status, jt_track_data, and portal status when applicable).
     */
    public function jt_webhook() {
        $raw = $this->input->raw_input_stream;
        $payload = json_decode($raw, true);
        if (!is_array($payload) || !$payload) {
            $payload = $this->input->post(null, true);
            if (!is_array($payload)) {
                $payload = [];
            }
        }
        // Also accept form field bizContent alone
        if (!$payload && !empty($_POST['bizContent'])) {
            $payload = ['bizContent' => $_POST['bizContent']];
        }

        if (!$payload) {
            log_message('error', 'JT webhook empty payload: ' . substr((string)$raw, 0, 2000));
            return $this->error('Empty webhook payload.', 400);
        }

        log_message('info', 'JT webhook received: ' . substr(json_encode($payload), 0, 2000));

        // Batch: array of shipments / details
        if (isset($payload[0]) && is_array($payload[0])) {
            $results = [];
            foreach ($payload as $item) {
                if (is_array($item)) {
                    $results[] = sk_jt_apply_webhook_payload($item);
                }
            }
            return $this->success(['results' => $results], 'JT webhook batch processed.');
        }

        $result = sk_jt_apply_webhook_payload($payload);
        if (empty($result['success'])) {
            // Still 200 so JT does not keep retrying forever for unknown AWBs
            return $this->success($result, $result['message'] ?? 'Order not matched.', 200);
        }
        return $this->success($result, 'JT status saved to database.');
    }
}
