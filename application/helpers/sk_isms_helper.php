<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * iSMS OTP settings + otp_sessions table (no CLI required).
 */
function sk_isms_ensure_schema() {
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    $CI =& get_instance();
    if (!isset($CI->db)) {
        $CI->load->database();
    }

    if (!$CI->db->table_exists('otp_sessions')) {
        $CI->db->query("CREATE TABLE IF NOT EXISTS `otp_sessions` (
            `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
            `phone` VARCHAR(20) NOT NULL,
            `sms_id` VARCHAR(32) NOT NULL DEFAULT '',
            `uuid` VARCHAR(64) NOT NULL DEFAULT '',
            `provider` VARCHAR(20) NOT NULL DEFAULT 'isms',
            `created_at` DATETIME NOT NULL,
            `expires_at` DATETIME NOT NULL,
            PRIMARY KEY (`id`),
            KEY `idx_otp_phone` (`phone`),
            KEY `idx_otp_expires` (`expires_at`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    }

    $defaults = [
        'isms_enabled'       => '0',
        'isms_username'      => '',
        'isms_password'      => '',
        'isms_sender_id'     => '',
        'isms_message'       => 'Your Golden Eagle verification code is %OTP%. Valid for 5 minutes. Do not share this code.',
        'isms_country_code'  => '60',
        'isms_otp_interval'  => '5',
        'isms_test_otp'      => '123456',
        'isms_test_phone'    => '601800000000',
    ];

    $hasGroup = $CI->db->field_exists('group', 'settings');
    foreach ($defaults as $key => $value) {
        $exists = (int)$CI->db->where('key', $key)->count_all_results('settings');
        if ($exists) {
            continue;
        }
        $row = ['key' => $key, 'value' => $value];
        if ($hasGroup) {
            $row['group'] = 'sms';
        }
        $CI->db->insert('settings', $row);
    }
}

function sk_isms_test_defaults() {
    return [
        'phone' => '601800000000',
        'otp'   => '123456',
    ];
}

/**
 * @return array{phone:string,otp:string,display_phone:string}
 */
function sk_isms_get_test_config(array $settings = null) {
    $defaults = sk_isms_test_defaults();
    if ($settings === null) {
        $CI =& get_instance();
        if (!isset($CI->Sk_Admin_model)) {
            $CI->load->model('Sk_Admin_model');
        }
        $settings = $CI->Sk_Admin_model->get_settings();
    }
    $phone = preg_replace('/\D/', '', trim($settings['isms_test_phone'] ?? ''));
    if ($phone === '') {
        $phone = $defaults['phone'];
    }
    $otp = trim($settings['isms_test_otp'] ?? '') ?: $defaults['otp'];
    $local = $phone;
    if (strpos($local, '60') === 0) {
        $local = '0' . substr($local, 2);
    }
    return [
        'phone'          => $phone,
        'otp'            => $otp,
        'display_phone'  => $local,
    ];
}

function sk_isms_is_test_phone(array $settings, $normalized_phone) {
    $CI =& get_instance();
    $CI->load->library('isms', $settings);
    $test = sk_isms_get_test_config($settings);
    $testNorm = $CI->isms->normalize_phone($test['phone']);
    return $testNorm !== '' && $testNorm === $normalized_phone;
}

function sk_isms_save_session($phone, $sms_id, $uuid, $interval_minutes = 5) {
    $CI =& get_instance();
    sk_isms_ensure_schema();

    $now = date('Y-m-d H:i:s');
    $expires = date('Y-m-d H:i:s', time() + ((int)$interval_minutes * 60));

    $CI->db->where('phone', $phone)->delete('otp_sessions');

    $CI->db->insert('otp_sessions', [
        'phone'      => $phone,
        'sms_id'     => (string)$sms_id,
        'uuid'       => (string)$uuid,
        'provider'   => 'isms',
        'created_at' => $now,
        'expires_at' => $expires,
    ]);
}

/**
 * @return array{sms_id:string,uuid:string}|null
 */
function sk_isms_get_session($phone) {
    $CI =& get_instance();
    sk_isms_ensure_schema();

    $row = $CI->db->where('phone', $phone)
        ->where('expires_at >=', date('Y-m-d H:i:s'))
        ->order_by('id', 'DESC')
        ->limit(1)
        ->get('otp_sessions')
        ->row_array();

    if (!$row) {
        return null;
    }

    return [
        'sms_id' => (string)$row['sms_id'],
        'uuid'   => (string)$row['uuid'],
    ];
}

function sk_isms_clear_session($phone) {
    $CI =& get_instance();
    if (!$CI->db->table_exists('otp_sessions')) {
        return;
    }
    $CI->db->where('phone', $phone)->delete('otp_sessions');
}
