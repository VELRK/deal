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

        // Keep DB in sync with JT Express when admin opens the order
        if (!empty($data['order']['jt_bill_code'])
            && !in_array($data['order']['status'], ['cancelled', 'returned'], true)
        ) {
            $this->_jt_refresh_tracking((int)$id);
            $data['order'] = $this->Sk_Order_model->get_by_id($id);
        }

        $data['affiliate'] = null;
        $data['affiliate_commission'] = null;
        if (!empty($data['order']['affiliate_id']) || !empty($data['order']['affiliate_promo'])) {
            $this->load->model('Sk_Affiliate_model');
            if (!empty($data['order']['affiliate_id'])) {
                $data['affiliate'] = $this->Sk_Affiliate_model->get_by_id((int)$data['order']['affiliate_id']);
            } elseif (!empty($data['order']['affiliate_promo'])) {
                $data['affiliate'] = $this->Sk_Affiliate_model->get_by_promo($data['order']['affiliate_promo']);
            }
            $data['affiliate_commission'] = $this->db->where('order_id', (int)$id)
                ->order_by('id', 'DESC')
                ->limit(1)
                ->get('affiliate_commissions')
                ->row_array();
        }

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
                $this->load->helper(['sk_mailer', 'sk_whatsapp']);
                $settings = $this->Sk_Admin_model->get_settings();
                if ($tracking) {
                    $order['tracking_number'] = $tracking;
                }
                sk_mail_order_status($order, $status, $settings);
                sk_whatsapp_notify_order_status($order, $status, $settings);
            }
            return $this->json(['success' => true, 'message' => 'Order cancelled.']);
        }

        $this->Sk_Order_model->update_status($id, $status);
        if ($tracking) {
            $this->db->where('id', $id)->update('orders', ['tracking_number' => $tracking]);
        }
        $jtNotes = $this->_jt_handle_status_change((int)$id, $status, $orderBefore);
        $order = $this->Sk_Order_model->get_by_id($id);
        if ($order) {
            $this->load->helper(['sk_mailer', 'sk_whatsapp']);
            $settings = $this->Sk_Admin_model->get_settings();
            if ($tracking) $order['tracking_number'] = $tracking;
            sk_mail_order_status($order, $status, $settings);
            sk_whatsapp_notify_order_status($order, $status, $settings);
        }
        $message = 'Order status updated.';
        if ($jtNotes) {
            $message .= ' ' . implode(' ', $jtNotes);
        }
        $this->json(['success' => true, 'message' => $message, 'jt_notes' => $jtNotes]);
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
        $result = $this->_jt_create_shipment_for_order($order);
        if (!$result['success']) {
            return $this->json([
                'success' => false,
                'message' => $result['message'] ?? 'Failed to create JT shipment.',
                'raw'     => $result['raw'] ?? null,
            ]);
        }
        return $this->json([
            'success'   => true,
            'message'   => $result['message'] ?? 'JT shipment created.',
            'bill_code' => $result['bill_code'] ?? '',
            'raw'       => $result['raw'] ?? null,
        ]);
    }

    public function jt_print($id) {
        $order = $this->Sk_Order_model->get_by_id((int)$id);
        if (!$order) {
            return $this->json(['success' => false, 'message' => 'Order not found.']);
        }
        $billCode = $order['jt_bill_code'] ?? $order['tracking_number'] ?? '';
        $txId = $order['jt_txlogistic_id'] ?? $order['order_number'] ?? '';
        if ($billCode === '' && $txId === '') {
            return $this->json(['success' => false, 'message' => 'No AWB yet. Create JT shipment first.']);
        }

        $settings = $this->Sk_Admin_model->get_settings();
        $this->load->library('Jt_express', $settings);
        $result = $this->jt_express->print_order($billCode, $txId);
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

        // Docs: sometimes only urlContent PDF link is returned (no base64)
        $url = $this->_jt_extract_label_url($result);
        if ($url !== '') {
            redirect($url);
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
        $txId = trim((string)($order['jt_txlogistic_id'] ?? $order['order_number'] ?? ''));
        if ($billCode === '' && $txId === '') {
            return $this->json(['success' => false, 'message' => 'No AWB to track.']);
        }

        $settings = $this->Sk_Admin_model->get_settings();
        $this->load->library('Jt_express', $settings);
        $result = $this->jt_express->track($billCode, $txId);
        $tracks = sk_jt_normalize_tracks($result);
        $msg = (string)($result['message'] ?? '');
        $rawCode = (string)(($result['raw']['code'] ?? '') ?: '');

        // Sandbox often returns "数据未找到" until the first scan exists — AWB create still succeeded
        $noTrackYet = (
            stripos($msg, '数据未找到') !== false
            || stripos($msg, 'not found') !== false
            || stripos($msg, 'no data') !== false
            || $rawCode === '999001030'
        );

        if (!empty($result['success'])) {
            $sync = sk_jt_sync_order_tracking((int)$id, $result);
            $tracks = $sync['tracks'] ?? $tracks;
            $msgOut = $msg !== '' ? $msg : 'Tracking fetched.';
            if (!empty($sync['status_changed'])) {
                $msgOut .= ' Order status updated to ' . ($sync['status'] ?? '') . '.';
            }
            return $this->json([
                'success'        => true,
                'message'        => $msgOut,
                'tracks'         => $tracks,
                'bill_code'      => $billCode,
                'status'         => $sync['status'] ?? ($order['status'] ?? null),
                'status_changed' => !empty($sync['status_changed']),
                'previous_status'=> $sync['previous_status'] ?? null,
                'courier_status' => $sync['courier_status'] ?? null,
                'raw'            => $result['raw'] ?? null,
            ]);
        }

        if ($noTrackYet && $billCode !== '') {
            $this->Sk_Order_model->update_jt_shipment((int)$id, [
                'jt_courier_status' => 'AWB created — waiting for first JT scan',
            ]);
            return $this->json([
                'success' => true,
                'message' => 'AWB ' . $billCode . ' is valid, but JT has no tracking scans yet (normal in sandbox until pickup).',
                'tracks'  => [],
                'bill_code' => $billCode,
                'raw'     => $result['raw'] ?? null,
            ]);
        }

        return $this->json([
            'success' => false,
            'message' => $msg !== '' ? $msg : 'Track failed.',
            'tracks'  => $tracks,
            'bill_code' => $billCode,
            'raw'     => $result['raw'] ?? null,
        ]);
    }

    public function jt_cancel($id) {
        $order = $this->Sk_Order_model->get_by_id((int)$id);
        if (!$order) {
            return $this->json(['success' => false, 'message' => 'Order not found.']);
        }
        $txId = $order['jt_txlogistic_id'] ?? $order['order_number'] ?? '';
        $billCode = trim((string)($order['jt_bill_code'] ?? $order['tracking_number'] ?? ''));
        if ($txId === '' && $billCode === '') {
            return $this->json(['success' => false, 'message' => 'No JT shipment to cancel.']);
        }

        $settings = $this->Sk_Admin_model->get_settings();
        $this->load->library('Jt_express', $settings);
        $reason = trim((string)$this->input->post('reason', TRUE)) ?: 'Cancelled by admin';
        $result = $this->jt_express->cancel_order($txId, $reason, $billCode);

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

    private function _jt_create_shipment_for_order(array $order): array {
        if (!empty($order['jt_bill_code'])) {
            return [
                'success'  => true,
                'message'  => 'JT shipment already exists. AWB: ' . $order['jt_bill_code'],
                'bill_code'=> $order['jt_bill_code'],
            ];
        }
        if (in_array($order['status'], ['cancelled', 'returned'], true)) {
            return ['success' => false, 'message' => 'Cannot ship a cancelled/returned order.'];
        }

        $settings = $this->Sk_Admin_model->get_settings();
        $this->load->helper('sk_jt_express');
        // Always construct fresh (CI will not re-run constructor if library already loaded).
        require_once APPPATH . 'libraries/Jt_express.php';
        $this->jt_express = new Jt_express($settings);
        if (!$this->jt_express->is_enabled()) {
            return ['success' => false, 'message' => 'Enable JT Express in Settings → JT Express tab.'];
        }

        $identity = $this->jt_express->debug_identity();
        $sandboxOn = sk_jt_express_is_sandbox($settings);

        // Sandbox uses editable Settings sender; production uses config sender.
        if ($sandboxOn) {
            $missing = [];
            foreach (['jt_express_sender_phone' => 'Sender phone', 'jt_express_sender_address' => 'Sender address',
                      'jt_express_sender_city' => 'Sender city', 'jt_express_sender_state' => 'Sender state',
                      'jt_express_sender_postcode' => 'Sender postcode'] as $key => $label) {
                if (trim((string)($settings[$key] ?? '')) === '') {
                    $missing[] = $label;
                }
            }
            if ($missing) {
                return [
                    'success' => false,
                    'message' => 'Cannot create JT order. Fill in Settings → JT Express: ' . implode(', ', $missing) . '.',
                ];
            }
        }
        if (trim((string)($order['shipping_phone'] ?? '')) === '' || trim((string)($order['shipping_pincode'] ?? '')) === '') {
            return [
                'success' => false,
                'message' => 'Cannot create JT order. Customer shipping phone and postcode are required.',
            ];
        }

        $result = $this->jt_express->add_order($order);
        if (!$result['success']) {
            log_message('error', 'JT addOrder failed for order ' . $order['order_number'] . ': ' . json_encode($result['raw'] ?? $result['message']));
            $msg = $result['message'] ?? 'Failed to create JT shipment.';
            if (stripos($msg, 'API account does not exist') !== false) {
                $msg .= ' [mode=' . $identity['mode'] . ', apiAccount=' . $identity['api_account']
                    . ', url=' . $identity['base_url'] . '] Turn Sandbox OFF and deploy latest code including application/config/jt_express.php.';
            }
            return [
                'success' => false,
                'message' => $msg,
                'raw'     => $result['raw'] ?? null,
                'debug'   => $identity,
            ];
        }

        $billCode = $result['bill_code'] ?? '';
        if ($billCode === '' && is_array($result['data'] ?? null)) {
            foreach (['billCode', 'billcode', 'waybillNo', 'mailNo'] as $k) {
                if (!empty($result['data'][$k])) {
                    $billCode = (string)$result['data'][$k];
                    break;
                }
            }
        }
        $txId     = $order['order_number'];
        $now      = date('Y-m-d H:i:s');
        $update = [
            'courier_provider'       => 'jt_express',
            'jt_txlogistic_id'       => $txId,
            'jt_bill_code'           => $billCode ?: null,
            'jt_courier_status'      => $billCode ? 'ready_for_pickup' : 'submitted_no_awb',
            'tracking_number'        => $billCode ?: ($order['tracking_number'] ?? null),
            'jt_shipment_created_at' => $now,
            'jt_track_data'          => json_encode($result['raw'] ?? $result['data']),
        ];
        if (empty($order['processing_at'])) {
            $update['processing_at'] = $now;
        }
        if (in_array($order['status'], ['pending', 'confirmed'], true)) {
            $this->Sk_Order_model->update_status((int)$order['id'], 'processing');
            $update['status'] = 'processing';
        }
        $this->Sk_Order_model->update_jt_shipment((int)$order['id'], $update);

        return [
            'success'   => true,
            'message'   => $billCode ? 'JT shipment created. AWB: ' . $billCode : ($result['message'] ?? 'JT order submitted.'),
            'bill_code' => $billCode,
            'raw'       => $result['raw'] ?? null,
        ];
    }

    private function _jt_handle_status_change(int $orderId, string $newStatus, array $orderBefore): array {
        $notes = [];
        $settings = $this->Sk_Admin_model->get_settings();
        if (empty($settings['jt_express_enabled']) || $settings['jt_express_enabled'] === '0') {
            return $notes;
        }

        $order = $this->Sk_Order_model->get_by_id($orderId);
        if (!$order || in_array($newStatus, ['cancelled', 'returned'], true)) {
            return $notes;
        }

        // Create JT order when moving to Ready to Pick Up / Shipped if not created yet
        if (in_array($newStatus, ['processing', 'shipped'], true) && empty($order['jt_bill_code'])) {
            $created = $this->_jt_create_shipment_for_order($order);
            if (!empty($created['message'])) {
                $notes[] = $created['message'];
            }
            if (empty($created['success'])) {
                $notes[] = 'JT shipment was NOT created — check Settings → JT Express (sender address/phone) and API credentials.';
            }
        }

        $order = $this->Sk_Order_model->get_by_id($orderId);
        if (!empty($order['jt_bill_code'])) {
            $sync = $this->_jt_refresh_tracking($orderId);
            if (!empty($sync['message'])) {
                $notes[] = $sync['message'];
            }
        }

        return $notes;
    }

    private function _jt_refresh_tracking(int $orderId): array {
        $order = $this->Sk_Order_model->get_by_id($orderId);
        if (!$order) {
            return ['success' => false, 'message' => 'Order not found.'];
        }
        $billCode = $order['jt_bill_code'] ?? $order['tracking_number'] ?? '';
        if ($billCode === '') {
            return ['success' => false, 'message' => ''];
        }

        $settings = $this->Sk_Admin_model->get_settings();
        $this->load->library('Jt_express', $settings);
        if (!$this->jt_express->is_enabled()) {
            return ['success' => false, 'message' => ''];
        }

        $result = $this->jt_express->track($billCode);
        if (!$result['success']) {
            return ['success' => false, 'message' => 'JT track sync failed: ' . ($result['message'] ?? 'Unknown error')];
        }

        $tracks = sk_jt_normalize_tracks($result);
        $this->_jt_apply_tracking_sync($orderId, $result, $tracks);
        return ['success' => true, 'message' => 'JT tracking synced.'];
    }

    private function _jt_apply_tracking_sync(int $orderId, array $trackResult, array $tracks): void {
        sk_jt_sync_order_tracking($orderId, $trackResult);
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

    private function _jt_extract_label_url(array $result): string {
        $data = $result['data'] ?? [];
        if (!is_array($data)) {
            $data = $result['raw']['data'] ?? [];
        }
        if (!is_array($data)) {
            return '';
        }
        foreach (['urlContent', 'url', 'pdfUrl', 'fileUrl'] as $k) {
            if (!empty($data[$k]) && is_string($data[$k]) && preg_match('#^https?://#i', $data[$k])) {
                return $data[$k];
            }
        }
        if (!empty($data[0]['urlContent']) && is_string($data[0]['urlContent'])) {
            return $data[0]['urlContent'];
        }
        return '';
    }

    private function _jt_cancel_if_needed(array $order) {
        $txId = $order['jt_txlogistic_id'] ?? $order['order_number'] ?? '';
        $billCode = trim((string)($order['jt_bill_code'] ?? $order['tracking_number'] ?? ''));
        if ($txId === '' && $billCode === '') {
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
        $result = $this->jt_express->cancel_order($txId, 'Cancelled with order', $billCode);
        if (!empty($result['success'])) {
            $this->Sk_Order_model->update_jt_shipment((int)$order['id'], [
                'jt_courier_status' => 'cancelled',
                'jt_bill_code'      => null,
            ]);
        }
    }
}
