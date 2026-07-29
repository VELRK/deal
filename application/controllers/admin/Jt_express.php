<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

/**
 * JT Express module — list + detailed create/track UI.
 * Create / print / track / cancel actions stay on admin/Orders (shared).
 */
class Jt_express extends Sk_Base {

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

        // Soft refresh tracking when AWB exists (reuse Orders private via load)
        if (!empty($order['jt_bill_code'])
            && !in_array($order['status'], ['cancelled', 'returned'], true)
        ) {
            $this->_refresh_tracking($id, $order, $settings);
            $order = $this->Sk_Order_model->get_by_id($id);
        }

        $data['title']    = 'JT Express — ' . ($order['order_number'] ?? $id);
        $data['order']    = $order;
        $data['settings'] = $settings;
        $data['enabled']  = !empty($settings['jt_express_enabled']) && $settings['jt_express_enabled'] !== '0';
        $data['tracks']   = sk_jt_tracks_from_order($order);
        $this->render('jt_express/view', $data);
    }

    private function _refresh_tracking(int $orderId, array $order, array $settings): void {
        $billCode = $order['jt_bill_code'] ?? $order['tracking_number'] ?? '';
        if ($billCode === '') {
            return;
        }
        require_once APPPATH . 'libraries/Jt_express.php';
        $jt = new Jt_express($settings);
        if (!$jt->is_enabled()) {
            return;
        }
        $result = $jt->track($billCode);
        if (!empty($result['success'])) {
            sk_jt_sync_order_tracking($orderId, $result);
        }
    }
}
