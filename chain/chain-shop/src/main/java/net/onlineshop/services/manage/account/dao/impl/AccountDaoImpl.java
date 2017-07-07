package net.onlineshop.services.manage.account.dao.impl;

import java.util.List;
import net.onlineshop.core.dao.BaseDao;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.services.manage.account.bean.Account;
import net.onlineshop.services.manage.account.dao.AccountDao;
import net.onlineshop.web.action.manage.report.ReportInfo;

public class AccountDaoImpl implements AccountDao {
	private BaseDao dao;

	public void setDao(BaseDao dao) {
		this.dao = dao;
	}

	public PagerModel selectPageList(Account e) {
		return dao.selectPageList("manage.account.selectPageList", "manage.account.selectPageCount", e);
	}

	public List selectList(Account e) {
		return dao.selectList("manage.account.selectList", e);
	}

	public Account selectOne(Account e) {
		return (Account) dao.selectOne("manage.account.selectOne", e);
	}

	public int delete(Account e) {
		return dao.delete("manage.account.delete", e);
	}

	public int update(Account e) {
		return dao.update("manage.account.update", e);
	}

	public int deletes(String[] ids) {
		Account e = new Account();
		for (int i = 0; i < ids.length; i++) {
			e.setId(ids[i]);
			delete(e);
		}
		return 0;
	}

	public int insert(Account e) {
		return dao.insert("manage.account.insert", e);
	}

	public int deleteById(int id) {
		return dao.delete("manage.account.deleteById", id);
	}

	@Override
	public Account selectById(String id) {
		return (Account) dao.selectOne("manage.account.selectById", id);
	}

	@Override
	public List<ReportInfo> selectUserSales(ReportInfo info) {
		return dao.selectList("manage.order.selectUserSales", info);
	}

	@Override
	public List<ReportInfo> selectRegisterSales(ReportInfo info) {
		return dao.selectList("manage.order.selectRegisterSales", info);
	}
}
