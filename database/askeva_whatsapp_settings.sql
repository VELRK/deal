-- Askeva Order WhatsApp settings — safe to re-run
SET NAMES utf8mb4;

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_whatsapp_enabled', '1'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_whatsapp_enabled');

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_api_url', 'https://backend.askeva.io/v1/message/send-message'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_api_url');

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_api_token', ''
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_api_token');

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_order_template', ''
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_order_template');

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_template_lang', 'en'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_template_lang');
