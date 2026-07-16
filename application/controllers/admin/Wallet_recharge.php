<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Wallet_recharge extends Sk_Base {

    public function __construct() {
        parent::__construct();
        if (!$this->is_super_admin() && !$this->current_vendor_id()) {
            show_error('Access denied.', 403);
        }
        $this->load->model('Sk_Customer_wallet_model');
    }

    public function index() {
        $filters = [
            'search' => $this->input->get('search', TRUE),
            'from'   => $this->input->get('from', TRUE),
            'to'     => $this->input->get('to', TRUE),
        ];
        $page = max(1, (int)($this->input->get('page') ?? 1));
        $limit = 30;
        $result = $this->Sk_Customer_wallet_model->get_recharge_report($filters, $limit, ($page - 1) * $limit);

        $data['title'] = 'Wallet Recharge Report';
        $data['rows'] = $result['rows'];
        $data['total'] = $result['total'];
        $data['page'] = $page;
        $data['limit'] = $limit;
        $data['filters'] = $filters;
        $data['points_per_rm'] = $this->Sk_Customer_wallet_model->points_per_rm();
        $this->render('customer_wallets/recharge_report', $data);
    }
}
