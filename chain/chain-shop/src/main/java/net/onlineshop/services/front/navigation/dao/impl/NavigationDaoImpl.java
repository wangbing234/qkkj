package net.onlineshop.services.front.navigation.dao.impl;

import java.util.List;

import net.onlineshop.core.dao.BaseDao;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.services.front.navigation.bean.Navigation;
import net.onlineshop.services.front.navigation.dao.NavigationDao;

public class NavigationDaoImpl implements NavigationDao {
	private BaseDao dao;

	public void setDao(BaseDao dao) {
		this.dao = dao;
	}

	public PagerModel selectPageList(Navigation e) {
		return dao.selectPageList("front.navigation.selectPageList", "front.navigation.selectPageCount", e);
	}

	public List selectList(Navigation e) {
		return dao.selectList("front.navigation.selectList", e);
	}

	public Navigation selectOne(Navigation e) {
		return (Navigation) dao.selectOne("front.navigation.selectOne", e);
	}

	public int delete(Navigation e) {
		return dao.delete("front.navigation.delete", e);
	}

	public int update(Navigation e) {
		return dao.update("front.navigation.update", e);
	}

	public int deletes(String[] ids) {
		Navigation e = new Navigation();
		for (int i = 0; i < ids.length; i++) {
			e.setId(ids[i]);
			delete(e);
		}
		return 0;
	}

	public int insert(Navigation e) {
		return dao.insert("front.navigation.insert", e);
	}

	public int deleteById(int id) {
		return dao.delete("front.navigation.deleteById", id);
	}

	public Navigation selectById(String id) {
		Navigation e = new Navigation();
		e.setId(id);
		return selectOne(e);
	}
}
