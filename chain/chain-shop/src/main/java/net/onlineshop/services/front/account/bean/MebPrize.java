package net.onlineshop.services.front.account.bean;

import java.io.Serializable;

import net.onlineshop.core.dao.page.PagerModel;

public class MebPrize  extends PagerModel implements Serializable{  
	private int user_id;
	private String award_name;
	private String award_type;
	private int amount;
	private String award_id;
	private String address;
	private String is_send;
	private String created_time;
	private String order_id;
	public MebPrize() { }
	public MebPrize(String id) {
	   super.setId(id);
	}
	public int getUser_id() {
		return user_id;
	}
	public String getAward_name() {
		return award_name;
	}
	public String getAward_type() {
		return award_type;
	}
	public int getAmount() {
		return amount;
	}
	public String getAward_id() {
		return award_id;
	}
	public String getAddress() {
		return address;
	}
	public String getIs_send() {
		return is_send;
	}
	public String getCreated_time() {
		return created_time;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public void setAward_name(String award_name) {
		this.award_name = award_name;
	}
	public void setAward_type(String award_type) {
		this.award_type = award_type;
	}
	public void setAmount(int amount) {
		this.amount = amount;
	}
	public void setAward_id(String award_id) {
		this.award_id = award_id;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public void setIs_send(String is_send) {
		this.is_send = is_send;
	}
	public void setCreated_time(String created_time) {
		this.created_time = created_time;
	}
	public String getOrder_id() {
		return order_id;
	}
	public void setOrder_id(String order_id) {
		this.order_id = order_id;
	}
	
}
