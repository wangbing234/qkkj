package net.onlineshop.web.action.front.product;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.FrontContainer;
import net.onlineshop.core.Services;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.core.front.SystemManager;
import net.onlineshop.core.sms.SMSWebChinese;
import net.onlineshop.core.util.DateUtil;
import net.onlineshop.services.front.account.AccountService;
import net.onlineshop.services.front.account.bean.Account;
import net.onlineshop.services.front.catalog.bean.Catalog;
import net.onlineshop.services.front.comment.CommentService;
import net.onlineshop.services.front.comment.bean.Comment;
import net.onlineshop.services.front.product.ProductService;
import net.onlineshop.services.front.product.bean.Product;
import net.onlineshop.services.manage.sms.SmsService;
import net.onlineshop.services.manage.sms.bean.Sms;
import net.onlineshop.services.manage.spec.SpecService;
import net.onlineshop.services.manage.spec.bean.Spec;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.opensymphony.xwork2.Action;

public class ApiAction implements Action {
	private String c;
	private String a;
	private CommentService commentService;// 评论服务
	private SmsService smsService;
	private SpecService specService;
	private AccountService accountService;
	private ProductService productService;// 商品服务
	private String type;
	protected PagerModel pager = new PagerModel();
	private  final Logger logger = LoggerFactory.getLogger(this.getClass());
	@Override
	public String execute() throws Exception {
		// 分类
		if (a != null && "getMobileCate".equals(a)) {
			this.printJson(getMobileCate());
		}
		// 评论
		else if (a != null && "getComment".equals(a)) {
			String pid = this.getRequest().getParameter("pid");
			this.printJson(getComment(pid));
		}
		// 抢购评论
		else if (a != null && "getQComment".equals(a)) {
			String pid = this.getRequest().getParameter("pid");
			this.printJson(getQComment(pid));
		}
		// 规格说明
		else if (a != null && "getSpec".equals(a)) {
			String pid = this.getRequest().getParameter("pid");
			this.printJson(getSpec(pid));
		}

//		if (a != null && "checkMobile".equals(a)) {
//			String mobile = this.getRequest().getParameter("mobile");
//			this.printJson(checkMobile(mobile));
//		}

		else if (a != null && "checkCode".equals(a)) {
			this.printJson(checkCode());
		}
		else if (a != null && "getStock".equals(a)) {
			String sid = this.getRequest().getParameter("sid");
			this.printJson(getStock(sid));
		}
		else if (a != null && "getProductParameter".equals(a)) {
			String pid = this.getRequest().getParameter("pid");
			this.printJson(getProductParameter(pid));
		}
		else if (a != null && "getProduct".equals(a)) {
			String pid = this.getRequest().getParameter("pid");
			this.printSuccess(getProductParameter(pid));
		}
		else if (a != null && "getSellCount".equals(a)) {
			String pid = this.getRequest().getParameter("pid");
			getSellCount(pid);
		}
		return null;
	}

	private String getSellCount(String pid) throws IOException {
		Product product = productService.selectById(pid);
		if (product != null) {
			int count = product.getSellcount();
			Double sheng = Double.valueOf(product.getPrice()) - Double.valueOf(product.getNowPrice());
			DecimalFormat df = new DecimalFormat("#,##0");

			double zhe = Double.valueOf(product.getNowPrice()) / Double.valueOf(product.getPrice()) * 10;
			this.printJson("{\"mess\":0,\"count\":" + count + ",\"price\":\"" + df.format(Double.parseDouble(product.getPrice())) + "\",\"nowPrice\":\"" + df.format(Double.parseDouble(product.getNowPrice())) + "\",\"zhe\":" + df.format(zhe) + ",\"sheng\":\"" + df.format(sheng) + "\"}");

			return null;
		} else {
			this.printJson("{\"mess\":1}");
			return null;
		}

	}

	private String getMobileCate() {
		StringBuffer stringbef = new StringBuffer("<ul class=\"olexon-modal-cate olexon-modal-cate-home\">");
		List<Catalog> catalogs = SystemManager.catalogs;
		stringbef.append("<li class=\"item0\"><strong ><a href=\"/catalog/productList.html\">全部</a></strong>");
		stringbef.append("<span style=\"display:block;\"><ul></ul>");
		for (int i = 0; i < catalogs.size(); i++) {

			stringbef.append("<li class=\"item" + (i + 1) + "\">");
			if (i == 0) {
				stringbef.append("<strong class=\"current\" onclick=\"olexonMobileV3.toggleCateHandle(this)\">");
				stringbef.append("<a href=\"javascript:void(0)\">" + catalogs.get(i).getName() + "</a></strong>");

				stringbef.append("<span style=\"display:block;\"><ul>");
			} else {
				stringbef.append("<strong  onclick=\"olexonMobileV3.toggleCateHandle(this)\">");
				stringbef.append("<a href=\"javascript:void(0)\">" + catalogs.get(i).getName() + "</a></strong>");

				stringbef.append("<span style=\"display:none;\"><ul>");
			}

			List<Catalog> catalogsc = catalogs.get(i).getChildren();
			if (catalogsc != null) {
				for (int j = 0; j < catalogsc.size(); j++) {
					stringbef.append("<li><a href=\"/catalog/" + catalogsc.get(j).getCode() + ".html\"><img src=\"" + catalogsc.get(j).getPicurl160() + "\"></a>");
					stringbef.append("<p><a href=\"/catalog/" + catalogsc.get(j).getCode() + ".html\">" + catalogsc.get(j).getName() + "</a></p></li>");
				}
			} else {

				stringbef.append("<p style=\"padding:12px;font-size:14px;text-align:center;\">该类目暂无商品...</p>");

			}
			stringbef.append("</ul></span>");

			stringbef.append("</li>");
		}
		stringbef.append("</ul>");

		return stringbef.toString();

	}

	private String getComment(String pid) throws Exception {
		// 加载指定商品的评论
		Comment comment = new Comment();
		comment.setProductID(pid);
		PagerModel commentPager = selectPagerModelByServices(commentService, comment);
		getRequest().setAttribute("commentPager", commentPager);
		pager = commentPager;// 公用分页控件需要这么写。
		return JSON.toJSONString(commentPager);
	}

	private String getQComment(String pid) throws Exception {
		// 抢购评论
		Comment comment = new Comment();
		comment.setProductID(pid);
		comment.setStatus("p");
		PagerModel listp = commentService.selectMyPageList(comment);
		List<Comment> list = listp.getList();
		StringBuffer stringbef = new StringBuffer("<ul>");
		for (Comment c : list) {
			stringbef.append("<li>" + c.getNickname() + ":" + c.getContent() + "</li>");
		}
		stringbef.append("</ul>");
		return stringbef.toString();
	}

	private String getProductParameter(String pid) {
		List<Product> plist = productService.selectParameterList(pid);
		StringBuffer stringbef = new StringBuffer("");

		for (Product p : plist) {

			stringbef.append("<li><span class=\"attr\">" + p.getName() + " ：</span><span>" + p.getValue() + "</span></li>");
		}

		return stringbef.toString();
	}

	/**
	 * 获得商品样式
	 * 
	 * @return
	 */
	private String getSpec(String pid) {
		Product product = new Product();

		Spec spec = new Spec();
		spec.setProductID(pid);
		List<Spec> specList = specService.selectList(spec);
		List<Spec> newspecList = new ArrayList<Spec>();

		if (specList != null && specList.size() > 0) {

			for (int i = 0; i < specList.size(); i++) {
				if (specList.get(i).getSpecStatus().equals("y")) {
					newspecList.add(specList.get(i));
				}
			}

			product.setSpecJsonString(JSON.toJSONString(newspecList));

			// Set<String> specColor = new HashSet<String>();
			// Set<String> specSize = new HashSet<String>();

			if (product.getSpecColor() == null) {
				product.setSpecColor(new ArrayList<Spec>());

			}
			if (product.getSpecSize() == null) {
				product.setSpecSize(new HashSet<String>());
			}
			List<String> specColor = new ArrayList<String>();

			// 分离商品的尺寸和颜色
			for (int i = 0; i < newspecList.size(); i++) {
				Spec specItem = newspecList.get(i);

				if (StringUtils.isNotBlank(specItem.getSpecColor())) {

					if (specColor.size() == 0) {
						product.getSpecColor().add(specItem);
						System.out.println(specItem.getSpecColor() + "-------------------------------------");
						specColor.add(specItem.getSpecColor());
					}
					if (specColor.indexOf(specItem.getSpecColor()) == -1) {
						product.getSpecColor().add(specItem);
						System.out.println(specItem.getSpecColor() + "-------------------------------------");
						specColor.add(specItem.getSpecColor());
					}

				}
				if (StringUtils.isNotBlank(specItem.getSpecSize())) {
					product.getSpecSize().add(specItem.getSpecSize());
				}
			}
		}

		return JSON.toJSONString(product);
	}

//	public String checkMobile(String mobile) throws Exception {
//		Sms sms = new Sms();
//		if (c == null || "".equals(c)) {
//
//			return "{\"mess\":-2000}";
//		}
//		if (c.equals("REG")) {
//			Account e = new Account();
//			e.setTel(mobile);
//			e.setMobileIsActive("y");
//			Account acc = accountService.selectOne(e);
//			if (acc != null) {
//
//				return "{\"mess\":-1000}";
//			}
//
//		}
//
//		else if (c.equals("FIND_PWD")) {
//			Account e = new Account();
//			e.setAccount(mobile);
//
//			Account acc = accountService.login(e);
//			// 账号不存在
//			if (acc == null) {
//
//				return "{\"mess\":-1000}";
//			}
//
//		}
//
//		Random random = new Random();
//		Integer x = random.nextInt(8999);
//
//		x = x + 1000;
//
//		sms.setPhone(mobile);
//		sms.setContent("尊敬的用户，您的校验码为：" + x.toString() + "，30分钟内有效。");
//		sms.setSendStatus(x.toString());
//		sms.setType("CHECK_CODE");
//		sms = SMSWebChinese.sendSMS(sms);
//		sms.setOk(true);
//		sms.setSendTime(DateUtil.dateFormat(new Date()));
//		smsService.insert(sms);
//
//		this.getRequest().getSession().setAttribute(FrontContainer.validateCode, x.toString());
//
//		return "{\"mess\":" + sms.getReturnCode() + "}";
//	}

	public String checkCode() throws Exception {
		String yancode = this.getRequest().getParameter("vcode");
		String mobile = this.getRequest().getParameter("mobile");
		Sms e = new Sms();
		e.setPhone(mobile);
		e.setSendStatus(yancode);
		List<Sms> mmlist = smsService.selectList(e);
		String result = "{\"mess\":" + 4 + "}";
		Sms mm = null;
		if (mmlist != null && mmlist.size() > 0) {
			mm = mmlist.get(0);
		}

		if (mm != null) {
			if (!mm.isOk()) {
				// 验证码已使用
				result = "{\"mess\":" + 2 + "}";

			} else if (!mm.unPassWay()) {
				// 验证码过期
				result = "{\"mess\":" + 3 + "}";

			} else {
				result = "{\"mess\":" + 1 + "}";
			}
		} else {
			// 验证码错误
			result = "{\"mess\":" + 4 + "}";
		}

		return result;
	}

	private String getStock(String sid) {

		Spec spec = specService.selectById(sid);
		return JSON.toJSONString(spec);
	}

	public String getC() {
		return c;
	}

	public void setC(String c) {
		this.c = c;
	}

	public String getA() {
		return a;
	}

	public void setA(String a) {
		this.a = a;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
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
		printJson(JSON.toJSONString(json));
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

	public void setCommentService(CommentService commentService) {
		this.commentService = commentService;
	}

	public PagerModel selectPagerModelByServices(Services services, PagerModel pm) throws Exception {
		if (services == null || pm == null) {
			throw new NullPointerException();
		} else {
			// pm.clear();
		}

		int offset = 0;
		String pagerOffset = this.getRequest().getParameter("pager.offset");
		if (StringUtils.isNotBlank(pagerOffset)) {
			// throw new NullPointerException();
			offset = Integer.parseInt(pagerOffset);
		}
		if (offset < 0)
			offset = 0;
		pm.setOffset(offset);
		PagerModel servicesPager = services.selectPageList(pm);
		if (servicesPager == null)
			servicesPager = new PagerModel();
		// 计算总页数
		servicesPager.setPagerSize((servicesPager.getTotal() + servicesPager.getPageSize() - 1) / servicesPager.getPageSize());
		return servicesPager;
	}

	public HttpServletRequest getRequest() {
		return ServletActionContext.getRequest();
	}

	public HttpServletResponse getResponse() {
		return ServletActionContext.getResponse();
	}

	public PagerModel getPager() {
		return pager;
	}

	public void setPager(PagerModel pager) {
		this.pager = pager;
	}

	public void setSpecService(SpecService specService) {
		this.specService = specService;
	}

	public void setSmsService(SmsService smsService) {
		this.smsService = smsService;
	}

	public void setAccountService(AccountService accountService) {
		this.accountService = accountService;
	}

	public void setProductService(ProductService productService) {
		this.productService = productService;
	}

}
