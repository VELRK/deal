-- ============================================================
-- ShopKart - Saree Business Attribute Columns
-- Run this AFTER shopkart.sql
-- ============================================================

USE `shopkart`;

-- ── Add saree-specific columns to products table ─────────────
ALTER TABLE `products`
  ADD COLUMN `saree_type`       VARCHAR(100) DEFAULT NULL COMMENT 'Banarasi, Kanjivaram, Paithani, Bandhani, Chanderi, etc.'     AFTER `tags`,
  ADD COLUMN `fabric`           VARCHAR(100) DEFAULT NULL COMMENT 'Silk, Cotton, Chiffon, Georgette, Linen, Crepe, Net, Organza'  AFTER `saree_type`,
  ADD COLUMN `occasion`         VARCHAR(150) DEFAULT NULL COMMENT 'Wedding, Casual, Festival, Party, Office, Bridal'              AFTER `fabric`,
  ADD COLUMN `work_type`        VARCHAR(150) DEFAULT NULL COMMENT 'Zari, Embroidery, Printed, Plain, Woven, Sequence, Block Print' AFTER `occasion`,
  ADD COLUMN `color`            VARCHAR(100) DEFAULT NULL COMMENT 'Primary color name'                                             AFTER `work_type`,
  ADD COLUMN `color_hex`        VARCHAR(10)  DEFAULT NULL COMMENT 'Hex code e.g. #FF0000'                                         AFTER `color`,
  ADD COLUMN `color2`           VARCHAR(100) DEFAULT NULL COMMENT 'Secondary color'                                                AFTER `color_hex`,
  ADD COLUMN `saree_length`     DECIMAL(4,2) DEFAULT 5.50 COMMENT 'Length in meters (5.5, 6, 6.5)'                               AFTER `color2`,
  ADD COLUMN `blouse_included`  TINYINT(1)   NOT NULL DEFAULT 0 COMMENT 'Is blouse piece included?'                              AFTER `saree_length`,
  ADD COLUMN `blouse_length`    DECIMAL(4,2) DEFAULT 0.80 COMMENT 'Blouse piece length in meters'                                AFTER `blouse_included`,
  ADD COLUMN `set_contains`     VARCHAR(255) DEFAULT NULL COMMENT 'Saree Only / Saree+Blouse / Saree+Blouse+Petticoat'            AFTER `blouse_length`,
  ADD COLUMN `border_type`      VARCHAR(100) DEFAULT NULL COMMENT 'Plain, Woven, Embroidered, Contrast, Zari Border'             AFTER `set_contains`,
  ADD COLUMN `transparency`     ENUM('opaque','semi-sheer','sheer') DEFAULT 'opaque'                                               AFTER `border_type`,
  ADD COLUMN `wash_care`        VARCHAR(150) DEFAULT NULL COMMENT 'Dry Clean Only, Hand Wash, Machine Wash Cold'                  AFTER `transparency`,
  ADD COLUMN `origin_state`     VARCHAR(100) DEFAULT NULL COMMENT 'State of origin: Varanasi, Tamil Nadu, Gujarat, Maharashtra'   AFTER `wash_care`,
  ADD COLUMN `weave_type`       VARCHAR(100) DEFAULT NULL COMMENT 'Hand-woven, Power-loom, Machine-woven, Handblock'              AFTER `origin_state`,
  ADD COLUMN `net_weight`       DECIMAL(6,3) DEFAULT NULL COMMENT 'Weight in grams'                                               AFTER `weave_type`,
  ADD COLUMN `zari_type`        VARCHAR(100) DEFAULT NULL COMMENT 'Real Zari, Artificial Zari, Silver Zari, Gold Zari'            AFTER `net_weight`,
  ADD COLUMN `suitable_for`     VARCHAR(150) DEFAULT NULL COMMENT 'Women, Girls, Plus Size, Maternity'                            AFTER `zari_type`,
  ADD COLUMN `return_policy`    VARCHAR(255) DEFAULT 'Easy 7-day return' COMMENT 'Custom return policy for this item'             AFTER `suitable_for`;

-- ── Saree style lookup table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS `saree_styles` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(100) NOT NULL,
  `state`       VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `image`       VARCHAR(255) DEFAULT NULL,
  `status`      TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_saree_style_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `saree_styles` (`name`, `state`) VALUES
('Banarasi',      'Uttar Pradesh'),
('Kanjivaram',    'Tamil Nadu'),
('Paithani',      'Maharashtra'),
('Bandhani',      'Gujarat'),
('Chanderi',      'Madhya Pradesh'),
('Patola',        'Gujarat'),
('Pochampally',   'Telangana'),
('Mysore Silk',   'Karnataka'),
('Sambalpuri',    'Odisha'),
('Tant',          'West Bengal'),
('Nauvari',       'Maharashtra'),
('Kasavu',        'Kerala'),
('Phulkari',      'Punjab'),
('Leheriya',      'Rajasthan'),
('Chikankari',    'Uttar Pradesh'),
('Gadwal',        'Telangana'),
('Ilkal',         'Karnataka'),
('Maheshwari',    'Madhya Pradesh'),
('Jamdani',       'West Bengal'),
('Kalamkari',     'Andhra Pradesh'),
('Plain / Other', NULL);

-- ── Update settings for saree business ───────────────────────
UPDATE `settings` SET `value` = 'ShopKart Sarees'           WHERE `key` = 'site_name';
UPDATE `settings` SET `value` = 'Buy Pure Silk & Cotton Sarees Online at Best Prices' WHERE `key` = 'meta_desc';
UPDATE `settings` SET `value` = 'ShopKart Sarees - Buy Silk, Cotton & Designer Sarees Online' WHERE `key` = 'meta_title';

-- ── Sample saree category structure ──────────────────────────
INSERT INTO `categories` (`name`, `slug`, `description`, `status`) VALUES
('Silk Sarees',      'silk-sarees',      'Pure and art silk sarees',          1),
('Cotton Sarees',    'cotton-sarees',    'Handloom and printed cotton sarees', 1),
('Designer Sarees',  'designer-sarees',  'Embroidered and designer sarees',    1),
('Wedding Sarees',   'wedding-sarees',   'Bridal and wedding collection',      1),
('Casual Sarees',    'casual-sarees',    'Daily wear and office sarees',       1),
('Festival Sarees',  'festival-sarees',  'Festival and puja collection',       1),
('Georgette Sarees', 'georgette-sarees', 'Georgette and chiffon sarees',       1),
('Banarasi Sarees',  'banarasi-sarees',  'Authentic Banarasi silk sarees',     1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
