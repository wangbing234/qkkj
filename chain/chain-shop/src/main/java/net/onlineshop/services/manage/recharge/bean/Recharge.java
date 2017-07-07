package net.onlineshop.services.manage.recharge.bean;

import java.io.Serializable;

public class Recharge extends net.onlineshop.services.common.Recharge implements Serializable {

	private String startDate;
	private String endDate;

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

}
