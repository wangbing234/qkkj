package com.qkkj.pay.domain.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * 工作密钥dao层实体
 * @author smart迅
 *
 */
@Entity(name="t_workkey")
public class WorkKeyEntity 
{
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int ID;
	
	@Column(length=50)
	private String signkey;
	
	@Column(length=11)
	private String day;
	
	private Timestamp createTime;

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public String getSignkey() {
		return signkey;
	}

	public void setSignkey(String signkey) {
		this.signkey = signkey;
	}

	public String getDay() {
		return day;
	}

	public void setDay(String day) {
		this.day = day;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}
	
}
