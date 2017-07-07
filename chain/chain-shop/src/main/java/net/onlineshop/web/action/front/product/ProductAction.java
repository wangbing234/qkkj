package net.onlineshop.web.action.front.product;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.DateUtil;
import net.onlineshop.core.FrontContainer;
import net.onlineshop.core.KeyValueHelper;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.core.front.SystemManager;
import net.onlineshop.core.util.LRULinkedHashMap;
import net.onlineshop.core.util.RedisSevice;
import net.onlineshop.services.front.account.bean.Account;
import net.onlineshop.services.front.address.AddressService;
import net.onlineshop.services.front.attribute.AttributeService;
import net.onlineshop.services.front.attribute.bean.Attribute;
import net.onlineshop.services.front.attribute_link.Attribute_linkService;
import net.onlineshop.services.front.attribute_link.bean.Attribute_link;
import net.onlineshop.services.front.catalog.CatalogService;
import net.onlineshop.services.front.catalog.bean.Catalog;
import net.onlineshop.services.front.comment.CommentService;
import net.onlineshop.services.front.comment.bean.Comment;
import net.onlineshop.services.front.emailNotifyProduct.EmailNotifyProductService;
import net.onlineshop.services.front.emailNotifyProduct.bean.EmailNotifyProduct;
import net.onlineshop.services.front.express.ExpressService;
import net.onlineshop.services.front.express.bean.Express;
import net.onlineshop.services.front.favorite.FavoriteService;
import net.onlineshop.services.front.favorite.bean.Favorite;
import net.onlineshop.services.front.news.NewsService;
import net.onlineshop.services.front.news.bean.News;
import net.onlineshop.services.front.product.ProductService;
import net.onlineshop.services.front.product.bean.Product;
import net.onlineshop.services.front.product.bean.ProductImageInfo;
import net.onlineshop.services.front.systemSetting.bean.SystemSetting;
import net.onlineshop.services.manage.activity.bean.Activity;
import net.onlineshop.services.manage.gift.GiftService;
import net.onlineshop.services.manage.spec.SpecService;
import net.onlineshop.services.manage.spec.bean.Spec;
import net.onlineshop.web.action.front.orders.CartInfo;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 商品信息管理
 * 
 * @author
 * 
 */
public class ProductAction extends BaseAction<Product> {
	private static final long serialVersionUID = 1L;
	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(ProductAction.class);
	private ProductService productService;// 商品服务
	private AddressService addressService;// 收货人地址服务
	private Attribute_linkService attribute_linkService;// 商品属性链接表服务
	private NewsService newsService;// 文章服务
	private FavoriteService favoriteService;// 商品收藏夹服务
	private EmailNotifyProductService emailNotifyProductService;// 商品到货通知
	private SpecService specService;
	private GiftService giftService;
	private RedisSevice redisSevice;
	private ExpressService expressService;
	private CommentService commentService;
	// private int catalogID;//选择的产品目录ID
	private String catalogCode;// 选择的目录code
	private int productType;// 选择的分类
	private int attributeID;// 产品属性ID
	private String special;
	private Map<String, String> orderMap;// 排序map
	private List<Product> productList;// 商品列表
	private int orderBy;// 排序规则
	private String isnew;
	private AttributeService attributeService;
	private CatalogService catalogService;

	public void setCommentService(CommentService commentService) {
		this.commentService = commentService;
	}

	public ExpressService getExpressService() {
		return expressService;
	}

	public void setExpressService(ExpressService expressService) {
		this.expressService = expressService;
	}

	public GiftService getGiftService() {
		return giftService;
	}

	public void setGiftService(GiftService giftService) {
		this.giftService = giftService;
	}

	public SpecService getSpecService() {
		return specService;
	}

	public void setSpecService(SpecService specService) {
		this.specService = specService;
	}

	public void setEmailNotifyProductService(EmailNotifyProductService emailNotifyProductService) {
		this.emailNotifyProductService = emailNotifyProductService;
	}

	public void setFavoriteService(FavoriteService favoriteService) {
		this.favoriteService = favoriteService;
	}

	public String getCatalogCode() {
		return catalogCode;
	}

	public void setCatalogCode(String catalogCode) {
		this.catalogCode = catalogCode;
	}

	public void setNewsService(NewsService newsService) {
		this.newsService = newsService;
	}

	public String getSpecial() {
		return special;
	}

	public void setSpecial(String special) {
		this.special = special;
	}

	public AddressService getAddressService() {
		return addressService;
	}

	public void setAddressService(AddressService addressService) {
		this.addressService = addressService;
	}

	public void setAttribute_linkService(Attribute_linkService attribute_linkService) {
		this.attribute_linkService = attribute_linkService;
	}

	public int getOrderBy() {
		return orderBy;
	}

	public void setOrderBy(int orderBy) {
		this.orderBy = orderBy;
	}

	public int getAttributeID() {
		return attributeID;
	}

	public void setAttributeID(int attributeID) {
		this.attributeID = attributeID;
	}

	public Map<String, String> getOrderMap() {
		return orderMap;
	}

	public void setOrderMap(Map<String, String> orderMap) {
		this.orderMap = orderMap;
	}

	public ProductService getProductService() {
		return productService;
	}

	public void setProductService(ProductService productService) {
		this.productService = productService;
	}

	public AttributeService getAttributeService() {
		return attributeService;
	}

	public void setAttributeService(AttributeService attributeService) {
		this.attributeService = attributeService;
	}

	public CatalogService getCatalogService() {
		return catalogService;
	}

	public void setCatalogService(CatalogService catalogService) {
		this.catalogService = catalogService;
	}

	public List<Product> getProductList() {
		return productList;
	}

	public void setProductList(List<Product> productList) {
		this.productList = productList;
	}

	protected void selectListAfter() {
		pager.setPagerUrl(this.catalogCode + ".html");
	}

	public Product getE() {
		return this.e;
	}

	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new Product();
		}

		this.orderBy = 0;
		this.attributeID = 0;
		this.special = null;
		this.catalogCode = null;
		e.clear();

		if (productList != null && productList.size() > 0) {
			for (int i = 0; i < this.productList.size(); i++) {
				Product p = this.productList.get(i);
				p.clear();
				p = null;
			}
			this.productList.clear();
		}
		this.productList = null;

		super.setSelectMenu(FrontContainer.not_select_menu);// 设置主菜单为不选中
	}

	public void insertAfter(Product e) {
		e.clear();
	}

	/**
	 * 根据商品关键字搜索商品列表
	 * 
	 * @return
	 * @throws Exception
	 */
	public String search() throws Exception {
		String key = getRequest().getParameter("key");// 搜索关键字
		if (key == null || StringUtils.isBlank(key)) {
			this.getResponse().sendRedirect("/");
			return null;
		}

		// logger.debug("search?key="+key);
		getRequest().setAttribute("key", key);
		getE().clear();
		getE().setName(key);

		String fromModule = this.getFromModule();
		if (fromModule.equals("PC")) {
			return "pc_productList";
		}
		return "productList";
	}

	public String tui() throws Exception {

		getRequest().setAttribute("tui", "y");

		return "productList";
	}

	/**
	 * 根据商品属性加载商品列表
	 * 
	 * @return
	 * @throws Exception
	 */
	public String productListByAttrID() throws Exception {
		try {
			// logger.debug("attributeID="+attributeID);
			// getE().setAttrID(this.attributeID);
			// Attribute attr =
			// SystemManager.attrsMap.get(String.valueOf(this.attributeID));
			// this.catalogID = attr.getCatalogID();
			// logger.debug("productListByAttrID catalogID = "+catalogID);
			// productList = selectProductList0();
			productList();
		} catch (Exception e) {
			logger.debug("productListByAttrID()异常：" + e.getMessage());
			e.printStackTrace();
			throw e;
		}
		return "productList";
	}
	
	/**
	 * 根据商品目录、子目录、属性、排序等规则分页加载商品列表信息。此方法为商品加载的通用方法。
	 * 
	 * @return
	 * @throws Exception
	 */
	public void productListMore() throws Exception {
			Catalog moreProduct = SystemManager.catalogsCodeMap.get(catalogCode);
			printJson(moreProduct); 
	}
	
	
	/**
	 * 获取产品目录
	 * @throws Exception
	 */
	public void productCatalogs() throws Exception {
		printJson(SystemManager.catalogs);
	}

	/**
	 * 根据商品目录、子目录、属性、排序等规则分页加载商品列表信息。此方法为商品加载的通用方法。
	 * 
	 * @return
	 * @throws Exception
	 */
	public String productList() throws Exception {
		if (SystemManager.catalogsItem != null && SystemManager.catalogsItem.getChildren() != null) {
			this.getRequest().setAttribute("catalogst", SystemManager.catalogsItem.getChildren());
		}
		Attribute attr = new Attribute();
		if (StringUtils.isEmpty(catalogCode) || catalogCode.equals("productList")) {
			attr.setPid(0); 
		} else {
			Catalog itemInit = SystemManager.catalogsCodeMap.get(catalogCode);
			attr.setCatalogID(Integer.parseInt(itemInit.getId()));
			this.getRequest().setAttribute("catalog", itemInit);

		}
		List<Attribute> attrList = this.attributeService.selectList(attr);
		// 加载每个属性下的子属性列表
		if (attrList != null && attrList.size() > 0) {
			attr.setCatalogID(0);
			attr.setPid(0);// 属性的
			for (int i = 0; i < attrList.size(); i++) {
				Attribute items = attrList.get(i);
				attr.setPid(Integer.valueOf(items.getId()));
				// ###
				items.setAttrList(this.attributeService.selectList(attr));
			}
		}

		this.getRequest().setAttribute("attrLists", attrList);

		String fromModule = this.getFromModule();
		if (fromModule.equals("PC")) {
			return "pc_productList";
		}
		return "productList";
	}

	/**
	 * 加载热门、特价、最新的商品列表信息
	 * 
	 * @return
	 * @throws Exception
	 */
	public String specialProductList() throws Exception {
		logger.debug("special=" + special);
		// getSession().setAttribute("selectMenu", -1);//不选择任何的主菜单
		e.setSpecial(special);
		// 加载商品
		productList = selectProductList0();

		orderMap = KeyValueHelper.getMap("product_orderBy_");

		// 指定分页请求的地址
		pager.setPagerUrl(special + ".html");
		return "specialProductList";
	}

	/**
	 * 处理图片，后台上传的图片地址是这样的/onlineshop/attached/image/20130928/ 20130928233856_374.jpg 系统设置的图片服务器的地址是http://127.0.0.1:8080/onlineshop ，需要合并成正确的可以显示图片的地址
	 */
	@Deprecated
	private void doImage(List<Product> productList) {
		SystemSetting ssInfo = SystemManager.systemSetting;// (SystemSetting)
															// CacheSingle.getInstance().get(FrontContainer.SystemSetting);
		if (productList == null || productList.size() == 0) {
			return;
		}

		for (Product p : productList) {
			if (StringUtils.isNotEmpty(p.getPicture())) {
				String picture = p.getPicture();
				picture = picture.substring(1);
				int firstChar = picture.indexOf("/");
				picture = picture.substring(firstChar);
				p.setPicture(ssInfo.getImageRootPath() + picture);
			}
		}
	}

	/**
	 * 查询指定的产品明细
	 * 
	 * @return
	 * @throws Exception
	 */
	public String product() throws Exception {
		// Catalog item = checkProduct();//检查商品信息
		String type = getRequest().getParameter("type");
		if (StringUtils.isEmpty(type)) {
			type = "0";
		}
		getRequest().setAttribute("type", type);
		checkProduct();// 检查商品信息
		// saveHistoryProductToSession();

		// 推荐商品
		Product p = new Product();
		p.setTop(5);
		List<Product> list = productService.selectList(p);
		this.getRequest().setAttribute("list", list);

		String fromModule = this.getFromModule();
		if (fromModule.equals("PC")) {
			return pc_product();
		}

		// 加载商品规格，以JSON字符串的形式隐藏在页面上，然后页面将其转换成对象集合，通过脚本控制规格的颜色和尺寸的双向关系。
		Spec spec = new Spec();
		spec.setProductID(e.getId());
		List<Spec> specList = specService.selectList(spec);
		List<Spec> newspecList = new ArrayList<Spec>();

		if (specList != null && specList.size() > 0) {

			for (int i = 0; i < specList.size(); i++) {
				if (specList.get(i).getSpecStatus().equals("y")) {
					newspecList.add(specList.get(i));
				}
			}

			e.setSpecJsonString(JSON.toJSONString(newspecList));
			logger.debug("e.setSpecJsonString = " + e.getSpecJsonString());

			// Set<String> specColor = new HashSet<String>();
			// Set<String> specSize = new HashSet<String>();

			if (e.getSpecColor() == null) {
				e.setSpecColor(new ArrayList<Spec>());

			}
			if (e.getSpecSize() == null) {
				e.setSpecSize(new HashSet<String>());
			}
			List<String> specColor = new ArrayList<String>();

			// 分离商品的尺寸和颜色
			for (int i = 0; i < newspecList.size(); i++) {
				Spec specItem = newspecList.get(i);

				if (StringUtils.isNotBlank(specItem.getSpecColor())) {

					if (specColor.size() == 0) {
						e.getSpecColor().add(specItem);

						specColor.add(specItem.getSpecColor());
					}
					if (specColor.indexOf(specItem.getSpecColor()) == -1) {
						e.getSpecColor().add(specItem);

						specColor.add(specItem.getSpecColor());
					}

				}
				if (StringUtils.isNotBlank(specItem.getSpecSize())) {
					e.getSpecSize().add(specItem.getSpecSize());
				}
			}
			if (newspecList != null && newspecList.size() > 0) {
				Spec obj = newspecList.get(0);
				if (obj != null) {
					this.getRequest().setAttribute("fristSpec", obj);
				}
			}
		}

		// //取key-value
		// String unitValue = KeyValueHelper.get("product_unit_"+e.getUnit());
		// e.setUnit(unitValue);

		// if(item.getPid().equals("0")){//主类别
		// e.setMainCatalogName(item.getName());
		// }else{//子类别
		// e.setChildrenCatalogName(item.getName());
		// e.setChildrenCatalogCode(item.getCode());
		// item = SystemManager.catalogsMap.get(item.getPid());
		// getSession().setAttribute("selectMenu", item.getId());//商品属于的大类别就是菜单
		// e.setMainCatalogName(item.getName());
		//
		// getRequest().setAttribute("childrenCatalogCode", item.getCode());
		// }
		//
		// 如果商品已上架并且商品的库存数小于等于0，则更新商品为已下架
		if (e.getStatus() == Product.Product_status_y) {
			if (e.getStock() <= 0) {
				e.product_sorry_str = "抱歉，商品已售卖完了。";

				// 更新商品为已下架
				// Product p = new Product();
				// p.setId(e.getId());
				// p.setStatus(Product.Product_status_n);
				// productService.update(p);
			}
		}

		Favorite favorite = new Favorite();

		favorite.setProductID(e.getId());

		Account acc =redisSevice.getShopUser(getRequest());
		if (acc != null) {
			favorite.setAccount(acc.getAccount());
			int favoriteCount = favoriteService.selectCount(favorite);
			if (favoriteCount > 0) {
				getRequest().setAttribute("favoriteed", true);
			} else {
				getRequest().setAttribute("favoriteed", false);
			}
		} else {
			getRequest().setAttribute("favoriteed", false);
		}
		StringBuilder imagesBuff = new StringBuilder(e.getPicture() + FrontContainer.product_images_spider);
		// 组装商品详情页的图片地址
		if (StringUtils.isNotBlank(e.getImages())) {
			imagesBuff.append(e.getImages());
		}
		productImagesBiz(imagesBuff.toString());

		// 更新商品浏览次数
		p = new Product();
		p.setId(e.getId());
		// p.setHit(e.getHit()+1);//浏览次数++
		productService.updateHit(p);

		/*
		 * 加载和这个商品有关联的畅销商品和特价商品，显示到商品明细页面的左侧。 有关联的商品的选择方法是：加载该商品所在的子目录下的特定商品。考虑到性能问题， 这个必须借助缓存，事先我们将一些子目录下的畅销商品、特价商品 的前10来个加载到内存，然后用户访问这个页面的时候直接取内存即可。
		 */
		// e.setLeftProducts(loadProducts(1));
		// Product tui=new Product();
		// tui.setTop(6);
		// tui.setIstui(Product.Product_istui_y);
		// this.getRequest().setAttribute("tuiList",
		// productService.selectList(tui));

		String url = "/jsp/product/" + e.getId() + ".jsp";
		logger.debug("url = " + url);
		getRequest().setAttribute("productHTMLUrl", url);

		String urls = "/product/" + e.getId() + ".html";
		String directUrl = new String(Base64.encodeBase64(urls.getBytes()));
		this.getRequest().setAttribute("directUrl", directUrl);
		/**
		 * 是否需要显示到货通知的按钮
		 */
		// if(e.getStock()<=0){
		// Account acc = (Account)
		// getSession().getAttribute(FrontContainer.USER_INFO);
		// if(acc!=null){
		// //如果用户之前没有填写过到货通知的申请，则可以提示用户填写。
		// EmailNotifyProduct ep = new EmailNotifyProduct();
		// ep.setAccount(acc.getAccount());
		// ep.setProductID(e.getId());
		// if(emailNotifyProductService.selectCount(ep)<=0){
		// e.setShowEmailNotifyProductInput(true);
		// }
		// }
		// }

//		if (this.getSession().getAttribute(FrontContainer.DEF_ADDR) == null) {
//			getSession().setAttribute(FrontContainer.DEF_ADDR, SystemManager.getInstance().get("def_addr"));
//			getSession().setAttribute(FrontContainer.DEF_AREA, SystemManager.getInstance().get("def_area"));
//		}

		/*
		 * 检查，如果此商品是活动商品，则加载相应的活动信息。
		 */
		logger.debug("e.getActivityID() = " + e.getActivityID());
		if (StringUtils.isNotBlank(e.getActivityID())) {
			logger.debug(">>>计算或拷贝此商品关联的活动的信息到此商品对象上。展示页面用==");
			Activity activity = SystemManager.activityMap.get(e.getActivityID());

			/**
			 * 计算或拷贝此商品关联的活动的信息到此商品对象上。展示页面用
			 */
			e.setFinalPrice(String.valueOf(e.caclFinalPrice()));
			e.setExpire(activity.isExpire());
			e.setActivityEndDateTime(activity.getActivityEndDateTime());
			e.setActivityType(activity.getActivityType());
			e.setDiscountType(activity.getDiscountType());
			e.setDiscountFormat(activity.getDiscountFormat());
			e.setActivityEndDateTime(activity.getEndDate());
			e.setMaxSellCount(activity.getMaxSellCount());
			e.setAccountRange(activity.getAccountRange());
			e.setExchangeScore(activity.getExchangeScore());
			e.setTuanPrice(activity.getTuanPrice());

			logger.debug("finalPrice = " + e.getFinalPrice() + ",expire = " + e.isExpire() + ",activityEndDateTime=" + e.getActivityEndDateTime() + ",score=" + e.getScore());

			/*
			 * 如果商品是活动商品，则查看商品明细页的时候自动选择导航菜单li
			 */
			if (activity.getActivityType().equals(Activity.activity_activityType_c)) {
				getSession().setAttribute("selectMenu", "activity");
			} else if (activity.getActivityType().equals(Activity.activity_activityType_j)) {
				getSession().setAttribute("selectMenu", "score");
			} else if (activity.getActivityType().equals(Activity.activity_activityType_t)) {
				getSession().setAttribute("selectMenu", "tuan");
			}
		}

		return "product";
	}
	
	
	/**
	 * 查询指定的产品明细
	 * 
	 * @return
	 * @throws Exception
	 */
	public void productDetail() throws Exception {
		checkProduct();// 检查商品信息
		// 加载商品规格，以JSON字符串的形式隐藏在页面上，然后页面将其转换成对象集合，通过脚本控制规格的颜色和尺寸的双向关系。
		Spec spec = new Spec();
		spec.setProductID(e.getId());
		List<Spec> specList = specService.selectList(spec);
		List<Spec> newspecList = new ArrayList<Spec>();

		if (specList != null && specList.size() > 0) {
			for (int i = 0; i < specList.size(); i++) {
				if (specList.get(i).getSpecStatus().equals("y")) {
					newspecList.add(specList.get(i));
				}
			}
			e.setSpecJsonString(JSON.toJSONString(newspecList));
			logger.debug("e.setSpecJsonString = " + e.getSpecJsonString());
			if (e.getSpecColor() == null) {
				e.setSpecColor(new ArrayList<Spec>());
			}
			if (e.getSpecSize() == null) {
				e.setSpecSize(new HashSet<String>());
			}
			List<String> specColor = new ArrayList<String>();
			// 分离商品的尺寸和颜色
			for (int i = 0; i < newspecList.size(); i++) {
				Spec specItem = newspecList.get(i);
				if (StringUtils.isNotBlank(specItem.getSpecColor())) {
					if (specColor.size() == 0) {
						e.getSpecColor().add(specItem);
						specColor.add(specItem.getSpecColor());
					}
					if (specColor.indexOf(specItem.getSpecColor()) == -1) {
						e.getSpecColor().add(specItem);
						specColor.add(specItem.getSpecColor());
					}
				}
				if (StringUtils.isNotBlank(specItem.getSpecSize())) {
					e.getSpecSize().add(specItem.getSpecSize());
				}
			}
			if (newspecList != null && newspecList.size() > 0) {
				Spec obj = newspecList.get(0);
				if (obj != null) {
					this.getRequest().setAttribute("fristSpec", obj);
				}
			}
		}

		if (e.getStatus() == Product.Product_status_y) {
			if (e.getStock() <= 0) {
				e.product_sorry_str = "抱歉，商品已售卖完了。";
			}
		}

		Favorite favorite = new Favorite();

		favorite.setProductID(e.getId());

		Account acc = redisSevice.getShopUser(getRequest());
		if (acc != null) {
			favorite.setAccount(acc.getAccount());
			int favoriteCount = favoriteService.selectCount(favorite);
			if (favoriteCount > 0) {
				e.setFavoriteed(true);
			} else {
				e.setFavoriteed(false);
			}
		} else {
			e.setFavoriteed(false);
		}
		StringBuilder imagesBuff = new StringBuilder(e.getPicture() + FrontContainer.product_images_spider);
		// 组装商品详情页的图片地址
		if (StringUtils.isNotBlank(e.getImages())) {
			imagesBuff.append(e.getImages());
		}
		productImagesBiz(imagesBuff.toString());

		// 更新商品浏览次数
		Product p = new Product();
		p.setId(e.getId());
		productService.updateHit(p);

		String url = "/jsp/product/" + e.getId() + ".jsp";
		logger.debug("url = " + url);
		getRequest().setAttribute("productHTMLUrl", url);

		String urls = "/product/" + e.getId() + ".html";
		String directUrl = new String(Base64.encodeBase64(urls.getBytes()));
		this.getRequest().setAttribute("directUrl", directUrl);

//		if (this.getSession().getAttribute(FrontContainer.DEF_ADDR) == null) {
//			getSession().setAttribute(FrontContainer.DEF_ADDR, SystemManager.getInstance().get("def_addr"));
//			getSession().setAttribute(FrontContainer.DEF_AREA, SystemManager.getInstance().get("def_area"));
//		}

		/*
		 * 检查，如果此商品是活动商品，则加载相应的活动信息。
		 */
		logger.debug("e.getActivityID() = " + e.getActivityID());
		if (StringUtils.isNotBlank(e.getActivityID())) {
			logger.debug(">>>计算或拷贝此商品关联的活动的信息到此商品对象上。展示页面用==");
			Activity activity = SystemManager.activityMap.get(e.getActivityID());

			/**
			 * 计算或拷贝此商品关联的活动的信息到此商品对象上。展示页面用
			 */
			e.setFinalPrice(String.valueOf(e.caclFinalPrice()));
			e.setExpire(activity.isExpire());
			e.setActivityEndDateTime(activity.getActivityEndDateTime());
			e.setActivityType(activity.getActivityType());
			e.setDiscountType(activity.getDiscountType());
			e.setDiscountFormat(activity.getDiscountFormat());
			e.setActivityEndDateTime(activity.getEndDate());
			e.setMaxSellCount(activity.getMaxSellCount());
			e.setAccountRange(activity.getAccountRange());
			e.setExchangeScore(activity.getExchangeScore());
			e.setTuanPrice(activity.getTuanPrice());

			logger.debug("finalPrice = " + e.getFinalPrice() + ",expire = " + e.isExpire() + ",activityEndDateTime=" + e.getActivityEndDateTime() + ",score=" + e.getScore());

			/*
			 * 如果商品是活动商品，则查看商品明细页的时候自动选择导航菜单li
			 */
			if (activity.getActivityType().equals(Activity.activity_activityType_c)) {
				getSession().setAttribute("selectMenu", "activity");
			} else if (activity.getActivityType().equals(Activity.activity_activityType_j)) {
				getSession().setAttribute("selectMenu", "score");
			} else if (activity.getActivityType().equals(Activity.activity_activityType_t)) {
				getSession().setAttribute("selectMenu", "tuan");
			}
		}
		printSuccess(e);
	}

	private String pc_product() throws Exception {
		// 加载商品规格，以JSON字符串的形式隐藏在页面上，然后页面将其转换成对象集合，通过脚本控制规格的颜色和尺寸的双向关系。
		Spec spec = new Spec();
		spec.setProductID(e.getId());
		List<Spec> specList = specService.selectList(spec);
		List<Spec> newspecList = new ArrayList<Spec>();
		saveHistoryProductToSession();

		if (specList != null && specList.size() > 0) {

			for (int i = 0; i < specList.size(); i++) {
				if (specList.get(i).getSpecStatus().equals("y")) {
					newspecList.add(specList.get(i));
				}
			}

			e.setSpecJsonString(JSON.toJSONString(newspecList));
			logger.debug("e.setSpecJsonString = " + e.getSpecJsonString());

			// Set<String> specColor = new HashSet<String>();
			// Set<String> specSize = new HashSet<String>();

			if (e.getSpecColor() == null) {
				e.setSpecColor(new ArrayList<Spec>());

			}
			if (e.getSpecSize() == null) {
				e.setSpecSize(new HashSet<String>());
			}
			List<String> specColor = new ArrayList<String>();

			// 分离商品的尺寸和颜色
			for (int i = 0; i < newspecList.size(); i++) {
				Spec specItem = newspecList.get(i);

				if (StringUtils.isNotBlank(specItem.getSpecColor())) {

					if (specColor.size() == 0) {
						e.getSpecColor().add(specItem);
						System.out.println(specItem.getSpecColor() + "-------------------------------------");
						specColor.add(specItem.getSpecColor());
					}
					if (specColor.indexOf(specItem.getSpecColor()) == -1) {
						e.getSpecColor().add(specItem);
						System.out.println(specItem.getSpecColor() + "-------------------------------------");
						specColor.add(specItem.getSpecColor());
					}

				}
				if (StringUtils.isNotBlank(specItem.getSpecSize())) {
					e.getSpecSize().add(specItem.getSpecSize());
				}
			}

			if (newspecList != null && newspecList.size() > 0) {
				Spec obj = newspecList.get(0);
				if (obj != null) {
					this.getRequest().setAttribute("fristSpec", obj);
				}
			}

		}

		// //取key-value
		// String unitValue = KeyValueHelper.get("product_unit_"+e.getUnit());
		// e.setUnit(unitValue);

		// if(item.getPid().equals("0")){//主类别
		// e.setMainCatalogName(item.getName());
		// }else{//子类别
		// e.setChildrenCatalogName(item.getName());
		// e.setChildrenCatalogCode(item.getCode());
		// item = SystemManager.catalogsMap.get(item.getPid());
		// getSession().setAttribute("selectMenu", item.getId());//商品属于的大类别就是菜单
		// e.setMainCatalogName(item.getName());
		//
		// getRequest().setAttribute("childrenCatalogCode", item.getCode());
		// }
		//
		// 如果商品已上架并且商品的库存数小于等于0，则更新商品为已下架
		if (e.getStatus() == Product.Product_status_y) {
			if (e.getStock() <= 0) {
				e.product_sorry_str = "抱歉，商品已售卖完了。";

				// 更新商品为已下架
				// Product p = new Product();
				// p.setId(e.getId());
				// p.setStatus(Product.Product_status_n);
				// productService.update(p);
			}
		}
		// 收藏数量
		// Favorite favorite = new Favorite();
		//
		// favorite.setProductID(e.getId());
		// int favoriteCount=favoriteService.selectCount(favorite);
		// getRequest().setAttribute("favoriteCount", favoriteCount);

		StringBuilder imagesBuff = new StringBuilder(e.getPicture() + FrontContainer.product_images_spider);
		// 组装商品详情页的图片地址
		if (StringUtils.isNotBlank(e.getImages())) {
			imagesBuff.append(e.getImages());
		}
		productImagesBiz(imagesBuff.toString());

		// 更新商品浏览次数
		Product p = new Product();
		p.setId(e.getId());
		p.setHit(e.getHit() + 1);// 浏览次数++
		productService.updateHit(p);

		// 加载指定商品的评论
		Comment comment = new Comment();
		comment.setProductID(e.getId());
		PagerModel commentPager = super.selectPagerModelByServices(commentService, comment);
		getRequest().setAttribute("commentPager", commentPager);
		super.pager = commentPager;// 公用分页控件需要这么写。

		/*
		 * 加载和这个商品有关联的畅销商品和特价商品，显示到商品明细页面的左侧。 有关联的商品的选择方法是：加载该商品所在的子目录下的特定商品。考虑到性能问题， 这个必须借助缓存，事先我们将一些子目录下的畅销商品、特价商品 的前10来个加载到内存，然后用户访问这个页面的时候直接取内存即可。
		 */
		// e.setLeftProducts(loadProducts(1));
		// Product tui=new Product();
		// tui.setTop(6);
		// tui.setIstui(Product.Product_istui_y);
		// this.getRequest().setAttribute("tuiList",
		// productService.selectList(tui));

		String url = "/jsp/product/" + e.getId() + ".jsp";
		logger.debug("url = " + url);
		getRequest().setAttribute("productHTMLUrl", url);

		String urls = this.getRequest().getRequestURI() + (this.getRequest().getQueryString() == null ? "" : "?" + this.getRequest().getQueryString());
		String directUrl = new String(Base64.encodeBase64(urls.getBytes()));
		this.getRequest().setAttribute("directUrl", directUrl);
		Favorite favorite = new Favorite();

		favorite.setProductID(e.getId());

		Account acc = redisSevice.getShopUser(getRequest());
		if (acc != null) {
			favorite.setAccount(acc.getAccount());
			int favoriteCount = favoriteService.selectCount(favorite);
			if (favoriteCount > 0) {
				getRequest().setAttribute("favoriteed", true);
			} else {
				getRequest().setAttribute("favoriteed", false);
			}
		} else {
			getRequest().setAttribute("favoriteed", false);
		}
		/*
		 * 检查，如果此商品是活动商品，则加载相应的活动信息。
		 */
		logger.debug("e.getActivityID() = " + e.getActivityID());
		if (StringUtils.isNotBlank(e.getActivityID())) {
			logger.debug(">>>计算或拷贝此商品关联的活动的信息到此商品对象上。展示页面用==");
			Activity activity = SystemManager.activityMap.get(e.getActivityID());

			/**
			 * 计算或拷贝此商品关联的活动的信息到此商品对象上。展示页面用
			 */
			e.setFinalPrice(String.valueOf(e.caclFinalPrice()));
			e.setExpire(activity.isExpire());
			e.setActivityEndDateTime(activity.getActivityEndDateTime());
			e.setActivityType(activity.getActivityType());
			e.setDiscountType(activity.getDiscountType());
			e.setDiscountFormat(activity.getDiscountFormat());
			e.setActivityEndDateTime(activity.getEndDate());
			e.setMaxSellCount(activity.getMaxSellCount());
			e.setAccountRange(activity.getAccountRange());
			e.setExchangeScore(activity.getExchangeScore());
			e.setTuanPrice(activity.getTuanPrice());

			logger.debug("finalPrice = " + e.getFinalPrice() + ",expire = " + e.isExpire() + ",activityEndDateTime=" + e.getActivityEndDateTime() + ",score=" + e.getScore());

			/*
			 * 如果商品是活动商品，则查看商品明细页的时候自动选择导航菜单li
			 */
			if (activity.getActivityType().equals(Activity.activity_activityType_c)) {
				getSession().setAttribute("selectMenu", "activity");
			} else if (activity.getActivityType().equals(Activity.activity_activityType_j)) {
				getSession().setAttribute("selectMenu", "score");
			} else if (activity.getActivityType().equals(Activity.activity_activityType_t)) {
				getSession().setAttribute("selectMenu", "tuan");
			}
		}

		return "pc_product";
	}

	/**
	 * 用户浏览的商品信息存储在session中 由于存储的数量有限，每一个session中只存储最近的10个商品，并且只存储一些基本的信息,如：商品ID、商品名称、现价、原价。 这里需要用到数量固定的缓存策略，最后浏览的商品在第一个位置
	 */
	private void saveHistoryProductToSession() {
		// List<Product> history_product_list = (List<Product>)
		// getSession().getAttribute(FrontContainer.history_product_list);
		LinkedHashMap<String, Product> history_product_map = (LinkedHashMap<String, Product>) getSession().getAttribute(FrontContainer.history_product_map);
		// LinkedHashMap<String, String> map = new LRULinkedHashMap<String,
		// String>(16, 0.75f, true);
		if (history_product_map == null) {
			history_product_map = new LRULinkedHashMap<String, Product>(16, 0.75f, true);
			getSession().setAttribute(FrontContainer.history_product_map, history_product_map);
		}

		// 添加浏览过的商品信息到集合
		Product pro = new Product();
		pro.setId(e.getId());
		pro.setName(e.getName());
		pro.setPrice(e.getPrice());
		pro.setNowPrice(e.getNowPrice());
		pro.setPicture(e.getPicture());
		history_product_map.put(e.getId(), pro);

		// 分离数据，方便页面显示
		// Collection<Product> historyList = history_product_map.values();
		// for(int i=historyList.size()-1;i>=0;i--){
		// historyList.
		// }
	}
	
	

	/**
	 * 根据商品ID检查商品信息
	 * 
	 * @return
	 */
	private Catalog checkProduct() {
		if (StringUtils.isBlank(e.getId())) {
			throw new NullPointerException("商品ID不能为空！");
		}

		e = productService.selectById(getE().getId());

		if (e == null) {
			throw new NullPointerException("根据商品ID查询不到指定的商品信息！");
		}
		if (StringUtils.isBlank(e.getCatalogID())) {
			throw new NullPointerException("商品无类别！");
		}
		if (e.getDraft() != null && e.getDraft() == true) {
			throw new NullPointerException("商品为草稿，不能查看！");
		}

		/**
		 * 根据商品信息去查询它的分类
		 */
		Catalog item = SystemManager.catalogsMap.get(e.getCatalogID());
		if (item == null) {
			throw new NullPointerException("商品数据异常！");
		}
		// 加载商品参数
//		loadParameter(Integer.parseInt(e.getCatalogID()));

		try {
			// 秒杀产品
			String isMaio=e.getIsmiao();
			if ("y".equals(isMaio) && e.getMiaoEnd() != null && !"".equals(e.getMiaoEnd()) && e.getMiaoSta() != null && !"".equals(e.getMiaoSta())) {
				if (e.getMiaoEnd().compareTo(DateUtil.dateFormat(new Date(), DateUtil.SHORT_MODEL)) >= 0 && e.getMiaoSta().compareTo(DateUtil.dateFormat(new Date(), DateUtil.SHORT_MODEL)) <= 0) {
					Date time = DateUtil.getDateAfter(DateUtil.StringToDate(e.getMiaoEnd()), 1);
					e.setMiaoEnd(DateUtil.dateFormat(time));
				}

			}
		} catch (ParseException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

		return item;
	}

	/**
	 * 根据商品分类加载商品参数列表
	 * 
	 * @catalogID 商品类别ID
	 */
	private void loadParameter(int catalogID) {
		Attribute attr = new Attribute();
		attr.setCatalogID(catalogID);
		attr.setPid(-1);
		attr = this.attributeService.selectOne(attr);// 加载参数主属性，一个参数下包含多个子参数
		if (attr != null) {
			// 加载每个属性下的子属性列表
			int id = Integer.valueOf(attr.getId());
			attr.clear();
			attr.setPid(id);
			// attr.setPid(0);
			attr.setCatalogID(0);

			e.setParaList(this.attributeService.selectList(attr));
		} else {
			Catalog catalog = new Catalog();
			catalog.setId(String.valueOf(catalogID));
			Catalog catalogs = catalogService.selectOne(catalog);
			Attribute attr1 = new Attribute();
			attr1.setPid(-1);
			attr1.setCatalogID(Integer.valueOf(catalogs.getPid()));
			attr = this.attributeService.selectOne(attr1);
			if (attr != null) {
				// 加载每个属性下的子属性列表
				int id = Integer.valueOf(attr.getId());
				attr.clear();
				attr.setPid(id);
				// attr.setPid(0);
				attr.setCatalogID(0);

				e.setParaList(this.attributeService.selectList(attr));
			}

		}
		// 如果商品ID不存在，则不加载商品选中的参数列表
		if (StringUtils.isBlank(e.getId())) {
			return;
		}

		// 加载商品参数
		if (e.getParaList() != null && e.getParaList().size() > 0) {
			Attribute_link attrLink = new Attribute_link();
			attrLink.setProductID(Integer.valueOf(e.getId()));
			// 查询参数列表
			List<Attribute_link> attrLinkList = attribute_linkService.selectList(attrLink);
			if (attrLinkList != null && attrLinkList.size() > 0) {

				for (int i = 0; i < e.getParaList().size(); i++) {// 循环主属性
					Attribute itemInfo = e.getParaList().get(i);
					int _attrID = Integer.valueOf(itemInfo.getId());
					for (int k = 0; k < attrLinkList.size(); k++) {// 循环用户选择的属性
						Attribute_link al = attrLinkList.get(k);
						if (al.getAttrID() == _attrID) {
							itemInfo.setParameterValue(al.getValue());
							break;
						}
					}
				}

			}
		}
	}

	/**
	 * 商品详情页面，图片列表的处理
	 */
	private void productImagesBiz(String imagesStr) {
		if (StringUtils.isBlank(imagesStr)) {
			return;
		}

		String[] images = imagesStr.split(FrontContainer.product_images_spider);
		logger.debug("e.getImages()=" + e.getImages());
		if (e.getProductImageList() == null) {
			e.setProductImageList(new LinkedList<ProductImageInfo>());
		} else {
			e.getProductImageList().clear();
		}
		for (int i = 0; i < images.length; i++) {
			String img = images[i].trim();
			int lastIndex = img.lastIndexOf("_");
			String left = img.substring(0, lastIndex + 1);
			String right = img.substring(lastIndex + 2);
			logger.debug("left = " + left + ",right=" + right);

			e.getProductImageList().add(new ProductImageInfo(left + "1" + right, left + "2" + right, left + "3" + right));
		}
	}

	/**
	 * 分页加载产品列表，每4个一行的显示
	 * 
	 * @param p
	 * @return
	 * @throws Exception
	 */
	private List<Product> selectProductList0() throws Exception {
		// getE().setStatus(2);//加载已经上架的商品
		getE().setOrderBy(orderBy);// 设置排序规则

		super.selectList();// 分页搜索数据库中的商品
		List<Product> result = pager.getList();

		// doImage(result);
		return result;
		// return convert4(result);
	}

	public boolean isEmpty(String value) {
		if (value == null || value.trim().length() == 0) {
			return true;
		}
		return false;
	}

	/**
	 * 获取新闻列表
	 * 
	 * @return
	 * @throws Exception
	 */
	public String newsList() throws Exception {
		News newsInfo = new News();
		newsInfo.setType(News.news_type_notice);

		setPager(super.selectPagerModelByServices(newsService, newsInfo));
		return "newsList";
	}

	/**
	 * 添加商品到收藏夹
	 * 
	 * @return
	 * @throws IOException
	 */
	public String addToFavorite() throws IOException {
		String productID = getRequest().getParameter("productID");
		if (StringUtils.isBlank(productID)) {
			printAppError(FrontContainer.request_illegal_error);
			return null;
		}
		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null || StringUtils.isBlank(acc.getAccount())) {
			printSuccessString("-1");
			return null;
		}
		Favorite favorite = new Favorite();
		favorite.setAccount(acc.getAccount());
		favorite.setProductID(productID);

		String result = null;
		synchronized (FrontContainer.insert_favorite_lock) {
			if (favoriteService.selectCount(favorite) == 0) {
				favoriteService.insert(favorite);
				result = "0";// 添加成功
			} else {
				result = "1";// 已经添加过了
			}
		}
		printSuccessString(result);
		return null;
	}

	/**
	 * 商品到货通知-ajax
	 * 
	 * @return
	 * @throws IOException
	 */
	public String insertEmailNotifyProductService() throws IOException {
		String productID = getRequest().getParameter("productID");
		String receiveEmail = getRequest().getParameter("receiveEmail");
		String productName = getRequest().getParameter("productName");
		if (StringUtils.isBlank(productID) || StringUtils.isBlank(receiveEmail)) {
			throw new NullPointerException(FrontContainer.request_illegal_error);
		}

		Account acc = redisSevice.getShopUser(getRequest());
		if (acc == null) {
			getResponse().getWriter().write("-1");// 用户需要登录
			return null;
		}

		EmailNotifyProduct info = new EmailNotifyProduct();
		info.setAccount(acc.getAccount());
		info.setReceiveEmail(receiveEmail);
		info.setProductID(productID);
		info.setProductName(productName);
		info.setStatus(EmailNotifyProduct.emailNotifyProduct_status_n);
		emailNotifyProductService.insert(info);

		getResponse().getWriter().write("0");// 成功
		return null;
	}

	/**
	 * test 内存库存查询
	 * 
	 * @return
	 */
	public String selectMemoryStock() {

		return "selectMemoryStock";
	}

	/**
	 * 根据区域查询邮费
	 * 
	 * @return
	 * @throws IOException
	 */
	public String gerExpressByAreaCode() throws IOException {

		double _amount = 0;
		String areaCode = this.getRequest().getParameter("areaCode");
		Express express = new Express();
		express.setAreaCode(areaCode);
		List<Express> expresslist = expressService.selectList(express);
		CartInfo cartInfo =redisSevice.getCartInfo(getRequest());
		java.text.DecimalFormat df = new java.text.DecimalFormat("#.00");
		if (expresslist != null && expresslist.size() > 0) {
			if (cartInfo == null) {
				super.write("{\"result\":0}");
				return null;
			}
			for (Express ex : expresslist) {
				if ("EXPRESS".equals(ex.getCode())) {
					cartInfo.totalCacl();
					_amount = Double.valueOf(cartInfo.getAmount()) + ex.getFee();

					super.write("{\"result\":1,\"fee\":" + ex.getFee() + ",\"amount\":\"" + df.format(_amount) + "\",\"id\":" + ex.getId() + "}");
					return null;
				}
			}

		} else {

		}
		cartInfo.totalCacl();
		_amount = cartInfo.getAmount();
		super.write("{\"result\":1,\"fee\":\"0.00\",\"amount\":\"" + df.format(_amount) + "\"}");
		return null;

	}

	public String loadProducts() throws Exception {
		try {
			// 搜索条件
			String ids = this.getRequest().getParameter("ids");
			if (StringUtils.isNotEmpty(ids)) {
				List<Integer> attrList = new ArrayList<Integer>();
				String[] arr = ids.split(",");
				if (arr != null && arr.length > 0) {
					String id = "";
					Integer attrId = null;
					for (int i = 0; i < arr.length; i++) {
						id = arr[i];
						if (id != null && !"".equals(id)) {
							attrId = Integer.parseInt(id);
							attrList.add(attrId);
						}
					}
					getE().setQueryAttrIDs(attrList);
				}
			}
			getE().setProductType(productType);
			if (this.attributeID > 0) {
				getE().setAttrID(this.attributeID);
				Attribute attr = SystemManager.attrsMap.get(String.valueOf(this.attributeID));
				this.catalogCode = SystemManager.catalogsMap.get(String.valueOf(attr.getCatalogID())).getCode();
			} else {
				if (catalogCode != null) {
					Catalog item = SystemManager.catalogsCodeMap.get(catalogCode);
					if (item != null) {
						getE().getQueryCatalogIDs().add(Integer.valueOf(item.getId()));
					}
				}
			}
			String key  ="";
			String keyString=this.getRequest().getParameter("key");
			if(StringUtils.isNotEmpty(keyString)) {
				key  = new String(keyString.getBytes("8859_1"), "utf8");
				getE().setName(key);
			}
			getE().setPageSize(12);
			getE().setOrderBy(orderBy);// 设置排序规则
			super.selectList();// 分页搜索数据库中的商品
			productList = pager.getList();
			JSONObject json = new JSONObject();
			JSONArray ja = new JSONArray();
			for (Product p : productList) {
				JSONObject jsonProduct = new JSONObject();
				jsonProduct.put("id", p.getId());
				jsonProduct.put("name", p.getName());
				jsonProduct.put("shortname", p.getShortname());
				jsonProduct.put("sellcount", p.getSellcount());
				jsonProduct.put("price", p.getPrice());
				jsonProduct.put("nowPrice", p.getNowPrice());
				jsonProduct.put("introduce", p.getIntroduce());
				jsonProduct.put("taourl", p.getTaourl() == null ? "" : p.getTaourl());
				jsonProduct.put("pic", p.getPicurl400());
				ja.add(jsonProduct);
			}
			json.put("count", pager.getTotal());
			json.put("pageNo", pager.getOffset());
			json.put("pagerSize", pager.getPagerSize());
			json.put("pagerTotal", pager.getTotal());
			json.put("pageSize", pager.getPageSize());
			json.put("data", ja);
			printJson(json);
		} catch (Exception e) {
			logger.debug("productList()异常：" + e.getMessage());
			e.printStackTrace();
			throw e;
		}
		return null;
	}

	/**
	 * 查询秒杀商品
	 * @throws IOException
	 */
	public void index() throws IOException {
		e.setIsmiao("y");
		List<Product> miaoList = productService.selectList(e);
		if (miaoList != null && miaoList.size() > 0) {
			Product obj = null;
			String time = "";
			for (int i = 0; i < miaoList.size(); i++) {
				obj = miaoList.get(i);
				if (obj != null && obj.getMiaoTime() != null) {
					time = obj.getMiaoTime();
					time = time.replaceAll("day", "天");
					time = time.replaceAll("hour", "小时");
					time = time.replaceAll("minute", "分");
					time = time.replaceAll("second", "秒");
					miaoList.get(i).setMiaoTime(time);
				}
			}
		}
		printJson(miaoList);
	}
	

	public int getProductType() {
		return productType;
	}

	public void setProductType(int productType) {
		this.productType = productType;
	}

	public String getIsnew() {
		return isnew;
	}

	public void setIsnew(String isnew) {
		this.isnew = isnew;
	}

	public void setRedisSevice(RedisSevice redisSevice) {
		this.redisSevice = redisSevice;
	}
	
}
