-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb2+deb7u1
-- http://www.phpmyadmin.net
--
-- Host: mysql-general
-- Generation Time: Feb 18, 2015 at 10:13 AM
-- Server version: 5.6.20
-- PHP Version: 5.4.36-0+deb7u3

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: oatts
--

-- --------------------------------------------------------

--
-- Table structure for table login_attempts
--

CREATE TABLE IF NOT EXISTS login_attempts (
  user_id int(11) NOT NULL,
  lastaccess varchar(30) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  attempts int(11) NOT NULL,
  PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table oatts
--

CREATE TABLE IF NOT EXISTS oatts (
  id int(11) NOT NULL AUTO_INCREMENT,
  userId int(11) NOT NULL,
  tray blob NOT NULL,
  providers blob NOT NULL,
  settings blob,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=19 ;

-- --------------------------------------------------------

--
-- Table structure for table sessions
--

CREATE TABLE IF NOT EXISTS sessions (
  sid varchar(255) NOT NULL,
  sess_value text,
  lastaccesstime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (sid)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table users
--

CREATE TABLE IF NOT EXISTS users (
  id int(11) NOT NULL AUTO_INCREMENT,
  username varchar(30) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  email text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  salt text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  password text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=42 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;