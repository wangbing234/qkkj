package net.onlineshop.core.task;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.onlineshop.core.listener.CoreParamCache;
import net.onlineshop.core.oscache.FrontCache;
import net.onlineshop.core.oscache.ManageCache;
import net.onlineshop.services.front.account.AccountService;
import net.onlineshop.services.manage.order.OrderService;
import net.onlineshop.services.manage.order.bean.Order;
import net.onlineshop.services.manage.orderdetail.OrderdetailService;
import net.onlineshop.services.manage.orderdetail.bean.Orderdetail;

/**
 * 定时任务
 *
 */
public class TimingJob {
	
	private static final Logger logger = LoggerFactory.getLogger(TimingJob.class);
	private OrderService orderService;
	private AccountService accountService;
	private ManageCache manageCache;
	private FrontCache frontCache;
	private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	
	/**
	 * 每分钟任务<br>
	 * 留用测试
	 
	public void minutely() {
		logger.info("=====minutely======");
	}
	 */
	/**
	 * 每小时任务<br>
	 * 任务一：取消订单
	 * 任务二：加载前后台缓存
	 */
	public void hourly() throws Exception {
		cancelOrders();
		manageCache.loadAllCache();
		frontCache.loadAllCache();
	}
	
	/**
	 * 每天任务<br>
	 * 任务一：自动签收订单
	 */
	public void daily() {
		autoSignOrder();
	}
	
	/**
	 * 订单定时签收，7天
	 */
	private void autoSignOrder()
	{
		Integer autoSignOrder=(Integer)CoreParamCache.getInstance().get("autoSignOrder");
		Order order = new Order();
		order.setStartDate(sdf.format(DateUtils.addHours(new Date(), -autoSignOrder*24)));
		List<Orderdetail> list = orderService.selectSendList(order);
		if (list != null && !list.isEmpty()) {
			logger.debug("定时执行签收订单，个数：" + list.size());
			for (Orderdetail orderInfo : list) {
				accountService.updateOrderToCompete(orderInfo.getId(),3);
			}
		}
	}
	
	
	/**
	 * 订单取消时定时器
	 */
	private void cancelOrders(){
		Integer cancelOrderTime=(Integer)CoreParamCache.getInstance().get("cancelOrderTime");
		Order order = new Order();
		order.setStartDate(sdf.format(DateUtils.addHours(new Date(), -cancelOrderTime)));
		List<Order> list = orderService.selectCancelList(order);
		if (list != null && !list.isEmpty()) {
				logger.debug("定时执行取消订单，个数：" + list.size());
				for (Order orderInfo : list) {
					orderService.cancelOrderByID(orderInfo.getId());
				}
			}
	}
	
	public void setManageCache(ManageCache manageCache) {
		this.manageCache = manageCache;
	}

	public void setFrontCache(FrontCache frontCache) {
		this.frontCache = frontCache;
	}
	public void setOrderService(OrderService orderService) {
		this.orderService = orderService;
	}

	
	public void setAccountService(AccountService accountService) {
		this.accountService = accountService;
	}
	
	
}
