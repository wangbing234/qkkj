package org.chain.shop;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.data.redis.serializer.RedisSerializer;

import net.onlineshop.core.util.RedisSevice;
import net.onlineshop.services.front.account.bean.Account;
import com.p6spy.engine.logging.appender.Log4jLogger;
public class TestUtils<T> {
//	enableTransactionSupport
	final RedisTemplate<String, Object> redisTemplate;
	private RedisSevice redisSevice;
	public TestUtils() {
		ClassPathXmlApplicationContext appCtx = new ClassPathXmlApplicationContext("applicationContext.xml");
		redisSevice = appCtx.getBean("redisSevice", RedisSevice.class);
		redisTemplate=redisSevice.getRedisTemplate();
	}

	public void setString() {
		// 添加一个 key
		ValueOperations<String, Object> value = redisTemplate.opsForValue();
		value.set("POINT_CUR_PRICE", "2.8");
		// 获取 这个 key 的值
		System.out.println(value.get("POINT_CUR_PRICE"));
	}

	public void putHashMap() {
		// 添加 一个 hash集合
		HashOperations<String, Object, Object> hash = redisTemplate.opsForHash();
//		
		Object obj = hash.get("41a409ad-deee-48eb-9e57-9b0af93fd619", RedisSevice.CQS_USER);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("name", "lp");
		map.put("age", "26");
		map.put("age", "27");
		Account account = new Account();
		account.setId("ddddd");
		RedisSerializer<Object> hashValueSize = (RedisSerializer<Object>) redisTemplate.getHashValueSerializer();
		byte[] sss = hashValueSize.serialize(account);
		map.put("account", sss);
		hash.putAll("lpMap", map);
		hash.put("lpMap", "age", "99");
		hash.put("lpMap1", "age", "99");
//		Map<String, Object> map2 = new HashMap<String, Object>();
//		map.put("name", "bing.wang");
//		hash.putAll("lpMap", map2);
		 System.out.println("设置超时时间之前："+redisTemplate.getExpire("lpMap"));
		 redisTemplate.boundHashOps("lpMap").expire(1, TimeUnit.HOURS);
		 try {
			Thread.sleep(10000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		 System.out.println("设置超时时间之后："+redisTemplate.getExpire("lpMap"));
	}

	public void getHashMap() {
//		redisTemplate.delete("lpMap");
		// 添加 一个 hash集合
		HashOperations<String, Object, Object> hash = redisTemplate.opsForHash();
		Object sAccount = hash.get("lpMap", "account");
		System.out.println(hash.entries("lpMap"));
		RedisSerializer<Object> hashValueSize = (RedisSerializer<Object>) redisTemplate.getHashValueSerializer();
		Object oo = hashValueSize.deserialize((byte[]) sAccount);
		System.out.println(oo.toString());
	}
	
	 private T getRedisObject(String token,String key,Class<T> t){
		 HashOperations<String, Object, Object> hash = redisTemplate.opsForHash();
		Object sAccount = hash.get(token, key);
		RedisSerializer<T> hashValueSize = (RedisSerializer<T>) redisTemplate.getHashValueSerializer();
		Class<T> account =(Class<T>) hashValueSize.deserialize((byte[]) sAccount);
		redisTemplate.boundHashOps(token).expire(2, TimeUnit.HOURS);
		return (T)account;
	 }

	public void testList() {
		// 添加 一个 list 列表
		ListOperations<String, Object> list = redisTemplate.opsForList();
		list.rightPush("lpList", "lp");
		list.rightPush("lpList", "26");
		// 输出 list
		System.out.println(list.range("lpList", 0, 1));
		// 添加 一个 set 集合
		SetOperations<String, Object> set = redisTemplate.opsForSet();
		set.add("lpSet", "lp");
		set.add("lpSet", "26");
		set.add("lpSet", "178cm");
		// 输出 set 集合
		System.out.println(set.members("lpSet"));
		// 添加有序的 set 集合
		ZSetOperations<String, Object> zset = redisTemplate.opsForZSet();
		zset.add("lpZset", "lp", 0);
		zset.add("lpZset", "26", 1);
		zset.add("lpZset", "178cm", 2);
		// 输出有序 set 集合
		System.out.println(zset.rangeByScore("lpZset", 0, 2));
	}
	
	public void testPoint()
	{
//		float cutPrice = redisSevice.getPointCurPrice();
//		System.out.println(cutPrice);
	}

	public static void main(String[] args) throws Exception {
		TestUtils testUtils = new TestUtils();
		testUtils.putHashMap();
//		testUtils.putHashMap();
//		testUtils.getHashMap();
		
	}
}
