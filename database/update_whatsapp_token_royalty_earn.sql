-- WhatsApp token + royalty earn rate update (safe to re-run)
SET NAMES utf8mb4;

-- Askeva WhatsApp API token
INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_api_token', '674e498739ed6b8f2ed24ebdc3b243272776edd10cca20161979f8c72637842b05bab827f1867cd2efb49331993e20b0dc196c48de22694331f722bd079bab53'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_api_token');

UPDATE `settings`
SET `value` = '674e498739ed6b8f2ed24ebdc3b243272776edd10cca20161979f8c72637842b05bab827f1867cd2efb49331993e20b0dc196c48de22694331f722bd079bab53'
WHERE `key` = 'askeva_api_token';

-- Royalty: RM 5000 purchase → 500 pts (0.1 pts / RM)
-- Redeem stays 500 pts → RM 100 (wallet_points_per_rm = 5)
INSERT INTO `settings` (`key`, `value`)
SELECT 'royalty_earn_points_per_rm', '0.1'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'royalty_earn_points_per_rm');

UPDATE `settings`
SET `value` = '0.1'
WHERE `key` = 'royalty_earn_points_per_rm';

INSERT INTO `settings` (`key`, `value`)
SELECT 'wallet_points_per_rm', '5'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'wallet_points_per_rm');

UPDATE `settings`
SET `value` = '5'
WHERE `key` = 'wallet_points_per_rm'
  AND (`value` IS NULL OR TRIM(`value`) = '' OR CAST(`value` AS DECIMAL(10,4)) <= 0);

INSERT INTO `settings` (`key`, `value`)
SELECT 'royalty_min_redeem_points', '500'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'royalty_min_redeem_points');

INSERT INTO `settings` (`key`, `value`)
SELECT 'royalty_min_redeem_rm', '100'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'royalty_min_redeem_rm');
