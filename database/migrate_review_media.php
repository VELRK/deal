<?php
/**
 * One-time: create review_media table for review images/videos.
 * Run: php database/migrate_review_media.php
 * (Or table is auto-created on first review API call.)
 */
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$db   = 'shopkart';

$mysqli = @new mysqli($host, $user, $pass, $db);
if ($mysqli->connect_error) {
    fwrite(STDERR, "DB connect failed: {$mysqli->connect_error}\n");
    fwrite(STDERR, "Edit host/user/pass/db at top of this script if needed.\n");
    exit(1);
}

$sql = "CREATE TABLE IF NOT EXISTS `review_media` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `review_id` INT UNSIGNED NOT NULL,
  `media_type` ENUM('image','video') NOT NULL DEFAULT 'image',
  `file_path` VARCHAR(255) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_review_media_review` (`review_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if ($mysqli->query($sql)) {
    echo "OK: review_media ready\n";
} else {
    fwrite(STDERR, "Error: {$mysqli->error}\n");
    exit(1);
}
$mysqli->close();
