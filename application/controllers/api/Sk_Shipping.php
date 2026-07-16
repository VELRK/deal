<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Shipping extends Sk_Base_Api {

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
                $this->Sk_Order_model->update_jt_shipment((int)$order['id'], [
                    'jt_track_data' => json_encode($result['raw'] ?? $result['data']),
                ]);
            }
            return $this->success([
                'order_number'     => $order['order_number'],
                'tracking_number'  => $billCode,
                'order_status'     => $order['status'],
                'courier'          => 'jt_express',
                'courier_status'   => $order['jt_courier_status'] ?? null,
                'tracks'           => $this->_normalize_tracks($result),
                'raw'              => $result['raw'] ?? null,
            ], $result['message'] ?? 'Tracking fetched.');
        }

        return $this->success([
            'order_number'    => $order['order_number'],
            'tracking_number' => $billCode,
            'order_status'    => $order['status'],
            'tracks'          => [],
            'message'         => 'Courier tracking not available for this order.',
        ]);
    }

    private function _normalize_tracks(array $result) {
        $data = $result['data'] ?? $result['raw']['data'] ?? [];
        if (isset($data['details']) && is_array($data['details'])) {
            return $data['details'];
        }
        if (isset($data[0]['details']) && is_array($data[0]['details'])) {
            return $data[0]['details'];
        }
        if (isset($data['traces']) && is_array($data['traces'])) {
            return $data['traces'];
        }
        return is_array($data) ? $data : [];
    }
}
