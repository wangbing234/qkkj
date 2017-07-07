package net.onlineshop.core.interceptor;


import java.io.PrintWriter;
import java.io.StringWriter;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.StrutsStatics;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

import net.onlineshop.core.FrontContainer;
import net.onlineshop.core.util.RedisSevice;

/**
 * 前台拦截器，负责对前台404,、500、action访问产生的异常进行拦截处理
 * 
 */
public class FrontInterceptor extends AbstractInterceptor {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory.getLogger(ManageInterceptor.class);
	public static final String error = "error";// 访问action异常

	public String intercept(ActionInvocation actionInvocation) throws Exception {
		logger.info("FrontInterceptor intercept...");
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpSession session = request.getSession();
		ActionContext actionContext = actionInvocation.getInvocationContext();
		ServletContext context = (ServletContext) actionContext.get(StrutsStatics.SERVLET_CONTEXT);
		ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(context);
		RedisSevice redisSevice = (RedisSevice) ctx.getBean("redisSevice");
		Boolean isAccess = redisSevice.checkToken(request);
		logger.info("token validate isAccess:"+isAccess); 
//		HttpServletResponse response = ServletActionContext.getResponse();
//		String path = request.getRequestURL().toString();
//		path.substring(0, path.indexOf(":",path.indexOf(":", 0)+1)+6);
//		/**
//		 *---------------------------------------------------------------------------------------测试代码开始
//		 */
//		if("pc".equals(request.getParameter("type")))
//		{
//			session.setAttribute("_type", "pc");
//		}
//		// 模拟微信客户端
//		//		if(true){
//		if ("weixin".equals(session.getAttribute("_type")) || ("/product!index.action".equals(servletPath) && "weixin".equals(request.getParameter("type")))) {
//			//设置用户信息
//			ActionContext actionContext = actionInvocation.getInvocationContext();
//			ServletContext context = (ServletContext) actionContext.get(StrutsStatics.SERVLET_CONTEXT);
//			ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(context);
//			AccountDao accountDao = (AccountDao) ctx.getBean("accountDaoFront");
//			Account acc = new Account();
//			acc.setId(5+"");
//			acc = accountDao.selectById(acc.getId());
//			session.setAttribute("session_openid", 1111);
//			session.setAttribute("_type", "weixin");
//			session.setAttribute(FrontContainer.USER_INFO, acc);
//			//设置手机方式
//			session.setAttribute("fromModule", "MOBILE");
//			return actionInvocation.invoke();
//		}
		/**
		 *---------------------------------------------------------------------------------------测试代码结束
		 */
		
//		// 微信判断入口
//		if (path.equals("m.xqylife.com")) {
//			ActionContext actionContext = actionInvocation.getInvocationContext();
//			ServletContext context = (ServletContext) actionContext.get(StrutsStatics.SERVLET_CONTEXT);
//			ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(context);
//			AccountDao accountDao = (AccountDao) ctx.getBean("accountDaoFront");
//			logger.info("移动域名" + path);
//			session.setAttribute("fromModule", "MOBILE");
//			String session_openid = (String) session.getAttribute("session_openid");
//			// 如果未授权，则开始授权
//			if (session_openid == null || "".equals(session_openid)) {
//				String code = request.getParameter("code");
//				String state = request.getParameter("state");
//				if (StringUtils.isNotEmpty(code) && state != null && "wukezhou1513".equals(state)) {
//					AccessToken accessToken = WeixinUtils.getNetAccessToken(WeixinUtils.appid, WeixinUtils.appsecret, code);
//					if (accessToken != null) {
//						String openid = accessToken.getOpenid();
//						String token = accessToken.getToken();
//						String user_url = WeixinUtils.net_user_info_url.replace("ACCESS_TOKEN", token).replace("OPENID", openid);
//						WeixinUsers userInfo = new WeixinUsers();
//						JSONObject jsonObject = WeixinUtils.httpRequest(user_url, "GET", null);
//
//						if (jsonObject != null) {
//							userInfo.setNickname(FilterStr.filter(jsonObject.getString("nickname")));
//							userInfo.setHeadimgurl(jsonObject.getString("headimgurl") == null ? "/mobile/images/tx.jpg" : jsonObject.getString("headimgurl"));
//							userInfo.setOpenid(jsonObject.getString("openid"));
//							Account acc = new Account();
//							acc.setOpenId(openid);
//							acc = accountDao.selectOne(acc);
//
//							if (acc == null) {
//								session.setAttribute("session_openid", openid);
//								session.setAttribute("nikeName", userInfo.getNickname());
//								session.setAttribute("headimgurl", userInfo.getHeadimgurl());
//								// response.setContentType("text/plain");
//								// response.sendRedirect("/bind.html");
//								// return null;
//								session.removeAttribute(FrontContainer.USER_INFO);
//							} else {
//								acc.setAccessToken(token);
//								acc.setHeadpic(userInfo.getHeadimgurl());
//								acc.setNickname(FilterStr.filter(userInfo.getNickname()));
//								session.setAttribute("session_openid", openid);
//								session.setAttribute(FrontContainer.USER_INFO, acc);
//							}
//						}
//						response.sendRedirect("/");
//						return null;
//					}
//				} else {
//					String uri = request.getRequestURI();
//					String appid = WeixinUtils.appid;
//
//					if (uri.equals("/account!user.action")) {
//						backUri = backUri + "/user/user.html";
//					}
//					// 授权后要跳转的链接所需的参数一般有会员号，金额，订单号之类，
//					// 最好自己带上一个加密字符串将金额加上一个自定义的key用MD5签名或者自己写的签名,
//					// 比如 Sign = %3D%2F%CS%
//					// URLEncoder.encode 后可以在backUri 的url里面获取传递的所有参数
//					backUri = URLEncoder.encode(backUri);
//					String requestUrl = WeixinUtils.net_oauth_url.replace("APPID", appid).replace("REDIRECT_URI", backUri).replace("SCOPE", "snsapi_userinfo").replace("STATE", "wukezhou1513");
//					response.sendRedirect(requestUrl);
//					return null;
//				}
//
//			} else {
//				String uri = request.getRequestURI();
//				if (uri.equals("/account!bind.action")) {
//					return actionInvocation.invoke();
//				}
//			}
//
//		}
//		// 否则是电脑PC端
//		else 
//		{
//			session.setAttribute("fromModule", "PC");
//			logger.info("PC域名" + path);
//		}

		try {
//			String gzid = request.getParameter("gzid");
//			if (StringUtils.isNotEmpty(gzid)) {
//				session.setAttribute(FrontContainer.gzid, gzid);
//				session.setAttribute(FrontContainer.orderFrom, this.getRequestURIWithParam(request));
//			}
//			if (session.getAttribute(FrontContainer.orderFrom) == null) {
//				session.setAttribute(FrontContainer.orderFrom, this.getRequestURIWithParam(request));
//			}
			return actionInvocation.invoke();

		} catch (Throwable e) {
			e.printStackTrace();
			String msg = e.getMessage();
			logger.debug("msg=" + msg);
			if (StringUtils.isNotBlank(msg)) {
				session.setAttribute(FrontContainer.action_exception_error, msg);
			} else {
				session.setAttribute(FrontContainer.action_exception_error, "未知！");
			}

			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			session.setAttribute(FrontContainer.action_exception_stack_error, sw.getBuffer().toString());
		}
		return error;
	}

	/**
	 * 通过Request的参数，获取URL
	 * @param request
	 * @return
	 */
	private String getRequestURIWithParam(HttpServletRequest request) {
		return request.getRequestURI() + (request.getQueryString() == null ? "" : "?" + request.getQueryString());
	}

	@Deprecated
	private String intercept0(ActionInvocation actionInvocation) throws Exception {
		String actionName = actionInvocation.getProxy().getActionName();
		Object action = actionInvocation.getProxy().getAction();
		String method = actionInvocation.getProxy().getMethod();
		String namespace = actionInvocation.getProxy().getNamespace();
		Object action2 = actionInvocation.getAction();
		logger.debug("========CommonInterceptor interceptor! actionName=" + actionName + ";action=" + action + ";method=" + method + ";namespace=" + namespace + ";action2=" + action2);
		return actionInvocation.invoke();
	}

}
