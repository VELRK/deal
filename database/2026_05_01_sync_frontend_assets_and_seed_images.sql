-- Sync frontend image paths with API-served backend assets.
-- Safe to run multiple times.

START TRANSACTION;

-- 1) Normalize product thumbnail paths from old template path.
UPDATE `products`
SET `thumbnail` = REPLACE(`thumbnail`, 'assets/images/', 'assets/frontend/images/')
WHERE `thumbnail` LIKE 'assets/images/%';

-- 2) Ensure category images exist (fallback cycle over available 7 demo images).
UPDATE `categories`
SET `image` = CONCAT('assets/frontend/images/category/fashion-2/cate-', ((`id` - 1) % 7) + 1, '.jpg')
WHERE `image` IS NULL OR TRIM(`image`) = '';

-- 3) Ensure subcategory images exist (fallback cycle over available 7 demo images).
UPDATE `subcategories`
SET `image` = CONCAT('assets/frontend/images/category/fashion-2/cate-', ((`id` - 1) % 7) + 1, '.jpg')
WHERE `image` IS NULL OR TRIM(`image`) = '';

-- 4) Seed product_images when empty for a product.
INSERT INTO `product_images` (`product_id`, `image`, `alt`, `sort_order`, `created_at`)
SELECT
  p.`id`,
  p.`thumbnail`,
  p.`name`,
  0,
  NOW()
FROM `products` p
WHERE p.`thumbnail` IS NOT NULL
  AND TRIM(p.`thumbnail`) <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM `product_images` pi
    WHERE pi.`product_id` = p.`id`
  );

COMMIT;
