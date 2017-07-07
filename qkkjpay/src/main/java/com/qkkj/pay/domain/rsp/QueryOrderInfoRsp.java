package com.qkkj.pay.domain.rsp;

import com.qkkj.pay.domain.common.BaseResult;

public class QueryOrderInfoRsp extends BaseResult
{
	//第三方支付渠道
	private String statues;
		
	private String updateTime;

	public String getStatues() {
		return statues;
	}

	public void setStatues(String statues) {
		this.statues = statues;
	}

	public String getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}

	@Override
	public String toString() {
		return "QueryOrderInfoRsp [statues=" + statues + ", updateTime=" + updateTime + "]";
	}

	
}
