#产品中增加供应商
#ALTER TABLE `t_product`
#ADD COLUMN `supplierId`  int(11) NULL;


#供应商表**/
drop table if exists t_supplier;

CREATE TABLE `t_supplier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `name` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT '0',
  `remark` varchar(600) CHARACTER SET utf8 DEFAULT NULL,
  `catalogIDs` varchar(500) DEFAULT NULL,
  `createtime` datetime DEFAULT NULL,
  `updatetime` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1 COMMENT='供应商';


 
#供应商联系人表
drop table if exists t_supplier_linkman;

#创建供应商联系人表
create table t_supplier_linkman
(
   id                   int(11) not null auto_increment,
   supId                int(11),
   name                 varchar(50),
   tel                  varchar(13),
   phone                varchar(30),
   qq                   varchar(20),
   address              varchar(200),
   isMain               int(2),
   primary key (id)
);

alter table t_supplier_linkman comment '供应商联系人';

ALTER TABLE `t_supplier_linkman`
ADD INDEX `super_idx` (`supId`) USING BTREE ;



#增加供应商菜单
INSERT INTO `t_menu` VALUES ('105', '0', '', '供应商管理', '11', 'module', '/resource/images/menu/caiwu.jpg', '1');
INSERT INTO `t_menu` VALUES ('106', '105', '/manage/supplier!selectList.action', '供应商管理', '1', 'page', null, '1');


#更新订单状态数据*
ALTER TABLE `t_orderdetail`
ADD COLUMN `status`  varchar(8) NULL COMMENT '发货状态' AFTER `remarks`,
ADD COLUMN `expressNo`  varchar(50) NULL COMMENT '快递单号' AFTER `status`,
ADD COLUMN `expressCompanyName`  varchar(50) NULL AFTER `expressNo`,
ADD COLUMN `senddate`  datetime NULL COMMENT '发货日期' AFTER `expressCompanyName`,
ADD COLUMN `signdate`  datetime NULL AFTER `senddate`,
ADD COLUMN `supplierId`  int(11) NULL  COMMENT '供应商' AFTER `senddate`,
ADD COLUMN `productType`  int(11) NULL AFTER `status`,
ADD COLUMN `reurnScore`  float(20,4) NULL AFTER `lowStocks`;


#更新子订单状态数据
UPDATE t_orderdetail,t_order SET 
t_orderdetail.status= t_order.status,
t_orderdetail.expressCompanyName= t_order.expressCompanyName,
t_orderdetail.expressNo= t_order.expressNo,
t_orderdetail.senddate= t_order.senddate
 WHERE t_orderdetail.orderID= t_order.id;
 
 #根据产品更新订单
 UPDATE t_orderdetail,t_product SET 
 t_orderdetail.reurnScore= t_product.point,
 t_orderdetail.productType= t_product.productType,
t_orderdetail.shortName= t_product.shortname,
t_orderdetail.supplierId= t_product.supplierId
 WHERE t_orderdetail.productID= t_product.id;
  
  #创建订单索引，加快访问速度
ALTER TABLE `t_orderdetail`
ADD INDEX `orderid_index` (`orderID`) USING BTREE ;
 
#商品重销和积分字段增加
ALTER TABLE `t_order`
ADD COLUMN cutShopFree  float(20,4) UNSIGNED NULL DEFAULT NULL,
ADD COLUMN `cutPointFree`  float(20,4) NULL AFTER `cutShopFree`,
ADD COLUMN `cutPoint2Free`  float(20,4) NULL AFTER `cutPointFree`,
ADD COLUMN `isPayTicket`  varchar(5) NULL AFTER `cutPoint2Free`;

#删除不必要的表
drop table if exists avd;
drop table if exists cases;
drop table if exists casetype;
drop table if exists consult;
drop table if exists contentinfo;
drop table if exists files;
drop table if exists links;
drop table if exists news;
drop table if exists newstype;
drop table if exists product;
drop table if exists producttype;
drop table if exists recruitment;
drop table if exists service;
drop table if exists systemset;
drop table if exists t_emailnotifyproduct;
drop table if exists t_email;
drop table if exists t_notifytemplate;
drop table if exists t_notice;
drop table if exists t_product_bak;
drop table if exists t_questionnaire;
drop table if exists t_questionnaireitem;
drop table if exists t_questionnaireresult;
drop table if exists t_recharge;
drop table if exists t_sms;
drop table if exists t_reply;
drop table if exists t_sessioncount;
drop table if exists t_task;
drop table if exists tag;
drop table if exists talk;
drop table if exists toptype;
drop table if exists t_spec_back;


ALTER TABLE t_account CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_accountrank CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_activity CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_address CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_advert CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_area CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_attribute CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_attribute_link CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_cases CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_catalog CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_comment CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_commenttype CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_express CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_favorite CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_gift CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_hotquery CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_index_img CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_indexmenu CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_keyvalue CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_lable CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_menu CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_navigation CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_news CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_order CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_orderdetail CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_orderlog CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_orderpay CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_ordership CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_oss CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_pay CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_privilege CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_product CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_role CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_spec CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_supplier CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_supplier_linkman CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_systemlog CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_systemsetting CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_trans_area CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_transport CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE t_user CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;



