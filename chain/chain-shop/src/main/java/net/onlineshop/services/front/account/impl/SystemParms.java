package net.onlineshop.services.front.account.impl;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import net.onlineshop.core.emun.ProductType;
import net.onlineshop.core.front.SystemManager;
import net.onlineshop.core.listener.CoreParamCache;
import net.onlineshop.core.pay.alipay.alipayescow.util.httpClient.HttpTookit;
import net.onlineshop.services.front.product.bean.Product;
import net.onlineshop.services.manage.supplier.bean.Supplier;

public class SystemParms {
	private static final Logger logger = LoggerFactory.getLogger(SystemParms.class);
	public final static String LOGIN_OUT_PAGE="/shop/backlogin.html";
	public  static String SERVER_ROOT_PATH="";
	// public static Task task;//系统定时任务
	//在配置文件中使用，互捐平台前缀
	public static String PREFIX_CQS=(String)CoreParamCache.getInstance().get("prefixCqs");
	//在配置文件中使用，互捐平台前缀
	public static String PREFIX_POINT=(String)CoreParamCache.getInstance().get("prefixPoint");
	public static float getPoint2money() {
		float point2money=2.5f;
		try {
			Object point2moneyStr=CoreParamCache.getInstance().get("pointToMoneyURL");
			String pointRatio=HttpTookit.sendGet(point2moneyStr.toString());
			if(!StringUtils.isEmpty(pointRatio)) {
				point2money=Float.parseFloat(pointRatio);
			}
			else {
				logger.debug("无法获取积分系统价格");
//				throw new RuntimeException("无法获取积分系统价格！");
			}
			
		} catch (Exception e) {
			logger.info("获取积分比例报错：");
//			e.printStackTrace();
		}
		return point2money;
	}
	
	public static String getSupplierNameById(String sId) {
		for (Supplier sup : SystemManager.supplierList) {
			if(sup.getId().equals(sId)){
				return sup.getName();
			}
		}
		return null;
	}
	
	
	/**
	 * 获取分类
	 * @param catalogID
	 * @return
	 */
	public static String getCatalogName(String catalogID) {
		String catalogName;
//		if (ProductType.OPEN.getCode().equals(catalogID)) {
//			catalogName= ProductType.OPEN.getName();
//		}
//		else 
		if(ProductType.POINT.getCode().equals(catalogID)){
			catalogName= ProductType.POINT.getName();
		}
		else if(ProductType.DONATION.getCode().equals(catalogID)){
			catalogName= ProductType.DONATION.getName();
		}
		else{
			catalogName= "找不到分类";
		}
		return catalogName;
	}
	
	
	
}
