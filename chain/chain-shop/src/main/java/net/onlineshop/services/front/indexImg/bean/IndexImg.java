package net.onlineshop.services.front.indexImg.bean;

import java.io.Serializable;

import net.onlineshop.services.front.account.impl.ImageUtils;

public class IndexImg extends net.onlineshop.services.common.IndexImg implements Serializable {
	private String picurl160;
	private String picurl400;

	@Override
	public void clear() {
	}

	public String getPicurl160() {
		if (this.getPicture() != null && !"".equals(this.getPicture())) {
			picurl160 = ImageUtils.replaceLast(this.getPicture(),"_3", "_1");
		}
		return picurl160;
	}

	public void setPicurl160(String picurl160) {
		this.picurl160 = picurl160;
	}

	public String getPicurl400() {
		if (this.getPicture() != null && !"".equals(this.getPicture())) {
			picurl400 = ImageUtils.replaceLast(this.getPicture(),"_3", "_2");
		}
		return picurl400;

	}

	public void setPicurl400(String picurl400) {
		this.picurl400 = picurl400;
	}

}
