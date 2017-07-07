package net.onlineshop.dao.impl;

import java.util.List;

import net.onlineshop.core.dao.BaseDao;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.dao.TransAreaDAO;
import net.onlineshop.services.common.TransArea;

public class TransAreaDAOImpl implements TransAreaDAO {
	private BaseDao dao;

	public void setDao(BaseDao dao) {
		this.dao = dao;
	}

	public PagerModel selectPageList(TransArea e) {
		return dao.selectPageList("transArea.selectPageList", "transArea.selectPageCount", e);
	}

	public List selectList(TransArea e) {
		return dao.selectList("transArea.selectList", e);
	}

	public TransArea selectOne(TransArea e) {
		return (TransArea) dao.selectOne("transArea.selectOne", e);
	}

	public TransArea selectTotal(TransArea e) {
		return (TransArea) dao.selectOne("transArea.selectTotal", e);
	}

	public int delete(TransArea e) {
		return dao.delete("transArea.delete", e);
	}

	public int update(TransArea e) {
		return dao.update("transArea.update", e);
	}

	public int deletes(String[] ids) {
		TransArea e = new TransArea();
		for (int i = 0; i < ids.length; i++) {
			e.setId(ids[i]);
			delete(e);
		}
		return 0;
	}

	public int insert(TransArea e) {
		return dao.insert("transArea.insert", e);
	}

	public int deleteById(int id) {
		return dao.delete("transArea.deleteById", id);
	}

	@Override
	public TransArea selectById(String id) {

		return (TransArea) dao.selectOne("transArea.selectById", id);
	}
}
