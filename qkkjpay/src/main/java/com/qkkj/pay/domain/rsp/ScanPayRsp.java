package com.qkkj.pay.domain.rsp;

public class ScanPayRsp 
{
	private String retcode;
	
	private String retmsg;
	
	private String retsign;
	
	private String order_no;

	public String getRetcode() {
		return retcode;
	}

	public void setRetcode(String retcode) {
		this.retcode = retcode;
	}

	public String getRetmsg() {
		return retmsg;
	}

	public void setRetmsg(String retmsg) {
		this.retmsg = retmsg;
	}

	public String getRetsign() {
		return retsign;
	}

	public void setRetsign(String retsign) {
		this.retsign = retsign;
	}

	public String getOrder_no() {
		return order_no;
	}

	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}

}
