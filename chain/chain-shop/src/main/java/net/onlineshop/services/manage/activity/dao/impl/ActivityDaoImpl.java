package net.onlineshop.services.manage.activity.dao.impl;import java.util.List;import net.onlineshop.core.dao.BaseDao;import net.onlineshop.core.dao.page.PagerModel;import net.onlineshop.services.manage.activity.bean.Activity;import net.onlineshop.services.manage.activity.dao.ActivityDao;public class ActivityDaoImpl implements ActivityDao {	private BaseDao dao;	public void setDao(BaseDao dao) {		this.dao = dao;	}	public PagerModel selectPageList(Activity e) {		return dao.selectPageList("manage.activity.selectPageList", "manage.activity.selectPageCount", e);	}	public List selectList(Activity e) {		return dao.selectList("manage.activity.selectList", e);	}	public Activity selectOne(Activity e) {		return (Activity) dao.selectOne("manage.activity.selectOne", e);	}	public int delete(Activity e) {		return dao.delete("manage.activity.delete", e);	}	public int update(Activity e) {		return dao.update("manage.activity.update", e);	}	public int deletes(String[] ids) {		Activity e = new Activity();		for (int i = 0; i < ids.length; i++) {			e.setId(ids[i]);			delete(e);		}		return 0;	}	public int insert(Activity e) {		return dao.insert("manage.activity.insert", e);	}	public int deleteById(int id) {		return dao.delete("manage.activity.deleteById", id);	}	@Override	public Activity selectById(String id) {		return (Activity) dao.selectOne("manage.activity.selectById", id);	}}