package com.qkkj.pay.test;

import com.qkkj.pay.common.utils.HttpClient;
import com.qkkj.pay.domain.req.PaymentReq;
import com.qkkj.pay.domain.req.PaymentReturnReq;

public class AppTest 
{
	public static void main( String[] args ) {
		testReturnPay();
    }
	
	private static void testPay(){
		String channel = "1";
		String amount = "1";
		String orderNo = "435436456456456";
		String busiType = "1";
		
		PaymentReq pr = new PaymentReq();
		pr.setAmount(amount);
		pr.setBusiType(busiType);
		pr.setChannel(channel);
		pr.setOrder_no(orderNo);
		
		//String url = "http://localhost:80/index/now";
		String payUrl = "http://127.0.0.1:5555/payment/webpay";
		pr.setReturnUrl("http://127.0.0.1:5555/payment/webpay");
		HttpClient httpClient = new HttpClient();
		
		String strr = httpClient.sendPostRequest(payUrl,pr);
		System.out.println(strr);
	}
	
	private static void testReturnPay(){
		PaymentReturnReq re=new PaymentReturnReq();
		re.setSuccess("true");
		HttpClient httpClient = new HttpClient();
		String payUrl = "http://127.0.0.1:5555/payment/payreturn";
		String strr = httpClient.sendPostRequest(payUrl,re);
		System.out.println(strr);
	}
}
