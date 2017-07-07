package net.onlineshop.services.common;

import java.io.Serializable;

import net.onlineshop.core.dao.page.PagerModel;

public class Orderpay extends PagerModel implements Serializable {
	private static final long serialVersionUID = 1L;
	private String id;
	private String orderid;
	private String paystatus;//付款状态
	private double payamount;//付款金额
	private double payScore;//付积分
	private double payScoreTicket;//付积分券
	private double payWalletShop;//付消费券
	private double payWalletReward;//付推荐钱包
	private String createtime;
	private String paymethod;//付款方式
	private String confirmdate;
	private String confirmuser; //付款人
	private String remark;//备注
	private String tradeNo;//交易号
	
	//前台传过来的
	private String isSaveScore;//是否保留积分1保留0不保留
	private Float userScore=0f;//用户积分
	private int userScoreTicket=0;//用户消费券
	private Float userWallet=0f;//用户钱包

	public static final String orderpay_paystatus_y = "y";// 支付成功
	public static final String orderpay_paystatus_n = "n";// 未支付成功

	public static final String orderpay_paymethod_alipayescow = "alipayescow";// 支付宝纯担保交易接口
	public static final String orderpay_paymethod_afterpay = "afterpay";// 打款
	public static final String orderpay_paymethod_weixin = "weixin";// 易宝支付
	public static final String orderpay_paymethod_bank = "bank";// 银行转账
	public static final String orderpay_paymethod_money = "money";// 现金券
	public static final String orderpay_paymethod_ticket = "ticket";// 积分和消费券

	public void clear() {
		super.clear();
		id = null;
		orderid = null;
		paystatus = null;
		payamount = 0;
		createtime = null;
		paymethod = null;
		confirmdate = null;
		confirmuser = null;
		remark = null;
		tradeNo = null;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getOrderid() {
		return orderid;
	}

	public void setOrderid(String orderid) {
		this.orderid = orderid;
	}

	public String getPaystatus() {
		return paystatus;
	}

	public void setPaystatus(String paystatus) {
		this.paystatus = paystatus;
	}

	public double getPayamount() {
		return payamount;
	}

	public void setPayamount(double payamount) {
		this.payamount = payamount;
	}

	public String getCreatetime() {
		return createtime;
	}

	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}

	public String getPaymethod() {
		return paymethod;
	}

	public void setPaymethod(String paymethod) {
		this.paymethod = paymethod;
	}

	public String getConfirmdate() {
		return confirmdate;
	}

	public void setConfirmdate(String confirmdate) {
		this.confirmdate = confirmdate;
	}

	public String getConfirmuser() {
		return confirmuser;
	}

	public void setConfirmuser(String confirmuser) {
		this.confirmuser = confirmuser;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getTradeNo() {
		return tradeNo;
	}

	public void setTradeNo(String tradeNo) {
		this.tradeNo = tradeNo;
	}

	public double getPayScore() {
		return payScore;
	}

	public void setPayScore(double payScore) {
		this.payScore = payScore;
	}

	public double getPayScoreTicket() {
		return payScoreTicket;
	}

	public void setPayScoreTicket(double payScoreTicket) {
		this.payScoreTicket = payScoreTicket;
	}

	public double getPayWalletShop() {
		return payWalletShop;
	}

	public void setPayWalletShop(double payWalletShop) {
		this.payWalletShop = payWalletShop;
	}

	public double getPayWalletReward() {
		return payWalletReward;
	}

	public void setPayWalletReward(double payWalletReward) {
		this.payWalletReward = payWalletReward;
	}
	
	public String getIsSaveScore() {
		return isSaveScore;
	}

	public void setIsSaveScore(String isSaveScore) {
		this.isSaveScore = isSaveScore;
	}

	public Float getUserScore() {
		return userScore;
	}

	public void setUserScore(Float userScore) {
		this.userScore = userScore;
	}

	public int getUserScoreTicket() {
		return userScoreTicket;
	}

	public void setUserScoreTicket(int userScoreTicket) {
		this.userScoreTicket = userScoreTicket;
	}

	public Float getUserWallet() {
		return userWallet;
	}

	public void setUserWallet(Float userWallet) {
		this.userWallet = userWallet;
	}
	
}
