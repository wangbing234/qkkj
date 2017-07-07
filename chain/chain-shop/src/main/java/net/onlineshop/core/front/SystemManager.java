package net.onlineshop.core.front;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.Random;
import java.util.Set;
import java.util.TreeMap;

import org.apache.commons.lang3.ObjectUtils;
import org.slf4j.LoggerFactory;
import net.onlineshop.core.emun.ProductType;
import net.onlineshop.core.listener.SystemListener;
import net.onlineshop.services.front.advert.bean.Advert;
import net.onlineshop.services.front.area.bean.Area;
import net.onlineshop.services.front.attribute.bean.Attribute;
import net.onlineshop.services.front.catalog.bean.Catalog;
import net.onlineshop.services.front.express.bean.Express;
import net.onlineshop.services.front.indexImg.bean.IndexImg;
import net.onlineshop.services.front.navigation.bean.Navigation;
import net.onlineshop.services.front.news.bean.News;
import net.onlineshop.services.front.notifyTemplate.bean.NotifyTemplate;
import net.onlineshop.services.front.product.bean.Product;
import net.onlineshop.services.front.systemSetting.bean.SystemSetting;
import net.onlineshop.services.manage.accountRank.bean.AccountRank;
import net.onlineshop.services.manage.activity.bean.Activity;
import net.onlineshop.services.manage.hotquery.bean.Hotquery;
import net.onlineshop.services.manage.order.bean.OrdersReport;
import net.onlineshop.services.manage.oss.bean.AliyunOSS;
import net.onlineshop.services.manage.supplier.bean.Supplier;

/**
 * 系统管理类. 1、负责管理system.properties的东东 2、负责缓存管理
 * 
 */
public class SystemManager {
	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(SystemManager.class);
	private static Properties p = new Properties();
	private static SystemManager instance = new SystemManager();
	public  static   List<Product> indexLeftProduct;// 加载首页左侧的商品列表，此位置的商品从全局加载
	/**
	 * 商品目录，树形结构
	 */
	public static List<Catalog> catalogs = new LinkedList<Catalog>();// 产品目录列表
	public static List<ProductType> productTypeList = ProductType.getProductList();// 产品目录列表
	public static Map<Catalog, List<Product>> catalogsIndex = new TreeMap<Catalog, List<Product>>();// 2级产品目录列表
	public static List<Product> catalogsItems = new LinkedList<Product>();// 消费商品推荐
	public static List<Catalog> catalogsArticle = new LinkedList<Catalog>();// 文章目录列表
	public static List<Attribute> attrs;// 属性集合
	public static Map<String, Attribute> attrsMap = new HashMap<String, Attribute>();// 属性集合map
	public static SystemSetting systemSetting;// 系统设置
	public static OrdersReport ordersReport = new OrdersReport();// 后台首页,统计数据
	public static Map<String, AccountRank> accountRankMap = new TreeMap<String, AccountRank>();// 会员等级表
	public static Map<String, NotifyTemplate> notifyTemplateMap;// 邮件模板
	public static List<Product> hotSearchProductList;// 热门搜索的商品列表
	public static String alipayConfig;// 支付宝卖家账号
	public static String yeepayConfig;// 易宝宝卖家账号
	public static String payCode;// 值为alipayescow表是支付宝，yeepay表示易宝，afterpay到付
	public static String commentTypeCode;// 启用的评论插件的代号
	public static List<Hotquery> hotqueryList;// 热门查询列表
//	public static List<String> bankCodes = new ArrayList<String>();// 易宝支付对应银行编码
	// public static Map<Integer, Integer> catalogMap = new HashMap<Integer, Integer>();//目录表，key:目录ID，value:目录顶级PID

	/**
	 * 目录的MAP形式，具有层级关系。key：主类别ID，value：主类别对象，可以通过该对象的getChildren()方法获取该主类别的所有的子类别集合
	 */
	public static Map<String, Catalog> catalogsMap = new HashMap<String, Catalog>();
	//产品分类根目录
	public static Catalog catalogsItem;
	/**
	 * 目录的MAP形式，具有层级关系。key：主类别code，value：主类别对象，可以通过该对象的getChildren()方法获取该主类别的所有的子类别集合
	 */
	public static Map<String, Catalog> catalogsCodeMap = new HashMap<String, Catalog>();

	// 商品库存应该使用JAVA类库中的读写锁，key:商品ID，value：商品对象
	// public static ConcurrentMap<String, ProductStockInfo> productStockMap;// = new ConcurrentHashMap<String, ProductStockInfo>();//商品库存表
	public static Object product_stock_lock = new Object();// 商品库存锁，操作商品库存的时候需要进行加锁
	/**
	 * 促销的商品 top=10
	 */
	public static List<List<Product>> goodsTopList;
	// public static List<IndexMenu> indexMenuList;
	public static List<Navigation> navigations;
	public static List<Product> hotProducts;// 热门商品
	public static List<Product> historyProducts;// 浏览过的商品历史列表，仅限于当前session中存储
	public static List<Product> newProducts;// 新品商品
	public static List<Product> saleProducts;// 特价商品
	@Deprecated
	public static List<Product> suijiProducts;// 随机推荐的商品
	public static List<IndexImg> indexImages;// 门户滚动图片
	public static List<IndexImg> indexImagesPc;// PC端门户滚动图片
	public static List<IndexImg> indexf1;// 楼层1
	public static List<IndexImg> indexf2;// 楼层2
	public static List<IndexImg> indexf3;// 楼层3
	public static List<IndexImg> indexNineImages;// 九宫格图片1

	@Deprecated
	public static List<News> news;// 文章列表
	@Deprecated
	public static Map<String, News> newsMap = new HashMap<String, News>();// 文章map；key:code

	public static List<Catalog> newCatalogs;// 文章目录。文章目前只有一级目录
	public static List<News> noticeList;// 系统通知
	public static Map<String, Area> areaMap;// 省市区集合
	private static Map<String, Area> provinceMap;// 省集合，加快访问速度
	public static Map<String, Express> expressMap;// 前台订单支付页面--物流列表
	public static Map<String, Advert> advertMap;// 广告列表
	public static Map<String, String> manageExpressMap = null;// 后台发货页面物流公司列表
	public static Map<String, String> companyConfigMap = null;// 鼎烨自提点列表
	public static Map<String, String> productSupplierList = null;// 产品类型列表
	public static List<Supplier> supplierList = null;// 供应商列表
	public static Map<String, String> mappingURLMap = new HashMap<String, String>();// 后台发货页面物流公司列表
	public static AliyunOSS aliyunOSS;// 阿里云存储的配置信息
	public static boolean isOSS;// 是否启动阿里云存储
	
	public static Map<String, Activity> activityMap = new HashMap<String, Activity>();// 所有活动列表

	/**
	 * 促销活动的商品列表activity_discountType_c=c key:【r:减免；d:折扣；s:双倍积分】 value:【商品列表ArrayList】
	 */
	public static Map<String, List<Product>> activityProductMap = new HashMap<String, List<Product>>();
	public static List<Product> activityScoreProductList;// 积分商城商品列表
	public static List<Product> activityTuanProductList;// 团购活动商品列表
	///////////////// 后台缓存///////////////////
	/**
	 * 后台类目查询的JSON字符串缓存
	 */
	public static String productCatalogJsonStr;// 商品类目JSON字符串缓存
	public static String articleCatalogJsonStr;// 缓存类目JSON字符串缓存
	static {
		init();
		initMapingURL();
		initExpress();
		initCompanyConfig();
//		bankCodes.add("ABC-NET");
//		bankCodes.add("BCCB-NET");
//		bankCodes.add("BOC-NET");
//		bankCodes.add("BOCO-NET");
//		bankCodes.add("CCB-NET");
//		bankCodes.add("CIB-NET");
//		bankCodes.add("CMBCHINA-NET");
//		bankCodes.add("CMBC-NET");
//		bankCodes.add("CZCB-NET");
//		bankCodes.add("ECITIC-NET");
//		bankCodes.add("GDB-NET");
//		bankCodes.add("GNXS-NET");
//		bankCodes.add("ICBC-NET");
//		bankCodes.add("POST-NET");
//		bankCodes.add("SDB-NET");
//		bankCodes.add("SDE-NET");
//		bankCodes.add("SHRCB-NET");
//		bankCodes.add("SPDB-NET");
		productSupplierList=new HashMap<String, String>();
		productSupplierList.put("0", "直发供应商");
		productSupplierList.put("1", "代发供应商");
	}

	public static SystemManager getInstance() {
		return instance;
	}

	private static void initCompanyConfig() {
		companyConfigMap = new HashMap<String, String>();
		try {
			Properties expressCfg = new Properties();
			expressCfg.load(new InputStreamReader(SystemListener.class.getResourceAsStream("/companyConfig.properties"), "UTF-8"));
			Set<Entry<Object, Object>> expressSet = expressCfg.entrySet();
			for (Entry<Object, Object> entry : expressSet) {
				companyConfigMap.put(entry.getKey().toString(), entry.getValue().toString());
			 }
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getProperty(String key) {
		return p.getProperty(key);
	}
	
	private static void initMapingURL()
	{
		mappingURLMap = new HashMap<String, String>();
		try {
			Properties expressCfg = new Properties();
			expressCfg.load(new InputStreamReader(SystemListener.class.getResourceAsStream("/mappingUrl.properties"), "UTF-8"));
			Set<Entry<Object, Object>> expressSet = expressCfg.entrySet();
			for (Entry<Object, Object> entry : expressSet) {
				mappingURLMap.put(entry.getKey().toString(), entry.getValue().toString());
			 }
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	public static Map<String, Area> getAreaMap() {
		return areaMap;
	}
	
	public static Map<String, Area> getProvinceMap() {
		if(null==provinceMap) {
			provinceMap=new HashMap<String, Area>();
			Map<String, Area> areaMapTemp = ObjectUtils.clone(areaMap);
			 for (Entry<String, Area> entry : areaMapTemp.entrySet()) {
				   System.out.println("key= " + entry.getKey() + " and value= " + entry.getValue());
				   Area value = entry.getValue();
				   Area tempValue = (Area) value.clone();
				   tempValue.setChildren(null);
				   provinceMap.put(entry.getKey(), tempValue);
			 }
		}
		return provinceMap;
	}
	
	
	private static void initExpress(){
			manageExpressMap = new HashMap<String, String>();
			try {
				Properties expressCfg = new Properties();
				expressCfg.load(new InputStreamReader(SystemListener.class.getResourceAsStream("/expressConfig.properties"), "UTF-8"));
				Set<Entry<Object, Object>> expressSet = expressCfg.entrySet();
				for (Entry<Object, Object> entry : expressSet) {
					manageExpressMap.put(entry.getKey().toString(), entry.getValue().toString());
				 }
			} catch (IOException e) {
				e.printStackTrace();
			}
	}

	private static void init() {
		try {
			p.load(SystemListener.class.getResourceAsStream("/system.properties"));
			logger.debug(p.toString());
			// log.info(code.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String get(String key) {
		return p.getProperty(key);
	}

	private Random random = new Random();

	/**
	 * 随机从图集里面选取一张图片
	 * 
	 * @return
	 */
	public String getImageRandom() {
		if (systemSetting == null || systemSetting.getImagesList() == null || systemSetting.getImagesList().size() == 0) {
			logger.debug("系统未设置图集，但广告位却设置了图集优先显示。请管理员立刻设置图集。");
			return null;
		}

		int n = random.nextInt(systemSetting.getImagesList().size());

		return systemSetting.getImageRootPath() + systemSetting.getImagesList().get(n);
	}

	/**
	 * 获取网站上下文路径/house 正式环境和测试环境获取上下文不一样
	 * 
	 * @param request
	 * @return
	 */
	// public static String getContextPath(HttpServletRequest request){
	// if(Boolean.valueOf(getInstance().get("is_www"))){
	// return SystemManager.getInstance().get("contextPath");
	// }
	// return request.getContextPath();
	// }

	/**
	 * 根据类别ID获取该类别下的所有ID集合
	 * 
	 * @param catalogID
	 * @return
	 */
	public List<String> getCatalogsById(String catalogID) {
		if (org.apache.commons.lang.StringUtils.isBlank(catalogID)) {
			return null;
		}

		if (this.catalogs == null || this.catalogs.size() == 0) {
			return null;
		}

		List<String> list = new LinkedList<String>();
		Catalog cataInfo = catalogsMap.get(catalogID);
		if (cataInfo.getPid().equals("0")) {
			if (cataInfo.getChildren() != null) {
				// 主类
				for (int i = 0; i < cataInfo.getChildren().size(); i++) {
					list.add(cataInfo.getChildren().get(i).getId());
				}
				list.add(cataInfo.getId());
			} else {

				list.add(cataInfo.getId());
			}
		} else {
			// 子类
			list.add(catalogID);
		}
		return list;
	}

//	/**
//	 * 根据商品类目code加载与类目有关联的热门商品列表
//	 * 
//	 * @param catalogCode
//	 */
//	public List<Product> getProductsByCatalogCode(String catalogCode) {
//		logger.debug("getProductsByCatalogCode.catalogCode = " + catalogCode);
//		if (StringUtils.isNotBlank(catalogCode)) {
//			Catalog catalog = SystemManager.catalogsCodeMap.get(catalogCode);
//			if (catalog != null) {
//				if (catalog.getHotProducts() == null || catalog.getHotProducts().size() == 0) {
//					logger.debug("catalog.getHotProducts()=0");
//				} else {
//					logger.debug("catalog.getHotProducts()=" + catalog.getHotProducts().size());
//				}
//				return catalog.getHotProducts();
//			}
//		}
//
//		return SystemManager.indexLeftProduct;
//	}
}
