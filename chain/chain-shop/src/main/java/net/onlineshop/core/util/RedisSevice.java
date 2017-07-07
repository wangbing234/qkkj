package net.onlineshop.core.util;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;

import com.alibaba.fastjson.JSONObject;

import net.onlineshop.services.front.account.bean.Account;
import net.onlineshop.services.front.account.bean.CqsUser;
import net.onlineshop.web.action.front.orders.CartInfo;

/**
 * redis服务
 * @author bing.wang
 *
 */
public class RedisSevice {
	//日志对象
	private static final Logger logger = LoggerFactory.getLogger(RedisSevice.class);
	//日志模板
	private RedisTemplate<String, Object> redisTemplate;
	//互捐系统用户的标识字段
	public static final String CQS_USER="CQS_USER";
    //商城系统用户的标识字段
    public final String SHOP_USER="SHOP_USER";
    //商城系统用户的标识字段
    public final String USER_TOKEN_MAPPING="USER_TOKEN_MAPPING";
    // 用户购物车key
	public static final String MY_CART = "myCart";
    //session 超时时间
    private final Integer SESSION_TIMEOUT=7;
    
	public RedisTemplate<String, Object> getRedisTemplate() {
		return redisTemplate;
	}

	public void setRedisTemplate(RedisTemplate<String, Object> redisTemplate) {
		this.redisTemplate = redisTemplate;
	}
	
	/**
	 * 创建token
	 * @param token
	 * @param mebId
	 */
	public void createToken(String token,String mebId){
		// 添加 一个 hash集合
		HashOperations<String, Object, Object> hash = redisTemplate.opsForHash();
		//用户信息
		Map<String, Object> map = new HashMap<String, Object>();
		map.put(CQS_USER, mebId);
		//用户信息以token为键存储
		hash.putAll(token, map);
	}
	
	/**
	 * 创建token
	 * @param token
	 * @param mebId
	 */
	public Boolean checkToken(HttpServletRequest request){
		 String token=request.getHeader("token");
		 if (StringUtils.isBlank(token)) {
	            return false;
	      }
		 HashOperations<String, Object, Object> hash = redisTemplate.opsForHash();
		 Object tokenObject = hash.get(token, CQS_USER);
		 if (null==tokenObject) {
	            return false;
	      }
		 redisTemplate.boundHashOps(token).expire(SESSION_TIMEOUT, TimeUnit.DAYS);
	     return true;
	}
	
	/**
	 * 登录退出
	 * @param token
	 * @param mebId
	 */
	 public void deleteToken(HttpServletRequest request) {
		 String token=request.getHeader("token");
		 redisTemplate.delete(token);
	 }
	 
//	 /**
//	  * 获取积分兑换价格
//	  * @return
//	  */
//	 public  float getPointCurPrice() {
//		Object pointRatio = redisTemplate.opsForValue().get("POINT_CUR_PRICE");
//		float point2money=0f;
//		String pointRatioString="";
//		if(pointRatio!=null && StringUtils.isNotEmpty(pointRatioString=pointRatio.toString())) {
//			point2money=Float.parseFloat(pointRatioString);
//			if(point2money<=0) {
//				logger.debug("无法获取积分系统价格");
//				throw new RuntimeException("无法获取积分系统价格！");
//			}
//		}
//		else {
//			logger.debug("无法获取积分系统价格");
//			throw new RuntimeException("无法获取积分系统价格！");
//		}
//		return point2money;
//	 }
	 
	 /**
	  * 获取购物车信息
	  * @param token
	  * @return
	  */
	 public CartInfo getCartInfo(HttpServletRequest request){
		 String token=request.getHeader("token");
		 CartInfo _cartInfo=getRedisObject(token, MY_CART, CartInfo.class);
		 return _cartInfo;
	 }
	 
	 
	 /**
	  * 获取商城用户信息
	  * @param token
	  * @return
	  */
	 public Account getShopUser(HttpServletRequest request) {
		 	String token=request.getHeader("token");
		 	Account account=null;
		 	if(StringUtils.isNotBlank(token))
				account =getRedisObject(token, SHOP_USER, Account.class);
//			if(account==null) {
//				CqsUser cqsUser = getCqsUser(request);
//				account=new Account();
//				account.setId(cqsUser.getMebId());
//				account.setAccount(cqsUser.getMebId());
//				account.setTel(cqsUser.getPhone());
//				account.setNickname(cqsUser.getName());
//			}
			return account;
	 }
	 
	 /**
	  * 序列化购物车信息
	  * @param token
	  * @return
	  */
	 public void setCartInfo(HttpServletRequest request,CartInfo _cartInfo){
		 setRedisUserObject(request, MY_CART, _cartInfo,SESSION_TIMEOUT);
	 }
	 
	 /**
	 * 绑定商城用户信息
	 * @param token
	 * @param account
	 */
	 public void setShopUser(HttpServletRequest request,Account account) {
		setRedisUserObject(request, SHOP_USER, account,SESSION_TIMEOUT);
	 }
	 
	 /**
	  * 获取互捐用户
	  * @param request
	  * @return
	  */
	 public CqsUser getCqsUser(HttpServletRequest request) {
		 String token=request.getHeader("token");
//		 String token="0dda8331-1111-4b42-9440-855eef56d6a7";
		 CqsUser cqsUser =getRedisObject(token, CQS_USER, CqsUser.class);
		 return cqsUser;
	 }
	 
	 /**
	  * 获取虚拟化对象
	  * @param token
	  * @param key
	  * @param t
	  * @return
	  */
	 public <T> T getRedisObject(String token,String key,Class<T> t){
		HashOperations<String, Object, Object> hash = redisTemplate.opsForHash();
		Object sAccount;
		T tObj=null;
		if(StringUtils.isNotBlank(token) &&  null!=(sAccount=hash.get(token, key))) {
			JSONObject jObj = JSONObject.parseObject(sAccount.toString());
			tObj = JSONObject.toJavaObject(jObj, t);
		}
		return tObj;
	 }
	 
	 
	 /**
	  * 设置redis对象信息
	  * @param token
	  * @param key
	  * @param obj
	  */
	 public void setRedisUserObject(HttpServletRequest request,String key,Object obj,int timeOut){
		 String token=request.getHeader("token");
		 setRedisObject(token, key, obj);
	 }
	 
	 /**
	  * 设置redis对象信息
	  * @param token
	  * @param key
	  * @param obj
	  */
	 private void setRedisObject(String token,String key,Object obj){
		 String accountString =null;
		 if(StringUtils.isBlank(token)) {
			 return;
		 }
		 if(null!=obj) {
			 accountString= JSONObject.toJSONString(obj);
		 }
		 HashOperations<String, Object, Object> hash = redisTemplate.opsForHash();
		 hash.put(token, key, accountString);
	 }
	 
	 /**
	  * 增加用户和token对应
	  * @param token
	  * @param key
	  * @param obj
	  */
	 public void addUserTokenMapping(String userID,String token){
		HashOperations<String, Object, Object> hash = redisTemplate.opsForHash();
		hash.put(USER_TOKEN_MAPPING, userID, token);
	 }
}
