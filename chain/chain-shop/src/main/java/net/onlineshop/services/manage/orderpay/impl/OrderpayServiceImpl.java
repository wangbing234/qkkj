package net.onlineshop.services.manage.orderpay.impl;import net.onlineshop.core.ServersManager;import net.onlineshop.services.manage.orderpay.OrderpayService;import net.onlineshop.services.manage.orderpay.bean.Orderpay;import net.onlineshop.services.manage.orderpay.dao.OrderpayDao;public class OrderpayServiceImpl extends ServersManager<Orderpay> implements OrderpayService {	private OrderpayDao orderpayDao;	public void setOrderpayDao(OrderpayDao orderpayDao) {		this.orderpayDao = orderpayDao;	}}