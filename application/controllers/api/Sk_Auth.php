<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . 'controllers/api/Sk_Base_Api.php';

class Sk_Auth extends Sk_Base_Api {

    public function register() {
        $data = $this->body();
        $name     = trim($data['name'] ?? '');
        $email    = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';

        if (!$name || !$email || !$password) {
            return $this->error('Name, email and password are required.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->error('Invalid email address.');
        }
        if (strlen($password) < 6) {
            return $this->error('Password must be at least 6 characters.');
        }
        if ($this->Sk_User_model->get_by_email($email)) {
            return $this->error('Email already registered.');
        }

        $user_id = $this->Sk_User_model->create([
            'name'  => $name,
            'email' => $email,
            'password' => $password,
            'phone' => $data['phone'] ?? null,
        ]);

        // Save address if provided
        $address = $data['address'] ?? null;
        if ($address && !empty($address['line1'])) {
            $this->db->insert('user_addresses', [
                'user_id'    => $user_id,
                'label'      => 'Home',
                'full_name'  => $name,
                'phone'      => $data['phone'] ?? '',
                'line1'      => $address['line1'],
                'city'       => $address['city'] ?? '',
                'state'      => $address['state'] ?? '',
                'pincode'    => $address['pincode'] ?? '',
                'country'    => 'India',
                'is_default' => 1,
            ]);
        }

        $user = $this->Sk_User_model->get_by_id($user_id);
        $token = $this->sk_jwt->encode(['user_id' => $user_id, 'email' => $email]);

        $this->success([
            'token' => $token,
            'user'  => $this->_safe_user($user),
        ], 'Registration successful.', 201);
    }

    public function login() {
        $data = $this->body();
        $email    = trim($data['email'] ?? '');
        $password = $data['password'] ?? '';

        if (!$email || !$password) return $this->error('Email and password required.');

        $user = $this->Sk_User_model->get_by_email($email);
        if (!$user || !$this->Sk_User_model->verify_password($password, $user['password'])) {
            return $this->error('Invalid email or password.', 401);
        }
        if (!$user['status']) {
            return $this->error('Your account has been blocked.', 403);
        }

        $this->Sk_User_model->update_last_login($user['id']);
        $token = $this->sk_jwt->encode(['user_id' => $user['id'], 'email' => $user['email']]);

        $this->success([
            'token' => $token,
            'user'  => $this->_safe_user($user),
        ], 'Login successful.');
    }

    public function forgot_password() {
        $data  = $this->body();
        $email = trim($data['email'] ?? '');

        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->error('Valid email address is required.');
        }
        if (strpos($email, '@shopkart.app') !== false) {
            return $this->error('This account uses mobile login. Please sign in with OTP.');
        }

        $user = $this->Sk_User_model->get_by_email($email);
        if (!$user) {
            return $this->error('No account found with this email.');
        }
        if (!$user['status']) {
            return $this->error('Your account has been blocked.', 403);
        }

        $code = $this->Sk_User_model->set_reset_code($email);
        $this->load->helper('sk_mailer');
        $settings = $this->get_settings();
        $sent = sk_mail_password_reset_code($user, $code, $settings);

        if (!$sent) {
            if (ENVIRONMENT !== 'production') {
                return $this->success(
                    ['dev_code' => $code],
                    'SMTP not configured. Use verification code: ' . $code
                );
            }
            return $this->error('Unable to send verification email. Please try again later.', 500);
        }

        $this->success([], 'Verification code sent to your email.');
    }

    public function verify_reset_code() {
        $data  = $this->body();
        $email = trim($data['email'] ?? '');
        $code  = trim($data['code'] ?? '');

        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->error('Valid email address is required.');
        }
        if (!$code || !preg_match('/^\d{6}$/', $code)) {
            return $this->error('Enter the 6-digit verification code from your email.');
        }

        $token = $this->Sk_User_model->verify_reset_code($email, $code);
        if (!$token) {
            return $this->error('Invalid or expired verification code.', 401);
        }

        $this->success(['reset_token' => $token], 'Email verified. You can now set a new password.');
    }

    public function reset_password() {
        $data  = $this->body();
        $email = trim($data['email'] ?? '');
        $token = trim($data['reset_token'] ?? '');
        $password = $data['password'] ?? '';
        $confirm  = $data['password_confirmation'] ?? ($data['confirm_password'] ?? '');

        if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->error('Valid email address is required.');
        }
        if (!$token) {
            return $this->error('Reset session expired. Please verify your email again.', 401);
        }
        if (!$password || strlen($password) < 6) {
            return $this->error('Password must be at least 6 characters.');
        }
        if ($password !== $confirm) {
            return $this->error('Passwords do not match.');
        }

        if (!$this->Sk_User_model->reset_password_with_token($email, $token, $password)) {
            return $this->error('Reset session expired or invalid. Please start again.', 401);
        }

        $this->success([], 'Password updated successfully. You can now sign in.');
    }

    public function otp_request() {
        $this->load->helper('sk_isms');
        sk_isms_ensure_schema();

        $data  = $this->body();
        $phone = trim($data['phone'] ?? '');
        $settings = $this->get_settings();
        $this->load->library('isms', $settings);
        $normalized = $this->isms->normalize_phone($phone);

        if (!$normalized || !$this->isms->parse_phone($phone)) {
            return $this->error('Valid Malaysia mobile number required (e.g. 0123456789 or 60123456789).');
        }

        if ($this->_isms_use_test_mode($settings, $normalized)) {
            $test = sk_isms_get_test_config($settings);
            $payload = ['phone' => $normalized, 'test_mode' => true];
            $msg = 'OTP sent to +' . $normalized . '.';
            if (ENVIRONMENT !== 'production') {
                $payload['test_otp'] = $test['otp'];
                $payload['dev_hint'] = 'Developer test: use OTP ' . $test['otp'];
                $msg .= ' Dev OTP: ' . $test['otp'];
            }
            return $this->success($payload, $msg);
        }

        $result = $this->isms->request_otp($phone);
        if (!$result['success']) {
            return $this->error($result['message'], 502);
        }

        sk_isms_save_session(
            $normalized,
            $result['sms_id'] ?? '',
            $result['uuid'] ?? '',
            $this->isms->get_otp_interval()
        );

        $this->success(['phone' => $normalized], $result['message']);
    }

    public function otp_verify() {
        $this->load->helper('sk_isms');
        sk_isms_ensure_schema();

        $data  = $this->body();
        $phone = trim($data['phone'] ?? '');
        $otp   = trim($data['otp']   ?? '');

        if (!$phone || !$otp) return $this->error('Phone and OTP required.');

        $settings = $this->get_settings();
        $this->load->library('isms', $settings);
        $normalized = $this->isms->normalize_phone($phone);
        if (!$normalized) {
            return $this->error('Valid phone number required.');
        }

        if ($this->_isms_use_test_mode($settings, $normalized)) {
            $test = sk_isms_get_test_config($settings);
            $validCodes = array_unique([$test['otp'], '123456', '123']);
            if (!in_array($otp, $validCodes, true)) {
                return $this->error('Invalid OTP. Please try again.', 401);
            }
        } else {
            $session = sk_isms_get_session($normalized);
            if (!$session) {
                return $this->error('OTP expired. Please request a new code.', 401);
            }
            $verified = $this->isms->verify_otp($phone, $otp, $session['sms_id'], $session['uuid']);
            if (!$verified['success']) {
                return $this->error($verified['message'], 401);
            }
            sk_isms_clear_session($normalized);
        }

        $user = $this->_find_user_by_phone($normalized);

        if (!$user) {
            // New user — auto-register with phone
            $placeholder_email = 'ph_' . preg_replace('/\D/', '', $normalized) . '@shopkart.app';
            $user_id = $this->Sk_User_model->create([
                'name'     => 'User ' . substr(preg_replace('/\D/', '', $normalized), -4),
                'email'    => $placeholder_email,
                'password' => bin2hex(random_bytes(16)),
                'phone'    => $normalized,
                'status'   => 1,
            ]);
            $user = $this->Sk_User_model->get_by_id($user_id);
        }

        if (!$user['status']) return $this->error('Your account has been blocked.', 403);

        $this->Sk_User_model->update_last_login($user['id']);
        $token = $this->sk_jwt->encode(['user_id' => $user['id'], 'email' => $user['email']]);

        $this->success([
            'token' => $token,
            'user'  => $this->_safe_user($user),
        ], 'Login successful.');
    }

    private function _safe_user($user) {
        unset($user['password'], $user['verify_token'], $user['reset_token'], $user['reset_expires']);
        return $user;
    }

    /** Test OTP when iSMS disabled, dev test phone, or configured test phone. */
    private function _isms_use_test_mode(array $settings, $normalized_phone) {
        if (sk_isms_is_test_phone($settings, $normalized_phone)) {
            return true;
        }
        return empty($settings['isms_enabled']) || $settings['isms_enabled'] === '0'
            || trim($settings['isms_username'] ?? '') === ''
            || trim($settings['isms_password'] ?? '') === '';
    }

    private function _find_user_by_phone($normalized) {
        $user = $this->Sk_User_model->get_by_phone($normalized);
        if ($user) {
            return $user;
        }
        $digits = preg_replace('/\D/', '', $normalized);
        return $this->Sk_User_model->get_by_phone($digits);
    }
}
