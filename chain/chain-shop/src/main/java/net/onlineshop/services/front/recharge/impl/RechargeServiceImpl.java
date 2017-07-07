package net.onlineshop.services.front.recharge.impl;

import net.onlineshop.core.ServersManager;
import net.onlineshop.services.front.recharge.RechargeService;
import net.onlineshop.services.front.recharge.bean.Recharge;
import net.onlineshop.services.front.recharge.dao.RechargeDao;

public class RechargeServiceImpl extends ServersManager<Recharge> implements RechargeService {
	private RechargeDao rechargeDao;

	public void setRechargeDao(RechargeDao rechargeDao) {
		this.rechargeDao = rechargeDao;
	}

}
