package net.onlineshop.web.action.front.account;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.FrontContainer;
import net.onlineshop.core.front.SystemManager;
import net.onlineshop.core.util.AddressUtils;
import net.onlineshop.core.weixin.MatrixToImageWriter;
import net.onlineshop.core.weixin.PayCommonUtil;
import net.onlineshop.core.weixin.TenpayUtil;
import net.onlineshop.core.weixin.util.GetWxOrderno;
import net.onlineshop.core.weixin.util.MoneyUtils;
import net.onlineshop.core.weixin.util.RequestHandler;
import net.onlineshop.core.weixin.util.Sha1Util;
import net.onlineshop.core.weixin.util.WeixinUtils;
import net.onlineshop.services.front.account.AccountService;
import net.onlineshop.services.front.account.bean.Account;
import net.onlineshop.services.front.order.OrderService;
import net.onlineshop.services.front.order.bean.Order;
import net.onlineshop.services.front.recharge.RechargeService;
import net.onlineshop.services.front.recharge.bean.Recharge;

public class WeiPayAction extends BaseAction<Account> {
	private OrderService orderService;

	private AccountService accountService;

	private RechargeService rechargeService;

//	public static String genCodeUrl(String orderNNo, String ip, String title, String money) throws Exception {
//		String code_url = "";// 支付URL;
//
//		Map<String, Object> map = new HashMap<String, Object>();
//
//		map.put("appid", WeixinUtils.appid);
//		map.put("mch_id", WeixinUtils.partner);// 商户号
//		map.put("nonce_str", MoneyUtils.buildRandom());// 随机字符串
//		map.put("device_info", "WEB");
//		map.put("out_trade_no", orderNNo);// 商户订单
//		map.put("total_fee", money);// 金额，单位为分
//		map.put("body", title);//
//		map.put("spbill_create_ip", ip);// IP
//
//		map.put("notify_url", SystemManager.systemSetting.getWww() + "/weiPay!callback.action");// 通知地址
//		map.put("trade_type", "NATIVE");
//
//		map.put("sign", MoneyUtils.createSign(map));// 签名
//
//		String result = "";
//
//		try {
//			result = MoneyUtils.doSendMoney(WeixinUtils.payurl, MoneyUtils.createXML(map));
//
//			InputStream inputStream = new ByteArrayInputStream(result.getBytes("UTF-8"));
//			Map aap = WeiPayAction.parseXml(inputStream);
//			code_url = aap.get("code_url").toString();
//
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//
//		return code_url;
//
//	}
//
//	public String queryStatus() throws IOException {
//		HttpServletRequest request = this.getRequest();
//		String out_trade_no = request.getParameter("out_trade_no");
//		// 本系统的业务逻辑处理，把订单更新为已成功付款状态
//		Recharge recharge = new Recharge();
//		recharge.setTradNo(out_trade_no);
//		recharge = rechargeService.selectOne(recharge);
//		if (recharge != null && recharge.getState().equals("y")) {
//
//			this.printJson("true");
//
//		} else {
//
//			this.printJson("false");
//		}
//		return null;
//	}
//
//	/**
//	 * 订单支付状态
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String queryOrderStatus() throws IOException {
//		HttpServletRequest request = this.getRequest();
//		String out_trade_no = request.getParameter("out_trade_no");
//
//		String orderno = out_trade_no.substring(out_trade_no.lastIndexOf("_") + 1);
//		Order or = new Order();
//		or.setOrderNo(orderno);
//		or = orderService.selectOne(or);
//
//		if (or != null && or.getPaystatus().equals("y")) {
//
//			this.printJson("true");
//
//		} else {
//
//			this.printJson("false");
//		}
//		return null;
//	}
//
//	/**
//	 * 微信端提交充值
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String recharge() throws IOException {
//		HttpServletResponse response = this.getResponse();
//		HttpServletRequest request = this.getRequest();
//		Account acc = (Account) getSession().getAttribute(FrontContainer.USER_INFO);
//
//		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
//			this.printJson("你还登录");
//			return null;
//		}
//
//		String openid = acc.getOpenId();
//		if (openid != null && !"".equals(openid)) {
//			String money = this.getRequest().getParameter("money");
//
//			// 商户相关资料
//			String appid = WeixinUtils.appid;
//			String appsecret = WeixinUtils.appsecret;
//			String partner = WeixinUtils.partner;
//			String partnerkey = WeixinUtils.partnerkey;
//			String currTime = TenpayUtil.getCurrTime();
//			String orderNo = "recharge_" + TenpayUtil.getCurrTime() + "_" + TenpayUtil.buildRandom(4);
//			// 8位日期
//			String strTime = currTime.substring(8, currTime.length());
//			// 四位随机数
//			String strRandom = TenpayUtil.buildRandom(4) + "";
//			// 10位序列号,可以自行调整。
//			String strReq = strTime + strRandom;
//
//			// 商户号
//			String mch_id = partner;
//
//			// 随机数
//			String nonce_str = strReq;
//
//			// 商品描述根据情况修改
//			String body = "鼎烨商城充值";
//			// 附加数据
//			String attach = openid;
//			// 商户订单号
//			String out_trade_no = orderNo;
//
//			// 总金额以分为单位，不带小数点
//
//			// 订单生成的机器 IP
//			String spbill_create_ip = request.getRemoteAddr();
//
//			// 这里notify_url是 支付完成后微信发给该链接信息，可以判断会员是否支付成功，改变订单状态等。
//			String notify_url = SystemManager.systemSetting.getWww() + "/weiPay!callback.action";
//
//			String trade_type = "JSAPI";
//
//			String rechargeRates = SystemManager.systemSetting.getRechargeRates();// 充值获得现金卷的比例
//
//			// 充值记录
//			Recharge obj = new Recharge();
//			obj.setCreateAccount(acc.getAccount());
//			obj.setMoney(Double.valueOf(money));
//			Double rr = Double.valueOf(money) * Double.valueOf(rechargeRates);
//			obj.setTradNo(orderNo);
//			if (rechargeRates != null) {
//
//				obj.setFee(rr);
//
//			} else {
//				obj.setFee(Double.valueOf(money));
//				rr = Double.valueOf(money);
//
//			}
//
//			obj.setType("weixin");
//
//			obj.setState("n");
//			rechargeService.insert(obj);
//
//			double dd = Double.valueOf(money) * 100;
//			Integer payMoney = (int) dd;
//
//			SortedMap<String, String> packageParams = new TreeMap<String, String>();
//			packageParams.put("appid", appid);
//			packageParams.put("mch_id", mch_id);
//			packageParams.put("nonce_str", nonce_str);
//			packageParams.put("body", body);
//			packageParams.put("attach", attach);
//			packageParams.put("out_trade_no", out_trade_no);
//
//			// 这里写的金额为1 分到时修改
//			packageParams.put("total_fee", payMoney.toString());
//
//			packageParams.put("spbill_create_ip", spbill_create_ip);
//			packageParams.put("notify_url", notify_url);
//
//			packageParams.put("trade_type", trade_type);
//			packageParams.put("openid", openid);
//
//			RequestHandler reqHandler = new RequestHandler(request, response);
//			reqHandler.init(appid, appsecret, partnerkey);
//
//			String sign = reqHandler.createSign(packageParams);
//
//			String xml = "<xml>" + "<appid>" + appid + "</appid>" + "<mch_id>" + mch_id + "</mch_id>" + "<nonce_str>" + nonce_str + "</nonce_str>" + "<sign>" + sign + "</sign>" + "<body><![CDATA[" + body + "]]></body>" + "<attach>" + attach + "</attach>" + "<out_trade_no>" + out_trade_no + "</out_trade_no>" + "<attach>" + attach + "</attach>" + "<total_fee>" + payMoney + "</total_fee>"
//					+ "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>" + "<notify_url>" + notify_url + "</notify_url>" + "<trade_type>" + trade_type + "</trade_type>" + "<openid>" + openid + "</openid>" + "</xml>";
//
//			String createOrderURL = "https://api.mch.weixin.qq.com/pay/unifiedorder";
//
//			String prepay_id = "";
//			try {
//				new GetWxOrderno();
//				prepay_id = GetWxOrderno.getPayNo(createOrderURL, xml);
//				if (prepay_id.equals("")) {
//					request.setAttribute("ErrorMsg", "统一支付接口获取预支付订单出错");
//					response.sendRedirect("/error.jsp");
//					return null;
//				}
//			} catch (Exception e1) {
//				// TODO Auto-generated catch block
//				e1.printStackTrace();
//			}
//			SortedMap<String, String> finalpackage = new TreeMap<String, String>();
//
//			String timestamp = Sha1Util.getTimeStamp();
//
//			String packages = "prepay_id=" + prepay_id;
//
//			finalpackage.put("appId", appid);
//			finalpackage.put("timeStamp", timestamp);
//			finalpackage.put("nonceStr", nonce_str);
//			finalpackage.put("package", packages);
//			finalpackage.put("signType", "MD5");
//
//			String finalsign = reqHandler.createSign(finalpackage);
//			this.getRequest().setAttribute("appid", appid);
//			this.getRequest().setAttribute("timeStamp", timestamp);
//			this.getRequest().setAttribute("nonceStr", nonce_str);
//			this.getRequest().setAttribute("packages", packages);
//			this.getRequest().setAttribute("sign", finalsign);
//			this.getRequest().setAttribute("orderNo", orderNo);
//			this.getRequest().setAttribute("money", Double.valueOf(money));
//			this.getRequest().setAttribute("page", "user");
//
//			System.out.println("appid:" + appid + "  timeStamp:" + timestamp + "  nonceStr:" + nonce_str + "  packages:" + packages + "  " + "  sign:" + finalsign);
//		} else {
//
//			this.printJson("您还未关注我们");
//			return null;
//		}
//
//		return "waitPay";
//
//	}
//
//	/**
//	 * 充值二维码
//	 * 
//	 * @return
//	 * @throws Exception
//	 */
//	public String rechargeQrcode() throws Exception {
//		HttpServletRequest request = this.getRequest();
//
//		String money = request.getParameter("money");
//		String orderNNo = request.getParameter("out_trade_no");
//
//		Account acc = (Account) getSession().getAttribute(FrontContainer.USER_INFO);
//
//		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
//			this.printJson("你还登录");
//			return null;
//		}
//
//		String rechargeRates = SystemManager.systemSetting.getRechargeRates();// 充值获得现金卷的比例
//
//		if (Double.valueOf(money) <= 0) {
//			this.printJson("参数非法");
//
//			return null;
//		}
//
//		if (orderNNo == null || "".equals(orderNNo)) {
//			this.printJson("订单号参数非法");
//
//			return null;
//		}
//
//		String ip = AddressUtils.getIp(getRequest());
//		int width = 240;
//		int height = 240;
//		// 二维码的图片格式
//		String format = "jpg";
//		Hashtable hints = new Hashtable();
//		// 内容所使用编码
//
//		hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
//
//		hints.put(EncodeHintType.MARGIN, 1);
//		BitMatrix bitMatrix = null;
//		try {
//			double dd = Double.valueOf(money) * 100;
//			Integer payMoney = (int) dd;
//			String url = WeiPayAction.genCodeUrl(orderNNo, ip, "现金劵充值", payMoney.toString());
//
//			if (url != null && !"".equals(url)) {
//
//				// 充值记录
//				Recharge obj = new Recharge();
//				obj.setCreateAccount(acc.getAccount());
//				obj.setMoney(Double.valueOf(money));
//				obj.setTradNo(orderNNo);
//				if (rechargeRates != null) {
//
//					obj.setFee(Double.valueOf(money) * Double.valueOf(rechargeRates));
//
//				} else {
//					obj.setFee(Double.valueOf(money));
//
//				}
//
//				obj.setType("weixin");
//
//				obj.setState("n");
//				rechargeService.insert(obj);
//
//			}
//			bitMatrix = new MultiFormatWriter().encode(url, BarcodeFormat.QR_CODE, width, height, hints);
//
//		} catch (WriterException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//
//		String newFileName = orderNNo + ".jpg";
//
//		String savePath = "/resource/images/wxewm/";
//		String realPath = ServletActionContext.getServletContext().getRealPath(savePath);
//
//		// 建立一个目标文件
//		File fileOne = new File(realPath, newFileName);
//
//		try {
//			MatrixToImageWriter.writeToFile(bitMatrix, format, fileOne);
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//
//		}
//		request.setAttribute("filePath", savePath + newFileName);
//		return "qrcode";
//
//	}
//
//	public String callback() throws IOException, Exception {
//
//		HttpServletRequest request = this.getRequest();
//		// xml请求解析
//		Map<String, String> requestMap = WeiPayAction.parseXml(request.getInputStream());
//
//		// 过滤空 设置 TreeMap
//		SortedMap<Object, Object> packageParams = new TreeMap<Object, Object>();
//		Iterator it = requestMap.keySet().iterator();
//		while (it.hasNext()) {
//			String parameter = (String) it.next();
//			String parameterValue = requestMap.get(parameter);
//
//			String v = "";
//			if (null != parameterValue) {
//				v = parameterValue.trim();
//			}
//			packageParams.put(parameter, v);
//		}
//
//		// 账号信息
//		String key = WeixinUtils.partnerkey; // key
//
//		// 判断签名是否正确
//		if (PayCommonUtil.isTenpaySign("UTF-8", packageParams, key)) {
//
//			String resXml = "";
//
//			// 支付结果
//			String result_code = requestMap.get("result_code");
//			// 返回结果
//			String return_code = requestMap.get("return_code");
//
//			if (result_code != null && return_code != null) {
//
//				if (result_code.equals("SUCCESS") && return_code.equals("SUCCESS")) {
//					String out_trade_no = requestMap.get("out_trade_no");
//					String transaction_id = requestMap.get("transaction_id");
//
//					if (out_trade_no.startsWith("weixin_")) {
//						orderService.alipayNotify("TRADE_SUCCESS", null, out_trade_no, transaction_id);
//
//					}
//
//					else if (out_trade_no.startsWith("recharge_")) {
//
//						// 本系统的业务逻辑处理，把订单更新为已成功付款状态
//						Recharge recharge = new Recharge();
//						recharge.setTradNo(out_trade_no);
//						recharge = rechargeService.selectOne(recharge);
//						if (recharge != null && recharge.getState().equals("n")) {
//							recharge.setState("y");
//							recharge.setNote(out_trade_no);
//							rechargeService.update(recharge);
//
//							Account acc = new Account();
//							acc.setAccount(recharge.getCreateAccount());
//							acc = accountService.selectOne(acc);
//
//							Double balance = acc.getMoneyBalance();
//							acc.setMoneyBalance(balance + recharge.getFee());
//							accountService.update(acc);
//
//						}
//
//					} 
//
//					resXml = "<xml>" + "<return_code><![CDATA[SUCCESS]]></return_code>" + "<return_msg><![CDATA[OK]]></return_msg>" + "</xml> ";
//
//				} else {
//
//					resXml = "<xml>" + "<return_code><![CDATA[FAIL]]></return_code>" + "<return_msg><![CDATA[报文为空]]></return_msg>" + "</xml> ";
//				}
//				this.printJson(resXml);
//
//			}
//		}
//		return null;
//	}
//
//	public static Map<String, String> parseXml(InputStream inputStream) throws Exception {
//		// 将解析结果存储在HashMap中
//		Map<String, String> map = new HashMap<String, String>();
//
//		// 读取输入流
//		SAXReader reader = new SAXReader();
//		Document document = reader.read(inputStream);
//		// 得到xml根元素
//		Element root = document.getRootElement();
//		// 得到根元素的所有子节点
//		List<Element> elementList = root.elements();
//
//		// 遍历所有子节点
//		for (Element e : elementList) {
//			System.out.println(e.getName() + "-----" + e.getText());
//
//			map.put(e.getName(), e.getText());
//		}
//		// 释放资源
//		inputStream.close();
//		inputStream = null;
//
//		return map;
//	}

	@Override
	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new Account();
		}

	}

	@Override
	public Account getE() {
		return this.e;
	}

	@Override
	public void insertAfter(Account e) {
		// TODO Auto-generated method stub

	}

	@Override
	protected void selectListAfter() {
		// TODO Auto-generated method stub

	}

	public OrderService getOrderService() {
		return orderService;
	}

	public void setOrderService(OrderService orderService) {
		this.orderService = orderService;
	}

	public AccountService getAccountService() {
		return accountService;
	}

	public void setAccountService(AccountService accountService) {
		this.accountService = accountService;
	}

	public RechargeService getRechargeService() {
		return rechargeService;
	}

	public void setRechargeService(RechargeService rechargeService) {
		this.rechargeService = rechargeService;
	}

}
