package net.onlineshop.services.manage.account;

import java.util.List;

import net.onlineshop.core.Services;
import net.onlineshop.services.manage.account.bean.Account;
import net.onlineshop.web.action.manage.report.ReportInfo;

public interface AccountService extends Services<Account> {
	List<ReportInfo> selectUserSales(ReportInfo info);

	List<ReportInfo> selectRegisterSales(ReportInfo info);
}
