-- =============================================================================
-- Royalty separate from wallet — pure MySQL / MariaDB (XAMPP-safe)
-- Usage: Import in phpMyAdmin on DB `shopkart`
--    or: mysql -u root shopkart < database/migrate_royalty_separate.sql
-- Safe to re-run
-- =============================================================================

USE `shopkart`;

-- -----------------------------------------------------------------------------
-- 1) Tables
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `customer_royalty` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `points_balance` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `customer_royalty_transactions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `type` ENUM('earn','redeem') NOT NULL,
  `points` INT NOT NULL DEFAULT 0,
  `amount_rm` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `balance_after_points` INT NOT NULL DEFAULT 0,
  `reference` VARCHAR(100) NULL,
  `description` VARCHAR(255) NULL,
  `order_id` INT UNSIGNED NULL,
  `created_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `reference` (`reference`),
  KEY `type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 2) Royalty accounts
-- -----------------------------------------------------------------------------
INSERT INTO `customer_royalty` (`user_id`, `points_balance`, `created_at`, `updated_at`)
SELECT DISTINCT t.`user_id`, 0, NOW(), NOW()
FROM `customer_wallet_transactions` t
WHERE t.`source` = 'royalty_earn'
  AND t.`user_id` > 0
  AND NOT EXISTS (
    SELECT 1 FROM `customer_royalty` r WHERE r.`user_id` = t.`user_id`
  );

-- -----------------------------------------------------------------------------
-- 3) Copy royalty_earn → royalty ledger
-- points from description "Royalty earn 84 pts ..." via SUBSTRING_INDEX (MariaDB-safe)
-- else amount * wallet_points_per_rm (default 5)
-- -----------------------------------------------------------------------------
INSERT INTO `customer_royalty_transactions` (
  `user_id`, `type`, `points`, `amount_rm`, `balance_after_points`,
  `reference`, `description`, `order_id`, `created_at`
)
SELECT
  t.`user_id`,
  'earn',
  CASE
    WHEN t.`description` LIKE 'Royalty earn % pts%'
      THEN CAST(
        SUBSTRING_INDEX(SUBSTRING_INDEX(t.`description`, ' pts', 1), 'Royalty earn ', -1)
        AS UNSIGNED
      )
    ELSE GREATEST(
      1,
      ROUND(
        t.`amount` * COALESCE(
          (
            SELECT CAST(s.`value` AS DECIMAL(12,4))
            FROM `settings` s
            WHERE s.`key` = 'wallet_points_per_rm'
            LIMIT 1
          ),
          5
        )
      )
    )
  END,
  ROUND(t.`amount`, 2),
  0,
  t.`reference`,
  COALESCE(NULLIF(TRIM(t.`description`), ''), CONCAT('Royalty earn for ', t.`reference`)),
  CASE
    WHEN t.`reference` LIKE 'ORD-%-ROYALTY%'
      THEN CAST(
        SUBSTRING_INDEX(SUBSTRING_INDEX(t.`reference`, '-', 2), '-', -1)
        AS UNSIGNED
      )
    WHEN t.`reference` LIKE 'ORD-%'
      THEN CAST(
        SUBSTRING_INDEX(SUBSTRING_INDEX(t.`reference`, '-', 2), '-', -1)
        AS UNSIGNED
      )
    ELSE NULL
  END,
  t.`created_at`
FROM `customer_wallet_transactions` t
WHERE t.`source` = 'royalty_earn'
  AND t.`user_id` > 0
  AND t.`amount` > 0
  AND IFNULL(t.`reference`, '') <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM `customer_royalty_transactions` rt
    WHERE rt.`user_id` = t.`user_id`
      AND rt.`reference` = t.`reference`
      AND rt.`type` = 'earn'
  );

-- -----------------------------------------------------------------------------
-- 4) Running points balance per user
-- -----------------------------------------------------------------------------
SET @prev_user := NULL;
SET @running := 0;

UPDATE `customer_royalty_transactions` rt
JOIN (
  SELECT
    x.`id`,
    @running := IF(@prev_user = x.`user_id`, @running + x.`signed_pts`, x.`signed_pts`) AS `bal`,
    @prev_user := x.`user_id` AS `_u`
  FROM (
    SELECT
      `id`,
      `user_id`,
      CASE WHEN `type` = 'earn' THEN `points` ELSE -`points` END AS `signed_pts`
    FROM `customer_royalty_transactions`
    ORDER BY `user_id` ASC, `created_at` ASC, `id` ASC
  ) x
) calc ON calc.`id` = rt.`id`
SET rt.`balance_after_points` = GREATEST(0, calc.`bal`);

-- -----------------------------------------------------------------------------
-- 5) Sync points_balance
-- -----------------------------------------------------------------------------
UPDATE `customer_royalty` r
LEFT JOIN (
  SELECT t.`user_id`, t.`balance_after_points`
  FROM `customer_royalty_transactions` t
  INNER JOIN (
    SELECT `user_id`, MAX(`id`) AS `max_id`
    FROM `customer_royalty_transactions`
    GROUP BY `user_id`
  ) m ON m.`max_id` = t.`id`
) last_tx ON last_tx.`user_id` = r.`user_id`
SET
  r.`points_balance` = COALESCE(last_tx.`balance_after_points`, 0),
  r.`updated_at` = NOW();

-- -----------------------------------------------------------------------------
-- 6) Deduct royalty RM from wallet (only earns not yet UNWALLET'd)
-- -----------------------------------------------------------------------------
UPDATE `customer_wallets` w
INNER JOIN (
  SELECT
    t.`user_id`,
    ROUND(SUM(t.`amount`), 2) AS `deduct_rm`
  FROM `customer_wallet_transactions` t
  WHERE t.`source` = 'royalty_earn'
    AND t.`amount` > 0
    AND IFNULL(t.`reference`, '') <> ''
    AND NOT EXISTS (
      SELECT 1
      FROM `customer_wallet_transactions` u
      WHERE u.`user_id` = t.`user_id`
        AND u.`reference` = CONCAT(t.`reference`, '-UNWALLET')
    )
  GROUP BY t.`user_id`
) d ON d.`user_id` = w.`user_id`
SET
  w.`balance` = GREATEST(0, ROUND(w.`balance` - d.`deduct_rm`, 2)),
  w.`updated_at` = NOW();

-- -----------------------------------------------------------------------------
-- 7) Audit debit rows
-- -----------------------------------------------------------------------------
INSERT INTO `customer_wallet_transactions` (
  `wallet_id`, `user_id`, `type`, `amount`, `balance_after`,
  `source`, `reference`, `description`, `created_at`
)
SELECT
  w.`id`,
  t.`user_id`,
  'debit',
  ROUND(t.`amount`, 2),
  ROUND(w.`balance`, 2),
  'adjustment',
  CONCAT(t.`reference`, '-UNWALLET'),
  'Royalty points moved out of wallet (separate royalty ledger)',
  NOW()
FROM `customer_wallet_transactions` t
INNER JOIN `customer_wallets` w ON w.`user_id` = t.`user_id`
WHERE t.`source` = 'royalty_earn'
  AND t.`amount` > 0
  AND IFNULL(t.`reference`, '') <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM `customer_wallet_transactions` x
    WHERE x.`user_id` = t.`user_id`
      AND x.`reference` = CONCAT(t.`reference`, '-UNWALLET')
  );

-- -----------------------------------------------------------------------------
-- 8) Flag + defaults
-- -----------------------------------------------------------------------------
INSERT INTO `settings` (`key`, `value`)
SELECT 'royalty_wallet_migrated', '1' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'royalty_wallet_migrated');

UPDATE `settings` SET `value` = '1' WHERE `key` = 'royalty_wallet_migrated';

INSERT INTO `settings` (`key`, `value`)
SELECT 'royalty_enabled', '1' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'royalty_enabled');

INSERT INTO `settings` (`key`, `value`)
SELECT 'royalty_min_redeem_points', '100' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'royalty_min_redeem_points');

INSERT INTO `settings` (`key`, `value`)
SELECT 'royalty_earn_points_per_rm', '1' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'royalty_earn_points_per_rm');

-- -----------------------------------------------------------------------------
-- 9) Verify
-- -----------------------------------------------------------------------------
SELECT 'royalty_accounts' AS what, COUNT(*) AS cnt FROM `customer_royalty`
UNION ALL
SELECT 'royalty_earn_txs', COUNT(*) FROM `customer_royalty_transactions` WHERE `type` = 'earn'
UNION ALL
SELECT 'unwallet_txs', COUNT(*) FROM `customer_wallet_transactions` WHERE `reference` LIKE '%-UNWALLET'
UNION ALL
SELECT 'flag', CAST(`value` AS UNSIGNED) FROM `settings` WHERE `key` = 'royalty_wallet_migrated';
