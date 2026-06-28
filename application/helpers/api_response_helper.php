<?php
defined('BASEPATH') OR exit('No direct script access allowed');

if (!function_exists('api_response')) {
    function api_response($status, $message, $data = array(), $httpCode = 200)
    {
        return array(
            'status' => (bool) $status,
            'message' => $message,
            'data' => $data,
            'http_code' => $httpCode
        );
    }
}
