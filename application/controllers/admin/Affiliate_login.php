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
        $data['title'] = 'Affiliate Login - 2DEAL';
        $this->load->view('affiliate/login', $data);
    }

    public function register() {
        if ($this->session->userdata('sk_affiliate_login')) {
            redirect('admin/affiliate/dashboard');
        }
        $data['title'] = 'Affiliate Registration - 2DEAL';
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

        $aff = $this->Sk_Affiliate_model->get_by_id($id);
        $sent = $aff ? $this->Sk_Affiliate_model->send_registration_emails($aff) : false;

        $msg = 'Registration submitted! Your promo code: ' . $promo . '. Await admin approval.';
        if ($sent) {
            $msg .= ' A confirmation email has been sent to ' . $email . '.';
        } elseif (ENVIRONMENT !== 'production') {
            $msg .= ' (SMTP not configured — no email sent.)';
        } else {
            $msg .= ' We could not send confirmation email — please contact support if you do not hear from us.';
        }
        $this->session->set_flashdata('success', $msg);
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
        if (!empty($aff['must_set_password'])) {
            $this->session->set_flashdata('error', 'Please set your password using the verification link sent to your email.');
            redirect('admin/affiliate/login');
        }

        $this->session->set_userdata([
            'sk_affiliate_login' => true,
            'sk_affiliate_id'    => (int)$aff['id'],
            'sk_affiliate_name'  => $aff['name'],
        ]);
        redirect('admin/affiliate/dashboard');
    }

    public function set_password() {
        if ($this->session->userdata('sk_affiliate_login')) {
            redirect('admin/affiliate/dashboard');
        }
        $this->Sk_Affiliate_model->ensure_invite_schema();
        $email = trim($this->input->get('email', TRUE) ?: '');
        $token = trim($this->input->get('token', TRUE) ?: '');
        $aff = $this->Sk_Affiliate_model->get_by_invite_token($email, $token);
        if (!$aff) {
            $this->session->set_flashdata('error', 'Invalid or expired verification link. Ask admin to resend invite.');
            redirect('admin/affiliate/login');
        }
        $data['title'] = 'Set Affiliate Password';
        $data['email'] = $email;
        $data['token'] = $token;
        $this->load->view('affiliate/set_password', $data);
    }

    public function set_password_submit() {
        $email = trim($this->input->post('email', TRUE));
        $token = trim($this->input->post('token', TRUE));
        $pass  = $this->input->post('password', TRUE);
        $confirm = $this->input->post('password_confirm', TRUE);

        if (!$email || !$token || !$pass) {
            $this->session->set_flashdata('error', 'All fields are required.');
            redirect('admin/affiliate/set-password?token=' . urlencode($token) . '&email=' . urlencode($email));
        }
        if (strlen($pass) < 6) {
            $this->session->set_flashdata('error', 'Password must be at least 6 characters.');
            redirect('admin/affiliate/set-password?token=' . urlencode($token) . '&email=' . urlencode($email));
        }
        if ($pass !== $confirm) {
            $this->session->set_flashdata('error', 'Passwords do not match.');
            redirect('admin/affiliate/set-password?token=' . urlencode($token) . '&email=' . urlencode($email));
        }
        if (!$this->Sk_Affiliate_model->complete_invite_password($email, $token, $pass)) {
            $this->session->set_flashdata('error', 'Invalid or expired link. Contact admin.');
            redirect('admin/affiliate/login');
        }

        $this->session->set_flashdata('success', 'Password saved. You can sign in now.');
        redirect('admin/affiliate/login');
    }

    public function logout() {
        $this->session->unset_userdata(['sk_affiliate_login', 'sk_affiliate_id', 'sk_affiliate_name', 'sk_affiliate_impersonating']);
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

        $token = $this->Sk_Affiliate_model->create_reset_token($email);
        if (!$token) {
            $this->session->set_flashdata('error', 'Unable to start password reset. Try again.');
            redirect('admin/affiliate/forgot-password');
        }
        $sent = $this->Sk_Affiliate_model->send_password_reset_email($aff, $token);
        $resetUrl = $this->Sk_Affiliate_model->reset_password_url($aff, $token);

        if (!$sent && ENVIRONMENT !== 'production') {
            $this->session->set_flashdata('success', 'SMTP not configured. Reset link: ' . $resetUrl);
        } elseif (!$sent) {
            $this->session->set_flashdata('error', 'Unable to send email. Try again later.');
        } else {
            $this->session->set_flashdata('success', 'Password reset link sent. Check your email and click the link to set a new password.');
        }
        redirect('admin/affiliate/forgot-password');
    }

    public function reset_password() {
        if ($this->session->userdata('sk_affiliate_login')) {
            redirect('admin/affiliate/dashboard');
        }
        $email = trim($this->input->get('email', TRUE) ?: '');
        $token = trim($this->input->get('token', TRUE) ?: '');
        $aff = $this->Sk_Affiliate_model->get_by_reset_token($email, $token);
        if (!$aff) {
            $this->session->set_flashdata('error', 'Invalid or expired reset link. Request a new one below.');
            redirect('admin/affiliate/forgot-password');
        }
        $data['title'] = 'Reset Affiliate Password';
        $data['email'] = $email;
        $data['token'] = $token;
        $this->load->view('affiliate/reset_password', $data);
    }

    public function reset_submit() {
        $email = trim($this->input->post('email', TRUE));
        $token = trim($this->input->post('token', TRUE));
        $pass  = $this->input->post('password', TRUE);
        $confirm = $this->input->post('password_confirm', TRUE);
        $backUrl = 'admin/affiliate/reset-password?token=' . urlencode($token) . '&email=' . urlencode($email);

        if (!$email || !$token || !$pass) {
            $this->session->set_flashdata('error', 'All fields are required.');
            redirect($backUrl);
        }
        if (strlen($pass) < 6) {
            $this->session->set_flashdata('error', 'Password must be at least 6 characters.');
            redirect($backUrl);
        }
        if ($pass !== $confirm) {
            $this->session->set_flashdata('error', 'Passwords do not match.');
            redirect($backUrl);
        }
        if (!$this->Sk_Affiliate_model->reset_password_with_token($email, $token, $pass)) {
            $this->session->set_flashdata('error', 'Invalid or expired reset link. Request a new one.');
            redirect('admin/affiliate/forgot-password');
        }

        $this->session->set_flashdata('success', 'Password updated. You can sign in now.');
        redirect('admin/affiliate/login');
    }
}
