package net.onlineshop.services.front.account.bean;

import java.io.Serializable;

public class GuestAccount implements Serializable {

	private String orderMobile;
	private String shipName;
	private String shipMobile;
	private String shipAddress;
	private String shipPcode;
	private String shipCcode;
	private String shipAcode;

	public GuestAccount() {
	};

	public String getOrderMobile() {
		return orderMobile;
	}

	public void setOrderMobile(String orderMobile) {
		this.orderMobile = orderMobile;
	}

	public String getShipName() {
		return shipName;
	}

	public void setShipName(String shipName) {
		this.shipName = shipName;
	}

	public String getShipMobile() {
		return shipMobile;
	}

	public void setShipMobile(String shipMobile) {
		this.shipMobile = shipMobile;
	}

	public String getShipAddress() {
		return shipAddress;
	}

	public void setShipAddress(String shipAddress) {
		this.shipAddress = shipAddress;
	}

	public String getShipPcode() {
		return shipPcode;
	}

	public void setShipPcode(String shipPcode) {
		this.shipPcode = shipPcode;
	}

	public String getShipCcode() {
		return shipCcode;
	}

	public void setShipCcode(String shipCcode) {
		this.shipCcode = shipCcode;
	}

	public String getShipAcode() {
		return shipAcode;
	}

	public void setShipAcode(String shipAcode) {
		this.shipAcode = shipAcode;
	}

}
