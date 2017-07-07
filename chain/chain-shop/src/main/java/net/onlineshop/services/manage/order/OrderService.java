package net.onlineshop.services.manage.order;

import java.util.List;

import net.onlineshop.core.Services;
import net.onlineshop.core.system.bean.User;
import net.onlineshop.services.manage.order.bean.Order;
import net.onlineshop.services.manage.order.bean.OrderQuery;
import net.onlineshop.services.manage.order.bean.OrdersReport;
import net.onlineshop.services.manage.orderdetail.bean.Orderdetail;
import net.onlineshop.web.action.manage.order.SendParms;
import net.onlineshop.web.action.manage.report.ReportInfo;

public interface OrderService extends Services<Order> {
	/**
	 * 修改订单总金额
	 * 
	 * @param e
	 * @param account
	 */
	void updatePayMonery(Order e, String account);

	/**
	 * 查询2小时内未完全支付的订单，并且是未审核的
	 * 
	 * @param order
	 * @return
	 */
	List<Order> selectCancelList(Order order);
	
	/**
	 * 查询一周内未签收的订单
	 * @param order
	 * @return
	 */
	List<Orderdetail> selectSendList(Order order);
	
	/**
	 * 取消指定ID的订单
	 * 
	 * @param id
	 */
	void cancelOrderByID(String id);

	/**
	 * 查询指定时间范围内的订单的销量情况
	 * 
	 * @param order
	 * @return
	 */
	List<ReportInfo> selectOrderSales(ReportInfo info);

	/**
	 * 查询指定时间范围内的产品的销量情况
	 * 
	 * @param order
	 * @return
	 */
	List<ReportInfo> selectProductSales(ReportInfo info);
	
	/**
	 * 更新订单发货数据
	 * 
	 * @return
	 */
	String updateOrderAndDetail(SendParms op,User user);

	/**
	 * 加载订单报表数据
	 * 
	 * @return
	 */
	OrdersReport loadOrdersReport();

	/**
	 * 导出订单数据
	 * 
	 * @return
	 */
	List<OrderQuery> selectExportList(Order order);
	
	/**
	 * 导出财务报表
	 * 
	 * @return
	 */
	List<OrderQuery> selectExportFinanceList(Order order);
	

}
