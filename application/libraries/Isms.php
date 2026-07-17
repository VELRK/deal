<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * iSMS Malaysia 2FA OTP API — https://www.isms.com.my/two-factor-authentication-api.php
 */
class Isms {

    protected $CI;
    protected $enabled = false;
    protected $username = '';
    protected $password = '';
    protected $sender_id = '';
    protected $message_template = '';
    protected $country_code = '60';
    protected $otp_interval = 5;
    protected $test_otp = '1234';

    const API_URL = 'https://www.isms.com.my/2FA/request.php';

    public function __construct($settings = null) {
        $this->CI =& get_instance();
        if ($settings === null) {
            $this->CI->load->model('Sk_Admin_model');
            $settings = $this->CI->Sk_Admin_model->get_settings();
        }
        $this->load_from_settings($settings);
    }

    public function is_enabled() {
        return $this->enabled && $this->username !== '' && $this->password !== '';
    }

    public function load_from_settings(array $settings) {
        $this->enabled = !empty($settings['isms_enabled']) && $settings['isms_enabled'] !== '0';
        $this->username = trim($settings['isms_username'] ?? '');
        $this->password = trim($settings['isms_password'] ?? '');
        $this->sender_id = trim($settings['isms_sender_id'] ?? '');
        $this->message_template = trim($settings['isms_message'] ?? '')
            ?: 'Your verification code is %OTP%. Valid for 5 minutes. Do not share this code.';
        $this->country_code = trim($settings['isms_country_code'] ?? '60') ?: '60';
        $this->otp_interval = max(1, min(30, (int)($settings['isms_otp_interval'] ?? 5)));
        $this->test_otp = trim($settings['isms_test_otp'] ?? '1234') ?: '1234';
    }

    /**
     * Normalize phone to digits-only E.164-style (e.g. 60123456789).
     */
    public function normalize_phone($phone) {
        $digits = preg_replace('/\D/', '', (string)$phone);
        if ($digits === '') {
            return '';
        }
        $cc = $this->country_code;
        if (strpos($digits, $cc) === 0) {
            return $digits;
        }
        if (strpos($digits, '0') === 0) {
            return $cc . substr($digits, 1);
        }
        if (strlen($digits) >= 9 && strlen($digits) <= 11) {
            return $cc . ltrim($digits, '0');
        }
        return $digits;
    }

    /**
     * Split normalized phone into iSMS country_code + mobile (no leading zero).
     *
     * @return array{country_code:string,mobile:string,normalized:string}|null
     */
    public function parse_phone($phone) {
        $normalized = $this->normalize_phone($phone);
        if ($normalized === '') {
            return null;
        }
        $cc = $this->country_code;
        if (strpos($normalized, $cc) !== 0) {
            return null;
        }
        $mobile = substr($normalized, strlen($cc));
        $mobile = ltrim($mobile, '0');
        if ($mobile === '' || strlen($mobile) < 8 || strlen($mobile) > 12) {
            return null;
        }
        return [
            'country_code' => $cc,
            'mobile'       => $mobile,
            'normalized'   => $cc . $mobile,
        ];
    }

    public function get_otp_interval() {
        return $this->otp_interval;
    }

    public function get_test_otp() {
        return $this->test_otp;
    }

    /**
     * Request OTP via iSMS 2FA API.
     *
     * @return array{success:bool,message:string,sms_id?:string,uuid?:string,mobile?:string}
     */
    public function request_otp($phone) {
        $parsed = $this->parse_phone($phone);
        if (!$parsed) {
            return ['success' => false, 'message' => 'Invalid Malaysia mobile number. Use format 01XXXXXXXX or 601XXXXXXXX.'];
        }

        $params = [
            'un'           => $this->username,
            'pass'         => $this->password,
            'mobile'       => $parsed['mobile'],
            'country_code' => $parsed['country_code'],
            'type'         => '1',
            'message'      => $this->message_template,
        ];
        if ($this->sender_id !== '') {
            $params['sendid'] = $this->sender_id;
        }

        $response = $this->_get($params);
        if (!$response['ok']) {
            return ['success' => false, 'message' => $response['error']];
        }

        $data = $response['data'];
        $status = strtolower(trim($data['status'] ?? ''));
        if ($status !== 'success') {
            return [
                'success' => false,
                'message' => $data['message'] ?? 'Failed to send OTP via iSMS.',
            ];
        }

        return [
            'success' => true,
            'message' => 'OTP sent to +' . $parsed['normalized'] . '.',
            'sms_id'  => (string)($data['sms_id'] ?? ''),
            'uuid'    => (string)($data['uuid'] ?? ''),
            'mobile'  => $parsed['normalized'],
        ];
    }

    /**
     * Verify OTP via iSMS 2FA API.
     *
     * @return array{success:bool,message:string}
     */
    public function verify_otp($phone, $code, $sms_id, $uuid) {
        $parsed = $this->parse_phone($phone);
        if (!$parsed) {
            return ['success' => false, 'message' => 'Invalid phone number.'];
        }
        if (!$sms_id || !$uuid) {
            return ['success' => false, 'message' => 'OTP session expired. Please request a new code.'];
        }

        $params = [
            'un'           => $this->username,
            'pass'         => $this->password,
            'mobile'       => $parsed['mobile'],
            'country_code' => $parsed['country_code'],
            'method'       => 'verify',
            'code'         => preg_replace('/\D/', '', (string)$code),
            'sms_id'       => $sms_id,
            'uuid'         => $uuid,
            'interval'     => (string)$this->otp_interval,
        ];
        if ($this->sender_id !== '') {
            $params['sendid'] = $this->sender_id;
        }

        $response = $this->_get($params);
        if (!$response['ok']) {
            return ['success' => false, 'message' => $response['error']];
        }

        $data = $response['data'];
        $status = strtolower(trim($data['status'] ?? ''));
        if ($status === 'verified') {
            return ['success' => true, 'message' => 'OTP verified.'];
        }

        return [
            'success' => false,
            'message' => $data['message'] ?? 'Invalid or expired OTP. Please try again.',
        ];
    }

    /**
     * @return array{success:bool,message:string,balance?:string}
     */
    public function check_balance() {
        if (!$this->is_enabled()) {
            return ['success' => false, 'message' => 'iSMS is not configured.'];
        }
        $response = $this->_get([
            'un'     => $this->username,
            'pass'   => $this->password,
            'method' => 'balance',
        ]);
        if (!$response['ok']) {
            return ['success' => false, 'message' => $response['error']];
        }
        $data = $response['data'];
        return [
            'success' => true,
            'message' => 'Balance: RM ' . ($data['balance'] ?? '?'),
            'balance' => (string)($data['balance'] ?? ''),
        ];
    }

    /**
     * @return array{ok:bool,data?:array,error?:string}
     */
    protected function _get(array $params) {
        $url = self::API_URL . '?' . http_build_query($params);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_HTTPGET        => true,
        ]);
        $body = curl_exec($ch);
        $errno = curl_errno($ch);
        $http = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($errno) {
            log_message('error', 'iSMS cURL error: ' . $errno);
            return ['ok' => false, 'error' => 'Unable to reach iSMS. Please try again later.'];
        }
        if ($http < 200 || $http >= 300) {
            log_message('error', 'iSMS HTTP ' . $http . ': ' . $body);
            return ['ok' => false, 'error' => 'iSMS returned an error (HTTP ' . $http . ').'];
        }

        $data = json_decode((string)$body, true);
        if (!is_array($data)) {
            log_message('error', 'iSMS invalid JSON: ' . $body);
            return ['ok' => false, 'error' => 'Unexpected response from iSMS.'];
        }

        return ['ok' => true, 'data' => $data];
    }
}
