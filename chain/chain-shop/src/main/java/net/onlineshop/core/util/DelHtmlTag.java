package net.onlineshop.core.util;

import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.jsp.JspException;

import org.apache.struts2.components.Component;
import org.apache.struts2.views.jsp.ui.AbstractUITag;
import org.apache.taglibs.standard.lang.support.ExpressionEvaluatorManager;

import com.opensymphony.xwork2.util.ValueStack;

/**
 * 
 * @author WUKEZHOU
 *
 */
public class DelHtmlTag extends AbstractUITag {
	/**
	 * 输入的HTML文本
	 */
	private Object incode;
	/**
	 * 截取的字数
	 */
	private Integer num;

	@Override
	public Component getBean(ValueStack stack, HttpServletRequest request, HttpServletResponse response) {
		return new HtmlBean(stack, request, response);
	}

	@Override
	protected void populateParams() {
		super.populateParams();

		HtmlBean mm = (HtmlBean) component;
		mm.setIncode(HtmltoText(incode.toString(), num));
	}

	public void setIncode(Object incode) throws JspException {
		if (incode != null) {
			this.incode = ExpressionEvaluatorManager.evaluate("incode", incode.toString(), Object.class, this, pageContext);
		} else {
			incode = ExpressionEvaluatorManager.evaluate("incode", "", Object.class, this, pageContext);
			;
		}

	}

	public void setNum(Integer num) {
		this.num = num;
	}

	/**
	 * 去除html代码
	 * 
	 * @param inputString
	 * @return
	 */
	public static String HtmltoText(String inputString, Integer num) {
		String htmlStr = inputString; // 含html标签的字符串
		String textStr = "";
		java.util.regex.Pattern p_script;
		java.util.regex.Matcher m_script;
		java.util.regex.Pattern p_style;
		java.util.regex.Matcher m_style;
		java.util.regex.Pattern p_html;
		java.util.regex.Matcher m_html;
		java.util.regex.Pattern p_ba;
		java.util.regex.Matcher m_ba;

		try {
			String regEx_script = "<[\\s]*?script[^>]*?>[\\s\\S]*?<[\\s]*?\\/[\\s]*?script[\\s]*?>"; // 定义script的正则表达式{或<script[^>]*?>[\\s\\S]*?<\\/script> }
			String regEx_style = "<[\\s]*?style[^>]*?>[\\s\\S]*?<[\\s]*?\\/[\\s]*?style[\\s]*?>"; // 定义style的正则表达式{或<style[^>]*?>[\\s\\S]*?<\\/style> }
			String regEx_html = "<[^>]+>"; // 定义HTML标签的正则表达式
			String patternStr = "\\s+";

			p_script = Pattern.compile(regEx_script, Pattern.CASE_INSENSITIVE);
			m_script = p_script.matcher(htmlStr);
			htmlStr = m_script.replaceAll(""); // 过滤script标签

			p_style = Pattern.compile(regEx_style, Pattern.CASE_INSENSITIVE);
			m_style = p_style.matcher(htmlStr);
			htmlStr = m_style.replaceAll(""); // 过滤style标签

			p_html = Pattern.compile(regEx_html, Pattern.CASE_INSENSITIVE);
			m_html = p_html.matcher(htmlStr);
			htmlStr = m_html.replaceAll(""); // 过滤html标签

			p_ba = Pattern.compile(patternStr, Pattern.CASE_INSENSITIVE);
			m_ba = p_ba.matcher(htmlStr);
			htmlStr = m_ba.replaceAll(""); // 过滤空格

			textStr = htmlStr;

		} catch (Exception e) {
			System.err.println("Html2Text: " + e.getMessage());
		}
		if (num == 0) {

		} else if (textStr.length() >= num) {

			textStr = textStr.substring(0, num) + "...";
		}
		if (textStr.length() == 0) {
			// textStr = "<font color='red'> 内容涉嫌非法 </font> ";
		}

		return textStr;// 返回文本字符串
	}

}
