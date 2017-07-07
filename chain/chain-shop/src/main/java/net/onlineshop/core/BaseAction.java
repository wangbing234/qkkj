package net.onlineshop.core;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.Preparable;

import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.core.system.bean.User;

/**
 * 基础的action
 * 
 * @param <E>
 */
@SuppressWarnings({ "serial", "unchecked" })
public abstract class BaseAction<E extends PagerModel> extends ActionSupport implements Preparable {

	private static final Logger logger = LoggerFactory.getLogger(BaseAction.class);
	protected static final long serialVersionUID = 1L;
	protected final String toList = "toList";
	protected final String selectAllList = "selectAllList";
	protected final String toEdit = "toEdit";
	protected final String toAdd = "toAdd";
	protected String directUrl;
	@Deprecated
	protected final String toShow = "toShow";

	protected final String show = "show";// 显示

	protected final String toOptionSuccess = "toOptionSuccess";//
	protected String init;// init=y 是否进行初始化查询，初始化查询会清除所有的查询条件

	/**
	 * 后台左边导航菜单的初始化查询方法
	 */
	protected void initPageSelect() {
		if (StringUtils.isNotBlank(this.getInit()) && this.getInit().equals("y")) {
			this.e.clear();
			this.init = null;
			logger.debug("initPageSelect..clear all e param!");
		} else {
			logger.debug("initPageSelect..init=n!");
		}
	}

	public String getInit() {
		return init;
	}
	
	public String getRootPath(){
		HttpServletRequest request = ServletActionContext.getRequest();
		String path = request.getRequestURL().toString();
		String rootPath=path.substring(0, path.indexOf(":",path.indexOf(":", 0)+1)+5);
		return rootPath;
	}
	
	public void setInit(String init) {
		this.init = init;
	}
	
	private void setCharacterEncoding(){
		ServletActionContext.getResponse().setContentType("application/json;charset=utf-8");
	}
			

	protected void printJson(String json) throws IOException {
		setCharacterEncoding();
		logger.info(json);
		ServletActionContext.getResponse().getWriter().print(json);
	}
	
	protected void printJson(Object json) throws IOException {
		String jsonStr=JSON.toJSONString(json);
		printJson(jsonStr);
	}
	
	public void printNoLogin() throws IOException {
		printErrorBase(-1, "noLogin",null);
	}
	
	public void printSuccessString(String obj) throws IOException {
		printErrorBase(0, "success",JSON.parse(obj));
	}
	
	public void printSuccess(Object obj) throws IOException {
		printErrorBase(0, "success",obj);
	}
	/**
	 * 应用异常
	 * @param errorString
	 * @throws IOException
	 */
	public void printAppError(Object errorString) throws IOException {
		printErrorBase(3, errorString,null);
	}
	
	/**
	 * 打印程序异常
	 * @param errorString
	 * @throws IOException
	 */
	public void printRunTimeError(Object errorString) throws IOException {
		printErrorBase(2, errorString,null);
	}
	
	public void printErrorBase(Object code,Object msg,Object data) throws IOException {
		Map<String,Object> json=new HashMap<String,Object> ();
		json.put("code", code);
		json.put("msg", msg);
		json.put("data", data==null?"":data);
		printJson(json);
	}

	public String getFromModule() {
		String fromModule = (String) ServletActionContext.getRequest().getSession().getAttribute("fromModule");
		if (StringUtils.isEmpty(fromModule)) 
			return "MOBILE";
		return fromModule;
	}

	/**
	 * 对应页面上的选中的复选框，提单到后台的时候会自动进入该数组
	 */
	protected String[] ids;
	/**
	 * 分页模版
	 */
	protected PagerModel pager = new PagerModel();
	/**
	 * 抽象的业务逻辑层接口句柄，子类可以通过重写setServer方法注入指定的具体业务逻辑句柄来实现个性化需求
	 */
	protected Services<E> server;
	protected E e;

	/**
	 * 在action方法执行之前做的准备操作 (non-Javadoc)
	 * 
	 * @see com.opensymphony.xwork2.Preparable#prepare()
	 */
	public abstract void prepare() throws Exception;

	/**
	 * 抽象的获取查询参数的方法,子类必须重写此方法---模版方法模式
	 * 
	 * @return
	 */
	public abstract E getE();

	/**
	 * insert之后，selectList之前执行的动作，一般需要清除添加的E，否则查询会按照E的条件进行查询. 部分情况下需要保留某些字段，可以选择不清除
	 * 
	 * @param e
	 */
	public abstract void insertAfter(E e);

	/**
	 * 编辑后,返回列表页面之前做的操作.可以在此处清除编辑过的E。
	 * 
	 * @param e
	 */
	protected void backBefore(E e) {
		e.clear();
	}

	/**
	 * 跳转到编辑页面之前做的事情
	 * 
	 * @param e
	 */
	@Deprecated
	protected void toEditBefore(E e) {
	}

	/**
	 * 子类必须要实现的方法当分页查询后. 解决了用户先点击新增按钮转到新增页面,然后点击返回按钮返回后,再点分页控件出错的BUG. 原因是分页查询后未将pageUrl重新设置为正确的URL所致
	 */
	protected abstract void selectListAfter();

	/**
	 * 抽象的获取操作业务逻辑层的bean，子类必须重写此方法以提供各自的操作业务逻辑层的server
	 * 
	 * @return
	 */
	public Services<E> getServer() {
		return this.server;
	}

	public void setServer(Services<E> server) {
		this.server = server;
	}

	public PagerModel getPager() {
		return pager;
	}

	public void setPager(PagerModel pager) {
		this.pager = pager;
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

	public Map<String, Object> getApplication() {
		return ActionContext.getContext().getApplication();
	}

	public String[] getIds() {
		return ids;
	}

	public void setIds(String[] ids) {
		this.ids = ids;
	}

	/**
	 * 初始化查询的时候，会清除所有的查询参数(所以在e中的)，但可以设置不在e中的参数，然后在此方法中进行e.setXxx(参数)的方式进行保留。
	 */
	protected void setParamWhenInitQuery() {
		// BaseAction 的子类如有初始化页面的时候进行相关查询 ，则可以实现此方法。
	}

	/**
	 * 不选择任何菜单
	 * 
	 * @param selectID
	 */
	public void setSelectMenu(String selectID) {
		getSession().setAttribute(net.onlineshop.core.FrontContainer.selectMenu, selectID);
	}

	/**
	 * 根据指定的services进行分页查询
	 * 
	 * @param services
	 *            业务逻辑层对象
	 * @param pm
	 *            查询参数对象，此对象必须继承PagerModel
	 * @return PagerModel
	 * @throws Exception
	 */
	public PagerModel selectPagerModelByServices(Services services, PagerModel pm) throws Exception {
		if (services == null || pm == null) {
			throw new NullPointerException();
		} else {
			// pm.clear();
		}

		int offset = 0;
		String pagerOffset = getRequest().getParameter("pager.offset");
		if (StringUtils.isNotBlank(pagerOffset)) {
			// throw new NullPointerException();
			offset = Integer.parseInt(pagerOffset);
		}
		if (offset < 0)
			offset = 0;
		pm.setOffset(offset);

		PagerModel servicesPager = services.selectPageList(pm);
		if (pm.getPageSize() > 0)
			servicesPager.setPageSize(pm.getPageSize());
		if (servicesPager == null)
			servicesPager = new PagerModel();
		// 计算总页数
		servicesPager.setPagerSize((servicesPager.getTotal() + servicesPager.getPageSize() - 1) / servicesPager.getPageSize());
		return servicesPager;
	}

	protected void setPageParms()throws Exception  {}
	/**
	 * 公共的分页方法
	 * 
	 * @return
	 * @throws Exception
	 */
	public String selectList() throws Exception {
		/**
		 * 由于prepare方法不具备一致性，加此代码解决init=y查询的时候条件不被清除干净的BUG
		 */
		this.initPageSelect();

		setParamWhenInitQuery();

		int offset = 0;// 分页偏移量
		HttpServletRequest request = getRequest();
		if (request.getParameter("pager.offset") != null) {
			offset = Integer.parseInt(getRequest().getParameter("pager.offset"));
			setPageParms();
		}
		if (offset < 0)
			offset = 0;
		((PagerModel) getE()).setOffset(offset);
		pager = getServer().selectPageList(getE());
		if (pager == null)
			pager = new PagerModel();
		if (getE().getPageSize() > 0)
			pager.setPageSize(getE().getPageSize());
		// 计算总页数
		pager.setPagerSize((pager.getTotal() + pager.getPageSize() - 1) / pager.getPageSize());

		selectListAfter();

		return toList;
	}

	/**
	 * 返回到查询页面
	 * 
	 * @return
	 * @throws Exception
	 */
	public String back() throws Exception {
		getE().clear();
		return selectList();
	}

	/**
	 * 公共的批量删除数据的方法，子类可以通过重写此方法实现个性化的需求。
	 * 
	 * @return
	 * @throws Exception
	 */
	public String deletes() throws Exception {
		// User user = (User) getSession().getAttribute(Global.USER_INFO);
		// if(user==null){
		// throw new NullPointerException();
		// }
		// if(user.getDbPrivilegeMap()!=null && user.getDbPrivilegeMap().size()>0){
		// if(user.getDbPrivilegeMap().get(Container.db_privilege_delete)==null){
		// throw new PrivilegeException(Container.db_privilege_delete_error);
		// }
		// }

		getServer().deletes(getIds());
		return selectList();
	}
	
	
	public void forward(String url) throws ServletException, IOException
	{
		logger.info("服务器内部跳转,URL="+url); 
		RequestDispatcher  rd = getRequest().getRequestDispatcher(url);  
		rd.forward((ServletRequest)getRequest(),(ServletResponse)getResponse());
	}
	


	/**
	 * 公共的更新数据的方法，子类可以通过重写此方法实现个性化的需求。
	 * 
	 * @return
	 * @throws Exception
	 */
	public String update() throws Exception {
		// User user = (User) getSession().getAttribute(Global.USER_INFO);
		// if(user==null){
		// throw new NullPointerException();
		// }
		// if(user.getDbPrivilegeMap()!=null && user.getDbPrivilegeMap().size()>0){
		// if(user.getDbPrivilegeMap().get(Container.db_privilege_update)==null){
		// throw new PrivilegeException(Container.db_privilege_update_error);
		// }
		// }

		getServer().update(getE());
		insertAfter(getE());
		return selectList();
	}

	/**
	 * 公共的插入数据方法，子类可以通过重写此方法实现个性化的需求。
	 * 
	 * @return
	 * @throws Exception
	 */
	public String insert() throws Exception {
		// User user = (User) getSession().getAttribute(Global.USER_INFO);
		// if(user==null){
		// throw new NullPointerException();
		// }
		// if(user.getDbPrivilegeMap()!=null && user.getDbPrivilegeMap().size()>0){
		// if(user.getDbPrivilegeMap().get(Container.db_privilege_insert)==null){
		// throw new PrivilegeException(Container.db_privilege_insert_error);
		// }
		// }

		getServer().insert(getE());
		insertAfter(getE());
		return selectList();
	}

	/**
	 * 跳转到编辑页面
	 * 
	 * @return
	 * @throws Exception
	 */
	public String toEdit() throws Exception {
		e = getServer().selectOne(getE());
		// if(e==null || StringUtils.isBlank(e.getId())){
		// throw new NullPointerException("");
		// }
		return toEdit;
	}

	public String toAdd() throws Exception {
		e.clear();
		return toAdd;
	}

	/**
	 * 解决使用getResponse().getWriter().write(jsonStr);写出JSON字符串中文出现乱码问题的解决方案，只需要写出中文之前先执行该方法即可
	 */
	public void utf8JSON() {
		getResponse().setContentType("application/json;charset=UTF-8");
		getResponse().setCharacterEncoding("UTF-8");
	}

	public String getDirectUrl() {
		return directUrl;
	}

	public void setDirectUrl(String directUrl) {

		this.directUrl = directUrl;
	}

	public void write(String str) throws IOException {
		getResponse().setCharacterEncoding("UTF-8");
		getResponse().getWriter().write(str);
	}
	
	public User getManagerUser()
	{
		User user =(User)getSession().getAttribute(ManageContainer.manage_session_user_info);
		return user;
	}

	// @Deprecated
	// public void insertCheck() {
	// User user = (User) getSession().getAttribute(Global.USER_INFO);
	// if(user==null){
	// throw new NullPointerException();
	// }
	// if(user.getDbPrivilegeMap()!=null && user.getDbPrivilegeMap().size()>0){
	// if(user.getDbPrivilegeMap().get(Container.db_privilege_insert)==null){
	// throw new PrivilegeException(Container.db_privilege_insert_error);
	// }
	// }
	// }
}
