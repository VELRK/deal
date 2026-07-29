-- Askeva Order WhatsApp settings — safe to re-run
SET NAMES utf8mb4;

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_whatsapp_enabled', '1'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_whatsapp_enabled');

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_api_url', 'https://backend.askeva.io/v1/message/send-message'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_api_url');

INSERT INTO `settings` (`key`, `value`)
SELECT 'askeva_api_token', '674e498739ed6b8f2ed24ebdc3b243272776edd10cca20161979f8c72637842b05bab827f1867cd2efb49331993e20b0dc196c48de22694331f722bd079bab53'
WHERE NOT EXISTS (SELECT 1 FROM `settings` WHERE `key` = 'askeva_api_token');

-- Always set current production token
UPDATE `settings`
SET `value` = '674e498739ed6b8f2ed24ebdc3b243272776edd10cca20161979f8c72637842b05bab827f1867cd2efb49331993e20b0dc196c48de22694331f722bd079bab53'
WHERE `key` = 'askeva_api_token';

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
