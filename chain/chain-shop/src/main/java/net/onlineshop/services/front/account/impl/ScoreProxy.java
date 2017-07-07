package net.onlineshop.services.front.account.impl;

import java.io.Serializable;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import net.onlineshop.core.emun.ProductType;
import net.onlineshop.core.listener.CoreParamCache;
import net.onlineshop.services.front.account.AccountService;
import net.onlineshop.services.front.account.bean.MebPoint;
import net.onlineshop.services.front.account.bean.MebWallet;
import net.onlineshop.services.front.order.bean.Order;
import net.onlineshop.services.front.product.bean.Product;

public class ScoreProxy  implements Serializable{
	MebPoint point;
	MebWallet wal;
	/**-------------------消费钱包------------------------- **/
	private float cutShopFree;//需要钱包 
	private float oldShopFree;//需要钱包 
	/**-------------------积分钱包------------------------- **/
	private float cutPointFree;//需要积分
	private float oldPointFree;//库存消费积分
	
	/**-------------------现金------------------------- **/
//	private float cutMoney;
//	private float returnScore;
//	private float expectScore;//预计捐赠额度
//	private float afterBuyScore;//预计捐赠额度
	
	/**-------------------总金额，转换后的------------------------- **/
	private float amount;
	private int quantity=0;//商品数量
	
	List<Integer> moneypic =null;
	private String oldMessage;
	
	
	/**
	 * 购物车汇总计算总金额
	 * 
	 * @return
	 */
	public void totalCacl(Order order) {
		quantity=order.getQuantity();
		this.amount=Float.parseFloat(order.getAmount());
		//积分
		cutPointFree=order.getCutPointFree();
		//钱包
		cutShopFree=order.getCutShopFree();
		//钱包
//		this.cutMoney=order.getCutMoney();
//		this.returnScore=order.getReurnScore();
//		this.afterBuyScore=returnScore+order.getOldScoreTatal();
//		this.expectScore=getOverScores(afterBuyScore);
//		moneypic=(List<Integer>)CoreParamCache.getInstance().get("entryStage");
//		float maxScore=moneypic.get(moneypic.size()-1);
//		if (afterBuyScore > maxScore) {
//			this.expectScore = maxScore;
//		} else {
//			this.expectScore = ((int) afterBuyScore) / 100 * 100;
//		}
	}
	
	public void totalCacl(List<Product> productList) {
		float _amount = 0;
		int _totalExchangeScore = 0;
		float _totalExchangeWallet = 0;
//		float _totalExchangeMoney = 0;
//		float _totalMoneyReurnScore = 0;
		quantity=0;
		for (Product p : productList) {
			quantity+=p.getBuyCount();
			_amount+=Double.valueOf(p.getNowPrice()) * p.getBuyCount();
			String productType = p.getProductType()+"";
			int buyCount= p.getBuyCount();
			//积分
			if(ProductType.POINT.getCode().equals(productType)) {
				_totalExchangeScore += Double.valueOf(p.getNowPrice()) * buyCount;
			}
			//消费
			else if(ProductType.DONATION.getCode().equals(productType) ){
				_totalExchangeWallet += Double.valueOf(p.getNowPrice()) * buyCount;
			}
//			//现金
//			else if(ProductType.OPEN.getCode().equals(productType) ){
//				_totalExchangeMoney += Double.valueOf(p.getNowPrice()) * buyCount;
//				_totalMoneyReurnScore+=Double.valueOf(p.getPoint()) * buyCount;
//			}
		}
		//积分
		this.cutPointFree = _totalExchangeScore;
		//消费商城
		this.cutShopFree=_totalExchangeWallet;
//		//开单付款
//		this.cutMoney=_totalExchangeMoney;
//		this.returnScore=_totalMoneyReurnScore;
		this.amount=_amount;
	}
	
	
	/**
	 * @param accountService
	 * @param id 账户ID
	 * @param _cutScore  需要积分
	 * @param _cut2Score 需要消费券
	 * @param _cutWallet 提供钱包
	 * @return
	 */
	public  String getOldMessage(AccountService accountService,String id,float _cutPointFree,float _cutShopFree){
		String oldMessageType="";
		this.oldMessage="";
		if(_cutPointFree>0f){
			MebPoint point =accountService.getPoint(id);
			setPoint(point); 
			if(_cutPointFree>0 &&_cutPointFree>point.getPoint_free())
				oldMessageType+="|消费积分";
		}
		 
		if(_cutShopFree>0)
		{
			MebWallet wal = accountService.getWallet(Integer.parseInt(id));
			setWal(wal); 
			if(_cutShopFree>wal.getShop_free())
				oldMessageType+="|消费券";
		}
		//如果钱包
//		Integer entryStageMoney1=((List<Integer>)CoreParamCache.getInstance().get("entryStage")).get(0);
//		if(cutMoney>0 && cutMoney<entryStageMoney1 && StringUtils.isEmpty(oldMessageType) )
//			this.oldMessage="开单金额不足，无法提交订单（开单金额必须大于）"+entryStageMoney1;
		if(StringUtils.isNotEmpty(oldMessageType))
			this.oldMessage="您的"+oldMessageType.substring(1)+"不足，无法提交订单";
		return this.oldMessage;
	}
	
	public String getOldMessage() {
		 return this.oldMessage;
	}
	
	public void setOldMessage(String oldMessage) {
		 this.oldMessage=oldMessage;
	}
	
	/**
	 * 获取溢出值
	 * @param totalMoneyScoreOut
	 * @return
	 */
	private Integer getOverScores(float score){
		if(moneypic ==null) {
			moneypic=(List<Integer>)CoreParamCache.getInstance().get("entryStage");
		}
		for (int i = 0; i < moneypic.size(); i++) {
			if(i==moneypic.size()-1) {
				return moneypic.get(moneypic.size()-1);
			}
			Boolean isMatch=rangeInDefined(score,moneypic.get(i),moneypic.get(i+1));
			if(isMatch) {
				return i==0?0:moneypic.get(i);
			}
		}
		return 0;
	}
	
	/**
	 * 求是否在区间内
	 * @param current
	 * @param min
	 * @param max
	 * @return
	 */
	private  boolean rangeInDefined(float current, float min, float max)
    {  
        return current>=min && current<max;  
    }  
	
	public MebPoint getPoint() {
		return point;
	}

	public void setPoint(MebPoint point) {
		this.point = point;
	}

	public MebWallet getWal() {
		return wal;
	}

	public void setWal(MebWallet wal) {
		this.wal = wal;
	}

//	public float getCutWalletReward() {
//		return cutWalletReward;
//	}
//
//	public void setCutWalletReward(float cutWalletReward) {
//		this.cutWalletReward = cutWalletReward;
//	}
//
//	public float getCutWalletShop() {
//		return cutWalletShop;
//	}
//
//	public void setCutWalletShop(float cutWalletShop) {
//		this.cutWalletShop = cutWalletShop;
//	}
//
//	public float getOldWalletReward() {
//		return wal!=null?wal.getGrow_free():0f;
//	}
//
//
//	public float getCutWallet() {
//		return cutWallet;
//	}
//
//	public void setCutWallet(float cutWallet) {
//		this.cutWallet = cutWallet;
//	}

	public float getOldPointFree() {
		return point!=null?point.getPoint_free():0f;
	}

//	public float getOldPoint2Free() {
//		return point!=null?point.getPoint2_free().intValue():0;
//	}

//	public float getCutMoney() {
//		return cutMoney;
//	}

//	public void setCutMoney(float cutMoney) {
//		this.cutMoney = cutMoney;
//	}

	public float getAmount() {
		return amount;
	}

	public void setAmount(float amount) {
		this.amount = amount;
	}

//	public float getReturnScore() {
//		return returnScore;
//	}
//
//	public void setReturnScore(float returnScore) {
//		this.returnScore = returnScore;
//	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public List<Integer> getMoneypic() {
		return moneypic;
	}

	public void setMoneypic(List<Integer> moneypic) {
		this.moneypic = moneypic;
	}

//	public float getExpectScore() {
//		return expectScore;
//	}
//
//	public void setExpectScore(float expectScore) {
//		this.expectScore = expectScore;
//	}
//
//	public float getAfterBuyScore() {
//		return afterBuyScore;
//	}
//
//	public void setAfterBuyScore(float afterBuyScore) {
//		this.afterBuyScore = afterBuyScore;
//	}

//	public float getCutGrowFree() {
//		return cutGrowFree;
//	}
//
//	public void setCutGrowFree(float cutGrowFree) {
//		this.cutGrowFree = cutGrowFree;
//	}

	public float getCutPointFree() {
		return cutPointFree;
	}

	public void setCutPointFree(float cutPointFree) {
		this.cutPointFree = cutPointFree;
	}

//	public float getCutPoint2Free() {
//		return cutPoint2Free;
//	}
//
//	public void setCutPoint2Free(float cutPoint2Free) {
//		this.cutPoint2Free = cutPoint2Free;
//	}
//
//	public float getOldGrowFree() {
//		return oldGrowFree;
//	}
//
//	public void setOldGrowFree(float oldGrowFree) {
//		this.oldGrowFree = oldGrowFree;
//	}

	public void setOldPointFree(float oldPointFree) {
		this.oldPointFree = oldPointFree;
	}

	 

//	public void setOldPoint2Free(float oldPoint2Free) {
//		this.oldPoint2Free = oldPoint2Free;
//	}

	public float getCutShopFree() {
		return cutShopFree;
	}

	public void setCutShopFree(float cutShopFree) {
		this.cutShopFree = cutShopFree;
	}

	public float getOldShopFree() {
		return wal!=null?wal.getShop_free():0f;
	}

	public void setOldShopFree(float oldShopFree) {
		this.oldShopFree = oldShopFree;
	}

	
	
}
