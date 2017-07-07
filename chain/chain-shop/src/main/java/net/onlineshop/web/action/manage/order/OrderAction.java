package net.onlineshop.web.action.manage.order;

import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.hssf.usermodel.HSSFFont;
import org.apache.poi.hssf.usermodel.HSSFRichTextString;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.hssf.util.HSSFColor;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.qq.connect.utils.json.JSONException;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.KeyValueHelper;
import net.onlineshop.core.KuaiDi;
import net.onlineshop.core.ManageContainer;
import net.onlineshop.core.exception.UpdateOrderStatusException;
import net.onlineshop.core.front.SystemManager;
import net.onlineshop.core.listener.CoreParamCache;
import net.onlineshop.core.pay.alipay.alipayescow.util.httpClient.HttpTookit;
import net.onlineshop.core.system.bean.User;
import net.onlineshop.core.util.AddressUtils;
import net.onlineshop.core.util.CnUpperCaser;
import net.onlineshop.core.util.DateUtil;
import net.onlineshop.services.front.account.AccountService;
import net.onlineshop.services.front.account.bean.Busi;
import net.onlineshop.services.front.area.bean.Area;
import net.onlineshop.services.manage.account.bean.Account;
import net.onlineshop.services.manage.account.dao.AccountDao;
import net.onlineshop.services.manage.order.OrderService;
import net.onlineshop.services.manage.order.bean.Order;
import net.onlineshop.services.manage.order.bean.OrderQuery;
import net.onlineshop.services.manage.orderdetail.OrderdetailService;
import net.onlineshop.services.manage.orderdetail.bean.Orderdetail;
import net.onlineshop.services.manage.orderlog.OrderlogService;
import net.onlineshop.services.manage.orderlog.bean.Orderlog;
import net.onlineshop.services.manage.orderpay.OrderpayService;
import net.onlineshop.services.manage.orderpay.bean.Orderpay;
import net.onlineshop.services.manage.ordership.OrdershipService;
import net.onlineshop.services.manage.ordership.bean.Ordership;
import net.onlineshop.services.manage.product.ProductService;
import net.onlineshop.services.manage.product.bean.Product;
import net.onlineshop.services.manage.spec.SpecService;
import net.onlineshop.services.manage.spec.bean.Spec;

/**
 * 订单管理
 * 
 * @author
 * 
 */
public class OrderAction extends BaseAction<Order> {
	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(OrderAction.class);
	private static final long serialVersionUID = 1L;
	private OrderService orderService;
	private AccountService accountService;
	private AccountDao accountDaoManage;
	private OrderpayService orderpayService;
	private OrdershipService ordershipService;
	private OrderdetailService orderdetailService;
	private ProductService productService;
	private OrderlogService orderlogService;
	private String expressCompanyName;
	private SpecService specService;
	private File file;
	private String fileName;
	// private Order order;
	private List<Orderdetail> orderdetailList;// 订单项列表
	private String optionMsg;// 操作消息提示
	private List<net.onlineshop.services.front.area.bean.Area> areaList;// 区域列表

	public List<Area> getAreaList() {
		return areaList;
	}

	public void setAccountService(AccountService accountService) {
		this.accountService = accountService;
	}

	public void setAreaList(List<Area> areaList) {
		this.areaList = areaList;
	}

	public OrderlogService getOrderlogService() {
		return orderlogService;
	}

	public void setOrderlogService(OrderlogService orderlogService) {
		this.orderlogService = orderlogService;
	}

	public String getOptionMsg() {
		return optionMsg;
	}

	public void setOptionMsg(String optionMsg) {
		this.optionMsg = optionMsg;
	}

	public OrdershipService getOrdershipService() {
		return ordershipService;
	}

	public void setOrdershipService(OrdershipService ordershipService) {
		this.ordershipService = ordershipService;
	}

	public OrderpayService getOrderpayService() {
		return orderpayService;
	}

	public void setOrderpayService(OrderpayService orderpayService) {
		this.orderpayService = orderpayService;
	}

	public ProductService getProductService() {
		return productService;
	}

	public void setProductService(ProductService productService) {
		this.productService = productService;
	}

	public OrderdetailService getOrderdetailService() {
		return orderdetailService;
	}

	public void setOrderdetailService(OrderdetailService orderdetailService) {
		this.orderdetailService = orderdetailService;
	}

	public List<Orderdetail> getOrderdetailList() {
		return orderdetailList;
	}

	public void setOrderdetailList(List<Orderdetail> orderdetailList) {
		this.orderdetailList = orderdetailList;
	}

	public OrderService getOrderService() {
		return orderService;
	}

	protected void selectListAfter() {
		pager.setPagerUrl("/manage/order!selectList.action");
	}

	public void setOrderService(OrderService orderService) {
		this.orderService = orderService;
	}

	public Order getE() {
		return this.e;
	}

	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new Order();
		}
		super.initPageSelect();

		// if(areaList!=null){
		// for(int i=0;i<areaList.size();i++){
		// areaList.get(i).clear();
		// }
		// areaList.clear();
		// areaList = null;
		// }
	}

	public void insertAfter(Order e) {
		e.clear();
	}
	
	protected void setPageParms() throws Exception 
	{
		if(StringUtils.isNotEmpty(e.getNickname()))
		{
			String nickname=new String(e.getNickname().getBytes("ISO-8859-1"),"utf-8");
			e.setNickname(nickname);
		}
		if(StringUtils.isNotEmpty(e.getShipname()))
		{
			String getShipname=new String(e.getShipname().getBytes("ISO-8859-1"),"utf-8");
			e.setShipname(getShipname);
		}
	}

	/**
	 * 加载订单列表
	 */
	public String selectList() throws Exception {
		logger.debug("加载订单列表 selectList()...");
		if (init != null && "y".equals(init)) {
			String date = DateUtil.dateFormat(new Date(), DateUtil.SHORT_MODEL);
			Date bf = DateUtil.getDateAfter(new Date(), -7);
			e.setStartDate(DateUtil.dateFormat(bf, DateUtil.SHORT_MODEL));
			e.setEndDate(date);
		}


		super.selectList();

		if (pager.getList() != null) {
			List<Order> aa = new ArrayList<Order>();
			// 订单状态中文化显示。
			for (int i = 0; i < pager.getList().size(); i++) {
				Order item = (Order) pager.getList().get(i);
				if (Order.order_status_init.equals(item.getStatus()) && Order.order_paystatus_n.equals(item.getPaystatus())) {
					item.setStatusStr("待付款");
				} else {
					item.setStatusStr(KeyValueHelper.get("order_status_" + item.getStatus()));
				}
				item.setPaystatusStr(KeyValueHelper.get("order_paystatus_" + item.getPaystatus()));
				Ordership ordership = new Ordership();
				ordership.setOrderid(item.getId());
				ordership = ordershipService.selectOne(ordership);
				item.setOrdership(ordership);
				// 加载订单项列表 以及 产品信息
				Orderdetail orderdetail = new Orderdetail();
				orderdetail.setOrderID(Integer.valueOf(item.getId()));
				if(Busi.YES.equals(e.getFiter())) {
					orderdetail.setExpressCompanyName(e.getExpressCompanyName());
					orderdetail.setExpressNo(e.getExpressNo());
					orderdetail.setSupplierId(e.getSupplierId());
					orderdetail.setStatus(e.getSstatus());
					orderdetail.setProductName(e.getProductName());
					orderdetail.setShortName(e.getShortName());
				}
				orderdetailList = orderdetailService.selectList(orderdetail);
				if (orderdetailList == null) {
					throw new NullPointerException("查询不到订单明细信息！");
				}
				item.setOrderdetail(orderdetailList);
				aa.add(item);
			}
			pager.setList(aa);
		}

		return toList;
	}

	/**
	 * 退款管理、退货管理 页面必须直接显示与退款、退款状态相一致的数据
	 */
	@Override
	protected void setParamWhenInitQuery() {
		String refundStatus = getRequest().getParameter("refundStatus");
		String status = getRequest().getParameter("status");
		String paystatus = getRequest().getParameter("paystatus");
		// String notCancel = getRequest().getParameter("notCancel");
		logger.debug("refundStatus=" + refundStatus + ",status=" + status + ",paystatus=" + paystatus);

		if (StringUtils.isNotBlank(refundStatus)) {
			e.setRefundStatus(refundStatus);
		}
		if (StringUtils.isNotBlank(status)) {
			e.setStatus(status);
		}
		if (StringUtils.isNotBlank(paystatus)) {
			e.setPaystatus(paystatus);
		}
	}

	/**
	 * 订单打印功能
	 * 
	 * @return
	 * @throws Exception
	 */
	public String toPrint() throws Exception {
		if (StringUtils.isBlank(e.getId())) {
			throw new NullPointerException("订单ID不能为空！");
		}

		// 加载指定的订单信息
		e = orderService.selectById(e.getId());

		// 加载收货人地址信息
		Ordership ordership = new Ordership();
		ordership.setOrderid(e.getId());
		ordership = ordershipService.selectOne(ordership);
		if (ordership == null) {
			throw new NullPointerException("系统查询不到收货人地址信息！");
		}
		e.setOrdership(ordership);

		// 加载订单项列表 以及 产品信息
		Orderdetail orderdetail = new Orderdetail();
		orderdetail.setOrderID(Integer.valueOf(e.getId()));
		orderdetailList = orderdetailService.selectList(orderdetail);
		if (orderdetailList == null) {
			throw new NullPointerException("查询不到订单明细信息！");
		}
		e.setOrderdetail(orderdetailList);
		return "toPrint";
	}

	/**
	 * 查看订单详细信息
	 */
	public String toEdit() throws Exception {
		if (StringUtils.isBlank(e.getId())) {
			throw new NullPointerException("订单ID不能为空！");
		}

		// 加载指定的订单信息
		e = orderService.selectOne(getE());
		if (e == null) {
			throw new NullPointerException("根据订单ID查询不到订单！");
		}

		// 订单各种状态 中文化。这样做是为了考虑到以后国际化的需要
		if (StringUtils.isNotBlank(e.getStatus())) {
			e.setStatusStr(KeyValueHelper.get("order_status_" + e.getStatus()));
		}
		if (StringUtils.isNotBlank(e.getRefundStatus())) {
			e.setRefundStatusStr(KeyValueHelper.get("order_refundStatus_" + e.getRefundStatus()));
		}
		if (StringUtils.isNotBlank(e.getPaystatus())) {
			e.setPaystatusStr(KeyValueHelper.get("order_paystatus_" + e.getPaystatus()));
		}

		// 加载支付记录
		Orderpay orderpay = new Orderpay();
		orderpay.setOrderid(e.getId());
		e.setOrderpayList(orderpayService.selectList(orderpay));

		// 加载订单配送记录
		e.setOrdership(ordershipService.selectOne(new Ordership(e.getId())));

		// 加载订单项列表 以及 产品信息
		Orderdetail orderdetail = new Orderdetail();
		orderdetail.setOrderID(Integer.valueOf(getE().getId()));
		orderdetailList = orderdetailService.selectList(orderdetail);
		if (orderdetailList == null || orderdetailList.size() == 0) {
			throw new NullPointerException("订单数据异常，订单未包含任何订单项数据！");
		}
		e.setOrderdetail(orderdetailList);

		// 检查此订单是否含赠品
		for (int i = 0; i < e.getOrderdetail().size(); i++) {
			Orderdetail item = e.getOrderdetail().get(i);
			if (StringUtils.isNotBlank(item.getGiftID())) {
				e.setHasGift(true);
				break;
			}
		}
//		if (e.getExpressCompanyName() != null) {
//			String realCompany = SystemManager.manageExpressMap.get(e.getExpressCompanyName());
//			this.getRequest().setAttribute("realCompany", realCompany);
//		}
		Account ac=new Account();
		ac.setAccount(e.getAccount());
		Account userAccount=accountDaoManage.selectOne(ac);
		if(userAccount!=null)
		{
			e.setNickname(userAccount.getDoNickname());
		}
		// 加载订单支付日志记录
		if (StringUtils.isNotBlank(e.getId())) {
			e.setOrderlogs(orderlogService.selectList(new Orderlog(e.getId())));
			if (e.getOrderlogs() == null) {
				e.setOrderlogs(Collections.EMPTY_LIST);
			}
			logger.debug(">>>orderlogs.size=" + e.getOrderlogs().size());
		}

		return toEdit;
	}

//	/**
//	 * 后台添加订单支付记录
//	 * 
//	 * @return
//	 * @throws Exception
//	 */
//	public  String  insertOrderpay() throws Exception {
//		logger.debug(">>>addOrderpay...orderid=" + e.getId());
//		if (StringUtils.isBlank(e.getId())) {
//			throw new NullPointerException(ManageContainer.OrderAction_param_null);
//		}
//		//确认订单
//		if(Order.order_status_sure.equals(e.getType()))
//		{
//			checkStatus1();
//			e.getOrderpay().setOrderid(e.getId());// 订单ID
//			e.getOrderpay().setTradeNo("tradeNoTest");
//			e.getOrderpay().setPaystatus(Orderpay.orderpay_paystatus_y);// 假设支付成功
//			orderpayService.update(e.getOrderpay());
////			getRequest().getSession().setAttribute("optionMsg", "添加支付记录成功！");
//			//确认打款截图
//			String account=accountService.updateOpenStatusToPass(e);
//			HttpTookit.sendGet(CoreParamCache.getInstance().get("noticeConfirmOpen")+account);
//			logger.debug(">>>短信发送成功,account:"+account+"OrderId:" + e.getId());
//		}
//		//假单
//		else{
//			logger.debug(">>>假单=" + e.getId());
//			e.getOrderpay().setOrderid(e.getId());// 订单ID
//			e.getOrderpay().setPaystatus(Orderpay.orderpay_paystatus_n);// 支付支付成功
//			orderpayService.update(e.getOrderpay());
//			getRequest().getSession().setAttribute("optionMsg", "添加假单！");
//			accountService.cancalOrder(e.getId(),false);
//		}
//		toEdit2();
//		return null;
//	}
	
	/**
	 * 客户取消订单
	 * @throws Exception
	 */
	public void cancelOrder() throws Exception {
		String errorString=accountService.cancalOrder(e.getId(),false,getRootPath());
		if(StringUtils.isEmpty(errorString)) {
			printSuccess("取消订单成功！");
		}
		else {
			printAppError(errorString);
		}
	}
	
	
	

	/**
	 * 刷新指定订单的信息
	 * 
	 * @throws IOException
	 */
	private void toEdit2() throws IOException {
		getResponse().sendRedirect("order!toEdit.action?e.id=" + e.getId());
	}

	/**
	 * 设置订单为审核通过
	 * 
	 * @return
	 * @throws IOException
	 */
	public String updateOrderStatus() throws IOException {
		logger.debug("updateOrderStatus id = " + e.getId() + ",status=" + e.getStatus());
		if (StringUtils.isBlank(e.getId()) || StringUtils.isBlank(e.getStatus())) {
			throw new NullPointerException(ManageContainer.OrderAction_param_null);
		}
		Order orderInfo = orderService.selectById(e.getId());
		if (orderInfo == null) {
			throw new UpdateOrderStatusException(ManageContainer.OrderAction_selectById_null);
		}
		/**
		 * 订单流程控制
		 */
		if (e.getStatus().equals(Order.order_status_send)) {
			Orderdetail odm=new Orderdetail();
			odm.setId(e.getOrderDetailId());
			odm.setStatus(Order.order_status_pass);
			Orderdetail _orderDetail = orderdetailService.selectOne(odm);
			if (orderInfo == null || _orderDetail==null) {
				throw new UpdateOrderStatusException(ManageContainer.OrderAction_selectById_null);
			}
			/**
			 * 转到发货页面
			 */
			Orderpay orderpay = new Orderpay();
			orderpay.setOrderid(e.getId());
			orderpay.setPaystatus(Orderpay.orderpay_paystatus_y);
			orderpay = orderpayService.selectOne(orderpay);
			// 检查订单是否已经支付成功
			// 非法请求
//			if (orderpay == null || StringUtils.isBlank(orderpay.getTradeNo())) {
//				throw new NullPointerException(ManageContainer.RoleAction_update_error);
//			}
			logger.info(e.getOrderDetailId());
//			e.setTradeNo(orderpay.getTradeNo());
			e.setPayType(orderInfo.getPayType());
			/*
			 * 转到发货页面==》请求支付宝发货接口，如果成功支付宝会将此订单的状态设置为【已发货】 ***注意：如果是财付通或其他的支付接口，则需要调对应的发货接口才行。
			 */
			return "toSendProduct";
		}

		// 修改订单状态
		Order order = new Order();
		order.setStatus(e.getStatus());
		order.setId(e.getId());

		String rep = this.getRequest().getParameter("flag");
		// 记录日志
		if (e.getStatus().equals(Order.order_status_pass)) {

			if (expressCompanyName == null || expressCompanyName.equals("")) {

				this.printJson("您未选择快递信息，审核失败;请重新选择");
				return null;
			}
			insertOrderlog(e.getId(), "【审核通过】");

			order.setExpressCode("EXPRESS");
			order.setExpressName("快递");
		} else if (e.getStatus().equals(Order.order_status_print)) {

			if (rep != null && "rep".equals(rep)) {
				insertOrderlog(e.getId(), "【已重新打单】");
			} else {
				insertOrderlog(e.getId(), "【已打单】");
			}
		} else if (e.getStatus().equals(Order.order_status_sign)) {
			accountService.updateOrderToCompete(e.getOrderDetailId(),2);
		} else if (e.getStatus().equals(Order.order_status_file)) {
			insertOrderlog(e.getId(), "【已归档】");
		} else if (e.getStatus().equals(Order.order_status_cancel)) {
			checkStock(orderInfo, e.getStatus());

			insertOrderlog(e.getId(), "【取消订单】");
		} else if (e.getStatus().equals(Order.order_status_exception)) {
			checkStock(orderInfo, e.getStatus());
			insertOrderlog(e.getId(), "【确认异常】");
		} else if (e.getStatus().equals(Order.order_status_return)) {
			insertOrderlog(e.getId(), "【退货处理】");
		} else if (e.getStatus().equals(Order.order_status_transferable)) {
			insertOrderlog(e.getId(), "【退换处理】");
		} else if (e.getStatus().equals(Order.order_status_false)) {
			insertOrderlog(e.getId(), "【确认假单】");
		} else if (e.getStatus().equals(Order.order_status_returnsign)) {
			checkStock(orderInfo, e.getStatus());
			insertOrderlog(e.getId(), "【退货已签收】");
		}
		//签收另做处理
		if (!e.getStatus().equals(Order.order_status_sign))
		{
//			order.setExpressCompanyName(expressCompanyName);
			orderService.update(order);
		}
		toEdit2();
		return null;
	}

	/**
	 * 取消订单后库存处理
	 * 
	 * @param orderInfo
	 * @param state
	 */
	private void checkStock(Order orderInfo, String state) {
		Orderdetail orderdetail = new Orderdetail();
		orderdetail.setOrderID(Integer.valueOf(e.getId()));
		List<Orderdetail> orderdetailList = orderdetailService.selectList(orderdetail);

		if (!orderInfo.getStatus().equals(Order.order_status_exception) && !orderInfo.getStatus().equals(Order.order_status_cancel) && !orderInfo.getStatus().equals(Order.order_status_false) && !orderInfo.getStatus().equals(Order.order_status_returnsign)) {
			// int score = 0;//商品积分汇总

			if (state != null && (Order.order_status_cancel.equals(state) || Order.order_status_exception.equals(state) || Order.order_status_false.equals(state))) {

				for (int i = 0; i < orderdetailList.size(); i++) {
					Orderdetail detailInfo = orderdetailList.get(i);

					Integer buyNum = detailInfo.getNumber();

					// 原来的规格
					int specOldId = detailInfo.getSpecID();
					Spec specOld = specService.selectById(String.valueOf(specOldId));

					// 数据库砍库存
					Product product = new Product();
					product.setId(String.valueOf(detailInfo.getProductID()));
					product.setAddSellcount(-buyNum);// 增加销量
					productService.updateStockAfterPaySuccess(product);

					specOld.setSpecStock(String.valueOf(Integer.parseInt(specOld.getSpecStock()) + buyNum));

					specService.update(specOld);

				}
			}

		}

	}

	/**
	 * 废单恢复库存处理
	 * 
	 * @param orderInfo
	 * @param state
	 */
	private boolean checkBackStock(Order orderInfo, String state) {
		Orderdetail orderdetail = new Orderdetail();
		orderdetail.setOrderID(Integer.valueOf(e.getId()));
		List<Orderdetail> orderdetailList = orderdetailService.selectList(orderdetail);

		if (orderInfo.getStatus().equals(Order.order_status_exception) || orderInfo.getStatus().equals(Order.order_status_cancel) || orderInfo.getStatus().equals(Order.order_status_false) && !orderInfo.getStatus().equals(Order.order_status_returnsign)) {

			if (state != null && !Order.order_status_cancel.equals(state) && !Order.order_status_exception.equals(state) && !Order.order_status_false.equals(state)) {

				for (int i = 0; i < orderdetailList.size(); i++) {
					Orderdetail detailInfo = orderdetailList.get(i);

					Integer buyNum = detailInfo.getNumber();

					// 原来的规格
					int specOldId = detailInfo.getSpecID();
					Spec specOld = specService.selectById(String.valueOf(specOldId));
					// 库存不足
					if (Integer.valueOf(specOld.getSpecStock()) < buyNum) {

						return false;
					}
				}
				for (int i = 0; i < orderdetailList.size(); i++) {
					Orderdetail detailInfo = orderdetailList.get(i);

					Integer buyNum = detailInfo.getNumber();

					// 原来的规格
					int specOldId = detailInfo.getSpecID();
					Spec specOld = specService.selectById(String.valueOf(specOldId));
					// 库存不足
					// 数据库砍库存
					Product product = new Product();
					product.setId(String.valueOf(detailInfo.getProductID()));
					product.setAddSellcount(buyNum);// 增加销量
					productService.updateStockAfterPaySuccess(product);

					specOld.setSpecStock(String.valueOf(Integer.parseInt(specOld.getSpecStock()) - buyNum));

					specService.update(specOld);

				}
			} else {

				return true;
			}

		}
		return true;

	}

	/**
	 * 修改订单项页面
	 * 
	 * @return
	 * @throws Exception
	 */
	public String viewOrderdetail() throws Exception {
		String id = this.getRequest().getParameter("id");

		Orderdetail orderdetail = new Orderdetail();
		orderdetail.setId(id);
		orderdetail = orderdetailService.selectOne(orderdetail);

		// Product product=productService.selectById(String.valueOf(orderdetail.getProductID()));

		Spec spec = new Spec();
		spec.setProductID(String.valueOf(orderdetail.getProductID()));
		List<Spec> specList = specService.selectList(spec);

		this.getRequest().setAttribute("specList", specList);
		this.getRequest().setAttribute("orderdetail", orderdetail);
		return "detail";

	}

	public String updateOrderdetail() throws Exception {

		String id = this.getRequest().getParameter("id");
		String specId = this.getRequest().getParameter("buy");
		String buyNum = this.getRequest().getParameter("buyNum");

		Orderdetail orderdetail = new Orderdetail();
		orderdetail.setId(id);
		orderdetail = orderdetailService.selectOne(orderdetail);
		// 原来的规格
		int specOldId = orderdetail.getSpecID();
		Spec specOld = specService.selectById(String.valueOf(specOldId));

		int oldNum = orderdetail.getNumber();
		int newNum = Integer.valueOf(buyNum);

		int addNum = newNum - oldNum;

		// 数据库砍库存
		Product product = new Product();
		product.setId(String.valueOf(orderdetail.getProductID()));

		product.setAddSellcount(addNum);// 增加销量
		productService.updateStockAfterPaySuccess(product);

		specOld.setSpecStock(String.valueOf(Integer.parseInt(specOld.getSpecStock()) + oldNum));

		specService.update(specOld);
		Spec specNew = specService.selectById(specId);
		specNew.setSpecStock(String.valueOf(Integer.parseInt(specNew.getSpecStock()) - newNum));

		specService.update(specNew);

		orderdetail.setSpecInfo("颜色:" + specNew.getSpecColor() + " 尺码:" + specNew.getSpecSize());
		orderdetail.setNumber(newNum);

		orderdetail.setSpecID(Integer.parseInt(specNew.getId()));
		orderdetail.setTotal0(String.valueOf(Double.valueOf(orderdetail.getPrice()) * orderdetail.getNumber()));
		orderdetailService.update(orderdetail);

		Orderdetail orderdetail1 = new Orderdetail();
		orderdetail1.setOrderID(Integer.valueOf(orderdetail.getOrderID()));
		List<Orderdetail> orderdetailList = orderdetailService.selectList(orderdetail1);
		int totq = 0;
		String allName = "";
		int i = 0;
		String oid = "";
		double ptotal = 0;
		int length = orderdetailList.size();
		for (Orderdetail od : orderdetailList) {
			totq = totq + od.getNumber();
			oid = String.valueOf(od.getOrderID());

			Product product1 = new Product();
			product1.setId(String.valueOf(orderdetail.getProductID()));

			ptotal = ptotal + Double.valueOf(od.getTotal0());

			product1 = productService.selectOne(product1);

			allName = allName + "【款号:" + product1.getQuality() + " " + od.getSpecInfo() + "】×" + od.getNumber();
			if (i != length - 1) {
				allName = allName + "|";

			}
			i++;
		}
		Order order = new Order();
		order.setPtotal(String.valueOf(ptotal));
		order.setId(oid);
		order.setQuantity(totq);
		order.setAmount(String.valueOf(ptotal));
		order.setRemark(allName);
		orderService.update(order);

		getResponse().getWriter().write("{\"mess\":0}");
		return null;

	}

	/**
	 * 订单备注
	 * 
	 * @return
	 * @throws Exception
	 */
	public String saveNotes() throws Exception {
		if (StringUtils.isBlank(e.getId())) {
			throw new NullPointerException("订单ID不能为空！");
		}
		String content = this.getRequest().getParameter("content");
		// 加载指定的订单信息
		e = orderService.selectById(e.getId());

		Ordership ordership = new Ordership();
		ordership.setOrderid(e.getId());
		ordership = ordershipService.selectOne(ordership);
		ordership.setRemark(content);
		ordershipService.update(ordership);
		insertOrderlog(e.getId(), "【订单备注】,"+content);
		toEdit2();
		return null;
	}

	public String export() throws IOException {

		String head = "圆通物流导出" + DateUtil.dateFormat(new Date(), "yyyyMMdd");
		HttpServletRequest request = this.getRequest();
		HttpServletResponse response = this.getResponse();
		String filename = head + ".xls";
		String fileName = new String(filename.getBytes("GBK"), "iso8859-1");
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/x-download");
		response.addHeader("Content-Disposition", "attachment;filename=" + fileName);

		// 声明一个工作薄
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setWrapText(true);
		// 生成一个表格
		HSSFSheet sheet = workbook.createSheet(head);

		// 设置样式
		HSSFCellStyle style = workbook.createCellStyle();
		style.setFillForegroundColor(HSSFColor.WHITE.index);

		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		// 生成一个字体
		HSSFFont font = workbook.createFont();
		font.setColor(HSSFColor.BLACK.index);
		// font.setFontHeightInPoints((short) 12);
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		// 把字体应用到当前的样式
		style.setFont(font);

		// 生成并设置另一个样式
		HSSFCellStyle style2 = workbook.createCellStyle();
		style2.setFillForegroundColor(HSSFColor.WHITE.index);
		style2.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
		style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

		// 生成另一个字体
		HSSFFont font2 = workbook.createFont();
		font2.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
		// 把字体应用到当前的样式
		style2.setFont(font2);

		// 产生表格标题行
		HSSFRow rowHead = sheet.createRow(0);

		String[] title = { "物流订单号（必填）", "商品名称（必填）", "数量（必填）", "买家姓名（必填）", "买家收货省（必填）", "买家收货市（必填）", "买家收货区（必填）", "买家收货地址（必填）", "买家手机号码（必填）", "发件人（必填）", "发件人电话", "发件人省（必填）", "发件人市（必填）", "发件人区（必填）", "发件地址（必填）", "发件人邮编（必填）", "代收货款", "备注", "买家邮编", "买家电话" };
		for (int i = 0; i < title.length; i++) {
			HSSFCell cell = rowHead.createCell(i);

			HSSFRichTextString text = new HSSFRichTextString(title[i]);
			cell.setCellValue(text);
			cell.setCellStyle(style);

		}
		int index = 1;

		List<OrderQuery> list = orderService.selectExportList(e);

		for (OrderQuery order : list) {

			HSSFRow row = sheet.createRow(index);

			HSSFCell cell0 = row.createCell(0);

			HSSFCell cell1 = row.createCell(1);
			HSSFCell cell2 = row.createCell(2);
			HSSFCell cell3 = row.createCell(3);
			HSSFCell cell4 = row.createCell(4);
			HSSFCell cell5 = row.createCell(5);

			HSSFCell cell6 = row.createCell(6);

			HSSFCell cell7 = row.createCell(7);
			HSSFCell cell8 = row.createCell(8);
			HSSFCell cell9 = row.createCell(9);

			HSSFCell cell10 = row.createCell(10);
			HSSFCell cell11 = row.createCell(11);
			HSSFCell cell12 = row.createCell(12);
			HSSFCell cell13 = row.createCell(13);
			HSSFCell cell14 = row.createCell(14);
			HSSFCell cell15 = row.createCell(15);
			HSSFCell cell16 = row.createCell(16);
			HSSFCell cell17 = row.createCell(17);
			HSSFCell cell18 = row.createCell(18);
			HSSFCell cell19 = row.createCell(19);

			cell0.setCellValue(order.getId());
			cell1.setCellValue(order.getRemark());

			cell2.setCellValue(order.getQuantity());

			cell3.setCellValue(order.getShipname());
			cell4.setCellValue(order.getProvince());
			cell5.setCellValue(order.getCity());
			cell6.setCellValue(order.getArea() == null ? ("") : order.getArea());

			cell7.setCellValue(order.getShipaddress());
			cell8.setCellValue(order.getPhone());

			cell9.setCellValue("欧蓝森");
			cell10.setCellValue("18906871452");
			cell11.setCellValue("浙江省");
			cell12.setCellValue("温州市");
			cell13.setCellValue("苍南县");
			cell14.setCellValue("百丈工业区");
			cell15.setCellValue("325800");
			if (order.getPayType() == 3) {
				cell16.setCellValue(order.getAmount());
			} else {

				cell16.setCellValue("");
			}
			cell17.setCellValue(order.getNotes() == null ? ("") : (order.getNotes()));
			cell18.setCellValue("");
			cell19.setCellValue("");

			index++;
		}

		try {
			OutputStream os = response.getOutputStream();
			workbook.write(os);
			os.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	public String emsExport() throws UnsupportedEncodingException {
		String head = "EMS物流导出" + DateUtil.dateFormat(new Date(), "yyyyMMdd");
		HttpServletRequest request = this.getRequest();
		HttpServletResponse response = this.getResponse();
		String filename = head + ".xls";
		String fileName = new String(filename.getBytes("GBK"), "iso8859-1");
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/x-download");
		response.addHeader("Content-Disposition", "attachment;filename=" + fileName);

		// 声明一个工作薄
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setWrapText(true);
		// 生成一个表格
		HSSFSheet sheet = workbook.createSheet(head);

		// 设置样式
		HSSFCellStyle style = workbook.createCellStyle();
		style.setFillForegroundColor(HSSFColor.WHITE.index);

		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		// 生成一个字体
		HSSFFont font = workbook.createFont();
		font.setColor(HSSFColor.BLACK.index);
		// font.setFontHeightInPoints((short) 12);
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		// 把字体应用到当前的样式
		style.setFont(font);
		// 生成并设置另一个样式
		HSSFCellStyle style2 = workbook.createCellStyle();
		style2.setFillForegroundColor(HSSFColor.WHITE.index);
		style2.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
		style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

		// 生成另一个字体
		HSSFFont font2 = workbook.createFont();
		font2.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
		// 把字体应用到当前的样式
		style2.setFont(font2);

		// 产生表格标题行
		HSSFRow rowHead = sheet.createRow(0);

		String[] title = { "邮件号", "*配货单号", "客户订单号", "*寄件人姓名", "*寄件人联系方式", "寄件人联系方式（2）", "*寄件人地址", "寄件人公司", "寄件省", "寄件市", "寄件县", "寄件人邮编", "*收件人姓名", "*收件人联系方式", "收件人联系方式（2）", "*收件人地址", "收件人公司", "到件省/直辖市", "到件城市", "到件县/区", "收件人邮编", "物品重量", "物品长度", "物品宽度", "物品高度", "打单时间", "备注", "业务类型", "代收货款", "收件人付费", "应收货款/邮资", "应收货款/邮资（大写）", "内件性质", "内件数", "内件信息", "留白一", "留白二", "付费类型", "所负责任", "保价金额", "保险金额",
				"其他费" };
		for (int i = 0; i < title.length; i++) {
			HSSFCell cell = rowHead.createCell(i);

			HSSFRichTextString text = new HSSFRichTextString(title[i]);
			cell.setCellValue(text);
			cell.setCellStyle(style);

		}
		int index = 1;

		List<OrderQuery> list = orderService.selectExportList(e);

		for (OrderQuery order : list) {

			HSSFRow row = sheet.createRow(index);

			HSSFCell cell0 = row.createCell(0);

			HSSFCell cell1 = row.createCell(1);
			HSSFCell cell2 = row.createCell(2);
			HSSFCell cell3 = row.createCell(3);
			HSSFCell cell4 = row.createCell(4);
			HSSFCell cell5 = row.createCell(5);

			HSSFCell cell6 = row.createCell(6);

			HSSFCell cell7 = row.createCell(7);
			HSSFCell cell8 = row.createCell(8);
			HSSFCell cell9 = row.createCell(9);

			HSSFCell cell10 = row.createCell(10);
			HSSFCell cell11 = row.createCell(11);
			HSSFCell cell12 = row.createCell(12);
			HSSFCell cell13 = row.createCell(13);
			HSSFCell cell14 = row.createCell(14);
			HSSFCell cell15 = row.createCell(15);
			HSSFCell cell16 = row.createCell(16);
			HSSFCell cell17 = row.createCell(17);
			HSSFCell cell18 = row.createCell(18);
			HSSFCell cell19 = row.createCell(19);

			HSSFCell cell20 = row.createCell(20);
			HSSFCell cell21 = row.createCell(21);
			HSSFCell cell22 = row.createCell(22);
			HSSFCell cell23 = row.createCell(23);
			HSSFCell cell24 = row.createCell(24);
			HSSFCell cell25 = row.createCell(25);
			HSSFCell cell26 = row.createCell(26);
			HSSFCell cell27 = row.createCell(27);
			HSSFCell cell28 = row.createCell(28);
			HSSFCell cell29 = row.createCell(29);

			HSSFCell cell30 = row.createCell(30);
			HSSFCell cell31 = row.createCell(31);
			HSSFCell cell32 = row.createCell(32);
			HSSFCell cell33 = row.createCell(33);
			HSSFCell cell34 = row.createCell(34);
			HSSFCell cell35 = row.createCell(35);
			HSSFCell cell36 = row.createCell(36);
			HSSFCell cell37 = row.createCell(37);
			HSSFCell cell38 = row.createCell(38);
			HSSFCell cell39 = row.createCell(39);
			HSSFCell cell40 = row.createCell(40);
			HSSFCell cell41 = row.createCell(41);

			cell0.setCellValue(order.getId());
			cell1.setCellValue(order.getPhone());
			cell2.setCellValue("");

			cell3.setCellValue("欧蓝森（乐森）");
			cell4.setCellValue("18906871452");
			cell5.setCellValue("");
			cell6.setCellValue("浙江省苍南县百丈工业园区");

			cell7.setCellValue("");
			cell8.setCellValue("");

			cell9.setCellValue("");
			cell10.setCellValue("");
			cell11.setCellValue("");

			cell12.setCellValue(order.getShipname());
			cell13.setCellValue(order.getPhone());
			cell14.setCellValue("");
			cell15.setCellValue(order.getProvince() + order.getCity() + (order.getArea() == null ? ("") : order.getArea()) + order.getShipaddress());

			cell16.setCellValue("");
			cell17.setCellValue("");
			cell18.setCellValue("");
			cell19.setCellValue("");
			cell20.setCellValue("");
			cell21.setCellValue("");
			cell22.setCellValue("");
			cell23.setCellValue("");
			cell24.setCellValue("");
			cell25.setCellValue("");
			cell26.setCellValue(order.getNotes() == null ? ("") : (order.getNotes()));
			cell27.setCellValue("标准快递");

			if (order.getPayType() == 3) {
				cell28.setCellValue("是");
			} else {
				cell28.setCellValue("否");
			}
			cell29.setCellValue("");

			cell30.setCellValue(Double.parseDouble(order.getAmount()));
			// cell30.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
			cell31.setCellValue(new CnUpperCaser(order.getAmount()).getCnString());
			cell32.setCellValue("");
			cell33.setCellValue("");
			cell34.setCellValue(order.getRemark());
			cell35.setCellValue("货到先投，允许开拆验视");

			cell36.setCellValue("");
			cell37.setCellValue("");
			cell38.setCellValue("");
			cell39.setCellValue("");
			cell40.setCellValue("");
			cell41.setCellValue("");

			index++;
		}

		try {
			OutputStream os = response.getOutputStream();
			workbook.write(os);
			os.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;

	}
	
	
	public String exportFinanceExl() throws IOException, ParseException {
		String head = "财务订单" + DateUtil.dateFormat(new Date(), "yyyyMMdd");
		HttpServletRequest request = this.getRequest();
		HttpServletResponse response = this.getResponse();
		String filename = head + ".xls";
		String fileName = new String(filename.getBytes("GBK"), "iso8859-1");
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/x-download");
		response.addHeader("Content-Disposition", "attachment;filename=" + fileName);
		// 声明一个工作薄
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setWrapText(true);
		// 生成一个表格
		HSSFSheet sheet = workbook.createSheet(head);
		int _i=0;
		sheet.setColumnWidth(_i++, 5000);
		sheet.setColumnWidth(_i++, 6000);
//		sheet.setColumnWidth(_i++, 3000);
//		sheet.setColumnWidth(_i++, 2500);
		sheet.setColumnWidth(_i++, 1100);
		sheet.setColumnWidth(_i++, 2000);
		sheet.setColumnWidth(_i++, 3200);
		sheet.setColumnWidth(_i++, 11000);//收获地址
		sheet.setColumnWidth(_i++, 3000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 5000);
		sheet.setColumnWidth(_i++, 3000);
		sheet.setColumnWidth(_i++, 6000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);

		// 设置样式
		HSSFCellStyle style = workbook.createCellStyle();
		style.setFillForegroundColor(HSSFColor.WHITE.index);

		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		// 生成一个字体
		HSSFFont font = workbook.createFont();
		font.setColor(HSSFColor.BLACK.index);
		// font.setFontHeightInPoints((short) 12);
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		// 把字体应用到当前的样式
		style.setFont(font);
		// 生成并设置另一个样式
		HSSFCellStyle style2 = workbook.createCellStyle();
		style2.setFillForegroundColor(HSSFColor.WHITE.index);
		style2.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
		style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

		// 生成另一个字体
		HSSFFont font2 = workbook.createFont();
		font2.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
		// 把字体应用到当前的样式
		style2.setFont(font2);

		// 产生表格标题行
		HSSFRow rowHead = sheet.createRow(0);

		String[] title = { "订单号", "商品名称","数量","收件人", "收件电话","收货地址",  "付款方式", 
				"快递公司", "快递单号","总金额", "付现金","付消费钱包","付积分",
				"订单状态", "支付状态", "会员名称", "会员手机号","下单日期","备注"};
		for (int i = 0; i < title.length; i++) {
			HSSFCell cell = rowHead.createCell(i);
			HSSFRichTextString text = new HSSFRichTextString(title[i]);
			cell.setCellValue(text);
			cell.setCellStyle(style);

		}
		int index = 1;
		List<OrderQuery> list = orderService.selectExportFinanceList(e);
		for (OrderQuery order : list) {
			/**-------------创建列开始---------------------------------**/
			int i=0;
			HSSFRow row = sheet.createRow(index);
			HSSFCell orderNo = row.createCell(i++);
			HSSFCell prodName = row.createCell(i++);
//			HSSFCell shortName = row.createCell(i++);
//			HSSFCell productType = row.createCell(i++);
			HSSFCell quantity = row.createCell(i++);
			HSSFCell shipname = row.createCell(i++);
			HSSFCell phone = row.createCell(i++);
			HSSFCell address = row.createCell(i++);
			HSSFCell payType = row.createCell(i++);
			HSSFCell expressCompanyName = row.createCell(i++);
			HSSFCell expressNo = row.createCell(i++);
			HSSFCell amount = row.createCell(i++);
			HSSFCell money = row.createCell(i++);
			HSSFCell wallet = row.createCell(i++);
			HSSFCell point = row.createCell(i++);
			HSSFCell status = row.createCell(i++);
			HSSFCell payStatus = row.createCell(i++);
			HSSFCell accountName= row.createCell(i++);//会员姓名
			HSSFCell accountTel= row.createCell(i++);//会员姓名
			HSSFCell createdate = row.createCell(i++);
			HSSFCell notes = row.createCell(i++);
		
			/**-------------创建列结束---------------------------------**/
			orderNo.setCellValue(order.getOrderNo());
//			productType.setCellValue(order.getProductTypeString());
			prodName.setCellValue(order.getRemark());
//			shortName.setCellValue(order.getShortname()); 
			quantity.setCellValue(order.getQuantity());
			money.setCellValue(order.getMoneyInfo());
			wallet.setCellValue(order.getWalletInfo());
			point.setCellValue(order.getPointInfo());
			shipname.setCellValue(order.getShipname());
			amount.setCellValue(order.getAmount());
			address.setCellValue(order.getProvince() +  order.getCity() + (order.getArea() == null ? ("") : (  order.getArea())) +  order.getShipaddress());
			accountName.setCellValue(order.getNickname());
			accountTel.setCellValue(order.getTel());
			phone.setCellValue(order.getPhone());
			payType.setCellValue(order.getCutMoney()!=0f?"截图打款":"在线付款");
			expressCompanyName.setCellValue(order.getExpressCompanyName() == null ? ("未安排") : (SystemManager.manageExpressMap.get(order.getExpressCompanyName())));
			expressNo.setCellValue(StringUtils.isEmpty(order.getExpressNo()) ? ("未发货") : (order.getExpressNo()));
			setExlStatusName(order, status, payStatus);
			createdate.setCellValue(DateUtil.dateFormat(DateUtil.StringToDate(order.getCreatedate()), "yyyy-MM-dd HH:mm"));
			notes.setCellValue(order.getNotes() == null ? ("") : (order.getNotes()));
			index++;
		}
		OutputStream os = response.getOutputStream();
		try {
			workbook.write(os);
		} catch (IOException e) {
			e.printStackTrace();
		}
		finally {
			os.close();
		} 
		return null;

	}

	public String exportSimpleExl() throws IOException, ParseException {
		String head = "订单" + DateUtil.dateFormat(new Date(), "yyyyMMdd");
		HttpServletRequest request = this.getRequest();
		HttpServletResponse response = this.getResponse();
		String filename = head + ".xls";
		String fileName = new String(filename.getBytes("GBK"), "iso8859-1");
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/x-download");
		response.addHeader("Content-Disposition", "attachment;filename=" + fileName);
		// 声明一个工作薄
		HSSFWorkbook workbook = new HSSFWorkbook();
		HSSFCellStyle cellStyle = workbook.createCellStyle();
		cellStyle.setWrapText(true);
		// 生成一个表格
		HSSFSheet sheet = workbook.createSheet(head);
		int _i=0;
		sheet.setColumnWidth(_i++, 5000);
		sheet.setColumnWidth(_i++, 6000);
		sheet.setColumnWidth(_i++, 3000);
		sheet.setColumnWidth(_i++, 2500);
		sheet.setColumnWidth(_i++, 3000);
		sheet.setColumnWidth(_i++, 1100);
		sheet.setColumnWidth(_i++, 2000);
		sheet.setColumnWidth(_i++, 3200);
		sheet.setColumnWidth(_i++, 11000);//收获地址
		sheet.setColumnWidth(_i++, 3000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 5000);
		sheet.setColumnWidth(_i++, 3000);
		sheet.setColumnWidth(_i++, 6000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);
		sheet.setColumnWidth(_i++, 4000);

		// 设置样式
		HSSFCellStyle style = workbook.createCellStyle();
		style.setFillForegroundColor(HSSFColor.WHITE.index);

		style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
		// 生成一个字体
		HSSFFont font = workbook.createFont();
		font.setColor(HSSFColor.BLACK.index);
		// font.setFontHeightInPoints((short) 12);
		font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
		// 把字体应用到当前的样式
		style.setFont(font);
		// 生成并设置另一个样式
		HSSFCellStyle style2 = workbook.createCellStyle();
		style2.setFillForegroundColor(HSSFColor.WHITE.index);
		style2.setAlignment(HSSFCellStyle.ALIGN_RIGHT);
		style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

		// 生成另一个字体
		HSSFFont font2 = workbook.createFont();
		font2.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
		// 把字体应用到当前的样式
		style2.setFont(font2);

		// 产生表格标题行
		HSSFRow rowHead = sheet.createRow(0);

		String[] title = { "订单号", "商品名称","商品编码","商品类型","供应商","数量","收件人", "收件电话","收货地址",  "付款方式", 
				"快递公司", "快递单号", "付现金","付消费钱包","付积分",
				"订单状态", "支付状态", "会员名称", "会员手机号","下单日期","备注"};
		for (int i = 0; i < title.length; i++) {
			HSSFCell cell = rowHead.createCell(i);
			HSSFRichTextString text = new HSSFRichTextString(title[i]);
			cell.setCellValue(text);
			cell.setCellStyle(style);

		}
		int index = 1;
		List<OrderQuery> list = orderService.selectExportList(e);
		for (OrderQuery order : list) {
			/**-------------创建列开始---------------------------------**/
			int i=0;
			HSSFRow row = sheet.createRow(index);
			HSSFCell orderNo = row.createCell(i++);
			HSSFCell prodName = row.createCell(i++);
			HSSFCell shortName = row.createCell(i++);
			HSSFCell productType = row.createCell(i++);
			HSSFCell supplierName = row.createCell(i++);
			HSSFCell quantity = row.createCell(i++);
			HSSFCell shipname = row.createCell(i++);
			HSSFCell phone = row.createCell(i++);
			HSSFCell address = row.createCell(i++);
			HSSFCell payType = row.createCell(i++);
			HSSFCell expressCompanyName = row.createCell(i++);
			HSSFCell expressNo = row.createCell(i++);
			HSSFCell money = row.createCell(i++);
			HSSFCell wallet = row.createCell(i++);
			HSSFCell point = row.createCell(i++);
			HSSFCell status = row.createCell(i++);
			HSSFCell payStatus = row.createCell(i++);
			HSSFCell accountName= row.createCell(i++);//会员姓名
			HSSFCell accountTel= row.createCell(i++);//会员姓名
			HSSFCell createdate = row.createCell(i++);
			HSSFCell notes = row.createCell(i++);
		
			/**-------------创建列结束---------------------------------**/
			orderNo.setCellValue(order.getOrderNo());
			productType.setCellValue(order.getProductTypeString());
			prodName.setCellValue(order.getRemark());
			shortName.setCellValue(order.getShortname()); 
			supplierName.setCellValue(order.getSupplierName());
			quantity.setCellValue(order.getQuantity());
			money.setCellValue(order.getMoneyInfo());
			wallet.setCellValue(order.getWalletInfo());
			point.setCellValue(order.getPointInfo());
			shipname.setCellValue(order.getShipname());
			address.setCellValue(order.getProvince() + "·" + order.getCity() + (order.getArea() == null ? ("") : ("·" + order.getArea())) + "·" + order.getShipaddress());
			accountName.setCellValue(order.getNickname());
			accountTel.setCellValue(order.getTel());
			phone.setCellValue(order.getPhone());
			payType.setCellValue(order.getCutMoney()!=0f?"截图打款":"在线付款");
			expressCompanyName.setCellValue(order.getExpressCompanyName() == null ? ("未安排") : (SystemManager.manageExpressMap.get(order.getExpressCompanyName())));
			expressNo.setCellValue(StringUtils.isEmpty(order.getExpressNo()) ? ("未发货") : (order.getExpressNo()));
			setExlStatusName(order, status, payStatus);
			createdate.setCellValue(DateUtil.dateFormat(DateUtil.StringToDate(order.getCreatedate()), "yyyy-MM-dd HH:mm"));
			notes.setCellValue(order.getNotes() == null ? ("") : (order.getNotes()));
			index++;
		}
		OutputStream os = response.getOutputStream();
		try {
			workbook.write(os);
		} catch (IOException e) {
			e.printStackTrace();
		}
		finally {
			os.close();
		} 
		return null;

	}
	
	/**
	 * @param order
	 * @param status
	 * @param payStatus
	 */
	private void setExlStatusName(OrderQuery order, HSSFCell status, HSSFCell payStatus) {
		//订单状态
		if ("init".equals(order.getStatus())) {
			status.setCellValue("待付款");
		} else if ("pass".equals(order.getStatus())) {
			status.setCellValue("待发货");
		} else if ("sure".equals(order.getStatus())) {
			status.setCellValue("截图待确认");
		} else if ("send".equals(order.getStatus())) {
			status.setCellValue("已发货");
		} else if ("sign".equals(order.getStatus())) {
			status.setCellValue("顾客已签收");
		}
		//支付状态
		if (order.getPaystatus().equals("y")) {
			payStatus.setCellValue("已支付");
		} else if (order.getPaystatus().equals("n")) {
			payStatus.setCellValue("未支付");
		} else if (order.getPaystatus().equals("p")) {
			payStatus.setCellValue("部分支付");
		} else if (order.getPaystatus().equals("r")) {
			payStatus.setCellValue("已退款");
		}
	}

	public String initImport() {
		e.clear();
		return "initImport";

	}

	/**
	 * 插入订单操作日志
	 * 
	 * @param orderid
	 *            订单ID
	 * @param content
	 *            日志内容
	 */
	private void insertOrderlog(String orderid, String content) {
		User user = (User) getRequest().getSession().getAttribute(ManageContainer.manage_session_user_info);
		Orderlog orderlog = new Orderlog();
		orderlog.setOrderid(orderid);// 订单ID
		orderlog.setAccount(user.getUsername());// 操作人账号
		orderlog.setContent(content);// 日志内容
		orderlog.setAccountType(Orderlog.orderlog_accountType_m);
		orderlogService.insert(orderlog);
	}

	/**
	 * 后台修改订单总金额
	 * 
	 * @return
	 * @throws Exception
	 */
	public String updatePayMonery() throws Exception {
		checkStatus1();
		logger.debug("updatePayMonery = id = " + e.getId() + ",amount = " + e.getAmount());
		User user = (User) getRequest().getSession().getAttribute(ManageContainer.manage_session_user_info);
		orderService.updatePayMonery(e, user.getUsername());

		toEdit2();
		return null;
	}

	/**
	 * 后台编辑订单页面，添加支付记录、修改订单总金额 操作之前需要进行如下的判断，这2个按钮的操作必须是订单为未审核 且 订单未支付 才可以，否则抛出异常。
	 */
	private void checkStatus1() {
		Order orderInfo = orderService.selectById(e.getId());
		if (orderInfo == null) {
			throw new NullPointerException(ManageContainer.OrderAction_selectById_null);
		}

		/**
		 * 订单流程控制
		 */
		if (orderInfo.getPayType() != 3) {
			if (!orderInfo.getStatus().equals(Order.order_status_init)) {
				// throw new UpdateOrderStatusException(ManageContainer.OrderAction_updatePayMonery_update);
			}
		}
		// if(!orderInfo.getPaystatus().equals(Order.order_paystatus_n)){
		// throw new UpdateOrderStatusException("未支付的订单才支持此操作！");
		// }
	}

	/**
	 * 查询订单的配送地址信息-->然后后台工作人员可以进行修改
	 * 
	 * @return
	 */
	public String selectOrdership() {
		String orderid = getRequest().getParameter("orderid");
		e.setId(orderid);
		if (StringUtils.isBlank(orderid)) {
			throw new NullPointerException("非法请求！");
		}

		Ordership ordership = new Ordership();
		ordership.setOrderid(orderid);
		ordership = ordershipService.selectOne(ordership);
		if (ordership == null) {
			throw new NullPointerException("根据订单ID查询不到该订单的配送信息！");
		}

		e.setOrdership(ordership);

		// areaList
		// 获取区域列表
		if (StringUtils.isNotBlank(ordership.getArea())) {
			// address.getArea()
			net.onlineshop.services.front.area.bean.Area area = SystemManager.areaMap.get(ordership.getProvinceCode());
			if (area != null && area.getChildren() != null && area.getChildren().size() > 0) {
				for (int i = 0; i < area.getChildren().size(); i++) {
					net.onlineshop.services.front.area.bean.Area city = area.getChildren().get(i);
					if (city.getCode().equals(ordership.getCityCode())) {

						// logger.debug("address.getCity()="+address.getCity());
						// logger.debug(city.toString());
						// address.setAreaList(city.getChildren());
						areaList = city.getChildren();
						break;
					}
				}
			}
		}

		return "selectOrdership";
	}

	/**
	 * 修改订单配送地址信息
	 * 
	 * @return
	 * @throws IOException
	 */
	public String updateOrdership() throws IOException {
		logger.debug("updateOrdership...");
		if (StringUtils.isBlank(e.getOrdership().getShipname())) {
			throw new NullPointerException("收货人不能为空！");
		} else if (StringUtils.isBlank(e.getOrdership().getShipaddress())) {
			throw new NullPointerException("收货人街道地址不能为空！");
		} else if (StringUtils.isBlank(e.getOrdership().getPhone())) {
			throw new NullPointerException("收货人手机号码！");
		} else if (StringUtils.isBlank(e.getOrdership().getProvinceCode())) {
			throw new NullPointerException("省份人不能为空！");
		} else if (StringUtils.isBlank(e.getOrdership().getCityCode())) {
			throw new NullPointerException("城市人不能为空！");
		}
		//
		if (StringUtils.isBlank(e.getId())) {
			throw new NullPointerException(ManageContainer.OrderAction_param_null);
		}

		Order order = orderService.selectById(e.getId());
		if (order == null) {
			throw new NullPointerException("查询不到订单信息!");
		}

		// if(order.getStatus().equals(Order.order_status_init)||order.getStatus().equals(Order.order_status_pass)){
		//
		// }else{
		// throw new RuntimeException("只有未打单之前的的订单才能修改收货人配送地址信息!");
		// }
		User user=getManagerUser();
		insertOrderlog(e.getId(), "【修改收货人信息】 操作人："+user.getId()+",账号："+user.getUsername());

		Area area = SystemManager.areaMap.get(e.getOrdership().getProvinceCode());// 获取省份对象
		String proinceName = area.getName();// 省份名称
		String cityName = null;// 城市名称
		String areaName = null;
		List<Area> citys = area.getChildren();
		if (citys != null && citys.size() > 0) {
			for (int i = 0; i < citys.size(); i++) {
				Area cityItem = citys.get(i);
				if (cityItem.getCode().equals(e.getOrdership().getCityCode())) {
					cityName = cityItem.getName();

					// 获取所在区域名称
					if (StringUtils.isNotBlank(e.getOrdership().getAreaCode())) {
						List<Area> areaList = cityItem.getChildren();
						if (areaList != null && areaList.size() > 0) {
							for (int m = 0; m < areaList.size(); m++) {
								Area areaitem = areaList.get(m);
								if (areaitem.getCode().equals(e.getOrdership().getAreaCode())) {
									areaName = areaitem.getName();
								}
							}
						}
					}
				}
			}
		}
		e.getOrdership().setProvince(proinceName);
		e.getOrdership().setCity(cityName);
		e.getOrdership().setArea(areaName);
		try {
			e.getOrdership().setPhoneAddress(AddressUtils.AddressMobile(e.getOrdership().getPhone()));
		} catch (JSONException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		ordershipService.update(e.getOrdership());

		toEdit2();
		return null;
	}

	/**
	 * 前端发货
	 * @return
	 * @throws IOException
	 */
	public String sendProduct() throws IOException {
		HttpServletRequest request = this.getRequest();
		try {
			//////////////////////////////////// 请求参数//////////////////////////////////////
			String orderid = request.getParameter("orderid");
			// 物流公司名称
			String logistics_name = SystemManager.manageExpressMap.get(expressCompanyName);
			if (StringUtils.isBlank(orderid) || StringUtils.isBlank(e.getOrderDetailId())) {
				throw new NullPointerException("sendProduct parms is null");
			}
			// 必填
			String confirmSendProductRemark = new String(request.getParameter("confirmSendProductRemark").getBytes("ISO-8859-1"), "UTF-8");
			// 物流发货单号
			String expressNo = new String(request.getParameter("WIDinvoice_no").getBytes("ISO-8859-1"), "UTF-8");
			SendParms sp=new SendParms(Integer.valueOf(orderid),e.getOrderDetailId(),expressNo,expressCompanyName,confirmSendProductRemark);
			// 三个值可选：POST（平邮）、EXPRESS（快递）、EMS（EMS）
			logger.debug("orderid=" + orderid + ",logistics_name=" + logistics_name + ",invoice_no=" + expressNo +  ",confirmSendProductRemark=" + confirmSendProductRemark);
			User user=getManagerUser();
			String errorStr=orderService.updateOrderAndDetail(sp,user);
			if(StringUtils.isNotEmpty(errorStr)) {
				printAppError(errorStr);
			}
			else {
				printSuccess(null);
			}
		} catch (Exception e) {
			e.printStackTrace();
			printAppError("未知异常"); 
			logger.debug("发货页面异常Exception..." + e.getMessage());
		}
		return null;
	}

	public String expressQuery() {
		try {
			Orderdetail odTemp=new Orderdetail();
			odTemp.setId(e.getId());
			Orderdetail od = orderdetailService.selectOne(odTemp);
			if (od != null && StringUtils.isNotBlank(od.getExpressNo())) {
				this.getResponse().sendRedirect(KuaiDi.searchkuaiDiInfo(od.getExpressCompanyName(), od.getExpressNo()));
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 自动提示物流信息
	 * @return
	 * @throws IOException 
	 */
	public void autoComNum() throws IOException {
		String value=getRequest().getParameter("value");
		String resultValue = HttpTookit.autoComNum(StringUtils.trim(value));
		printSuccess(resultValue); 
	}

	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public void setSpecService(SpecService specService) {
		this.specService = specService;
	}

	public String getExpressCompanyName() {
		return expressCompanyName;
	}

	public void setExpressCompanyName(String expressCompanyName) {
		this.expressCompanyName = expressCompanyName;
	}

	public void setAccountDaoManage(AccountDao accountDaoManage) {
		this.accountDaoManage = accountDaoManage;
	}

	

}
