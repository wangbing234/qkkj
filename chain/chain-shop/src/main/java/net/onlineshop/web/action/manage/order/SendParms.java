package net.onlineshop.web.action.manage.order;

public class SendParms {
	private int orderID;
	private String orderDetailId;
	private String expressNo;
	private String expressCompanyName;
	private String remarks;
	public SendParms(int orderID,String orderDetailId,String expressNo,String expressCompanyName,String remarks)
	{
		this.orderID=orderID;
		this.orderDetailId=orderDetailId;
		this.expressNo=expressNo;
		this.expressCompanyName=expressCompanyName;
		this.remarks=remarks;
	}
	
	
 
	public int getOrderID() {
		return orderID;
	}



	public void setOrderID(int orderID) {
		this.orderID = orderID;
	}



	public String getOrderDetailId() {
		return orderDetailId;
	}
	public void setOrderDetailId(String orderDetailId) {
		this.orderDetailId = orderDetailId;
	}
	public String getExpressNo() {
		return expressNo;
	}
	public void setExpressNo(String expressNo) {
		this.expressNo = expressNo;
	}
	public String getExpressCompanyName() {
		return expressCompanyName;
	}
	public void setExpressCompanyName(String expressCompanyName) {
		this.expressCompanyName = expressCompanyName;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
}
