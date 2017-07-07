package net.onlineshop.core.listener;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.web.context.ContextLoader;

public class CoreParamCache implements  InitializingBean {

	private String config;

	public void setConfig(String config) {
		this.config = config;
	}

	private Map<String, Object> params;

	@Override
	public void afterPropertiesSet() throws Exception {
		init();
	}

	public void init() {
		Properties p = new Properties();
		try {
			p.load(this.getClass().getResourceAsStream("/" + this.config));
		} catch (IOException e) {
			e.printStackTrace();
		}
		params = new HashMap<String, Object>();
		Iterator<Entry<Object, Object>> it = p.entrySet().iterator();
		Entry<Object, Object> entry;
		while (it.hasNext()) {
			entry = it.next();
			String key = (String) entry.getKey();
			String value = (String) entry.getValue();
			if (value.indexOf(",")!=-1) { // 包含非数字，视为分隔符
				String[] values = value.split(",");
				List<Integer> list = new ArrayList<Integer>();
				for (String s : values) {
					list.add(Integer.parseInt(s));
				}
				params.put(key, list);
			} 
			else if(value.matches(".*\\D.*"))
			{
				params.put(key, value);
			}
			else { // TODO 纯数字转换为整数类型？
				params.put(key, Integer.parseInt(value));
			}
		}
	}

	public void refresh() {
		init();
	}

	public void destroy() {
		params.clear();
	}

	public Object get(String key) {
		return params.get(key);
	}
	
	public static CoreParamCache  getInstance(){
		return (CoreParamCache) ContextLoader.getCurrentWebApplicationContext().getBean("coreParamCache");
	}
	

}
