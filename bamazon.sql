-- phpMyAdmin SQL Dump
-- version 4.4.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Oct 01, 2016 at 07:16 PM
-- Server version: 5.6.25
-- PHP Version: 5.5.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `premiere`
--
create database premiere;
use premiere;

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE IF NOT EXISTS `customer` (
  `CUSTOMER_NUM` char(3) NOT NULL,
  `CUSTOMER_NAME` char(35) NOT NULL,
  `STREET` char(15) DEFAULT NULL,
  `CITY` char(15) DEFAULT NULL,
  `STATE` char(2) DEFAULT NULL,
  `ZIP` char(5) DEFAULT NULL,
  `BALANCE` decimal(8,2) DEFAULT NULL,
  `CREDIT_LIMIT` decimal(8,2) DEFAULT NULL,
  `REP_NUM` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`CUSTOMER_NUM`, `CUSTOMER_NAME`, `STREET`, `CITY`, `STATE`, `ZIP`, `BALANCE`, `CREDIT_LIMIT`, `REP_NUM`) VALUES
('148', 'Al''s Appliance and Sport', '2837 \nGreenway', 'Fillmore', 'FL', '33336', '6550.00', '7500.00', '20'),
('282', 'Brookings Direct', '3827 \nDevon', 'Grove', 'FL', '33321', '431.50', '10000.00', '35'),
('356', 'Ferguson''s', '382 \nWildwood', 'Northfield', 'FL', '33146', '5785.00', '7500.00', '65'),
('408', 'The Everything Shop', '1828 \nRaven', 'Crystal', 'FL', '33503', '5285.25', '5000.00', '35'),
('462', 'Bargains Galore', '3829 \nCentral', 'Grove', 'FL', '33321', '3412.00', '10000.00', '65'),
('524', 'Kline''s', '838 \nRidgeland', 'Fillmore', 'FL', '33336', '12762.00', '15000.00', '20'),
('608', 'Johnson''s Department Store', '372 \nOxford', 'Sheldon', 'FL', '33553', '2106.00', '10000.00', '65'),
('687', 'Lee''s Sport and Appliance', '282 \nEvergreen', 'Altonville', 'FL', '32543', '2851.00', '5000.00', '35'),
('725', 'Deerfield''s Four Seasons', '282 \nColumbia', 'Sheldon', 'FL', '33553', '248.00', '7500.00', '35'),
('842', 'All Season', '28 Lakeview', 'Grove', 'FL', '33321', '8221.00', '7500.00', '20');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `ORDER_NUM` char(5) NOT NULL,
  `ORDER_DATE` date DEFAULT NULL,
  `CUSTOMER_NUM` char(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`ORDER_NUM`, `ORDER_DATE`, `CUSTOMER_NUM`) VALUES
('21608', '2007-10-20', '148'),
('21610', '2007-10-20', '356'),
('21613', '2007-10-21', '408'),
('21614', '2007-10-21', '282'),
('21617', '2007-10-23', '608'),
('21619', '2007-10-23', '148'),
('21623', '2007-10-23', '608');

-- --------------------------------------------------------

--
-- Table structure for table `order_line`
--

CREATE TABLE IF NOT EXISTS `order_line` (
  `ORDER_NUM` char(5) NOT NULL DEFAULT '',
  `PART_NUM` char(4) NOT NULL DEFAULT '',
  `NUM_ORDERED` decimal(3,0) DEFAULT NULL,
  `QUOTED_PRICE` decimal(6,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `order_line`
--

INSERT INTO `order_line` (`ORDER_NUM`, `PART_NUM`, `NUM_ORDERED`, `QUOTED_PRICE`) VALUES
('21608', 'AT94', '11', '21.95'),
('21610', 'DR93', '1', '495.00'),
('21610', 'DW11', '1', '399.99'),
('21613', 'KL62', '4', '329.95'),
('21614', 'KT03', '2', '595.00'),
('21617', 'BV06', '2', '794.95'),
('21617', 'CD52', '4', '150.00'),
('21619', 'DR93', '1', '495.00'),
('21623', 'KV29', '2', '1290.00');

-- --------------------------------------------------------

--
-- Table structure for table `part`
--

CREATE TABLE IF NOT EXISTS `part` (
  `PART_NUM` char(4) NOT NULL,
  `DESCRIPTION` char(15) DEFAULT NULL,
  `ON_HAND` decimal(4,0) DEFAULT NULL,
  `CLASS` char(2) DEFAULT NULL,
  `WAREHOUSE` char(1) DEFAULT NULL,
  `PRICE` decimal(6,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `part`
--

INSERT INTO `part` (`PART_NUM`, `DESCRIPTION`, `ON_HAND`, `CLASS`, `WAREHOUSE`, `PRICE`) VALUES
('AT94', 'Iron', '50', 'HW', '3', '24.95'),
('BV06', 'Home Gym', '45', 'SG', '2', '794.95'),
('CD52', 'Microwave Oven', '32', 'AP', '1', '165.00'),
('DL71', 'Cordless Drill', '21', 'HW', '3', '129.95'),
('DR93', 'Gas Range', '8', 'AP', '2', '495.00'),
('DW11', 'Washer', '12', 'AP', '3', '399.99'),
('FD21', 'Stand Mixer', '22', 'HW', '3', '159.95'),
('KL62', 'Dryer', '12', 'AP', '1', '349.95'),
('KT03', 'Dishwasher', '8', 'AP', '3', '595.00'),
('KV29', 'Treadmill', '9', 'SG', '2', '1390.00');

-- --------------------------------------------------------

--
-- Table structure for table `rep`
--

CREATE TABLE IF NOT EXISTS `rep` (
  `REP_NUM` char(2) NOT NULL,
  `LAST_NAME` char(15) DEFAULT NULL,
  `FIRST_NAME` char(15) DEFAULT NULL,
  `STREET` char(15) DEFAULT NULL,
  `CITY` char(15) DEFAULT NULL,
  `STATE` char(2) DEFAULT NULL,
  `ZIP` char(5) DEFAULT NULL,
  `COMMISSION` decimal(7,2) DEFAULT NULL,
  `RATE` decimal(3,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rep`
--

INSERT INTO `rep` (`REP_NUM`, `LAST_NAME`, `FIRST_NAME`, `STREET`, `CITY`, `STATE`, `ZIP`, `COMMISSION`, `RATE`) VALUES
('20', 'Kaiser', 'Valerie', '624 Randall', 'Grove', 'FL', '33321', '20542.50', '0.05'),
('35', 'Hull', 'Richard', '532 Jackson', 'Sheldon', 'FL', '33553', '39216.00', '0.07'),
('65', 'Perez', 'Juan', '1626 Taylor', 'Fillmore', 'FL', '33336', '23487.00', '0.05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`CUSTOMER_NUM`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`ORDER_NUM`);

--
-- Indexes for table `order_line`
--
ALTER TABLE `order_line`
  ADD PRIMARY KEY (`ORDER_NUM`,`PART_NUM`);

--
-- Indexes for table `part`
--
ALTER TABLE `part`
  ADD PRIMARY KEY (`PART_NUM`);

--
-- Indexes for table `rep`
--
ALTER TABLE `rep`
  ADD PRIMARY KEY (`REP_NUM`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
