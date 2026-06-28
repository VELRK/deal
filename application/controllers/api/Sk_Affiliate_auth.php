<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Affiliate_auth extends Sk_Base_Api {

    public function __construct() {
        parent::__construct();
        $this->load->model('Sk_Affiliate_model');
    }

    public function login() {
        $data = $this->body();
        $email = trim($data['email'] ?? '');
        $pass  = $data['password'] ?? '';
        if (!$email || !$pass) return $this->error('Email and password required.');

        $aff = $this->Sk_Affiliate_model->get_by_email($email);
        if (!$aff || !$this->Sk_Affiliate_model->verify_password($pass, $aff['password'])) {
            return $this->error('Invalid email or password.', 401);
        }
        if ($aff['status'] === 'pending') return $this->error('Account pending admin approval.', 403);
        if (in_array($aff['status'], ['rejected', 'suspended'], true)) {
            return $this->error('Account is ' . $aff['status'] . '.', 403);
        }

        $token = $this->sk_jwt->encode(['affiliate_id' => (int)$aff['id'], 'email' => $aff['email'], 'type' => 'affiliate']);
        $this->success(['token' => $token, 'affiliate' => $this->_safe_affiliate($aff)]);
    }

    public function register() {
        $data = $this->body();
        $name  = trim($data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $pass  = $data['password'] ?? '';

        if (!$name || !$email || !$phone || !$pass) return $this->error('All fields required.');
        if ($this->Sk_Affiliate_model->get_by_email($email)) return $this->error('Email already registered.');

        $promo = strtoupper(trim($data['promo_code'] ?? ''));
        if ($promo === '') $promo = $this->Sk_Affiliate_model->generate_promo_code($name, $phone);
        if (!$this->Sk_Affiliate_model->is_promo_code_available($promo)) {
            return $this->error('Promo code already exists.');
        }

        $settings = $this->db->where('key', 'affiliate_default_commission')->get('settings')->row_array();
        $id = $this->Sk_Affiliate_model->create([
            'name'            => $name,
            'email'           => $email,
            'phone'           => $phone,
            'password'        => $pass,
            'promo_code'      => $promo,
            'commission_rate' => (float)($settings['value'] ?? 5),
            'status'          => 'pending',
            'kyc_status'      => 'pending',
        ]);

        $aff = $this->Sk_Affiliate_model->get_by_id($id);
        $this->success([
            'affiliate'   => $this->_safe_affiliate($aff),
            'promo_code'  => $promo,
            'message'     => 'Registration submitted. Await admin approval.',
        ], 'Registered', 201);
    }

    public function profile() {
        $aff = $this->_auth_affiliate();
        $this->success(['affiliate' => $this->_safe_affiliate($aff, true)]);
    }

    public function update_profile() {
        $aff = $this->_auth_affiliate();
        $data = $this->body();
        $payload = [];
        foreach ($this->Sk_Affiliate_model->profile_editable_fields() as $field) {
            if (array_key_exists($field, $data)) {
                $payload[$field] = is_string($data[$field]) ? trim($data[$field]) : $data[$field];
            }
        }
        if (empty($payload)) return $this->error('No profile fields to update.');
        $this->Sk_Affiliate_model->update_profile((int)$aff['id'], $payload);
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$aff['id']);
        $this->success(['affiliate' => $this->_safe_affiliate($aff, true)], 'Profile updated.');
    }

    public function forgot_password() {
        $email = trim($this->body()['email'] ?? '');
        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->error('Valid email required.');
        }
        $aff = $this->Sk_Affiliate_model->get_by_email($email);
        if (!$aff) return $this->error('No affiliate account found.');
        if (in_array($aff['status'], ['rejected', 'suspended'], true)) {
            return $this->error('Account is ' . $aff['status'] . '.', 403);
        }

        $code = $this->Sk_Affiliate_model->set_reset_code($email);
        $sent = $this->Sk_Affiliate_model->send_password_reset_email($aff, $code);
        if (!$sent && ENVIRONMENT !== 'production') {
            return $this->success(['dev_code' => $code], 'Use verification code: ' . $code);
        }
        if (!$sent) return $this->error('Unable to send email.', 500);
        $this->success([], 'Verification code sent to your email.');
    }

    public function verify_reset_code() {
        $data = $this->body();
        $email = trim($data['email'] ?? '');
        $code  = trim($data['code'] ?? '');
        if (!$email || !preg_match('/^\d{6}$/', $code)) {
            return $this->error('Email and 6-digit code required.');
        }
        $token = $this->Sk_Affiliate_model->verify_reset_code($email, $code);
        if (!$token) return $this->error('Invalid or expired code.', 401);
        $this->success(['reset_token' => $token], 'Verified. Set your new password.');
    }

    public function reset_password() {
        $data = $this->body();
        $email = trim($data['email'] ?? '');
        $token = trim($data['reset_token'] ?? '');
        $pass  = $data['password'] ?? '';
        $confirm = $data['password_confirmation'] ?? ($data['confirm_password'] ?? '');

        if (!$email || !$token) return $this->error('Reset session expired.', 401);
        if (strlen($pass) < 6) return $this->error('Password must be at least 6 characters.');
        if ($pass !== $confirm) return $this->error('Passwords do not match.');

        if (!$this->Sk_Affiliate_model->reset_password_with_token($email, $token, $pass)) {
            return $this->error('Reset failed. Start again.', 401);
        }
        $this->success([], 'Password updated. You can sign in.');
    }

    public function request_password_code() {
        $aff = $this->_auth_affiliate();
        $code = $this->Sk_Affiliate_model->set_reset_code($aff['email']);
        $sent = $this->Sk_Affiliate_model->send_password_reset_email($aff, $code);
        if (!$sent && ENVIRONMENT !== 'production') {
            return $this->success(['dev_code' => $code], 'Verification code: ' . $code);
        }
        if (!$sent) return $this->error('Unable to send email.', 500);
        $this->success([], 'Verification code sent to ' . $aff['email']);
    }

    public function change_password() {
        $aff = $this->_auth_affiliate();
        $data = $this->body();
        $code = trim($data['code'] ?? '');
        $pass = $data['password'] ?? '';
        $confirm = $data['password_confirmation'] ?? ($data['confirm_password'] ?? '');

        if (!preg_match('/^\d{6}$/', $code)) return $this->error('6-digit email code required.');
        if (strlen($pass) < 6 || $pass !== $confirm) return $this->error('Invalid password or mismatch.');

        $token = $this->Sk_Affiliate_model->verify_reset_code($aff['email'], $code);
        if (!$token || !$this->Sk_Affiliate_model->reset_password_with_token($aff['email'], $token, $pass)) {
            return $this->error('Invalid or expired code.', 401);
        }
        $this->success([], 'Password changed successfully.');
    }

    public function dashboard() {
        $aff = $this->_auth_affiliate();
        $stats = $this->Sk_Affiliate_model->get_dashboard_stats((int)$aff['id']);
        $this->success([
            'stats'        => $stats,
            'promo_code'   => $aff['promo_code'],
            'referral_url' => base_url('?ref=' . urlencode($aff['promo_code'])),
            'min_payout'   => $this->Sk_Affiliate_model->get_min_payout(),
            'next_payout'  => $this->Sk_Affiliate_model->next_payout_thursday(),
        ]);
    }

    public function commissions() {
        $aff = $this->_auth_affiliate();
        $page = max(1, (int)($this->input->get('page') ?? 1));
        $limit = min(50, max(1, (int)($this->input->get('limit') ?? 20)));
        $result = $this->Sk_Affiliate_model->get_commissions((int)$aff['id'], $limit, ($page - 1) * $limit);
        $this->success(['commissions' => $result['rows'], 'total' => $result['total'], 'page' => $page]);
    }

    public function payouts() {
        $aff = $this->_auth_affiliate();
        $result = $this->Sk_Affiliate_model->get_payouts((int)$aff['id'], 20, 0);
        $this->success(['payouts' => $result['rows'], 'total' => $result['total']]);
    }

    public function request_payout() {
        $aff = $this->_auth_affiliate();
        $res = $this->Sk_Affiliate_model->request_payout((int)$aff['id']);
        if (!$res['ok']) return $this->error($res['message'] ?? 'Failed');
        $this->success(['payout_id' => $res['id']], 'Payout request submitted for next Thursday.');
    }

    public function check_promo() {
        $code = strtoupper(trim($this->input->get('code') ?? ''));
        if (!$code) return $this->error('Code required.');
        $this->success(['available' => $this->Sk_Affiliate_model->is_promo_code_available($code)]);
    }

    public function track_click() {
        /** @deprecated Affiliate performance is tracked via checkout promo codes, not clicks. */
        $data = $this->body();
        $code = strtoupper(trim($data['promo_code'] ?? $data['ref'] ?? ''));
        if (!$code) return $this->error('Promo code required.');

        $aff = $this->db->where('promo_code', $code)->where('status', 'approved')
            ->where('deleted_at IS NULL', null, false)->get('affiliates')->row_array();
        if (!$aff) return $this->error('Invalid promo code.', 404);

        $this->success([
            'affiliate_id' => (int)$aff['id'],
            'promo_code'   => $code,
            'message'      => 'Affiliate tracking uses checkout promo codes. Share your promo or ?ref= link.',
        ]);
    }

    private function _auth_affiliate(): array {
        $payload = $this->sk_jwt->get_user_from_request();
        if (!$payload || empty($payload['affiliate_id'])) {
            $this->error('Unauthorized. Affiliate login required.', 401);
        }
        $aff = $this->Sk_Affiliate_model->get_by_id((int)$payload['affiliate_id']);
        if (!$aff || $aff['status'] !== 'approved') {
            $this->error('Affiliate account not active.', 403);
        }
        return $aff;
    }

    private function _safe_affiliate(array $aff, bool $full = false): array {
        $base = [
            'id'                 => (int)$aff['id'],
            'name'               => $aff['name'],
            'email'              => $aff['email'],
            'phone'              => $aff['phone'],
            'promo_code'         => $aff['promo_code'],
            'commission_rate'    => (float)$aff['commission_rate'],
            'status'             => $aff['status'],
            'kyc_status'         => $aff['kyc_status'],
            'pending_commission' => (float)$aff['pending_commission'],
            'paid_commission'    => (float)$aff['paid_commission'],
            'checkout_orders'    => (int)$aff['total_sales'],
            'total_sales'        => (int)$aff['total_sales'],
        ];
        if (!$full) return $base;
        return array_merge($base, [
            'address_line1'            => $aff['address_line1'] ?? '',
            'address_line2'            => $aff['address_line2'] ?? '',
            'city'                     => $aff['city'] ?? '',
            'state'                    => $aff['state'] ?? '',
            'pincode'                  => $aff['pincode'] ?? '',
            'country'                  => $aff['country'] ?? 'India',
            'about'                    => $aff['about'] ?? '',
            'bank_account_name'        => $aff['bank_account_name'] ?? '',
            'bank_account_number'      => $aff['bank_account_number'] ?? '',
            'bank_ifsc'                => $aff['bank_ifsc'] ?? '',
            'bank_name'                => $aff['bank_name'] ?? '',
            'customer_discount_percent'=> (float)($aff['customer_discount_percent'] ?? 0),
            'discount_active'          => !empty($aff['discount_active']),
        ]);
    }
}
