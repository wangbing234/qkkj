package com.qkkj.pay.domain.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 *统一支付平台请求表
 * @author smart迅
 *
 */
@Entity(name="t_linkedpayreq")
public class LinkedPayPlatReqEntity 
{
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int ID;
	
	private int amount;
	
	@Column(length=50)
	private String appId;
	
	@Column(length=50)
	private String body;
	
	private int channel;
	
	private String description;
	
	private String nonce;
	
	@Column(length=50)
	private String orderNo;
	
	private String sign;
	
	private String subject;
	
	private String submerNo;
	
	private String payTimestamp;
	
	private Timestamp createTime;

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public int getChannel() {
		return channel;
	}

	public void setChannel(int channel) {
		this.channel = channel;
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

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public String getSign() {
		return sign;
	}

	public void setSign(String sign) {
		this.sign = sign;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getSubmerNo() {
		return submerNo;
	}

	public void setSubmerNo(String submerNo) {
		this.submerNo = submerNo;
	}

	public String getPayTimestamp() {
		return payTimestamp;
	}

	public void setPayTimestamp(String payTimestamp) {
		this.payTimestamp = payTimestamp;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	
}
