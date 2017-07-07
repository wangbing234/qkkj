package net.onlineshop.web.action.front.account;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.FrontContainer;
import net.onlineshop.core.front.SystemManager;
import net.onlineshop.core.pay.alipay.alipayescow.util.AlipayNotify;
import net.onlineshop.services.front.account.AccountService;
import net.onlineshop.services.front.account.bean.Account;
import net.onlineshop.services.front.order.OrderService;
import net.onlineshop.services.front.recharge.RechargeService;
import net.onlineshop.services.front.recharge.bean.Recharge;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

public class CallBackAction extends BaseAction<Account> {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private OrderService orderService;

	private AccountService accountService;

	private RechargeService rechargeService;

//	/**
//	 * 支付宝返回
//	 * 
//	 * @return
//	 * @throws IOException
//	 */
//	public String alipay_return() throws IOException {
//
//		HttpServletRequest request = this.getRequest();
//		request.getSession().setAttribute(FrontContainer.myCart, null);// 清空购物车
//
//		Logger logger = LoggerFactory.getLogger(AlipayNotify.class);
//		// 获取支付宝GET过来反馈信息
//		Map<String, String> params = new HashMap<String, String>();
//		Map requestParams = this.getRequest().getParameterMap();
//		logger.debug("同步通知request.getParameterMap()=" + requestParams);
//		for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
//			String name = (String) iter.next();
//			String[] values = (String[]) requestParams.get(name);
//			String valueStr = "";
//			for (int i = 0; i < values.length; i++) {
//				valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
//			}
//			// 乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化
//			// valueStr = new String(valueStr.getBytes("ISO-8859-1"), "utf-8");
//			params.put(name, valueStr);
//		}
//
//		logger.debug("同步通知params=" + params);
//
//		// 获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以下仅供参考)//
//		// 商户订单号
//		String out_trade_no = new String(request.getParameter("out_trade_no").getBytes("ISO-8859-1"), "UTF-8");
//
//		// 支付宝交易号
//		String trade_no = new String(request.getParameter("trade_no").getBytes("ISO-8859-1"), "UTF-8");
//
//		// 交易状态
//		String trade_status = new String(request.getParameter("trade_status").getBytes("ISO-8859-1"), "UTF-8");
//		// 退款状态
//		// String refund_status = new String(request.getParameter("refund_status").getBytes("ISO-8859-1"),"UTF-8");
//		// 获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//
//
//		// 计算得出通知验证结果
//		boolean verify_result = AlipayNotify.verify(params);
//		logger.debug("同步通知verify_result=" + verify_result);
//
//		if (true) {// 验证成功
//
//			if (trade_status.equals("TRADE_SUCCESS")) {
//				// 判断该笔订单是否在商户网站中已经做过处理
//				// 如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
//				// 如果有做过处理，不执行商户的业务程序
//
//				// 本系统的业务逻辑处理，把订单更新为已成功付款状态
//
//				if (out_trade_no.startsWith("pay_")) {
//					orderService.alipayNotify(trade_status, null, out_trade_no, trade_no);
//					this.getResponse().sendRedirect(SystemManager.systemSetting.getWww() + "/order/paySuccess.html");
//					return null;
//
//				} else if (out_trade_no.startsWith("recharge_")) {
//
//					// 本系统的业务逻辑处理，把订单更新为已成功付款状态
//					Recharge recharge = new Recharge();
//					recharge.setTradNo(out_trade_no);
//					recharge = rechargeService.selectOne(recharge);
//					if (recharge != null && recharge.getState().equals("n")) {
//						recharge.setState("y");
//						recharge.setNote(trade_no);
//						rechargeService.update(recharge);
//
//						Account acc = new Account();
//						acc.setAccount(recharge.getCreateAccount());
//						acc = accountService.selectOne(acc);
//
//						Double balance = acc.getMoneyBalance();
//						acc.setMoneyBalance(balance + recharge.getFee());
//						accountService.update(acc);
//
//					}
//
//					getResponse().sendRedirect("/user/recharge.html");
//					return null;
//				} 
//
//			}
//
//		} else {
//			this.printJson("支付异常...");
//			return null;
//		}
//		return null;
//
//	}
//
//	public String alipay_notify() throws IOException {
//		HttpServletRequest request = this.getRequest();
//		Logger logger = LoggerFactory.getLogger(AlipayNotify.class);
//
//		// 获取支付宝POST过来反馈信息
//		Map<String, String> params = new HashMap<String, String>();
//		Map requestParams = request.getParameterMap();
//		for (Iterator iter = requestParams.keySet().iterator(); iter.hasNext();) {
//			String name = (String) iter.next();
//			String[] values = (String[]) requestParams.get(name);
//			String valueStr = "";
//			for (int i = 0; i < values.length; i++) {
//				valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
//			}
//			// 乱码解决，这段代码在出现乱码时使用。如果mysign和sign不相等也可以使用这段代码转化
//			// valueStr = new String(valueStr.getBytes("ISO-8859-1"), "gbk");
//			params.put(name, valueStr);
//		}
//
//		logger.debug("params=" + params);
//
//		// 获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以下仅供参考)//
//		// 商户订单号
//
//		String out_trade_no = new String(request.getParameter("out_trade_no").getBytes("ISO-8859-1"), "UTF-8");
//
//		// 支付宝交易号
//
//		String trade_no = new String(request.getParameter("trade_no").getBytes("ISO-8859-1"), "UTF-8");
//
//		// 交易状态
//		String trade_status = new String(request.getParameter("trade_status").getBytes("ISO-8859-1"), "UTF-8");
//		// 退款状态
//		String refund_status = null;
//		if (StringUtils.isNotBlank(request.getParameter("refund_status"))) {
//			refund_status = new String(request.getParameter("refund_status").getBytes("ISO-8859-1"), "UTF-8");
//		}
//		logger.debug("out_trade_no=" + out_trade_no + ",trade_no=" + trade_no + ",trade_status=" + trade_status + ",refund_status=" + refund_status);
//		// 获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表(以上仅供参考)//
//
//		if (AlipayNotify.verify(params)) {// 验证成功
//			// 本系统的业务逻辑处理，把订单更新为已成功付款状态
//			WebApplicationContext app = WebApplicationContextUtils.getWebApplicationContext(request.getSession().getServletContext());
//			OrderService orderService = (OrderService) app.getBean("orderServiceFront");
//			//////////////////////////////////////////////////////////////////////////////////////////
//			// 请在这里加上商户的业务逻辑程序代码
//
//			// ——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
//			logger.debug("支付宝异步验证成功!");
//			if (StringUtils.isNotBlank(trade_status)) {
//				if (orderService.alipayNotify(trade_status, refund_status, out_trade_no, trade_no)) {
//					this.printJson("success"); // 请不要修改或删除
//				} else {
//
//					this.printJson("success_fail"); // 请不要修改或删除
//
//				}
//				if (trade_status.equals("WAIT_BUYER_PAY")) {
//					// 该判断表示买家已在支付宝交易管理中产生了交易记录，但没有付款
//
//					// 判断该笔订单是否在商户网站中已经做过处理
//					// 如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
//					// 如果有做过处理，不执行商户的业务程序
//					// orderService.alipayNotify(trade_status,refund_status,out_trade_no,trade_no);
//					// out.println("success"); //请不要修改或删除
//				} else if (trade_status.equals("WAIT_SELLER_SEND_GOODS")) {
//					// 该判断表示买家已在支付宝交易管理中产生了交易记录且付款成功，但卖家没有发货
//
//					// 判断该笔订单是否在商户网站中已经做过处理
//					// 如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
//					// 如果有做过处理，不执行商户的业务程序
//					// orderService.alipayNotify(trade_status,refund_status,out_trade_no,trade_no);
//					// out.println("success"); //请不要修改或删除
//				} else if (trade_status.equals("TRADE_SUCCESS")) {
//					// 该判断表示卖家已经发了货，但买家还没有做确认收货的操作
//
//					// 判断该笔订单是否在商户网站中已经做过处理
//					// 如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
//					// 如果有做过处理，不执行商户的业务程序
//
//					if (out_trade_no.startsWith("pay_")) {
//
//						orderService.alipayNotify(trade_status, null, out_trade_no, trade_no);
//
//					} else if (out_trade_no.startsWith("recharge_")) {
//
//						// 本系统的业务逻辑处理，把订单更新为已成功付款状态
//
//						Recharge recharge = new Recharge();
//						recharge.setTradNo(out_trade_no);
//						recharge = rechargeService.selectOne(recharge);
//						if (recharge != null && recharge.getState().equals("n")) {
//							recharge.setState("y");
//							recharge.setNote(trade_no);
//							rechargeService.update(recharge);
//
//							Account acc = new Account();
//							acc.setAccount(recharge.getCreateAccount());
//							acc = accountService.selectOne(acc);
//
//							Double balance = acc.getMoneyBalance();
//							acc.setMoneyBalance(balance + recharge.getFee());
//
//							accountService.update(acc);
//
//						}
//
//					}
//
//					this.printJson("success"); // 请不要修改或删除
//
//				} else if (trade_status.equals("TRADE_FINISHED")) {
//					this.printJson("success"); // 请不要修改或删除
//				} else {
//					this.printJson("success"); // 请不要修改或删除
//				}
//			}
//
//		} else {// 验证失败
//
//			this.printJson("fail"); // 请不要修改或删除
//			logger.debug("支付宝异步验证失败!");
//		}
//
//		return null;
//	}
//
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

	public void setOrderService(OrderService orderService) {
		this.orderService = orderService;
	}

	public void setAccountService(AccountService accountService) {
		this.accountService = accountService;
	}

	public void setRechargeService(RechargeService rechargeService) {
		this.rechargeService = rechargeService;
	}
}
