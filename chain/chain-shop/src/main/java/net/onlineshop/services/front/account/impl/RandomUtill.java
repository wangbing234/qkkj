package net.onlineshop.services.front.account.impl;

public class RandomUtill {

	private static final String MAPPING_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
	private static final int SQUARES1 = MAPPING_STRING.length();
	private static final int SQUARES3 = (int) Math.pow(SQUARES1, 3);
	private static final int SQUARES2 = (int) Math.pow(SQUARES1, 2);
	private static final int SQUARES4 = (int) Math.pow(SQUARES1, 4);

	public static void main(String[] args) {
		for (int i = 0; i < 100; i++) {
			randomCharacter();
		}
	}

	/**
	 * 随机4位字符或数字
	 * 
	 * @return
	 */
	public static String randomCharacter() {
		int randomNum = (int) Math.round(Math.random() * SQUARES4);
		int l1 = randomNum / SQUARES3;
		randomNum = randomNum % SQUARES3;
		int l2 = randomNum / SQUARES2;
		randomNum = randomNum % SQUARES2;
		int l3 = randomNum / SQUARES1;
		int l4 = randomNum % SQUARES1;
//		String result = l1 + "" + l2 + "" + l3 + "" + l4;
		String result35 = "" + MAPPING_STRING.charAt(l1) + MAPPING_STRING.charAt(l2) + MAPPING_STRING.charAt(l3) + MAPPING_STRING.charAt(l4);
//		System.out.println(result + "===" + result35);
		return result35;
	}

}
