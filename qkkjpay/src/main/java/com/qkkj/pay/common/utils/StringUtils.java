package com.qkkj.pay.common.utils;

import java.util.Random;

/**
 * @ClassName StringUtils
 * @Description 
 * @author HANBO
 * @date 2016年5月20日上午10:40:38
 *
 */
public class StringUtils {

	/**
	 * 
	* @description: 对象为空转为空字符串
	* @param obj
	* @return String   
	* @author HANBO 
	* @date 2016年5月17日上午9:19:41
	 */
	public static String  convertStr(Object obj){
		if(obj == null){
			return "";
		}else{
			return obj.toString();
		}
	}
	
	/**
	 * 判断对象是否是null
	 *
	 * @param obj
	 * @return true false
	 */
	public static boolean isNull(Object obj){
		return obj == null ? true : false;
	}
	/**
	 * 检查字符串是否为空
	 *
	 * @param checkStr
	 *            检查的字符串
	 * @return true false
	 */
	public static boolean isBlank(Object checkStr){
		if ("".equals(checkStr)) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * 检查字符串 是否为空字符串 或者是null
	 *
	 * @param checkStr
	 *            检查的字符串
	 * @return true false
	 */
	public static boolean isBlankOrNull(Object checkStr){
		if (isNull(checkStr) || isBlank(checkStr)) {
			return true;
		} else {
			return false;
		}
	}
	
	/*
	 * 在前补0
	 */
	public static String pad0Front(String src,int totalLength){
		StringBuffer sb = new StringBuffer();
		int count = totalLength - src.length();
		for (int i = 0; i < count; i++) {
			sb.append("0");
		}
		sb.append(src);
		return sb.toString();
	}
	
	
	/**  
	* @description: 产生6位随机码
	* @return String   
	* @author HANBO 
	* @date 2016年5月20日上午10:40:39
	*/ 
	public static String randomOf6Str(){

		Random random = new Random();
		StringBuffer buffer = new StringBuffer();
		for (int i = 0; i <6; i++) {
			buffer.append(random.nextInt(9));
		}
		return buffer.toString();
	}
	
//	
//	/**
//	 * native http请求数字签名
//	 * @param paramMap 请求参数
//	 * @return 数字签名
//	 */
//	public static String getSignValue(ListOrderedMap paramMap){
//		Properties p = GetProp.getProp();
//		String signValue = "";
//		String string1 = "";
//		String[] strs = new String[paramMap.size()];
//		for (int i = 0; i < paramMap.size(); i++) {
//			strs[i] = (String) paramMap.get(i);
//		}
//		Arrays.sort(strs);
//		for (int i = 0; i < strs.length; i++) {
//			string1 = string1 + strs[i] + "=" + paramMap.get(strs[i]) + "&";
//		}
//		string1 = string1.substring(0, string1.length()-1);
//		System.out.println("string1=="+string1);
//
//		String stringSignTemp = string1 + "&key=" + p.getProperty("workKey");
//
//		Md5EncoderUtils md5 = new Md5EncoderUtils();
//
//		signValue = md5.encode(stringSignTemp).toUpperCase();
//		System.out.println("signValue=="+signValue);
//
//		return signValue;
//	}
	
}
