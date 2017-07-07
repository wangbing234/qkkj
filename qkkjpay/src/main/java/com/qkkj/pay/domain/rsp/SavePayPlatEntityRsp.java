package com.qkkj.pay.domain.rsp;

import com.qkkj.pay.domain.common.BaseResult;
import com.qkkj.pay.domain.entity.PlatOrderEntity;

public class SavePayPlatEntityRsp extends BaseResult
{
	private PlatOrderEntity platOrderEntity;

	public PlatOrderEntity getPlatOrderEntity() {
		return platOrderEntity;
	}

	public void setPlatOrderEntity(PlatOrderEntity platOrderEntity) {
		this.platOrderEntity = platOrderEntity;
	}
	
	
}
