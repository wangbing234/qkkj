/**
 * 2012-7-8
 * 
 */
package net.onlineshop.web.action.front.freemarker;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.freemarker.front.FreemarkerHelper;
import net.onlineshop.services.front.account.bean.Account;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

/**
 * 网站会员action
 * 
 * @author li
 * 
 */
@Scope("prototype")
@Controller("freemarkerActionFront")
public class FreemarkerAction extends BaseAction<Account> {
	private static final Logger logger = Logger.getLogger(FreemarkerAction.class);
	private static final long serialVersionUID = 1L;
	@Autowired
	private FreemarkerHelper freemarkerHelper;

	public FreemarkerHelper getFreemarkerHelper() {
		return freemarkerHelper;
	}

	public void setFreemarkerHelper(FreemarkerHelper freemarkerHelper) {
		this.freemarkerHelper = freemarkerHelper;
	}

	private String error;// 错误消息

	public String getError() {
		return error;
	}

	public void setError(String error) {
		this.error = error;
	}

	@Override
	public Account getE() {
		return this.e;
	}

	@Override
	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new Account();
		}
	}

	public String toIndex() {
		return SUCCESS;
	}

	@Override
	public void insertAfter(Account e) {
	}

	@Override
	protected void selectListAfter() {
	}

	/**
	 * 生成门户菜单
	 * 
	 * @return
	 * @throws IOException
	 */
	// @Deprecated
	// public String indexMenu() {
	// freemarkerHelper.index("indexMenu.ftl", "indexMenu.jsp");
	// return SUCCESS;
	// }

	/**
	 * 对商品的详情内容、帮助文章的内容、公告、新闻等的内容进行静态化处理。 方法是将这些大文本的内容存储未jsp的文件格式，将来访问页面的时候直接把地址链接进去就行了。
	 * 
	 * @return
	 * @throws Exception
	 */
	public String create() throws Exception {
		String method = getRequest().getParameter("method");
		logger.debug("create method = " + method);
		if (StringUtils.isBlank(method)) {

		} else if (method.equals("helps")) {
			freemarkerHelper.helps();// 所有帮助文件静态化
		} else if (method.equals("notices")) {
			freemarkerHelper.notices();// 所有公告通知静态化
		} else if (method.equals("products")) {
			String error = freemarkerHelper.products();// 所有商品描述静态化
			if (error == null) {
				getResponse().getWriter().write("success");
			} else {
				getResponse().getWriter().write("部分商品静态化失败，商品ID：" + error);
			}
			return null;
		} else if (method.equals("staticProductByID")) {
			String id = getRequest().getParameter("id");

			String response = freemarkerHelper.staticProductByID(id);// 所有商品描述静态化
			getResponse().setCharacterEncoding("utf-8");
			getResponse().getWriter().write(response);
			return null;
		} else if (method.equals("staticQProductByID")) {// 静态化抢购页
			String id = getRequest().getParameter("id");

			String response = freemarkerHelper.staticQProductByID(id);// 所有商品描述静态化
			getResponse().setCharacterEncoding("utf-8");
			getResponse().getWriter().write(response);
			return null;
		} else if (method.equals("staticNewsByID")) {
			String id = getRequest().getParameter("id");

			String response = freemarkerHelper.staticNewsByID(id);// 所有商品描述静态化
			getResponse().setCharacterEncoding("utf-8");
			getResponse().getWriter().write(response);
			return null;
		}

		getResponse().getWriter().write("success");
		return null;
		// return SUCCESS;
	}

	// public String helps(){
	// String method = getRequest().getParameter("method");
	// if(StringUtils.isBlank(method)){
	//
	// }else if(method.equals("staticNews")){
	// //生成所有的文章静态页面
	// freemarkerHelper.staticNews();
	// }else if(method.equals("staticNews")){
	// //对单个文章静态化
	// String id = getRequest().getParameter("id");
	// freemarkerHelper.staticNewsInfo(id);
	// }
	// return SUCCESS;
	// }

	/**
	 * 一键生成
	 * 
	 * @return
	 */
	// @Deprecated
	// public String createAll() {
	// indexMenu();
	// return SUCCESS;
	// }
}
