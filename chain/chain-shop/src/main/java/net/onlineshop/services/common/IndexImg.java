package net.onlineshop.services.common;

import java.io.Serializable;

import net.onlineshop.core.dao.page.PagerModel;

public class IndexImg extends PagerModel implements Serializable {
	private static final long serialVersionUID = 1L;
	private String id;
	private String title;
	private String picture;
	private int order1;
	private String desc1;// 描述
	private String link;// 链接地址
	private Integer type;
	private Double price;
	private Double nowPrice;

	@Override
	public void clear() {
		this.id = null;
		this.title = null;
		this.picture = null;
		this.order1 = 0;
		desc1 = null;
		link = null;
		type = null;
		price = null;
		nowPrice = null;
	}

	public String getDesc1() {
		return desc1;
	}

	public void setDesc1(String desc1) {
		this.desc1 = desc1;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	public int getOrder1() {
		return order1;
	}

	public void setOrder1(int order1) {
		this.order1 = order1;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getNowPrice() {
		return nowPrice;
	}

	public void setNowPrice(Double nowPrice) {
		this.nowPrice = nowPrice;
	}

}
