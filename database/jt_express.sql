-- JT Express Malaysia — run once in phpMyAdmin (no PHP CLI needed)
-- Safe to re-run: uses IF NOT EXISTS / INSERT IGNORE
SET NAMES utf8mb4;

ALTER TABLE `orders`
  ADD COLUMN IF NOT EXISTS `courier_provider` VARCHAR(30) NULL DEFAULT NULL AFTER `tracking_number`,
  ADD COLUMN IF NOT EXISTS `jt_txlogistic_id` VARCHAR(64) NULL DEFAULT NULL AFTER `courier_provider`,
  ADD COLUMN IF NOT EXISTS `jt_bill_code` VARCHAR(64) NULL DEFAULT NULL AFTER `jt_txlogistic_id`,
  ADD COLUMN IF NOT EXISTS `jt_courier_status` VARCHAR(80) NULL DEFAULT NULL AFTER `jt_bill_code`,
  ADD COLUMN IF NOT EXISTS `jt_label_data` MEDIUMTEXT NULL AFTER `jt_courier_status`,
  ADD COLUMN IF NOT EXISTS `jt_track_data` MEDIUMTEXT NULL AFTER `jt_label_data`,
  ADD COLUMN IF NOT EXISTS `jt_shipment_created_at` DATETIME NULL DEFAULT NULL AFTER `jt_track_data`;

-- Default JT Express settings (sandbox test credentials)
INSERT IGNORE INTO `settings` (`key`, `value`) VALUES
('jt_express_enabled', '0'),
('jt_express_sandbox', '1'),
('jt_express_api_account', '640826271705595946'),
('jt_express_private_key', '8e88c8477d4e4939859c560192fcafbc'),
('jt_express_customer_code', 'GOLDENEAGLEIMPORTS'),
('jt_express_customer_name', 'GOLDENEAGLEIMPORTS'),
('jt_express_customer_password', ''),
('jt_express_demo_uuid', '5ba402abcfdc4dff9cb1c589afcf9682'),
('jt_express_default_weight', '1'),
('jt_express_sender_name', 'GOLDENEAGLEIMPORTS'),
('jt_express_sender_phone', ''),
('jt_express_sender_address', ''),
('jt_express_sender_city', ''),
('jt_express_sender_state', ''),
('jt_express_sender_postcode', '');
