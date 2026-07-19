<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/** Ensure vendor dashboard analytics columns exist. */
function sk_vendor_dashboard_ensure_schema(): void {
    static $done = false;
    if ($done) {
        return;
    }
    $done = true;

    $CI =& get_instance();
    if (!isset($CI->db)) {
        $CI->load->database();
    }

    if ($CI->db->table_exists('order_items') && !$CI->db->field_exists('vendor_id', 'order_items')) {
        $CI->db->query(
            'ALTER TABLE `order_items` ADD COLUMN `vendor_id` INT(11) UNSIGNED NULL DEFAULT NULL AFTER `product_id`, ADD KEY `vendor_id` (`vendor_id`)'
        );
    }

    if (!$CI->db->table_exists('vendor_wallets')) {
        $CI->db->query(
            'CREATE TABLE IF NOT EXISTS `vendor_wallets` (
                `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
                `vendor_id` int(11) unsigned NOT NULL,
                `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
                `updated_at` datetime DEFAULT NULL,
                PRIMARY KEY (`id`),
                UNIQUE KEY `vendor_id` (`vendor_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
        );
    }
}

/** Backfill order_items.vendor_id from products. */
function sk_vendor_backfill_order_item_vendors(?int $vendor_id = null): void {
    sk_vendor_dashboard_ensure_schema();

    $CI =& get_instance();
    if (!$CI->db->table_exists('order_items') || !$CI->db->field_exists('vendor_id', 'order_items')) {
        return;
    }

    $sql = 'UPDATE order_items oi
            INNER JOIN products p ON p.id = oi.product_id
            SET oi.vendor_id = p.vendor_id
            WHERE oi.vendor_id IS NULL AND p.vendor_id IS NOT NULL';
    if ($vendor_id) {
        $sql .= ' AND p.vendor_id = ' . (int)$vendor_id;
    }
    $CI->db->query($sql);
}
