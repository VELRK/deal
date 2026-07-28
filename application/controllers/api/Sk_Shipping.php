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
     * Body: { tracking_number } or { order_number }
     */
    public function track() {
        $data = $this->body();
        $tracking = trim((string)($data['tracking_number'] ?? $data['bill_code'] ?? ''));
        $orderNo  = trim((string)($data['order_number'] ?? ''));

        $order = null;
        if ($tracking !== '') {
            $order = $this->Sk_Order_model->get_by_tracking($tracking);
        } elseif ($orderNo !== '') {
            $order = $this->db->where('order_number', $orderNo)->get('orders')->row_array();
            if ($order) {
                $order['items'] = $this->Sk_Order_model->get_items($order['id']);
            }
        }

        if (!$order) {
            return $this->error('Shipment not found.', 404);
        }

        $billCode = $order['jt_bill_code'] ?? $order['tracking_number'] ?? '';
        $settings = $this->get_settings();

        if (!empty($settings['jt_express_enabled']) && $settings['jt_express_enabled'] !== '0' && $billCode !== '') {
            $this->load->library('Jt_express', $settings);
            $result = $this->jt_express->track($billCode);
            if ($result['success']) {
                sk_jt_sync_order_tracking((int)$order['id'], $result);
                $order = $this->Sk_Order_model->get_by_id((int)$order['id']);
            }
            return $this->success([
                'order_number'       => $order['order_number'],
                'tracking_number'    => $billCode,
                'order_status'       => $order['status'],
                'courier'            => 'jt_express',
                'courier_status'     => $order['jt_courier_status'] ?? null,
                'processing_at'      => $order['processing_at'] ?? null,
                'jt_shipment_created_at' => $order['jt_shipment_created_at'] ?? null,
                'shipped_at'         => $order['shipped_at'] ?? null,
                'delivered_at'       => $order['delivered_at'] ?? null,
                'tracks'             => sk_jt_normalize_tracks($result),
                'raw'                => $result['raw'] ?? null,
            ], $result['message'] ?? 'Tracking fetched.');
        }

        return $this->success([
            'order_number'    => $order['order_number'],
            'tracking_number' => $billCode,
            'order_status'    => $order['status'],
            'tracks'          => sk_jt_tracks_from_order($order),
            'message'         => 'Courier tracking not available for this order.',
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
