-- Affiliate enquiries (mobile + web). Safe to re-run.
CREATE TABLE IF NOT EXISTS `affiliate_enquiries` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NULL DEFAULT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(40) NULL DEFAULT NULL,
  `promo_code` VARCHAR(60) NULL DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new','read','replied','closed') NOT NULL DEFAULT 'new',
  `admin_note` TEXT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_aff_enq_email` (`email`),
  KEY `idx_aff_enq_user` (`user_id`),
  KEY `idx_aff_enq_status` (`status`),
  KEY `idx_aff_enq_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- JWT blacklist for logout (token hash until expiry). Safe to re-run.
CREATE TABLE IF NOT EXISTS `jwt_blacklist` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `token_hash` CHAR(64) NOT NULL,
  `user_id` INT UNSIGNED NULL DEFAULT NULL,
  `expires_at` INT UNSIGNED NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_jwt_hash` (`token_hash`),
  KEY `idx_jwt_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Soft-delete support on users. Safe to re-run.
SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'deleted_at'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `users` ADD COLUMN `deleted_at` DATETIME NULL DEFAULT NULL AFTER `status`, ADD KEY `idx_users_deleted` (`deleted_at`)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
