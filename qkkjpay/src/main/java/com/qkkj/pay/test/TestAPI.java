package com.qkkj.pay.test;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.qkkj.pay.common.utils.ConfigLoader;
import com.qkkj.pay.common.utils.HttpClient;

public class TestAPI 
{
	private static Logger logger = LoggerFactory.getLogger(TestAPI.class);	
	public static void main(String[] args) 
	{/*
		logger.debug("main start~~~");
		String url = ConfigLoader.getInstance().getProperty("RETURN_URL");

		Map<String,String> params = new HashMap<String,String>();
		params.put("rp.amount", "1");
		params.put("rp.orderNo", "3465");
		params.put("rp.status", "true");
		params.put("rp.sign", "1");
		
		HttpClient httpClient = new HttpClient();
		System.out.println(httpClient.sendPostRequestMap(url,params));
	*/
		String s = "1496";
		String sg = s.substring(s.length()-6);
		System.out.println(sg);
	}
}
