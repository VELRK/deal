-- Add catalogue fields to products table
-- Run this to add missing columns for product catalogue data

USE `shopkart`;

ALTER TABLE `products`
  ADD COLUMN IF NOT EXISTS `subtitle` VARCHAR(255) DEFAULT NULL AFTER `return_policy`,
  ADD COLUMN IF NOT EXISTS `model_name` VARCHAR(255) DEFAULT NULL AFTER `subtitle`,
  ADD COLUMN IF NOT EXISTS `listing_status` ENUM('ACTIVE','INACTIVE','DISCONTINUED') DEFAULT 'ACTIVE' AFTER `model_name`,
  ADD COLUMN IF NOT EXISTS `min_order_qty` INT DEFAULT 1 AFTER `listing_status`,
  ADD COLUMN IF NOT EXISTS `procurement_type` ENUM('IN_STOCK','ON_DEMAND','PRE_ORDER') DEFAULT 'IN_STOCK' AFTER `min_order_qty`,
  ADD COLUMN IF NOT EXISTS `procurement_sla` INT DEFAULT 2 AFTER `procurement_type`,
  ADD COLUMN IF NOT EXISTS `package_length` DECIMAL(8,2) DEFAULT NULL AFTER `procurement_sla`,
  ADD COLUMN IF NOT EXISTS `package_breadth` DECIMAL(8,2) DEFAULT NULL AFTER `package_length`,
  ADD COLUMN IF NOT EXISTS `package_height` DECIMAL(8,2) DEFAULT NULL AFTER `package_breadth`,
  ADD COLUMN IF NOT EXISTS `hsn_code` VARCHAR(20) DEFAULT NULL AFTER `package_height`,
  ADD COLUMN IF NOT EXISTS `tax_code` VARCHAR(20) DEFAULT NULL AFTER `hsn_code`,
  ADD COLUMN IF NOT EXISTS `manufacturer_name` VARCHAR(255) DEFAULT NULL AFTER `tax_code`,
  ADD COLUMN IF NOT EXISTS `manufacturer_address` TEXT DEFAULT NULL AFTER `manufacturer_name`,
  ADD COLUMN IF NOT EXISTS `style_code` VARCHAR(100) DEFAULT NULL AFTER `manufacturer_address`,
  ADD COLUMN IF NOT EXISTS `ean` VARCHAR(20) DEFAULT NULL AFTER `style_code`,
  ADD COLUMN IF NOT EXISTS `sizes` TEXT DEFAULT NULL AFTER `ean`,
  ADD COLUMN IF NOT EXISTS `brand_color` VARCHAR(100) DEFAULT NULL AFTER `sizes`,
  ADD COLUMN IF NOT EXISTS `pattern` VARCHAR(100) DEFAULT NULL AFTER `brand_color`,
  ADD COLUMN IF NOT EXISTS `fit_type` VARCHAR(100) DEFAULT NULL AFTER `pattern`,
  ADD COLUMN IF NOT EXISTS `neck_type` VARCHAR(100) DEFAULT NULL AFTER `fit_type`,
  ADD COLUMN IF NOT EXISTS `sleeve_length` VARCHAR(100) DEFAULT NULL AFTER `neck_type`,
  ADD COLUMN IF NOT EXISTS `length_type` VARCHAR(100) DEFAULT NULL AFTER `sleeve_length`,
  ADD COLUMN IF NOT EXISTS `pack_of` INT DEFAULT 1 AFTER `length_type`,
  ADD COLUMN IF NOT EXISTS `pattern_type` VARCHAR(100) DEFAULT NULL AFTER `pack_of`,
  ADD COLUMN IF NOT EXISTS `pattern_coverage` VARCHAR(100) DEFAULT NULL AFTER `pattern_type`,
  ADD COLUMN IF NOT EXISTS `ornamentation` VARCHAR(255) DEFAULT NULL AFTER `pattern_coverage`,
  ADD COLUMN IF NOT EXISTS `features` JSON DEFAULT NULL AFTER `ornamentation`,
  ADD COLUMN IF NOT EXISTS `category_attributes` JSON DEFAULT NULL AFTER `features`;