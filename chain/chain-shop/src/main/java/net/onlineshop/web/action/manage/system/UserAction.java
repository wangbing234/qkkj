package net.onlineshop.web.action.manage.system;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.slf4j.LoggerFactory;

import com.opensymphony.xwork2.ModelDriven;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.ManageContainer;
import net.onlineshop.core.exception.NotThisMethod;
import net.onlineshop.core.oscache.ManageCache;
import net.onlineshop.core.system.bean.User;
import net.onlineshop.core.util.AddressUtils;
import net.onlineshop.core.util.MD5;
import net.onlineshop.core.util.security.CipherUtil;
import net.onlineshop.services.front.account.impl.SystemParms;
import net.onlineshop.services.manage.system.impl.RoleService;
import net.onlineshop.services.manage.system.impl.UserService;
import net.onlineshop.services.manage.systemlog.SystemlogService;
import net.onlineshop.services.manage.systemlog.bean.Systemlog;

/**
 * 后台用户管理
 * 
 *
 */
public class UserAction extends BaseAction<User> implements ModelDriven<User> {
	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(UserAction.class);

	private static final long serialVersionUID = 1L;

	private UserService userService;
	private RoleService roleService;
	private SystemlogService systemlogService;
	private String errorMsg;
	private List roleList;// 角色列表-编辑用户用到
	private ManageCache manageCache;

	// getter setter

	public List getRoleList() {
		return roleList;
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public ManageCache getManageCache() {
		return manageCache;
	}

	public void setManageCache(ManageCache manageCache) {
		this.manageCache = manageCache;
	}

	public void setRoleList(List roleList) {
		this.roleList = roleList;
	}

	public void setRoleService(RoleService roleService) {
		this.roleService = roleService;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	@Override
	public User getE() {
		return this.e;
	}

	public User getModel() {
		return this.e;
	}

	@Override
	public void insertAfter(User e) {
		e.clear();
	}

	public void setSystemlogService(SystemlogService systemlogService) {
		this.systemlogService = systemlogService;
	}

	@Override
	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new User();
		}

		super.initPageSelect();
	}
	
	/**
	 * 后台登录
	 * 
	 * @return
	 * @throws Exception
	 */
	public String login201501212lssm() throws Exception {

		if (getSession().getAttribute(ManageContainer.manage_session_user_info) != null) {
			this.printJson("{\"code\":0,\"mess\":\"登录成功!\"}");
			return null;
		}

		if (StringUtils.isBlank(e.getUsername()) || StringUtils.isBlank(e.getPassword())) {

			this.printJson("{\"code\":1,\"mess\":\"账户和密码不能为空!\"}");
			return null;
		}

		e.setPassword(CipherUtil.encodePassword(e.getPassword(), e.getUsername()));
		User u = ((UserService) getServer()).login(e);

		Integer errorNum = (Integer) this.getSession().getAttribute("errorNum");
		if (errorNum == null) {
			errorNum = 0;
		}
		if (errorNum > 5) {
			this.printJson("{\"code\":1,\"mess\":\"您的账户5次登陆失败,不能再登录\"}");
			return null;
		}

		if (u == null) {
			logger.debug("登陆失败，账号不存在！");
			errorNum = errorNum + 1;
			this.getSession().setAttribute("errorNum", errorNum);
			this.printJson("{\"code\":1,\"mess\":\"帐号或密码错误!\"}");
			return null;

		} else if (!u.getStatus().equals(User.user_status_y)) {
			logger.debug("帐号已被禁用，请联系管理员!");
			this.printJson("{\"code\":1,\"mess\":\"帐号已被禁用，请联系管理员\"}");
			return null;
		}
		u.setUsername(e.getUsername());
		errorMsg = null;
		e.clear();
		getSession().setAttribute(ManageContainer.manage_session_user_info, u);
		this.printJson("{\"code\":0,\"mess\":\"登录成功!\"}");
		this.getSession().setAttribute("errorNum", 0);
		return null;
	}

	public String main() {
		if (getSession().getAttribute(ManageContainer.manage_session_user_info) == null) {
			if (e != null)
				e.clear();
			try {
				ServletActionContext.getResponse().sendRedirect(SystemParms.LOGIN_OUT_PAGE);
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}

		return SUCCESS;
	}

	public String checkLogin() throws IOException {

		String ranCode = this.getRequest().getParameter("ranCode");

		User u = (User) getSession().getAttribute(ManageContainer.loginTest);
		String msm = (String) getSession().getAttribute("msmCode");
		if (ranCode == null || "".equals(ranCode)) {
			this.printJson("{\"code\":1,\"mess\":\"请输入验证码\"}");
			return null;

		}
		if (msm == null || "".equals(msm)) {

			this.printJson("{\"code\":1,\"mess\":\"验证码已失效\"}");
			return null;
		}
		if (u != null) {
			if (msm.toString().equals(ranCode)) {
				// 解析用户的数据库权限，以后可以进行DB权限限制
				if (StringUtils.isNotBlank(u.getRole_dbPrivilege())) {
					String[] dbPriArr = u.getRole_dbPrivilege().split(",");
					if (u.getDbPrivilegeMap() == null) {
						u.setDbPrivilegeMap(new HashMap<String, String>());
					} else {
						u.getDbPrivilegeMap().clear();
					}

					if (dbPriArr.length != 0) {
						for (int i = 0; i < dbPriArr.length; i++) {
							u.getDbPrivilegeMap().put(dbPriArr[i], dbPriArr[i]);
						}
					}
				}
				getSession().setAttribute(ManageContainer.manage_session_user_info, u);
				this.printJson("{\"code\":0,\"mess\":\"验证通过\"}");
				getSession().removeAttribute("msmCode");
				getSession().removeAttribute(ManageContainer.loginTest);
			} else {
				loginLog(u, "登录校验码错误");
				getSession().setAttribute(ManageContainer.manage_session_user_info, u);
				this.printJson("{\"code\":1,\"mess\":\"登录校验码错误\"}");
				return null;
			}
		} else {

			this.printJson("{\"code\":1,\"mess\":\"用户登录失败\"}");
			return null;
		}

		try {
			loginLog(u, "login");
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;

	}

	private void loginLog(User u, String log) {
		Systemlog systemlog = new Systemlog();
		systemlog.setTitle(log);
		systemlog.setContent(log);
		systemlog.setAccount(u.getUsername());
		systemlog.setType(1);
		systemlog.setLoginIP(AddressUtils.getIp(getRequest()));

		String address = null;
		if (!systemlog.getLoginIP().equals("127.0.0.1") && !systemlog.getLoginIP().equals("localhost")) {
			// 获取指定IP的区域位置
			try {
				address = AddressUtils.getAddresses("ip=" + systemlog.getLoginIP(), "utf-8");
			} catch (Exception e) {
				e.printStackTrace();
			}
			systemlog.setLoginArea(address);

			// 异地登陆的判断方法为：先比较本次登陆和上次登陆的区域位置，如果不一致，说明是异地登陆；如果获取不到区域，则比较IP地址，如果IP地址和上次的不一致，则是异地登陆
			Systemlog firstSystemlog = systemlogService.selectFirstOne(u.getUsername());
			if (firstSystemlog != null) {
				if (StringUtils.isNotBlank(address) && StringUtils.isNotBlank(firstSystemlog.getLoginArea())) {
					if (!address.equals(firstSystemlog.getLoginArea())) {
						systemlog.setDiffAreaLogin(Systemlog.systemlog_diffAreaLogin_y);
					}
				} else if (StringUtils.isNotBlank(systemlog.getLoginIP()) && StringUtils.isNotBlank(firstSystemlog.getLoginIP())) {
					if (!systemlog.getLoginIP().equals(firstSystemlog.getLoginIP())) {
						systemlog.setDiffAreaLogin(Systemlog.systemlog_diffAreaLogin_y);
					}
				}
			}
		}

		systemlogService.insert(systemlog);
	}

	/**
	 * 添加用户
	 */
	public String insert() throws Exception {
		return save0();
	}

	/**
	 * 修改用户信息
	 */
	public String update() throws Exception {
		return save0();
	}

	private String save0() throws Exception {
		logger.debug("save0..." + e.getPassword() + "," + e.getNewpassword2());

		if (StringUtils.isBlank(e.getId())) {// 添加
			if (StringUtils.isBlank(e.getPassword()) || StringUtils.isBlank(e.getNewpassword2())) {
				throw new NullPointerException("输入的密码不符合要求！");
			}

			if (!e.getPassword().equals(e.getNewpassword2())) {
				throw new IllegalArgumentException("两次输入的密码不一致！");
			}

			User user = (User) getSession().getAttribute(ManageContainer.manage_session_user_info);
			e.setCreateAccount(user.getUsername());
			if (StringUtils.isBlank(e.getStatus())) {
				e.setStatus(User.user_status_y);
			}
			e.setPassword(CipherUtil.encodePassword(e.getPassword(),e.getUsername()));
			getServer().insert(e);
		} else {// 修改

			// 当前登录用户是admin，才能修改admin的信息，其他用户修改admin信息都属于非法操作。
			User user = (User) getSession().getAttribute(ManageContainer.manage_session_user_info);
			User userOld = new User();
			userOld.setId(e.getId());
			userOld = getServer().selectOne(userOld);
			if (!user.getUsername().equals("admin") && e.getUsername().equals("admin")) {
				throw new RuntimeException("操作非法！");
			}

			if (StringUtils.isBlank(e.getPassword()) && StringUtils.isBlank(e.getNewpassword2())) {
				// 不修改密码
				e.setPassword(null);
			} else {
				// 修改密码
				if (!e.getPassword().equals(e.getNewpassword2())) {

					e = userOld;
					if (e.getEmail() != null) {
						String fir = e.getEmail().substring(0, 3);
						String end = e.getEmail().substring(7);

						this.getRequest().setAttribute("mobile", fir + " **** " + end);
					}
					e.setEmail(null);
					this.getRequest().setAttribute("mess", "两次输入的密码不一致！");
					return toEdit;
				}
				e.setPassword(CipherUtil.encodePassword(e.getPassword(), userOld.getUsername()));
			}

			if (StringUtils.isBlank(e.getEmail()) && StringUtils.isBlank(e.getOldemail())) {
				// 不修改手机
				e.setEmail(null);
			} else {
				// 修改手机

				if (StringUtils.isBlank(e.getOldemail()) && StringUtils.isNotBlank(e.getEmail())) {

				} else if (e.getOldemail() != null && !userOld.getEmail().equals(e.getOldemail())) {
					e = userOld;
					if (e.getEmail() != null) {
						String fir = e.getEmail().substring(0, 3);
						String end = e.getEmail().substring(7);

						this.getRequest().setAttribute("mobile", fir + " **** " + end);
					}
					e.setEmail(null);
					this.getRequest().setAttribute("mess", "原手机号输入错误");
					return toEdit;
				}

			}

			e.setUpdateAccount(user.getUsername());
			getServer().update(e);
		}

		return back();
	}

	public String loginOut201501212lssm222() throws Exception {
		User u = (User) getSession().getAttribute(ManageContainer.manage_session_user_info);
		if (u != null && StringUtils.isNotBlank(u.getUsername())) {
			loginLog(u, "loginOut");
		}

		getSession().setAttribute(ManageContainer.manage_session_user_info, null);
		getSession().setAttribute(ManageContainer.resource_menus, null);
		getSession().setAttribute(ManageContainer.user_resource_menus_button, null);
		e.clear();
		return "login";
	}
	
	/**
	 * 互捐的时候调用
	 * @throws Exception
	 */
	public void loginOut2017() throws Exception {
		getSession().setAttribute(ManageContainer.manage_session_user_info, null);
		getSession().setAttribute(ManageContainer.resource_menus, null);
		getSession().setAttribute(ManageContainer.user_resource_menus_button, null);
		if(e!=null)
		e.clear();
	}
	
	/**
	 * ajax验证输入的字符的唯一性
	 * 
	 * @return
	 * @throws IOException
	 */
	public String unique() throws IOException {
		logger.debug("验证输入的字符的唯一性" + e);
		getResponse().setCharacterEncoding("utf-8");
		synchronized (this) {
			if (StringUtils.isNotBlank(e.getNickname())) {// 验证昵称是否被占用
				logger.debug("验证昵称是否被占用");
				User user = new User();
				user.setNickname(StringUtils.trim(e.getNickname()));

				// if(userService.selectCount(e)>0){
				// getResponse().getWriter().write("{\"error\":\"昵称已经被占用!\"}");
				// }else{
				// getResponse().getWriter().write("{\"ok\":\"昵称可以使用!\"}");
				// }

				user = userService.selectOneByCondition(user);

				if (user == null) {
					// 数据库中部存在此编码
					getResponse().getWriter().write("{\"ok\":\"昵称可以使用!\"}");
				} else {
					if (StringUtils.isBlank(e.getId())) {
						// 当前为insert操作，但是编码已经存在，则只可能是别的记录的编码
						getResponse().getWriter().write("{\"error\":\"昵称已经存在!\"}");
					} else {
						// update操作，又是根据自己的编码来查询的，所以当然可以使用啦
						getResponse().getWriter().write("{\"ok\":\"昵称可以使用!\"}");
					}
				}
			} else if (StringUtils.isNotBlank(e.getUsername())) {// 验证用户名是否被占用
				logger.debug("验证账号是否被占用");
				getResponse().setCharacterEncoding("utf-8");
				User user = new User();
				user.setUsername(e.getUsername());
				if (userService.selectCount(user) > 0) {
					getResponse().getWriter().write("{\"error\":\"账号已经被占用!\"}");
				} else {
					getResponse().getWriter().write("{\"ok\":\"账号可以使用!\"}");
				}
			}
		}
		return null;
	}
	// @Override
	// protected void toEditBefore(User e) {
	// String id = getRequest().getParameter("id");
	// if (id!=null) {
	// e.clear();
	// e.setId(id);
	// e = getServer().selectOne(e);
	// }else{
	// e.clear();
	// }
	// }

	/**
	 * 转到修改密码页面
	 * 
	 * @return
	 */
	public String toChangePwd() {
		User u = (User) getSession().getAttribute(ManageContainer.manage_session_user_info);
		this.e.setId(u.getId());
		return "toChangePwd";
	}

	/**
	 * 修改密码
	 * 
	 * @return
	 */
	public String updateChangePwd() {
		errorMsg = "两次输入的密码不一致，修改密码失败!";
		if (StringUtils.isBlank(e.getNewpassword()) || StringUtils.isBlank(e.getNewpassword2())) {
			throw new NullPointerException("密码不能为空！");
		}

		if (!e.getNewpassword().equals(e.getNewpassword2())) {
			throw new IllegalArgumentException("两次输入的密码不一致！");
		}

		errorMsg = "旧密码输入错误，修改密码失败!";

		User u = (User) getSession().getAttribute(ManageContainer.manage_session_user_info);
		e.setPassword(CipherUtil.encodePassword(e.getPassword(), u.getUsername()));
		if (!e.getPassword().equals(u.getPassword())) {// 用户输入的旧密码和数据库中的密码一致
			throw new IllegalArgumentException("原密码不正确！");
		}

		// 修改密码
		e.setPassword(CipherUtil.encodePassword(e.getNewpassword(), u.getUsername()));
		this.getServer().update(e);
		errorMsg = "密码修改成功!";

		return "changePwd";
	}

	/**
	 * 禁止删除系统超级管理员帐号。 系统不提供删除账号功能，只提供禁用账号
	 */
	@Override
	public String deletes() throws Exception {
		throw new NotThisMethod(ManageContainer.not_this_method);
		// if(getIds()!=null && getIds().length > 0){
		// for(int i=0;i<getIds().length;i++){
		// e.clear();
		// e.setId(getIds()[i]);
		// e = this.getServer().selectOne(e);
		// if(e!=null && StringUtils.isNotBlank(e.getUsername())){
		// if(e.getUsername().equals("admin")){
		// errorMsg = "禁止删除超级管理员帐号!";
		// return selectList();
		// }
		// }
		// }
		// e.clear();
		// return super.deletes();
		// }
		// return selectList();
	}

	@Override
	public String toAdd() throws Exception {
		roleList = roleService.selectList(null);
		return super.toAdd();
	}

	@Override
	protected void selectListAfter() {
		pager.setPagerUrl("user!selectList.action");
	}

	/**
	 * 编辑用户
	 */
	@Override
	public String toEdit() throws Exception {
		roleList = roleService.selectList(null);
		e = getServer().selectOne(e);
		if (e.getEmail() != null) {
			String fir = e.getEmail().substring(0, 3);
			String end = e.getEmail().substring(7);
			this.getRequest().setAttribute("mobile", fir + " **** " + end);
		}
		e.setEmail(null);
		return toEdit;
	}

	/**
	 * 查看管理人员信息
	 * 
	 * @return
	 */
	public String show() {
		String account = getRequest().getParameter("account");
		if (StringUtils.isBlank(account)) {
			throw new NullPointerException("非法请求！");
		}

		e.setUsername(account);
		e = getServer().selectOne(e);
		return super.show;
	}

	/**
	 * 用户修改密码--验证旧密码是否正确
	 * 
	 * @return
	 */
	public String checkOldPassword() throws Exception {
		logger.debug("checkOldPassword.." + e.getPassword());
		if (StringUtils.isBlank(e.getPassword())) {
			super.utf8JSON();
			getResponse().getWriter().write("{\"error\":\"旧密码不能为空!\"}");
		} else {
			// 检查旧密码输入的是否正确
			User user = (User) getSession().getAttribute(ManageContainer.manage_session_user_info);
			String oldPass = CipherUtil.encodePassword(e.getPassword(), user.getUsername());
			if (user.getPassword().equals(oldPass)) {
				getResponse().getWriter().write("{\"ok\":\"旧密码输入正确!\"}");
			} else {
				getResponse().getWriter().write("{\"error\":\"旧密码输入错误!\"}");
			}
		}
		return null;
	}

	/**
	 * 加载后台首页数据
	 * 
	 * @return
	 */
	public String initManageIndex() {
		// 店主每次登陆后台都需要加载综合统计数据？！还是说每次都触发加载，但是到底加载不加载具体看系统的加载策略？！
		manageCache.loadOrdersReport();
		return "initManageIndex";
	}
}
