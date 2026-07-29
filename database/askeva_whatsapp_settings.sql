-- Askeva Order WhatsApp settings — safe to re-run
SET NAMES utf8mb4;

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_whatsapp_enabled', '1'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_whatsapp_enabled');

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_api_url', 'https://backend.askeva.io/v1/message/send-message'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_api_url');

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_api_token', '5c9fbbe16cbd3ec293504d7d4d758e1adf160554f488609ef64df040d05f2176e44afba64867f635ae34fa48c296203707809db18d5b13e2609176cf18642f10'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_api_token');

-- Fill blank token left by earlier seed
UPDATE `settings`
SET `value` = '5c9fbbe16cbd3ec293504d7d4d758e1adf160554f488609ef64df040d05f2176e44afba64867f635ae34fa48c296203707809db18d5b13e2609176cf18642f10'
WHERE `key` = 'askeva_api_token'
  AND (`value` IS NULL OR TRIM(`value`) = '');

UPDATE `settings`
SET `value` = 'https://backend.askeva.io/v1/message/send-message'
WHERE `key` = 'askeva_api_url'
  AND (`value` IS NULL OR TRIM(`value`) = '');

UPDATE `settings` SET `value` = '1' WHERE `key` = 'askeva_whatsapp_enabled' AND (`value` IS NULL OR TRIM(`value`) = '');

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_order_template', ''
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_order_template');

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_template_lang', 'en'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_template_lang');
