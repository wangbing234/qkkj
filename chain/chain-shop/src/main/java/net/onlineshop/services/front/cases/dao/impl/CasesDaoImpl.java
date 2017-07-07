/**
 * 2015-7-8
 * 
 */
package net.onlineshop.services.front.cases.dao.impl;

import java.util.List;

import net.onlineshop.core.dao.BaseDao;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.services.front.cases.bean.Cases;
import net.onlineshop.services.front.cases.dao.CasesDao;

/**
 * 
 */
public class CasesDaoImpl implements CasesDao {
	private BaseDao dao;

	public void setDao(BaseDao dao) {
		this.dao = dao;
	}

	public PagerModel selectPageList(Cases e) {
		return dao.selectPageList("front.cases.selectPageList", "front.cases.selectPageCount", e);
	}

	public List selectList(Cases e) {
		return dao.selectList("front.cases.selectList", e);
	}

	public Cases selectOne(Cases e) {
		return (Cases) dao.selectOne("front.cases.selectOne", e);
	}

	public int delete(Cases e) {
		return dao.delete("front.cases.delete", e);
	}

	public int update(Cases e) {
		return dao.update("front.cases.update", e);
	}

	public int insert(Cases e) {
		return dao.insert("front.cases.insert", e);
	}

	@Override
	public int deleteById(int id) {
		return dao.delete("front.cases.deleteById", id);
	}

	@Override
	public Cases selectById(String id) {
		return (Cases) dao.selectOne("front.cases.selectById", id);
	}

}
