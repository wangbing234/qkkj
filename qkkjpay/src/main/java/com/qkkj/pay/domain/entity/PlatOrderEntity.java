package com.qkkj.pay.domain.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity(name="t_platorder")
public class PlatOrderEntity 
{
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int ID;
	
	@Column(length=50)
	private String appId;
	
	@Column(length=20)
	private int amount;
	
	@Column(length=100,unique=true)
	private String exorderNum;
	
	private int chanel;
	
	private int busiType;
	
	private Timestamp createTime;
	
	private Timestamp updateTime;
	
	private int statues;
	
	@Column(length=40)
	private String retCode;
	
	@Column(length=40)
	private String retMsg;

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public String getExorderNum() {
		return exorderNum;
	}

	public void setExorderNum(String exorderNum) {
		this.exorderNum = exorderNum;
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

	public String getRetCode() {
		return retCode;
	}

	public void setRetCode(String retCode) {
		this.retCode = retCode;
	}

	public String getRetMsg() {
		return retMsg;
	}

	public void setRetMsg(String retMsg) {
		this.retMsg = retMsg;
	}
	
	
}
