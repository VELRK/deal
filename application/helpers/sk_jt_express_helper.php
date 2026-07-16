<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * JT Express schema + default settings (no CLI required).
 * Runs automatically when admin opens Settings or uses JT Express on an order.
 */
function sk_jt_express_ensure_schema() {
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    $CI =& get_instance();
    if (!isset($CI->db)) {
        $CI->load->database();
    }

    $cols = [
        'courier_provider'       => 'VARCHAR(30) NULL DEFAULT NULL',
        'jt_txlogistic_id'       => 'VARCHAR(64) NULL DEFAULT NULL',
        'jt_bill_code'           => 'VARCHAR(64) NULL DEFAULT NULL',
        'jt_courier_status'      => 'VARCHAR(80) NULL DEFAULT NULL',
        'jt_label_data'          => 'MEDIUMTEXT NULL',
        'jt_track_data'          => 'MEDIUMTEXT NULL',
        'jt_shipment_created_at' => 'DATETIME NULL DEFAULT NULL',
    ];
    foreach ($cols as $col => $def) {
        if (!$CI->db->field_exists($col, 'orders')) {
            $CI->db->query("ALTER TABLE `orders` ADD COLUMN `{$col}` {$def}");
        }
    }

    $defaults = [
        'jt_express_enabled'           => '0',
        'jt_express_sandbox'           => '1',
        'jt_express_api_account'       => '640826271705595946',
        'jt_express_private_key'       => '8e88c8477d4e4939859c560192fcafbc',
        'jt_express_customer_code'     => 'GOLDENEAGLEIMPORTS',
        'jt_express_customer_name'     => 'GOLDENEAGLEIMPORTS',
        'jt_express_customer_password' => '',
        'jt_express_demo_uuid'         => '5ba402abcfdc4dff9cb1c589afcf9682',
        'jt_express_default_weight'    => '1',
        'jt_express_sender_name'       => 'GOLDENEAGLEIMPORTS',
        'jt_express_sender_phone'      => '',
        'jt_express_sender_address'    => '',
        'jt_express_sender_city'       => '',
        'jt_express_sender_state'      => '',
        'jt_express_sender_postcode'   => '',
    ];

    $hasGroup = $CI->db->field_exists('group', 'settings');
    foreach ($defaults as $key => $value) {
        $exists = (int)$CI->db->where('key', $key)->count_all_results('settings');
        if ($exists) {
            continue;
        }
        $row = ['key' => $key, 'value' => $value];
        if ($hasGroup) {
            $row['group'] = 'shipping';
        }
        $CI->db->insert('settings', $row);
    }
}
