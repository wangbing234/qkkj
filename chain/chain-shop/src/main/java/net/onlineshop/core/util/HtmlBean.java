package net.onlineshop.core.util;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.components.UIBean;
import org.apache.struts2.views.annotations.StrutsTag;
import org.apache.struts2.views.annotations.StrutsTagAttribute;

import com.opensymphony.xwork2.util.ValueStack;

/**
 * 
 * @author WUKEZHOU
 *
 */
@StrutsTag(name = "delhtmlcode", tldTagClass = "com.ourplp.tool.web.DelHtmlTag", description = "delHtmlBean")
public class HtmlBean extends UIBean {

	private String incode;

	public HtmlBean(ValueStack stack, HttpServletRequest request, HttpServletResponse response) {
		super(stack, request, response);
	}

	@Override
	protected String getDefaultTemplate() {
		return "delhtmlcode";
	}

	@StrutsTagAttribute(description = "设置标签的值", type = "String")
	public void setIncode(String incode) {
		this.incode = incode;
	}

	@Override
	protected void evaluateExtraParams() {
		super.evaluateExtraParams();

		if (null != incode) {
			addParameter("incode", findString(incode));
		}
	}

	public String getMessage() {
		return incode;
	}

}
