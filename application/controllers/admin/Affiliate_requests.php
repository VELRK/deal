<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Affiliate_requests extends Sk_Base {

    public function __construct() {
        parent::__construct();
        $this->load->model('Sk_Affiliate_model');
    }

    public function index() {
        $filters = [
            'search' => $this->input->get('search', TRUE),
            'status' => $this->input->get('status', TRUE),
        ];
        $page = max(1, (int)($this->input->get('page') ?? 1));
        $vendorId = $this->current_vendor_id();

        $result = $this->Sk_Affiliate_model->get_all_product_requests(
            $filters,
            $vendorId,
            20,
            ($page - 1) * 20
        );

        $data['title']    = $vendorId ? 'Affiliate Product Requests' : 'Affiliate Product Requests';
        $data['requests'] = $result['rows'];
        $data['total']    = $result['total'];
        $data['counts']   = $result['counts'];
        $data['page']     = $page;
        $data['filters']  = $filters;
        $data['is_vendor'] = (bool)$vendorId;
        $this->render('affiliate_requests/index', $data);
    }

    public function approve($id) {
        $this->_update_status((int)$id, 'approved');
    }

    public function reject($id) {
        $this->_update_status((int)$id, 'rejected');
    }

    protected function _update_status(int $id, string $status): void {
        $request = $this->Sk_Affiliate_model->get_product_request_by_id($id);
        if (!$request) {
            show_404();
        }

        $vendorId = $this->current_vendor_id();
        if ($vendorId && !$this->Sk_Affiliate_model->product_request_belongs_to_vendor($request, $vendorId)) {
            show_error('Access denied.', 403);
        }

        $notes = trim($this->input->post('admin_notes', TRUE) ?: $this->input->post('reason', TRUE));
        if ($this->Sk_Affiliate_model->update_product_request_status($id, $status, $notes ?: null)) {
            $this->activity_log->log_admin('affiliate_product_requests', $status, $id);
            $this->session->set_flashdata('success', 'Request ' . $status . '.');
        } else {
            $this->session->set_flashdata('error', 'Could not update request.');
        }

        redirect('admin/affiliate-requests');
    }
}
