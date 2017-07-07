package com.qkkj.pay.domain.req;

import java.io.Serializable;

import javax.validation.constraints.Pattern;

import org.hibernate.validator.constraints.Length;

import com.qkkj.pay.common.constants.Constants;

/**
 * 网页支付 webpay 请求体
 * @author smart迅
 *
 */
public class PaymentReq implements Serializable
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	//第三方支付渠道
	@Pattern(regexp="^[1234]$",message="channel error")
	private String channel;
	
	//开发商订单号
	@Pattern(regexp=Constants.SPECIALCAHR,message="order_no error")
	@Length(min=6)
	private String order_no;
		
	//交易金额，以分为单位
	@Pattern(regexp="^\\d{1,11}$",message="busiType error")
	private String amount;
	
	//商户号
	@Pattern(regexp="^[123]$",message="busiType error")
	private String busiType;
	
	private String returnUrl;

	public String getReturnUrl() {
		return returnUrl;
	}

	public void setReturnUrl(String returnUrl) {
		this.returnUrl = returnUrl;
	}

	public String getChannel() {
		return channel;
	}

	public void setChannel(String channel) {
		this.channel = channel;
	}

	public String getOrder_no() {
		return order_no;
	}

	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

	public String getBusiType() {
		return busiType;
	}

	public void setBusiType(String busiType) {
		this.busiType = busiType;
	}

	@Override
	public String toString() {
		return "PaymentReq [channel=" + channel + ", order_no=" + order_no + ", amount=" + amount + ", busiType="
				+ busiType + "]";
	}	
	
	
}
