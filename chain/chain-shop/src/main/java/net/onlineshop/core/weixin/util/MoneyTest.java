package net.onlineshop.core.weixin.util;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class MoneyTest {
	final static String url = "https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack";

	public static void main(String[] args) {
		String orderNNo = MoneyUtils.getOrderNo();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("nonce_str", MoneyUtils.buildRandom());// 随机字符串
		map.put("mch_billno", orderNNo);// 商户订单
		map.put("mch_id", "1338279601");// 商户号
		map.put("wxappid", "wxe21368a48234c07f");// 商户appid
		map.put("nick_name", "懒人狗商城");// 提供方名称
		map.put("send_name", "懒人狗商城");// 用户名
		map.put("re_openid", "oN_MiwSn2eQsCA0r5VUI6guelJ0M");// 用户openid
		map.put("total_amount", 100);// 付款金额
		map.put("min_value", 100);// 最小红包
		map.put("max_value", 100);// 最大红包
		map.put("total_num", 1);// 红包发送总人数
		map.put("wishing", "会员红包");// 红包祝福语
		map.put("client_ip", "127.0.0.1");// ip地址
		map.put("act_name", "会员红包");// 活动名称
		map.put("remark", "推荐有礼");// 备注
		map.put("sign", MoneyUtils.createSign(map));// 签名

		String result = "";
		try {
			result = MoneyUtils.doSendMoney(url, MoneyUtils.createXML(map));
		} catch (Exception e) {
			e.printStackTrace();
		}
		System.out.println(result);
		Element el;
		try {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();

			Document doc = db.parse(new InputSource(new ByteArrayInputStream(result.getBytes("utf-8"))));
			el = doc.getDocumentElement();

			System.out.println(el.getAttribute("return_code"));
			System.out.println(el.getAttribute("result_code"));
			System.out.println(el.getAttribute("re_openid"));
			System.out.println(el.getAttribute("mch_billno"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (ParserConfigurationException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SAXException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
}
