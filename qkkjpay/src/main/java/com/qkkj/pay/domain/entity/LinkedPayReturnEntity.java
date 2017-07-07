package com.qkkj.pay.domain.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity(name="t_linkedpayreturn")
public class LinkedPayReturnEntity 
{

	//
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	//
	@Column(length=50)
	private String success;
	
	//
	@Column(length=50)
	private String trade_state;
	
	//
	@Column(length=50)
	private String trade_msg;
	
	
	//
	@Column(length=50)
	private String app_id;
	
	//子商户号
	private String submerno;
	
	//第三方支付渠道
	@Column(length=10)
	private String channel;
	
	//支付方式
	@Column(length=10)
	private String paytype;
	
	//
	@Column(unique=true,length=50)
	private String order_no;
	
	//订单描述
	private String description;
	
	//金额
	@Column(length=20)
	private String amount;
	
	//服务端的时间
	private String timestamp; 
	
	//
	@Column(length=50)
	private String transaction_id; 
	
	//参数签名
	private String sign;
	
	private Timestamp create_time;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getSuccess() {
		return success;
	}

	public void setSuccess(String success) {
		this.success = success;
	}

	public String getTrade_state() {
		return trade_state;
	}

	public void setTrade_state(String trade_state) {
		this.trade_state = trade_state;
	}

	public String getTrade_msg() {
		return trade_msg;
	}

	public void setTrade_msg(String trade_msg) {
		this.trade_msg = trade_msg;
	}

	public String getApp_id() {
		return app_id;
	}

	public void setApp_id(String app_id) {
		this.app_id = app_id;
	}

	public String getSubmerno() {
		return submerno;
	}

	public void setSubmerno(String submerno) {
		this.submerno = submerno;
	}

	public String getChannel() {
		return channel;
	}

	public void setChannel(String channel) {
		this.channel = channel;
	}

	public String getPaytype() {
		return paytype;
	}

	public void setPaytype(String paytype) {
		this.paytype = paytype;
	}

	public String getOrder_no() {
		return order_no;
	}

	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	public String getTransaction_id() {
		return transaction_id;
	}

	public void setTransaction_id(String transaction_id) {
		this.transaction_id = transaction_id;
	}

	public String getSign() {
		return sign;
	}

	public void setSign(String sign) {
		this.sign = sign;
	}

	public Timestamp getCreate_time() {
		return create_time;
	}

	public void setCreate_time(Timestamp create_time) {
		this.create_time = create_time;
	}

	@Override
	public String toString() {
		return "LinkedPayReturnEntity [id=" + id + ", success=" + success + ", trade_state=" + trade_state
				+ ", trade_msg=" + trade_msg + ", app_id=" + app_id + ", submerno=" + submerno + ", channel=" + channel
				+ ", paytype=" + paytype + ", order_no=" + order_no + ", description=" + description + ", amount="
				+ amount + ", timestamp=" + timestamp + ", transaction_id=" + transaction_id + ", sign=" + sign + "]";
	} 

}
