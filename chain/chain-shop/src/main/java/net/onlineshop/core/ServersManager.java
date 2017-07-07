package net.onlineshop.core;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.core.system.bean.User;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionContext;

public class ServersManager<E extends PagerModel> implements Services<E> {

	private DaoManager<E> dao;

	public DaoManager<E> getDao() {
		return dao;
	}

	public void setDao(DaoManager<E> dao) {
		this.dao = dao;
	}

	/**
	 * 添加
	 * 
	 * @param e
	 * @return
	 */
	public int insert(E e) {
		if (e == null) {
			throw new NullPointerException();
		}
		return dao.insert(e);
	}
	public ActionContext getActionContext() {
		return ActionContext.getContext();
	}
	
	public HttpServletRequest getRequest() {
		return (HttpServletRequest) getActionContext().get(ServletActionContext.HTTP_REQUEST);
	}

	public HttpServletResponse getResponse() {
		return (HttpServletResponse) getActionContext().get(ServletActionContext.HTTP_RESPONSE);
	}

	public HttpSession getSession() {
		return getRequest().getSession();
	}
	
	
	public User getManagerUser()
	{
		User user =(User)getSession().getAttribute(ManageContainer.manage_session_user_info);
		return user;
	}
	

	/**
	 * 批量添加
	 * 
	 * @param e
	 * @return
	 */
	// public void insertList(List<E> list) {
	// if(list==null)
	// throw new NullPointerException();
	//
	// for(int i=0;i<list.size();i++){
	// dao.insert(list.get(i));
	// }
	// }

	/**
	 * 删除
	 * 
	 * @param e
	 * @return
	 */
	public int delete(E e) {
		if (e == null) {
			throw new NullPointerException();
		}
		return dao.delete(e);
	}

	/**
	 * 批量删除
	 * 
	 * @param ids
	 * @return
	 */
	public int deletes(String[] ids) {
		if (ids == null || ids.length == 0) {
			throw new NullPointerException("id不能全为空！");
		}

		for (int i = 0; i < ids.length; i++) {
			if (StringUtils.isBlank(ids[i])) {
				throw new NullPointerException("id不能为空！");
			}
			dao.deleteById(Integer.parseInt(ids[i]));
		}
		return 0;
	}

	/**
	 * 修改
	 * 
	 * @param e
	 * @return
	 */
	public int update(E e) {
		if (e == null) {
			throw new NullPointerException();
		}
		return dao.update(e);
	}

	/**
	 * 查询一条记录
	 * 
	 * @param e
	 * @return
	 */
	public E selectOne(E e) {
		return dao.selectOne(e);
	}

	/**
	 * 分页查询
	 * 
	 * @param e
	 * @return
	 */
	public PagerModel selectPageList(E e) {
		return dao.selectPageList(e);
	}

	public List<E> selectList(E e) {
		return dao.selectList(e);
	}

	@Override
	public E selectById(String id) {
		return dao.selectById(id);
	}
}
