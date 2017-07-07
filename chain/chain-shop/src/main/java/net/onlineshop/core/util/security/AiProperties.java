package net.onlineshop.core.util.security;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class AiProperties extends PropertyPlaceholderConfigurer {
	private static Map<String, String> ctxPropertiesMap;

	@Override
	protected void processProperties(ConfigurableListableBeanFactory beanFactory, Properties props) throws BeansException {
		// 特殊配置处理
		String password = props.getProperty("jdbc.password");
		if (password != null) {
			props.setProperty("jdbc.password", CipherUtil.decryptIWAP(password));
		}

		// 加载配置
		super.processProperties(beanFactory, props);

		// 缓存配置
		ctxPropertiesMap = new HashMap<String, String>();
		for (Object key : props.keySet()) {
			String keyStr = key.toString();
			// 实现转码
			try {
				ctxPropertiesMap.put(keyStr, new String(props.getProperty(keyStr).getBytes("ISO-8859-1"), "utf-8"));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
	}

	// 获取配置
	public static String getProperty(String name) {
		return ctxPropertiesMap.get(name);
	}

	public static void main(String[] args) {
		new ClassPathXmlApplicationContext("/applicationContext.xml");
		System.out.println(AiProperties.getProperty("jdbc.password"));
	}
}
