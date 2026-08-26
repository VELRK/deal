-- JT Express Malaysia — run once in phpMyAdmin (no PHP CLI needed)
-- Safe to re-run: uses IF NOT EXISTS / INSERT IGNORE
-- Credentials are empty by default — set them in Admin → Settings → Shipping
SET NAMES utf8mb4;

ALTER TABLE `orders`
  ADD COLUMN IF NOT EXISTS `courier_provider` VARCHAR(30) NULL DEFAULT NULL AFTER `tracking_number`,
  ADD COLUMN IF NOT EXISTS `jt_txlogistic_id` VARCHAR(64) NULL DEFAULT NULL AFTER `courier_provider`,
  ADD COLUMN IF NOT EXISTS `jt_bill_code` VARCHAR(64) NULL DEFAULT NULL AFTER `jt_txlogistic_id`,
  ADD COLUMN IF NOT EXISTS `jt_courier_status` VARCHAR(80) NULL DEFAULT NULL AFTER `jt_bill_code`,
  ADD COLUMN IF NOT EXISTS `jt_label_data` MEDIUMTEXT NULL AFTER `jt_courier_status`,
  ADD COLUMN IF NOT EXISTS `jt_track_data` MEDIUMTEXT NULL AFTER `jt_label_data`,
  ADD COLUMN IF NOT EXISTS `jt_shipment_created_at` DATETIME NULL DEFAULT NULL AFTER `jt_track_data`;

INSERT IGNORE INTO `settings` (`key`, `value`) VALUES
('jt_express_enabled', '0'),
('jt_express_sandbox', '1'),
('jt_express_api_account', ''),
('jt_express_private_key', ''),
('jt_express_customer_code', ''),
('jt_express_customer_name', ''),
('jt_express_customer_password', ''),
('jt_express_demo_uuid', ''),
('jt_express_default_weight', '1'),
('jt_express_sender_name', ''),
('jt_express_sender_phone', ''),
('jt_express_sender_address', ''),
('jt_express_sender_city', ''),
('jt_express_sender_state', ''),
('jt_express_sender_postcode', '');
