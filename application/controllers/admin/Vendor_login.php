<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Vendor_login extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Sk_Vendor_model');
        $this->load->library('session');
        $this->load->helper(['url', 'form']);
    }

    public function index() {
        if ($this->session->userdata('sk_vendor_login')) {
            redirect('admin/dashboard');
        }
        if ($this->session->userdata('sk_admin_id')) {
            redirect('admin/dashboard');
        }
        $data['title'] = 'Vendor Login - ShopKart';
        $this->load->view('admin/vendor_login', $data);
    }

    public function submit() {
        $email    = $this->input->post('email', TRUE);
        $password = $this->input->post('password', TRUE);

        $vendor = $this->Sk_Vendor_model->get_by_email($email);

        if (!$vendor) {
            $this->session->set_flashdata('error', 'Invalid email or password.');
            redirect('admin/vendor/login');
        }

        if ($vendor['status'] !== 'approved') {
            $this->session->set_flashdata('error', 'Your vendor account is not approved yet. Status: ' . $vendor['status']);
            redirect('admin/vendor/login');
        }

        if (empty($vendor['password'])) {
            $this->session->set_flashdata('error', 'No password set. Contact admin to reset your vendor password.');
            redirect('admin/vendor/login');
        }

        if (!$this->Sk_Vendor_model->verify_password($password, $vendor['password'])) {
            $this->session->set_flashdata('error', 'Invalid email or password.');
            redirect('admin/vendor/login');
        }

        $this->session->set_userdata([
            'sk_vendor_login' => true,
            'sk_vendor_id'    => (int)$vendor['id'],
            'sk_vendor_name'  => $vendor['business_name'] ?: $vendor['owner_name'],
            'sk_vendor_email' => $vendor['email'],
        ]);

        redirect('admin/dashboard');
    }

    public function logout() {
        $this->session->unset_userdata(['sk_vendor_login', 'sk_vendor_id', 'sk_vendor_name', 'sk_vendor_email']);
        redirect('admin/vendor/login');
    }
}
