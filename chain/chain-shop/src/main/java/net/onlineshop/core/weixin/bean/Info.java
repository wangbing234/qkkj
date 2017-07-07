package net.onlineshop.core.weixin.bean;

/**
 * 类说明
 * 
 * @author 程辉
 * @version V1.0 创建时间：2013-3-26 下午2:36:17
 */
public class Info {

	private String sno;
	private String title;
	private String describe;
	private String address;
	private String pic;
	private String recommendTime;
	private String url;

	public String getSno() {
		return sno;
	}

	public void setSno(String sno) {
		this.sno = sno;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescribe() {
		return describe;
	}

	public void setDescribe(String describe) {
		this.describe = describe;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPic() {
		return pic;
	}

	public void setPic(String pic) {
		this.pic = pic;
	}

	public String getRecommendTime() {
		return recommendTime;
	}

	public void setRecommendTime(String recommendTime) {
		this.recommendTime = recommendTime;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Override
	public String toString() {
		return "Info [sno=" + sno + ", title=" + title + ", describe=" + describe + ", address=" + address + ", pic=" + pic + ", recommendTime=" + recommendTime + ", url=" + url + "]";
	}

}
