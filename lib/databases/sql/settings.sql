CREATE TABLE `settings` (
  `plugin` varchar(255) NOT NULL COMMENT 'Plugin name',
  `settings` json NOT NULL COMMENT 'Settings JSON'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
