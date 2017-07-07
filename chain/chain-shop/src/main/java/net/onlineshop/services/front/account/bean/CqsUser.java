package net.onlineshop.services.front.account.bean;

import java.io.Serializable;

public class CqsUser  implements Serializable{
	private String phone;
	private String name;
	private String mebId;
	public String getPhone() {
		return phone;
	}
	public String getName() {
		return name;
	}
	public String getMebId() {
		return mebId;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setMebId(String mebId) {
		this.mebId = mebId;
	}
	

}
