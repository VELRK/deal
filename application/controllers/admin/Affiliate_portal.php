<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/admin/Sk_Affiliate_Base.php';

class Affiliate_portal extends Sk_Affiliate_Base {

    public function dashboard() {
        $data['title'] = 'Affiliate Dashboard';
        $data['recent_commissions'] = $this->Sk_Affiliate_model->get_commissions((int)$this->affiliate['id'], 5, 0)['rows'];
        $data['referral_url'] = base_url('?ref=' . urlencode($this->affiliate['promo_code']));
        $this->render('dashboard', $data);
    }

    public function commissions() {
        $page = max(1, (int)($this->input->get('page') ?? 1));
        $result = $this->Sk_Affiliate_model->get_commissions((int)$this->affiliate['id'], 20, ($page - 1) * 20);
        $data['title'] = 'Commission History';
        $data['commissions'] = $result['rows'];
        $data['total'] = $result['total'];
        $data['page'] = $page;
        $this->render('commissions', $data);
    }

    public function payouts() {
        $aid = (int)$this->affiliate['id'];
        if ($this->input->method() === 'post') {
            $res = $this->Sk_Affiliate_model->request_payout($aid);
            $this->session->set_flashdata($res['ok'] ? 'success' : 'error', $res['ok'] ? 'Payout request submitted for next Thursday.' : ($res['message'] ?? 'Failed'));
            redirect('admin/affiliate/payouts');
        }
        $data['title'] = 'Payouts';
        $data['payouts'] = $this->Sk_Affiliate_model->get_payouts($aid, 20, 0)['rows'];
        $data['min_payout'] = $this->Sk_Affiliate_model->get_min_payout();
        $data['next_thursday'] = $this->Sk_Affiliate_model->next_payout_thursday();
        $this->render('payouts', $data);
    }

    public function kyc() {
        $aid = (int)$this->affiliate['id'];
        if ($this->input->method() === 'post') {
            $type = $this->input->post('doc_type', TRUE) ?: 'aadhaar';
            $path = $this->upload_file('document', 'affiliate/kyc');
            if ($path) {
                $this->Sk_Affiliate_model->add_kyc_document($aid, $type, $path);
                $this->session->set_flashdata('success', 'Document uploaded. Awaiting verification.');
            } else {
                $this->session->set_flashdata('error', 'Upload failed.');
            }
            redirect('admin/affiliate/kyc');
        }
        $data['title'] = 'KYC Verification';
        $data['documents'] = $this->Sk_Affiliate_model->get_kyc_documents($aid);
        $this->render('kyc', $data);
    }

    public function products() {
        $aid = (int)$this->affiliate['id'];
        if ($this->input->method() === 'post') {
            $this->Sk_Affiliate_model->add_product_request($aid, [
                'product_id'   => $this->input->post('product_id') ?: null,
                'product_name' => $this->input->post('product_name', TRUE),
                'notes'        => $this->input->post('notes'),
            ]);
            $this->session->set_flashdata('success', 'Product request submitted.');
            redirect('admin/affiliate/products');
        }
        $this->load->model('Sk_Product_model');
        $data['title'] = 'Product Requests';
        $data['requests'] = $this->Sk_Affiliate_model->get_product_requests($aid);
        $data['products'] = $this->db->select('id, name, slug')->where('status', 'active')->order_by('name')->limit(100)->get('products')->result_array();
        $this->render('products', $data);
    }

    public function profile() {
        $aid = (int)$this->affiliate['id'];
        $action = $this->input->post('action', TRUE);

        if ($this->input->method() === 'post') {
            if ($action === 'send_code') {
                $aff = $this->Sk_Affiliate_model->get_by_id($aid);
                $code = $this->Sk_Affiliate_model->set_reset_code($aff['email']);
                $sent = $this->Sk_Affiliate_model->send_password_reset_email($aff, $code);
                if (!$sent && ENVIRONMENT !== 'production') {
                    $this->session->set_flashdata('success', 'Verification code (dev): ' . $code);
                } elseif (!$sent) {
                    $this->session->set_flashdata('error', 'Could not send email. Check SMTP settings.');
                } else {
                    $this->session->set_flashdata('success', 'Verification code sent to ' . $aff['email']);
                }
                redirect('admin/affiliate/profile#password');
            }

            if ($action === 'change_password') {
                $aff = $this->Sk_Affiliate_model->get_by_id($aid);
                $code = trim($this->input->post('code', TRUE));
                $pass = $this->input->post('password', TRUE);
                $confirm = $this->input->post('password_confirm', TRUE);

                if (!preg_match('/^\d{6}$/', $code)) {
                    $this->session->set_flashdata('error', 'Enter the 6-digit email verification code.');
                    redirect('admin/affiliate/profile#password');
                }
                if (strlen($pass) < 6 || $pass !== $confirm) {
                    $this->session->set_flashdata('error', 'Password must be 6+ characters and match confirmation.');
                    redirect('admin/affiliate/profile#password');
                }

                $token = $this->Sk_Affiliate_model->verify_reset_code($aff['email'], $code);
                if (!$token || !$this->Sk_Affiliate_model->reset_password_with_token($aff['email'], $token, $pass)) {
                    $this->session->set_flashdata('error', 'Invalid or expired code. Request a new one.');
                    redirect('admin/affiliate/profile#password');
                }
                $this->session->set_flashdata('success', 'Password changed successfully.');
                redirect('admin/affiliate/profile#password');
            }

            // Update profile details
            $this->Sk_Affiliate_model->update_profile($aid, [
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
            ]);
            $this->session->set_userdata('sk_affiliate_name', trim($this->input->post('name', TRUE)));
            $this->session->set_flashdata('success', 'Profile updated.');
            redirect('admin/affiliate/profile');
        }

        $data['title'] = 'My Profile';
        $this->affiliate = $this->Sk_Affiliate_model->get_by_id($aid);
        $this->render('profile', $data);
    }
}
