package com.qkkj.pay.domain.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * 商户订单实体
 * @author smart迅
 *
 */
@Entity(name="t_busiorder")
public class BusiOrderEntity 
{
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int ID;
	
	private int amount;
	
	@Column(length=50)
	private String orderNo;
	
	private int chanel;
	
	private int busiType;
	
	private Timestamp createTime;
	
	private Timestamp updateTime;
	
	private int statues;
	
	private	String returnUrl;
	
	public String getReturnUrl() {
		return returnUrl;
	}

	public void setReturnUrl(String returnUrl) {
		this.returnUrl = returnUrl;
	}

	@Column(columnDefinition="text")
	private String htmlStr;
	
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

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public int getChanel() {
		return chanel;
	}

	public void setChanel(int chanel) {
		this.chanel = chanel;
	}

	public int getBusiType() {
		return busiType;
	}

	public void setBusiType(int busiType) {
		this.busiType = busiType;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public Timestamp getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Timestamp updateTime) {
		this.updateTime = updateTime;
	}

	public int getStatues() {
		return statues;
	}

	public void setStatues(int statues) {
		this.statues = statues;
	}

	public String getHtmlStr() {
		return htmlStr;
	}

	public void setHtmlStr(String htmlStr) {
		this.htmlStr = htmlStr;
	}
	
	
}
