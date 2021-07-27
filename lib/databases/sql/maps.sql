CREATE TABLE `maps` (
  `uid` varchar(27) NOT NULL COMMENT 'Map unique ID',
  `name` text NOT NULL COMMENT 'Map name',
  `file` text NOT NULL COMMENT 'Map path relative to UserData/Maps/',
  `author` text NOT NULL COMMENT 'Map author''s login',
  `mood` text NOT NULL COMMENT 'Map mood',
  `medals` json NOT NULL COMMENT 'Map medals object',
  `coppers` int NOT NULL COMMENT 'Map coppers weight',
  `isMultilap` tinyint(1) NOT NULL COMMENT 'Whether it''s a multilap map',
  `nbLaps` int NOT NULL COMMENT 'Number of Laps',
  `nbCheckpoints` int NOT NULL COMMENT 'Number of Checkpoints',
  `type` text NOT NULL COMMENT 'Map type',
  `style` text NOT NULL COMMENT 'Map style',
  `tmxid` int NOT NULL COMMENT 'Map''s ID on TMX (-1 if absent)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
