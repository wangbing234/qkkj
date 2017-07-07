package net.onlineshop.web.action.front.cart;

import java.io.IOException;
import java.text.DecimalFormat;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.data.redis.core.RedisTemplate;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.FrontContainer;
import net.onlineshop.core.util.RedisSevice;
import net.onlineshop.services.TransportService;
import net.onlineshop.services.front.account.AccountService;
import net.onlineshop.services.front.address.AddressService;
import net.onlineshop.services.front.favorite.FavoriteService;
import net.onlineshop.services.front.product.ProductService;
import net.onlineshop.services.front.product.bean.Product;
import net.onlineshop.services.front.questionnaireResult.bean.QuestionnaireResult;
import net.onlineshop.services.manage.spec.SpecService;
import net.onlineshop.services.manage.spec.bean.Spec;
import net.onlineshop.web.action.front.orders.CartInfo;

/**
 * 购物车
 */
public class CartAction extends BaseAction<CartInfo> {
	private static final long serialVersionUID = 1L;
	private static final Logger logger = Logger.getLogger(CartAction.class);
	private ProductService productService;
	private AddressService addressService;
	private FavoriteService favoriteService;// 商品收藏夹服务
	private SpecService specService;
	private TransportService transportService;
	private AccountService accountService;
	private RedisSevice redisSevice;
	public void setRedisSevice(RedisSevice redisSevice) {
		this.redisSevice = redisSevice;
	}

	public SpecService getSpecService() {
		return specService;
	}

	public void setSpecService(SpecService specService) {
		this.specService = specService;
	}

	public void setAddressService(AddressService addressService) {
		this.addressService = addressService;
	}

	public void setProductService(ProductService productService) {
		this.productService = productService;
	}

	protected void selectListAfter() {
		pager.setPagerUrl("cart!selectList.action");
	}

	public CartInfo getE() {
		return this.e;
	}

	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new CartInfo();
		}
	}

	public void insertAfter(QuestionnaireResult e) {
		e.clear();
	}

	@Override
	public void insertAfter(CartInfo e) {
	}

	/**
	 * 查看购物车
	 * 
	 * @return
	 */
	public String cart() {
		super.setSelectMenu(FrontContainer.not_select_menu);// 设置主菜单为不选中
		String fromModule = this.getFromModule();
		if (fromModule.equals("PC")) {
			return "pc_cart";
		}
		return "cart";
	}
	
	/**
	 * 查看购物车AJAX
	 * 
	 * @return
	 */
	public void cartDetail() throws IOException{
		CartInfo cartInfo = redisSevice.getCartInfo(getRequest());
		printSuccess(cartInfo);
	}

	/**
	 * 从购物车中删除指定的产品
	 * @return
	 * @throws IOException
	 */
	public void delete() throws IOException {
		String id = getRequest().getParameter("id");
		if (StringUtils.isBlank(id)) {
			printRunTimeError("非法请求！");
			return;
		}

		CartInfo cartInfo = redisSevice.getCartInfo(getRequest());
		if (cartInfo == null) {
			printRunTimeError("购物车为空！");
			return;
		}

		for (Iterator<Product> it = cartInfo.getProductList().iterator(); it.hasNext();) {
			Product p = it.next();
			if (p.getId().equals(id)) {
				it.remove();
				break;
			}
		}
		cartInfo.totalCacl();
		redisSevice.setCartInfo(getRequest(), cartInfo);
		printSuccess(cartInfo);
	}

	DecimalFormat df = new DecimalFormat("0.00");

	/**
	 * 加入购物车，不对金额进行任何的运算。金额的运算在方法CartAction.notifyCart
	 * 
	 * @return
	 * @throws IOException
	 */
	public String addToCart() throws IOException {
		logger.debug("ProductAction.cart...");
		String productID = getRequest().getParameter("productID");// 商品ID
		int buyCount = Integer.valueOf(getRequest().getParameter("buyCount"));// 购买数量
		String buySpecID = getRequest().getParameter("buySpecID");// 选中的规格ID
		if (StringUtils.isEmpty(productID) || buyCount <= 0) {
			printAppError("参数错误！");
			return null;
		}
		/**
		 * 检查内存库存是否已超卖，如果超库存不足，则提醒用户
		 */
		Integer ss = specService.selectStockById(Integer.parseInt(buySpecID));
//		if (ss == null || ss <= 0) {
////			String jsonError = JSON.toJSONString(new StockErrorProduct(productID, "很抱歉，该商品库存不足或已下架。"));
//			printAppError("很抱歉，该商品库存不足或已下架。");
//			return null;
//		} else if (ss < buyCount) {
////			String jsonError = JSON.toJSONString(new StockErrorProduct(productID, "该商品库存不足，最多购买" + ss + "件"));
////			logger.debug("jsonError=" + jsonError);
//			printAppError("该商品库存不足，最多购买" + ss + "件");
//			return null;
//		}

		CartInfo cartInfo =  redisSevice.getCartInfo(getRequest());
		if (cartInfo == null) {
			cartInfo = new CartInfo();
		}

		// 检查指定的产品是否已购买到购物车，购买了则数量++，否则查询后添加到购物车
		boolean exists = false;
		for (Product p : cartInfo.getProductList()) {
			// 没有规格
			if (StringUtils.isEmpty(buySpecID)) {
				if (p.getId().equals(productID)) {
					p.setBuyCount(p.getBuyCount() + buyCount);
					logger.debug("商品已购买，只对数量进行++，总数=" + p.getBuyCount());

					if (isMiao(p)) {
						p.setTotal0(df.format(p.getBuyCount() * Double.valueOf(p.getMiaoPrice())));
					} else {
						p.setTotal0(df.format(p.getBuyCount() * Double.valueOf(p.getNowPrice())));
					}

					exists = true;

				}
			} else if (p.getId().equals(productID) && p.getBuySpecInfo().getId().equals(buySpecID)) {
				p.setBuyCount(p.getBuyCount() + buyCount);
				logger.debug("商品已购买，只对数量进行++，总数=" + p.getBuyCount());
				if (isMiao(p)) {
					p.setTotal0(df.format(p.getBuyCount() * Double.valueOf(p.getMiaoPrice())));
				} else {
					p.setTotal0(df.format(p.getBuyCount() * Double.valueOf(p.getNowPrice())));
				}
				exists = true;
			}
		}
		// 如果购物车中部存在此商品，则添加到购物车
		if (!exists) {
			Product product = new Product();
			product.setId(productID);
			// product.setStatus(1);
			product = productService.selectOne(product);
			if (product == null) {
				printAppError("不存在的产品!");
				return null;
			}
			product.setBuyCount(buyCount);
			/**
			 * 加载指定商品的规格信息
			 */
			if (StringUtils.isNotBlank(buySpecID)) {
				Spec spec = specService.selectById(buySpecID);
				if (spec == null) {
					printAppError("根据指定的规格" + buySpecID + "查询不到任何数据!");
					return null;
				}
				product.setBuySpecInfo(spec);

				// 减少以后的逻辑判断，规格的价格等同于商品的价格
				String specPrice = spec.getSpecPrice();
				if (specPrice != null) {
					product.setNowPrice(spec.getSpecPrice());
				}
			}
			if (isMiao(product)) {
				product.setTotal0(df.format(product.getBuyCount() * Double.valueOf(product.getMiaoPrice())));
				product.setNowPrice(product.getMiaoPrice());
				product.setIsmiao("y");
			} else {
				product.setTotal0(df.format(product.getBuyCount() * Double.valueOf(product.getNowPrice())));
				product.setIsmiao("n");
			}

			cartInfo.getProductList().add(product);

			logger.debug("添加商品到购物车!商品ID=" + product.getId());
		}
		cartInfo.totalCacl();// 计算购物车中商品总金额
		redisSevice.setCartInfo(getRequest(), cartInfo);
		e.clear();
		printSuccess(null);;// 成功添加商品到购物车 
		logger.debug("cartInfo=" + cartInfo);
		return null;
	}

	/**
	 * 当前产品是否是秒杀
	 * @param e
	 * @return
	 */
	public Boolean isMiao(Product e) {
//		if (e.getIsmiao() != null && "y".equals(e.getIsmiao()) && e.getMiaoEnd() != null && !"".equals(e.getMiaoEnd()) && e.getMiaoSta() != null && !"".equals(e.getMiaoSta())) {
//			if (e.getMiaoEnd().compareTo(DateUtil.dateFormat(new Date(), DateUtil.SHORT_MODEL)) >= 0 && e.getMiaoSta().compareTo(DateUtil.dateFormat(new Date(), DateUtil.SHORT_MODEL)) <= 0) {
//				return true;
//			}
//		}
		return false;
	}

	/**
	 * 计算购物车商品数量
	 * @return
	 * @throws IOException
	 */
	public String cartCount() throws IOException {
		CartInfo cartInfo =  redisSevice.getCartInfo(getRequest());
		if (cartInfo == null) {
			this.printJson("0");
		} else {
			Integer buycount = 0;
			for (int i = 0; i < cartInfo.getProductList().size(); i++) {
				Product p = cartInfo.getProductList().get(i);
				buycount = buycount + p.getBuyCount();
			}
			this.printJson(buycount.toString());
		}
		return null;
	}

	
	
	/**
	 * 通知购物车+-商品，然后计算出总金额返回。
	 * 
	 * @return
	 * @throws IOException
	 */
	public String changeCartNum() throws IOException {
		int currentBuyNumber = Integer.valueOf(getRequest().getParameter("currentBuyNumber"));// 当前购买的商品的数量
		String productID = getRequest().getParameter("productID");// +-的商品ID
		String buySpecID = getRequest().getParameter("buySpecID");// 选中的规格ID

		if (StringUtils.isBlank(productID) || currentBuyNumber <= 0) {
			printAppError("非法请求!");
			return null;
		}

		CartInfo cartInfo =  redisSevice.getCartInfo(getRequest());
		if (cartInfo == null || cartInfo.getProductList() == null || cartInfo.getProductList().size() == 0) {
			// 购物车失效，转到登陆页面
			printErrorBase(0,"购物车为空!","-1");
			return null;
		}

		// String msg = null;
//		CartProductInfo cartProductInfo = new CartProductInfo();

		/**
		 * 检查购买的商品是否超出库存数
		 */
//		Integer ss = specService.selectStockById(Integer.parseInt(buySpecID));
//		if (ss == null || ss <= 0) {
//			// 商品已卖完或已下架，请联系站点管理员!
//			logger.debug("商品已卖完或已下架，请联系站点管理员或从购物车中删除!");
////			cartProductInfo.code = "notThisProduct";
////			cartProductInfo.msg = "!";
//			printAppError("商品已卖完或已下架"); 
//			return null;
//		}
//
//		else if (ss < currentBuyNumber) {
//			// 购买的商品数超出库存数，则自动当最大库存数计算
//			currentBuyNumber = ss;
////			cartProductInfo.code = "buyMore";
////			cartProductInfo.msg = ;
////			cartProductInfo.stock = ss;
//			printAppError("库存不足，最多只能买" + ss + "件");
//			return null;
//		}
		// }

		/**
		 * 计算出点击+-的这一个商品的一些信息：小计、所需积分
		 */
		// if(msg==null){
		for(Product pro : cartInfo.getProductList()) {
			if (pro.getId().equals(productID) && pro.getBuySpecInfo().getId().equals(buySpecID)) {
				pro.setBuyCount(currentBuyNumber);// 设置指定商品购买的数量
//				if (isMiao(pro)) {
//					pro.setTotal0(df.format(pro.getBuyCount() * Double.valueOf(pro.getMiaoPrice())));
//				} else {
//					pro.setTotal0(df.format(pro.getBuyCount() * Double.valueOf(pro.getNowPrice())));
//				}
				break;
			}
		}
		cartInfo.totalCacl();// 计算购物车中商品总金额
		redisSevice.setCartInfo(getRequest(), cartInfo);
		// }
		printSuccess(cartInfo);
		return null;
	}

	/**
	 * 库存检查返回的错误对象
	 * 
	 *
	 */
	class StockErrorProductReturn {
		String code;
		String error;// 错误消息，显示到提交按钮边上
		List<StockErrorProduct> list;

		public String getCode() {
			return code;
		}

		public void setCode(String code) {
			this.code = code;
		}

		public List<StockErrorProduct> getList() {
			return list;
		}

		public void setList(List<StockErrorProduct> list) {
			this.list = list;
		}

		public String getError() {
			return error;
		}

		public void setError(String error) {
			this.error = error;
		}
	}

	/**
	 * 库存检查错误消息对象
	 */
	class StockErrorProduct {
		String id;// 商品ID
		String tips;// 错误消息

		public StockErrorProduct() {
		}

		public StockErrorProduct(String id, String tips) {
			this.id = id;
			this.tips = tips;
		}

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
		}

		public String getTips() {
			return tips;
		}

		public void setTips(String tips) {
			this.tips = tips;
		}
	}

	/**
	 * 购物车页面，单个商品返回的信息对象
	 */
	class CartProductInfo {
		String code;// 返回代码
		String msg;// 返回消息
		String total0;// 小计金额
		String amount;// 总计金额
		int stock;// 库存
		int totalExchangeScore;// 兑换此商品所需总积分
		int amountExchangeScore;// 积分汇总

		public String getCode() {
			return code;
		}

		public void setCode(String code) {
			this.code = code;
		}

		public String getMsg() {
			return msg;
		}

		public void setMsg(String msg) {
			this.msg = msg;
		}

		public String getTotal0() {
			return total0;
		}

		public void setTotal0(String total0) {
			this.total0 = total0;
		}

		public String getAmount() {
			return amount;
		}

		public void setAmount(String amount) {
			this.amount = amount;
		}

		public int getTotalExchangeScore() {
			return totalExchangeScore;
		}

		public void setTotalExchangeScore(int totalExchangeScore) {
			this.totalExchangeScore = totalExchangeScore;
		}

		public int getAmountExchangeScore() {
			return amountExchangeScore;
		}

		public void setAmountExchangeScore(int amountExchangeScore) {
			this.amountExchangeScore = amountExchangeScore;
		}

		public int getStock() {
			return stock;
		}

		public void setStock(int stock) {
			this.stock = stock;
		}

	}

	public void setFavoriteService(FavoriteService favoriteService) {
		this.favoriteService = favoriteService;
	}

	public void setTransportService(TransportService transportService) {
		this.transportService = transportService;
	}

	public AccountService getAccountService() {
		return accountService;
	}

	public void setAccountService(AccountService accountService) {
		this.accountService = accountService;
	}

	 

}
