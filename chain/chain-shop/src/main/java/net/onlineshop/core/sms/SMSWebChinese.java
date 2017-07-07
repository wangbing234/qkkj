package net.onlineshop.core.sms;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import net.onlineshop.services.manage.sms.bean.Sms;

import org.apache.commons.httpclient.Header;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;

import com.alibaba.fastjson.JSON;

/**
 * http://www.webchinese.com.cn 此公司的SMS短信平台
 * 
 * @author
 *
 */
public class SMSWebChinese {
	private static String username = "yjzygj";// 这里设置帐号
	private static String passwd = "000000";// 这里设置密码

	public static void main(String[] args) throws HttpException, IOException {
		Sms sms = new Sms();
		sms.setPhone("15629149623");
		sms.setContent("验证码：54546【鼎烨】");
		sendSMS(sms);

	}

	public static Sms sendSMS(Sms sms) throws IOException, HttpException, UnsupportedEncodingException {
		HttpClient client = new HttpClient();
		PostMethod post = new PostMethod("http://www.qybor.com:8500/shortMessage");
		post.addRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");// 在头文件中设置转码
		NameValuePair[] data = { new NameValuePair("username", username), new NameValuePair("passwd", passwd), new NameValuePair("phone", sms.getPhone()), new NameValuePair("msg", "【鼎烨】" + sms.getContent()), new NameValuePair("needstatus", "true"), new NameValuePair("port", ""), new NameValuePair("sendtime", "") };
		post.setRequestBody(data);

		client.executeMethod(post);
		Header[] headers = post.getResponseHeaders();
		int statusCode = post.getStatusCode();
		System.out.println("statusCode:" + statusCode);
		for (Header h : headers) {
			System.out.println("h.toString()=" + h.toString());
		}
		String returnCode = new String(post.getResponseBodyAsString().getBytes("utf-8"));

		System.out.println("result=" + returnCode);

		post.releaseConnection();

		com.alibaba.fastjson.JSONObject json = JSON.parseObject(returnCode);
		String code = json.getString("respcode");
		sms.setReturnCode(code);
		return sms;
	}

}
