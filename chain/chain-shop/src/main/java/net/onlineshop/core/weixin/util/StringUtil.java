package net.onlineshop.core.weixin.util;

import java.util.List;
import java.util.regex.Pattern;

/**
 * 类说明
 * 
 * @author 程辉
 * @version V1.0 创建时间：2012-11-23 下午3:39:59
 */
public class StringUtil {

	/**
	 * 用逗号拼接 字符串集合
	 * 
	 * @param strList
	 * @return
	 */
	public static String appendStr(List<String> strList) {

		if (null == strList) {
			return null;
		}

		if (!strList.isEmpty()) {
			StringBuilder sb = new StringBuilder();
			for (String str : strList) {
				sb.append(str);
				sb.append(",");
			}
			return sb.substring(0, sb.lastIndexOf(","));
		}
		return null;
	}

	// 1用JAVA自带的函数
	public static boolean isNumeric1(String str) {
		for (int i = str.length(); --i >= 0;) {
			if (!Character.isDigit(str.charAt(i))) {
				return false;
			}
		}
		return true;
	}

	// 2用正则表达式
	public static boolean isNumeric2(String str) {
		Pattern pattern = Pattern.compile("[0-9]*");
		return pattern.matcher(str).matches();
	}

	// 3用ascii码
	public static boolean isNumeric3(String str) {
		for (int i = str.length(); --i >= 0;) {
			int chr = str.charAt(i);
			if (chr < 48 || chr > 57)
				return false;
		}
		return true;
	}

	/**
	 * 可以判断 负数
	 * 
	 * @param str
	 * @return
	 */
	public static boolean isNumeric4(String str) {
		try {
			Integer.parseInt(str);
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}
}
