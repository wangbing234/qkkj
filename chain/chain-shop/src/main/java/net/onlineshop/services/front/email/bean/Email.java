package net.onlineshop.services.front.email.bean;import java.io.Serializable;public class Email extends net.onlineshop.services.common.Email implements Serializable {	private static final long serialVersionUID = 1L;	private String pageMsg;// 页面显示的消息	public void clear() {		super.clear();		pageMsg = null;	}	public String getPageMsg() {		return pageMsg;	}	public void setPageMsg(String pageMsg) {		this.pageMsg = pageMsg;	}}