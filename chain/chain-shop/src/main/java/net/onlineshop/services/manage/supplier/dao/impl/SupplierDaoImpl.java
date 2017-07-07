package net.onlineshop.services.manage.supplier.dao.impl;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import net.onlineshop.core.dao.BaseDao;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.services.manage.supplier.bean.Supplier;
import net.onlineshop.services.manage.supplier.dao.SupplierDao;

public class SupplierDaoImpl implements SupplierDao {
	private BaseDao dao;

	public void setDao(BaseDao dao) {
		this.dao = dao;
	}

	public PagerModel selectPageList(Supplier e) {
		return dao.selectPageList("manage.supplier.selectPageList", "manage.supplier.selectPageCount", e);
	}

	public List selectList(Supplier e) {
		return dao.selectList("manage.supplier.selectList", e);
	}
	
	public List<Supplier> selectListConst() {
		Supplier e=new Supplier();
//		e.setStatus("y");
		return dao.selectList("manage.supplier.selectList", e);
	}

	public Supplier selectOne(Supplier e) {
		return (Supplier) dao.selectOne("manage.supplier.selectOne", e);
	}

	public int delete(Supplier e) {
		return dao.delete("manage.supplier.delete", e);
	}

	public int update(Supplier e) {
		return dao.update("manage.supplier.update", e);
	}

	public int deletes(String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			deleteById(Integer.parseInt(ids[i]));
		}
		return 0;
	}

	public int insert(Supplier e) {
		return dao.insert("manage.supplier.insert", e);
	}

	public int deleteById(int id) {
		return dao.delete("manage.supplier.deleteById", id);
	}

	@Override
	public Supplier selectById(String id) {
		return (Supplier) dao.selectOne("manage.supplier.selectById", id);
	}




}
