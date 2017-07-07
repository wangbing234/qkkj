package net.onlineshop.web.action.front.orders;

import net.onlineshop.services.front.order.bean.Order;

public class OrderParms {
	private String orderId;
//	private String isSaveScore;
	private String  payType;//支付方式
//	private String isPayTicket;
	private Order order;
	public OrderParms(String orderId,String payType,Order order)
	{
		this.orderId=orderId;
//		this.isSaveScore=isSaveScore;
		this.payType=payType;
//		this.isPayTicket=isPayTicket;
		this.order=order;
	}
	public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
//	public String getIsSaveScore() {
//		return isSaveScore;
//	}
//	public void setIsSaveScore(String isSaveScore) {
//		this.isSaveScore = isSaveScore;
//	}
	 
	public Order getOrder() {
		return order;
	}
	public void setOrder(Order order) {
		this.order = order;
	}
	public String getPayType() {
		return payType;
	}
	public void setPayType(String payType) {
		this.payType = payType;
	}
//	public String getIsPayTicket() {
//		return isPayTicket;
//	}
//	public void setIsPayTicket(String isPayTicket) {
//		this.isPayTicket = isPayTicket;
//	}
	
}
