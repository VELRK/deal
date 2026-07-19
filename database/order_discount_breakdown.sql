-- Split stacked checkout discounts on orders (affiliate promo + wallet payment)
ALTER TABLE `orders`
  ADD COLUMN IF NOT EXISTS `affiliate_discount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER `discount`,
  ADD COLUMN IF NOT EXISTS `wallet_discount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER `affiliate_discount`;
