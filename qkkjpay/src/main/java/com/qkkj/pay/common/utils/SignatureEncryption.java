package com.qkkj.pay.common.utils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SignatureEncryption {
	
	private static Logger logger = LoggerFactory.getLogger(SignatureEncryption.class);
	
    /**
     * 生成签名结果
     * @param signArr 要签名的数组
     * @return 签名结果字符串
     */
	public static String buildRequestSign(Map<String, String> signArr) {
    	String prestr = createLinkString(signArr);
        String sign = DigestUtils.md5Hex(prestr);
        	
        logger.info("SignatureEncryption -> buildRequestSign end");
        //logger.info("sign签名:"+sign);
        return sign;
    } 
	
	/**
	 * @author smart迅
	 *按照success,app_id,order_no,amount,workkey规则进行排序
	 * @param signArr
	 * @return
	 */
	public static String buildReturnSign(Map<String, String> signArr)
	{
        logger.info("SignatureEncryption -> buildReturnSign start");

		List<String> keys = new ArrayList<String>();
		keys.add("success");
		keys.add("app_id");
		keys.add("order_no");
		keys.add("amount");
		keys.add("workkey");
		
		StringBuffer prestr = new StringBuffer();
        prestr.append("|");

        for (int i = 0; i < keys.size(); i++) {
            String key = keys.get(i);
            String value = signArr.get(key);
            prestr.append(value + "|");  
        }        
		//logger.info(keys.toString());        
		String sign = DigestUtils.md5Hex(prestr.toString());
        logger.debug("SignatureEncryption -> buildReturnSign end");

        //logger.info("sign签名:"+sign);
        return sign;
	}
	
	/** 
     * 把数组所有元素按照签名方法要求的格式拼接成字符串
     * @param params 需要参与字符拼接的参数组
     * @return 拼接后字符串
     */
	public static String createLinkString(Map<String, String> params) {	
		List<String> keys = new ArrayList<String>(params.keySet());
		logger.info(keys.toString());
        Collections.sort(keys);
        logger.info(keys.toString());
        StringBuffer prestr = new StringBuffer();
        prestr.append("|");

        for (int i = 0; i < keys.size(); i++) {
            String key = keys.get(i);
            String value = params.get(key);
            prestr.append(value + "|");  
        }
        //logger.info("sign签名格式字符串 : "+prestr.toString());
        return prestr.toString();
    }
	
	/**
	 * @author smart迅
	 *sign进行加密
	 * @param busiOrder
	 * @param data
	 * @param req
	 * @return
	 */
	public static String encodeSign(String busiOrder,String amount,String success)
	{
		logger.debug("sign encode start ");
		StringBuilder signBuiler = new StringBuilder();
		signBuiler.append(DigestUtils.md5Hex(busiOrder).substring(busiOrder.length(),32-busiOrder.length()));
		signBuiler.append(DigestUtils.md5Hex(amount).substring(busiOrder.length(),31-amount.length()));
		signBuiler.append(DigestUtils.md5Hex(success+busiOrder).substring(busiOrder.length(),30-success.length()));
		String sign =signBuiler.toString();
		logger.info(sign);
		return sign;
	}
}
