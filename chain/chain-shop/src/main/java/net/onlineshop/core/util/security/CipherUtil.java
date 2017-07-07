package net.onlineshop.core.util.security;

import java.security.Key;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESedeKeySpec;

import org.apache.commons.codec.binary.Base64;

public class CipherUtil {

	private static final String ALGORITHM_SHA1 = "SHA1";
	private static final String ALGORITHM_DESede = "DESede";
	private static final String ALGORITHM_RSA = "RSA";
	private static final String ALGORITHM_MD5 = "MD5";

	// IWAP使用的DESede密钥
	private static final byte[] IWAP_KEY = { 79, 62, 93, 38, -125, -45, -70, -104, -99, -85, -33, -70, -122, -71, 109, -51, -23, 121, -29, 73, -42, 118, 42, -23 };
	private static final char[] HEX_DIGITS = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };

	public static void main(String[] args) throws Exception {
//		String plain = "Root@123";
//		System.out.println(encryptIWAP(plain));
		String p=encodePassword("Qkkj654321","15527592557");
		System.out.println(p);
	}

	
	public static String encodePassword(String pwd, String salt) {
		if (pwd.length() != 32) { // 未加密md5
			pwd = CipherUtil.encryptMd5(pwd);
		}
		if (salt.length() < 3) {
			return CipherUtil.encryptMd5(salt + pwd);
		} else {
			return CipherUtil.encryptMd5(salt.substring(0, 3) + pwd + salt.substring(3));
		}
	}
	
	// MD5
	public static String encryptMd5(String plain) {
		try {
			return getFormattedText(MessageDigest.getInstance(ALGORITHM_MD5).digest(plain.getBytes()));
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
			return null;
		}
	}

	// SHA1 加密 用于生产数字摘要
	public static byte[] encryptSHA1(byte[] data) throws Exception {
		return MessageDigest.getInstance(ALGORITHM_SHA1).digest(data);
	}

	public static String encryptSHA1(String plain) throws Exception {
		return getFormattedText(MessageDigest.getInstance(ALGORITHM_SHA1).digest(plain.getBytes()));
	}

	// DESede 对称加密
	public static byte[] encryptDESede(byte[] data, Key key) {
		return encrypt(ALGORITHM_DESede, data, key);
	}

	// DESede 加密(IWAP版本)
	public static String encryptIWAP(String plain) {
		byte[] b = encryptDESede(plain.getBytes(), toKey(ALGORITHM_DESede, IWAP_KEY));
		return Base64.encodeBase64String(b);
	}

	// DESede 解密(IWAP版本)
	public static String decryptIWAP(String cipher) {
		try {
			return new String(decryptDESede(Base64.decodeBase64(cipher), IWAP_KEY));
		} catch (Exception e) {
			return null;
		}
	}

	// DESede 解密
	private static byte[] decryptDESede(byte[] data, Key key) throws Exception {
		return decrypt(ALGORITHM_DESede, data, key);
	}

	public static byte[] decryptDESede(byte[] data, byte[] key) throws Exception {
		return decryptDESede(data, toKey(ALGORITHM_DESede, key));
	}

	// RSA 非对称加密
	public static byte[] encryptRSA(byte[] data, Key key) throws Exception {
		return encrypt(ALGORITHM_RSA, data, key);
	}

	// RSA 解密
	public static byte[] decryptRSA(byte[] data, Key key) throws Exception {
		return decrypt(ALGORITHM_RSA, data, key);
	}

	// DESede 生成密钥
	public static Key createDESedeKey() throws Exception {
		KeyGenerator kg = KeyGenerator.getInstance(ALGORITHM_DESede);
		kg.init(168);
		return kg.generateKey();
	}

	// RSA 生成密钥
	public static KeyPair createRSAKey() throws Exception {
		KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance(ALGORITHM_RSA);
		// 初始化密钥对生成器，密钥大小为2048位
		keyPairGen.initialize(2048);
		return keyPairGen.generateKeyPair();
	}

	// 转换二进制密钥 
	private static Key toKey(String algorithm, byte[] key) {
		try {
			//实例化Des密钥  
			DESedeKeySpec dks = new DESedeKeySpec(key);
			//实例化密钥工厂  
			SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(algorithm);
			//生成密钥  
			SecretKey secretKey = keyFactory.generateSecret(dks);
			return secretKey;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * Takes the raw bytes from the digest and formats them correct.
	 *
	 * @param bytes the raw bytes from the digest.
	 * @return the formatted bytes.
	 */
	public static String getFormattedText(byte[] bytes) {
		int len = bytes.length;
		StringBuilder buf = new StringBuilder(len * 2);
		// 把密文转换成十六进制的字符串形式
		for (int j = 0; j < len; j++) {
			buf.append(HEX_DIGITS[(bytes[j] >> 4) & 0x0f]);
			buf.append(HEX_DIGITS[bytes[j] & 0x0f]);
		}
		return buf.toString();
	}

	// 加密
	private static byte[] encrypt(String algorithm, byte[] data, Key key) {
		try {
			Cipher cipher = Cipher.getInstance(algorithm);
			cipher.init(Cipher.ENCRYPT_MODE, key);
			return cipher.doFinal(data);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	// 解密
	private static byte[] decrypt(String algorithm, byte[] data, Key key) {
		try {
			Cipher cipher = Cipher.getInstance(algorithm);
			cipher.init(Cipher.DECRYPT_MODE, key);
			return cipher.doFinal(data);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
