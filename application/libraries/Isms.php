<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * iSMS Malaysia JSON SMS API — https://www.isms.com.my/isms_send_json.php
 * OTP is generated locally on each request and sent in the SMS body.
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

    const SEND_URL    = 'https://www.isms.com.my/isms_send_json.php';
    const BALANCE_URL = 'https://www.isms.com.my/isms_balance_json.php';
    const OTP_LENGTH  = 4;

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
            ?: 'Your OTP is %OTP%. Valid for 5 minutes.';
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
        if ($mobile === '' || strlen($mobile) < 9 || strlen($mobile) > 10) {
            return null;
        }
        // Malaysian mobile numbers use 01X locally (first digit after country code is 1).
        if ($mobile[0] !== '1') {
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

    /** Generate a fresh numeric OTP for each request. */
    public function generate_otp() {
        return str_pad((string) random_int(0, 9999), self::OTP_LENGTH, '0', STR_PAD_LEFT);
    }

    public function build_otp_message($otp) {
        $template = $this->message_template;
        if (strpos($template, '%OTP%') === false) {
            $template = 'Your OTP is %OTP%. Valid for ' . $this->otp_interval . ' minutes.';
        }
        return str_replace('%OTP%', (string) $otp, $template);
    }

    /**
     * Generate OTP, send via iSMS JSON API, return OTP for server-side storage.
     *
     * @return array{success:bool,message:string,otp?:string,sms_id?:string,mobile?:string}
     */
    public function request_otp($phone) {
        $parsed = $this->parse_phone($phone);
        if (!$parsed) {
            return ['success' => false, 'message' => 'Invalid Malaysia mobile number. Use format 01XXXXXXXX or 601XXXXXXXX.'];
        }

        $otp = $this->generate_otp();
        $payload = [
            'un'         => $this->username,
            'pwd'        => $this->password,
            'type'       => '1',
            'agreedterm' => 'YES',
            'messages'   => [[
                'dstno' => $parsed['normalized'],
                'msg'   => $this->build_otp_message($otp),
            ]],
        ];
        if ($this->sender_id !== '') {
            $payload['sendid'] = $this->sender_id;
        }

        $response = $this->_post_json(self::SEND_URL, $payload);
        if (!$response['ok']) {
            return ['success' => false, 'message' => $response['error']];
        }

        $data = $response['data'];
        $status = strtolower(trim($data['status'] ?? ''));
        if ($status !== 'success' && $status !== 'partial') {
            return [
                'success' => false,
                'message' => $this->_format_api_message($data),
            ];
        }

        $result = $data['results'][0] ?? null;
        if (!$result) {
            return ['success' => false, 'message' => 'Unexpected response from iSMS.'];
        }

        $code = (int) ($result['code'] ?? 0);
        if ($code !== 2000) {
            return [
                'success' => false,
                'message' => $this->_format_api_message($result, $code),
            ];
        }

        return [
            'success' => true,
            'message' => 'OTP sent to +' . $parsed['normalized'] . '.',
            'otp'     => $otp,
            'sms_id'  => (string) ($result['sms_id'] ?? ''),
            'mobile'  => $parsed['normalized'],
        ];
    }

    /**
     * @return array{success:bool,message:string,balance?:string}
     */
    public function check_balance() {
        if (!$this->is_enabled()) {
            return ['success' => false, 'message' => 'iSMS is not configured.'];
        }

        $response = $this->_post_json(self::BALANCE_URL, [
            'un'  => $this->username,
            'pwd' => $this->password,
        ]);
        if (!$response['ok']) {
            return ['success' => false, 'message' => $response['error']];
        }

        $data = $response['data'];
        $status = strtolower(trim($data['status'] ?? ''));
        if ($status !== 'success') {
            return [
                'success' => false,
                'message' => $this->_format_api_message($data, (int) ($data['code'] ?? 0)),
            ];
        }

        return [
            'success' => true,
            'message' => 'Balance: RM ' . ($data['balance'] ?? '?'),
            'balance' => (string) ($data['balance'] ?? ''),
        ];
    }

    protected function _format_api_message(array $data, $code = 0) {
        $code = (int) ($code ?: ($data['code'] ?? 0));
        if (!empty($data['message'])) {
            return $this->_normalize_api_message((string) $data['message'], $code);
        }
        if (!empty($data['status']) && is_string($data['status'])) {
            return $this->_normalize_api_message((string) $data['status'], $code);
        }
        return $this->_map_error_code($code);
    }

    protected function _normalize_api_message($message, $code = 0) {
        if (preg_match('/-?\d+/', (string) $message, $m)) {
            $parsed = (int) $m[0];
            if ($parsed < 0) {
                return $this->_map_error_code($parsed);
            }
        }
        if ($code < 0) {
            return $this->_map_error_code($code);
        }
        return (string) $message;
    }

    protected function _map_error_code($code) {
        $map = [
            -1001 => 'iSMS authentication failed. Check username and password.',
            -1002 => 'iSMS account suspended or expired.',
            -1003 => 'Server IP not allowed in iSMS. Whitelist your server IP.',
            -1004 => 'Insufficient iSMS credits.',
            -1006 => 'SMS message is empty or too long.',
            -1008 => 'Missing iSMS parameter.',
            -1009 => 'Invalid destination mobile number.',
            -1013 => 'iSMS terms not accepted (agreedterm must be YES).',
        ];
        return $map[$code] ?? 'Failed to send OTP via iSMS (code ' . $code . ').';
    }

    /**
     * @return array{ok:bool,data?:array,error?:string}
     */
    protected function _post_json($url, array $payload) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_POST           => true,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS     => json_encode($payload),
        ]);
        $body = curl_exec($ch);
        $errno = curl_errno($ch);
        $http = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($errno) {
            log_message('error', 'iSMS cURL error: ' . $errno);
            return ['ok' => false, 'error' => 'Unable to reach iSMS. Please try again later.'];
        }
        if ($http < 200 || $http >= 300) {
            log_message('error', 'iSMS HTTP ' . $http . ': ' . $body);
            return ['ok' => false, 'error' => 'iSMS returned an error (HTTP ' . $http . ').'];
        }

        $data = json_decode((string) $body, true);
        if (!is_array($data)) {
            log_message('error', 'iSMS invalid JSON: ' . $body);
            return ['ok' => false, 'error' => 'Unexpected response from iSMS.'];
        }

        return ['ok' => true, 'data' => $data];
    }
}
