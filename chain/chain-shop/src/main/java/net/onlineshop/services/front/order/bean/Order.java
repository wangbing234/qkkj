package net.onlineshop.services.front.order.bean;import java.io.Serializable;import java.util.HashMap;import java.util.LinkedList;import java.util.List;import java.util.Map;import net.onlineshop.core.kuaidi.Kuaidi100Info;import net.onlineshop.services.front.account.impl.ImageUtils;import net.onlineshop.services.front.account.impl.ScoreProxy;import net.onlineshop.services.front.orderdetail.bean.Orderdetail;import net.onlineshop.services.front.ordership.bean.Ordership;public class Order extends net.onlineshop.services.common.Order implements Serializable {	private static final long serialVersionUID = 1L;	private String picture;// 商品图片	private ScoreProxy scoreProxy;	/*	 * 查询我的订单列表,使用一条SQL完成,保存在下列属性中	 */	private int productNumber;// 商品数量	private double price;// 商品单价金额	private String productName;// 商品名称.取自订单项表	private String orderdetailID;// 订单项ID	private String isComment;// 是否评价过。n:未评价,y:已评价；默认	private List<String> queryOrderIDs;// 查询订单的ID集合	private String specInfo;// 商品规格	private List<Order> orders;// 订单对象的订单明细信息,但是此信息都是用Order对象存储的,因为ibaties查询出来的数据只能放到一个对象中,暂时就放在了订单对象中	private List<Orderdetail> orderdetail;// 订单明细集合	private Ordership ordership;// 订单配送信息	private Kuaidi100Info kuaid100Info;// 订单明细--快递信息	// private Orderpay orderpay;//支付记录	private String orderpayID;// 支付记录ID	private String tradeNo;// 支付宝交易号	private String selectAddressID;// 选中的收货地址的ID	// private String wIDsubject;//订单支付时候显示的文字	private int payType;// 支付类型:支付宝支付：1:支付宝,2:微信, 3:打款截图, 4:直接支付	private String picurl160;	private String picurl400;	private static Map<String,Integer> VERSION_LOCK=new HashMap<String, Integer>();	public String getPicurl160() {		if (this.getPicture() != null && !"".equals(this.getPicture())) {			picurl160 = ImageUtils.replaceLast(this.getPicture(),"_3", "_1");		}		return picurl160;	}		public static Integer getVersionIdAndUpdate(String id){		 Integer newVersion = getVersionId(id)+1;		 VERSION_LOCK.put(id, newVersion);		 return newVersion;	}		public static Integer getVersionId(String id){		Integer intObj = Order.VERSION_LOCK.get(id);		if(null ==intObj)			return 0;		return intObj;	}	public void setPicurl160(String picurl160) {		this.picurl160 = picurl160;	}	public String getPicurl400() {		if (this.getPicture() != null && !"".equals(this.getPicture())) {			picurl400 = ImageUtils.replaceLast(this.getPicture(),"_3", "_2");		}		return picurl400;	}	public void setPicurl400(String picurl400) {		this.picurl400 = picurl400;	}		private List<Orderdetail> rateOrderdetailList;// 可以进行评论的商品列表	public void clear() {		super.clear();		picture = null;		specInfo = null;		productNumber = 0;		price = 0;		productName = null;		isComment = null;		orderdetailID = null;		payType = 0;		if (orderdetail != null) {			orderdetail.clear();		}		orderdetail = null;		if (orders != null) {			orders.clear();		}		orders = null;		if (queryOrderIDs != null) {			queryOrderIDs.clear();		}		queryOrderIDs = null;		if (ordership != null) {			ordership.clear();			ordership = null;		}		if (kuaid100Info != null) {			kuaid100Info.clear();			kuaid100Info = null;		}		orderpayID = null;		tradeNo = null;		selectAddressID = null;		if (rateOrderdetailList != null) {			rateOrderdetailList.clear();			rateOrderdetailList = null;		}	}		public ScoreProxy getScoreProxy() {		if(this.scoreProxy==null)			this.scoreProxy=new ScoreProxy();		return this.scoreProxy;	}	public void setScoreProxy(ScoreProxy scoreProxy) {		this.scoreProxy = scoreProxy;	}	public List<Orderdetail> getOrderdetail() {		return orderdetail;	}	public void setOrderdetail(List<Orderdetail> orderdetail) {		this.orderdetail = orderdetail;	}	public int getProductNumber() {		return productNumber;	}	public void setProductNumber(int productNumber) {		this.productNumber = productNumber;	}	public double getPrice() {		return price;	}	public void setPrice(double price) {		this.price = price;	}	public String getProductName() {		return productName;	}	public void setProductName(String productName) {		this.productName = productName;	}	public List<Order> getOrders() {		if (this.orders == null) {			this.orders = new LinkedList<Order>();		}		return orders;	}	public void setOrders(List<Order> orders) {		this.orders = orders;	}	public List<String> getQueryOrderIDs() {		return queryOrderIDs;	}	public void setQueryOrderIDs(List<String> queryOrderIDs) {		this.queryOrderIDs = queryOrderIDs;	}	public String getPicture() {		return picture;	}	public void setPicture(String picture) {		this.picture = picture;	}	public String getIsComment() {		return isComment;	}	public void setIsComment(String isComment) {		this.isComment = isComment;	}	public String getOrderdetailID() {		return orderdetailID;	}	public void setOrderdetailID(String orderdetailID) {		this.orderdetailID = orderdetailID;	}	public Ordership getOrdership() {		return ordership;	}	public void setOrdership(Ordership ordership) {		this.ordership = ordership;	}	public Kuaidi100Info getKuaid100Info() {		return kuaid100Info;	}	public void setKuaid100Info(Kuaidi100Info kuaid100Info) {		this.kuaid100Info = kuaid100Info;	}	public String getOrderpayID() {		return orderpayID;	}	public void setOrderpayID(String orderpayID) {		this.orderpayID = orderpayID;	}	public String getTradeNo() {		return tradeNo;	}	public void setTradeNo(String tradeNo) {		this.tradeNo = tradeNo;	}	public String getSelectAddressID() {		return selectAddressID;	}	public void setSelectAddressID(String selectAddressID) {		this.selectAddressID = selectAddressID;	}	public List<Orderdetail> getRateOrderdetailList() {		return rateOrderdetailList;	}	public void setRateOrderdetailList(List<Orderdetail> rateOrderdetailList) {		this.rateOrderdetailList = rateOrderdetailList;	}	public int getPayType() {		return payType;	}	public void setPayType(int payType) {		this.payType = payType;	}	public String getSpecInfo() {		return specInfo;	}	public void setSpecInfo(String specInfo) {		this.specInfo = specInfo;	}   }