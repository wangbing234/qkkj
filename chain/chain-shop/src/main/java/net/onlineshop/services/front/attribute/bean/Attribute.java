package net.onlineshop.services.front.attribute.bean;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

/**
 * 商品属性、参数类
 * 
 * 
 * 
 */
public class Attribute extends net.onlineshop.services.common.Attribute implements Serializable {
	private static final long serialVersionUID = 1L;
	private List<Attribute> attrList = new LinkedList<Attribute>();// 子属性集合
	private String parameterValue;// 商品参数值

	public void clear() {
		super.clear();
		if (attrList != null) {
			attrList.clear();
			attrList = null;
		}
	}

	public List<Attribute> getAttrList() {
		return attrList;
	}

	public void setAttrList(List<Attribute> attrList) {
		this.attrList = attrList;
	}

	public String getParameterValue() {
		return parameterValue;
	}

	public void setParameterValue(String parameterValue) {
		this.parameterValue = parameterValue;
	}

}
