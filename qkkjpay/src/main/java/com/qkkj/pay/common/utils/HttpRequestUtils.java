package com.qkkj.pay.common.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import com.alibaba.fastjson.JSONObject;

public class HttpRequestUtils {
	
	/**
     * 建立请求
     * @param parameterArr 请求参数数组
     * @param signArr 用于参与签名的请求参数数组
     * @param reqUrl 请求的地址Url
     * @return 响应的HTML文本字符串形式
     */
	public static String buildJsonParamsRequest(String URLSTR,JSONObject param) 
	{
		String data=null;
		HttpURLConnection urlConnection=null;
		try {
			//传递的数据
			data = "jsonParams=" + URLEncoder.encode(param.toString(), "UTF-8");
			
			// 根据地址创建URL对象 
			URL url = new URL(URLSTR); 
			// 根据URL对象打开链接 
			urlConnection = (HttpURLConnection) url.openConnection(); 
			// 设置请求的方式 
			urlConnection.setRequestMethod("POST"); 
			// 设置请求的头 
			urlConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded"); 
			urlConnection.setRequestProperty("Content-Length", String.valueOf(data.getBytes().length));
			urlConnection.setDoOutput(true);// 发送POST请求必须设置允许输出 
			urlConnection.setDoInput(true); // 发送POST请求必须设置允许输入
		} catch (Exception e) {
			e.printStackTrace();
		} 
		
		String result=outPutResult(urlConnection, data);
		return result;
	}
	
	/**
	 * 获取服务器响应结果
	 * @param urlConnection 请求连接对象
	 * @param data 请求参数字符串
	 * @return 请求返回结果
	 */
	public static String outPutResult(HttpURLConnection urlConnection ,String data) {
		
		//获取输出流 
		try {
			if(urlConnection!=null && data!=null) {
				OutputStream os = urlConnection.getOutputStream();
				os.write(data.getBytes()); 
				os.flush();
			}
			if (urlConnection.getResponseCode() == 200) { 
				// 获取响应的输入流对象 
				InputStream is = urlConnection.getInputStream(); 
				// 创建字节输出流对象 
				ByteArrayOutputStream baos = new ByteArrayOutputStream(); 
				// 定义读取的长度 
				int len = 0; 
				// 定义缓冲区 
				byte buffer[] = new byte[1024]; 
				// 按照缓冲区的大小，循环读取 
				while ((len = is.read(buffer)) != -1) { 
					// 根据读取的长度写入到baos对象中 
					baos.write(buffer, 0, len); 
				} 
				
				// 释放资源 
				is.close(); 
				baos.close(); 
				// 返回字符串 
				final String result = new String(baos.toString("utf-8")); 
				return result;
			}
		} catch (IOException e) {
			e.printStackTrace();
		} 
		return null;
	}	

}
