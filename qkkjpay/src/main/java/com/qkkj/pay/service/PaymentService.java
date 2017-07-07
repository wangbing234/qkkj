package com.qkkj.pay.service;

import com.qkkj.pay.domain.common.BaseResult;
import com.qkkj.pay.domain.req.PaymentReq;
import com.qkkj.pay.domain.req.PaymentReturnReq;
import com.qkkj.pay.domain.req.QueryOrderInfoReq;
import com.qkkj.pay.domain.rsp.ScanPayRsp;
import com.qkkj.pay.domain.rsp.WebPayRsp;

public interface PaymentService 
{
	public WebPayRsp doWebPay(PaymentReq req);
	//获取work key工作密钥
	public String getWorkKey();
	
	//订单支付成功回调
	public BaseResult payReturn(PaymentReturnReq req) throws Exception;
		
	//根据订单号、商户号，查询订单状态
	public BaseResult getBusiOrderInfo(QueryOrderInfoReq req);		
	
	//发起扫码支付
	public ScanPayRsp doScanPay(PaymentReq req);
	
	//根据订单号查询支付金额
	public String getAmountByOrderNo(String orderNo);
	
	//根据订单号查询回跳地址
	public String getWebPayReturnUrl(String orderNo);
}
