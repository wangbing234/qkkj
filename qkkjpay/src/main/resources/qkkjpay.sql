/*
SQLyog v10.2 
MySQL - 5.7.11 : Database - pay
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`pay` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_bin */;

USE `pay`;

/*Table structure for table `t_busiorder` */

DROP TABLE IF EXISTS `t_busiorder`;

CREATE TABLE `t_busiorder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` int(11) NOT NULL,
  `busi_type` int(11) NOT NULL,
  `chanel` int(11) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `html_str` text COLLATE utf8_bin,
  `order_no` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `statues` int(11) NOT NULL,
  `update_time` datetime DEFAULT NULL,
  `return_url` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `t_linkedpayreq` */

DROP TABLE IF EXISTS `t_linkedpayreq`;

CREATE TABLE `t_linkedpayreq` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` int(11) NOT NULL,
  `app_id` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `body` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `channel` int(11) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `description` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `nonce` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `order_no` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `pay_timestamp` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `sign` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `submer_no` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `t_linkedpayreturn` */

DROP TABLE IF EXISTS `t_linkedpayreturn`;

CREATE TABLE `t_linkedpayreturn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `app_id` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `channel` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `description` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `order_no` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `paytype` varchar(10) COLLATE utf8_bin DEFAULT NULL,
  `sign` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `submerno` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `success` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `timestamp` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `trade_msg` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `trade_state` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `transaction_id` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_sntshpvp8fxf0mwm0en8xcfgx` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `t_platorder` */

DROP TABLE IF EXISTS `t_platorder`;

CREATE TABLE `t_platorder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` int(11) DEFAULT NULL,
  `app_id` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `busi_type` int(11) NOT NULL,
  `chanel` int(11) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `exorder_num` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `ret_code` varchar(40) COLLATE utf8_bin DEFAULT NULL,
  `ret_msg` varchar(40) COLLATE utf8_bin DEFAULT NULL,
  `statues` int(11) NOT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_e7cc5sy80nmg4su8oa6tu7f2l` (`exorder_num`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `t_workkey` */

DROP TABLE IF EXISTS `t_workkey`;

CREATE TABLE `t_workkey` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_time` datetime DEFAULT NULL,
  `day` varchar(11) COLLATE utf8_bin DEFAULT NULL,
  `signkey` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
