SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE TABLE IF NOT EXISTS `nextcontrol`.`players` (
  `login` VARCHAR(22) NOT NULL COMMENT 'Player login',
  `name` TEXT NOT NULL COMMENT 'Player name',
  PRIMARY KEY (`login`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `nextcontrol`.`maps` (
  `uid` VARCHAR(27) NOT NULL COMMENT 'Map unique ID',
  `name` TEXT NOT NULL COMMENT 'Map name',
  `file` TEXT NOT NULL COMMENT 'Map path relative to UserData/Maps/',
  `author` TEXT NOT NULL COMMENT 'Map author\'s login',
  `mood` TEXT NOT NULL COMMENT 'Map mood',
  `medals` JSON NOT NULL COMMENT 'Map medals object',
  `coppers` INT NOT NULL COMMENT 'Map coppers weight',
  `isMultilap` TINYINT(1) NOT NULL COMMENT 'Whether it\'s a multilap map',
  `nbLaps` INT NOT NULL COMMENT 'Number of Laps',
  `nbCheckpoints` INT NOT NULL COMMENT 'Number of Checkpoints',
  `type` TEXT NOT NULL COMMENT 'Map type',
  `style` TEXT NOT NULL COMMENT 'Map style',
  `tmxid` INT NOT NULL COMMENT 'Map\'s ID on TMX (-1 if absent)',
  PRIMARY KEY (`uid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
CREATE TABLE IF NOT EXISTS `nextcontrol`.`karma` (
  `login` VARCHAR(22) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL COMMENT 'Player login',
  `uid` VARCHAR(27) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL COMMENT 'Map unique ID',
  `vote` INT NOT NULL DEFAULT '0' COMMENT 'Karma vote',
  PRIMARY KEY (`login`, `uid`),
  INDEX `karmaUid` (`uid` ASC) VISIBLE,
  CONSTRAINT `karmaLogin`
    FOREIGN KEY (`login`)
    REFERENCES `nextcontrol`.`players` (`login`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `karmaUid`
    FOREIGN KEY (`uid`)
    REFERENCES `nextcontrol`.`maps` (`uid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `nextcontrol`.`records` (
  `login` VARCHAR(22) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL COMMENT 'Player login',
  `uid` VARCHAR(27) CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_0900_ai_ci' NOT NULL COMMENT 'Map unique ID',
  `time` INT NOT NULL COMMENT 'Record time',
  PRIMARY KEY (`login`, `uid`),
  INDEX `login` (`login` ASC) VISIBLE,
  INDEX `recordsUid` (`uid` ASC) VISIBLE,
  CONSTRAINT `recordsLogin`
    FOREIGN KEY (`login`)
    REFERENCES `nextcontrol`.`players` (`login`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `recordsUid`
    FOREIGN KEY (`uid`)
    REFERENCES `nextcontrol`.`maps` (`uid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `nextcontrol`.`settings` (
  `plugin` VARCHAR(255) NOT NULL COMMENT 'Plugin name',
  `settings` JSON NOT NULL COMMENT 'Settings JSON',
  PRIMARY KEY (`plugin`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
