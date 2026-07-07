-- ============================================================
-- ShopKart - Full eCommerce Database Schema
-- MySQL 5.7+ / MariaDB 10.3+
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
CREATE DATABASE IF NOT EXISTS `shopkart` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `shopkart`;

-- ============================================================
-- TABLE: admins
-- ============================================================
CREATE TABLE `admins` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(100) NOT NULL,
  `email`      VARCHAR(150) NOT NULL,
  `password`   VARCHAR(255) NOT NULL,
  `role`       ENUM('superadmin','admin','staff') NOT NULL DEFAULT 'admin',
  `avatar`     VARCHAR(255) DEFAULT NULL,
  `status`     TINYINT(1) NOT NULL DEFAULT 1,
  `last_login` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admins_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admins` (`name`,`email`,`password`,`role`) VALUES
('Super Admin','admin@shopkart.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','superadmin');
-- default password: password

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE `users` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`            VARCHAR(100) NOT NULL,
  `email`           VARCHAR(150) NOT NULL,
  `password`        VARCHAR(255) NOT NULL,
  `phone`           VARCHAR(20) DEFAULT NULL,
  `avatar`          VARCHAR(255) DEFAULT NULL,
  `email_verified`  TINYINT(1) NOT NULL DEFAULT 0,
  `verify_token`    VARCHAR(100) DEFAULT NULL,
  `reset_token`     VARCHAR(100) DEFAULT NULL,
  `reset_expires`   DATETIME DEFAULT NULL,
  `status`          TINYINT(1) NOT NULL DEFAULT 1,
  `newsletter`      TINYINT(1) NOT NULL DEFAULT 0,
  `last_login`      DATETIME DEFAULT NULL,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE `categories` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `parent_id`   INT UNSIGNED DEFAULT NULL,
  `name`        VARCHAR(150) NOT NULL,
  `slug`        VARCHAR(180) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `image`       VARCHAR(255) DEFAULT NULL,
  `sort_order`  INT NOT NULL DEFAULT 0,
  `status`      TINYINT(1) NOT NULL DEFAULT 1,
  `meta_title`  VARCHAR(255) DEFAULT NULL,
  `meta_desc`   VARCHAR(500) DEFAULT NULL,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_categories_slug` (`slug`),
  KEY `idx_categories_parent` (`parent_id`),
  KEY `idx_categories_status` (`status`),
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`name`,`slug`,`description`,`status`) VALUES
('Electronics','electronics','Electronic gadgets and devices',1),
('Clothing','clothing','Men and Women clothing',1),
('Books','books','Books and e-books',1),
('Home & Kitchen','home-kitchen','Home and kitchen essentials',1),
('Sports','sports','Sports and fitness equipment',1);

-- ============================================================
-- TABLE: brands
-- ============================================================
CREATE TABLE `brands` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(100) NOT NULL,
  `slug`       VARCHAR(120) NOT NULL,
  `logo`       VARCHAR(255) DEFAULT NULL,
  `status`     TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_brands_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `brands` (`name`,`slug`) VALUES
('Samsung','samsung'),('Apple','apple'),('Nike','nike'),
('Adidas','adidas'),('Sony','sony'),('LG','lg');

-- ============================================================
-- TABLE: products
-- ============================================================
CREATE TABLE `products` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id`      INT UNSIGNED NOT NULL,
  `brand_id`         INT UNSIGNED DEFAULT NULL,
  `name`             VARCHAR(255) NOT NULL,
  `slug`             VARCHAR(280) NOT NULL,
  `sku`              VARCHAR(100) DEFAULT NULL,
  `description`      LONGTEXT DEFAULT NULL,
  `short_desc`       TEXT DEFAULT NULL,
  `price`            DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `sale_price`       DECIMAL(10,2) DEFAULT NULL,
  `stock`            INT NOT NULL DEFAULT 0,
  `low_stock_alert`  INT NOT NULL DEFAULT 5,
  `weight`           DECIMAL(8,2) DEFAULT NULL,
  `dimensions`       VARCHAR(100) DEFAULT NULL,
  `thumbnail`        VARCHAR(255) DEFAULT NULL,
  `featured`         TINYINT(1) NOT NULL DEFAULT 0,
  `status`           ENUM('active','inactive','draft') NOT NULL DEFAULT 'active',
  `meta_title`       VARCHAR(255) DEFAULT NULL,
  `meta_desc`        VARCHAR(500) DEFAULT NULL,
  `tags`             VARCHAR(500) DEFAULT NULL,
  `total_sold`       INT UNSIGNED NOT NULL DEFAULT 0,
  `avg_rating`       DECIMAL(3,2) DEFAULT 0.00,
  `review_count`     INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_products_slug` (`slug`),
  KEY `idx_products_category` (`category_id`),
  KEY `idx_products_brand` (`brand_id`),
  KEY `idx_products_status` (`status`),
  KEY `idx_products_featured` (`featured`),
  KEY `idx_products_price` (`price`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_products_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: product_images
-- ============================================================
CREATE TABLE `product_images` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` INT UNSIGNED NOT NULL,
  `image`      VARCHAR(255) NOT NULL,
  `alt`        VARCHAR(255) DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pimages_product` (`product_id`),
  CONSTRAINT `fk_pimages_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: addresses
-- ============================================================
CREATE TABLE `addresses` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     INT UNSIGNED NOT NULL,
  `label`       VARCHAR(50) DEFAULT 'Home',
  `full_name`   VARCHAR(100) NOT NULL,
  `phone`       VARCHAR(20) NOT NULL,
  `line1`       VARCHAR(255) NOT NULL,
  `line2`       VARCHAR(255) DEFAULT NULL,
  `city`        VARCHAR(100) NOT NULL,
  `state`       VARCHAR(100) NOT NULL,
  `pincode`     VARCHAR(20) NOT NULL,
  `country`     VARCHAR(100) NOT NULL DEFAULT 'India',
  `is_default`  TINYINT(1) NOT NULL DEFAULT 0,
  `created_at`  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_addresses_user` (`user_id`),
  CONSTRAINT `fk_addresses_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: cart
-- ============================================================
CREATE TABLE `cart` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED DEFAULT NULL,
  `session_id` VARCHAR(128) DEFAULT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `quantity`   INT NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cart_user` (`user_id`),
  KEY `idx_cart_session` (`session_id`),
  KEY `idx_cart_product` (`product_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: promo_codes
-- ============================================================
CREATE TABLE `promo_codes` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code`            VARCHAR(50) NOT NULL,
  `description`     VARCHAR(255) DEFAULT NULL,
  `type`            ENUM('percent','fixed') NOT NULL DEFAULT 'percent',
  `value`           DECIMAL(10,2) NOT NULL,
  `min_order`       DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `max_discount`    DECIMAL(10,2) DEFAULT NULL,
  `usage_limit`     INT DEFAULT NULL,
  `usage_count`     INT NOT NULL DEFAULT 0,
  `per_user_limit`  INT NOT NULL DEFAULT 1,
  `starts_at`       DATE DEFAULT NULL,
  `expires_at`      DATE DEFAULT NULL,
  `status`          TINYINT(1) NOT NULL DEFAULT 1,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_promo_code` (`code`),
  KEY `idx_promo_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: promo_usage
-- ============================================================
CREATE TABLE `promo_usage` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `promo_id`   INT UNSIGNED NOT NULL,
  `user_id`    INT UNSIGNED NOT NULL,
  `order_id`   INT UNSIGNED DEFAULT NULL,
  `used_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pusage_promo` (`promo_id`),
  KEY `idx_pusage_user` (`user_id`),
  CONSTRAINT `fk_pusage_promo` FOREIGN KEY (`promo_id`) REFERENCES `promo_codes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pusage_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE `orders` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_number`    VARCHAR(50) NOT NULL,
  `user_id`         INT UNSIGNED NOT NULL,
  `address_id`      INT UNSIGNED DEFAULT NULL,
  `subtotal`        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `shipping`        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `tax`             DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `discount`        DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `promo_code`      VARCHAR(50) DEFAULT NULL,
  `total`           DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `payment_method`  VARCHAR(50) NOT NULL DEFAULT 'razorpay',
  `payment_status`  ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  `status`          ENUM('pending','confirmed','processing','shipped','delivered','cancelled','returned') NOT NULL DEFAULT 'pending',
  `notes`           TEXT DEFAULT NULL,
  `shipping_name`   VARCHAR(100) DEFAULT NULL,
  `shipping_phone`  VARCHAR(20) DEFAULT NULL,
  `shipping_line1`  VARCHAR(255) DEFAULT NULL,
  `shipping_line2`  VARCHAR(255) DEFAULT NULL,
  `shipping_city`   VARCHAR(100) DEFAULT NULL,
  `shipping_state`  VARCHAR(100) DEFAULT NULL,
  `shipping_pincode` VARCHAR(20) DEFAULT NULL,
  `shipping_country` VARCHAR(100) DEFAULT NULL,
  `tracking_number` VARCHAR(100) DEFAULT NULL,
  `shipped_at`      DATETIME DEFAULT NULL,
  `delivered_at`    DATETIME DEFAULT NULL,
  `created_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_orders_number` (`order_number`),
  KEY `idx_orders_user` (`user_id`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_payment_status` (`payment_status`),
  KEY `idx_orders_created` (`created_at`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE `order_items` (
  `id`           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`     INT UNSIGNED NOT NULL,
  `product_id`   INT UNSIGNED NOT NULL,
  `product_name` VARCHAR(255) NOT NULL,
  `product_sku`  VARCHAR(100) DEFAULT NULL,
  `thumbnail`    VARCHAR(255) DEFAULT NULL,
  `price`        DECIMAL(10,2) NOT NULL,
  `quantity`     INT NOT NULL DEFAULT 1,
  `subtotal`     DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_oitems_order` (`order_id`),
  KEY `idx_oitems_product` (`product_id`),
  CONSTRAINT `fk_oitems_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_oitems_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: payments
-- ============================================================
CREATE TABLE `payments` (
  `id`                   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id`             INT UNSIGNED NOT NULL,
  `razorpay_order_id`    VARCHAR(100) DEFAULT NULL,
  `razorpay_payment_id`  VARCHAR(100) DEFAULT NULL,
  `razorpay_signature`   VARCHAR(255) DEFAULT NULL,
  `amount`               DECIMAL(10,2) NOT NULL,
  `currency`             VARCHAR(10) NOT NULL DEFAULT 'INR',
  `status`               ENUM('created','captured','failed','refunded') NOT NULL DEFAULT 'created',
  `gateway_response`     JSON DEFAULT NULL,
  `created_at`           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payments_order` (`order_id`),
  KEY `idx_payments_rzp_order` (`razorpay_order_id`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE `reviews` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` INT UNSIGNED NOT NULL,
  `user_id`    INT UNSIGNED NOT NULL,
  `order_id`   INT UNSIGNED DEFAULT NULL,
  `rating`     TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `title`      VARCHAR(255) DEFAULT NULL,
  `body`       TEXT DEFAULT NULL,
  `status`     ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reviews_product` (`product_id`),
  KEY `idx_reviews_user` (`user_id`),
  KEY `idx_reviews_status` (`status`),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: wishlist
-- ============================================================
CREATE TABLE `wishlist` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    INT UNSIGNED NOT NULL,
  `product_id` INT UNSIGNED NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_wishlist_user_product` (`user_id`,`product_id`),
  KEY `idx_wishlist_user` (`user_id`),
  KEY `idx_wishlist_product` (`product_id`),
  CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: newsletter
-- ============================================================
CREATE TABLE `newsletter` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`      VARCHAR(150) NOT NULL,
  `status`     TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_newsletter_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: settings
-- ============================================================
CREATE TABLE `settings` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key`        VARCHAR(100) NOT NULL,
  `value`      TEXT DEFAULT NULL,
  `group`      VARCHAR(50) NOT NULL DEFAULT 'general',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_settings_key` (`key`),
  KEY `idx_settings_group` (`group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`key`,`value`,`group`) VALUES
('site_name','ShopKart','general'),
('site_email','info@shopkart.com','general'),
('site_phone','+91 9876543210','general'),
('site_address','123 Main Street, Mumbai, India','general'),
('currency','INR','general'),
('currency_symbol','₹','general'),
('tax_rate','18','general'),
('shipping_charge','50','general'),
('free_shipping_above','999','general'),
('razorpay_key_id','','payment'),
('razorpay_key_secret','','payment'),
('razorpay_mode','test','payment'),
('smtp_host','','email'),
('smtp_port','587','email'),
('smtp_user','','email'),
('smtp_pass','','email'),
('smtp_from_name','ShopKart','email'),
('meta_title','ShopKart - Online Shopping','seo'),
('meta_desc','Buy products online at best prices','seo');
