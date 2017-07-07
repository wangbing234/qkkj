package net.onlineshop.services.common;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import net.onlineshop.core.dao.page.PagerModel;

public class TransArea extends PagerModel implements Serializable {
	// 地区名称
	private String areaName;

	private List<TransArea> childs = new ArrayList<TransArea>();

	private Long parent_id;
	private TransArea parent;
	// 序列
	private int sequence;
	// 水平
	private int level;

	public String getAreaName() {
		return this.areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public List<TransArea> getChilds() {
		return this.childs;
	}

	public void setChilds(List<TransArea> childs) {
		this.childs = childs;
	}

	public TransArea getParent() {
		return this.parent;
	}

	public void setParent(TransArea parent) {
		this.parent = parent;
	}

	public int getSequence() {
		return this.sequence;
	}

	public void setSequence(int sequence) {
		this.sequence = sequence;
	}

	public int getLevel() {
		return this.level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public Long getParent_id() {
		return parent_id;
	}

	public void setParent_id(Long parent_id) {
		this.parent_id = parent_id;
	}

}
