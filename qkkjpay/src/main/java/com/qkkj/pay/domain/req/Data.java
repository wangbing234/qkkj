package com.qkkj.pay.domain.req;

/**
 * 支付成功返回参数
 * @author smart迅
 *
 */
public class Data 
{
	//回调次数
	private String n_id;
	
	//订单描述
	private String description;
	
	//订单号
	private String order_no;
	
	//子商户号
	private String submerno;
	
	//服务端的时间
	private String timestamp; 
		
	//
	private String app_id;
	
	//支付方式
	private String paytype;		
	
	//金额
	private String amount;	

	//第三方支付渠道
	private String channel;
	
	//参数签名
	private String sign;	

	//
	private String transaction_id;

	public String getN_id() {
		return n_id;
	}

	public void setN_id(String n_id) {
		this.n_id = n_id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getOrder_no() {
		return order_no;
	}

	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}

	public String getSubmerno() {
		return submerno;
	}

	public void setSubmerno(String submerno) {
		this.submerno = submerno;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	public String getApp_id() {
		return app_id;
	}

	public void setApp_id(String app_id) {
		this.app_id = app_id;
	}

	public String getPaytype() {
		return paytype;
	}

	public void setPaytype(String paytype) {
		this.paytype = paytype;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

	public String getChannel() {
		return channel;
	}

	public void setChannel(String channel) {
		this.channel = channel;
	}

	public String getSign() {
		return sign;
	}

	public void setSign(String sign) {
		this.sign = sign;
	}

	public String getTransaction_id() {
		return transaction_id;
	}

	public void setTransaction_id(String transaction_id) {
		this.transaction_id = transaction_id;
	}

	@Override
	public String toString() {
		return "Data [n_id=" + n_id + ", description=" + description + ", order_no=" + order_no + ", submerno="
				+ submerno + ", timestamp=" + timestamp + ", app_id=" + app_id + ", paytype=" + paytype + ", amount="
				+ amount + ", channel=" + channel + ", sign=" + sign + ", transaction_id=" + transaction_id + "]";
	} 

}
