<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

class Affiliates extends Sk_Base {

    public function __construct() {
        parent::__construct();
        $this->require_affiliate_panel_access();
        $this->load->model('Sk_Affiliate_model');
        $this->Sk_Affiliate_model->ensure_vendor_affiliate_schema();
    }

    protected function require_affiliate_panel_access(): void {
        if (!$this->is_super_admin() && !$this->current_vendor_id()) {
            show_error('Access denied.', 403);
        }
    }

    protected function scoped_vendor_id(): ?int {
        return $this->current_vendor_id();
    }

    protected function affiliate_filters(): array {
        $filters = [
            'search'     => $this->input->get('search', TRUE),
            'status'     => $this->input->get('status', TRUE),
            'kyc_status' => $this->input->get('kyc_status', TRUE),
        ];
        if ($vid = $this->scoped_vendor_id()) {
            $filters['vendor_id'] = $vid;
        }
        return $filters;
    }

    protected function assert_affiliate_access(?array $aff): void {
        if (!$aff) {
            show_404();
        }
        $vid = $this->scoped_vendor_id();
        if ($vid && !$this->Sk_Affiliate_model->belongs_to_vendor($aff, $vid)) {
            show_error('Access denied.', 403);
        }
    }

    public function index() {
        $filters = $this->affiliate_filters();
        $page = max(1, (int)($this->input->get('page') ?? 1));
        $limit = 15;
        $result = $this->Sk_Affiliate_model->get_all($filters, $limit, ($page - 1) * $limit);
        $vendorId = $this->scoped_vendor_id();

        $data['title']      = $vendorId ? 'My Affiliates' : 'Affiliates';
        $data['affiliates'] = $result['rows'];
        $data['total']      = $result['total'];
        $data['page']       = $page;
        $data['limit']      = $limit;
        $data['filters']    = $filters;
        $data['counts']     = $this->Sk_Affiliate_model->status_counts($vendorId);
        $data['is_vendor_scope'] = (bool)$vendorId;
        $data['affiliate_discount_enabled'] = $this->Sk_Affiliate_model->is_checkout_discount_globally_enabled();
        $this->render('affiliates/list', $data);
    }

    public function add() {
        $data['title'] = 'Add Affiliate';
        $data['is_vendor_scope'] = (bool)$this->scoped_vendor_id();
        if ($this->is_super_admin() && !$this->scoped_vendor_id()) {
            $data['vendors'] = $this->Sk_Vendor_model->get_all(['status' => 'approved'], 500, 0)['rows'] ?? [];
        }
        $this->render('affiliates/form', $data);
    }

    public function store() {
        $name  = trim($this->input->post('name', TRUE));
        $email = trim($this->input->post('email', TRUE));
        $phone = trim($this->input->post('phone', TRUE));
        $promo = strtoupper(trim($this->input->post('promo_code', TRUE) ?: $this->Sk_Affiliate_model->generate_promo_code($name, $phone)));

        if (!$this->Sk_Affiliate_model->is_promo_code_available($promo)) {
            $this->session->set_flashdata('error', 'Promo code already exists in affiliates or promo codes.');
            redirect('admin/affiliates/add');
        }

        $payload = array_merge($this->_profile_input(), [
            'email'                     => $email,
            'password'                  => $this->input->post('password') ?: 'password',
            'promo_code'                => $promo,
            'commission_rate'           => $this->input->post('commission_rate') ?: 5,
            'customer_discount_percent' => $this->input->post('customer_discount_percent') ?: 0,
            'discount_active'           => $this->input->post('discount_active') ? 1 : 0,
            'status'                    => $this->input->post('status') ?: 'approved',
            'kyc_status'                => $this->input->post('kyc_status') ?: 'pending',
            'notes'                     => $this->input->post('notes'),
        ]);

        if ($vid = $this->scoped_vendor_id()) {
            $payload['vendor_id'] = $vid;
        } elseif ($this->is_super_admin()) {
            $postedVendor = (int)$this->input->post('vendor_id');
            if ($postedVendor) {
                $payload['vendor_id'] = $postedVendor;
            }
        }

        $id = $this->Sk_Affiliate_model->create($payload);
        $this->activity_log->log_admin('affiliates', 'create', $id);
        $this->session->set_flashdata('success', 'Affiliate created. Promo: ' . $promo);
        redirect('admin/affiliates/view/' . $id);
    }

    public function view($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $data['title'] = $aff['name'];
        $data['affiliate'] = $aff;
        $data['stats'] = $this->Sk_Affiliate_model->get_dashboard_stats((int)$id);
        $data['documents'] = $this->Sk_Affiliate_model->get_kyc_documents((int)$id);
        $data['commissions'] = $this->Sk_Affiliate_model->get_commissions((int)$id, 10, 0)['rows'];
        $data['payouts'] = $this->Sk_Affiliate_model->get_payouts((int)$id, 10, 0)['rows'];
        $data['is_vendor_scope'] = (bool)$this->scoped_vendor_id();
        $this->render('affiliates/view', $data);
    }

    public function edit($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $data['title'] = 'Edit Affiliate';
        $data['affiliate'] = $aff;
        $data['is_vendor_scope'] = (bool)$this->scoped_vendor_id();
        if ($this->is_super_admin() && !$this->scoped_vendor_id()) {
            $data['vendors'] = $this->Sk_Vendor_model->get_all(['status' => 'approved'], 500, 0)['rows'] ?? [];
        }
        $this->render('affiliates/form', $data);
    }

    public function update($id) {
        $id = (int)$id;
        $aff = $this->Sk_Affiliate_model->get_by_id($id);
        $this->assert_affiliate_access($aff);

        $promo = strtoupper(trim($this->input->post('promo_code', TRUE)));
        if ($promo && !$this->Sk_Affiliate_model->is_promo_code_available($promo, $id)) {
            $this->session->set_flashdata('error', 'Promo code already exists.');
            redirect('admin/affiliates/edit/' . $id);
        }

        $payload = array_merge($this->_profile_input(), [
            'email'                     => $this->input->post('email', TRUE),
            'promo_code'                => $promo,
            'commission_rate'           => $this->input->post('commission_rate'),
            'customer_discount_percent' => $this->input->post('customer_discount_percent'),
            'discount_active'           => $this->input->post('discount_active') ? 1 : 0,
            'status'                    => $this->input->post('status'),
            'kyc_status'                => $this->input->post('kyc_status'),
            'notes'                     => $this->input->post('notes'),
            'password'                  => $this->input->post('password', TRUE),
        ]);

        if ($this->is_super_admin() && !$this->scoped_vendor_id()) {
            $postedVendor = (int)$this->input->post('vendor_id');
            $payload['vendor_id'] = $postedVendor ?: null;
        }

        $this->Sk_Affiliate_model->update($id, $payload);
        $this->activity_log->log_admin('affiliates', 'update', $id);
        $this->session->set_flashdata('success', 'Affiliate updated.');
        redirect('admin/affiliates/view/' . $id);
    }

    public function delete($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $this->Sk_Affiliate_model->soft_delete((int)$id);
        $this->activity_log->log_admin('affiliates', 'delete', (int)$id);
        $this->session->set_flashdata('success', 'Affiliate removed.');
        redirect('admin/affiliates');
    }

    public function approve($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $this->Sk_Affiliate_model->update((int)$id, [
            'status'      => 'approved',
            'approved_at' => date('Y-m-d H:i:s'),
            'approved_by' => $this->admin['id'],
        ]);
        $this->activity_log->log_admin('affiliates', 'approve', (int)$id);
        $this->session->set_flashdata('success', 'Affiliate approved.');
        redirect('admin/affiliates/view/' . $id);
    }

    public function reject($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $this->Sk_Affiliate_model->update((int)$id, ['status' => 'rejected']);
        $this->activity_log->log_admin('affiliates', 'reject', (int)$id);
        $this->session->set_flashdata('success', 'Affiliate rejected.');
        redirect('admin/affiliates');
    }

    public function verify_kyc($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $this->Sk_Affiliate_model->update((int)$id, [
            'kyc_status'      => 'verified',
            'kyc_verified_at' => date('Y-m-d H:i:s'),
        ]);
        $this->session->set_flashdata('success', 'KYC verified.');
        redirect('admin/affiliates/view/' . $id);
    }

    public function check_promo() {
        $code = strtoupper(trim($this->input->get('code', TRUE)));
        $exclude = (int)$this->input->get('exclude');
        $this->json(['available' => $this->Sk_Affiliate_model->is_promo_code_available($code, $exclude ?: null)]);
    }

    public function settings() {
        if (!$this->is_super_admin() || $this->scoped_vendor_id()) {
            show_error('Access denied.', 403);
        }
        if ($this->input->method() === 'post') {
            $this->Sk_Admin_model->save_settings([
                'affiliate_promo_discount_enabled' => $this->input->post('affiliate_promo_discount_enabled') ? '1' : '0',
            ]);
            $this->session->set_flashdata('success', 'Affiliate checkout discount settings saved.');
        }
        redirect('admin/affiliates');
    }

    public function toggle_discount($id) {
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$id);
        $this->assert_affiliate_access($aff);
        $active = empty($aff['discount_active']) || (int)$aff['discount_active'] !== 1 ? 1 : 0;
        $this->Sk_Affiliate_model->update((int)$id, ['discount_active' => $active]);
        $this->session->set_flashdata('success', 'Checkout discount ' . ($active ? 'activated' : 'deactivated') . ' for ' . $aff['promo_code'] . '.');
        redirect('admin/affiliates');
    }

    public function export() {
        $vendorId = $this->scoped_vendor_id();
        $filters = $vendorId ? ['vendor_id' => $vendorId] : [];
        $result = $this->Sk_Affiliate_model->get_all($filters, 5000, 0);
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="affiliates_' . date('Y-m-d') . '.csv"');
        $out = fopen('php://output', 'w');
        fputcsv($out, ['ID', 'Name', 'Email', 'Phone', 'Promo', 'Status', 'KYC', 'Commission%', 'Pending', 'Paid', 'Checkout Orders']);
        foreach ($result['rows'] as $r) {
            fputcsv($out, [$r['id'], $r['name'], $r['email'], $r['phone'], $r['promo_code'], $r['status'], $r['kyc_status'],
                $r['commission_rate'], $r['pending_commission'], $r['paid_commission'], $r['total_sales']]);
        }
        fclose($out);
    }

    protected function _profile_input(): array {
        return [
            'name'                => $this->input->post('name', TRUE),
            'phone'               => $this->input->post('phone', TRUE),
            'address_line1'       => $this->input->post('address_line1', TRUE),
            'address_line2'       => $this->input->post('address_line2', TRUE),
            'city'                => $this->input->post('city', TRUE),
            'state'               => $this->input->post('state', TRUE),
            'pincode'             => $this->input->post('pincode', TRUE),
            'country'             => $this->input->post('country', TRUE) ?: 'India',
            'about'               => $this->input->post('about', TRUE),
            'bank_account_name'   => $this->input->post('bank_account_name', TRUE),
            'bank_account_number' => $this->input->post('bank_account_number', TRUE),
            'bank_ifsc'           => $this->input->post('bank_ifsc', TRUE),
            'bank_name'           => $this->input->post('bank_name', TRUE),
        ];
    }
}
