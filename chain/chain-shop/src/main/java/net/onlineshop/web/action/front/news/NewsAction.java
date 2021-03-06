package net.onlineshop.web.action.front.news;

import java.util.List;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.FrontContainer;
import net.onlineshop.services.front.news.NewsService;
import net.onlineshop.services.front.news.bean.News;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 文章管理
 * 
 * 
 * 
 */
public class NewsAction extends BaseAction<News> {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = LoggerFactory.getLogger(NewsAction.class);
	private NewsService newsService;
	private String helpCode;
	private News news;

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

	public NewsService getNewsService() {
		return newsService;
	}

	public void setNewsService(NewsService newsService) {
		this.newsService = newsService;
	}

	@Override
	public News getE() {
		return this.e;
	}

	@Override
	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new News();
		}
	}

	@Override
	public void insertAfter(News e) {
	}

	@Override
	protected void selectListAfter() {
		pager.setPagerUrl("news!selectList.action");
	}

	/**
	 * 发展历史
	 * 
	 * @return
	 */
	public String history() {
		News query = new News();
		query.setCatalogID("29");
		List<News> list = newsService.selectList(query);
		getRequest().setAttribute("list", list);
		String fromModule = this.getFromModule();
		if (fromModule.equals("PC")) {
			return "pc_history";
		}

		return "history";
	}

	/**
	 * 获取新闻详情
	 * 
	 * @return
	 */
	public String newsInfo() throws Exception {

		super.setSelectMenu(FrontContainer.not_select_menu);// 设置主菜单为不选中

		String id = getRequest().getParameter("id");
		logger.debug("NewsAction.newsInfo=== id=" + id);
		if (StringUtils.isBlank(id)) {
			throw new NullPointerException("id is null");
		}

		// e = newsService.selectById(id);

		News newsParam = new News();
		newsParam.setId(id);
		e = newsService.selectSimpleOne(newsParam);
		if (e == null) {
			throw new NullPointerException();
		}

		String url = "/jsp/notices/" + e.getId() + ".jsp";
		logger.debug("url = " + url);
		getRequest().setAttribute("newsInfoUrl", url);

		return "newsInfo";
	}

	/**
	 * 帮助中心
	 * 
	 * @return
	 */
	public String help() throws Exception {

		super.setSelectMenu(FrontContainer.not_select_menu);// 设置主菜单为不选中

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

			String fromModule = this.getFromModule();
			if (fromModule.equals("PC")) {

				return "pc_help";

			}

			return "help";
		}
	}
}
