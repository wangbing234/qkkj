package net.onlineshop.services.front.recharge.dao.impl;

import java.util.List;

import net.onlineshop.core.dao.BaseDao;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.services.front.recharge.bean.Recharge;
import net.onlineshop.services.front.recharge.dao.RechargeDao;

public class RechargeDaoImpl implements RechargeDao {
	private BaseDao dao;

	public void setDao(BaseDao dao) {
		this.dao = dao;
	}

	public PagerModel selectPageList(Recharge e) {
		return dao.selectPageList("front.recharge.selectPageList", "front.recharge.selectPageCount", e);
	}

	public List selectList(Recharge e) {
		return dao.selectList("front.recharge.selectList", e);
	}

	public Recharge selectOne(Recharge e) {
		return (Recharge) dao.selectOne("front.recharge.selectOne", e);
	}

	public int delete(Recharge e) {
		return dao.delete("front.recharge.delete", e);
	}

	public int update(Recharge e) {
		return dao.update("front.recharge.update", e);
	}

	public int deletes(String[] ids) {
		Recharge e = new Recharge();
		for (int i = 0; i < ids.length; i++) {
			e.setId(ids[i]);
			delete(e);
		}
		return 0;
	}

	public int insert(Recharge e) {
		return dao.insert("front.recharge.insert", e);
	}

	public int deleteById(int id) {
		return dao.delete("front.recharge.deleteById", id);
	}

	@Override
	public Recharge selectById(String id) {
		return (Recharge) dao.selectOne("front.recharge.selectById", id);
	}
}
