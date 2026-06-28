CREATE TABLE IF NOT EXISTS `sk_testimonials` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `author_name`    VARCHAR(120) NOT NULL,
  `author_title`   VARCHAR(120) DEFAULT NULL COMMENT 'e.g. Verified Buyer',
  `quote`          TEXT NOT NULL,
  `rating`         TINYINT(1) NOT NULL DEFAULT 5,
  `product_id`     INT UNSIGNED DEFAULT NULL,
  `status`         TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=active 0=hidden',
  `sort_order`     SMALLINT(5) NOT NULL DEFAULT 0,
  `created_at`     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
