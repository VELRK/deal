-- =============================================================================
-- Wallet top-up fix — run ONCE in phpMyAdmin (or mysql client)
-- Database: your shopkart / production DB
--
-- Fixes:
--   1) Adds topup / topup_pending / topup_sandbox to source ENUM
--   2) Repairs orphaned pending rows (Pending Razorpay / ToyyibPay)
--   3) Repairs completed top-up rows if source was stored empty
--
-- After this SQL + deploying Sk_Customer_wallet_model.php:
--   - New Razorpay top-ups will credit the wallet correctly
--   - Pending rows will NOT show in customer transaction history
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Step 1: Extend source ENUM (safe to re-run if values already exist)
ALTER TABLE `customer_wallet_transactions`
  MODIFY COLUMN `source` ENUM(
    'admin_add',
    'order_payment',
    'refund',
    'promo',
    'adjustment',
    'topup',
    'topup_pending',
    'topup_sandbox'
  ) NOT NULL;

-- Step 2: Mark in-progress top-ups as topup_pending
UPDATE `customer_wallet_transactions`
SET `source` = 'topup_pending'
WHERE (`source` = '' OR `source` IS NULL)
  AND (
    `description` LIKE 'Pending Razorpay%'
    OR `description` LIKE 'Pending ToyyibPay%'
  );

-- Step 3: Mark completed wallet recharges as topup
UPDATE `customer_wallet_transactions`
SET `source` = 'topup'
WHERE (`source` = '' OR `source` IS NULL)
  AND `description` LIKE 'Wallet recharge RM%';

-- Step 4: Sandbox/dev top-ups
UPDATE `customer_wallet_transactions`
SET `source` = 'topup_sandbox'
WHERE (`source` = '' OR `source` IS NULL)
  AND `reference` LIKE 'TOPUP-%'
  AND `description` NOT LIKE 'Pending %';

SET FOREIGN_KEY_CHECKS = 1;

-- Optional: verify (run separately if you want to check results)
-- SELECT source, COUNT(*) AS cnt FROM customer_wallet_transactions GROUP BY source;
-- SELECT id, user_id, amount, balance_after, source, reference, description
-- FROM customer_wallet_transactions
-- WHERE description LIKE 'Pending Razorpay%' OR description LIKE 'Pending ToyyibPay%'
-- ORDER BY id DESC;
