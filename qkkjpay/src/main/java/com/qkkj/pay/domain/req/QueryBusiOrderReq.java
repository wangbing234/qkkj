package com.qkkj.pay.domain.req;

public class QueryBusiOrderReq 
{
	/**
	 * 客户端信息
	 */
	private String busi_type;
	
	/**
	 * 订单号
	 */
	private String order_no;
	
	private String payType;

	public String getPayType() {
		return payType;
	}

	public void setPayType(String payType) {
		this.payType = payType;
	}

	public String getBusi_type() {
		return busi_type;
	}

	public void setBusi_type(String busi_type) {
		this.busi_type = busi_type;
	}

	public String getOrder_no() {
		return order_no;
	}

	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}

	@Override
	public String toString() {
		return "QueryOrderInfoReq [busi_type=" + busi_type + ", order_no=" + order_no + "]";
	}
	
}
