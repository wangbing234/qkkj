package net.onlineshop.services.manage.account.impl;

import java.util.List;

import net.onlineshop.core.ServersManager;
import net.onlineshop.services.manage.account.AccountService;
import net.onlineshop.services.manage.account.bean.Account;
import net.onlineshop.services.manage.account.dao.AccountDao;
import net.onlineshop.web.action.manage.report.ReportInfo;

import org.apache.commons.lang.StringUtils;

public class AccountServiceImpl extends ServersManager<Account> implements AccountService {
	private AccountDao accountDao;

	public void setAccountDao(AccountDao accountDao) {
		this.accountDao = accountDao;
	}

	/**
	 * 批量删除
	 * 
	 * @param ids
	 * @return
	 */
	public int deletes(String[] ids) {
		if (ids == null || ids.length == 0) {
			throw new NullPointerException("id不能全为空！");
		}

		for (int i = 0; i < ids.length; i++) {
			if (StringUtils.isBlank(ids[i])) {
				throw new NullPointerException("id不能为空！");
			}
			accountDao.deleteById(Integer.parseInt(ids[i]));
		}
		return 0;
	}

	@Override
	public List<ReportInfo> selectUserSales(ReportInfo info) {
		return accountDao.selectUserSales(info);
	}

	@Override
	public List<ReportInfo> selectRegisterSales(ReportInfo info) {
		return accountDao.selectRegisterSales(info);
	}

}
