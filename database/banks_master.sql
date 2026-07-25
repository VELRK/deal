-- Bank master for affiliate payout dropdowns
-- (Also auto-created when admin opens Banks page)

CREATE TABLE IF NOT EXISTS `banks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `code` varchar(32) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Recent affiliate identity columns (run once; skip if column already exists)
-- ALTER TABLE `affiliates` ADD COLUMN `mykad_number` VARCHAR(32) NULL DEFAULT NULL AFTER `phone`;
-- ALTER TABLE `affiliates` ADD COLUMN `passport_number` VARCHAR(32) NULL DEFAULT NULL AFTER `mykad_number`;
-- ALTER TABLE `affiliates` ADD COLUMN `kyc_submitted_at` DATETIME NULL DEFAULT NULL AFTER `kyc_status`;
