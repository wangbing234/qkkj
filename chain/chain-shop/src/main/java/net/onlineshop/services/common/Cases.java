package net.onlineshop.services.common;

import java.io.Serializable;

import net.onlineshop.core.dao.page.PagerModel;

public class Cases extends PagerModel implements Serializable {
	private String id;
	private String title;
	private String picUrl;
	private String createtime;
	private String updatetime;
	private int order1;// 顺序
	private String desc1;
	private String notes;
	public static final String news_status_y = "y";// 显示
	public static final String news_status_n = "n";// 不显示

	@Override
	public void clear() {
		super.clear();

		id = null;
		title = null;
		picUrl = null;
		createtime = null;
		updatetime = null;
		order1 = 0;
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

	public String getPicUrl() {
		return picUrl;
	}

	public void setPicUrl(String picUrl) {
		this.picUrl = picUrl;
	}

	public String getCreatetime() {
		return createtime;
	}

	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}

	public String getUpdatetime() {
		return updatetime;
	}

	public void setUpdatetime(String updatetime) {
		this.updatetime = updatetime;
	}

	public int getOrder1() {
		return order1;
	}

	public void setOrder1(int order1) {
		this.order1 = order1;
	}

	public String getDesc1() {
		return desc1;
	}

	public void setDesc1(String desc1) {
		this.desc1 = desc1;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

}
