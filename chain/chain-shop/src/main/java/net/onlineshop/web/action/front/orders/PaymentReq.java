package net.onlineshop.web.action.front.orders;

import java.io.Serializable;

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
	private String channel;
	
	//开发商订单号
	private String order_no;
		
	//交易金额，以分为单位
	private String amount;
	
	//商户号
	private String busiType;
	
	private String returnUrl;

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

	public String getReturnUrl() {
		return returnUrl;
	}

	public void setReturnUrl(String returnUrl) {
		this.returnUrl = returnUrl;
	}

 
	
	
}
