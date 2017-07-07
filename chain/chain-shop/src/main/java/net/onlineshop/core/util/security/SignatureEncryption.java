package net.onlineshop.core.util.security;

import org.apache.commons.codec.digest.DigestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SignatureEncryption {
	
	private static Logger logger = LoggerFactory.getLogger(SignatureEncryption.class);
	
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
	public static void main(String[] args) {
		encodeSign("12", "1434", "true");
	}
}
