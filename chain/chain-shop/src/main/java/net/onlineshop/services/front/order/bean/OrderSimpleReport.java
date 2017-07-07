package net.onlineshop.services.front.order.bean;

import net.onlineshop.core.dao.page.ClearBean;

/**
 * 订单简单报表信息
 * 
 * @author
 * 
 */
public class OrderSimpleReport implements ClearBean {
	private int orderWaitPayCount;
	private int orderCancelCount;
	private int orderCompleteCount;
	private int orderWaitSendCount;
	private int orderWaitReceiveCount;
	private int orderWaitRateCount;
	private int orderWaitAuditingCount;

	public int getOrderWaitPayCount() {
		return orderWaitPayCount;
	}

	public void setOrderWaitPayCount(int orderWaitPayCount) {
		this.orderWaitPayCount = orderWaitPayCount;
	}

	public int getOrderCancelCount() {
		return orderCancelCount;
	}

	public void setOrderCancelCount(int orderCancelCount) {
		this.orderCancelCount = orderCancelCount;
	}

	public int getOrderCompleteCount() {
		return orderCompleteCount;
	}

	public void setOrderCompleteCount(int orderCompleteCount) {
		this.orderCompleteCount = orderCompleteCount;
	}

	public int getOrderWaitSendCount() {
		return orderWaitSendCount;
	}

	public void setOrderWaitSendCount(int orderWaitSendCount) {
		this.orderWaitSendCount = orderWaitSendCount;
	}

	public int getOrderWaitReceiveCount() {
		return orderWaitReceiveCount;
	}

	public void setOrderWaitReceiveCount(int orderWaitReceiveCount) {
		this.orderWaitReceiveCount = orderWaitReceiveCount;
	}

	public int getOrderWaitRateCount() {
		return orderWaitRateCount;
	}

	public void setOrderWaitRateCount(int orderWaitRateCount) {
		this.orderWaitRateCount = orderWaitRateCount;
	}

	@Override
	public String toString() {
		return "OrderSimpleReport [orderWaitPayCount=" + orderWaitPayCount + ", orderCancelCount=" + orderCancelCount + ", orderCompleteCount=" + orderCompleteCount + ", orderWaitSendCount=" + orderWaitSendCount + ", orderCompleteCount=" + orderWaitReceiveCount + ", orderWaitAuditingCount=" + orderWaitAuditingCount + ", orderCompleteCount=" + orderWaitRateCount + "]";
	}

	public int getOrderWaitAuditingCount() {
		return orderWaitAuditingCount;
	}

	public void setOrderWaitAuditingCount(int orderWaitAuditingCount) {
		this.orderWaitAuditingCount = orderWaitAuditingCount;
	}

	public void clear() {
		this.orderWaitPayCount = 0;
		this.orderCancelCount = 0;
		this.orderCompleteCount = 0;
		this.orderWaitSendCount = 0;
		this.orderWaitReceiveCount = 0;
		this.orderWaitRateCount = 0;
		this.orderWaitAuditingCount = 0;

	}

}
