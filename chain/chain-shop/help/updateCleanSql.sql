--订单相关
delete from t_order;
delete from t_orderdetail;
delete from t_orderlog;
delete from t_orderpay;
delete from t_ordership;
delete from t_systemlog;


--地址表      delete from t_address   where account not in (select t.Rid from  cqs2.meb_basic t)
delete from t_address;


--删除开单产品规格
delete from t_spec where productID in (select id from t_product where product_type=38)
--删除开单产品
delete from t_product where product_type=38;