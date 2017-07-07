package net.onlineshop.services.manage.recharge.impl;

import net.onlineshop.core.ServersManager;
import net.onlineshop.services.manage.recharge.RechargeService;
import net.onlineshop.services.manage.recharge.bean.Recharge;
import net.onlineshop.services.manage.recharge.dao.RechargeDao;

public class RechargeServiceImpl extends ServersManager<Recharge> implements RechargeService {
	private RechargeDao rechargeDao;

	public void setRechargeDao(RechargeDao rechargeDao) {
		this.rechargeDao = rechargeDao;
	}

}
