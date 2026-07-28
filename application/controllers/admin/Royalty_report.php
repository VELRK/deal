<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Royalty_report extends Sk_Base {

    public function __construct() {
        parent::__construct();
        if (!$this->is_super_admin() && !$this->current_vendor_id()) {
            show_error('Access denied.', 403);
        }
        $this->load->model('Sk_Royalty_model');
        $this->load->helper('sk_royalty');
        sk_royalty_ensure_schema();
    }

    public function index() {
        $filters = [
            'search' => $this->input->get('search', TRUE),
            'from'   => $this->input->get('from', TRUE),
            'to'     => $this->input->get('to', TRUE),
            'type'   => $this->input->get('type', TRUE),
        ];
        $page = max(1, (int)($this->input->get('page') ?? 1));
        $result = $this->Sk_Royalty_model->get_report($filters, 50, ($page - 1) * 50);

        $data['title']         = 'Royalty Points Report';
        $data['rows']          = $result['rows'];
        $data['total']         = $result['total'];
        $data['summary']       = $result['summary'];
        $data['page']          = $page;
        $data['filters']       = $filters;
        $data['points_per_rm'] = $this->Sk_Royalty_model->points_per_rm();
        $data['min_redeem']    = sk_royalty_min_redeem_points();
        $data['min_redeem_rm'] = sk_royalty_min_redeem_rm();
        $data['is_vendor']     = (bool)$this->current_vendor_id();
        $this->render('royalty/report', $data);
    }
}
