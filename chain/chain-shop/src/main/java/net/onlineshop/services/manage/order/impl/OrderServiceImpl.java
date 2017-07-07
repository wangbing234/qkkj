package net.onlineshop.services.manage.order.impl;

import java.util.Date;
import java.util.List;
import net.onlineshop.core.ServersManager;
import net.onlineshop.core.system.bean.User;
import net.onlineshop.core.util.DateUtil;
import net.onlineshop.services.manage.order.OrderService;
import net.onlineshop.services.manage.order.bean.Order;
import net.onlineshop.services.manage.order.bean.OrderQuery;
import net.onlineshop.services.manage.order.bean.OrdersReport;
import net.onlineshop.services.manage.order.dao.OrderDao;
import net.onlineshop.services.manage.orderdetail.bean.Orderdetail;
import net.onlineshop.services.manage.orderdetail.dao.OrderdetailDao;
import net.onlineshop.services.manage.orderlog.bean.Orderlog;
import net.onlineshop.services.manage.orderlog.dao.OrderlogDao;
import net.onlineshop.web.action.front.orders.OrderParms;
import net.onlineshop.web.action.manage.order.SendParms;
import net.onlineshop.web.action.manage.report.ReportInfo;
import org.apache.commons.lang.StringUtils;

public class OrderServiceImpl extends ServersManager<Order> implements OrderService {
	private OrderDao orderDao;
	private OrderlogDao orderlogDao;
	private OrderdetailDao orderdetailDao;
	
	public void setOrderlogDao(OrderlogDao orderlogDao) {
		this.orderlogDao = orderlogDao;
	}

	public void setOrderDao(OrderDao orderDao) {
		this.orderDao = orderDao;
	}
	

	public void setOrderdetailDao(OrderdetailDao orderdetailDao) {
		this.orderdetailDao = orderdetailDao;
	}

	@Override
	public void updatePayMonery(Order e, String account) {

		if (StringUtils.isBlank(e.getId()) || StringUtils.isBlank(account)) {
			throw new NullPointerException("修改失败，参数不能为空！");
		}
		if (Double.valueOf(e.getAmount()) < 0) {
			throw new NullPointerException("修改失败，订单总金额不能小于0!");
		}

		if (StringUtils.isBlank(e.getUpdatePayMoneryRemark())) {
			insertOrderlog(e.getId(), "【修改订单总金额】总金额修改为：" + e.getAmount(), account);
		} else {
			insertOrderlog(e.getId(), "【修改订单总金额】总金额修改为：" + e.getAmount() + "，修改人输入备注：" + e.getUpdatePayMoneryRemark(), account);
		}

		e.setUpdateAmount("y");// 标记订单总金额被后台管理员修改过
		e.setPtotal(e.getAmount());// 商品总金额设置为订单总支付金额
		e.setFee("0");// 配送费设置为0
		orderDao.updatePayMonery(e);
	}

	/**
	 * 插入订单操作日志
	 * 
	 * @param orderid
	 *            订单ID
	 * @param content
	 *            日志内容
	 */
	private void insertOrderlog(String orderid, String content, String account) {
		Orderlog orderlog = new Orderlog();
		orderlog.setOrderid(orderid);// 订单ID
		orderlog.setAccount(account);// 操作人账号
		orderlog.setContent(content);// 日志内容
		orderlog.setAccountType(Orderlog.orderlog_accountType_m);
		orderlogDao.insert(orderlog);
	}

	@Override
	public List<Order> selectCancelList(Order order) {
		return orderDao.selectCancelList(order);
	}
	
	@Override
	public List<Orderdetail> selectSendList(Order order) {
		return orderDao.selectSendList(order);
	}

	@Override
	public void cancelOrderByID(String id) {
		if (StringUtils.isBlank(id)) {
			return;
		}
		Order order = new Order();
		order.setId(id);
		order.setStatus(Order.order_status_cancel);
		order.setPaystatus(Order.order_paystatus_n);
		orderDao.update(order);
		insertOrderlog(id, "【系统取消】2小时未完全支付并且未审核的订单，系统自动将其取消。", "system");
	}

	@Override
	public List<ReportInfo> selectOrderSales(ReportInfo info) {
		return orderDao.selectOrderSales(info);
	}

	@Override
	public List<ReportInfo> selectProductSales(ReportInfo info) {
		return orderDao.selectProductSales(info);
	}

	@Override
	public OrdersReport loadOrdersReport() {
		return orderDao.loadOrdersReport();
	}

	@Override
	public List<OrderQuery> selectExportList(Order order) {
		return orderDao.selectExportList(order);
	}

	@Override
	public List<OrderQuery> selectExportFinanceList(Order order) {
		// TODO Auto-generated method stub
		return orderDao.selectExportFinanceList(order);
	}

	@Override
	public String updateOrderAndDetail(SendParms op,User user) {
		// TODO Auto-generated method stub
		Orderdetail orderdetailParms=new Orderdetail();
		orderdetailParms.setOrderID(op.getOrderID());
		orderdetailParms.setId(op.getOrderDetailId());
		orderdetailParms.setStatus(Order.order_status_pass);
		Orderdetail orderdetail = orderdetailDao.selectOne(orderdetailParms);
		if(null==orderdetail) {
			return "当前发货状态异常";
		}
		//更新订单明细
		orderdetail.setStatus(Order.order_status_send);
		orderdetail.setExpressNo(op.getExpressNo());
		orderdetail.setSenddate(DateUtil.dateFormat(new Date()));
		orderdetail.setExpressCompanyName(op.getExpressCompanyName());
		orderdetailDao.update(orderdetail);
		insertOrderlog(orderdetail.getOrderID()+"", "【产品发货成功】,产品名称："+orderdetail.getProductName(), user.getUsername());
		//查询订单，判断订单发货状态
		Orderdetail orderdetailParms2=new Orderdetail();
		orderdetailParms2.setOrderID(op.getOrderID());
		List<Orderdetail> orderdetailList = orderdetailDao.selectList(orderdetailParms2);
		Order orderTemp = new Order();
		orderTemp.setStatus(Order.order_status_pass);
		orderTemp.setId(op.getOrderID()+"");
		Order order = selectOne(orderTemp);
		if(orderdetailList.isEmpty())
			return "无订单明细！";
		if(orderdetailList.size()==1){
			updateOrderStatus(order,user);
			return null;
		}
		else
		{
			boolean isAllSend=true;
			for (Orderdetail orderdetail2 : orderdetailList) {
				String oStatus=orderdetail2.getStatus();
				if(!Order.order_status_send.equals(oStatus) && !Order.order_status_sign.equals(oStatus)){
					isAllSend=false;
				}
			}
			if(isAllSend){
				updateOrderStatus(order,user);
			}
		}
		return null;
	}

	/**
	 * 更新发货状态
	 * @param order
	 */
		private void updateOrderStatus(Order order,User user){
			order.setStatus(Order.order_status_send);
			order.setSenddate(DateUtil.dateFormat(new Date())); 
			update(order);
			insertOrderlog(order.getId(), "【订单发货成功】,订单状态为发货。", user.getUsername());
		}
}
