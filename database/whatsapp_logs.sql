-- WhatsApp delivery logs (safe to re-run)
CREATE TABLE IF NOT EXISTS `whatsapp_logs` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT UNSIGNED NULL DEFAULT NULL,
  `order_number` VARCHAR(64) NULL DEFAULT NULL,
  `phone` VARCHAR(32) NULL DEFAULT NULL,
  `phone_source` VARCHAR(20) NULL DEFAULT NULL,
  `status_trigger` VARCHAR(40) NULL DEFAULT NULL,
  `channel` VARCHAR(20) NULL DEFAULT NULL,
  `delivery_status` VARCHAR(20) NOT NULL DEFAULT 'failed',
  `reason` VARCHAR(500) NULL DEFAULT NULL,
  `http_code` INT NULL DEFAULT NULL,
  `api_message` TEXT NULL,
  `api_response` MEDIUMTEXT NULL,
  `message_body` TEXT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_wa_order` (`order_id`),
  KEY `idx_wa_status` (`delivery_status`),
  KEY `idx_wa_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
