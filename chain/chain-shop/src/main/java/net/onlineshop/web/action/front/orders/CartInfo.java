package net.onlineshop.web.action.front.orders;

import java.io.Serializable;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.services.front.account.impl.ScoreProxy;
import net.onlineshop.services.front.address.bean.Address;
import net.onlineshop.services.front.product.bean.Product;

/**
 * 购物车对象，独立出此对象是为了以后的方便操作，当业务进行扩展的时候不会导致系统混乱。
 * 
 * 
 * 
 */
public class CartInfo extends PagerModel implements Serializable {
	private static final long serialVersionUID = 1L;
	static final DecimalFormat datafomat = new DecimalFormat("#.00");
	private List<Product> productList;// 购物车中商品列表
	private Float amount=0f;// 合计总金额，也就是用户最终需要支付的金额
	private Integer cartNum;// 商品数量
	private Date orderDate;// 提交购物车时间
	private Integer orderTransFee;// 运费
	private List<Address> addressList;// 用户配送地址信息
	private ScoreProxy scoreProxy=null;
	@Deprecated
	private Address address;// 客户配送信息
	private String defaultAddessID;// 用户的默认地址ID
	
	public List<Product> getProductList() {
		this.setId("0");
		if (productList == null) {
			productList = new LinkedList<Product>();
		}
		return productList;
	}

	public void setProductList(List<Product> productList) {
		this.productList = productList;
	}
	
	public Date getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(Date orderDate) {
		this.orderDate = orderDate;
	}

	public Integer getOrderTransFee() {
		return orderTransFee;
	}

	public void setOrderTransFee(Integer orderTransFee) {
		this.orderTransFee = orderTransFee;
	}

	public Address getAddress() {
		if (address == null) {
			address = new Address();
		}
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	/**
	 * 购物车汇总计算总金额
	 * 
	 * @return
	 */
	public void totalCacl() {
		getScoreProxy().totalCacl(this.getProductList());
	}
	
	 
	
	

	public ScoreProxy getScoreProxy() {
		if(this.scoreProxy==null)
			this.scoreProxy=new ScoreProxy();
		return this.scoreProxy;
	}

	public void setScoreProxy(ScoreProxy scoreProxy) {
		this.scoreProxy = scoreProxy;
	}

	@Override
	public void clear() {
		if (productList != null) {
			for (int i = 0; i < productList.size(); i++) {
				productList.get(i).clear();
			}
			productList.clear();
			productList = null;
		}
		amount = null;
		if (address != null) {
			address.clear();
		}
	}

	public String getDefaultAddessID() {
		return defaultAddessID;
	}

	public void setDefaultAddessID(String defaultAddessID) {
		this.defaultAddessID = defaultAddessID;
	}

	public List<Address> getAddressList() {
		return addressList;
	}

	public void setAddressList(List<Address> addressList) {
		this.addressList = addressList;
	}

	public Integer getCartNum() {
		return cartNum;
	}

	public void setCartNum(Integer cartNum) {
		this.cartNum = cartNum;
	}

	public Float getAmount() {
		return amount;
	}

	public void setAmount(Float amount) {
		this.amount = amount;
	}


	@Override
	public String toString() {
		return "CartInfo [productList=" + productList + ", amount=" + amount + ", addressList=" + addressList + ", address=" + address + ", defaultAddessID=" + defaultAddessID + "]";
	}
}
