<?php
/**
 * Safe migration runner for variant tables.
 * Usage: php database/migrate_variants.php
 */
$root = dirname(__DIR__);
$_SERVER['REQUEST_METHOD'] = $_SERVER['REQUEST_METHOD'] ?? 'CLI';
require_once $root . '/index.php';

$CI =& get_instance();
$CI->load->database();

function table_exists($db, $table) {
    return $db->query("SHOW TABLES LIKE " . $db->escape($table))->num_rows() > 0;
}

function column_exists($db, $table, $column) {
    $q = $db->query("SHOW COLUMNS FROM `{$table}` LIKE " . $db->escape($column));
    return $q && $q->num_rows() > 0;
}

$sql = file_get_contents(__DIR__ . '/variant_units.sql');
// Strip IF NOT EXISTS on ALTER for compatibility — handled below
$sql = preg_replace('/ADD COLUMN IF NOT EXISTS/i', 'ADD COLUMN', $sql);
$statements = array_filter(array_map('trim', preg_split('/;\s*\n/', $sql)));

foreach ($statements as $stmt) {
    if ($stmt === '' || stripos($stmt, 'SET ') === 0) {
        if ($stmt !== '') $CI->db->query($stmt);
        continue;
    }
    if (stripos($stmt, 'ALTER TABLE `cart`') === 0 && column_exists($CI->db, 'cart', 'variant_id')) {
        echo "SKIP: cart.variant_id exists\n";
        continue;
    }
    if (stripos($stmt, 'ALTER TABLE `product_variants`') === 0 && column_exists($CI->db, 'product_variants', 'image')) {
        echo "SKIP: product_variants.image exists\n";
        continue;
    }
    if (stripos($stmt, 'ALTER TABLE `order_items`') === 0) {
        if (strpos($stmt, 'variant_id') !== false && column_exists($CI->db, 'order_items', 'variant_id')) {
            echo "SKIP: order_items.variant_id exists\n";
            continue;
        }
        if (strpos($stmt, 'variant_label') !== false && column_exists($CI->db, 'order_items', 'variant_label')) {
            echo "SKIP: order_items.variant_label exists\n";
            continue;
        }
    }
    try {
        $CI->db->query($stmt);
        echo "OK: " . substr(str_replace("\n", ' ', $stmt), 0, 80) . "...\n";
    } catch (Exception $e) {
        echo "WARN: " . $e->getMessage() . "\n";
    }
}

echo "Migration complete.\n";
