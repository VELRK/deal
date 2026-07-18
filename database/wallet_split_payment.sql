-- Split checkout: wallet partial + Razorpay remainder (run once in phpMyAdmin)
SET NAMES utf8mb4;

ALTER TABLE `orders`
  ADD COLUMN IF NOT EXISTS `wallet_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00 AFTER `total`;
