<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Sk_JWT {

    private $secret;
    private $expire;

    public function __construct() {
        $CI =& get_instance();
        $this->secret = $CI->config->item('jwt_secret') ?? 'ShopKart_JWT_S3cr3t_2024!';
        $this->expire = $CI->config->item('jwt_expire')  ?? 86400;
    }

    public function encode($payload) {
        $header  = $this->base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload['iat'] = time();
        $payload['exp'] = time() + $this->expire;
        $body      = $this->base64_encode(json_encode($payload));
        $signature = $this->base64_encode(hash_hmac('sha256', "$header.$body", $this->secret, true));
        return "$header.$body.$signature";
    }

    public function decode($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $body, $sig] = $parts;
        $expected = $this->base64_encode(hash_hmac('sha256', "$header.$body", $this->secret, true));
        if (!hash_equals($expected, $sig)) return null;

        $payload = json_decode($this->base64_decode($body), true);
        if ($payload['exp'] < time()) return null;
        return $payload;
    }

    public function get_user_from_request() {
        $CI =& get_instance();
        $auth = $CI->input->get_request_header('Authorization', TRUE);
        if (!$auth || !preg_match('/Bearer\s(\S+)/', $auth, $m)) return null;
        return $this->decode($m[1]);
    }

    private function base64_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64_decode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
}
