<?php
/**
 * Migration: product/blog FAQ JSON + url_redirects table for SEO 301 history
 * Usage: php database/migrate_seo_faq_redirects.php
 *
 * Uses a direct mysqli connection so CLI does not hit the SPA Home controller.
 */
$host = 'localhost';
$user = 'root';
$pass = '';
$dbName = 'shopkart';

$mysqli = @new mysqli($host, $user, $pass, $dbName);
if ($mysqli->connect_errno) {
    fwrite(STDERR, "DB connect failed: {$mysqli->connect_error}\n");
    exit(1);
}
$mysqli->set_charset('utf8mb4');

function col_exists(mysqli $db, string $table, string $column): bool {
    $safeTable = $db->real_escape_string($table);
    $safeCol = $db->real_escape_string($column);
    $res = $db->query("SHOW COLUMNS FROM `{$safeTable}` LIKE '{$safeCol}'");
    return $res && $res->num_rows > 0;
}

function table_exists(mysqli $db, string $table): bool {
    $safeTable = $db->real_escape_string($table);
    $res = $db->query("SHOW TABLES LIKE '{$safeTable}'");
    return $res && $res->num_rows > 0;
}

function add_col(mysqli $db, string $table, string $column, string $def): void {
    if (!table_exists($db, $table)) {
        echo "SKIP (missing table): {$table}.{$column}\n";
        return;
    }
    if (col_exists($db, $table, $column)) {
        echo "SKIP: {$table}.{$column}\n";
        return;
    }
    if (!$db->query("ALTER TABLE `{$table}` ADD COLUMN `{$column}` {$def}")) {
        fwrite(STDERR, "FAIL: {$table}.{$column} — {$db->error}\n");
        return;
    }
    echo "OK: {$table}.{$column}\n";
}

add_col($mysqli, 'products', 'faq_json', 'LONGTEXT NULL DEFAULT NULL');
add_col($mysqli, 'blogs', 'faq_json', 'LONGTEXT NULL DEFAULT NULL');

if (!table_exists($mysqli, 'url_redirects')) {
    $sql = "CREATE TABLE `url_redirects` (
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        `entity_type` VARCHAR(20) NOT NULL,
        `entity_id` INT UNSIGNED NOT NULL,
        `old_path` VARCHAR(255) NOT NULL,
        `new_path` VARCHAR(255) NOT NULL,
        `hits` INT UNSIGNED NOT NULL DEFAULT 0,
        `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `uq_url_redirects_old_path` (`old_path`),
        KEY `idx_url_redirects_entity` (`entity_type`, `entity_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    if (!$mysqli->query($sql)) {
        fwrite(STDERR, "FAIL: create url_redirects — {$mysqli->error}\n");
        exit(1);
    }
    echo "OK: created url_redirects\n";
} else {
    echo "SKIP: url_redirects already exists\n";
}

echo "Migration complete.\n";
$mysqli->close();
