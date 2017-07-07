package com.qkkj.pay.domain.common;

public enum CommonEnum 
{
	SUCCESS("000000","success"),
	FAIL("50800001","failed"),
	ADD_BUSIORDER_FAILED("50800002","添加商户支付申请失败"),
	ADD_PAYPLATREQDATA_FAILED("50800003","添加支付平台封装数据失败"),
	ADD_LINKEDPAYRETURN_FAILED("50800004","添加统一支付平台回调方法失败"),
	ADD_LINKEDPAYREQ_FAILED("50800005","添加统一支付平台请求数据失败"),
	ORDERISNULL("50800006","所查订单不存在"),
	UPDATEBUSIORDERFAILED("50800007","更新客户端订单状态失败"),
	UPDATEPLATORDERFAILED("50800008","更新支付域订单状态失败"),
	BUSIORDEREXIT("50800009","客户端发起的支付已存在"),
	BUSIORDEREXITPAYEDS("50800010","客户端发起的支付已支付成功"),
	BUSIORDEREXITPAYEDF("50800011","客户端发起的支付已存在且支付失败"),
	GETBUSIORDERFAILED("50800012","支付平台的订单在客户请求表不存在"),
	HTMLAMOUNTCHECKERROR("50800013","支付链接中金额校验异常"),
	WEBPAYERROR("50800014","网页支付必须要有回跳地址"),
	;
	private String retMsg;
	
	private String retCode;
	
	private CommonEnum(String retCode,String retMsg) 
	{
		
		this.retMsg = retMsg;
		this.retCode = retCode;
	}

	public String getRetCode() 
	{
		return retCode;
	}

	public void setRetCode(String retCode) 
	{
		this.retCode = retCode;
	}

	public String getRetMsg() 
	{
		return retMsg;
	}

	public void setRetMsg(String retMsg) 
	{
		this.retMsg = retMsg;
	}
	
	
}
