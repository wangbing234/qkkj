package com.qkkj.pay.domain.rsp;

import com.qkkj.pay.domain.common.BaseResult;

/**
 * @author smart迅
 *支付成功返回消息体
 */
public class WebPayRsp extends BaseResult
{
	private String data;

	public String getData() {
		return data;
	}

	public void setData(String data) {
		this.data = data;
	}
	
	
	
}
