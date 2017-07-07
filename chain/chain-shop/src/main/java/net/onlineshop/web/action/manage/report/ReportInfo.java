package net.onlineshop.web.action.manage.report;

import java.io.Serializable;
import java.util.Date;

import org.apache.commons.lang.StringUtils;

import net.onlineshop.core.dao.QueryModel;
import net.onlineshop.core.util.DateUtil;

/**
 * 报表数据对象
 * 
 * 
 * 
 */
public class ReportInfo extends QueryModel implements Serializable {
	private static final long serialVersionUID = 1L;
	private String productID;
	private String supplierId;
	private String productName;// 商品名称
	private String name;// 商品名称
	private String shortName;// 商品名称
	private int productSellCount;// 报表.商品销售总数
	private String createdate;// 订单创建日期
	private double sumAmount;// 订单支付汇总金额
	private double walletAmount;// 订单支付汇总金额
	private double scoreAmount;// 订单支付汇总金额
	private String amountArr;
	private String orderdateArr;

	private String userType;

	public void clear() {
		productID = null;
		productName = null;
		productSellCount = 0;
		createdate = null;
		sumAmount = 0;

		amountArr = null;
		orderdateArr = null;
	}

	public String getProductID() {
		return productID;
	}

	public void setProductID(String productID) {
		this.productID = productID;
	}

	public int getProductSellCount() {
		return productSellCount;
	}

	public void setProductSellCount(int productSellCount) {
		this.productSellCount = productSellCount;
	}

	public String getCreatedate() {
		if (startDate != null && !"".equals(startDate)) {
			createdate = startDate + " ";
		} else if (endDate != null && !"".equals(endDate)) {
			createdate = createdate + endDate;
		} else {
			createdate = DateUtil.dateFormat(new Date(), "yyyy-MM-dd");
		}
		return createdate;
	}

	public void setCreatedate(String createdate) {
		this.createdate = createdate;
	}

	public double getSumAmount() {
		return sumAmount;
	}

	public void setSumAmount(double sumAmount) {
		this.sumAmount = sumAmount;
	}

	public String getAmountArr() {
		return amountArr;
	}

	public void setAmountArr(String amountArr) {
		this.amountArr = amountArr;
	}

	public String getOrderdateArr() {
		return orderdateArr;
	}

	public void setOrderdateArr(String orderdateArr) {
		this.orderdateArr = orderdateArr;
	}

	public String getProductName() {
		return StringUtils.trim(productName);
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	@Override
	public String toString() {
		return "sumAmount=" + sumAmount + ",createdate=" + createdate;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public double getWalletAmount() {
		return walletAmount;
	}

	public void setWalletAmount(double walletAmount) {
		this.walletAmount = walletAmount;
	}

	public double getScoreAmount() {
		return scoreAmount;
	}

	public void setScoreAmount(double scoreAmount) {
		this.scoreAmount = scoreAmount;
	}

	public String getShortName() {
		return StringUtils.trim(shortName);
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public String getName() {
		return StringUtils.trim(name);
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSupplierId() {
		return supplierId;
	}

	public void setSupplierId(String supplierId) {
		this.supplierId = supplierId;
	}
	
}
