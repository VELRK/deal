<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Orders extends Sk_Base {

    public function __construct() {
        parent::__construct();
        $this->load->helper(['sk_invoice', 'sk_jt_express']);
        sk_invoice_ensure_vendor_schema();
        sk_jt_express_ensure_schema();
    }

    public function index() {
        $page   = max(1, (int)$this->input->get('page'));
        $limit  = 15;
        $offset = ($page - 1) * $limit;
        $filters = [
            'status'         => $this->input->get('status', TRUE),
            'payment_status' => $this->input->get('payment_status', TRUE),
            'search'         => $this->input->get('search', TRUE),
        ];

        $data['title']   = 'Orders - ShopKart Admin';
        $data['orders']  = $this->Sk_Order_model->get_all_admin($limit, $offset, $filters);
        $data['total']   = $this->Sk_Order_model->count_admin($filters);
        $data['page']    = $page;
        $data['limit']   = $limit;
        $data['filters'] = $filters;
        $this->render('orders/list', $data);
    }

    public function view($id) {
        $data['title'] = 'Order Detail';
        $data['order'] = $this->Sk_Order_model->get_by_id($id);
        if (!$data['order']) show_404();
        $this->render('orders/view', $data);
    }

    public function update_status($id) {
        $allowed = ['pending','confirmed','processing','shipped','delivered','cancelled','returned'];
        $status  = $this->input->post('status', TRUE);
        if (!in_array($status, $allowed)) return $this->json(['success' => false, 'message' => 'Invalid status.']);

        $tracking = $this->input->post('tracking_number', TRUE);
        $orderBefore = $this->Sk_Order_model->get_by_id($id);
        if (!$orderBefore) {
            return $this->json(['success' => false, 'message' => 'Order not found.']);
        }

        if ($status === 'cancelled') {
            if ($orderBefore['status'] !== 'cancelled') {
                $this->_jt_cancel_if_needed($orderBefore);
                $settings = $this->Sk_Admin_model->get_settings();
                $result = $this->Sk_Order_model->cancel_order((int)$id, null, $settings, true);
                if (!$result['ok']) {
                    return $this->json(['success' => false, 'message' => $result['message']]);
                }
            }
            $order = $this->Sk_Order_model->get_by_id($id);
            if ($order) {
                $this->load->helper('sk_mailer');
                $settings = $this->Sk_Admin_model->get_settings();
                if ($tracking) {
                    $order['tracking_number'] = $tracking;
                }
                sk_mail_order_status($order, $status, $settings);
            }
            return $this->json(['success' => true, 'message' => 'Order cancelled.']);
        }

        $this->Sk_Order_model->update_status($id, $status);
        if ($tracking) {
            $this->db->where('id', $id)->update('orders', ['tracking_number' => $tracking]);
        }
        $order = $this->Sk_Order_model->get_by_id($id);
        if ($order) {
            $this->load->helper('sk_mailer');
            $settings = $this->Sk_Admin_model->get_settings();
            if ($tracking) $order['tracking_number'] = $tracking;
            sk_mail_order_status($order, $status, $settings);
        }
        $this->json(['success' => true, 'message' => 'Order status updated.']);
    }

    public function invoice($id) {
        $order = $this->Sk_Order_model->get_by_id($id);
        if (!$order) show_404();
        $settings = $this->Sk_Admin_model->get_settings();
        $invoice = sk_invoice_build($order, $settings);
        echo sk_invoice_render_html($invoice, false);
    }

    public function send_invoice($id) {
        $order = $this->Sk_Order_model->get_by_id($id);
        if (!$order) {
            return $this->json(['success' => false, 'message' => 'Order not found.']);
        }
        $settings = $this->Sk_Admin_model->get_settings();
        $this->load->helper('sk_mailer');
        $sent = sk_mail_order_invoice($order, $settings);
        if ($sent) {
            return $this->json(['success' => true, 'message' => 'Tax invoice emailed to ' . ($order['customer_email'] ?? 'customer') . '.']);
        }
        return $this->json(['success' => false, 'message' => 'Could not send invoice. Check SMTP settings and customer email.']);
    }

    public function jt_create($id) {
        $order = $this->Sk_Order_model->get_by_id((int)$id);
        if (!$order) {
            return $this->json(['success' => false, 'message' => 'Order not found.']);
        }
        if (!empty($order['jt_bill_code'])) {
            return $this->json(['success' => false, 'message' => 'JT shipment already exists. AWB: ' . $order['jt_bill_code']]);
        }
        if (in_array($order['status'], ['cancelled', 'returned'], true)) {
            return $this->json(['success' => false, 'message' => 'Cannot ship a cancelled/returned order.']);
        }

        $settings = $this->Sk_Admin_model->get_settings();
        $this->load->library('Jt_express', $settings);
        if (!$this->jt_express->is_enabled()) {
            return $this->json(['success' => false, 'message' => 'Enable JT Express in Settings → JT Express tab.']);
        }

        $result = $this->jt_express->add_order($order);
        if (!$result['success']) {
            return $this->json([
                'success' => false,
                'message' => $result['message'] ?? 'Failed to create JT shipment.',
                'raw'     => $result['raw'] ?? null,
            ]);
        }

        $billCode = $result['bill_code'] ?? '';
        $txId     = $order['order_number'];
        $this->Sk_Order_model->update_jt_shipment((int)$id, [
            'courier_provider'       => 'jt_express',
            'jt_txlogistic_id'       => $txId,
            'jt_bill_code'           => $billCode ?: null,
            'jt_courier_status'      => 'created',
            'tracking_number'        => $billCode ?: ($order['tracking_number'] ?? null),
            'jt_shipment_created_at' => date('Y-m-d H:i:s'),
            'status'                 => in_array($order['status'], ['pending', 'confirmed', 'processing'], true) ? 'processing' : $order['status'],
        ]);

        return $this->json([
            'success'   => true,
            'message'   => $billCode ? 'JT shipment created. AWB: ' . $billCode : ($result['message'] ?? 'JT order submitted.'),
            'bill_code' => $billCode,
            'raw'       => $result['raw'] ?? null,
        ]);
    }

    public function jt_print($id) {
        $order = $this->Sk_Order_model->get_by_id((int)$id);
        if (!$order) {
            return $this->json(['success' => false, 'message' => 'Order not found.']);
        }
        $billCode = $order['jt_bill_code'] ?? $order['tracking_number'] ?? '';
        if ($billCode === '') {
            return $this->json(['success' => false, 'message' => 'No AWB yet. Create JT shipment first.']);
        }

        $settings = $this->Sk_Admin_model->get_settings();
        $this->load->library('Jt_express', $settings);
        $result = $this->jt_express->print_order($billCode);
        if (!$result['success']) {
            return $this->json(['success' => false, 'message' => $result['message'] ?? 'Print failed.', 'raw' => $result['raw'] ?? null]);
        }

        $labelPayload = $result['data'] ?? $result['raw'];
        if (is_array($labelPayload)) {
            $labelPayload = json_encode($labelPayload);
        }
        $this->Sk_Order_model->update_jt_shipment((int)$id, ['jt_label_data' => $labelPayload]);

        $pdfB64 = $this->_jt_extract_label_base64($result);
        if ($pdfB64 !== '') {
            header('Content-Type: application/pdf');
            header('Content-Disposition: inline; filename="jt-label-' . preg_replace('/[^a-zA-Z0-9_-]/', '', $order['order_number']) . '.pdf"');
            echo base64_decode($pdfB64);
            return;
        }

        return $this->json([
            'success' => true,
            'message' => $result['message'] ?? 'Label fetched.',
            'data'    => $result['data'] ?? null,
            'raw'     => $result['raw'] ?? null,
        ]);
    }

    public function jt_track($id) {
        $order = $this->Sk_Order_model->get_by_id((int)$id);
        if (!$order) {
            return $this->json(['success' => false, 'message' => 'Order not found.']);
        }
        $billCode = $order['jt_bill_code'] ?? $order['tracking_number'] ?? '';
        if ($billCode === '') {
            return $this->json(['success' => false, 'message' => 'No AWB to track.']);
        }

        $settings = $this->Sk_Admin_model->get_settings();
        $this->load->library('Jt_express', $settings);
        $result = $this->jt_express->track($billCode);
        if ($result['success']) {
            $this->Sk_Order_model->update_jt_shipment((int)$id, [
                'jt_track_data' => json_encode($result['raw'] ?? $result['data']),
            ]);
        }
        return $this->json([
            'success' => $result['success'],
            'message' => $result['message'] ?? '',
            'tracks'  => $this->_jt_normalize_tracks($result),
            'raw'     => $result['raw'] ?? null,
        ]);
    }

    public function jt_cancel($id) {
        $order = $this->Sk_Order_model->get_by_id((int)$id);
        if (!$order) {
            return $this->json(['success' => false, 'message' => 'Order not found.']);
        }
        $txId = $order['jt_txlogistic_id'] ?? $order['order_number'] ?? '';
        if ($txId === '' && empty($order['jt_bill_code'])) {
            return $this->json(['success' => false, 'message' => 'No JT shipment to cancel.']);
        }

        $settings = $this->Sk_Admin_model->get_settings();
        $this->load->library('Jt_express', $settings);
        $reason = trim((string)$this->input->post('reason', TRUE)) ?: 'Cancelled by admin';
        $result = $this->jt_express->cancel_order($txId, $reason);

        if ($result['success']) {
            $this->Sk_Order_model->update_jt_shipment((int)$id, [
                'jt_courier_status' => 'cancelled',
                'jt_bill_code'      => null,
            ]);
        }

        return $this->json([
            'success' => $result['success'],
            'message' => $result['message'] ?? ($result['success'] ? 'JT shipment cancelled.' : 'Cancel failed.'),
            'raw'     => $result['raw'] ?? null,
        ]);
    }

    private function _jt_extract_label_base64(array $result) {
        $data = $result['data'] ?? [];
        if (is_string($data) && strlen($data) > 100) {
            return $data;
        }
        if (!is_array($data)) {
            $data = $result['raw']['data'] ?? [];
        }
        foreach (['base64EncodeContent', 'base64', 'pdfBase64', 'content', 'label'] as $k) {
            if (!empty($data[$k]) && is_string($data[$k])) {
                return $data[$k];
            }
        }
        if (!empty($data[0]['base64EncodeContent'])) {
            return $data[0]['base64EncodeContent'];
        }
        return '';
    }

    private function _jt_normalize_tracks(array $result) {
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
        if (is_array($data) && isset($data[0]['scanTime'])) {
            return $data;
        }
        return is_array($data) ? $data : [];
    }

    private function _jt_cancel_if_needed(array $order) {
        $txId = $order['jt_txlogistic_id'] ?? $order['order_number'] ?? '';
        if ($txId === '' && empty($order['jt_bill_code'])) {
            return;
        }
        if (($order['jt_courier_status'] ?? '') === 'cancelled') {
            return;
        }
        $settings = $this->Sk_Admin_model->get_settings();
        if (empty($settings['jt_express_enabled']) || $settings['jt_express_enabled'] === '0') {
            return;
        }
        $this->load->library('Jt_express', $settings);
        if (!$this->jt_express->is_enabled()) {
            return;
        }
        $result = $this->jt_express->cancel_order($txId, 'Cancelled with order');
        if (!empty($result['success'])) {
            $this->Sk_Order_model->update_jt_shipment((int)$order['id'], [
                'jt_courier_status' => 'cancelled',
                'jt_bill_code'      => null,
            ]);
        }
    }
}
