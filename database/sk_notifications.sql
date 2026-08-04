-- 2DEAL FCM / push notifications
-- Run once on the shop DB.

CREATE TABLE IF NOT EXISTS `sk_device_tokens` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NULL DEFAULT NULL,
  `token` VARCHAR(512) NOT NULL,
  `platform` VARCHAR(20) NOT NULL DEFAULT 'android',
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sk_device_token` (`token`(191)),
  KEY `idx_sk_device_user` (`user_id`),
  KEY `idx_sk_device_platform` (`platform`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sk_notifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `body` TEXT NOT NULL,
  `media_type` ENUM('none','image','video','both') NOT NULL DEFAULT 'none',
  `image_url` VARCHAR(500) NULL DEFAULT NULL,
  `video_url` VARCHAR(500) NULL DEFAULT NULL,
  `click_url` VARCHAR(500) NULL DEFAULT NULL,
  `audience` ENUM('all','user','token') NOT NULL DEFAULT 'all',
  `audience_value` VARCHAR(512) NULL DEFAULT NULL,
  `status` ENUM('draft','sent','failed') NOT NULL DEFAULT 'draft',
  `created_by` INT UNSIGNED NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `sent_at` DATETIME NULL DEFAULT NULL,
  `result_json` MEDIUMTEXT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_sk_notif_status` (`status`),
  KEY `idx_sk_notif_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sk_notification_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `notification_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NULL DEFAULT NULL,
  `token` VARCHAR(512) NULL DEFAULT NULL,
  `success` TINYINT(1) NOT NULL DEFAULT 0,
  `response` TEXT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_sk_nlog_notif` (`notification_id`),
  KEY `idx_sk_nlog_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
