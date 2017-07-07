package com.qkkj.pay.domain.req;

/**
 * 支付成功回调请求体
 * @author smart迅
 *
 */
public class PaymentReturnReq 
{
	//
	private String success;
	
	//
	private String trade_state;
	
	//
	private String trade_msg;
	
	//
	private Data data;

	public String getSuccess() {
		return success;
	}

	public void setSuccess(String success) {
		this.success = success;
	}

	public String getTrade_state() {
		return trade_state;
	}

	public void setTrade_state(String trade_state) {
		this.trade_state = trade_state;
	}

	public String getTrade_msg() {
		return trade_msg;
	}

	public void setTrade_msg(String trade_msg) {
		this.trade_msg = trade_msg;
	}

	public Data getData() {
		return data;
	}

	public void setData(Data data) {
		this.data = data;
	}

	@Override
	public String toString() {
		return "PaymentReturnReq [success=" + success + ", trade_state=" + trade_state + ", trade_msg=" + trade_msg
				+ ", data=" + data + "]";
	}

	
	
}
