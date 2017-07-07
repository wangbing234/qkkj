package net.onlineshop.services.common;import java.io.Serializable;import net.onlineshop.core.dao.QueryModel;/** * 商品属性、参数类 *  *  *  */public class Attribute extends QueryModel implements Serializable {	private static final long serialVersionUID = 1L;	private String id;	private String name;	private int catalogID;	private int pid;	private int order1;	public void clear() {		super.clear();		id = null;		name = null;		catalogID = 0;		pid = 0;		order1 = 0;	}	public String getId() {		return id;	}	public void setId(String id) {		this.id = id;	}	public String getName() {		return name;	}	public void setName(String name) {		this.name = name;	}	public int getCatalogID() {		return catalogID;	}	public void setCatalogID(int catalogID) {		this.catalogID = catalogID;	}	public int getPid() {		return pid;	}	public void setPid(int pid) {		this.pid = pid;	}	public int getOrder1() {		return order1;	}	public void setOrder1(int order1) {		this.order1 = order1;	}	@Override	public String toString() {		return "Attribute [id=" + id + ", name=" + name + ", catalogID=" + catalogID + ", pid=" + pid + ", order1=" + order1 + "]";	}}