package com.qkkj.pay.common.constants;

public class Constants 
{
	public static final String SUCCESS = "0";
	
	public static final String FAIL = "1";
	
	public static final String DEFAULT_CHARSET = "UTF-8";// 默认字符集
	
	public static final String HTTP_METHOD_GET = "0";//get方式
	
	public static final String HTTP_METHOD_POST = "1";//post方式
	
	//开发商appId
	public static final String APPID = "307110700000140";
	
	//开发商密钥
	public static final String AppSecret = "quq1zrsu2ml0vn1y1pzbzc6upihcs33z";
	
	//获取workKey
	public static final String Get_Wpay_workKey_url = "http://cashzsc.wdepay.cn:20080/Batch/Merwork/GetWorkKey";
	
	//查询订单状态
	public static final String url_queryOrderinfo = "http://cashzsc.wdepay.cn:20080/directpay/queryOrderinfo.do";

	//webpayUrl
	public static final String url_doWebpay = "http://cashzsc.wdepay.cn:20080/WebCashierDesk/unifyWeb/doTrade.do";
	
	//scanPay
	public static final String url_scanpay = "http://cashzsc.wdepay.cn:20080/directpay/payService.do";
	
	//支付成功请求
	public static final String PAYSUCCESS = "true";
	
	//支付成功返回消息
	public static final String PAYSUCCESSRETURN = "success";
	
	//支付成功返回消息
	public static final String PAYFAILEDRETURN = "fail";
	
	//时间格式化 年月日
	public static final String DATAFORMATYMD = "yyyy-MM-dd";
	
	//时间格式化 年月日时分秒
	public static final String DATAFORMATYMDHMS = "yyyy-MM-dd hh:mm:ss";
	
	//阿里支付
	public static final String ALIPAY = "1";
	
	//阿里支付
	public static final String WEIXIN = "2";
	
	//阿里支付
	public static final String UPPAY = "3";
	
	//阿里支付
	public static final String WDEPAY = "4";
	
	public static final String SPECIALCAHR = "[^%!@\\$#^\\&*()._-]{1,}";
	
}