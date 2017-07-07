package net.onlineshop.services.front.order.impl;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.slf4j.LoggerFactory;

import net.onlineshop.core.FrontContainer;
import net.onlineshop.core.ServersManager;
import net.onlineshop.core.util.DateUtil;
import net.onlineshop.services.front.account.AccountService;
import net.onlineshop.services.front.account.bean.Account;
import net.onlineshop.services.front.account.bean.Busi;
import net.onlineshop.services.front.account.bean.MebPrize;
import net.onlineshop.services.front.account.bean.MebStatistics;
import net.onlineshop.services.front.account.impl.RandomUtill;
import net.onlineshop.services.front.order.OrderService;
import net.onlineshop.services.front.order.bean.Order;
import net.onlineshop.services.front.order.bean.OrderSimpleReport;
import net.onlineshop.services.front.order.dao.OrderDao;
import net.onlineshop.services.front.orderdetail.bean.Orderdetail;
import net.onlineshop.services.front.orderdetail.dao.OrderdetailDao;
import net.onlineshop.services.front.orderlog.bean.Orderlog;
import net.onlineshop.services.front.orderlog.dao.OrderlogDao;
import net.onlineshop.services.front.orderpay.bean.Orderpay;
import net.onlineshop.services.front.orderpay.dao.OrderpayDao;
import net.onlineshop.services.front.ordership.bean.Ordership;
import net.onlineshop.services.front.ordership.dao.OrdershipDao;
import net.onlineshop.services.front.product.bean.Product;
import net.onlineshop.services.front.product.dao.ProductDao;
import net.onlineshop.services.manage.spec.bean.Spec;
import net.onlineshop.services.manage.spec.dao.SpecDao;

public class OrderServiceImpl extends ServersManager<Order> implements OrderService {
	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(OrderServiceImpl.class);
	private OrderDao orderDao;
	private OrderdetailDao orderdetailDao;
	private OrderpayDao orderpayDao;
	private OrdershipDao ordershipDao;
	private OrderlogDao orderlogDao;
	private ProductDao productDao;
	private AccountService accountService;
	private SpecDao specDao;

	public void setAccountService(AccountService accountService) {
		this.accountService = accountService;
	}

	public void setProductDao(ProductDao productDao) {
		this.productDao = productDao;
	}

	public void setOrderpayDao(OrderpayDao orderpayDao) {
		this.orderpayDao = orderpayDao;
	}

	public void setOrderlogDao(OrderlogDao orderlogDao) {
		this.orderlogDao = orderlogDao;
	}

	public void setOrdershipDao(OrdershipDao ordershipDao) {
		this.ordershipDao = ordershipDao;
	}

	public void setOrderdetailDao(OrderdetailDao orderdetailDao) {
		this.orderdetailDao = orderdetailDao;
	}

	public void setOrderDao(OrderDao orderDao) {
		this.orderDao = orderDao;
	}

	public void setSpecDao(SpecDao specDao) {
		this.specDao = specDao;
	}
	
	/**
	 * 更新订单
	 */
	public synchronized Boolean updateOrders(Order order,Orderpay orderpay){
		if(isExistOrder(order)) {
			return false;
		}
		orderDao.update(order);
		
		Orderdetail od=new Orderdetail();
		od.setOrderID(Integer.parseInt(order.getId()));
		od.setStatus(order.getStatus());
		orderdetailDao.update(od);
		//现金支付
		if(order.getCutMoney()>0f)
			orderpay.setPaymethod(Orderpay.orderpay_paymethod_money);//现金券
		orderpay.setPaystatus(Orderpay.orderpay_paystatus_y);
		orderpay.setTradeNo(Orderpay.orderpay_paymethod_money+"_"+RandomUtill.randomCharacter());
		orderpayDao.update(orderpay);
		//减去积分
		if(order.getCutPointFree()>0) {
			accountService.updatePoint(order);
		}
		//减掉消费券
		if(order.getCutShopFree()>0) {
			accountService.updateWallet(order);
		}
		return true;
	}
	
	/**
	 * 订单是否存在
	 * @param order
	 * @return
	 */
	private Boolean isExistOrder(Order order){
		Order pOrder=new Order(); 
		pOrder.setId(order.getId());
		pOrder.setStatus(Order.order_status_init);
		pOrder.setPaystatus(Order.order_paystatus_n);
        Order _order = selectOne(pOrder);
		return _order==null;
	}
	/**
	 * 创建订单
	 * @return 
	 */
	public synchronized Order  savePrizeOrderInfo(Order order, List<Orderdetail> orderdetailList, Ordership ordership,MebPrize prize) throws Exception {
		if (order == null || orderdetailList == null || orderdetailList.size() == 0 || ordership == null || prize == null) {
			throw new NullPointerException("参数不能为空！");
		}
		MebPrize mebPrize=accountService.getMebPrize(prize);
		if(mebPrize==null || Busi.YES.equals(mebPrize.getIs_send())){
			throw new NullPointerException("无法找到对应的奖品信息！");
		}
		order.setPaystatus(Orderpay.orderpay_paystatus_y);
		order.setPaydate(DateUtil.dateFormat(new Date()));
		order.setStatus(Order.order_status_pass);
		// 创建订单
		int orderID = orderDao.insert(order);
		order.setId(orderID+"");
		
		// 更新奖品表状态
		mebPrize.setIs_send( Busi.YES);
		mebPrize.setOrder_id(orderID+"");
		accountService.updateMebPrize(mebPrize);
		// 创建订单项
		for (int i = 0; i < orderdetailList.size(); i++) {
			Orderdetail orderdetail = orderdetailList.get(i);
			if (order.getPayType() == 3) {
				// 数据库砍库存
				Product product = new Product();
				product.setId(String.valueOf(orderdetail.getProductID()));
				product.setAddSellcount(orderdetail.getNumber());// 增加销量
				productDao.updateStockAfterPaySuccess(product);
				Spec spec = new Spec();
				spec.setId(String.valueOf(orderdetail.getSpecID()));
				spec.setSellCount(orderdetail.getNumber());
				specDao.update(spec);
			}
			orderdetail.setOrderID(orderID);
			orderdetailDao.insert(orderdetail);
		}
		// 创建支付记录对象
		Orderpay orderpay = new Orderpay(); 
		orderpay.setOrderid(order.getId());
		orderpay.setPaystatus(Orderpay.orderpay_paystatus_y);
		orderpay.setPayamount(Double.valueOf(order.getAmount()));
		orderpay.setTradeNo(order.getTradeNo());
		int orderpayID = orderpayDao.insert(orderpay);
		// 记录配送信息
		ordership.setOrderid(String.valueOf(orderID));
		ordershipDao.insert(ordership);
		order.setOrderpayID(String.valueOf(orderpayID));
		
		// 记录订单创建日志
		createOrderLog(order, orderID);
		
		// 抽奖付款记录
		insertOrderlog(orderID+"", "【抽奖确认付款】", order.getAccount(), Orderlog.orderlog_accountType_w);
		return order;
	}
	
	/**
	 * 创建订单
	 */
	public boolean saveOrderInfo(Order order, List<Orderdetail> orderdetailList, Ordership ordership) throws Exception {
		if (order == null || orderdetailList == null || orderdetailList.size() == 0 || ordership == null) {
			throw new NullPointerException("参数不能为空！");
		}
		// 创建订单
		int orderID = orderDao.insert(order);
		order.setId(orderID+"");
		// 创建订单项
		for (int i = 0; i < orderdetailList.size(); i++) {
			Orderdetail orderdetail = orderdetailList.get(i);
			if (order.getPayType() == 3) {
				// 数据库砍库存
				Product product = new Product();
				product.setId(String.valueOf(orderdetail.getProductID()));
				product.setAddSellcount(orderdetail.getNumber());// 增加销量
				productDao.updateStockAfterPaySuccess(product);
				Spec spec = new Spec();
				spec.setId(String.valueOf(orderdetail.getSpecID()));
				spec.setSellCount(orderdetail.getNumber());
				specDao.update(spec);
			}
			orderdetail.setOrderID(orderID);
			orderdetailDao.insert(orderdetail);
		}
		// 创建支付记录对象
		Orderpay orderpay = new Orderpay(); 
		orderpay.setOrderid(order.getId());
		orderpay.setPaystatus(Orderpay.orderpay_paystatus_n);
		orderpay.setPayamount(Double.valueOf(order.getAmount()));
		orderpay.setTradeNo(order.getTradeNo());
		int orderpayID = orderpayDao.insert(orderpay);
		// 记录配送信息
		ordership.setOrderid(String.valueOf(orderID));
		ordershipDao.insert(ordership);
		order.setOrderpayID(String.valueOf(orderpayID));
		//如果直接完成
		// 记录订单创建日志
		createOrderLog(order, orderID);
		return true;
	}

	public boolean createOrder(Order order, List<Orderdetail> orderdetailList, Ordership ordership) throws Exception {
		if (order == null || orderdetailList == null || orderdetailList.size() == 0 || ordership == null) {
			throw new NullPointerException("参数不能为空！");
		}
		// 创建订单
		System.out.println("------ot:" + order.getPayType());
		int orderID = orderDao.insert(order);
		System.out.println("------ot2:" + order.getPayType());
		logger.debug("orderID=" + orderID);

		// 创建订单项
		for (int i = 0; i < orderdetailList.size(); i++) {
			Orderdetail orderdetail = orderdetailList.get(i);
			if (order.getPayType() == 3) {
				// 数据库砍库存
				Product product = new Product();
				product.setId(String.valueOf(orderdetail.getProductID()));
				product.setAddSellcount(orderdetail.getNumber());// 增加销量
				productDao.updateStockAfterPaySuccess(product);
				Spec spec = new Spec();
				spec.setId(String.valueOf(orderdetail.getSpecID()));
				spec.setSellCount(orderdetail.getNumber());
				specDao.update(spec);
			}
			orderdetail.setOrderID(orderID);
			orderdetailDao.insert(orderdetail);
		}
		// 创建支付记录对象
		Orderpay orderpay = new Orderpay();
		orderpay.setOrderid(order.getId());
		orderpay.setPaystatus(Orderpay.orderpay_paystatus_n);
		orderpay.setPayamount(Double.valueOf(order.getAmount()));
		if (1 == order.getPayType()) {
			orderpay.setPaymethod(Orderpay.orderpay_paymethod_alipayescow);
			int orderpayID = orderpayDao.insert(orderpay);
			logger.debug("orderpayID=" + orderpayID);
			order.setOrderpayID(String.valueOf(orderpayID));
			// 记录配送信息
			ordership.setOrderid(String.valueOf(orderID));
			ordershipDao.insert(ordership);
		} else if (2 == order.getPayType()) {
			orderpay.setPaymethod(Orderpay.orderpay_paymethod_weixin);
			int orderpayID = orderpayDao.insert(orderpay);
			logger.debug("orderpayID=" + orderpayID);
			order.setOrderpayID(String.valueOf(orderpayID));
			// 记录配送信息
			ordership.setOrderid(String.valueOf(orderID));
			ordershipDao.insert(ordership);
		} else if (3 == order.getPayType()) {
			orderpay.setPaymethod(Orderpay.orderpay_paymethod_afterpay);
			ordership.setOrderid(String.valueOf(orderID));
			ordershipDao.insert(ordership);
		} else if (4 == order.getPayType()) {
			orderpay.setPaymethod(Orderpay.orderpay_paymethod_money);//现金券
			orderpay.setPaystatus(Orderpay.orderpay_paystatus_y);
			int orderpayID = orderpayDao.insert(orderpay);
			logger.debug("orderpayID=" + orderpayID);
			order.setOrderpayID(String.valueOf(orderpayID));
			// 记录配送信息
			ordership.setOrderid(String.valueOf(orderID));
			ordershipDao.insert(ordership);
		} else if (5 == order.getPayType()) {
			orderpay.setPaymethod(Orderpay.orderpay_paymethod_ticket);// 认种券
			orderpay.setPaystatus(Orderpay.orderpay_paystatus_y);
			int orderpayID = orderpayDao.insert(orderpay);
			logger.debug("orderpayID=" + orderpayID);
			order.setOrderpayID(String.valueOf(orderpayID));
			// 记录配送信息
			ordership.setOrderid(String.valueOf(orderID));
			ordershipDao.insert(ordership);
		} else {
			orderpay.setPaymethod("other");
			int orderpayID = orderpayDao.insert(orderpay);
			logger.debug("orderpayID=" + orderpayID);
			order.setOrderpayID(String.valueOf(orderpayID));
			// 记录配送信息
			ordership.setOrderid(String.valueOf(orderID));
			ordershipDao.insert(ordership);
		}
		// 记录订单创建日志
		createOrderLog(order, orderID);
		return true;
	}

	/**
	 * 记录订单创建日志
	 * @param order
	 * @param orderID
	 */
	private void createOrderLog(Order order, int orderID) {
		Orderlog orderlog = new Orderlog();
		orderlog.setOrderid(String.valueOf(orderID));
		orderlog.setAccount(order.getAccount());
		orderlog.setContent("【创建订单】用户创建订单。订单总金额：" + order.getAmount());
		orderlog.setAccountType(Orderlog.orderlog_accountType_w);
		orderlogDao.insert(orderlog);
	}

	@Override
	public List<Order> selectOrderInfo(Order order) {
		return orderDao.selectOrderInfo(order);
	}
	
	@Override
	public MebStatistics selectMebStatistics(String account) {
		return orderDao.selectMebStatistics(account);
	}
	// @Override
	// public boolean updateOrderStatus(Order order) {
	// if(order==null){
	// throw new NullPointerException("参数不能为空！");
	// }
	//
	// Orderpay orderpay = orderpayDao.selectById(order.getOrderpayID());
	// if(orderpay==null){
	// throw new NullPointerException("根据支付记录号查询不到支付记录信息！");
	// }
	// String orderid = orderpay.getOrderid();//订单ID
	//
	// //更新支付记录为成功支付
	// Orderpay orderpay2 = new Orderpay();
	// orderpay2.setId(order.getOrderpayID());
	// orderpay2.setTradeNo(order.getTradeNo());
	// orderpay2.setPaystatus(Orderpay.orderpay_paystatus_y);
	// orderpayDao.update(orderpay2);
	//
	// //更新订单的支付状态为成功支付
	// order.setId(orderid);
	// order.setPaystatus(Order.order_paystatus_y);
	// orderDao.update(order);
	// return true;
	// }

	@Override
	public boolean alipayNotify(String trade_status, String refund_status, String out_trade_no, String trade_no) {
		try {
			return alipayNotify0(trade_status, refund_status, out_trade_no, trade_no);
		} catch (Exception e) {
			logger.debug(">>>alipayNotify...Exception..");
			e.printStackTrace();
			return false;
		}
	}

	@Override
	public boolean alipayNotify(String trade_status, String refund_status, String out_trade_no, String trade_no, int type) {
		try {
			return alipayNotify0(trade_status, refund_status, out_trade_no, trade_no, type);
		} catch (Exception e) {
			logger.debug(">>>alipayNotify...Exception..");
			e.printStackTrace();
			return false;
		}
	}

	private boolean alipayNotify0(String trade_status, String refund_status, String out_trade_no, String trade_no) {
		try {
			return alipayNotify0(trade_status, refund_status, out_trade_no, trade_no, 1);
		} catch (Exception e) {
			logger.debug(">>>alipayNotify...Exception..");
			e.printStackTrace();
			return false;
		}

	}

	private boolean alipayNotify0(String trade_status, String refund_status, String out_trade_no, String trade_no, int type) {
		String zf = "";
		if (1 == type) {
			zf = "支付宝";
		} else if (2 == type) {
			zf = "微信";
		} else if (3 == type) {
			zf = "货到付款";
		} else {
			zf = "其它";
		}
		synchronized (FrontContainer.alipay_notify_lock) {
			logger.debug("trade_status = " + trade_status + ",refund_status = " + refund_status + ",out_trade_no = " + out_trade_no + ",trade_no = " + trade_no);
			if ((StringUtils.isBlank(trade_status) && StringUtils.isBlank(refund_status)) || (StringUtils.isBlank(out_trade_no) && StringUtils.isBlank(trade_no))) {
				logger.debug("请求非法!");
				return false;
			}
			String orderpayID = null;
			Orderpay orderpay = null;
			if (out_trade_no.startsWith("pay")) {
				// 此处做一个说明,localhost或127.0.0.1下的订单的请求发给支付宝的商户订单号都是test开头的，正式的都是非test开头的。
				// 可以参见OrdersAction.createPayInfo()方法。
				orderpayID = out_trade_no.substring(out_trade_no.lastIndexOf("_") + 1);
				logger.error("orderpayID = " + orderpayID);
				orderpay = orderpayDao.selectById(orderpayID);
			} else if (out_trade_no.startsWith("weixin")) {

				orderpayID = out_trade_no.substring(out_trade_no.lastIndexOf("_") + 1);
				logger.error("orderpayID = " + orderpayID);
				orderpay = orderpayDao.selectById(orderpayID);

			} else {
				orderpayID = out_trade_no;
			}

			if (orderpay == null) {
				throw new NullPointerException("根据支付记录号查询不到支付记录信息！");
			}
			String orderid = orderpay.getOrderid();// 订单ID
			String content = null;

			if (StringUtils.isNotBlank(refund_status)) {
				/**
				 * 退款流程
				 */
				if (refund_status.equals("WAIT_SELLER_AGREE")) {// 等待卖家同意退款 ==>卖家需处理
					content = "【" + zf + "异步通知-->退款流程】等待卖家同意退款(WAIT_SELLER_AGREE)。";

				} else if (refund_status.equals("WAIT_BUYER_RETURN_GOODS")) {// 卖家同意退款，等待买家退货 ==>通知买家退货，此 可以发站内信、短信、或邮件 通知对方
					content = "【" + zf + "异步通知-->退款流程】退款协议达成，等待买家退货(WAIT_BUYER_RETURN_GOODS)。";

				} else if (refund_status.equals("WAIT_SELLER_CONFIRM_GOODS")) {// 买家已退货，等待卖家收到退货 ==>支付宝会通知卖家
					content = "【" + zf + "异步通知-->退款流程】等待卖家收货(WAIT_SELLER_CONFIRM_GOODS)。";

				} else if (refund_status.equals("REFUND_SUCCESS")) {// 卖家收到退货，退款成功，交易关闭 ==>卖家登陆支付宝，确认OK。
					// http://club.alipay.com/simple/?t9978565.html
					content = "【" + zf + "异步通知-->退款流程】退款成功(REFUND_SUCCESS)。";

				} else if (refund_status.equals("REFUND_CLOSED")) {// 卖家收到退货，退款成功，交易关闭 ==>卖家登陆支付宝，确认OK。
					// http://club.alipay.com/simple/?t9978565.html
					content = "【" + zf + "异步通知-->退款流程】退款关闭(REFUND_CLOSED)。";

				} else if (refund_status.equals("SELLER_REFUSE_BUYER")) {// 卖家收到退货，退款成功，交易关闭 ==>卖家登陆支付宝，确认OK。
					// http://club.alipay.com/simple/?t9978565.html
					content = "【" + zf + "异步通知-->退款流程】卖家不同意协议，等待买家修改(SELLER_REFUSE_BUYER)。";
				} else {
					// 一般不会出现
					content = "【" + zf + "异步通知-->退款流程】未知。refund_status = " + refund_status;
				}
				updateRefundStatus(orderid, refund_status);
			} else if (StringUtils.isNotBlank(trade_status)) {
				/**
				 * 交易流程
				 */
				if (trade_status.equals("WAIT_BUYER_PAY")) {// 等待买家付款
					content = "【" + zf + "异步通知】等待买家付款(WAIT_BUYER_PAY)。";

				} else if (trade_status.equals("WAIT_SELLER_SEND_GOODS") || trade_status.equals("TRADE_SUCCESS")) {// TRADE_SUCCESS直接支付
					if (orderpay.getPaystatus().equals(Orderpay.orderpay_paystatus_y)) {
						// 由于支付宝的同步通知、异步通知，那么WAIT_SELLER_SEND_GOODS的时候会有2次通知，所以需要synchronized处理好,保证订单状态和日志的一致性。
						return true;
					}

					content = "【" + zf + "异步通知】已付款，等待卖家发货(WAIT_SELLER_SEND_GOODS)。";

					// 更新支付记录为【成功支付】
					// Orderpay orderpay2 = new Orderpay();
					// orderpay.setId(orderpayID);
					orderpay.setTradeNo(trade_no);
					orderpay.setPaystatus(Orderpay.orderpay_paystatus_y);
					orderpayDao.update(orderpay);

					/**
					 * 真实砍库存，并同步减少内容库存数
					 */
					logger.debug("真实砍库存，并同步减少内容库存数...");
					Orderdetail orderdetail = new Orderdetail();
					orderdetail.setOrderID(Integer.valueOf(orderid));
					List<Orderdetail> orderdetailList = orderdetailDao.selectList(orderdetail);
					logger.debug("orderdetailList = " + orderdetailList.size());
					String lowStocks = null;// 订单是否缺货记录
					// int score = 0;//商品积分汇总
					for (int i = 0; i < orderdetailList.size(); i++) {
						Orderdetail detailInfo = orderdetailList.get(i);
						String productID = String.valueOf(detailInfo.getProductID());

						// 内存砍库存呢

						Integer conunt = specDao.selectStockById(detailInfo.getSpecID());
						if (conunt >= detailInfo.getNumber()) {

							// 数据库砍库存
							Product product = new Product();
							product.setId(productID);
							// product.setStock(product.getStock()-detailInfo.getNumber());
							product.setAddSellcount(detailInfo.getNumber());// 增加销量
							productDao.updateStockAfterPaySuccess(product);
							Spec spec = new Spec();
							spec.setId(String.valueOf(detailInfo.getSpecID()));
							spec.setSellCount(detailInfo.getNumber());

							specDao.update(spec);

						} else {
							lowStocks = Order.order_lowStocks_y;

							// 记录库存不足
							Orderdetail od = new Orderdetail();
							od.setId(detailInfo.getId());
							od.setLowStocks(Orderdetail.orderdetail_lowstocks_y);
							orderdetailDao.update(od);
						}
					}

					// 更新订单的支付状态为【已支付】
					Order order = new Order();
					order.setId(orderid);
					order = orderDao.selectOne(order);
					if (lowStocks != null) {
						order.setLowStocks(Order.order_lowStocks_y);
					}
					order.setPaystatus(Order.order_paystatus_y);
					order.setStatus("pass");
					orderDao.update(order);

				} else if (trade_status.equals("WAIT_BUYER_CONFIRM_GOODS")) {// 已发货，等待买家确认收货
					content = "【" + zf + "异步通知】已发货，等待买家确认收货(WAIT_BUYER_CONFIRM_GOODS)。";
					// 更新订单状态为【已发货】
					Order order = orderDao.selectById(orderid);
					if (order == null) {
						throw new NullPointerException("根据订单号查询不到订单信息，orderid=" + orderid);
					}

					logger.debug("order.getStatus()" + order.getStatus() + ",trade_status=WAIT_BUYER_CONFIRM_GOODS");

					Orderlog orderlog = new Orderlog();
					orderlog.setContent(content);
					orderlog.setAccount(order.getAccount());
					// 临时解决办法,防止此日志重复记录.
					if (orderlogDao.selectCount(orderlog) > 0) {
						return true;
					}

					// if(order.getStatus().equals(Order.order_status_send)){
					// //当前订单状态已经是这个状态了，无需重复操作。
					// return true;
					// }

					// 防止由于支付宝异步消息的先后顺序，导致把订单的状态更新混乱了。
					if (order.getStatus().equals(Order.order_status_pass)) {
						order = new Order();
						order.setId(orderid);
						order.setStatus(Order.order_status_send);
						orderDao.update(order);
					}
				} else if (trade_status.equals("TRADE_FINISHED")) {// 交易完成
					content = "【" + zf + "异步通知】交易完成(TRADE_FINISHED)。";

					Order order = orderDao.selectById(orderid);
					if (order == null) {
						throw new NullPointerException("根据订单号查询不到订单信息，orderid=" + orderid);
					}

					// 订单结束后，订单上面赠送的积分都成功转移到用户账户上。
					Account acc = new Account();
					acc.setAccount(order.getAccount());
					acc.setAddScore(order.getScore() - order.getAmountExchangeScore());// 支付完成，扣除订单消耗的积分
					accountService.updateScore(acc);

					order = new Order();
					order.setId(orderid);
					order.setStatus(Order.order_status_sign);
					orderDao.update(order);

				} else {
					// 一般不会出现
					content = "【" + zf + "异步通知】未知。trade_status = " + trade_status;
				}
			} else {
				throw new RuntimeException("运行异常!");
			}

			/**
			 * 以上代码,如不可以返回都会走到此处,记录下日志.
			 */
			insertOrderlog(orderid, content, "alipay_notify", Orderlog.orderlog_accountType_p);

			return true;
		}
	}

	/**
	 * 更新订单的退款状态
	 * 
	 * @param orderid
	 *            订单ID
	 * @param refundStatus
	 *            退款状态
	 */
	private void updateRefundStatus(String orderid, String refundStatus) {
		Order order = new Order();
		order.setId(orderid);
		order.setRefundStatus(refundStatus);
		orderDao.update(order);
		// 记录订单创建日志
		Orderlog orderlog = new Orderlog();
		orderlog.setOrderid(String.valueOf(orderid));
		orderlog.setAccount(order.getAccount());
		orderlog.setContent("更新订单的退款状态");
		orderlog.setAccountType(Orderlog.orderlog_accountType_w);
		orderlogDao.insert(orderlog);
	}

	/**
	 * 插入订单操作日志
	 * 
	 * @param orderid
	 *            订单ID
	 * @param content
	 *            日志内容
	 */
	public void insertOrderlog(String orderid, String content, String account, String accountType) {
		Orderlog orderlog = new Orderlog();
		orderlog.setOrderid(orderid);// 订单ID
		orderlog.setAccount(account);// 操作人账号
		orderlog.setContent(content);// 日志内容
		orderlog.setAccountType(accountType);
		orderlogDao.insert(orderlog);
	}

	@Override
	public OrderSimpleReport selectOrdersSimpleReport(String account) {
		return orderDao.selectOrdersSimpleReport(account);
	}
}
