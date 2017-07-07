package net.onlineshop.core.weixin.util;

import java.util.Date;

import net.onlineshop.core.DateUtil;
import net.onlineshop.core.weixin.bean.AccessToken;

/**
 * 定时获取微信access_token的线程
 * 
 * @author WUKZ
 * @date 2015-03-20
 */
public class TokenThread implements Runnable {

	public static AccessToken accessToken = null;

	public void run() {
		while (true) {

			try {
				accessToken = WeixinUtils.getAccessToken(WeixinUtils.appid, WeixinUtils.appsecret);

				if (null != accessToken) {
					System.out.println(DateUtil.dateFormat(new Date(), DateUtil.LONG_MODEL) + "获取access_token成功，有效时长" + accessToken.getExpiresIn() + "秒 token:" + accessToken.getToken());

					Thread.sleep(3600 * 1000);
				} else {

					Thread.sleep(50 * 1000);
				}
			} catch (InterruptedException e) {
				try {
					Thread.sleep(50 * 1000);
				} catch (InterruptedException e1) {
					System.out.println(e1);
				}
				System.out.println(e);
			}
		}
	}
}
