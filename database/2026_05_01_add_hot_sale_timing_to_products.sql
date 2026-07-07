-- Add hot sale controls with hour-level timing to products.
-- Safe to run multiple times.

ALTER TABLE `products`
  ADD COLUMN IF NOT EXISTS `hot_sale` TINYINT(1) NOT NULL DEFAULT 0 AFTER `sale_price`,
  ADD COLUMN IF NOT EXISTS `sale_start_at` DATETIME NULL AFTER `hot_sale`,
  ADD COLUMN IF NOT EXISTS `sale_end_at` DATETIME NULL AFTER `sale_start_at`;
