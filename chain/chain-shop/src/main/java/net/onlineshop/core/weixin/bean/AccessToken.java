package net.onlineshop.core.weixin.bean;

/**
 * 接口访问凭证
 * 
 * @author wukezhou
 * @date 2015-03-23
 */
public class AccessToken {
	// 获取到的凭证
	private String token;
	private String openid;
	// 凭证有效时间，单位：秒
	private int expiresIn;

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public int getExpiresIn() {
		return expiresIn;
	}

	public void setExpiresIn(int expiresIn) {
		this.expiresIn = expiresIn;
	}

	public String getOpenid() {
		return openid;
	}

	public void setOpenid(String openid) {
		this.openid = openid;
	}

}