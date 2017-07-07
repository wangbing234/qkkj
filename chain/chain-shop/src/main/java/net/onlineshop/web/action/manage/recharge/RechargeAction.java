package net.onlineshop.web.action.manage.recharge;

import net.onlineshop.core.BaseAction;
import net.onlineshop.services.manage.recharge.RechargeService;
import net.onlineshop.services.manage.recharge.bean.Recharge;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("serial")
public class RechargeAction extends BaseAction<Recharge> {
	private static final Logger logger = LoggerFactory.getLogger(RechargeAction.class);
	private RechargeService rechargeService;

	public RechargeService getRechargeService() {
		return rechargeService;
	}

	public Recharge getE() {
		return this.e;
	}

	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new Recharge();
		} else {
			e.clear();
		}

		super.initPageSelect();
	}

	public void setRechargeService(RechargeService rechargeService) {
		this.rechargeService = rechargeService;
	}

	@Override
	public void insertAfter(Recharge e) {
		// TODO Auto-generated method stub

	}

	@Override
	protected void selectListAfter() {
		// TODO Auto-generated method stub
		pager.setPagerUrl("/manage/recharge!selectList.action");
	}

}
