package net.onlineshop.services.front.order.bean;

public class ReturnPay {
	private String orderNo;
	private String amount;
	private String status;//true:false
	private String sign;
	public String getOrderNo() {
		return orderNo;
	}
	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}
	public String getAmount() {
		return amount;
	}
	public void setAmount(String amount) {
		this.amount = amount;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getSign() {
		return sign;
	}
	public void setSign(String sign) {
		this.sign = sign;
	}
	@Override
	public String toString() {
		return "orderNo:"+orderNo+"amount:"+amount+"status:"+status+"sign:"+sign;
	}
}
