-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 15. Jun 2021 um 14:43
-- Server-Version: 8.0.25-0ubuntu0.20.04.1
-- PHP-Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `nextcontrol`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `karma`
--

CREATE TABLE `karma` (
  `login` varchar(22) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'Player login',
  `uid` varchar(27) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'Map unique ID',
  `vote` int NOT NULL DEFAULT '0' COMMENT 'Karma vote'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `maps`
--

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

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `players`
--

CREATE TABLE `players` (
  `login` varchar(22) NOT NULL COMMENT 'Player login',
  `name` text NOT NULL COMMENT 'Player name'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `records`
--

CREATE TABLE `records` (
  `login` varchar(22) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'Player login',
  `uid` varchar(27) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'Map unique ID',
  `time` int NOT NULL COMMENT 'Record time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `settings`
--

CREATE TABLE `settings` (
  `plugin` varchar(255) NOT NULL COMMENT 'Plugin name',
  `settings` json NOT NULL COMMENT 'Settings JSON'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `karma`
--
ALTER TABLE `karma`
  ADD PRIMARY KEY (`login`,`uid`),
  ADD KEY `karmaUid` (`uid`);

--
-- Indizes für die Tabelle `maps`
--
ALTER TABLE `maps`
  ADD PRIMARY KEY (`uid`);

--
-- Indizes für die Tabelle `players`
--
ALTER TABLE `players`
  ADD PRIMARY KEY (`login`);

--
-- Indizes für die Tabelle `records`
--
ALTER TABLE `records`
  ADD PRIMARY KEY (`login`,`uid`),
  ADD KEY `login` (`login`),
  ADD KEY `recordsUid` (`uid`);

--
-- Indizes für die Tabelle `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`plugin`);

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `karma`
--
ALTER TABLE `karma`
  ADD CONSTRAINT `karmaLogin` FOREIGN KEY (`login`) REFERENCES `players` (`login`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `karmaUid` FOREIGN KEY (`uid`) REFERENCES `maps` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `records`
--
ALTER TABLE `records`
  ADD CONSTRAINT `recordsLogin` FOREIGN KEY (`login`) REFERENCES `players` (`login`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `recordsUid` FOREIGN KEY (`uid`) REFERENCES `maps` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
