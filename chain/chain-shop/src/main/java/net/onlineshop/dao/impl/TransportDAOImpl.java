package net.onlineshop.dao.impl;

import java.util.List;

import net.onlineshop.core.dao.BaseDao;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.dao.TransportDAO;
import net.onlineshop.services.common.Transport;

public class TransportDAOImpl implements TransportDAO {
	private BaseDao dao;

	public void setDao(BaseDao dao) {
		this.dao = dao;
	}

	public PagerModel selectPageList(Transport e) {
		return dao.selectPageList("transport.selectPageList", "transport.selectPageCount", e);
	}

	public List selectList(Transport e) {
		return dao.selectList("transport.selectList", e);
	}

	public Transport selectOne(Transport e) {
		return (Transport) dao.selectOne("transport.selectOne", e);
	}

	public Transport selectTotal(Transport e) {
		return (Transport) dao.selectOne("transport.selectTotal", e);
	}

	public int delete(Transport e) {
		return dao.delete("transport.delete", e);
	}

	public int update(Transport e) {
		return dao.update("transport.update", e);
	}

	public int deletes(String[] ids) {
		Transport e = new Transport();
		for (int i = 0; i < ids.length; i++) {
			e.setId(ids[i]);
			delete(e);
		}
		return 0;
	}

	public int insert(Transport e) {
		return dao.insert("transport.insert", e);
	}

	public int deleteById(int id) {
		return dao.delete("transport.deleteById", id);
	}

	@Override
	public Transport selectById(String id) {

		return (Transport) dao.selectOne("transport.selectById", id);
	}
}
