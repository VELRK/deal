<?php
/**
 * Migration: wallet top-up source ENUM + repair orphaned pending rows
 * Usage: php database/migrate_wallet_topup.php
 */
$root = dirname(__DIR__);
$_SERVER['REQUEST_METHOD'] = $_SERVER['REQUEST_METHOD'] ?? 'CLI';
require_once $root . '/index.php';

$CI =& get_instance();
$CI->load->database();
$db = $CI->db;

function source_enum_has($db, $value) {
    $q = $db->query("SHOW COLUMNS FROM `customer_wallet_transactions` LIKE 'source'");
    $row = $q ? $q->row_array() : null;
    if (!$row || empty($row['Type'])) {
        return false;
    }
    return stripos($row['Type'], "'" . $value . "'") !== false;
}

if (!source_enum_has($db, 'topup_pending')) {
    $db->query("ALTER TABLE `customer_wallet_transactions`
        MODIFY COLUMN `source` ENUM(
            'admin_add',
            'order_payment',
            'refund',
            'promo',
            'adjustment',
            'topup',
            'topup_pending',
            'topup_sandbox'
        ) NOT NULL");
    echo "OK: extended customer_wallet_transactions.source ENUM\n";
} else {
    echo "SKIP: source ENUM already includes topup values\n";
}

$db->query("UPDATE `customer_wallet_transactions`
    SET `source` = 'topup_pending'
    WHERE (`source` = '' OR `source` IS NULL)
      AND (`description` LIKE 'Pending Razorpay%' OR `description` LIKE 'Pending ToyyibPay%')");
echo "OK: repaired pending top-up rows (" . $db->affected_rows() . ")\n";

$db->query("UPDATE `customer_wallet_transactions`
    SET `source` = 'topup'
    WHERE (`source` = '' OR `source` IS NULL)
      AND `description` LIKE 'Wallet recharge RM%'");
echo "OK: repaired completed top-up rows (" . $db->affected_rows() . ")\n";

echo "Migration complete.\n";
