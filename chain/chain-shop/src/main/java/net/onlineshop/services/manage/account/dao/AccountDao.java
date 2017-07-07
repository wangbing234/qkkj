package net.onlineshop.services.manage.account.dao;

import java.util.List;

import net.onlineshop.core.DaoManager;
import net.onlineshop.services.manage.account.bean.Account;
import net.onlineshop.web.action.manage.report.ReportInfo;

public interface AccountDao extends DaoManager<Account> {
	List<ReportInfo> selectUserSales(ReportInfo info);

	List<ReportInfo> selectRegisterSales(ReportInfo info);
}
