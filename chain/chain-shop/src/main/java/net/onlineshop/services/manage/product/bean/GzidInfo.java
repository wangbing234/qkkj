package net.onlineshop.services.manage.product.bean;import java.io.Serializable;/** * 商品 *  *  *  */public class GzidInfo implements Serializable {	public GzidInfo() {	}	private String gzid;	private Integer num;	public String getGzid() {		return gzid;	}	public void setGzid(String gzid) {		this.gzid = gzid;	}	public Integer getNum() {		return num;	}	public void setNum(Integer num) {		this.num = num;	}}