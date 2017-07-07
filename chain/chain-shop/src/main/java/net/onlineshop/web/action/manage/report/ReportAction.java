package net.onlineshop.web.action.manage.report;

import java.util.ArrayList;
import java.util.List;
import net.onlineshop.core.BaseAction;
import net.onlineshop.services.manage.account.AccountService;
import net.onlineshop.services.manage.order.OrderService;
import net.onlineshop.services.manage.orderdetail.OrderdetailService;
import net.onlineshop.services.manage.product.ProductService;

import org.slf4j.LoggerFactory;

/**
 * 报表、图表
 * 
 * 
 * 
 */
public class ReportAction extends BaseAction<ReportInfo> {
	private static final long serialVersionUID = 1L;
	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(ReportAction.class);
	private ProductService productService;
	private OrderService orderService;
	private OrderdetailService orderdetailService;
	private AccountService accountService;

	public void setOrderService(OrderService orderService) {
		this.orderService = orderService;
	}

	public void setOrderdetailService(OrderdetailService orderdetailService) {
		this.orderdetailService = orderdetailService;
	}

	public void setProductService(ProductService productService) {
		this.productService = productService;
	}

	public void setAccountService(AccountService accountService) {
		this.accountService = accountService;
	}

	protected void selectListAfter() {
		pager.setPagerUrl("/manage/ReportInfo!selectList.action");
	}

	public ReportInfo getE() {
		return this.e;
	}

	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new ReportInfo();
		}
		super.initPageSelect();
	}

	public void insertAfter(ReportInfo e) {
		e.clear();
	}

	/**
	 * 产品销售排行榜统计：图表的形式展示指定时间范围内的商品的销售情况，包括数量、金额等。
	 * 
	 * @return
	 */
	public String productSales() {
		List<ReportInfo> list = orderService.selectProductSales(e);
		this.pager.setList(list);
		return "productSales";
	}

	/**
	 * 销量统计：统计选择的时间范围内的销量情况。
	 * 
	 * @return
	 */
	public String orderSales() {
		List<ReportInfo> list = orderService.selectOrderSales(e);
		getRequest().setAttribute("list", list);
		return "orderSales";
	}

	public String userSales() {
		String type = getRequest().getParameter("type");
		getRequest().setAttribute("type", type);
		List<ReportInfo> list = new ArrayList<ReportInfo>();
		if ("1".equals(type)) {
			list = accountService.selectUserSales(e);
			getRequest().setAttribute("list", list);
			getRequest().setAttribute("size", list.size());
			return "userSales";
		} else {
			list = accountService.selectRegisterSales(e);
			getRequest().setAttribute("list", list);
			getRequest().setAttribute("size", list.size());
			return "registerSales";
		}
	}
}
