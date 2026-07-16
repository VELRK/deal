<?php
/**
 * Migration: JT Express Malaysia courier fields + settings
 *
 * Option A (recommended on server): open Admin → Settings → JT Express tab once
 *         (auto-creates columns + default settings via sk_jt_express_helper.php)
 *
 * Option B: import database/jt_express.sql in phpMyAdmin
 *
 * Option C (local CLI): php database/migrate_jt_express.php
 */
$root = dirname(__DIR__);
$_SERVER['REQUEST_METHOD'] = $_SERVER['REQUEST_METHOD'] ?? 'CLI';
require_once $root . '/index.php';

$CI =& get_instance();
$CI->load->helper('sk_jt_express');
sk_jt_express_ensure_schema();

echo "JT Express migration complete.\n";
