package net.onlineshop.services.common;

import java.io.Serializable;

import net.onlineshop.core.dao.QueryModel;

public class Recharge extends QueryModel implements Serializable {
	private static final long serialVersionUID = 1L;
	private String id;
	private String createAccount;// 创建者
	private String createtime;// 录入时间
	private Double money;// 充值金额
	private Double fee;// 充值卷
	private String note;
	private String tradNo;// 交易号
	private String state;
	private String type;// 充值方式

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCreateAccount() {
		return createAccount;
	}

	public void setCreateAccount(String createAccount) {
		this.createAccount = createAccount;
	}

	public String getCreatetime() {
		return createtime;
	}

	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}

	public Double getMoney() {
		return money;
	}

	public void setMoney(Double money) {
		this.money = money;
	}

	public Double getFee() {
		return fee;
	}

	public void setFee(Double fee) {
		this.fee = fee;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public String getTradNo() {
		return tradNo;
	}

	public void setTradNo(String tradNo) {
		this.tradNo = tradNo;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

}
