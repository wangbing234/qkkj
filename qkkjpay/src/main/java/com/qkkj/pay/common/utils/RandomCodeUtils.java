package com.qkkj.pay.common.utils;
import java.util.Random;

/**
 * 随机码生成类
 */
public class RandomCodeUtils {

	/**
	 * 获n位取随机码
	 * 
	 * @param n
	 *            随机码位数
	 * @return n位随机码
	 */
	public static String getRandomNum(int n) {
		Random random = new Random();
		StringBuffer buf = new StringBuffer();
		for (int i = 0; i < n; i++) {
			buf.append(random.nextInt(10));
		}
		String randomCode = buf.toString();
		return randomCode;
	}

	/**
	 * 获n位取随机码返回的全是小写字母
	 * 
	 * @param n
	 *            随机码位数
	 * @return n位随机码
	 */
	public static String getRandomString(int pwd_len) {
		final int maxNum = 26;
		int i; // 生成的随机数
		int count = 0; // 生成的密码的长度
		char[] str = { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
				'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
				'x', 'y', 'z' };

		StringBuffer pwd = new StringBuffer("");
		Random r = new Random();
		while (count < pwd_len) {
			// 生成随机数，取绝对值，防止生成负数，
			i = Math.abs(r.nextInt(maxNum)); // 生成的数最大为36-1
			if (i >= 0 && i < str.length) {
				pwd.append(str[i]);
				count++;
			}
		}
		return pwd.toString();
	}

	/**
	 * 获得pwd_len位随机码，返回的全是小写字母加数字的组合
	 * 
	 * @param pwd_len
	 *         随机码位数
	 * @return pwd_len位随机码
	 */
	public static String getRandomNumString(int pwd_len) {
		final int maxNum = 36;
		int i; // 生成的随机数
		int count = 0; // 生成的密码的长度
		char[] str = { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
				'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w',
				'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' };

		StringBuffer pwd = new StringBuffer("");
		Random r = new Random();
		while (count < pwd_len) {
			// 生成随机数，取绝对值，防止生成负数，
			i = Math.abs(r.nextInt(maxNum)); // 生成的数最大为36-1
			if (i >= 0 && i < str.length) {
				pwd.append(str[i]);
				count++;
			}
		}
		return pwd.toString();
	}

	public static void main(String[] args) {
		System.out.println(RandomCodeUtils.getRandomNumString(32).toUpperCase());
	}
}