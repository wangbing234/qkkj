package com.qkkj.pay.domain.req;

import javax.validation.constraints.Pattern;

import com.qkkj.pay.common.constants.Constants;

/**
 * 查询订单状态信息请求体
 * @author smart迅
 *
 */
public class QueryOrderInfoReq 
{	
	/**
	 * 客户端信息
	 */
	@Pattern(regexp="^[12]$",message="busiType error")
	private String busi_type;
	
	/**
	 * 订单号
	 */
	@Pattern(regexp=Constants.SPECIALCAHR,message="order_no error")
	private String order_no;

	public String getBusi_type() {
		return busi_type;
	}

	public void setBusi_type(String busi_type) {
		this.busi_type = busi_type;
	}

	public String getOrder_no() {
		return order_no;
	}

	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}

	@Override
	public String toString() {
		return "QueryOrderInfoReq [busi_type=" + busi_type + ", order_no=" + order_no + "]";
	}
	
}	

