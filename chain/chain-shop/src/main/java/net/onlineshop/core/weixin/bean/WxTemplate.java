package net.onlineshop.core.weixin.bean;

import java.util.Map;

public class WxTemplate {
	public static final String template_newUser = "igWrqjW3hu24pHTTSR3WOzrJOgcxaoCEZ7LB64wMhAU";// 新会员加入
	public static final String template_Update = "MwrD6Rtn9JOu3iWJDjLeko2KxEV_dxc3E8J7YYi6sXY";// 会员升级
	public static final String template_pay = "d8yGvpCnpRA_i0hj-gDoc737MLmUoBj1607Nfd_UUeU";// 消费通知
	public static final String template_mobile = "PwcoXbrGhxo2v3qzFV-P0uvr37Jgf93awiOohpaLbx0";// 充值通知
	private String template_id;
	private String touser;
	private String url;
	private String topcolor;
	private Map<String, TemplateData> data;

	public String getTemplate_id() {
		return template_id;
	}

	public void setTemplate_id(String template_id) {
		this.template_id = template_id;
	}

	public String getTouser() {
		return touser;
	}

	public void setTouser(String touser) {
		this.touser = touser;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getTopcolor() {
		return topcolor;
	}

	public void setTopcolor(String topcolor) {
		this.topcolor = topcolor;
	}

	public Map<String, TemplateData> getData() {
		return data;
	}

	public void setData(Map<String, TemplateData> data) {
		this.data = data;
	}
}
