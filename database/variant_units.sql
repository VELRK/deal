-- Variant units + product variants migration
-- Run on shopkart database: mysql -u root shopkart < database/variant_units.sql

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ── Master unit types (kg, gram, box, etc.) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS `variant_units` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(80)  NOT NULL,
  `slug`       VARCHAR(80)  NOT NULL,
  `symbol`     VARCHAR(20)  NOT NULL DEFAULT '',
  `unit_type`  ENUM('weight','volume','count','length') NOT NULL DEFAULT 'count',
  `sort_order` INT NOT NULL DEFAULT 0,
  `status`     TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_variant_units_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Sellable product variants (500g, 1kg, 1 box, etc.) ──────────────────────
CREATE TABLE IF NOT EXISTS `product_variants` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id`  INT UNSIGNED NOT NULL,
  `unit_id`     INT UNSIGNED NOT NULL,
  `label`       VARCHAR(120) DEFAULT NULL,
  `unit_value`  DECIMAL(12,3) NOT NULL DEFAULT 1.000,
  `price`       DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `sale_price`  DECIMAL(12,2) DEFAULT NULL,
  `stock`       INT NOT NULL DEFAULT 0,
  `sku`         VARCHAR(80) DEFAULT NULL,
  `image`       VARCHAR(255) DEFAULT NULL,
  `is_default`  TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order`  INT NOT NULL DEFAULT 0,
  `status`      TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`  DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_variants_product` (`product_id`),
  KEY `idx_product_variants_unit` (`unit_id`),
  CONSTRAINT `fk_product_variants_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_variants_unit` FOREIGN KEY (`unit_id`) REFERENCES `variant_units` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Add image column on existing installs
ALTER TABLE `product_variants`
  ADD COLUMN IF NOT EXISTS `image` VARCHAR(255) DEFAULT NULL AFTER `sku`;

-- ── Cart / order line support ───────────────────────────────────────────────
ALTER TABLE `cart`
  ADD COLUMN IF NOT EXISTS `variant_id` INT UNSIGNED NULL DEFAULT NULL AFTER `product_id`;

ALTER TABLE `order_items`
  ADD COLUMN IF NOT EXISTS `variant_id` INT UNSIGNED NULL DEFAULT NULL AFTER `product_id`,
  ADD COLUMN IF NOT EXISTS `variant_label` VARCHAR(120) NULL DEFAULT NULL AFTER `product_sku`;

-- ── Default units ───────────────────────────────────────────────────────────
INSERT IGNORE INTO `variant_units` (`name`, `slug`, `symbol`, `unit_type`, `sort_order`, `status`) VALUES
('Kilogram',   'kilogram',   'kg',  'weight',  1,  1),
('Gram',       'gram',       'g',   'weight',  2,  1),
('Milligram',  'milligram',  'mg',  'weight',  3,  1),
('Litre',      'litre',      'L',   'volume',  4,  1),
('Millilitre', 'millilitre', 'ml',  'volume',  5,  1),
('Piece',      'piece',      'pc',  'count',   6,  1),
('Box',        'box',        'box', 'count',   7,  1),
('Pack',       'pack',       'pack','count',   8,  1),
('Dozen',      'dozen',      'dz',  'count',   9,  1),
('Unit',       'unit',       'unit','count',  10,  1),
('Carton',     'carton',     'ctn', 'count',  11,  1),
('Bag',        'bag',        'bag', 'count',  12,  1),
('Bottle',     'bottle',     'btl', 'count',  13,  1),
('Strip',      'strip',      'strip','count', 14,  1),
('Roll',       'roll',       'roll','count',  15,  1),
('Meter',      'meter',      'm',   'length', 16,  1),
('Centimeter', 'centimeter', 'cm',  'length', 17,  1),
('Set',        'set',        'set', 'count',  18,  1),
('Bundle',     'bundle',     'bdl', 'count',  19,  1),
('Tray',       'tray',       'tray','count',  20,  1),
('Sachet',     'sachet',     'sachet','count',21,  1),
('Can',        'can',        'can', 'count',  22,  1),
('Tub',        'tub',        'tub', 'count',  23,  1);

SET FOREIGN_KEY_CHECKS = 1;
