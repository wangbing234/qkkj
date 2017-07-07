package net.onlineshop.services.manage.order.dao;

import java.util.List;
import net.onlineshop.core.DaoManager;
import net.onlineshop.services.manage.order.bean.Order;
import net.onlineshop.services.manage.order.bean.OrderQuery;
import net.onlineshop.services.manage.order.bean.OrdersReport;
import net.onlineshop.services.manage.orderdetail.bean.Orderdetail;
import net.onlineshop.web.action.manage.report.ReportInfo;

public interface OrderDao extends DaoManager<Order> {
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

	List<Order> selectCancelList(Order order);
	
	List<Orderdetail> selectSendList(Order order);

	void updatePayMonery(Order e);

	OrdersReport loadOrdersReport();

	List<OrderQuery> selectExportList(Order order);
	
	List<OrderQuery> selectExportFinanceList(Order order);
	
}
