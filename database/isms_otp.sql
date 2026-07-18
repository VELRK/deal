-- iSMS OTP sessions (optional — also auto-created when Admin → Settings opens)
CREATE TABLE IF NOT EXISTS `otp_sessions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone` VARCHAR(20) NOT NULL,
  `sms_id` VARCHAR(32) NOT NULL DEFAULT '',
  `uuid` VARCHAR(64) NOT NULL DEFAULT '',
  `otp_hash` VARCHAR(255) NOT NULL DEFAULT '',
  `provider` VARCHAR(20) NOT NULL DEFAULT 'isms',
  `created_at` DATETIME NOT NULL,
  `expires_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_otp_phone` (`phone`),
  KEY `idx_otp_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Default settings (skip if key already exists)
INSERT INTO `settings` (`key`, `value`)
SELECT 'isms_enabled', '0' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'isms_enabled');

INSERT INTO `settings` (`key`, `value`)
SELECT 'isms_username', '' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'isms_username');

INSERT INTO `settings` (`key`, `value`)
SELECT 'isms_password', '' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'isms_password');

INSERT INTO `settings` (`key`, `value`)
SELECT 'isms_sender_id', 'GOLDEN2DEAL' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'isms_sender_id');

INSERT INTO `settings` (`key`, `value`)
SELECT 'isms_message', 'Your OTP is %OTP%. Valid for 5 minutes.' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'isms_message');

INSERT INTO `settings` (`key`, `value`)
SELECT 'isms_country_code', '60' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'isms_country_code');

INSERT INTO `settings` (`key`, `value`)
SELECT 'isms_otp_interval', '5' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'isms_otp_interval');

INSERT INTO `settings` (`key`, `value`)
SELECT 'isms_test_otp', '1234' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'isms_test_otp');

INSERT INTO `settings` (`key`, `value`)
SELECT 'isms_test_phone', '601800000000' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'isms_test_phone');
