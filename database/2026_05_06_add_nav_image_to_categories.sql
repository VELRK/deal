-- Add dedicated nav_image column to categories for navbar display
ALTER TABLE `categories`
  ADD COLUMN `nav_image` VARCHAR(255) DEFAULT NULL AFTER `image`;
