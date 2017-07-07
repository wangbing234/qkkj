package com.qkkj.pay.domain.rsp;

import com.qkkj.pay.domain.common.BaseResult;
import com.qkkj.pay.domain.entity.BusiOrderEntity;

public class SaveBusiOrderEntityRsp extends BaseResult
{
	private BusiOrderEntity busiOrderEntity;

	public BusiOrderEntity getBusiOrderEntity() {
		return busiOrderEntity;
	}

	public void setBusiOrderEntity(BusiOrderEntity busiOrderEntity) {
		this.busiOrderEntity = busiOrderEntity;
	}
	
	
	
}
