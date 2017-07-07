package net.onlineshop.services.manage.supplierlinkman.dao.impl;


import java.util.List;

import net.onlineshop.core.dao.BaseDao;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.services.manage.supplierlinkman.bean.SupplierLinkman;
import net.onlineshop.services.manage.supplierlinkman.dao.SupplierLinkmanDao;

public class SupplierLinkmanDaoImpl implements SupplierLinkmanDao {
	private BaseDao dao;

	public void setDao(BaseDao dao) {
		this.dao = dao;
	}

	public PagerModel selectPageList(SupplierLinkman e) {
		return dao.selectPageList("manage.supplierlinkman.selectPageList", "manage.supplierlinkman.selectPageCount", e);
	}

	public List<SupplierLinkman> selectList(SupplierLinkman e) {
		return dao.selectList("manage.supplierlinkman.selectList", e);
	}

	public SupplierLinkman selectOne(SupplierLinkman e) {
		return (SupplierLinkman) dao.selectOne("manage.supplierlinkman.selectOne", e);
	}

	public int delete(SupplierLinkman e) {
		return dao.delete("manage.supplierlinkman.delete", e);
	}

	public int update(SupplierLinkman e) {
		return dao.update("manage.supplierlinkman.update", e);
	}

	public int deletes(String[] ids) {
		SupplierLinkman e = new SupplierLinkman();
		for (int i = 0; i < ids.length; i++) {
			e.setId(ids[i]);
			delete(e);
		}
		return 0;
	}

	public int insert(SupplierLinkman e) {
		return dao.insert("manage.supplierlinkman.insert", e);
	}

	public int deleteById(int id) {
		return dao.delete("manage.supplierlinkman.deleteById", id);
	}

	@Override
	public SupplierLinkman selectById(String id) {
		return (SupplierLinkman) dao.selectOne("manage.supplierlinkman.selectById", id);
	}




}
