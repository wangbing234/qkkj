package com.qkkj.pay.domain.req;

/**
 * @author smart迅
 *扫码付请求体
 */
public class ScanPayReq 
{
	private String channel;
	
	private String submerno;
	
	private String paytype;
	
	private String appid;
	
	private String order_no;
	
	private String amount;
	
	private String subject;
	
	private String body;
	
	private String description;
	
	private String nonce;
	
	private String timestamp;
	
	private String sign;

	public String getChannel() {
		return channel;
	}

	public void setChannel(String channel) {
		this.channel = channel;
	}

	public String getSubmerno() {
		return submerno;
	}

	public void setSubmerno(String submerno) {
		this.submerno = submerno;
	}

	public String getPaytype() {
		return paytype;
	}

	public void setPaytype(String paytype) {
		this.paytype = paytype;
	}

	public String getAppid() {
		return appid;
	}

	public void setAppid(String appid) {
		this.appid = appid;
	}

	public String getOrder_no() {
		return order_no;
	}

	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getNonce() {
		return nonce;
	}

	public void setNonce(String nonce) {
		this.nonce = nonce;
	}

	public String getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(String timestamp) {
		this.timestamp = timestamp;
	}

	public String getSign() {
		return sign;
	}

	public void setSign(String sign) {
		this.sign = sign;
	}

	@Override
	public String toString() {
		return "ScanPayReq [channel=" + channel + ", submerno=" + submerno + ", paytype=" + paytype + ", appid=" + appid
				+ ", order_no=" + order_no + ", amount=" + amount + ", subject=" + subject + ", body=" + body
				+ ", description=" + description + ", nonce=" + nonce + ", timestamp=" + timestamp + ", sign=" + sign
				+ "]";
	}
}
