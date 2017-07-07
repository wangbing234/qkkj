package net.onlineshop.web.action.front.account;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.qq.connect.QQConnectException;
import com.qq.connect.oauth.Oauth;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.FrontContainer;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.core.front.SystemManager;
import net.onlineshop.core.pay.alipay.alipayescow.config.AlipayConfig;
import net.onlineshop.core.pay.alipay.alipayescow.util.AlipaySubmit;
import net.onlineshop.core.util.AddressUtils;
import net.onlineshop.core.util.DateTimeUtil;
import net.onlineshop.core.util.MD5;
import net.onlineshop.core.util.RedisSevice;
import net.onlineshop.core.util.TokenUtil;
import net.onlineshop.services.common.JSONResult;
import net.onlineshop.services.common.Pay;
import net.onlineshop.services.front.account.AccountService;
import net.onlineshop.services.front.account.bean.Account;
import net.onlineshop.services.front.account.bean.CqsUser;
import net.onlineshop.services.front.account.bean.LoginTypeEnum;
import net.onlineshop.services.front.account.bean.MebInfo;
import net.onlineshop.services.front.address.AddressService;
import net.onlineshop.services.front.address.bean.Address;
import net.onlineshop.services.front.area.bean.Area;
import net.onlineshop.services.front.comment.CommentService;
import net.onlineshop.services.front.comment.bean.Comment;
import net.onlineshop.services.front.email.EmailService;
import net.onlineshop.services.front.email.bean.Email;
import net.onlineshop.services.front.favorite.FavoriteService;
import net.onlineshop.services.front.favorite.bean.Favorite;
import net.onlineshop.services.front.news.NewsService;
import net.onlineshop.services.front.news.bean.News;
import net.onlineshop.services.front.notifyTemplate.bean.NotifyTemplate;
import net.onlineshop.services.front.order.OrderService;
import net.onlineshop.services.front.order.bean.Order;
import net.onlineshop.services.front.order.bean.OrderSimpleReport;
import net.onlineshop.services.front.orderdetail.OrderdetailService;
import net.onlineshop.services.front.orderdetail.bean.Orderdetail;
import net.onlineshop.services.front.product.ProductService;
import net.onlineshop.services.front.product.bean.Product;
import net.onlineshop.services.front.recharge.RechargeService;
import net.onlineshop.services.front.recharge.bean.Recharge;
import net.onlineshop.services.manage.sms.SmsService;
import net.onlineshop.services.manage.spec.SpecService;
import net.onlineshop.services.manage.spec.bean.Spec;
import net.onlineshop.web.action.front.orders.PayInfo;
import net.sf.json.JSONObject;
import weibo4j.model.WeiboException;

/**
 * 门户会员服务类
 * 
 * 
 * 
 */
public class AccountAction extends BaseAction<Account> {
	private static final Logger logger = Logger.getLogger(AccountAction.class);
	private static final long serialVersionUID = 1L;
	private AccountService accountService;
	private CommentService commentService;
	private OrderdetailService orderdetailService;
	private OrderService orderService;
	private NewsService newsService;
	private AddressService addressService;// 配送地址service
	private List<Address> addressList;// 配送地址列表
	private ProductService productService;
	private FavoriteService favoriteService;// 商品收藏夹
	private String selectLeftMenu;// 选中的个人中心的菜单项
	private EmailService emailService;
	private RechargeService rechargeService;
	private SpecService specService;
	private String helpCode;// 帮助code
	private News news;// 文章
	private Address address;// 配送地址
	private OrderSimpleReport orderSimpleReport;// 简单报表
	private RedisSevice redisSevice;
	private SmsService smsService;
	private static final Object qq_login_lock = new Object();// qq登陆，本地锁
	private static final Object sinawb_login_lock = new Object();// 新浪微博登陆，本地锁
	private static final Object wx_login_lock = new Object();// wx登陆，本地锁
	// 登陆错误信息
	private String errorMsg;
	private String typefrom;
	private static final String toLogin = "toLogin";// 转到登陆界面,forword方式 地址不变
	private static final String toLoginRedirect = "toLoginRedirect";// 转到登陆界面,getResponse().sendRedirect(arg0)方式 地址变化
	private static final String toIndex = "toIndex";// 转到门户首页

	public OrderSimpleReport getOrderSimpleReport() {
		return orderSimpleReport;
	}

	public void setOrderSimpleReport(OrderSimpleReport orderSimpleReport) {
		this.orderSimpleReport = orderSimpleReport;
	}

	public void setFavoriteService(FavoriteService favoriteService) {
		this.favoriteService = favoriteService;
	}

	public void setEmailService(EmailService emailService) {
		this.emailService = emailService;
	}

	public void setProductService(ProductService productService) {
		this.productService = productService;
	}

	public OrderService getOrderService() {
		return orderService;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public void setNewsService(NewsService newsService) {
		this.newsService = newsService;
	}

	public News getNews() {
		return news;
	}

	public void setNews(News news) {
		this.news = news;
	}

	public String getHelpCode() {
		return helpCode;
	}

	public void setHelpCode(String helpCode) {
		this.helpCode = helpCode;
	}

	public void setOrderService(OrderService orderService) {
		this.orderService = orderService;
	}

	public List<Address> getAddressList() {
		return addressList;
	}

	public void setAddressList(List<Address> addressList) {
		this.addressList = addressList;
	}

	public RechargeService getRechargeService() {
		return rechargeService;
	}

	public void setRechargeService(RechargeService rechargeService) {
		this.rechargeService = rechargeService;
	}

	public void setCommentService(CommentService commentService) {
		this.commentService = commentService;
	}

	public void setOrderdetailService(OrderdetailService orderdetailService) {
		this.orderdetailService = orderdetailService;
	}

	public void setAddressService(AddressService addressService) {
		this.addressService = addressService;
	}

	public String getSelectLeftMenu() {
		return selectLeftMenu;
	}

	public void setSelectLeftMenu(String selectLeftMenu) {
		this.selectLeftMenu = selectLeftMenu;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public AccountService getAccountService() {
		return accountService;
	}

	protected void selectListAfter() {
		pager.setPagerUrl("account!selectList.action");
	}

	public void setAccountService(AccountService accountService) {
		this.accountService = accountService;
	}

	public SpecService getSpecService() {
		return specService;
	}

	public void setSpecService(SpecService specService) {
		this.specService = specService;
	}

	public Account getE() {
		return this.e;
	}

	public void prepare() throws Exception {
		logger.debug("AccountAction.prepare...");
		if (this.e == null) {
			this.e = new Account();
		} else {
			e.clear();
		}

		if (address == null) {
			this.address = new Address();
		} else {
			address.clear();
		}

		errorMsg = null;

		if (orderSimpleReport != null) {
			orderSimpleReport.clear();
			orderSimpleReport = null;
		}

		/**
		 * 清除地址列表数据
		 */
		if (addressList != null && addressList.size() > 0) {
			for (int i = 0; i < addressList.size(); i++) {
				addressList.get(i).clear();
			}
			addressList.clear();
			addressList = null;
		}

		super.setSelectMenu(FrontContainer.not_select_menu);// 设置主菜单为不选中
	}

	public void insertAfter(Account e) {
		e.clear();
	}

//	/**
//	 * 用户注册
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String doRegister() throws IOException {
//
//		super.utf8JSON();
//
//		String url = "/user/address.html";
//
//		if (directUrl != null && !"".equals(directUrl)) {
//			url = directUrl;
//
//		}
//
//		if (StringUtils.isBlank(e.getAccount())) {
//
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"手机号不能为空\"}");
//			return null;
//		}
//
//		if (StringUtils.isBlank(e.getPassword())) {
//
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"密码不能为空\"}");
//			return null;
//		}
//
//		if (StringUtils.isBlank(e.getVcode1())) {
//
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"验证码不能为空\"}");
//			return null;
//		}
//		String svode = (String) this.getRequest().getSession().getAttribute(FrontContainer.validateCode);
//		if (StringUtils.isBlank(svode)) {
//
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"验证码过期\"}");
//			return null;
//		}
//
//		if (!svode.equals(e.getVcode1())) {
//
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"验证码不正确\"}");
//			return null;
//		}
//
//		if (e.getVcode1() != null && !e.getVcode1().equals("")) {
//			Sms sms = new Sms();
//			sms.setPhone(e.getAccount());
//			sms.setSendStatus(e.getVcode1());
//			List<Sms> mmlist = smsService.selectList(sms);
//			Sms mm = null;
//			if (mmlist != null && mmlist.size() > 0) {
//				mm = mmlist.get(0);
//			}
//
//			if (mm != null) {
//				if (!mm.isOk()) {
//					// 验证码已使用
//					getResponse().getWriter().write("{\"mess\":1,\"info\":\"手机校验码已使用\"}");
//					return null;
//
//				} else if (!mm.unPassWay()) {
//					// 验证码过期
//					getResponse().getWriter().write("{\"mess\":1,\"info\":\"手机校验码已使用\"}");
//					return null;
//
//				} else {
//
//					mm.setOk(false);
//
//					smsService.update(mm);
//					e.setMobileIsActive("y");
//				}
//			} else {
//				// 验证码错误
//				getResponse().getWriter().write("{\"mess\":1,\"info\":\"手机校验码错误\"}");
//				return null;
//			}
//		} else {
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"手机校验不能为空\"}");
//			return null;
//
//		}
//
//		e.setPassword(MD5.md5(e.getPassword()));
//		if (StringUtils.isBlank(e.getId())) {
//
//			// e.setEmail(e.getAccount());a
//			e.setNickname(e.getNickname() == null || "".equals(e.getNickname()) ? (e.getAccount()) : (e.getNickname()));
//			e.setTel(e.getAccount());
//			e.setAmount(e.getAccount());
//
//			// 用户注册
//			getServer().insert(e);
//
//			// 发送邮件到用户的邮箱
//			// MailUtil mail = new MailUtil(e.getEmail());//new
//			// MailUtil("543089122@qq.com",SystemManager.getInstance().get("from_email_account"),SystemManager.getInstance().get("from_email_password"),
//			// SystemManager.getInstance().get("from_eamil_smtpServer"), "myshop注册验证邮件");//用户注册成功发送邮件
//			// boolean result = mail.startSend("注册邮箱验证","恭喜，您在myshop站点的账号注册成功！点击下面的链接进行验证。有效时间为2小时。http://myshop.itelse.com");
//			// logger.debug("email resule = " + result);
//
//			// accountService.sendEmail(e, NotifyTemplate.email_reg);
//		} else {
//			// 修改密码
//			// getServer().update(e);
//			// throw new NullPointerException("不支持！");
//		}
//
//		getResponse().getWriter().write("{\"mess\":0,\"info\":\"注册成功，马上完善配送地址\",\"url\":\"" + url + "\"}");
//
//		String account = e.getAccount();
//
//		e.clear();
//		e.setAccount(account);
//
//		Account acc = accountService.selectOne(e);
//		if (acc == null) {
//
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"账号或者密码错误！\"}");
//			return null;
//		} 
//		else if (acc.getFreeze().equals(Account.account_freeze_y)) {
//			if (StringUtils.isBlank(acc.getFreezeStartdate()) && StringUtils.isBlank(acc.getFreezeEnddate())) {
//
//				getResponse().getWriter().write("{\"mess\":1,\"info\":\"此账号已永久被冻结！\"}");
//				return null;
//			} else {
//
//				getResponse().getWriter().write("{\"mess\":1,\"info\":\"此账号已暂时被冻结！\"}");
//				return null;
//
//			}
//
//		}
//
//		acc.setLoginType(LoginTypeEnum.system);// 登陆方式
//		getSession().setAttribute(FrontContainer.USER_INFO, acc);
//
//		// 更新用户最后登录时间
//		e.clear();
//		e.setId(acc.getId());
//		e.setLastLoginTime("yes");
//		e.setLastLoginIp(AddressUtils.getIp(getRequest()));
//		String address = null;
//		try {
//			address = AddressUtils.getAddresses("ip=" + e.getLastLoginIp(), "utf-8");
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//
//		e.setLastLoginArea(address);
//		accountService.update(e);
//
//		e.clear();
//
//		return null;
//	}

//	/**
//	 * 用户注册--》再次发送邮件
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String sendEmailAgain() throws IOException {
//		String uid = getRequest().getParameter("uid");
//		if (StringUtils.isBlank(uid)) {
//			throw new NullPointerException("参数不正确！");
//		}
//
//		Account acc = accountService.selectById(uid);
//		if (acc == null) {
//			throw new NullPointerException("根据用户ID查询不到用户信息！");
//		}
//
//		accountService.sendEmail(acc, NotifyTemplate.email_reg);
//		getSession().setAttribute("uid", acc.getId());
//		getResponse().sendRedirect(SystemManager.systemSetting.getWww() + "/user/checkEmail.html");
//		return null;
//	}

//	/**
//	 * 转到邮箱验证提示页面
//	 * 
//	 * @return
//	 */
//	public String checkEmail() {
//		logger.debug("checkEmail");
//
//		// Account acc = redisSevice.getShopUser(getRequest());
//		// if (acc == null || StringUtils.isBlank(acc.getAccount())) {
//		// return toLogin;
//		// }
//		this.getRequest().setAttribute("loginurl", SystemManager.systemSetting.getWww() + "/user/user.html");
//		String fromModule = this.getFromModule();
//		if (fromModule.equals("PC")) {
//			return "pc_checkEmail";
//		}
//		return "checkEmail";
//	}

//	/**
//	 * 转到忘记密码页面
//	 * 
//	 * @return
//	 */
//	public String forget() {
//		this.getRequest().setAttribute("loginurl", SystemManager.systemSetting.getWww() + "/user/user.html");
//		String fromModule = this.getFromModule();
//		if (fromModule.equals("PC")) {
//			return "pc_forget";
//		}
//		return "forget";
//	}

//	/**
//	 * 找回密码
//	 * 
//	 * @return
//	 * @throws Exception
//	 */
//	public String doForget() throws Exception {
//
//		String mobile = (String) this.getRequest().getSession().getAttribute("find_account");
//		if (mobile == null || "".equals(mobile)) {
//			return "forget";
//		}
//		if (e.getVcode() != null) {
//			Sms sms = new Sms();
//			sms.setPhone(mobile);
//			sms.setSendStatus(e.getVcode());
//			List<Sms> mmlist = smsService.selectList(sms);
//			String result = "{\"mess\":" + 4 + "}";
//			Sms mm = null;
//			if (mmlist != null && mmlist.size() > 0) {
//				mm = mmlist.get(0);
//			}
//
//			if (mm != null) {
//				if (!mm.isOk()) {
//					// 验证码已使用
//					result = "{\"mess\":" + 2 + "}";
//					this.getResponse().sendRedirect("/user/waitUserCheck.html");
//					return null;
//				} else if (!mm.unPassWay()) {
//					// 验证码过期
//					result = "{\"mess\":" + 3 + "}";
//					this.getResponse().sendRedirect("/user/waitUserCheck.html");
//					return null;
//				} else {
//
//					mm.setOk(false);
//
//					smsService.update(mm);
//					Account acc = new Account();
//					acc.setAccount(mobile);
//
//					Account aa = accountService.login(acc);
//
//					aa.setPassword(MD5.md5(e.getPassword()));
//					accountService.update(aa);
//					this.getRequest().getSession().removeAttribute("find_account");
//					getSession().setAttribute(FrontContainer.USER_INFO, aa);
//					this.getResponse().sendRedirect("/user/user.html");
//					return null;
//				}
//			} else {
//				// 验证码错误
//				result = "{\"mess\":" + 4 + "}";
//				this.getResponse().sendRedirect("/user/waitUserCheck.html");
//				return null;
//			}
//
//		} else {
//
//			this.getResponse().sendRedirect("/user/waitUserCheck.html");
//			return null;
//		}
//
//	}

	public String waitUserCheck() {
		String fromModule = this.getFromModule();
		if (fromModule.equals("PC")) {
			return "pc_waitUserCheck";
		}

		return "waitUserCheck";
	}

//	/**
//	 * ajax检查用户名称是否存在
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String checkAccountExist() throws IOException {
//		super.utf8JSON();
//		if (StringUtils.isBlank(e.getAccount())) {
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"账号不能为空!\"}");
//			return null;
//		}
//
//		if (StringUtils.isBlank(e.getVcode())) {
//
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"验证码不能为空\"}");
//			return null;
//		}
//		String svode = (String) this.getRequest().getSession().getAttribute(FrontContainer.validateCode);
//		if (StringUtils.isBlank(svode)) {
//
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"验证码过期\"}");
//			return null;
//		}
//
//		if (!svode.equals(e.getVcode())) {
//
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"验证码不正确\"}");
//			return null;
//		}
//
//		Account acc = new Account();
//		acc.setAccount(e.getAccount());
//		if (accountService.login(e) == null) {
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"账号不存在!\"}");
//		} else {
//			getResponse().getWriter().write("{\"mess\":0,\"info\":\"跳转中，请稍后...\",\"url\":\"/user/waitUserCheck.html\"}");
//			if (acc.getMobileIsActive() != null && acc.getMobileIsActive().equals("y")) {
//				this.getRequest().getSession().setAttribute("find_account", acc.getTel());
//			} else {
//				this.getRequest().getSession().setAttribute("find_account", acc.getAccount());
//			}
//
//		}
//		return null;
//	}

	/**
	 * ajax检查密码是否正确
	 * 
	 * @return
	 * @throws IOException
	 */
	public String checkPassword() throws IOException {
		super.utf8JSON();
		if (StringUtils.isBlank(e.getPassword())) {
			getResponse().getWriter().write("{\"error\":\"密码不能为空!\"}");
		} else {
			Account acc = new Account();
			acc.setPassword(MD5.md5(e.getPassword()));
			if (accountService.selectCount(acc) == 0) {
				getResponse().getWriter().write("{\"error\":\"输入的密码不正确!\"}");
			} else {
				getResponse().getWriter().write("{\"ok\":\"密码正确!\"}");
			}
		}
		return null;
	}

	/**
	 * ajax检查新邮箱不能和原邮箱一致
	 * 
	 * @return
	 * @throws IOException
	 */
	public String changeEmailCheck() throws IOException {
		super.utf8JSON();
		if (StringUtils.isBlank(e.getNewEmail())) {
			getResponse().getWriter().write("{\"error\":\"新邮箱不能为空!\"}");
		} else {
			Account acc = redisSevice.getShopUser(getRequest());
			if (acc == null || StringUtils.isBlank(acc.getAccount())) {

				String fromModule = this.getFromModule();
				if (fromModule.equals("PC")) {
					return "toPcLogin";
				}
				return toLogin;
			}

			if (acc.getEmail().equals(e.getNewEmail())) {
				getResponse().getWriter().write("{\"error\":\"新邮箱不能和原邮箱一致!\"}");
			} else {
				getResponse().getWriter().write("{\"ok\":\"系统认为此邮箱可用!\"}");
			}
		}
		return null;
	}

	/**
	 * 使用QQ账号登陆。JAVA版
	 * 
	 * @return
	 * @throws IOException
	 */
	public String qqLogin() throws IOException {
		getResponse().setContentType("text/html;charset=utf-8");
		try {
			getResponse().sendRedirect(new Oauth().getAuthorizeURL(getRequest()));
		} catch (QQConnectException e) {
			e.printStackTrace();
		}

		return null;
	}

	/**
	 * 使用微信账号登陆。JAVA版
	 * 
	 * @return
	 * @throws IOException
	 */
	public String wxLogin() throws IOException {
		getResponse().setContentType("text/html;charset=utf-8");
		String redirect_url = "http%3A%2F%2Fwww.lightingest.com%2Fuser%2FwxCallbackNotifySession2.html";
		String appid = "wx44c7ccc5e3f18b6f";
		long state = new Date().getTime();
		this.getRequest().getSession().setAttribute("wxState", state);
		String open = "https://open.weixin.qq.com/connect/qrconnect?appid=" + appid + "&redirect_uri=" + redirect_url + "&response_type=code&scope=snsapi_login&state=" + state + "#wechat_redirect";
		try {
			getResponse().sendRedirect(open);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

//	/**
//	 * 微信回调
//	 * 
//	 * @throws IOException
//	 */
//	public String wxCallbackNotifySession2() throws IOException {
//		Long state = (Long) this.getRequest().getSession().getAttribute("wxState");
//
//		String state_retuen = this.getRequest().getParameter("state");
//		String code_retuen = this.getRequest().getParameter("code");
//
//		String appid = "wx44c7ccc5e3f18b6f";
//		String secret = "1cecfae02cc6ce0072bc4c388f6dc4d5";
//
//		if (code_retuen != null) {
//			System.out.println(code_retuen + "============= 微信code_retuen==============================" + state);
//			if (state != null && state.toString().equals(state_retuen)) {
//
//				String token = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + appid + "&secret=" + secret + "&code=" + code_retuen + "&grant_type=authorization_code";
//				Map<String, String> map = new HashMap<String, String>();
//				map.put("appid", appid);
//				map.put("secret", secret);
//				map.put("code", code_retuen);
//				map.put("grant_type", "authorization_code");
//				String wxpost = doWxPost(token, map);
//				System.out.println(wxpost + "=============微信开始调用wxpost==============================");
//				JSONObject obj = new JSONObject();
//				obj = JSONObject.fromObject(wxpost);
//				String access_token = obj.getString("access_token");
//				String openid = obj.getString("openid");
//				System.out.println(access_token + "=============微信access_token==============================");
//
//				String info = "https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + openid;
//
//				logger.debug("==wxCallbackNotifySession2执行wx登陆回调方法==");
//				getResponse().setContentType("text/html; charset=utf-8");
//
//				String infoPost = doWxPost(info, map);
//				System.out.println(infoPost + "============= 微信开始调用infoPost==============================");
//				JSONObject infoPostObj = new JSONObject();
//				infoPostObj = JSONObject.fromObject(infoPost);
//				String nickname = infoPostObj.getString("nickname");
//				String sex = infoPostObj.getString("sex");
//
//				try {
//
//					if (access_token.equals("")) {
//						// 我们的网站被CSRF攻击了或者用户取消了授权
//						// 做一些数据统计工作
//						logger.debug("没有获取到响应参数");
//					} else {
//
//						logger.debug("欢迎你，代号为 " + openid + " 的用户!");
//						// getRequest().getSession().setAttribute("demo_openid", openID);
//
//						// 利用获取到的accessToken 去获取当前用户的openid --------- end
//						logger.debug("<p> start -----------------------------------利用获取到的accessToken,openid 去获取用户在Qzone的昵称等信息 ---------------------------- start </p>");
//
//					}
//
//					synchronized (wx_login_lock) {
//						System.out.println(wx_login_lock + "============= 微信开始调用wx_login_lock==============================");
//						// 查询本地数据库，如果没有此用户则创建一个
//						Account acc = new Account();
//						acc.setOpenId(openid);
//						acc = accountService.selectOne(acc);
//						if (acc == null) {
//							logger.debug("查询不到此qq用户。准备创建一个。");
//							acc = new Account();
//							acc.setOpenId(openid);
//							acc.setAccessToken(access_token);
//							acc.setLoginType(LoginTypeEnum.weixin);// 设置为微信登陆
//							acc.setAccountType(acc.getLoginType().toString());
//							accountService.insertOutAccount(acc);
//							logger.debug("创建成功。");
//						}
//
//						acc.setLoginType(LoginTypeEnum.weixin);// 微信登陆
//						acc.setNickname(nickname);
//						getSession().setAttribute(FrontContainer.USER_INFO, acc);
//						logger.debug("注册完毕.");
//					}
//
//					logger.debug("微信登陆回调方法执行完毕，准备跳转到门户首页。。。");
//					getResponse().sendRedirect(SystemManager.systemSetting.getWww());
//				} catch (Exception e) {
//					e.printStackTrace();
//				}
//				return null;
//
//			} else {
//
//				getResponse().sendRedirect("/");
//			}
//
//		} else {
//
//			getResponse().sendRedirect("/");
//		}
//		return null;
//	}

//	/**
//	 * qq登陆回调方法。java版
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String qqCallbackNotifySession2() throws IOException {
//		logger.debug("==qqCallbackNotifySession2执行QQ登陆回调方法==");
//		getResponse().setContentType("text/html; charset=utf-8");
//		// PrintWriter out = getResponse().getWriter();
//		try {
//			AccessToken accessTokenObj = (new Oauth()).getAccessTokenByRequest(getRequest());
//			String accessToken = null, openID = null, nickname = null;
//			long tokenExpireIn = 0L;
//			if (accessTokenObj.getAccessToken().equals("")) {
//				// 我们的网站被CSRF攻击了或者用户取消了授权
//				// 做一些数据统计工作
//				logger.debug("没有获取到响应参数");
//			} else {
//				accessToken = accessTokenObj.getAccessToken();
//				tokenExpireIn = accessTokenObj.getExpireIn();
//				getRequest().getSession().setAttribute("demo_access_token", accessToken);
//				getRequest().getSession().setAttribute("demo_token_expirein", String.valueOf(tokenExpireIn));
//				// 利用获取到的accessToken 去获取当前用的openid -------- start
//				OpenID openIDObj = new OpenID(accessToken);
//				openID = openIDObj.getUserOpenID();
//				logger.debug("欢迎你，代号为 " + openID + " 的用户!");
//				// getRequest().getSession().setAttribute("demo_openid", openID);
//				logger.debug("<a href=" + "/shuoshuoDemo.html" + " target=\"_blank\">去看看发表说说的demo吧</a>");
//				// 利用获取到的accessToken 去获取当前用户的openid --------- end
//				logger.debug("<p> start -----------------------------------利用获取到的accessToken,openid 去获取用户在Qzone的昵称等信息 ---------------------------- start </p>");
//				UserInfo qzoneUserInfo = new UserInfo(accessToken, openID);
//				UserInfoBean userInfoBean = qzoneUserInfo.getUserInfo();
//				// out.println("<br/>");
//				if (userInfoBean.getRet() == 0) {
//					nickname = userInfoBean.getNickname();
//					logger.debug(userInfoBean.getNickname() + "<br/>");
//					logger.debug(userInfoBean.getGender() + "<br/>");
//					logger.debug("黄钻等级： " + userInfoBean.getLevel() + "<br/>");
//					logger.debug("会员 : " + userInfoBean.isVip() + "<br/>");
//					logger.debug("黄钻会员： " + userInfoBean.isYellowYearVip() + "<br/>");
//					logger.debug("<image src=" + userInfoBean.getAvatar().getAvatarURL30() + "/><br/>");
//					logger.debug("<image src=" + userInfoBean.getAvatar().getAvatarURL50() + "/><br/>");
//					logger.debug("<image src=" + userInfoBean.getAvatar().getAvatarURL100() + "/><br/>");
//				} else {
//					logger.debug("很抱歉，我们没能正确获取到您的信息，原因是： " + userInfoBean.getMsg());
//				}
//				logger.debug("<p> end -----------------------------------利用获取到的accessToken,openid 去获取用户在Qzone的昵称等信息 ---------------------------- end </p>");
//			}
//
//			synchronized (qq_login_lock) {
//				// 查询本地数据库，如果没有此用户则创建一个
//				Account acc = new Account();
//				acc.setOpenId(openID);
//				acc = accountService.selectOne(acc);
//				if (acc == null) {
//					logger.debug("查询不到此qq用户。准备创建一个。");
//					acc = new Account();
//					acc.setOpenId(openID);
//					acc.setAccessToken(accessToken);
//					acc.setLoginType(LoginTypeEnum.qq);// 设置为QQ登陆
//					acc.setAccountType(acc.getLoginType().toString());
//					accountService.insertOutAccount(acc);
//					logger.debug("创建成功。");
//				}
//
//				acc.setLoginType(LoginTypeEnum.qq);// 设置为QQ登陆
//				acc.setNickname(nickname);
//				getSession().setAttribute(FrontContainer.USER_INFO, acc);
//				logger.debug("注册完毕.");
//			}
//
//			logger.debug("QQ登陆回调方法执行完毕，准备跳转到门户首页。。。");
//			getResponse().sendRedirect(SystemManager.systemSetting.getWww());
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		return null;
//	}

	/**
	 * 新浪微博登陆java版
	 * 
	 * @return
	 * @throws IOException
	 * @throws WeiboException
	 */
	public String sinawb() throws IOException, WeiboException {
		logger.debug("sinawb...");
		// BareBonesBrowserLaunch.openURL(new weibo4j.Oauth().authorize("code","",""));
		String url = new weibo4j.Oauth().authorize("code", "", "");
		logger.debug("url = " + url);
		getResponse().sendRedirect(url);
		return null;
	}

//	/**
//	 * 新浪微博回调方法java版
//	 * 
//	 * @return
//	 */
//	public String sinawbCallbackNotifySession2() throws Exception {
//		String code = getRequest().getParameter("code");
//		logger.debug("sinawbCallbackNotifySession2 ..");
//		if (StringUtils.isBlank(code)) {
//			getResponse().sendRedirect(SystemManager.systemSetting.getWww());
//			return null;
//		}
//
//		weibo4j.Oauth oauth = new weibo4j.Oauth();
//		weibo4j.http.AccessToken accessToken = oauth.getAccessTokenByCode(code);
//		logger.debug("accessToken = " + accessToken.getAccessToken() + ",uid = " + accessToken.getUid());
//		logger.debug("AccessToken = " + accessToken);
//
//		weibo4j.Users um = new weibo4j.Users();
//		um.client.setToken(accessToken.getAccessToken());
//		weibo4j.model.User user = um.showUserById(accessToken.getUid());
//		logger.debug("user = " + user);
//
//		// 查询本地数据库，如果没有此用户则创建一个
//		synchronized (sinawb_login_lock) {
//			Account acc = new Account();
//			acc.setSinaWeiboID(accessToken.getUid());
//			acc = accountService.selectOne(acc);
//			if (acc == null) {
//				logger.debug("查询不到此新浪微博用户。准备创建一个。");
//				acc = new Account();
//				acc.setSinaWeiboID(accessToken.getUid());
//				acc.setLoginType(LoginTypeEnum.sinawb);// 设置为新浪微博登陆
//				acc.setAccountType(acc.getLoginType().toString());
//				accountService.insertOutAccount(acc);
//				logger.debug("创建成功。");
//			}
//			acc.setLoginType(LoginTypeEnum.sinawb);// 设置为新浪微博登陆
//			acc.setNickname(user.getScreenName());
//			getSession().setAttribute(FrontContainer.USER_INFO, acc);
//			logger.debug("注册完毕.");
//		}
//
//		logger.debug("新浪微博回调方法执行完毕，准备跳转到门户首页。。。");
//		getResponse().sendRedirect(SystemManager.systemSetting.getWww());
//		return null;
//	}

//	/**
//	 * QQ回调通知系统session的业务逻辑处理。ajax回调版
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	@Deprecated
//	public String qqCallbackNotifySession() throws IOException {
//		String status = getRequest().getParameter("status");
//		String openId = getRequest().getParameter("openId");
//		String accessToken = getRequest().getParameter("accessToken");
//		String nickname = getRequest().getParameter("nickname");
//		logger.debug("qqCallbackNotifySession >> status=" + status + ",openId=" + openId + ",accessToken=" + accessToken + ",nickname=" + nickname);
//
//		if (StringUtils.isBlank(status) || StringUtils.isBlank(openId) || StringUtils.isBlank(accessToken) || StringUtils.isBlank(nickname)) {
//			logger.debug("qqCallbackNotifySession 非法请求。");
//			getResponse().getWriter().write("-1");
//			return null;
//		}
//		if (status.equals("login")) {
//			logger.debug("qq用户登陆，在本地系统内注册到session中.");
//
//			// 查询本地数据库，如果没有此用户则创建一个
//			Account acc = new Account();
//			acc.setOpenId(openId);
//			acc = accountService.selectOne(acc);
//			if (acc == null) {
//				logger.debug("查询不到此新浪微博用户。准备创建一个。");
//				acc = new Account();
//				acc.setOpenId(openId);
//				acc.setAccessToken(accessToken);
//				acc.setLoginType(LoginTypeEnum.qq);// 设置为QQ登陆
//				acc.setAccountType(acc.getLoginType().toString());
//				accountService.insertOutAccount(acc);
//				logger.debug("创建成功。");
//			}
//
//			acc.setLoginType(LoginTypeEnum.qq);// 设置为QQ登陆
//			acc.setNickname(nickname);
//			getSession().setAttribute(FrontContainer.USER_INFO, acc);
//			logger.debug("注册完毕.");
//		} else if (status.equals("loginOut")) {
//			logger.debug("qq登陆用户退出。");
//			loginout();
//		}
//		getResponse().getWriter().write("0");
//		return null;
//	}

//	/**
//	 * 新浪微博登陆成功后通知本地系统
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String sinaWeiboLoginNotifySession() throws IOException {
//		String id = getRequest().getParameter("id");// 新浪微博登陆返回的ID
//		String status = getRequest().getParameter("status");// login/loginout
//		String nickname = getRequest().getParameter("nickname");// 昵称
//		logger.debug("sinaWeiboLoginNotifySession...id=" + id + ",status=" + status + ",nickname=" + nickname);
//		if (StringUtils.isBlank(id) || StringUtils.isBlank(status) || StringUtils.isBlank(nickname)) {
//			getResponse().getWriter().write("-1");// 非法请求
//			return null;
//		}
//
//		if (status.equals("login")) {// 微博登陆成功
//			logger.debug("sinaWeiboLoginNotifySession用户登陆，在本地系统内注册到session中.");
//
//			// 查询本地数据库，如果没有此用户则创建一个
//			Account acc = new Account();
//			acc.setSinaWeiboID(id);
//			acc = accountService.selectOne(acc);
//			if (acc == null) {
//				logger.debug("查询不到此新浪微博用户。准备创建一个。");
//				acc = new Account();
//				acc.setSinaWeiboID(id);
//				acc.setLoginType(LoginTypeEnum.sinawb);// 设置为新浪微博登陆
//				acc.setAccountType(acc.getLoginType().toString());
//				accountService.insertOutAccount(acc);
//				logger.debug("创建成功。");
//			}
//			acc.setLoginType(LoginTypeEnum.sinawb);// 设置为新浪微博登陆
//			acc.setNickname(nickname);
//			getSession().setAttribute(FrontContainer.USER_INFO, acc);
//			logger.debug("注册完毕.");
//		} else {
//			// 微博退出成功
//			loginout();
//		}
//		getResponse().getWriter().write("0");
//		return null;
//	}
	
	
	/**
	 * 转到登陆页面
	 * 
	 * @return
	 * @throws IOException 
	 */
	public String toShop() throws IOException {
		CqsUser cqsUser=redisSevice.getCqsUser(getRequest());
		if(cqsUser==null ||  StringUtils.isEmpty(cqsUser.getMebId())){
			printAppError("当前用户不存在！");
			return null;
		}
		Account acc = setCqsUser(cqsUser);
		Map<String, Object> map=new HashMap<String, Object>();
		map.put("indexImage", SystemManager.indexImages);//首页图片
		map.put("hotProduct", SystemManager.indexLeftProduct);//爆款产品图片
		map.put("point", acc.getMebPoint());//积分点数
		map.put("catalogsItems", SystemManager.catalogsItems);//分类积分商品推荐
		printSuccess(map);
		return null;
	}
//	/**
//	 * 转到登陆页面
//	 * 
//	 * @return
//	 */
//	public String login() {
//		String fromModule = this.getFromModule();
//		this.errorMsg = null;
//		getSession().setAttribute(FrontContainer.login_errorMsg, errorMsg);
//		logger.debug("toLogin...");
//		getSession().setAttribute("errorMsg", null);
//		// 如果有用户session
//		if (getSession().getAttribute(FrontContainer.USER_INFO) != null) {
//			if (fromModule.equals("PC")) {
//				return "pc_index";
//			}
//			return toIndex;
//		}
//		// 跳转到登录页面
//		if (fromModule.equals("PC")) {
//			return "toPcLogin";
//		}
//		return toLogin;
//	}

	/**
	 * @param cqsUser
	 * @return
	 * @throws NumberFormatException
	 * @throws IOException
	 */
	private Account setCqsUser(CqsUser cqsUser) throws NumberFormatException, IOException {
		String mebId=cqsUser.getMebId();
		MebInfo mebBasic =new MebInfo();
		mebBasic.setMeb_id(Integer.valueOf(mebId));
		Account _account=new Account();
		_account.setMebInfo(mebBasic);
		Account acc = accountService.login(_account);
		if(acc==null){
			printAppError("当前用户不存在！");
			return null;
		}
		setLoginInfo(acc);
		return acc;
	}

//	/**
//	 * 转到注册页面
//	 * 
//	 * @return
//	 */
//	public String register() {
//		logger.debug("register...");
//		String fromModule = this.getFromModule();
//		// 如果有用户session
//		if (getSession().getAttribute(FrontContainer.USER_INFO) != null) {
//			if (fromModule.equals("PC")) {
//				return "pcRegister";
//			}
//			return toIndex;
//		}
//		// 如果没有登录
//		if (fromModule.equals("PC")) {
//			return "pcRegister";
//		}
//		return "register";
//	}

//	/**
//	 * 用户登陆
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String doLogin() throws IOException {
//		logger.debug("doLogin()...");
//		if (getSession().getAttribute(FrontContainer.USER_INFO) != null) {
//			return toIndex;
//		}
//		errorMsg = "<font color='red'>帐号或密码错误!</font>";
//		if (e.getAccount() == null || e.getAccount().trim().equals("") || e.getPassword() == null || e.getPassword().trim().equals("")) {
//			getSession().setAttribute("errorMsg", errorMsg);
//			logger.debug("doLogin.errorMsg=" + errorMsg);
//			String fromModule = this.getFromModule();
//			if (fromModule.equals("PC")) {
//				return "toPcLogin";
//			}
//			return toLogin;
//		}
//		// 用户验证
//		e.setPassword(MD5.md5(e.getPassword()));
//		String account = e.getAccount();
//		String password = e.getPassword();
//		e.clear();
//		e.setTel(account);
//		e.setPassword(password);
//		Account acc = accountService.selectOne(e);
//		if (acc == null) {
//			getSession().setAttribute(FrontContainer.login_errorMsg, errorMsg);
//			String fromModule = this.getFromModule();
//			if (fromModule.equals("PC")) {
//				return "toPcLogin";
//			}
//			return toLogin;
//		} else if (acc.getFreeze().equals(Account.account_freeze_y)) {
//			if (StringUtils.isBlank(acc.getFreezeStartdate()) && StringUtils.isBlank(acc.getFreezeEnddate())) {
//				getSession().setAttribute(FrontContainer.login_errorMsg, "<font color='red'>此账号已永久冻结!有疑问请联系站点管理员!</font>");
//			} else {
//				getSession().setAttribute(FrontContainer.login_errorMsg, "<font color='red'>此账号已暂时冻结!有疑问请联系站点管理员!</font>");
//			}
//			String fromModule = this.getFromModule();
//			if (fromModule.equals("PC")) {
//				return "toPcLogin";
//			}
//			return toLogin;
//		} else if (acc.getEmailIsActive().equals(Account.account_emailIsActive_n)) {
//			// 邮箱未激活
//			errorMsg = "<font color='red'>此账号的邮箱尚未激活，请立即去激活邮箱！</font>";
//			getSession().setAttribute(FrontContainer.login_errorMsg, errorMsg);
//			String fromModule = this.getFromModule();
//			if (fromModule.equals("PC")) {
//				return "toPcLogin";
//			}
//			return toLogin;
//		}
//		errorMsg = null;
//		acc.setLoginType(LoginTypeEnum.system);// 登陆方式
//		getSession().setAttribute(FrontContainer.USER_INFO, acc);
//
//		// 更新用户最后登录时间
//		e.clear();
//		e.setId(acc.getId());
//		e.setLastLoginTime("yes");
//		e.setLastLoginIp(AddressUtils.getIp(getRequest()));
//		String address = null;
//		try {
//			address = AddressUtils.getAddresses("ip=" + e.getLastLoginIp(), "utf-8");
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//
//		e.setLastLoginArea(address);
//		accountService.update(e);
//		e.clear();
//
//		if (directUrl != null && !"".equals(directUrl.trim())) {
//			this.getResponse().sendRedirect(directUrl);
//			return null;
//		}
//		return toIndex;
//	}

//	/**
//	 * 用户异步登陆
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String jsonLogin() throws IOException {
//		super.utf8JSON();
//		String url = "/user/user.html";
//		if (StringUtils.isNotEmpty(directUrl)) {
//			if (directUrl.startsWith("/")) {
//				this.getResponse().sendRedirect(directUrl);
//			} else {
//				url = new String(Base64.decodeBase64(directUrl.trim().getBytes()));// 获取解码后的url
//			}
//		}
//		String username = this.getRequest().getParameter("username");
//		String password = this.getRequest().getParameter("password");
//		if (StringUtils.isEmpty(username) || StringUtils.isEmpty(password)) {
//			JSONObject object = JSONObject.fromObject(new JSONResult(1,"帐号和密码不能为空！",""));
//			getResponse().getWriter().write(object.toString());
//			return null;
//		}
//		// 用户验证
//		e.setPassword(MD5.md5(password));
//		e.setAccount(username);
//		String account = e.getAccount();
//		password = e.getPassword();
//		e.clear();
//		e.setAccount(account);
//		e.setPassword(password);
//		Account acc=null ;//= accountService.login(e);
//		if (acc == null) {
//			JSONObject object = JSONObject.fromObject(new JSONResult(1,"账号或者密码错误！",""));
//			getResponse().getWriter().write(object.toString());
//			return null;
//		} else if (acc.getFreeze().equals(Account.account_freeze_y)) {
//			if (StringUtils.isBlank(acc.getFreezeStartdate()) && StringUtils.isBlank(acc.getFreezeEnddate())) {
//				JSONObject object = JSONObject.fromObject(new JSONResult(1,"此账号已永久被冻结！",""));
//				getResponse().getWriter().write(object.toString());
//				return null;
//			} else {
//				JSONObject object = JSONObject.fromObject(new JSONResult(1,"此账号已暂时被冻结！",""));
//				getResponse().getWriter().write(object.toString());
//				return null;
//			}
//			
//		}
//		setLoginInfo(acc);
//		// 更新用户最后登录时间
//		e.clear();
//		e.setId(acc.getId());
//		e.setLastLoginTime("yes");
//		e.setLastLoginIp(AddressUtils.getIp(getRequest()));
//		String address = null;
//		try {
//			address = AddressUtils.getAddresses("ip=" + e.getLastLoginIp(), "utf-8");
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//		e.setLastLoginArea(address);
//		accountService.update(e);
//		JSONObject object = JSONObject.fromObject(new JSONResult(0,"恭喜你，登录成功！",url));
//		getResponse().getWriter().write(object.toString());
//		e.clear();
//		return null;
//	}
	
	private void setLoginInfo(Account acc ){
		acc.setLoginType(LoginTypeEnum.system);// 登陆方式
		redisSevice.setShopUser(getRequest(), acc);
		getSession().setAttribute("guestSession", null);
	}
	

	/**
	 * 获得客户端真实IP地址
	 * 
	 * @param request
	 * @return
	 */
	public String getIpAddr(HttpServletRequest request) {
		String ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	/**
	 * 退出
	 * 
	 * @return
	 */
	public String exit() {
		loginout();
		return "toLoginRedirect";
	}

	/**
	 * 用户注销
	 * 
	 * @return
	 */
	public String loginout() {
		// 清除用户session
		Account account = redisSevice.getShopUser(getRequest());
		if (account != null) {
			account.clear();
		}
//		getSession().setAttribute(FrontContainer.USER_INFO, null);
//
//		// 清除用户购物车缓存
//		CartInfo cartInfo = (CartInfo) getSession().getAttribute(FrontContainer.myCart);
//		if (cartInfo != null) {
//			cartInfo.clear();
//		}
//		getSession().setAttribute(FrontContainer.myCart, null);
//		getSession().setAttribute(FrontContainer.login_errorMsg, null);
//		getSession().setAttribute("guestSession", null);

		redisSevice.deleteToken(getRequest());
		// 清除历史浏览记录
		LinkedHashMap<String, Product> history_product_map = (LinkedHashMap<String, Product>) getSession().getAttribute(FrontContainer.history_product_map);
		// List<String> history_product_map = (List<String>) getSession().getAttribute(FrontContainer.history_product_map);
		if (history_product_map != null) {
			history_product_map.clear();
		}
		getSession().setAttribute(FrontContainer.history_product_map, null);
//		try {
//			this.getResponse().sendRedirect("/");
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
		return null;
	}

	/**
	 * 分页查询商品收藏夹
	 * 
	 * @return
	 * @throws Exception
	 */
	public String favorite() throws Exception {
		Account acc = redisSevice.getShopUser(getRequest());
		String fromModule = this.getFromModule();
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}

		Favorite favorite = new Favorite();
		favorite.setAccount(acc.getAccount());
		// favorite.setPageSize(1);
		PagerModel commentPager = super.selectPagerModelByServices(favoriteService, favorite);
		super.pager = commentPager;// 公用分页控件需要这么写。
		if (super.pager != null && super.pager.getList() != null && super.pager.getList().size() > 0) {
			List<String> productIds = new LinkedList<String>();
			for (int i = 0; i < super.pager.getList().size(); i++) {
				Favorite ff = (Favorite) super.pager.getList().get(i);
				productIds.add(ff.getProductID());
			}
			// 根君商品ID集合加载商品信息：名称、价格、销量、是否上下架等
			Product p = new Product();
			p.setProductIds(productIds);
			List<Product> productList = productService.selectProductListByIds(p);
			// 将查询出来的每一个商品对象挂到收藏夹对象上去
			if (productList != null && productList.size() > 0) {
				for (int i = 0; i < super.pager.getList().size(); i++) {
					Favorite ff = (Favorite) super.pager.getList().get(i);
					for (int j = 0; j < productList.size(); j++) {
						Product product = productList.get(j);
						if (ff.getProductID().equals(product.getId())) {
							loadSpec(product);
							ff.setProduct(product);
							break;
						}
					}
				}
			}
		}
		pager.setPagerUrl("/user/favorite.html");
		selectLeftMenu = FrontContainer.user_leftMenu_favorite;

		if (fromModule.equals("PC")) {
			return "pc_favorite";
		}

		return "favorite";
	}

	/**
	 * @Description: 商品规格
	 * @param p
	 * @return void
	 * @throws @author
	 *             xiesong
	 * @date 2016-7-12
	 */
	private void loadSpec(Product p) {
		if (StringUtils.isBlank(p.getId())) {
			logger.debug("loadSpec id = " + p.getId());
			return;
		}
		Spec specInfo = new Spec();
		specInfo.setProductID(p.getId());
		p.setSpecList(specService.selectList(specInfo));

		if (p.getSpecList() != null && p.getSpecList().size() > 0) {
			// 添加第一个规格
			Spec spec = p.getSpecList().get(0);
			if (spec != null) {
				p.setSpecID(spec.getId());
			}
		}
	}

	public String comment() throws Exception {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			String fromModule = this.getFromModule();
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}
		Comment comment = new Comment();
		comment.setAccount(acc.getAccount());
		int offset = 0;
		String pagerOffset = getRequest().getParameter("pager.offset");
		if (StringUtils.isNotBlank(pagerOffset)) {
			// throw new NullPointerException();
			offset = Integer.parseInt(pagerOffset);
		}
		if (offset < 0)
			offset = 0;
		comment.setOffset(offset);
		PagerModel servicesPager = commentService.selectMyPageList(comment);
		if (servicesPager == null)
			servicesPager = new PagerModel();
		// 计算总页数
		servicesPager.setPagerSize((servicesPager.getTotal() + servicesPager.getPageSize() - 1) / servicesPager.getPageSize());
		super.pager = servicesPager;// 公用分页控件需要这么写。

		if (super.pager != null && super.pager.getList() != null && super.pager.getList().size() > 0) {
			List<Comment> clist = new ArrayList<Comment>();
			for (int i = 0; i < super.pager.getList().size(); i++) {
				Comment cc = (Comment) super.pager.getList().get(i);
				Orderdetail od = new Orderdetail();
				od.setId(cc.getOrderdetailID());
				od = orderdetailService.selectOne(od);
				cc.setProductName(od.getProductName() + "<br/>" + (od.getSpecInfo() != null ? od.getSpecInfo() : ""));
				clist.add(cc);
			}
			super.pager.setList(clist);
		}

		return "comment";
	}
	
	
	/**
	 * 分页查询商品收藏夹
	 * 
	 * @return
	 * @throws Exception
	 */
	public void getFavoriteList() throws Exception {

		Account acc =redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			printRunTimeError("用户不访问失效了");
			return;
		}
		Favorite favorite = new Favorite();
		favorite.setAccount(acc.getAccount());
		// favorite.setPageSize(1);
		PagerModel commentPager = super.selectPagerModelByServices(favoriteService, favorite);
		super.pager = commentPager;// 公用分页控件需要这么写。
		if (super.pager != null && super.pager.getList() != null && super.pager.getList().size() > 0) {
			List<String> productIds = new LinkedList<String>();
			for (int i = 0; i < super.pager.getList().size(); i++) {
				Favorite ff = (Favorite) super.pager.getList().get(i);
				productIds.add(ff.getProductID());
			}
			// 根君商品ID集合加载商品信息：名称、价格、销量、是否上下架等
			Product p = new Product();
			p.setProductIds(productIds);
			List<Product> productList = productService.selectProductListByIds(p);
			// 将查询出来的每一个商品对象挂到收藏夹对象上去
			if (productList != null && productList.size() > 0) {
				for (int i = 0; i < super.pager.getList().size(); i++) {
					Favorite ff = (Favorite) super.pager.getList().get(i);
					for (int j = 0; j < productList.size(); j++) {
						Product product = productList.get(j);
						if (ff.getProductID().equals(product.getId())) {
							loadSpec(product);
							ff.setProduct(product);
							break;
						}
					}
				}
			}
		}
		 
		printSuccess(super.pager); 
	}

	/**
	 * 删除收藏
	 * 
	 * @return
	 * @throws Exception
	 */
	public String deleteFavorite() throws Exception {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			String fromModule = this.getFromModule();
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}
		selectLeftMenu = "favorite";
		String id = getRequest().getParameter("id");
		if (StringUtils.isBlank(id)) {
			throw new NullPointerException("id is null!");
		}
		Favorite favorite = new Favorite();
		favorite.setId(id);
		favoriteService.delete(favorite);
		return favorite();
	}
	
	
	/**
	 * 删除收藏
	 * 
	 * @return
	 * @throws Exception
	 */
	public void deleteFavoriteAjax() throws Exception {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
				printNoLogin();
				return;
		}
		String id = getRequest().getParameter("id");
		if (StringUtils.isBlank(id)) {
			printAppError("id is null!");
			return;
		}
		Favorite favorite = new Favorite();
		favorite.setId(id);
		favoriteService.delete(favorite);
		printSuccess(null);
	}

//	/**
//	 * ajax验证输入的字符的唯一性
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String unique() throws IOException {
//		logger.debug("验证输入的字符的唯一性" + e);
//		logger.debug(e.getNickname());
//		if (StringUtils.isNotBlank(e.getNickname())) {// 验证昵称是否被占用
//			logger.debug("验证昵称是否被占用");
//			String nickname = e.getNickname();
//			e.clear();
//			e.setNickname(nickname);
//			getResponse().setCharacterEncoding("utf-8");
//			if (accountService.selectCount(e) > 0) {
//				getResponse().getWriter().write("{\"error\":\"昵称已经被占用!\"}");
//			} else {
//				getResponse().getWriter().write("{\"ok\":\"昵称可以使用!\"}");
//			}
//		} else if (StringUtils.isNotBlank(e.getAccount())) {// 验证用户名是否被占用
//			logger.debug("验证用户名是否被占用");
//			String account = e.getAccount();
//			e.clear();
//			e.setAccount(account);
//			getResponse().setCharacterEncoding("utf-8");
//			if (accountService.login(e) != null) {
//				getResponse().getWriter().write("{\"mess\":1,\"info\":\"账号已存在\"}");
//
//			} else {
//				getResponse().getWriter().write("{\"mess\":0,\"info\":\"账号可以使用\"}");
//
//			}
//		} else if (StringUtils.isNotBlank(e.getVcode())) {// 验证验证码输入的是否正确
//			logger.debug("检查验证码输入的是否正确" + e.getVcode());
//			String validateCode = getSession().getAttribute(FrontContainer.validateCode).toString();
//			logger.debug("validateCode=" + validateCode);
//			getResponse().setCharacterEncoding("utf-8");
//			if (validateCode.equalsIgnoreCase(e.getVcode())) {
//				getResponse().getWriter().write("{\"ok\":\"验证码输入正确!\"}");
//			} else {
//				getResponse().getWriter().write("{\"error\":\"验证码输入有误!\"}");
//			}
//			// vcode = null;
//		} else if (StringUtils.isNotBlank(e.getPassword())) {// 验证原始密码输入是否正确
//			logger.debug("验证原始密码输入是否正确" + e.getPassword());
//			Account acc = redisSevice.getShopUser(getRequest());
//			getResponse().setCharacterEncoding("utf-8");
//			if (StringUtils.isNotBlank(e.getPassword()) && MD5.md5(e.getPassword()).equals(acc.getPassword())) {
//				getResponse().getWriter().write("{\"ok\":\"原密码输入正确!\"}");
//			} else {
//				getResponse().getWriter().write("{\"error\":\"原密码输入有误!\"}");
//			}
//		}
//
//		if (e != null) {
//			e.clear();
//		}
//		return null;
//	}

//	/**
//	 * 查看个人信息
//	 * 
//	 * @return
//	 */
//	public String user() {
//		Account acc = redisSevice.getShopUser(getRequest());
//		String fromModule = this.getFromModule();
//		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
//			if (fromModule.equals("PC")) {
//				return "toPcLogin";
//			}
//			return toLogin;
//		}
//		e = accountService.selectById(acc.getId());
//		getSession().setAttribute(FrontContainer.USER_INFO, e);
//		orderSimpleReport = orderService.selectOrdersSimpleReport(acc.getAccount());
//		if (fromModule.equals("PC")) {
//			return "toPcUser";
//		}
//		return "user";
//	}
	
	/**
	 * 查看个人信息
	 * @return
	 */
	public void userSimpleReport() throws IOException{
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			printNoLogin();
			return;
		}
		e = accountService.selectById(acc.getId());
		orderSimpleReport = orderService.selectOrdersSimpleReport(acc.getAccount());
		printSuccess(orderSimpleReport);
	}

//	/**
//	 * @Description: 支付时验证用户余额
//	 * @return
//	 * @return String
//	 * @throws @author
//	 *             xiesong
//	 * @date 2016-7-8
//	 */
//	public String veifUserMoney() {
//		String money = getRequest().getParameter("money");
//		String type = getRequest().getParameter("type");
//		if (StringUtils.isBlank(money)) {
//			throw new NullPointerException("支付金额不能为空！");
//		}
//		Account account = (Account) getRequest().getSession().getAttribute(FrontContainer.USER_INFO);
//		if (account == null || StringUtils.isBlank(account.getAccount())) {
//			throw new NullPointerException("账号不能为空！");
//		}
//		account = accountService.selectById(account.getId());
//		Double balance = 0.0;
//		if ("1".equals(type)) {// 现金券
//			balance = account.getMoneyBalance();
//		} else {// 认种券
//			balance = account.getTicketBalance();
//		}
//		try {
//			Double price = Double.valueOf(money);
//			if (balance >= price) {
//				getResponse().getWriter().write("{\"mess\":1}");
//			} else {
//				getResponse().getWriter().write("{\"mess\":0}");
//			}
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
//		return null;
//	}

//	/**
//	 * 手机绑定
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String bind() throws IOException {
//
//		String session_openid = (String) this.getRequest().getSession().getAttribute("session_openid");
//
//		if (session_openid != null) {
//			Account acc = new Account();
//
//			String nikeName = (String) this.getRequest().getSession().getAttribute("nikeName");
//			String headimgurl = (String) this.getRequest().getSession().getAttribute("headimgurl");
//			String mobile = this.getRequest().getParameter("mobile");
//			String vcode = this.getRequest().getParameter("vcode");
//			if (StringUtils.isBlank(mobile)) {
//				this.printJson("{\"mess\":1,\"info\":\"手机号不能为空\"}");
//				return null;
//			}
//
//			if (StringUtils.isBlank(vcode)) {
//
//				this.printJson("{\"mess\":1,\"info\":\"验证码不能为空\"}");
//				return null;
//			}
//
//			e = new Account();
//			e.setAccount(mobile);
//			Sms sms = new Sms();
//			sms.setPhone(e.getAccount());
//			sms.setSendStatus(vcode);
//			List<Sms> mmlist = smsService.selectList(sms);
//			Sms mm = null;
//			if (mmlist != null && mmlist.size() > 0) {
//				mm = mmlist.get(0);
//			}
//
//			if (mm != null) {
//				if (!mm.isOk()) {
//					// 验证码已使用
//					this.printJson("{\"mess\":1,\"info\":\"手机校验码已使用\"}");
//					return null;
//
//				} else if (!mm.unPassWay()) {
//					// 验证码过期
//					this.printJson("{\"mess\":1,\"info\":\"手机校验码已使用\"}");
//					return null;
//
//				} else {
//					acc = accountService.selectOne(e);
//					if (acc == null) {
//						String pwd = TenpayUtil.buildRandom(6) + "";
//						e.setOpenId(session_openid);
//						e.setTel(e.getAccount());
//						e.setAccountType("weixin");
//						e.setNickname(nikeName);
//						e.setMobileIsActive("y");
//						e.setFreeze("n");
//						e.setLoginType(LoginTypeEnum.weixin);
//						e.setTicketBalance(0d);
//						e.setMoneyBalance(0d);
//						e.setHeadpic(headimgurl);
//						accountService.insert(e);
//						e.setPassword(MD5.md5(pwd));
//						this.printJson("{\"mess\":0}");
//
//						e.clear();
//						e.setOpenId(session_openid);
//						acc = accountService.selectOne(e);
//						Sms sms1 = new Sms();
//						sms1.setContent("感谢关注鼎烨，您可以通过手机号登录电脑官方商城(http://xqylife.com)。初始密码：" + pwd);
//						SMSWebChinese.sendSMS(sms1);
//						getRequest().getSession().setAttribute(FrontContainer.USER_INFO, acc);
//					} else {
//
//						acc.setOpenId(session_openid);
//						acc.setMobileIsActive("y");
//
//						if (acc.getNickname() == null || "".equals(acc.getNickname())) {
//							acc.setNickname(nikeName);
//
//						}
//						if (acc.getHeadpic() == null || "".equals(acc.getHeadpic())) {
//							acc.setHeadpic(headimgurl);
//
//						}
//						accountService.update(acc);
//						acc.setHeadpic(headimgurl);
//						acc.setNickname(nikeName);
//						this.printJson("{\"mess\":0}");
//						getRequest().getSession().setAttribute(FrontContainer.USER_INFO, acc);
//					}
//
//					mm.setOk(false);
//					smsService.update(mm);
//				}
//			} else {
//				// 验证码错误
//				this.printJson("{\"mess\":1,\"info\":\"手机校验码错误\"}");
//				return null;
//			}
//		} else {
//			this.printJson("{\"mess\":1,\"info\":\"请关闭当前页面，重启登录\"}");
//		}
//		return null;
//	}

	/**
	 * @Description: 充值
	 * @return
	 * @return String
	 * @throws @author
	 *             xiesong
	 * @date 2016-7-8
	 */
	public String recharge() {
		Account acc = redisSevice.getShopUser(getRequest());
		String fromModule = this.getFromModule();
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}

		e = accountService.selectById(acc.getId());
		int offset = 0;
		if (getRequest().getParameter("pager.offset") != null) {
			offset = Integer.parseInt(getRequest().getParameter("pager.offset"));
		}
		if (offset < 0)
			offset = 0;
		Recharge recharge = new Recharge();
		recharge.setCreateAccount(e.getAccount());

		((PagerModel) recharge).setOffset(offset);
		pager = rechargeService.selectPageList(recharge);
		if (pager == null)
			pager = new PagerModel();
		// 计算总页数
		pager.setPagerSize((pager.getTotal() + pager.getPageSize() - 1) / pager.getPageSize());
		pager.setPagerUrl("recharge.html");
		if (fromModule.equals("PC")) {
			return "toPcRecharge";
		}
		return "recharge";
	}

	public String rechargeType() {
		Account acc = redisSevice.getShopUser(getRequest());
		String fromModule = this.getFromModule();
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}
		String rechargeRates = SystemManager.systemSetting.getRechargeRates();// 充值获得现金卷的比例
		e = accountService.selectById(acc.getId());
		String type = getRequest().getParameter("type");
		getRequest().setAttribute("type", type);
		this.getRequest().setAttribute("rechargeRates", rechargeRates == null || "".equals(rechargeRates) ? (1) : Double.valueOf(rechargeRates));
		if (fromModule.equals("PC")) {
			return "toPcRechargeType";
		}
		return "rechargeType";
	}

	public String userBalance() throws IOException {
		Account acc = redisSevice.getShopUser(getRequest());
		String fromModule = this.getFromModule();
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}
		String money = getRequest().getParameter("money");
		String code = getRequest().getParameter("code");
		String rechargeRates = SystemManager.systemSetting.getRechargeRates();// 充值获得现金卷的比例

		Random random = new Random();
		Integer x = random.nextInt(8999);
		x = x + 1000;
		String trade_no = "recharge_" + System.currentTimeMillis() + "_" + x;

		if (Double.valueOf(money) <= 0) {
			this.printJson("参数非法");

			return null;
		}

		// 充值记录
		Recharge obj = new Recharge();
		obj.setCreateAccount(acc.getAccount());
		obj.setMoney(Double.valueOf(money));
		obj.setTradNo(trade_no);
		if (rechargeRates != null) {
			obj.setFee(Double.valueOf(money) * Double.valueOf(rechargeRates));
		} else {
			obj.setFee(Double.valueOf(money));
		}

		// 支付宝支充值
		if (Pay.pay_code_alipayescow.equals(code)) {

			obj.setType("alipay");

			createAlipayPayInfo(money, trade_no);

		}
		obj.setState("n");
		rechargeService.insert(obj);
		return "toRecharge";
	}

	private void createAlipayPayInfo(String money, String trade_no) {

		PayInfo payInfo = new PayInfo();
		payInfo.setWIDseller_email("");

		/**
		 * 解决由于本地和线上正式环境提交相同的商户订单号导致支付宝出现TRADE_DATA_MATCH_ERROR错误的问题。 本地提交的商户订单号前缀是test_时间戳_ 开头，正式环境提交的就是纯粹的支付订单号
		 */

		payInfo.setWIDout_trade_no(trade_no);
		payInfo.setWIDsubject("现金券充值");

		payInfo.setWIDprice(Double.valueOf(money));
		payInfo.setWIDbody("现金券充值");
		payInfo.setWIDreceive_name("");
		payInfo.setWIDreceive_address("");
		payInfo.setWIDreceive_zip("");
		payInfo.setWIDreceive_phone("");
		payInfo.setWIDreceive_mobile("");

		payInfo.setLogistics_fee(Double.valueOf(0));
		payInfo.setLogistics_type("");

		logger.debug(payInfo.toString());
		getRequest().setAttribute("payInfo", payInfo);
		getRequest().setAttribute("payType", "1");
	}

//	public String userView() {
//		Account acc = redisSevice.getShopUser(getRequest());
//		String fromModule = this.getFromModule();
//		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
//			if (fromModule.equals("PC")) {
//				return "toPcLogin";
//			}
//			return toLogin;
//		}
//
//		e = accountService.selectById(acc.getId());
//		getSession().setAttribute(FrontContainer.USER_INFO, e);
//
//		if (fromModule.equals("PC")) {
//			return "pc_userView";
//		}
//
//		return "userView";
//	}
	
	private Account selectAccount(){
		return null;
	}

	/**
	 * 修改个人信息
	 * 
	 * @return
	 */

	public String saveSetting() throws IOException {
		accountService.update(e);
		e.clear();
		this.getRequest().getSession().setAttribute("updateSuccess", "更新成功");

		getResponse().getWriter().write("{\"mess\":0,\"info\":\"恭喜你，个人信息更新成功！\"}");
		return null;
	}

	private boolean requireLogin() throws NullPointerException {
		Account account = redisSevice.getShopUser(getRequest());
		if (account == null || StringUtils.isBlank(account.getAccount())) {
			return true;
		}
		return false;
	}

	/**
	 * 配送地址管理
	 * 
	 * @return
	 */
	public String address() {
		Account account = redisSevice.getShopUser(getRequest());
		if (account == null || StringUtils.isBlank(account.getAccount())) {
			String fromModule = this.getFromModule();
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}

		address.setAccount(account.getAccount());
		addressList = addressService.selectList(address);

		String fromModule = this.getFromModule();
		if (fromModule.equals("PC")) {
			return "pc_address";
		}
		return "address";
	}
	
	/**
	 * 配送地址管理
	 * 
	 * @return
	 */
	public void addressList() throws IOException {
		Account account = redisSevice.getShopUser(getRequest());
		if (account == null || StringUtils.isBlank(account.getAccount())) {
			printNoLogin();
			return;
		}
		address.setAccount(account.getAccount());
		addressList = addressService.selectList(address);
		printSuccess(addressList);
	}

 

	/**
	 * 增加配送地址
	 * 
	 * @return
	 * @throws IOException
	 */
	public String saveAddress() throws IOException {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			printNoLogin();
			return null;
		}
		String url = "/user/address.html";

		if (typefrom != null && "confirm".equals(typefrom)) {
			url = "/order/confirmOrder.html";

		}

		// 需要将省市区的代号换成中文，插入到pcadetail字段里面去，显示的时候方便。
		StringBuilder pcadetail = new StringBuilder();
		Area sheng = SystemManager.areaMap.get(address.getProvince());// 省
		pcadetail.append(sheng.getName());

		for (int i = 0; i < sheng.getChildren().size(); i++) {
			Area shi = sheng.getChildren().get(i);// 市
			if (shi.getCode().equals(address.getCity())) {

				pcadetail.append(" ").append(shi.getName());

				for (int j = 0; j < shi.getChildren().size(); j++) {
					Area qu = shi.getChildren().get(j);// 区
					if (qu.getCode().equals(address.getArea())) {
						pcadetail.append(" ").append(qu.getName());
						break;
					}
				}

				break;
			}
		}

		String isdefault = this.getRequest().getParameter("isdefault");
		address.setPcadetail(pcadetail.toString());
		if (!StringUtils.isBlank(isdefault)) {
			address.setIsdefault(isdefault);
		} else {

			address.setIsdefault("n");
		}
		address.setAccount(acc.getAccount());
		if (StringUtils.isBlank(address.getId())) {
			addressService.insert(address);
			addressService.setAddressDefault(address);
			printSuccess("恭喜你，配送地址添加成功！");
			return null;
		} else {
			addressService.update(address);
			addressService.setAddressDefault(address);
			printSuccess("恭喜你，配送地址更新成功！");
			return null;
		}

	}

	/**
	 * 删除指定的配送地址
	 * 
	 * @return
	 * @throws IOException
	 */
	public String deleteAddress() throws IOException {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			String fromModule = this.getFromModule();
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}
		selectLeftMenu = "address";
		String id = getRequest().getParameter("id");
		if (StringUtils.isBlank(id)) {
			throw new NullPointerException("id is null!");
		}
		Address add = new Address();
		add.setId(id);
		addressService.delete(add);
		this.getResponse().sendRedirect("/user/address.html");
		return null;
	}
	
	/**
	 * 删除指定的配送地址
	 * 
	 * @return
	 * @throws IOException
	 */
	public String deleteAddressAjax() throws IOException {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			printNoLogin();
			return null;
		}
		String id = getRequest().getParameter("id");
		if (StringUtils.isBlank(id)) {
			printAppError("id is null!");
			return null;
		}
		Address add = new Address();
		add.setId(id);
		addressService.delete(add);
		printSuccess("删除成功！");
		return null;
	}

	/**
	 * 编辑指定的配送地址
	 * 
	 * @return
	 */
	public String editAddress() {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			String fromModule = this.getFromModule();
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}
		selectLeftMenu = "address";
		String id = getRequest().getParameter("id");
		if (StringUtils.isBlank(id)) {
			throw new NullPointerException("id is null!");
		}
		address = addressService.selectById(id);

		// //获取区域列表
		// if(StringUtils.isNotBlank(address.getArea())){
		//// address.getArea()
		// Area area = SystemManager.areaMap.get(address.getProvince());
		// if(area!=null && area.getChildren()!=null && area.getChildren().size()>0){
		// for(int i=0;i<area.getChildren().size();i++){
		// Area city = area.getChildren().get(i);
		// if(city.getCode().equals(address.getCity())){
		//
		// logger.debug("address.getCity()="+address.getCity());
		// logger.debug(city.toString());
		// address.setAreaList(city.getChildren());
		// break;
		// }
		// }
		// }
		// }
		String fromModule = this.getFromModule();
		if (fromModule.equals("PC")) {
			return "pc_addressView";
		}

		return "addressView";
	}
	
	/**
	 * 编辑指定的配送地址
	 * 
	 * @return
	 */
	public void editAddressAjax() throws IOException {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			printNoLogin();
			return;
		}
		String id = getRequest().getParameter("id");
		if (StringUtils.isBlank(id)) {
			printAppError("id is null!");
			return;
		}
		address = addressService.selectById(id);
		printSuccess(address);
	}

	/**
	 * 我的订单列表
	 * 
	 * @return
	 * @throws Exception
	 */
	public String orders() throws Exception {
		Account acc = redisSevice.getShopUser(getRequest());
		String url = "/user/orders.html";
		String directUrl = new String(Base64.encodeBase64(url.getBytes()));
		this.getRequest().setAttribute("directUrl", directUrl);
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			String fromModule = this.getFromModule();
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}
		// getSession().setAttribute(FrontContainer.selectMenu,FrontContainer.not_select_menu);
		selectLeftMenu = "orders";
		String states = this.getRequest().getParameter("states");
		getMyOrders(acc.getAccount(), states);

		// 查询汇总
		// orderSimpleReport = orderService.selectOrdersSimpleReport(acc.getAccount());
		logger.debug("orderSimpleReport=" + orderSimpleReport);

		String fromModule = this.getFromModule();
		if (fromModule.equals("PC")) {
			return "pc_orders";
		}
		return "orders";
	}
	
	
	/**
	 * 我的订单列表
	 * @return
	 * @throws Exception
	 */
	public void getOrdersList() throws Exception {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			printNoLogin();
			 return ;
		}
		String states = this.getRequest().getParameter("states");
		getMyOrders(acc.getAccount(), states);
		printSuccess(pager);
	}

	/**
	 * 分页查询订单集合
	 * 
	 * @return
	 * @throws Exception
	 */
	private void selectMyOrders(String account, String states) throws Exception {
		int offset = 0;
		if (getRequest().getParameter("pager.offset") != null) {
			offset = Integer.parseInt(getRequest().getParameter("pager.offset"));
		}
		if (offset < 0)
			offset = 0;

		// PagerModel pm = new PagerModel();
		Order order = new Order();
		order.setAccount(account);
		order.setPaystatus(states);

		((PagerModel) order).setOffset(offset);
		pager = orderService.selectPageList(order);
		if (pager == null)
			pager = new PagerModel();
		// 计算总页数
		pager.setPagerSize((pager.getTotal() + pager.getPageSize() - 1) / pager.getPageSize());

		// selectListAfter();
		this.getRequest().setAttribute("states", states);
		pager.setPagerUrl("orders.html");

	}

	/**
	 * 分页获取我的订单列表，首页分页查询订单集合，然后把查询到的ID集合仍到一个多表联合的查询里面，查询出更多的信息。分页显示用户的订单只用一个SQL貌似不好搞的。想到好办法再去优化。
	 * 
	 * @throws Exception
	 */
	private void getMyOrders(String account, String states) throws Exception {
		// 分页查询订单ID集合
		// super.selectList();
		// 1、分页查询订单集合
		selectMyOrders(account, states);
		// 根据上面查询出来的ID集合，多表联合查询出订单和订单明细数据
		List<Order> ordersTemp = getPager().getList();
		List<String> ids = new LinkedList<String>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (Order orderItem : ordersTemp) {
			// 时间转换成可以阅读的格式
			orderItem.setCreatedate(DateTimeUtil.getDateTimeString(sdf.parse(orderItem.getCreatedate())));
			if(null!=orderItem.getPaydate())
				orderItem.setPaydate(DateTimeUtil.getDateTimeString(sdf.parse(orderItem.getPaydate())));
			if(null!=orderItem.getSigndate())
				orderItem.setSigndate(DateTimeUtil.getDateTimeString(sdf.parse(orderItem.getSigndate())));
			if(null!=orderItem.getSenddate())
				orderItem.setSenddate(DateTimeUtil.getDateTimeString(sdf.parse(orderItem.getSenddate())));
			ids.add(orderItem.getId());
		}

		Order order = new Order();
		order.clear();
		order.setAccount(account);
		order.setQueryOrderIDs(ids);
		//2、查询指定订单集合的所有订单项集合，然后内存中对订单项进行分组
		List<Order> myOrders = orderService.selectList(order);
		if(myOrders!=null && myOrders.size()>0){
			for(int i=0;i<ordersTemp.size();i++){
				Order orderItem = ordersTemp.get(i);
				for(Iterator<Order> it = myOrders.iterator();it.hasNext();){
					Order orderdetail = it.next();
					if(orderdetail.getId().equals(orderItem.getId())){
						orderItem.getOrders().add(orderdetail);
						it.remove();
					}
				}
			}
		}

	}

	/**
	 * 转到修改密码
	 * 
	 * @return
	 * @throws IOException
	 */
	public String topwd() throws IOException {
		super.utf8JSON();
		String fromModule = this.getFromModule();
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null) {
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}
		e = accountService.selectById(acc.getId());
		if (fromModule.equals("PC")) {
			this.errorMsg = null;
			selectLeftMenu = "pc_topwd";
			return "pc_topwd";
		} else {
			this.errorMsg = null;
			selectLeftMenu = "topwd";

			return "topwd";

		}
	}

//	/**
//	 * 修改密码
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String changePwd() throws IOException {
//		super.utf8JSON();
//		Account acc = redisSevice.getShopUser(getRequest());
//		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
//			if (getSession().getAttribute(FrontContainer.USER_INFO) == null) {
//				getResponse().getWriter().write("{\"mess\":1,\"info\":\"请先登录才可以操作！\"}");
//				return null;
//			}
//		}
//		if (StringUtils.isBlank(e.getNewPassword()) || StringUtils.isBlank(e.getNewPassword2()) || StringUtils.isBlank(e.getPassword())) {
//			getResponse().getWriter().write("{\"mess\":1,\"info\":\"请按要求填写信息！\"}");
//			return null;
//		}
//
//		if (acc.getPassword() != null && e.getPassword() != null) {
//			if (!MD5.md5(e.getPassword()).equals(acc.getPassword())) {
//
//				getResponse().getWriter().write("{\"mess\":1,\"info\":\"原始密码输入错误！\"}");
//				return null;
//			}
//		}
//
//		// selectLeftMenu = "changePwd";
//		selectLeftMenu = "topwd";
//		// logger.debug(">>e.getNewPassword() = "+e.getNewPassword());
//		e.setPassword(MD5.md5(e.getNewPassword()));
//		e.setId(acc.getId());
//		// logger.debug(">>e.getPassword() = "+e.getPassword());
//		accountService.update(e);
//		this.errorMsg = "修改密码成功！";
//
//		// 重新缓存密码数据
//		acc.setPassword(e.getPassword());
//
//		e.clear();
//
//		getResponse().getWriter().write("{\"mess\":0,\"info\":\"修改密码成功！\",\"url\":\"/user/topwd.html\"}");
//		return null;
//	}

	// private void setSelectMenu(String selectID){
	// getSession().setAttribute(FrontContainer.selectMenu, selectID);
	// }

	/**
	 * 帮助中心
	 * 
	 * @return
	 */
	public String help() throws Exception {
		logger.debug("this.helpCode=" + this.helpCode);
		if (StringUtils.isBlank(this.helpCode)) {
			throw new NullPointerException("helpCode参数不能为空");
		} else if (this.helpCode.equals("index")) {
			return "help";
		} else {
			News newsParam = new News();
			newsParam.setCode(helpCode);
			news = newsService.selectSimpleOne(newsParam);
			if (news == null) {
				throw new NullPointerException("根据code查询不到文章！");
			}

			String url = "/jsp/helps/" + news.getId() + ".jsp";
			logger.debug("url = " + url);
			getRequest().setAttribute("newsInfoUrl", url);

			return "help";

			// logger.debug("SystemManager.newsMap="+SystemManager.newsMap);
			// news = SystemManager.newsMap.get(this.helpCode);//newsService.selectById(String.valueOf(helpID));
			// if(news==null){
			// throw new NullPointerException("根据code查询不到文章！");
			// }
		}
		// return "help";
	}

	/**
	 * 设置选中的
	 * 
	 * @return
	 */
	public String setAddressDefault() {
		address.clear();
		String id = getRequest().getParameter("id");
		if (StringUtils.isBlank(id)) {
			throw new NullPointerException("默认地址ID不能为空！");
		}

		Account account = redisSevice.getShopUser(getRequest());
		if (account == null || StringUtils.isBlank(account.getAccount())) {
			throw new NullPointerException("账号不能为空！");
		}

		address.setId(id);
		address.setIsdefault("y");
		address.setAccount(account.getAccount());
		addressService.setAddressDefault(address);
		try {
			getResponse().getWriter().write("{\"mess\":0}");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 获取所有省份
	 * @throws IOException
	 */
	public void getAllProvinces() throws IOException
	{
		printSuccess(SystemManager.getProvinceMap());
	}
	
	/**
	 * 根据省份编码获取城市列表
	 * 
	 * @return
	 * @throws IOException
	 */
	public String selectCitysByProvinceCode() throws IOException {
		logger.debug("selectCitysByProvinceCode...");
		String provinceCode = getRequest().getParameter("provinceCode");
		logger.debug("selectCitysByProvinceCode...provinceCode=" + provinceCode);
		if (StringUtils.isBlank(provinceCode)) {
			printRunTimeError("provinceCode is null");
			return null;
		}

		// Area area = new Area();
		// area.setCode(provinceCode);
		if (SystemManager.areaMap != null && SystemManager.areaMap.size() > 0) {
			Area areaInfo = SystemManager.areaMap.get(provinceCode);

			logger.debug("areaInfo = " + areaInfo);

			if (areaInfo != null && areaInfo.getChildren() != null && areaInfo.getChildren().size() > 0) {
				String jsonStr = JSON.toJSONString(areaInfo.getChildren());
				logger.debug("jsonStr=" + jsonStr);
				printSuccess(jsonStr);
				return null;
			}
		}

		printSuccess(null);
		return null;
	}

	/**
	 * 根据城市编码获取区域列表
	 * 
	 * @return
	 * @throws IOException
	 */
	public String selectAreaListByCityCode() throws IOException {
		logger.debug("selectAreaListByCityCode...");
		String provinceCode = getRequest().getParameter("provinceCode");
		String cityCode = getRequest().getParameter("cityCode");
		logger.debug("selectAreaListByCityCode...provinceCode=" + provinceCode + ",cityCode=" + cityCode);
		if (StringUtils.isBlank(provinceCode) || StringUtils.isBlank(cityCode)) {
			printAppError("provinceCode or cityCode is null");
			return null;
		}

		if (SystemManager.areaMap != null && SystemManager.areaMap.size() > 0) {
			Area city = SystemManager.areaMap.get(provinceCode);
			logger.debug("areaInfo = " + city);
			if (city != null && city.getChildren() != null && city.getChildren().size() > 0) {
				for (int i = 0; i < city.getChildren().size(); i++) {
					Area item = city.getChildren().get(i);
					if (item.getCode().equals(cityCode)) {
						if (item.getChildren() != null && item.getChildren().size() > 0) {
							printSuccess(item.getChildren());
							return null;
						}
					}
				}
			}
		}

		printSuccess(null);
		return null;
	}

//	public String alipayFastLogin() throws Exception {
//		if (true) {
//			return "alipayFastLogin";
//		}
//		//////////////////////////////////// 请求参数//////////////////////////////////////
//
//		// 目标服务地址
//		String target_service = "user.auth.quick.login";
//		// 必填
//		// 必填，页面跳转同步通知页面路径
//		String return_url = SystemManager.systemSetting.getWww() + "/alipayapi_fastLogin_return_url.jsp";
//		// 需http://格式的完整路径，不允许加?id=123这类自定义参数
//
//		// 防钓鱼时间戳
//		String anti_phishing_key = "";
//		// 若要使用请调用类文件submit中的query_timestamp函数
//
//		// 客户端的IP地址
//		String exter_invoke_ip = "";
//		// 非局域网的外网IP地址，如：221.0.0.1
//
//		//////////////////////////////////////////////////////////////////////////////////
//
//		// 把请求参数打包成数组
//		Map<String, String> sParaTemp = new HashMap<String, String>();
//		sParaTemp.put("service", "alipay.auth.authorize");
//		sParaTemp.put("partner", AlipayConfig.partner);
//		sParaTemp.put("_input_charset", AlipayConfig.input_charset);
//		sParaTemp.put("target_service", target_service);
//		sParaTemp.put("return_url", return_url);
//		sParaTemp.put("anti_phishing_key", anti_phishing_key);
//		sParaTemp.put("exter_invoke_ip", exter_invoke_ip);
//
//		// 建立请求
//		String sHtmlText = AlipaySubmit.buildRequest(sParaTemp, "get", "确认");
//		// getResponse().getOutputStream().println(sHtmlText);
//		// getResponse().getWriter().println(sHtmlText);
//		System.out.println("sHtmlText=" + sHtmlText);
//		// return "alipayFastLogin";
//		return null;
//	}

	/**
	 * 用户使用邮件重置密码
	 * 
	 * @return
	 */
	public String reset() {
		checkSendEmail();
		return "reset";
	}

	/**
	 * 系统发出邮件后，用户访问邮件中的URL地址，此方法检查该地址的有效性和时间的有效性
	 */
	private Email checkSendEmail() {
		String sign = getRequest().getParameter("sign");
		if (StringUtils.isBlank(sign)) {
			throw new NullPointerException("参数非法!");
		}

		// 查询邮件是否是本系统所发出的
		Email email = new Email();
		email.setSign(sign);
		email = emailService.selectOne(email);
		if (email == null) {
			throw new NullPointerException("非法请求！");
		}

		if (email.getStatus().equals(email.email_status_y)) {
			getRequest().setAttribute(FrontContainer.reset_password_email_timeout, "当前连接已失效！");
			return null;
		}

		// String email_id = email.getId();

		e.setAccount(email.getAccount());
		// 检查此邮件是否过期
		long time1 = Long.valueOf(email.getStarttime());
		long time2 = new Date().getTime();
		long time3 = Long.valueOf(email.getEndtime());
		if (time2 > time1 && time2 < time3) {
			// 更新邮件状态为已失效
			Email email2 = new Email();
			email2.setStatus(email.email_status_y);
			email2.setId(email.getId());
			emailService.update(email2);

			// 允许修改密码
			return email;
		} else {
			logger.debug("邮件已过期！");
			getRequest().setAttribute(FrontContainer.reset_password_email_timeout, "当前连接已失效！");
		}
		return null;
	}

	/**
	 * 通过邮件重置密码
	 * 
	 * @return
	 * @throws IOException
	 */
	public String doReset() throws IOException {
		logger.debug("doReset...");
		if (StringUtils.isBlank(e.getAccount()) || StringUtils.isBlank(e.getPassword()) || StringUtils.isBlank(e.getPassword2())) {
			throw new NullPointerException("请求非法！");
		}

		if (!e.getPassword().equals(e.getPassword2())) {
			// getRequest().setAttribute(FrontContainer.show_user_option_error, "两次输入的密码不一致！");
			throw new RuntimeException("两次输入的密码不一致！");
		}
		logger.debug("doReset...e.getPassword() = " + e.getPassword());
		Account acc = new Account();
		acc.setAccount(e.getAccount());
		acc.setPassword(MD5.md5(e.getPassword()));
		accountService.updatePasswordByAccount(acc);
		getResponse().sendRedirect(SystemManager.systemSetting.getWww() + "/user/resetSuccess.html");
		return null;
		// return "resetSuccess";
	}

	public String resetSuccess() {
		return "resetSuccess";
	}

//	/**
//	 * 取消绑定手机
//	 * 
//	 * @return
//	 */
//	public String resetMobile() {
//
//		Account acc = redisSevice.getShopUser(getRequest());
//		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
//			String fromModule = this.getFromModule();
//			if (fromModule.equals("PC")) {
//				return "toPcLogin";
//			}
//			return toLogin;
//		}
//		Account account = new Account();
//		account.setAccount(acc.getAccount());
//		Account ac = accountService.selectOne(account);
//		if (ac != null) {
//			ac.setMobileIsActive("n");
//			accountService.update(ac);
//		}
//
//		return userView();
//	}

	/**
	 * 转到修改邮箱页面
	 * 
	 * @return
	 */
	public String changeEmail() {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			return toLoginRedirect;
		}
		return "toChangeEmail";
	}

	/**
	 * 修改邮箱
	 * 
	 * @return
	 * @throws Exception
	 */
	public String doChangeEmail() throws Exception {
		logger.debug("e.getNewEmail() = " + e.getNewEmail());
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			String fromModule = this.getFromModule();
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}

		logger.debug("doChangeEmail..");
		if (!TokenUtil.getInstance().isTokenValid(getRequest())) {
			throw new Exception("表单重复提交了！");
		}

		if (StringUtils.isBlank(e.getPassword()) || StringUtils.isBlank(e.getNewEmail())) {
			throw new NullPointerException("非法请求！");
		}

		// Account acc = (Account)getSession().getAttribute(FrontContainer.USER_INFO);
		if (!MD5.md5(e.getPassword()).equals(acc.getPassword())) {
			// 前台AJAX检查密码出问题了，后台来处理前端的不足
			throw new RuntimeException("出现错误，请联系系统管理员！");
		}

		// 发送邮件到指定邮箱。
		acc.setNewEmail(e.getNewEmail());

		accountService.sendEmail(acc, NotifyTemplate.email_change_email);
		acc.setNewEmail(null);
		return "changeEamilWait";
	}

	public String changeEamilWait() {
		logger.debug("changeEamilWait..");
		return "toChangeEamilWait";
	}

	/**
	 * 修改邮箱--->用户登陆邮箱后点击邮件---->激活邮箱---->调用此方法
	 * 
	 * @return
	 */
	public String active() {
		logger.debug("active...");
		selectLeftMenu = "user";

		String sign = getRequest().getParameter("sign");
		// String type = getRequest().getParameter("type");
		if (StringUtils.isBlank(sign)) {
			throw new NullPointerException("非法请求！");
		}
		Email email = checkSendEmail();
		if (email != null) {
			Account acc = new Account();
			acc.setEmail(email.getNewEmail());
			acc.setAccount(email.getNewEmail());
			accountService.updateEmailByAccount(acc);

			// 修改邮箱成功后，更新session缓存中数据
			acc = redisSevice.getShopUser(getRequest());
			if (acc != null && StringUtils.isNotBlank(acc.getAccount())) {
				acc.setEmail(email.getNewEmail());
				acc.setAccount(email.getNewEmail());
			}

			email = new Email();
			email.setStatus(email.email_status_n);
			email.setPageMsg("恭喜：新邮箱已激活！");
			getRequest().setAttribute(FrontContainer.reset_password_email_timeout, email);
		} else {
			email = new Email();
			email.setStatus(email.email_status_y);
			email.setPageMsg("当前连接已失效！");
			getRequest().setAttribute(FrontContainer.reset_password_email_timeout, email);
		}
		return "active";
	}

	/**
	 * 激活账号的邮件的回调
	 * 
	 * @return
	 */
	public String activeAccount() {
		logger.debug("active...");
		String sign = getRequest().getParameter("sign");
		if (StringUtils.isBlank(sign)) {
			throw new NullPointerException("非法请求！");
		}

		// 查询邮件是否是本系统所发出的
		Email email = new Email();
		email.setSign(sign);
		email = emailService.selectOne(email);
		this.getRequest().setAttribute("loginurl", SystemManager.systemSetting.getWww() + "/user/user.html");
		if (email == null) {
			throw new NullPointerException("非法请求！");
		}

		if (email.getStatus().equals(Email.email_status_y)) {
			getRequest().setAttribute("LinkInvalid", "链接已失效！");
			return "activeAccount";
		}

		Account acc = new Account();
		acc.setAccount(email.getAccount());
		acc = accountService.selectOne(acc);
		if (acc == null) {
			throw new NullPointerException("非法请求！");
		}

		Account acc2 = new Account();
		acc2.setId(acc.getId());
		acc2.setEmailIsActive(Account.account_emailIsActive_y);
		accountService.updateDataWhenActiveAccount(acc2, acc.getAccount());

		return "activeAccount";
	}

	public String head() {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {

			String fromModule = this.getFromModule();
			if (fromModule.equals("PC")) {
				return "toPcLogin";
			}
			return toLogin;
		}

		acc = accountService.selectById(acc.getId());

		this.getRequest().setAttribute("acc", acc);
		return "head";
	}

//	public String headUpload() throws IOException, FileUploadException {
//		Account acc = redisSevice.getShopUser(getRequest());
//		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
//			String fromModule = this.getFromModule();
//			if (fromModule.equals("PC")) {
//				return "toPcLogin";
//			}
//			return toLogin;
//		}
//		acc = accountService.selectById(acc.getId());
//
//		String realPath = ServletActionContext.getServletContext().getRealPath("/");
//		Result result = new Result();
//		result.avatarUrls = new ArrayList();
//		result.success = false;
//		result.msg = "Failure!";
//		getResponse().setCharacterEncoding("UTF-8");
//		getResponse().setContentType("text/plain");
//
//		FileItemFactory factory = new DiskFileItemFactory();
//		ServletFileUpload upload = new ServletFileUpload(factory);
//		FileItemIterator fileItems = upload.getItemIterator(this.getRequest());
//		// 定义一个变量用以储存当前头像的序号
//		int avatarNumber = 1;
//		// 取服务器时间+8位随机码作为部分文件名，确保文件名无重复。
//		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmssS");
//		String fileName = simpleDateFormat.format(new Date());
//		Random random = new Random();
//		String randomCode = "";
//		for (int i = 0; i < 8; i++) {
//			randomCode += Integer.toString(random.nextInt(36), 36);
//		}
//		fileName = fileName + randomCode;
//		// 基于原图的初始化参数
//		String initParams = "";
//		BufferedInputStream inputStream;
//		BufferedOutputStream outputStream;
//		// 遍历表单域
//		while (fileItems.hasNext()) {
//			FileItemStream fileItem = fileItems.next();
//			String fieldName = fileItem.getFieldName();
//			// 是否是原始图片 file 域的名称（默认的 file 域的名称是__source，可在插件配置参数中自定义。参数名：src_field_name）
//			Boolean isSourcePic = fieldName.equals("__source");
//			// 文件名，如果是本地或网络图片为原始文件名（不含扩展名）、如果是摄像头拍照则为 *FromWebcam
//			// String name = fileItem.getName();
//			// 当前头像基于原图的初始化参数（即只有上传原图时才会发送该数据），用于修改头像时保证界面的视图跟保存头像时一致，提升用户体验度。
//			// 修改头像时设置默认加载的原图url为当前原图url+该参数即可，可直接附加到原图url中储存，不影响图片呈现。
//			if (fieldName.equals("__initParams")) {
//				inputStream = new BufferedInputStream(fileItem.openStream());
//				byte[] bytes = new byte[inputStream.available()];
//				inputStream.read(bytes);
//				initParams = new String(bytes, "UTF-8");
//				inputStream.close();
//			}
//			// 如果是原始图片 file 域的名称或者以默认的头像域名称的部分“__avatar”打头
//			else if (isSourcePic || fieldName.startsWith("__avatar")) {
//				String virtualPath = "/upload/head/jsp_avatar" + avatarNumber + "_" + fileName + ".jpg";
//
//				String savePaht = File.separator + "upload" + File.separator + "head" + File.separator + "jsp_avatar" + avatarNumber + "_" + fileName + ".jpg";
//				// 原始图片（默认的 file 域的名称是__source，可在插件配置参数中自定义。参数名：src_field_name）。
//				if (isSourcePic) {
//					result.sourceUrl = virtualPath = "/upload/head/jsp_source_" + fileName + ".jpg";
//				}
//				// 头像图片（默认的 file 域的名称：__avatar1,2,3...，可在插件配置参数中自定义，参数名：avatar_field_names）。
//				else {
//					result.avatarUrls.add(virtualPath);
//					avatarNumber++;
//				}
//				if (avatarNumber == 2) {
//					acc.setHeadpic(virtualPath);
//					accountService.update(acc);
//					getSession().setAttribute(FrontContainer.USER_INFO, acc);
//				}
//				inputStream = new BufferedInputStream(fileItem.openStream());
//				outputStream = new BufferedOutputStream(new FileOutputStream(realPath + savePaht));
//				Streams.copy(inputStream, outputStream, true);
//				inputStream.close();
//				outputStream.flush();
//				outputStream.close();
//			}
//
//		}
//		if (result.sourceUrl != null) {
//			result.sourceUrl += initParams;
//		}
//		result.success = true;
//		result.msg = "Success!";
//		/*
//		 * To Do...可在此处处理储存事项
//		 */
//		// 返回图片的保存结果（返回内容为json字符串，可自行构造，该处使用fastjson构造）
//
//		getResponse().getWriter().write(JSON.toJSONString(result));
//		return null;
//	}

//	private String doWxPost(String url, Map<String, String> params) {
//		String response = null;
//		HttpClient client = new HttpClient();
//		PostMethod method = new PostMethod(url);
//		method.setRequestHeader("ContentType", "application/x-www-form-urlencoded;charset=UTF-8");
//		// 设置Http Post数据
//		if (params != null) {
//			NameValuePair[] data = new NameValuePair[params.size()];
//			int i = 0;
//			for (Map.Entry<String, String> entry : params.entrySet()) {
//				data[i] = new NameValuePair(entry.getKey(), entry.getValue());
//				i++;
//			}
//			method.setRequestBody(data);
//		}
//		try {
//			client.executeMethod(method);
//			if (method.getStatusCode() == HttpStatus.SC_OK) {
//
//				InputStream inputStream = method.getResponseBodyAsStream();
//				BufferedReader br = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
//				StringBuffer stringBuffer = new StringBuffer();
//				String str = "";
//				while ((str = br.readLine()) != null) {
//					stringBuffer.append(str);
//				}
//				response = stringBuffer.toString();
//			}
//		} catch (IOException e) {
//		} finally {
//			method.releaseConnection();
//		}
//		System.out.println("请求返回json:" + response);
//		return response;
//	}

	public String getTypefrom() {
		return typefrom;
	}

	public void setTypefrom(String typefrom) {
		this.typefrom = typefrom;
	}

	public void setSmsService(SmsService smsService) {
		this.smsService = smsService;
	}

	public void setRedisSevice(RedisSevice redisSevice) {
		this.redisSevice = redisSevice;
	}

	
}
