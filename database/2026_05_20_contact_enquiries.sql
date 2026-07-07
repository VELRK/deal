-- Contact enquiries table
CREATE TABLE IF NOT EXISTS `contact_enquiries` (
  `id`         INT(11) NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(100) NOT NULL,
  `email`      VARCHAR(150) NOT NULL,
  `message`    TEXT NOT NULL,
  `status`     ENUM('new','read','replied') NOT NULL DEFAULT 'new',
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
