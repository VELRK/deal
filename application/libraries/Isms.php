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
    protected $api_key = '';
    protected $sender_id = '';
    protected $message_template = '';
    protected $country_code = '60';
    protected $otp_interval = 5;
    protected $test_otp = '1234';

    const SEND_URL        = 'https://www.isms.com.my/isms_send_all_id.php';
    const BALANCE_URL     = 'https://www.isms.com.my/isms_balance.php';
    const BALANCE_URL_JSON = 'https://www.isms.com.my/isms_balance_json.php';
    const TWO_FA_URL      = 'https://www.isms.com.my/2FA/request.php';
    const SEND_URL_JSON   = 'https://www.isms.com.my/isms_send_json.php';
    const OTP_LENGTH    = 4;

    public function __construct($settings = null) {
        $this->CI =& get_instance();
        $this->CI->load->helper('sk_isms');
        if ($settings === null) {
            $this->CI->load->model('Sk_Admin_model');
            $settings = $this->CI->Sk_Admin_model->get_settings();
        }
        $this->load_from_settings($settings);
    }

    public function is_enabled() {
        return $this->enabled && $this->username !== '' && !empty($this->auth_secrets());
    }

    public function load_from_settings(array $settings) {
        $settings = sk_isms_effective_settings($settings);
        $this->enabled = !empty($settings['isms_enabled']) && $settings['isms_enabled'] !== '0';
        $this->username = sk_isms_clean_credential($settings['isms_username'] ?? '');
        $this->password = sk_isms_clean_credential($settings['isms_password'] ?? '', false);
        $this->api_key = sk_isms_clean_credential($settings['isms_api_key'] ?? '', false);
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
            $mobile = ltrim(substr($digits, strlen($cc)), '0');
            return $mobile !== '' ? $cc . $mobile : '';
        }
        // Local form with leading 0: 01XXXXXXXX (10) or 01XXXXXXXXX (11)
        if (strpos($digits, '0') === 0) {
            return $cc . ltrim(substr($digits, 1), '0');
        }
        // National number typed beside +60 UI: 1XXXXXXXX (9) or 1XXXXXXXXX (10)
        // e.g. 111-086 1982 → 1110861982 → 601110861982
        if ((strlen($digits) === 9 || strlen($digits) === 10) && isset($digits[0]) && $digits[0] === '1') {
            return $cc . $digits;
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
        $len = strlen($mobile);
        // 9 digits → local 01XXXXXXXX; 10 digits → local 01XXXXXXXXX (e.g. 011-1086 1982)
        if ($mobile === '' || ($len !== 9 && $len !== 10)) {
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
        $secrets = $this->auth_secrets();
        if ($this->username === '' || empty($secrets)) {
            return ['success' => false, 'message' => 'iSMS username and password/API key are not configured.'];
        }

        $parsed = $this->parse_phone($phone);
        if (!$parsed) {
            return ['success' => false, 'message' => 'Invalid Malaysia mobile number. Use 01XXXXXXXX or 01XXXXXXXXX (e.g. 0123456789 or 01110861982).'];
        }

        $otp = $this->generate_otp();
        $message = $this->build_otp_message($otp);
        $lastMessage = 'iSMS authentication failed.';

        foreach ($secrets as $secret) {
            $jsonPayload = $this->_build_json_send_payload($secret, $parsed['normalized'], $message);
            $response = $this->_post_json(self::SEND_URL_JSON, $jsonPayload);
            if (!$response['ok']) {
                $lastMessage = $response['error'];
                continue;
            }

            $parsedResponse = $this->_parse_response_body($response['body'], 'send');
            if ($parsedResponse['success']) {
                return [
                    'success' => true,
                    'message' => 'OTP sent to +' . $parsed['normalized'] . '.',
                    'otp'     => $otp,
                    'sms_id'  => (string) ($parsedResponse['sms_id'] ?? ''),
                    'mobile'  => $parsed['normalized'],
                ];
            }

            $lastMessage = $parsedResponse['message'];
            if ((int) ($parsedResponse['code'] ?? 0) !== -1001) {
                // Fallback to classic form API for non-auth errors (e.g. gateway quirks).
                $formParams = [
                    'un'         => $this->username,
                    'pwd'        => $secret,
                    'dstno'      => $parsed['normalized'],
                    'msg'        => $message,
                    'type'       => '1',
                    'agreedterm' => 'YES',
                ];
                if ($this->sender_id !== '') {
                    $formParams['sendid'] = $this->sender_id;
                }
                $formResponse = $this->_post_form(self::SEND_URL, $formParams);
                if ($formResponse['ok']) {
                    $formParsed = $this->_parse_response_body($formResponse['body'], 'bulk');
                    if ($formParsed['success']) {
                        return [
                            'success' => true,
                            'message' => 'OTP sent to +' . $parsed['normalized'] . '.',
                            'otp'     => $otp,
                            'sms_id'  => (string) ($formParsed['sms_id'] ?? ''),
                            'mobile'  => $parsed['normalized'],
                        ];
                    }
                    $lastMessage = $formParsed['message'];
                }
                return ['success' => false, 'message' => $lastMessage];
            }
        }

        return ['success' => false, 'message' => $lastMessage];
    }

    /**
     * Build iSMS JSON send payload (single-recipient OTP).
     *
     * @return array<string,mixed>
     */
    protected function _build_json_send_payload($secret, $dstno, $message) {
        $payload = [
            'un'         => $this->username,
            'pwd'        => $secret,
            'type'       => '1',
            'agreedterm' => 'YES',
            'messages'   => [
                [
                    'dstno' => $dstno,
                    'msg'   => $message,
                ],
            ],
        ];
        if ($this->sender_id !== '') {
            $payload['sendid'] = $this->sender_id;
        }
        return $payload;
    }

    /**
     * @param bool $require_enabled When false, tests credentials even if iSMS toggle is off.
     * @return array{success:bool,message:string,balance?:string}
     */
    public function check_balance($require_enabled = true) {
        if ($require_enabled && !$this->is_enabled()) {
            return ['success' => false, 'message' => 'iSMS is not configured.'];
        }
        $secrets = $this->auth_secrets();
        if ($this->username === '' || empty($secrets)) {
            return ['success' => false, 'message' => 'iSMS username and password/API key are required.'];
        }

        $lastMessage = 'iSMS authentication failed.';
        foreach ($secrets as $secret) {
            // JSON API first (recommended in iSMS docs), then classic fallbacks.
            $attempts = [
                ['url' => self::BALANCE_URL_JSON, 'params' => [
                    'un'  => $this->username,
                    'pwd' => $secret,
                ], 'mode' => 'json_balance'],
                ['url' => self::BALANCE_URL, 'params' => [
                    'un'  => $this->username,
                    'pwd' => $secret,
                ], 'mode' => 'bulk'],
            ];

            foreach ($attempts as $attempt) {
                $response = $attempt['mode'] === 'json_balance'
                    ? $this->_post_json($attempt['url'], $attempt['params'])
                    : $this->_post_form($attempt['url'], $attempt['params']);
                if (!$response['ok']) {
                    $lastMessage = $response['error'];
                    continue;
                }

                $parsedResponse = $this->_parse_response_body($response['body'], $attempt['mode']);
                if ($parsedResponse['success']) {
                    $balance = (string) ($parsedResponse['balance'] ?? '');
                    if ($balance === '' && !empty($parsedResponse['message'])) {
                        return ['success' => true, 'message' => $parsedResponse['message'], 'balance' => ''];
                    }
                    return [
                        'success' => true,
                        'message' => 'Connected. Balance: RM ' . $balance,
                        'balance' => $balance,
                    ];
                }
                $lastMessage = $parsedResponse['message'];
                if ((int) ($parsedResponse['code'] ?? 0) !== -1001) {
                    break 2;
                }
            }
        }

        return ['success' => false, 'message' => $lastMessage, 'code' => -1001];
    }

    /** @return string[] */
    protected function auth_secrets() {
        return sk_isms_auth_secrets([
            'isms_password' => $this->password,
            'isms_api_key'  => $this->api_key,
        ]);
    }

    /** @return array{username:string,password_len:int,api_key_len:int,secret_saved:bool,looks_like_email:bool} */
    public function credential_diagnostics() {
        return [
            'username'         => $this->username,
            'password_len'     => strlen($this->password),
            'api_key_len'      => strlen($this->api_key),
            'secret_saved'     => !empty($this->auth_secrets()),
            'looks_like_email' => strpos($this->username, '@') !== false,
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
            -1001 => 'iSMS authentication failed. Use sub-account username (e.g. 2DEAL1, not email) with your portal login password or API key as pwd. If login works on isms.com.my but API fails, contact iSMS to enable API access or whitelist your server IP.',
            -1002 => 'iSMS account suspended or expired.',
            -1003 => 'Server IP not allowed by iSMS. Whitelist your website server IP in the iSMS portal or contact iSMS support.',
            -1004 => 'Insufficient iSMS credits. Reload credits at isms.com.my.',
            -1006 => 'SMS message is empty or too long.',
            -1008 => 'Missing iSMS parameter.',
            -1009 => 'Invalid destination mobile number.',
            -1013 => 'iSMS terms not accepted (agreedterm must be YES).',
            -1010 => 'Too many destination numbers (JSON API max 50 per request).',
            -1014 => 'Invalid JSON body sent to iSMS.',
            -1015 => 'iSMS JSON endpoint requires POST with Content-Type application/json.',
        ];
        return $map[$code] ?? 'Failed to send OTP via iSMS (code ' . $code . ').';
    }

    /**
     * Parse iSMS plain-text ("2000 = SUCCESS:123") or JSON responses.
     *
     * @return array{success:bool,message:string,code?:int,sms_id?:string,balance?:string}
     */
    protected function _parse_response_body($body, $mode = 'bulk') {
        $body = trim((string) $body);
        if ($body === '') {
            return ['success' => false, 'message' => 'Empty response from iSMS.'];
        }

        $json = json_decode($body, true);
        if (is_array($json)) {
            if ($mode === 'json_balance') {
                return $this->_parse_json_balance_response($json);
            }
            if ($mode === 'send') {
                return $this->_parse_json_send_response($json);
            }
            return $this->_parse_json_response($json, $mode);
        }

        if (preg_match('/^(-?\d+)\s*=\s*(.+)$/', $body, $m)) {
            $code = (int) $m[1];
            $rest = trim($m[2]);
            if ($code === 2000) {
                $sms_id = '';
                if (stripos($rest, 'SUCCESS') !== false && strpos($rest, ':') !== false) {
                    $sms_id = trim(substr($rest, strrpos($rest, ':') + 1));
                }
                return [
                    'success' => true,
                    'code'    => 2000,
                    'message' => 'Message sent.',
                    'sms_id'  => $sms_id,
                ];
            }
            return [
                'success' => false,
                'code'    => $code,
                'message' => $this->_map_error_code($code),
            ];
        }

        if (preg_match('/^-?\d+$/', $body)) {
            $code = (int) $body;
            if ($code < 0) {
                return ['success' => false, 'code' => $code, 'message' => $this->_map_error_code($code)];
            }
            return ['success' => true, 'code' => 2000, 'message' => 'Balance: RM ' . $body, 'balance' => $body];
        }

        if (preg_match('/^-?\d+(\.\d+)?$/', $body)) {
            return ['success' => true, 'code' => 2000, 'message' => 'Balance: RM ' . $body, 'balance' => $body];
        }

        return ['success' => false, 'message' => $body];
    }

    /**
     * Parse isms_balance_json.php — docs: status success, code 0, balance field.
     *
     * @return array{success:bool,message:string,code?:int,balance?:string}
     */
    protected function _parse_json_balance_response(array $data) {
        $code = (int) ($data['code'] ?? 0);
        $status = strtolower(trim((string) ($data['status'] ?? '')));

        if ($status === 'success') {
            $balance = trim((string) ($data['balance'] ?? ''));
            if ($balance !== '' && preg_match('/^-?\d+(\.\d+)?$/', $balance)) {
                return [
                    'success' => true,
                    'code'    => 0,
                    'message' => 'Balance: RM ' . $balance,
                    'balance' => $balance,
                ];
            }
        }

        if ($code < 0) {
            return [
                'success' => false,
                'code'    => $code,
                'message' => $this->_map_error_code($code),
            ];
        }

        return [
            'success' => false,
            'code'    => $code,
            'message' => $this->_format_api_message($data, $code),
        ];
    }

    /**
     * Parse isms_send_json.php response with per-recipient results.
     *
     * @return array{success:bool,message:string,code?:int,sms_id?:string}
     */
    protected function _parse_json_send_response(array $data) {
        $topCode = (int) ($data['code'] ?? 0);
        if ($topCode < 0) {
            return [
                'success' => false,
                'code'    => $topCode,
                'message' => $this->_map_error_code($topCode),
            ];
        }

        $results = $data['results'] ?? [];
        if (!empty($results) && is_array($results)) {
            $result = $results[0];
            $code = (int) ($result['code'] ?? $topCode);
            $status = trim((string) ($result['status'] ?? ''));
            if ($code === 2000 || stripos($status, 'success') !== false) {
                $sms_id = (string) ($result['sms_id'] ?? $result['trx_id'] ?? '');
                if ($sms_id === '' && preg_match('/SUCCESS:([^|\s]+)/i', $status, $m)) {
                    $sms_id = $m[1];
                }
                return [
                    'success' => true,
                    'code'    => 2000,
                    'message' => trim((string) ($data['message'] ?? 'Message sent.')),
                    'sms_id'  => $sms_id,
                ];
            }
            if ($code < 0) {
                return [
                    'success' => false,
                    'code'    => $code,
                    'message' => $this->_map_error_code($code),
                ];
            }
        }

        $status = strtolower(trim($data['status'] ?? ''));
        if ($status === 'success' || $status === 'partial' || $topCode === 2000) {
            return [
                'success' => true,
                'code'    => 2000,
                'message' => trim((string) ($data['message'] ?? 'Message sent.')),
                'sms_id'  => (string) ($data['sms_id'] ?? ''),
            ];
        }

        return [
            'success' => false,
            'code'    => $topCode,
            'message' => $this->_format_api_message($data, $topCode),
        ];
    }

    protected function _parse_json_response(array $data, $mode = 'bulk') {
        if ($mode === '2fa' && isset($data['method']) && $data['method'] === 'balance') {
            $balance = trim((string) ($data['balance'] ?? ''));
            $expiration = trim((string) ($data['expiration'] ?? ''));
            if (preg_match('/^-1001\b/', $balance) || preg_match('/^-1001\b/', $expiration)) {
                return ['success' => false, 'code' => -1001, 'message' => $this->_map_error_code(-1001)];
            }
            if ($balance !== '' && preg_match('/^-?\d+(\.\d+)?$/', $balance)) {
                return [
                    'success'    => true,
                    'code'       => 2000,
                    'message'    => 'Balance: RM ' . $balance,
                    'balance'    => $balance,
                    'expiration' => $expiration,
                ];
            }
        }

        $status = strtolower(trim($data['status'] ?? ''));
        if ($status === 'success' || $status === 'partial') {
            $result = $data['results'][0] ?? $data;
            $code = (int) ($result['code'] ?? 2000);
            if ($code === 2000) {
                return [
                    'success' => true,
                    'code'    => 2000,
                    'message' => 'Message sent.',
                    'sms_id'  => (string) ($result['sms_id'] ?? ''),
                    'balance' => isset($data['balance']) ? (string) $data['balance'] : '',
                ];
            }
        }

        $code = (int) ($data['code'] ?? ($data['results'][0]['code'] ?? 0));
        return [
            'success' => false,
            'code'    => $code,
            'message' => $this->_format_api_message($data, $code),
        ];
    }

    /**
     * @return array{ok:bool,body?:string,error?:string}
     */
    protected function _post_form($url, array $params) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($params),
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

        return ['ok' => true, 'body' => (string) $body];
    }

    /**
     * @return array{ok:bool,body?:string,error?:string}
     */
    protected function _post_json($url, array $params) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_POST           => true,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS     => json_encode($params),
        ]);
        $body = curl_exec($ch);
        $errno = curl_errno($ch);
        $http = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($errno) {
            log_message('error', 'iSMS JSON cURL error: ' . $errno);
            return ['ok' => false, 'error' => 'Unable to reach iSMS. Please try again later.'];
        }
        if ($http < 200 || $http >= 300) {
            log_message('error', 'iSMS JSON HTTP ' . $http . ': ' . $body);
            return ['ok' => false, 'error' => 'iSMS returned an error (HTTP ' . $http . ').'];
        }

        return ['ok' => true, 'body' => (string) $body];
    }
}
