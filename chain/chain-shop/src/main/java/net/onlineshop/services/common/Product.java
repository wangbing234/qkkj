package net.onlineshop.services.common;

import java.io.Serializable;

import net.onlineshop.core.dao.QueryModel;

/**
 * 商品
 * 
 * 
 * 
 */
public class Product extends QueryModel implements Serializable {
	private static final long serialVersionUID = 1L;
	private String supplierId;
	private String id;
	private String catalogID;// 商品目录ID
	private int productType;
	private String name;// 商品名称
	private String shortname;// 短名称
	private String introduce;// 商品简介
	private String price;// 定价
	private String nowPrice;// 现价
	private String productHTML;// 商品介绍的HTML
	private String picture;// 小图片地址
	private String maxPicture;// 大图片地址
	private String images;// 商品图片列表
	private int score;// 赠送积分
	private String isnew;// 是否新品。n：否，y：是
	private String sale;// 是否特价。n：否，y：是
	private int hit;// 浏览次数
	private String unit;// 商品单位。默认“item:件”
	private String createAccount;// 创建者
	private String createtime;// 录入时间
	private String updateAccount;
	private String updatetime;
	private String activityID;// 活动ID
	private String giftID;// 赠品ID
	private int createID;// 录入人
	private int sellcount;// 销售数量
	private int stock;// 库存
	private String searchKey;
	private String isTimePromotion;// 是否限时促销。n：否，y：是
	private int status;// 商品状态。1：新增，2：已上架，3：已下架
	private String title;// 商品页面标题
	private String description;// 页面描述
	private String keywords;// 页面关键字
	private String taourl;// 是否包邮
	private Boolean draft;// 草稿
	private String quality;// 款号
	private String istui;//// 是否推荐。n：否，y：是
	private String ismiao;// 是否秒杀
	private String miaoPrice;// 秒杀价
	private String miaoSta;// 秒杀时间
	private String miaoEnd;// 秒杀时间
	private String miaoTime;// 剩余时间
	private int point;// 积分点数
	public static final int Product_status_add = 1;// 新增商品
	public static final int Product_status_y = 2;// 已上架
	public static final int Product_status_n = 3;// 已下架
	/**
	 * 是否新品
	 */
	public static final String Product_isnew_n = "n";
	public static final String Product_isnew_y = "y";
	/**
	 * 是否推荐
	 */
	public static final String Product_istui_n = "n";
	public static final String Product_istui_y = "y";
	/**
	 * 是否特价
	 */
	public static final String Product_sale_n = "n";
	public static final String Product_sale_y = "y";
	/**
	 * 是否限时促销
	 */
	public static final String Product_isTimePromotion_n = "n";
	public static final String Product_isTimePromotion_y = "y";

	public void clear() {
		super.clear();
		id = null;
		catalogID = null;
		name = null;
		introduce = null;
		price = null;
		nowPrice = null;
		picture = null;
		maxPicture = null;
		images = null;
		createAccount = null;
		createtime = null;
		updateAccount = null;
		updatetime = null;
		shortname = null;
		score = 0;
		isnew = null;
		sale = null;
		hit = 0;
		unit = null;
		activityID = null;
		giftID = null;
		status = 0;
		title = null;
		description = null;
		keywords = null;
		sellcount = 0;
		stock = 0;
		searchKey = null;
		taourl = null;
		draft = null;
		createID = 0;
		isTimePromotion = null;
		productHTML = null;
		quality = null;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCatalogID() {
		return catalogID;
	}

	public void setCatalogID(String catalogID) {
		this.catalogID = catalogID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIntroduce() {
		return introduce;
	}

	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public String getNowPrice() {
		return nowPrice;
	}

	public void setNowPrice(String nowPrice) {
		this.nowPrice = nowPrice;
	}

	public String getProductHTML() {
		return productHTML;
	}

	public void setProductHTML(String productHTML) {
		this.productHTML = productHTML;
	}

	public String getPicture() {
		return picture == null ? "" : picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	public String getMaxPicture() {
		return maxPicture;
	}

	public void setMaxPicture(String maxPicture) {
		this.maxPicture = maxPicture;
	}

	public String getImages() {
		return images;
	}

	public void setImages(String images) {
		this.images = images;
	}

	public String getCreatetime() {
		return createtime;
	}

	public void setCreatetime(String createtime) {
		this.createtime = createtime;
	}

	public int getScore() {
		return score;
	}

	public void setScore(int score) {
		this.score = score;
	}

	public String getIsnew() {
		return isnew;
	}

	public void setIsnew(String isnew) {
		this.isnew = isnew;
	}

	public String getSale() {
		return sale;
	}

	public void setSale(String sale) {
		this.sale = sale;
	}

	public int getHit() {
		return hit;
	}

	public void setHit(int hit) {
		this.hit = hit;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getActivityID() {
		return activityID;
	}

	public void setActivityID(String activityID) {
		this.activityID = activityID;
	}

	public int getCreateID() {
		return createID;
	}

	public void setCreateID(int createID) {
		this.createID = createID;
	}

	public int getSellcount() {
		return sellcount;
	}

	public void setSellcount(int sellcount) {
		this.sellcount = sellcount;
	}

	public int getStock() {
		return stock;
	}

	public void setStock(int stock) {
		this.stock = stock;
	}

	public String getIsTimePromotion() {
		return isTimePromotion;
	}

	public void setIsTimePromotion(String isTimePromotion) {
		this.isTimePromotion = isTimePromotion;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getKeywords() {
		return keywords;
	}

	public void setKeywords(String keywords) {
		this.keywords = keywords;
	}

	public String getCreateAccount() {
		return createAccount;
	}

	public void setCreateAccount(String createAccount) {
		this.createAccount = createAccount;
	}

	public String getUpdateAccount() {
		return updateAccount;
	}

	public void setUpdateAccount(String updateAccount) {
		this.updateAccount = updateAccount;
	}

	public String getUpdatetime() {
		return updatetime;
	}

	public void setUpdatetime(String updatetime) {
		this.updatetime = updatetime;
	}

	public String getSearchKey() {
		return searchKey;
	}

	public void setSearchKey(String searchKey) {
		this.searchKey = searchKey;
	}

	public String getGiftID() {
		return giftID;
	}

	public void setGiftID(String giftID) {
		this.giftID = giftID;
	}

	public String getTaourl() {
		return taourl;
	}

	public void setTaourl(String taourl) {
		this.taourl = taourl;
	}

	public Boolean getDraft() {
		return draft;
	}

	public void setDraft(Boolean draft) {
		this.draft = draft;
	}

	public String getIstui() {
		return istui;
	}

	public void setIstui(String istui) {
		this.istui = istui;
	}

	public String getQuality() {
		return quality;
	}

	public void setQuality(String quality) {
		this.quality = quality;
	}

	public String getShortname() {
		return shortname;
	}

	public void setShortname(String shortname) {
		this.shortname = shortname;
	}

	public String getIsmiao() {
		return ismiao;
	}

	public void setIsmiao(String ismiao) {
		this.ismiao = ismiao;
	}

	public String getMiaoPrice() {
		return miaoPrice;
	}

	public void setMiaoPrice(String miaoPrice) {
		this.miaoPrice = miaoPrice;
	}

	public String getMiaoSta() {
		if (miaoSta != null && miaoSta.length() > 10) {

			miaoSta = miaoSta.substring(0, 10);
		}
		return miaoSta;
	}

	public void setMiaoSta(String miaoSta) {
		this.miaoSta = miaoSta;
	}

	public String getMiaoEnd() {
		return miaoEnd;
	}

	public void setMiaoEnd(String miaoEnd) {
		this.miaoEnd = miaoEnd;
	}

	public String getMiaoTime() {
		return miaoTime;
	}

	public void setMiaoTime(String miaoTime) {
		this.miaoTime = miaoTime;
	}
	public int getPoint() {
		return point;
	}

	public void setPoint(int point) {
		this.point = point;
	}

	public int getProductType() {
		return productType;
	}

	public void setProductType(int productType) {
		this.productType = productType;
	}
	public String getSupplierId() {
		return supplierId;
	}

	public void setSupplierId(String supplierId) {
		this.supplierId = supplierId;
	}
}
