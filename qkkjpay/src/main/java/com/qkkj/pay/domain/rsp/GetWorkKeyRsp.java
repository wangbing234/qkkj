package com.qkkj.pay.domain.rsp;

import com.qkkj.pay.domain.common.BaseResult;

public class GetWorkKeyRsp extends BaseResult
{
	//工作密钥
	private String key;

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
	
}
