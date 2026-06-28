<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Affiliate_Base.php';

class Affiliate_login extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Sk_Affiliate_model');
        $this->load->library('session');
        $this->load->helper(['url', 'form']);
    }

    public function index() {
        if ($this->session->userdata('sk_affiliate_login')) {
            redirect('admin/affiliate/dashboard');
        }
        $data['title'] = 'Affiliate Login - ShopKart';
        $this->load->view('affiliate/login', $data);
    }

    public function register() {
        if ($this->session->userdata('sk_affiliate_login')) {
            redirect('admin/affiliate/dashboard');
        }
        $data['title'] = 'Affiliate Registration - ShopKart';
        $this->load->view('affiliate/register', $data);
    }

    public function register_submit() {
        $name  = trim($this->input->post('name', TRUE));
        $email = trim($this->input->post('email', TRUE));
        $phone = trim($this->input->post('phone', TRUE));
        $pass  = $this->input->post('password', TRUE);

        if (!$name || !$email || !$phone || !$pass) {
            $this->session->set_flashdata('error', 'All fields are required.');
            redirect('admin/affiliate/register');
        }
        if ($this->Sk_Affiliate_model->get_by_email($email)) {
            $this->session->set_flashdata('error', 'Email already registered.');
            redirect('admin/affiliate/register');
        }

        $promo = strtoupper(trim($this->input->post('promo_code', TRUE) ?: ''));
        if ($promo === '') {
            $promo = $this->Sk_Affiliate_model->generate_promo_code($name, $phone);
        }
        if (!$this->Sk_Affiliate_model->is_promo_code_available($promo)) {
            $this->session->set_flashdata('error', 'Promo code already exists. Choose another.');
            redirect('admin/affiliate/register');
        }

        $settings = $this->db->where('key', 'affiliate_default_commission')->get('settings')->row_array();
        $rate = (float)($settings['value'] ?? 5);

        $id = $this->Sk_Affiliate_model->create([
            'name'            => $name,
            'email'           => $email,
            'phone'           => $phone,
            'password'        => $pass,
            'promo_code'      => $promo,
            'commission_rate' => $rate,
            'status'          => 'pending',
            'kyc_status'      => 'pending',
        ]);

        $this->session->set_flashdata('success', 'Registration submitted! Your promo code: ' . $promo . '. Await admin approval.');
        redirect('admin/affiliate/login');
    }

    public function submit() {
        $email = trim($this->input->post('email', TRUE));
        $pass  = $this->input->post('password', TRUE);
        $aff   = $this->Sk_Affiliate_model->get_by_email($email);

        if (!$aff || !$this->Sk_Affiliate_model->verify_password($pass, $aff['password'])) {
            $this->session->set_flashdata('error', 'Invalid email or password.');
            redirect('admin/affiliate/login');
        }
        if ($aff['status'] === 'pending') {
            $this->session->set_flashdata('error', 'Account pending admin approval.');
            redirect('admin/affiliate/login');
        }
        if ($aff['status'] === 'rejected' || $aff['status'] === 'suspended') {
            $this->session->set_flashdata('error', 'Account is ' . $aff['status'] . '. Contact support.');
            redirect('admin/affiliate/login');
        }

        $this->session->set_userdata([
            'sk_affiliate_login' => true,
            'sk_affiliate_id'    => (int)$aff['id'],
            'sk_affiliate_name'  => $aff['name'],
        ]);
        redirect('admin/affiliate/dashboard');
    }

    public function logout() {
        $this->session->unset_userdata(['sk_affiliate_login', 'sk_affiliate_id', 'sk_affiliate_name']);
        redirect('admin/affiliate/login');
    }

    public function forgot_password() {
        if ($this->session->userdata('sk_affiliate_login')) {
            redirect('admin/affiliate/dashboard');
        }
        $data['title'] = 'Affiliate Forgot Password';
        $this->load->view('affiliate/forgot_password', $data);
    }

    public function forgot_submit() {
        $email = trim($this->input->post('email', TRUE));
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->session->set_flashdata('error', 'Enter a valid email address.');
            redirect('admin/affiliate/forgot-password');
        }

        $aff = $this->Sk_Affiliate_model->get_by_email($email);
        if (!$aff) {
            $this->session->set_flashdata('error', 'No affiliate account found with this email.');
            redirect('admin/affiliate/forgot-password');
        }
        if ($aff['status'] === 'rejected' || $aff['status'] === 'suspended') {
            $this->session->set_flashdata('error', 'Account is ' . $aff['status'] . '. Contact support.');
            redirect('admin/affiliate/forgot-password');
        }

        $code = $this->Sk_Affiliate_model->set_reset_code($email);
        $sent = $this->Sk_Affiliate_model->send_password_reset_email($aff, $code);

        $this->session->set_userdata('aff_reset_email', $email);
        if (!$sent && ENVIRONMENT !== 'production') {
            $this->session->set_flashdata('success', 'SMTP not configured. Verification code: ' . $code);
        } elseif (!$sent) {
            $this->session->set_flashdata('error', 'Unable to send email. Try again later.');
            redirect('admin/affiliate/forgot-password');
        } else {
            $this->session->set_flashdata('success', 'Verification code sent to your email.');
        }
        redirect('admin/affiliate/reset-password');
    }

    public function reset_password() {
        $email = $this->session->userdata('aff_reset_email');
        if (!$email) {
            redirect('admin/affiliate/forgot-password');
        }
        $data['title'] = 'Reset Affiliate Password';
        $data['email'] = $email;
        $this->load->view('affiliate/reset_password', $data);
    }

    public function reset_submit() {
        $email = trim($this->input->post('email', TRUE));
        $code  = trim($this->input->post('code', TRUE));
        $pass  = $this->input->post('password', TRUE);
        $confirm = $this->input->post('password_confirm', TRUE);

        if (!$email || !$code || !$pass) {
            $this->session->set_flashdata('error', 'All fields are required.');
            redirect('admin/affiliate/reset-password');
        }
        if (!preg_match('/^\d{6}$/', $code)) {
            $this->session->set_flashdata('error', 'Enter the 6-digit code from your email.');
            redirect('admin/affiliate/reset-password');
        }
        if (strlen($pass) < 6) {
            $this->session->set_flashdata('error', 'Password must be at least 6 characters.');
            redirect('admin/affiliate/reset-password');
        }
        if ($pass !== $confirm) {
            $this->session->set_flashdata('error', 'Passwords do not match.');
            redirect('admin/affiliate/reset-password');
        }

        $token = $this->Sk_Affiliate_model->verify_reset_code($email, $code);
        if (!$token) {
            $this->session->set_flashdata('error', 'Invalid or expired verification code.');
            redirect('admin/affiliate/reset-password');
        }
        if (!$this->Sk_Affiliate_model->reset_password_with_token($email, $token, $pass)) {
            $this->session->set_flashdata('error', 'Reset failed. Please start again.');
            redirect('admin/affiliate/forgot-password');
        }

        $this->session->unset_userdata('aff_reset_email');
        $this->session->set_flashdata('success', 'Password updated. You can sign in now.');
        redirect('admin/affiliate/login');
    }
}
