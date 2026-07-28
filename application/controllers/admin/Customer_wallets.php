<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Customer_wallets extends Sk_Base {

    public function __construct() {
        parent::__construct();
        if (!$this->is_super_admin() && !$this->current_vendor_id()) {
            show_error('Access denied.', 403);
        }
        $this->load->model('Sk_Customer_wallet_model');
    }

    protected function scoped_vendor_id(): ?int {
        return $this->current_vendor_id();
    }

    public function index() {
        $filters = ['search' => $this->input->get('search', TRUE)];
        $page = max(1, (int)($this->input->get('page') ?? 1));
        $result = $this->Sk_Customer_wallet_model->get_all($filters, 20, ($page - 1) * 20);

        $data['title']   = $this->scoped_vendor_id() ? 'Customer Wallets' : 'Customer Wallets';
        $data['wallets'] = $result['rows'];
        $data['total']   = $result['total'];
        $data['page']    = $page;
        $data['filters'] = $filters;
        $data['is_vendor_scope'] = (bool)$this->scoped_vendor_id();
        $data['discount_percent'] = $this->Sk_Customer_wallet_model->get_wallet_discount_percent();
        $data['wallet_enabled'] = $this->Sk_Customer_wallet_model->is_enabled();
        $data['settings'] = $this->Sk_Admin_model->get_settings();
        $this->render('customer_wallets/index', $data);
    }

    public function view($user_id) {
        $user_id = (int)$user_id;
        $user = $this->Sk_User_model->get_by_id($user_id);
        if (!$user) {
            show_404();
        }

        $page = max(1, (int)($this->input->get('page') ?? 1));
        $result = $this->Sk_Customer_wallet_model->get_transactions($user_id, 20, ($page - 1) * 20);

        $data['title'] = 'Wallet — ' . $user['name'];
        $data['user'] = $user;
        $wallet = $this->Sk_Customer_wallet_model->get_wallet($user_id);
        if ($wallet) {
            $wallet['balance'] = $this->Sk_Customer_wallet_model->resolve_wallet_balance($user_id);
        }
        $data['wallet'] = $wallet;
        $this->load->helper('sk_royalty');
        sk_royalty_ensure_schema();
        $this->load->model('Sk_Royalty_model');
        $royInfo = $this->Sk_Royalty_model->get_info($user_id);
        $data['royalty_points'] = (int)($royInfo['points'] ?? 0);
        $data['royalty_rm'] = (float)($royInfo['balance_rm'] ?? 0);
        $data['transactions'] = $result['rows'];
        $data['total'] = $result['total'];
        $data['page'] = $page;
        $data['is_vendor_scope'] = (bool)$this->scoped_vendor_id();
        $data['discount_percent'] = $this->Sk_Customer_wallet_model->get_wallet_discount_percent();
        $this->render('customer_wallets/view', $data);
    }

    public function add_funds($user_id) {
        $user_id = (int)$user_id;
        $user = $this->Sk_User_model->get_by_id($user_id);
        if (!$user) {
            show_404();
        }

        $amount = (float)$this->input->post('amount');
        $desc   = $this->input->post('description', TRUE) ?: ($this->scoped_vendor_id() ? 'Vendor credit' : 'Admin credit');

        if ($amount <= 0) {
            $this->session->set_flashdata('error', 'Invalid amount.');
        } elseif ($this->Sk_Customer_wallet_model->add_funds($user_id, $amount, $desc, $this->admin['id'])) {
            $this->activity_log->log_admin('customer_wallet', 'credit', $user_id, null, ['amount' => $amount], $this->scoped_vendor_id());
            $this->session->set_flashdata('success', 'Funds added.');
        } else {
            $this->session->set_flashdata('error', 'Failed.');
        }
        redirect('admin/customer-wallets/view/' . $user_id);
    }

    public function settings() {
        if (!$this->is_super_admin() || $this->scoped_vendor_id()) {
            show_error('Access denied.', 403);
        }
        if ($this->input->method() === 'post') {
            $this->Sk_Admin_model->save_settings([
                'customer_wallet_enabled'          => $this->input->post('customer_wallet_enabled') ? '1' : '0',
                'customer_wallet_discount_percent' => $this->input->post('customer_wallet_discount_percent') ?: '0',
                'wallet_points_per_rm'             => $this->input->post('wallet_points_per_rm') ?: '5',
                'royalty_enabled'                  => $this->input->post('royalty_enabled') ? '1' : '0',
                'royalty_min_redeem_points'        => (string)max(1, (int)$this->input->post('royalty_min_redeem_points')),
                'royalty_earn_points_per_rm'       => (string)max(0.01, (float)$this->input->post('royalty_earn_points_per_rm')),
                'currency_symbol'                  => $this->input->post('currency_symbol') ?: 'RM',
                'currency_code'                    => $this->input->post('currency_code') ?: 'MYR',
                'toyyibpay_secret_key'             => $this->input->post('toyyibpay_secret_key') ?: '',
                'toyyibpay_category_code'          => $this->input->post('toyyibpay_category_code') ?: '',
                'toyyibpay_sandbox'                => $this->input->post('toyyibpay_sandbox') ? '1' : '0',
                'payment_gateway'                  => in_array($this->input->post('payment_gateway'), ['razorpay', 'toyyibpay'], true)
                    ? $this->input->post('payment_gateway') : 'razorpay',
            ]);
            $this->session->set_flashdata('success', 'Wallet & royalty settings saved.');
            redirect('admin/customer-wallets');
        }
        redirect('admin/customer-wallets');
    }
}
