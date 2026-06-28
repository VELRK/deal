<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Wallet extends Sk_Base {

    public function __construct() {
        parent::__construct();
        $this->load->model(['Sk_Wallet_model', 'Sk_Vendor_model']);
    }

    public function index() {
        $vid = $this->current_vendor_id();
        if ($vid) {
            redirect('admin/wallet/vendor/' . $vid);
        }
        $this->vendor_context->require_super_admin();

        $filters = ['search' => $this->input->get('search', TRUE)];
        $page = max(1, (int)($this->input->get('page') ?? 1));
        $limit = 15;
        $result = $this->Sk_Wallet_model->get_all_wallets($filters, $limit, ($page - 1) * $limit);

        $data['title']   = 'Vendor Wallets';
        $data['wallets'] = $result['rows'];
        $data['total']   = $result['total'];
        $data['page']    = $page;
        $data['limit']   = $limit;
        $data['filters'] = $filters;
        $this->render('wallet/index', $data);
    }

    public function vendor($vendor_id) {
        $vendor_id = (int)$vendor_id;
        if ($this->current_vendor_id() && $this->current_vendor_id() !== $vendor_id) {
            show_error('Access denied.', 403);
        }

        $vendor = $this->Sk_Vendor_model->get_by_id($vendor_id, false);
        if (!$vendor) show_404();

        $page = max(1, (int)($this->input->get('page') ?? 1));
        $limit = 20;
        $result = $this->Sk_Wallet_model->get_transactions($vendor_id, $limit, ($page - 1) * $limit);

        $data['title']        = 'Wallet — ' . $vendor['business_name'];
        $data['vendor']       = $vendor;
        $data['wallet']       = $this->Sk_Wallet_model->get_wallet($vendor_id);
        $data['transactions'] = $result['rows'];
        $data['total']        = $result['total'];
        $data['page']         = $page;
        $data['limit']        = $limit;
        $this->render('wallet/vendor', $data);
    }

    public function add_funds($vendor_id) {
        if (!$this->is_super_admin()) show_error('Access denied.', 403);
        $vendor_id = (int)$vendor_id;

        $amount = (float)$this->input->post('amount');
        $desc   = $this->input->post('description', TRUE) ?: 'Admin credit';

        if ($amount <= 0) {
            $this->session->set_flashdata('error', 'Invalid amount.');
            redirect('admin/wallet/vendor/' . $vendor_id);
        }

        if ($this->Sk_Wallet_model->add_funds($vendor_id, $amount, $desc, $this->admin['id'])) {
            $this->activity_log->log_admin('wallet', 'credit', $vendor_id, null, ['amount' => $amount], $vendor_id);
            $this->session->set_flashdata('success', 'Funds added successfully.');
        } else {
            $this->session->set_flashdata('error', 'Failed to add funds.');
        }
        redirect('admin/wallet/vendor/' . $vendor_id);
    }
}
