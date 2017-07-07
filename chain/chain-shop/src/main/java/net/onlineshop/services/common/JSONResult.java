package net.onlineshop.services.common;

/**
 * json结果集
 * @author bing.wang
 *
 */
public class JSONResult {

	private Integer mess;
	private String info;
	private String url;
	
	public JSONResult(Integer mess,String info,String url){
		this.mess=mess;
		this.info=info;
		this.url=url;
	}
	public Integer getMess() {
		return mess;
	}
	public void setMess(Integer mess) {
		this.mess = mess;
	}
	public String getInfo() {
		return info;
	}
	public void setInfo(String info) {
		this.info = info;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
}
