<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Base.php';

/**
 * Logged-in vendor: change password with email verification code.
 */
class Vendor_account extends Sk_Base {

    public function __construct() {
        parent::__construct();
        $this->load->model('Sk_Vendor_model');
        if (!$this->session->userdata('sk_vendor_login')) {
            $this->session->set_flashdata('error', 'Vendor login required.');
            redirect('admin/vendor/login');
        }
    }

    public function password() {
        $vid = (int) $this->session->userdata('sk_vendor_id');
        $vendor = $this->Sk_Vendor_model->get_by_id($vid, false);
        if (!$vendor) {
            $this->session->unset_userdata(['sk_vendor_login', 'sk_vendor_id', 'sk_vendor_name', 'sk_vendor_email']);
            redirect('admin/vendor/login');
        }

        $this->Sk_Vendor_model->ensure_password_reset_schema();
        $action = $this->input->post('action', TRUE);

        if ($this->input->method() === 'post') {
            if ($action === 'send_code') {
                $code = $this->Sk_Vendor_model->set_reset_code($vendor['email']);
                if (!$code) {
                    $this->session->set_flashdata('error', 'Unable to generate verification code.');
                    redirect('admin/vendor/account/password');
                }
                $sent = $this->Sk_Vendor_model->send_password_change_code_email($vendor, $code);
                if (!$sent && ENVIRONMENT !== 'production') {
                    $this->session->set_flashdata('success', 'Verification code (dev): ' . $code);
                } elseif (!$sent) {
                    $this->session->set_flashdata('error', 'Could not send email. Check SMTP settings or contact admin.');
                } else {
                    $this->session->set_flashdata('success', 'Verification code sent to ' . $vendor['email']);
                }
                redirect('admin/vendor/account/password');
            }

            if ($action === 'change_password') {
                $code = trim((string) $this->input->post('code', TRUE));
                $pass = (string) $this->input->post('password', TRUE);
                $confirm = (string) $this->input->post('password_confirm', TRUE);

                if (!preg_match('/^\d{6}$/', $code)) {
                    $this->session->set_flashdata('error', 'Enter the 6-digit email verification code.');
                    redirect('admin/vendor/account/password');
                }
                if (strlen($pass) < 6 || $pass !== $confirm) {
                    $this->session->set_flashdata('error', 'Password must be 6+ characters and match confirmation.');
                    redirect('admin/vendor/account/password');
                }

                $token = $this->Sk_Vendor_model->verify_reset_code($vendor['email'], $code);
                if (!$token || !$this->Sk_Vendor_model->reset_password_with_token($vendor['email'], $token, $pass)) {
                    $this->session->set_flashdata('error', 'Invalid or expired code. Request a new one.');
                    redirect('admin/vendor/account/password');
                }
                $this->session->set_flashdata('success', 'Password changed successfully. Use the new password next time you sign in.');
                redirect('admin/vendor/account/password');
            }
        }

        $data['title'] = 'Change Password';
        $data['vendor'] = $vendor;
        $this->render('vendors/change_password', $data);
    }
}
