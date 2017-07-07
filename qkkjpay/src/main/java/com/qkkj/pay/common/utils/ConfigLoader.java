package com.qkkj.pay.common.utils;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

public class ConfigLoader {

	private Properties config;
	
	public static ConfigLoader getInstance(){
		return SingletonHolder.instance;
	}
	
	public ConfigLoader clone(){
		return getInstance();
	}
	
	
	public ConfigLoader() {
		this.config = new Properties();
		
		try {
			this.config.load(ConfigLoader.class.getResourceAsStream("/config/config.properties"));
		} catch (IOException e) {
			e.printStackTrace();
			throw new ExceptionInInitializerError("加载属性文件失败！");
		}
	}

	
	public String getProperty(String key){
		return this.config.getProperty(key);
	}

	/**
	 * 
	 * @ClassName SingletonHolder
	 * @Description 实现单例模式的内部类
	 * @author HANBO
	 * @date 2016年5月6日下午2:47:24
	 *
	 */
	private static class SingletonHolder{
		private static ConfigLoader instance = new ConfigLoader();
	}
	/**
	 * 
	* @description: 设置指定key值的value
	* @param key
	* @param value void   
	* @author HANBO 
	* @date 2016年6月12日下午5:41:47
	 */
	public void setProperty(String key,String value){
		try {
			FileOutputStream fos = new FileOutputStream(ConfigLoader.class.getClassLoader().getResource("config/config.properties").getPath());           
			config.setProperty(key, value);
	        // 以适合使用 load 方法加载到 Properties 表中的格式，
	        // 将此 Properties 表中的属性列表（键和元素对）写入输出流
			config.store(fos, "Update '" + key + "' value");
			//关闭输出流
			fos.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}
	
}
