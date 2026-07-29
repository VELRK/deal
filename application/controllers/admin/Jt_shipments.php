<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

/**
 * JT Express module — list + detailed create/track UI.
 * Controller name Jt_shipments avoids PHP class clash with libraries/Jt_express.php.
 * Create / print / track / cancel actions stay on admin/Orders (shared).
 */
class Jt_shipments extends Sk_Base {

    public function __construct() {
        parent::__construct();
        $this->load->helper('sk_jt_express');
        sk_jt_express_ensure_schema();
    }

    public function index() {
        $settings = $this->Sk_Admin_model->get_settings();
        $page   = max(1, (int)$this->input->get('page'));
        $limit  = 20;
        $offset = ($page - 1) * $limit;
        $filters = [
            'scope'  => $this->input->get('scope', TRUE) ?: 'all',
            'search' => $this->input->get('search', TRUE),
        ];
        if (!in_array($filters['scope'], ['all', 'pending', 'created'], true)) {
            $filters['scope'] = 'all';
        }

        $result = $this->Sk_Order_model->get_jt_shipments($filters, $limit, $offset);

        $data['title']    = 'JT Express';
        $data['rows']     = $result['rows'];
        $data['total']    = $result['total'];
        $data['page']     = $page;
        $data['limit']    = $limit;
        $data['filters']  = $filters;
        $data['settings'] = $settings;
        $data['enabled']  = !empty($settings['jt_express_enabled']) && $settings['jt_express_enabled'] !== '0';
        $this->render('jt_express/index', $data);
    }

    public function view($id) {
        $id = (int)$id;
        $order = $this->Sk_Order_model->get_by_id($id);
        if (!$order) {
            show_404();
        }

        $settings = $this->Sk_Admin_model->get_settings();
        $statusBefore = (string)($order['status'] ?? '');
        $syncInfo = null;

        if (!empty($order['jt_bill_code'])
            && !in_array($order['status'], ['cancelled', 'returned'], true)
        ) {
            $syncInfo = $this->_refresh_tracking($id, $order, $settings);
            $order = $this->Sk_Order_model->get_by_id($id);
        }

        $data['title']    = 'JT Express — ' . ($order['order_number'] ?? $id);
        $data['order']    = $order;
        $data['settings'] = $settings;
        $data['enabled']  = !empty($settings['jt_express_enabled']) && $settings['jt_express_enabled'] !== '0';
        $data['tracks']   = sk_jt_tracks_from_order($order);
        $data['status_before'] = $statusBefore;
        $data['status_changed'] = !empty($syncInfo['status_changed']);
        $data['synced_status'] = $syncInfo['status'] ?? ($order['status'] ?? null);
        $this->render('jt_express/view', $data);
    }

    private function _refresh_tracking(int $orderId, array $order, array $settings): array {
        $billCode = $order['jt_bill_code'] ?? $order['tracking_number'] ?? '';
        if ($billCode === '') {
            return ['status_changed' => false];
        }
        $this->load->library('Jt_express', $settings, 'jt_api');
        if (!$this->jt_api->is_enabled()) {
            return ['status_changed' => false];
        }
        $result = $this->jt_api->track($billCode);
        if (!empty($result['success'])) {
            return sk_jt_sync_order_tracking($orderId, $result);
        }
        return ['status_changed' => false];
    }
}
