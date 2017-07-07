package net.onlineshop.web.action.front.orders;

import java.io.File;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.FrontContainer;
import net.onlineshop.core.ManageContainer;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.core.front.SystemManager;
import net.onlineshop.core.listener.CoreParamCache;
import net.onlineshop.core.pay.alipay.alipayescow.util.httpClient.HttpClient;
import net.onlineshop.core.pay.alipay.alipayescow.util.httpClient.HttpTookit;
import net.onlineshop.core.util.AddressUtils;
import net.onlineshop.core.util.DateUtil;
import net.onlineshop.core.util.RedisSevice;
import net.onlineshop.core.util.security.SignatureEncryption;
import net.onlineshop.core.weixin.TenpayUtil;
import net.onlineshop.core.yeepay.service.YeePayService;
import net.onlineshop.services.TransportService;
import net.onlineshop.services.front.account.AccountService;
import net.onlineshop.services.front.account.bean.Account;
import net.onlineshop.services.front.account.bean.Busi;
import net.onlineshop.services.front.account.bean.CqsUser;
import net.onlineshop.services.front.account.bean.MebInfo;
import net.onlineshop.services.front.account.bean.MebPrize;
import net.onlineshop.services.front.account.bean.MebStatistics;
import net.onlineshop.services.front.account.impl.ImageUtils;
import net.onlineshop.services.front.account.impl.ScoreProxy;
import net.onlineshop.services.front.address.AddressService;
import net.onlineshop.services.front.address.bean.Address;
import net.onlineshop.services.front.area.AreaService;
import net.onlineshop.services.front.area.bean.Area;
import net.onlineshop.services.front.comment.CommentService;
import net.onlineshop.services.front.comment.bean.Comment;
import net.onlineshop.services.front.express.ExpressService;
import net.onlineshop.services.front.order.OrderService;
import net.onlineshop.services.front.order.bean.Order;
import net.onlineshop.services.front.order.bean.ReturnPay;
import net.onlineshop.services.front.orderdetail.OrderdetailService;
import net.onlineshop.services.front.orderdetail.bean.Orderdetail;
import net.onlineshop.services.front.orderlog.bean.Orderlog;
import net.onlineshop.services.front.orderpay.OrderpayService;
import net.onlineshop.services.front.orderpay.bean.Orderpay;
import net.onlineshop.services.front.ordership.OrdershipService;
import net.onlineshop.services.front.ordership.bean.Ordership;
import net.onlineshop.services.front.product.ProductService;
import net.onlineshop.services.front.product.bean.Product;
import net.onlineshop.services.manage.sms.SmsService;
import net.onlineshop.services.manage.spec.SpecService;
import net.onlineshop.services.manage.spec.bean.Spec;

/**
 * 门户订单服务类
 * 
 * @author Administrator
 * 
 */
public class OrdersAction extends BaseAction<Order> {
	private static final Logger logger = LoggerFactory.getLogger(OrdersAction.class);
	private static final long serialVersionUID = 1L;
	private DecimalFormat df = new DecimalFormat("0.00");
	private OrderService orderService;
	private OrderdetailService orderdetailService;
	private OrderpayService orderpayService;
	private ProductService productService;
	private CommentService commentService;
	private AccountService accountService;
	private SmsService smsService;
	private TransportService transportService;
	private OrdershipService ordershipService;
	private AddressService addressService;
	private YeePayService yeePayService;
	private ExpressService expressService;
	private List<Order> myOrders;
	private ReturnPay rp=new ReturnPay();
	private Map<String, Order> orderMap;
	private Address address;
	private SpecService specService;
	private AreaService areaService;
	private File file;//上传的图片
	// private boolean is_test = false;//是否是测试状态
	private Product product;// 用户进行评论时加载的商品信息
	private Comment comment;// 用户是否进行过评价；如果此对象不为空，则用户进行过评价
	private RedisSevice redisSevice;
	private String selectLeftMenu;// 选中的个人中心的菜单项

	public void setAddressService(AddressService addressService) {
		this.addressService = addressService;
	}

	public void setAreaService(AreaService areaService) {
		this.areaService = areaService;
	}

	public void setYeePayService(YeePayService yeePayService) {
		this.yeePayService = yeePayService;
	}

	public void setOrderpayService(OrderpayService orderpayService) {
		this.orderpayService = orderpayService;
	}

	public String getSelectLeftMenu() {
		return selectLeftMenu;
	}

	public void setSelectLeftMenu(String selectLeftMenu) {
		this.selectLeftMenu = selectLeftMenu;
	}

	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}

	public Comment getComment() {
		return comment;
	}

	public void setComment(Comment comment) {
		this.comment = comment;
	}

	public void setOrdershipService(OrdershipService ordershipService) {
		this.ordershipService = ordershipService;
	}

	public CommentService getCommentService() {
		return commentService;
	}

	public void setCommentService(CommentService commentService) {
		this.commentService = commentService;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public ProductService getProductService() {
		return productService;
	}

	public void setProductService(ProductService productService) {
		this.productService = productService;
	}

	public Map<String, Order> getOrderMap() {
		return orderMap;
	}

	public void setOrderMap(Map<String, Order> orderMap) {
		this.orderMap = orderMap;
	}

	public List<Order> getMyOrders() {
		return myOrders;
	}

	public void setMyOrders(List<Order> myOrders) {
		this.myOrders = myOrders;
	}

	public OrderdetailService getOrderdetailService() {
		return orderdetailService;
	}

	public void setOrderdetailService(OrderdetailService orderdetailService) {
		this.orderdetailService = orderdetailService;
	}

	public OrderService getOrderService() {
		return orderService;
	}

	public void setOrderService(OrderService orderService) {
		this.orderService = orderService;
	}

	public ExpressService getExpressService() {
		return expressService;
	}

	public void setExpressService(ExpressService expressService) {
		this.expressService = expressService;
	}

	protected void selectListAfter() {
		pager.setPagerUrl("myOrders.html");
	}

	public Order getE() {
		return this.e;
	}

	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new Order();
		}
		if (orderMap == null) {
			orderMap = new HashMap<String, Order>();
		}
		if (this.comment == null) {
			this.comment = new Comment();
		}
		super.setSelectMenu(FrontContainer.not_select_menu);// 设置主菜单为不选中
	}

	public void insertAfter(Order e) {
		e.clear();
	}

	/**
	 * 订单确认页面，点击这个页面的确认支付按钮则会跳转到支付宝等的支付页面
	 * 
	 * @return
	 */
	public String orderComfig() {
		return "orderComfig";
	}
	
	/**
	 * 获取购物车
	 * @return
	 */
	private CartInfo getCartInfo() {
		CartInfo cartInfo =  redisSevice.getCartInfo(getRequest());
		return cartInfo;
	}
	
	/**
	 * 确认商品信息
	 * prizeId 中间信息表id
	 * @throws IOException 
	 */
	public void submitPrize() throws IOException
	{
		 HttpServletRequest request=getRequest();
		 String prizeId=request.getParameter("prizeId");
		 //参数验证
		 if (StringUtils.isBlank(prizeId) || StringUtils.isBlank(e.getSelectAddressID())) {
			 printAppError("参数不合法！");
			return ;
		 }
		address = addressService.selectById(e.getSelectAddressID());
		if (address == null) {
			printAppError("根据ID=" + e.getSelectAddressID() + "查询不到配送地址信息！本次请求视为非法！");
			return ;
		}
		logger.debug(address.toString());
		 //验证登录
		CqsUser cqsUser = redisSevice.getCqsUser(request);
		if (cqsUser == null || StringUtils.isBlank(cqsUser.getMebId())) {
			printNoLogin();
			return;
		}
		//查询奖品信息
		MebPrize mebPrize=accountService.getMebPrize(new MebPrize(prizeId));
		if(mebPrize==null || Busi.YES.equals(mebPrize.getIs_send())){
			printAppError("无法找到对应的奖品信息！");
			return ;
		}
		if(!cqsUser.getMebId().equals(mebPrize.getUser_id()+"")) {
			printAppError("必须本人兑奖！");
			return ;
		}
		// 创建基础订单对象
		Order order = createShopOrder(cqsUser.getPhone(), cqsUser.getMebId(), mebPrize.getAmount());
		// 创建订单明细集合
		product=productService.selectById(mebPrize.getAward_id());
		if(product==null){
			printAppError("无法找到对应的商品！");
			return ;
		}
		// 获取中奖产品明细
		List<Product> productList=new ArrayList<Product>();
		productList.add(product);
		product.setName("【抽奖】"+product.getName());
		List<Orderdetail> orderdetailList = getOrderDetailList(productList);
		orderdetailList.get(0).setStatus(Order.order_status_pass);
//		order.setCutMoney(0f);
//		order.setReurnScore(0f);
		order.setOtherRequirement(e.getOtherRequirement());
		order.setPayType(3);//直接扣款
		order.setRemark("【赠品】"+product.getName());
		order.setPtotal("0");// 订单商品总金额
		order.setAmount("0");// 订单总金额 = 内存订单总金额 + 总配送费
		/**
		 * 对金额进行格式化，防止出现double型数字计算造成的益出。
		 */
		logger.debug("order.getAmount()=" + order.getAmount());
		order.setAmount(df.format(Double.valueOf(order.getAmount())));// 订单总金额
		order.setPtotal(df.format(Double.valueOf(order.getPtotal())));// 订单商品总金额
		
		 //配送地址信息
		Ordership ordership = getOrderShip(order);
		// 创建订单并插入到数据库
		try{
			order=orderService.savePrizeOrderInfo(order, orderdetailList, ordership,mebPrize);
		}
		catch (Exception e) {
			e.printStackTrace();
			printRunTimeError("生成订单报错！");
			return;
		}
		printSuccess(order.getId());
	}
	
	/**
	 * 提交订单
	 */
	public void submitOrders()throws Exception{
		//如果没有验证通过
		if(!getConfirmOrdersResult()) {
			return;
		}
		Account acc = redisSevice.getShopUser(getRequest());
		CartInfo cartInfo = getCartInfo();
		// 如果已登录，则判断是否选择了地址
		if (StringUtils.isEmpty(e.getSelectAddressID())) {
			printAppError("必须选择送货地址！");
			return ;
		}
		//商品价格和订单价格比较
		else if (e.getSelectAddressID() != null) {
			address = addressService.selectById(e.getSelectAddressID());
			if (address == null) {
				printAppError("根据ID=" + e.getSelectAddressID() + "查询不到配送地址信息！本次请求视为非法！");
				return ;
			}
			logger.debug(address.toString());
		}
		
		MebInfo mebInfo=accountService.getMebInfo(acc.getId());
		if(!Busi.MEB_STATE_OK.equals(mebInfo.getMeb_state())) {
			printAppError("您的账号为非正常状态！");
			return;
		}
		// 创建基础订单对象
		Order order = createShopOrder(acc.getTel(), acc.getAccount(), cartInfo.getScoreProxy().getQuantity());
		//是否需要回调完成支付
		// 创建订单明细集合
		List<Orderdetail> orderdetailList = getOrderDetailList(cartInfo.getProductList());
		// 设置订单信息
		String errorInfo=setOrderInfo(cartInfo, order);
		
		// 设置订单信息
		if(StringUtils.isNotEmpty(errorInfo)) {
			printAppError(errorInfo);
			return ;
		}
		 //配送地址信息
		Ordership ordership = getOrderShip(order);
		// 创建订单并插入到数据库
		try{
			orderService.saveOrderInfo(order, orderdetailList, ordership);
		}
		catch (Exception e) {
			e.printStackTrace();
			printRunTimeError("生成订单报错！");
			return;
		}
		// 清空购物车
		clearCart(cartInfo);
		printSuccess(getPayOrderById(order,acc));
		
	}
	
	/***
	 * 获取未付款订单
	 * @throws IOException
	 */
	public void getNopayOrder() throws IOException{
		Account acc = redisSevice.getShopUser(getRequest());
		if(acc==null){
			printNoLogin();
			return;
		}
		if(StringUtils.isEmpty(e.getId())){
			printRunTimeError("参数不合法！"); 
			return;
		}
		Order order=getOrderByState(e, acc,Order.order_status_init,Order.order_paystatus_n);
		if(order==null)
		{
			printAppError("订单已经支付，或不存在！");
			return;
		}
		Order porder = new Order();
		porder.setId(e.getId());
		porder.setAccount(acc.getAccount());
		List<Order> orders = orderService.selectOrderInfo(porder);
		if (orders == null || orders.size() == 0) {
			printAppError("查询不到订单详细信息！"); 
			return;
		}
		order.setOrders(orders);
		// 查询订单配送信息
		Ordership ordership = new Ordership();
		ordership.setOrderid(e.getId());
		ordership = ordershipService.selectOne(ordership);
		order.setOrdership(ordership);
		printSuccess(order);
	}
	
	/**
	 * 获取订单的方法
	 * @param ord
	 * @param acc
	 * @return
	 * @throws IOException
	 */
	private Order doGetPayedOrder(Order ord,Account acc) throws IOException
	{
		Order order=getOrderByState(ord, acc,null,null);
		if(null==order)
			return null;
		Order porder = new Order();
		porder.setId(ord.getId());
		porder.setAccount(acc.getAccount());
		List<Order> orders = orderService.selectOrderInfo(porder);
		order.setOrders(orders);
		// 查询订单配送信息
		Ordership ordership = new Ordership();
		ordership.setOrderid(ord.getId());
		ordership = ordershipService.selectOne(ordership);
		order.setOrdership(ordership);
		return order;
	}
	
	/***
	 * 获取未付款订单
	 * @throws IOException
	 */
	public void getPayedOrder() throws IOException{
		Account acc = redisSevice.getShopUser(getRequest());
		if(acc==null){
			printNoLogin();
			return;
		}
		if(StringUtils.isEmpty(e.getId())){
			printRunTimeError("参数不合法！"); 
			return;
		}
		Order order=doGetPayedOrder(e, acc);
		if(null==order) {
			printRunTimeError("找不到订单！"); 
			return;
		}
		printSuccess(order);
	}
	
	/**
	 * 通过获取订单
	 * @param _order
	 * @param acc
	 * @return
	 * @throws IOException
	 */
	private Order getPayOrderById(Order _order,Account acc) throws IOException{
		Order order = orderService.selectById(_order.getId());
		ScoreProxy scoreProxy = order.getScoreProxy();
		String errorMsg = scoreProxy.getOldMessage(accountService,acc.getId(),order.getCutPointFree(),order.getCutShopFree());
		//数据库中对比
		if(StringUtils.isNotEmpty(errorMsg))
		{
			printAppError(errorMsg);
			return null;
		}
//		MebStatistics mebStatistics=orderService.selectMebStatistics(acc.getAccount());
//		order.setOldScoreTatal(Float.valueOf(mebStatistics.getEntry_stage2()+""));
		order.getScoreProxy().totalCacl(order);
		return order;
	}
	
	/**
	 * 通过获取订单
	 * @param _order
	 * @param acc
	 * @return
	 * @throws IOException
	 */
	private Order getOrderByState(Order _order,Account acc,String status,String paystatus) throws IOException{
		Order parmsOrder=new Order();
		parmsOrder.setId(_order.getId());
		parmsOrder.setStatus(status);
		parmsOrder.setPaystatus(paystatus);
		Order order = orderService.selectOne(parmsOrder);
		if(order!=null)
		{
			MebStatistics mebStatistics=orderService.selectMebStatistics(acc.getAccount());
//			order.setOldScoreTatal(Float.valueOf(mebStatistics.getEntry_stage2()+""));
			ScoreProxy scoreProxy = order.getScoreProxy();
			String errorMsg = scoreProxy.getOldMessage(accountService,acc.getId(),order.getCutPointFree(),order.getCutShopFree());
			//数据库中对比
			if(StringUtils.isNotEmpty(errorMsg)) {
				scoreProxy.setOldMessage(errorMsg);
			}
			order.getScoreProxy().totalCacl(order);
		}
		return order;
	}
	
	/**
	 * 取消订单
	 * @throws Exception
	 */
	public void cancalOrder() throws Exception {
		if (StringUtils.isEmpty(e.getId())) {
			printRunTimeError("非法参数！");
			return;
		}
		Order order = orderService.selectById(e.getId());
		Account acc = redisSevice.getShopUser(getRequest());
		if (order.getAccount().equals(acc.getId())) {
			printRunTimeError("取消订单是本人！");
			return;
		}
		accountService.cancalOrder(e.getId(),true);
		printSuccess("取消订单成功");
		
	}
	
	/**
	 * 订单验证
	 * @return
	 * @throws IOException
	 */
	private Order validatePay() throws IOException
	{
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			printNoLogin();
			return null;
		}
		String eId=e.getId();
		HttpServletRequest req = this.getRequest();
		String payType = req.getParameter("payType");//是否保留积分
//		String isPayTicket = req.getParameter("isPayTicket");//是否保留积分
		if (StringUtils.isEmpty(eId) || StringUtils.isBlank(payType)) {
			printAppError("非法参数,参数为空！");
			return null;
		}
		
		MebInfo mebInfo=accountService.getMebInfo(acc.getId());
		if(!Busi.MEB_STATE_OK.equals(mebInfo.getMeb_state())) {
			printAppError("您的账号为非正常状态！");
			return null;
		}
		Order order = getOrderInit(eId);
        if(order==null){
			printAppError("找到不到订单,或已经支付订单！");
			return null;
		}
//        if((order.getCutPointFree()>0f || order.getCutPoint2Free()>0f) && StringUtils.isBlank(isPayTicket))
//        {
//        	printAppError("非法参数,参数为空！");
//			return null;
//        }
//        order.setIsPayTicket(isPayTicket);
        //验证是不是当前账号付款的订单
        if(!acc.getId().equals(order.getAccount())) {
        	printAppError("无法支付的账单！");
			return null;
        }
		return order;
	}
	
	/**
	 * 获取初始化订单
	 * @param eId
	 * @return
	 */
	private Order getOrderInit(String eId){
		//查询已经支付的订单
		Order pOrder=new Order(); 
		pOrder.setId(eId);
		pOrder.setStatus(Order.order_status_init);
		pOrder.setPaystatus(Order.order_paystatus_n);
       return  orderService.selectOne(pOrder);
        
	}
	
	/**
	 *直接支付,此方法名称不能修改
	 * @throws IOException
	 */
	public void alipayPayCallBack() throws Exception
	{
		logger.info("支付回调成功:"+rp.toString());
		HttpServletRequest req = getRequest();
		//判断ip
		String status= req.getParameter("rp.status");
		//如果支付成功
		if("true".equals(status)) {
			String oId= req.getParameter("rp.orderNo");
			String amount= req.getParameter("rp.amount");
			String sign= req.getParameter("rp.sign");
			if(!validateSign(sign,amount,oId,status)) {
				printJson("sign order fail!");
				return;
			}
			Order order = getOrderInit(oId);
			if(null!=order) {
//				String saveScore=order.getIsSaveScore();
//				String isPayTicket=order.getIsPayTicket();
				//调用支付
				String errorMsg=doPayOrders(new OrderParms(null,Order.pay_alipay,order));
				if(StringUtils.isNotEmpty(errorMsg)) {
					printJson(errorMsg);
					return;
				}
			}
			else {
				printJson("order not exist!");
				return;
			}
		}
		else {
			printJson("status expection!");
			return;
		}
		printJson("success!");
	}
	
	/**
	 * 支付宝签名验证
	 * @param sign
	 * @param amount
	 * @param oId
	 * @return
	 */
	private boolean validateSign(String sign,String amount,String oId,String status){
		logger.info("验证签名！"); 
		return SignatureEncryption.encodeSign(oId, amount, status).equals(sign);
	}
	
	
	/**
	 * 支付宝支付
	 * @return
	 * @throws IOException 
	 */
	public  void alipayPay() throws IOException {
		Order order = validatePay(); 
	    if(null==order) {
	    	return;
	    }
	    //拼接支付宝参数
		String channel =String.valueOf(CoreParamCache.getInstance().get("alipayChanel"));
		String busiType =String.valueOf(CoreParamCache.getInstance().get("alipayBusiType"));
		String orderNo = order.getId();
		float amount = order.getCutMoney();
		PaymentReq pr = new PaymentReq();
		pr.setAmount((int)amount*100+"");
//		pr.setAmount("1");
		pr.setBusiType(busiType);
		pr.setChannel(channel);
		pr.setOrder_no(orderNo);
		pr.setReturnUrl((String)CoreParamCache.getInstance().get("alipayCallBack")+"#/orderDetail/"+orderNo);
		
		//拼接支付宝参数
		//获取参数
		HttpServletRequest req = this.getRequest();
//	    String isSaveScore = req.getParameter("isSaveScore");//是否保留积分
//		String isPayTicket = req.getParameter("isPayTicket");//是否保留积分
		String payType = req.getParameter("payType");//是否保留积分
		 //保存支付参数
		Order uOrder=new Order();
//		if(StringUtils.isNotBlank(isSaveScore))
//			uOrder.setIsSaveScore(isSaveScore);
//		if(StringUtils.isNotBlank(isPayTicket))
//			uOrder.setIsPayTicket(isPayTicket);
		uOrder.setPayType(Integer.parseInt(payType));
		uOrder.setId(e.getId());
		//更新支付信息
		orderService.update(uOrder);
		String payTypeSign="alipayUrl";
		if(uOrder.getPayType()==2) {
			payTypeSign="weipayUrl";
		}
		String payUrl =(String) CoreParamCache.getInstance().get(payTypeSign);
		String alipayHtml =  new HttpClient().sendPostRequest(payUrl,pr);
		printJson(alipayHtml);
	}
	
	
	/**
	 * 上传打款截图,或直接积分或重销付款
	 * http://blog.csdn.net/mydwr/article/details/9617519
	 * @throws IOException
	 */
	public  void payOrders() throws Exception {
		Order order = validatePay(); 
	    if(null==order) {
	    	return;
	    }
//        if(order.getCutMoney()>0f && this.file==null){
//        	printAppError("您有开单产品，必须上传打款截图！");
//			return;
//        }
//        HttpServletRequest req = this.getRequest();
//        String isSaveScore = req.getParameter("isSaveScore");//是否保留积分
//        String isPayTicket = order.getIsPayTicket();//是否保留积分
		String payType =Order.pay_direct;
		//调用支付
		String errorMsg=doPayOrders(new OrderParms(null,payType,order));
		if(StringUtils.isNotEmpty(errorMsg)) {
			printAppError(errorMsg);
			return;
		}
		//返回支付信息
		Account acc = redisSevice.getShopUser(getRequest());
		printSuccess(doGetPayedOrder(order, acc));
	}
	
	/**
	 * 确认支付动作
	 * @param op
	 * @throws IOException
	 */
	private String doPayOrders(OrderParms op) throws Exception{
		//如果传了订单，使用订单，没传订单再支付一遍
		Order order = op.getOrder()!=null?op.getOrder():getOrderInit(op.getOrderId());
	    if(null==order) {
	    	return "找不到订单，或订单已经支付！";
	    }
	    String payType=op.getPayType();
//	 	Float payMoney=0f;
	 	order.setPayType(Integer.valueOf(payType));
	    //打款截图
	 	order.setStatus(Order.order_status_pass);
//	 	if(Order.pay_direct.equals(payType)){
//	 		logger.info("支付方式：直接付积分或钱包！"); 
//	 	}
//	 	else
//	 	{
//	 		 if(Order.pay_image.equals(payType))
//	 	    {
//	 			 	logger.info("支付方式：打款截图！"); 
//	 	    	  //相对路径
//	 	        	String relativePath=order.getAccount()+File.separator+ UUID.randomUUID()+".png";
//	 	        	//写文件绝对路径
//	 	        	String filePath=(String)CoreParamCache.getInstance().get("imgDir")+relativePath;
//	 	            try {
//	 	        		ImageUtils.saveImageByPath(file,filePath);
//	 	            } catch (Exception e) {
//	 	            	return "上传图片失败，程序异常！";
//	 	            }
//	 	            order.setImagesPath(filePath);
//	 	            order.setStatus(Order.order_status_sure);
//	 	    }
//	 		else if(Order.pay_alipay.equals(payType)){
// 				
//	 		}
//	 		else if(Order.pay_weixin.equals(payType)){
//	 			
//	 		}
//	 		else{
// 				throw new RuntimeException("未知的支付方式！");
//	 		}
	 		 
	 		 //需要支付金额
//			String isSaveScore = op.getIsSaveScore();//是否保留积分
//			//是否保留积分
//			if(Busi.YES.equals(isSaveScore))
//				payMoney=order.getCutMoney();
//			else
//				payMoney=order.getCutMoney()-order.getReurnScore();
//			order.setCutMoney(payMoney);
//			order.setIsSaveScore(isSaveScore);
//			order.setIsSaveScoreFinal(isSaveScore);
//	 	}
		//设置订单状态
		order.setPaystatus(Orderpay.orderpay_paystatus_y);
		order.setPaydate(DateUtil.dateFormat(new Date()));
		 //order计算器
        ScoreProxy scoreProxy=order.getScoreProxy();
        scoreProxy.totalCacl(order);
        
        //是否使用消费券
//    	String isPayTicket = op.getIsPayTicket();
//    	if(scoreProxy.getCutPointFree()>0f && Busi.YES.equals(isPayTicket)) {
//    		int point2FreeRadio=(Integer)CoreParamCache.getInstance().get("point2FreeRadio");
//    			order.setCutPoint2Free(order.getCutPointFree()*point2FreeRadio);
//    			order.setCutPointFree(0);
//    	}
		//用户自己积分是否足够
		String errorMsg = scoreProxy.getOldMessage(accountService,order.getAccount(),order.getCutPointFree(),order.getCutShopFree());
		scoreProxy.totalCacl(order);
		
		//数据库中对比
		if(StringUtils.isNotEmpty(errorMsg)) {
			return errorMsg;
		}
		Orderpay orderpay = new Orderpay();
		// 创建订单并插入到数据库
		orderpay.setOrderid(order.getId());
		orderpay= orderpayService.selectOne(orderpay);
		Boolean isSuccess=orderService.updateOrders(order,orderpay);
		if(!isSuccess) {
			return "提交订单失败,可能重复提交订单！";
		}
		//订单
		orderService.insertOrderlog(order.getId(), "【确认付款】,总金额："+order.getAmount(), order.getAccount(), Orderlog.orderlog_accountType_w);
		return null;
	}
	
	
	 //是否有正在确认的订单
//            Order temOrder=new Order(); 
//            temOrder.setStatus(Order.order_status_sure);
//             List<Order> _orderList = orderService.selectList(pOrder);
//            if(_orderList!=null && _orderList.size()>0){
//    			printAppError("你已经有在途的开单！");
//    			return ;
//    		}
	
	/**
	 * 清空购物车
	 * @param cartInfo
	 */
	private void clearCart(CartInfo cartInfo){
		if(cartInfo!=null){
			cartInfo.clear();
		}
		else {
			cartInfo=null;
		}
//		getSession().setAttribute(FrontContainer.myCart, null);
		redisSevice.setCartInfo(getRequest(), null);
	}

	/**
	 * 设置订单信息
	 * @param cartInfo
	 * @param order
	 */
	private String setOrderInfo(CartInfo cartInfo, Order order) {
		String allName = "";
		for (Product product: cartInfo.getProductList()) {
			if (product.getBuySpecInfo() != null) {
				allName += "," + product.getName();
			}
		}
		ScoreProxy scoreProxy = cartInfo.getScoreProxy();
//		order.setCutMoney(scoreProxy.getCutMoney());
//		order.setReurnScore(scoreProxy.getReturnScore());
		order.setCutShopFree(scoreProxy.getCutShopFree());
		order.setCutPointFree(scoreProxy.getCutPointFree());
		order.setOtherRequirement(e.getOtherRequirement());
//		float cutPointFree = scoreProxy.getCutPointFree();
//		if(cutPointFree>0f || order.getCutMoney()>0f) {
//			order.setCutPointFree(scoreProxy.getCutPointFree());
//			try {
//				order.setPoint2money(redisSevice.getPointCurPrice());
//			}
//			catch (Exception e) {
//				e.printStackTrace();
//				return "无法获取积分系统价格";
//			}
//		}
		//如果没有现金交易
		if(order.getCutMoney()>0) {
			order.setPayType(4);//直接扣款
		}
		else {
			order.setPayType(3);//打款截图，审核
		}
		
		order.setRemark(allName.substring(1));
		order.setPtotal(scoreProxy.getAmount()+"");// 订单商品总金额
		order.setAmount(String.valueOf(scoreProxy.getAmount()));// 订单总金额 = 内存订单总金额 + 总配送费
		order.setAmountExchangeScore(0);// 订单总兑换积分。订单支付成功以后扣除
		/**
		 * 对金额进行格式化，防止出现double型数字计算造成的益出。
		 */
		logger.debug("order.getAmount()=" + order.getAmount());
		order.setAmount(df.format(Double.valueOf(order.getAmount())));// 订单总金额
		order.setPtotal(df.format(Double.valueOf(order.getPtotal())));// 订单商品总金额
//		order.setFee(df.format(Double.valueOf(order.getFee())));// 订单总配送费
		return null;
	}

	/**
	 * 创建订单明细集合
	 * @param cartInfo
	 * @return
	 */
	private List<Orderdetail> getOrderDetailList(List<Product> productList) {
		List<Orderdetail> orderdetailList = new LinkedList<Orderdetail>();
		for (Product product : productList) {
			Orderdetail orderdetail = new Orderdetail();
			orderdetail.setProductID(Integer.valueOf(product.getId()));
			orderdetail.setGiftID(product.getGiftID());// 商品赠品ID
			orderdetail.setPrice(product.getNowPrice());// 商品现价
			orderdetail.setNumber(product.getBuyCount());// 购买数
			orderdetail.setFee("0");// 配送费
			orderdetail.setStatus(Order.order_status_init);
			orderdetail.setProductName(product.getName());
			orderdetail.setReurnScore(product.getPoint());
			orderdetail.setShortName(product.getShortname());
			orderdetail.setSupplierId(product.getSupplierId());
			orderdetail.setProductType(product.getProductType());
			orderdetail.setTotal0(String.valueOf(Double.valueOf(orderdetail.getPrice()) * orderdetail.getNumber()));// 订单项小计
			orderdetail.setScore(product.getPoint());// 活的赠送的积分
			orderdetail.setRemarks(product.getKeywords());
			Spec specInfo=product.getBuySpecInfo();
			if (specInfo != null) {
				// 按照规格计算
				if(StringUtils.isNotEmpty(specInfo.getSpecColor()) &&  StringUtils.isNotEmpty(specInfo.getSpecSize())) {
					orderdetail.setSpecInfo("品质:" + specInfo.getSpecColor() + " 规格:" + specInfo.getSpecSize());
				}
				//有规格图片用规格图片
				String specInfoPic=specInfo.getPicurl();
				//如果没有规格，按规格计算
				if(StringUtils.isNotEmpty(specInfoPic)) {
					orderdetail.setPicurl(specInfoPic);
				}
				else{
					orderdetail.setPicurl(product.getPicture());
				}
				orderdetail.setSpecID(Integer.parseInt(specInfo.getId()));
			}
			else{
				orderdetail.setPicurl(product.getPicture());
			}
			orderdetailList.add(orderdetail);
		}
		return orderdetailList;
	}

	/**
	 * @param order
	 * @return
	 */
	private Ordership getOrderShip(Order order) {
		Ordership ordership = new Ordership();
		ordership.setOrderid(order.getId());
		Area area = SystemManager.areaMap.get(address.getProvince());// 获取省份对象
		String proinceName = "xx";// 省份名称
		String cityName = "xx";// 城市名称
		String areaName = "xx";

		if (area != null) {
			proinceName = area.getName();// 省份名称
			List<Area> citys = area.getChildren();
			for (Area cityItem : citys) {
				if (cityItem.getCode().equals(address.getCity())) {
					cityName = cityItem.getName();
					// 获取所在区域名称
					areaName = getAreaName(areaName, cityItem);
				}
			}
		}
		ordership.setShipname(address.getName());
		ordership.setShipaddress(address.getAddress());
		ordership.setProvinceCode(address.getProvince());
		ordership.setProvince(proinceName);
		ordership.setCityCode(address.getCity());
		ordership.setCity(cityName);
		ordership.setAreaCode(address.getArea());
		ordership.setArea(areaName);
		ordership.setPhone(address.getMobile());
		ordership.setPhoneAddress("");
		ordership.setTel(address.getPhone());
		ordership.setZip(address.getZip());
		ordership.setSex("1");
		logger.debug(ordership.toString());
		return ordership;
	}

	/**
	 * 获取地区
	 * @param areaName
	 * @param cityItem
	 * @return
	 */
	private String getAreaName(String areaName, Area cityItem) {
		if (StringUtils.isNotBlank(address.getArea())) {
			List<Area> areaList = cityItem.getChildren();
			for (Area areaitem : areaList) {
				if (areaitem.getCode().equals(address.getArea())) {
					areaName = areaitem.getName();
				}
			}
		}
		return areaName;
	}
	

	/**
	 * 创建订单
	 * @param orderMobile
	 * @param accountStr
	 * @param payCode
	 * @param quantity
	 * @return
	 */
	private Order createShopOrder(String orderMobile, String accountStr,int quantity) {
		// 创建订单对象
		Order order=new Order();
		order.setAccount(accountStr);
		order.setQuantity(quantity);
		order.setRebate(1);//折扣
		order.setStatus(Order.order_status_init);
		order.setPaystatus(Order.order_paystatus_n);
		order.setOtherRequirement(e.getOtherRequirement());// 附加要求
		order.setIpaddress(AddressUtils.getIp(getRequest()));
		String gzid = (String) getSession().getAttribute(FrontContainer.gzid);
		String orderFrom = (String) getSession().getAttribute(FrontContainer.orderFrom);
		order.setGzid(gzid);
		order.setOrderFrom(orderFrom);
		String ipaddress=order.getIpaddress();
		if (!ipaddress.equals("127.0.0.1") && !ipaddress.equals("localhost")) {
			// 获取指定IP的区域位置
			try {
				ipaddress = AddressUtils.getAddresses("ip=" + ipaddress, "utf-8");
			} catch (Exception e) {
				e.printStackTrace();
			}
			order.setIpaddress(AddressUtils.getIp(getRequest()) + (ipaddress == null ? ("") : (ipaddress)));
		}
		//订单号
		String orderNo = TenpayUtil.getCurrTime() + TenpayUtil.buildRandom(5);
		order.setOrderNo(orderNo);
		order.setOrderMobile(orderMobile);
		return order;
	}
	
//	/**
//	 * 分页加载评论
//	 * 
//	 * @return
//	 * @throws Exception
//	 */
//	private void selectCommentList(Comment commentParam) throws Exception {
//		int offset = 0;
//		if (getRequest().getParameter("pager.offset") != null) {
//			offset = Integer.parseInt(getRequest().getParameter("pager.offset"));
//		}
//		if (offset < 0)
//			offset = 0;
//		// Comment comment = new Comment();
//		((PagerModel) commentParam).setOffset(offset);
//		pager = commentService.selectPageList(commentParam);
//		if (pager == null)
//			pager = new PagerModel();
//		// 计算总页数
//		pager.setPagerSize((pager.getTotal() + pager.getPageSize() - 1) / pager.getPageSize());
//
//		// selectListAfter();
//		pager.setPagerUrl("rate.html");
//	}



	/**
	 * 查询我的订单列表信息
	 */
	public String selectList() throws Exception {

		return super.selectList();
	}

	/**
	 * 删除我的订单信息
	 */
	public String deletes() throws Exception {
		return super.deletes();
	}

	/**
	 * 退订或取消指定的订单
	 * 
	 * @return
	 * @throws Exception
	 */
	public String cancel() throws Exception {
		return "";
	}

	/**
	 * 读取指定订单的信息
	 * 
	 * @return
	 */
	public String read() {
		return "";
	}
	
	/**
	 * 查看订单详情
	 * 
	 * @return
	 * @throws IOException 
	 */
	public void getOrderInfoById() throws IOException {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null) {
		  printNoLogin();
		  return;
		}
		logger.debug("orderInfo...");
		String id = getRequest().getParameter("id");
		if (StringUtils.isBlank(id)) {
			printRunTimeError("参数不正确！");
			 return;
		}

		// 查询订单信息
		Order order = new Order();
		order.setId(id);
		order.setAccount(acc.getAccount());
		List<Order> orders = orderService.selectOrderInfo(order);
		if (orders == null || orders.size() == 0) {
			printAppError(ManageContainer.OrderAction_selectById_null);
			return;
		}
		logger.debug("orders.size=" + orders.size());
		e = orders.get(0);
		e.setOrders(orders);
		// 查询订单配送信息
		Ordership ordership = new Ordership();
		ordership.setOrderid(id);
		ordership = ordershipService.selectOne(ordership);
		e.setOrdership(ordership);
//		String CompanyName = SystemManager.manageExpressMap.get(e.getExpressCompanyName());
//		getRequest().setAttribute("CompanyName", CompanyName);
//		// 查询订单物流信息
//		this.getRequest().setAttribute("kuaidi", KuaiDi.searchkuaiDiInfo(e.getExpressCompanyName(), e.getExpressNo()));
//		e.setKuaid100Info(kuaidi100Helper.selectKuaidi100());
		printSuccess(e);
	}
	
	/**
	 * 快递信息查询
	 * @throws IOException
	 */
	public void searchkuaiDiInfo() throws IOException {
		String expressCompanyName=getRequest().getParameter("expressCompanyName");
		String expressNo=getRequest().getParameter("expressNo");
		String kuaidi=HttpTookit.getkuaidi100(expressCompanyName, expressNo);
		logger.info("成功快递信息查询....");
		printJson(kuaidi);
	}

	/**
	 * 查看物流信息
	 * 
	 * @return
	 */
	public String orderhipInfo() {
		logger.debug("orderhipInfo...");
		return "orderhipInfo";
	}

	
	
	/**
	 * 确认订单信息，购物车到订单
	 * @throws IOException
	 */
	public void confirmOrders() throws IOException{
		if(getConfirmOrdersResult()) {
			CartInfo cartInfo = getCartInfo();
			printSuccess(cartInfo);
		}
	}
	
	/**
	 * 获取确认订单信息
	 * Ajax
	 * @return
	 */
	private Boolean getConfirmOrdersResult() throws IOException{
		//判断session
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			printNoLogin();
			return false;
		}
		// 检查购买的商品是否超出可购买的库存数
		CartInfo cartInfo = getCartInfo();
		List<Product> productList=null;
		if (cartInfo == null) {
			printAppError("购物车为空!");
			return false;
		}
		else if((productList=cartInfo.getProductList())== null || productList.size() == 0) {
			printAppError("购物车为空!");
			return false;
		}
		cartInfo.setOrderDate(new Date());
//		for (int i = 0; i < productList.size(); i++) {
//			Product product = productList.get(i);
//			Integer ss = specService.selectStockById(Integer.parseInt(product.getBuySpecInfo().getId()));
//			if (ss == null || ss == 0) {
//				// 商品已卖完或已下架，请联系站点管理员!
//				printAppError("商品已卖完或已下架，请联系站点管理员!");
//				return false;
//			} else
//				if (ss < product.getBuyCount()) {
//				// 购买的商品数超出库存数
//				printAppError("您购买的商品数量超过库存，请联系站点管理员!");
//				return false;
//			}
//		}
			// 加载配送信息
			Address add = new Address();
			add.setAccount(acc.getAccount());
			List<Address> addressList = addressService.selectList(add);
			cartInfo.setAddressList(addressList);
			if (addressList != null && addressList.size() > 0) {
				// boolean exist = false;
				for (int i = 0; i < addressList.size(); i++) {
					Address addItem = addressList.get(i);
					if ("y".equals(addItem.getIsdefault())) {
						cartInfo.setDefaultAddessID(addItem.getId());
						add = addItem;
						break;
					}
				}
			} 
			cartInfo.setAddress(add);
			cartInfo.setAddressList(addressList);
			//计算购物车，确认订单
			ScoreProxy scoreProxy = cartInfo.getScoreProxy();
			cartInfo.totalCacl();
			String mesg = scoreProxy.getOldMessage(accountService,acc.getId(),scoreProxy.getCutPointFree(),scoreProxy.getCutShopFree());
			if (StringUtils.isNotEmpty(mesg)) {
				printSuccess(cartInfo);
				return false;
			}
			return true;
	}
	
	/**
	 * 支付成功后，回调请求跳转到的页面
	 * 
	 * @return
	 */
	public String paySuccess() {
		String fromModule = this.getFromModule();
		if (fromModule.equals("PC")) {
			return "pc_paySuccess";
		}
		return "paySuccess";
	}

	/**
	 * 确定收货
	 * 
	 * @return
	 * @throws IOException
	 */
	public void signOrder() throws IOException {
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			printNoLogin();
			return;
		}

		if (StringUtils.isBlank(e.getId())) {
			printAppError(ManageContainer.OrderAction_param_null);
			return;
		}

		Order orderInfo = orderService.selectById(e.getId());
		if (orderInfo == null) {
			printAppError(ManageContainer.OrderAction_selectById_null);
			return;
		}

		if (!acc.getAccount().equals(orderInfo.getAccount())) {
			printAppError(ManageContainer.RoleAction_update_error);
			return;
		}

		// 修改订单状态
		String resultString = accountService.updateOrderToCompete(e.getOrderdetailID(),1);
		if(StringUtils.isNotEmpty(resultString)) {
			printAppError(resultString);
			return ;
		}
		printSuccess(null);
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public void setAccountService(AccountService accountService) {
		this.accountService = accountService;
	}

	public void setSmsService(SmsService smsService) {
		this.smsService = smsService;
	}

	public void setSpecService(SpecService specService) {
		this.specService = specService;
	}

	public void setTransportService(TransportService transportService) {
		this.transportService = transportService;
	}

	public String updateTransportFee() {
		return null;
	}

	public void setRedisSevice(RedisSevice redisSevice) {
		this.redisSevice = redisSevice;
	}
	
}