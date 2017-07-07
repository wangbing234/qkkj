package com.qkkj.pay.common.httpclient;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import com.qkkj.pay.common.constants.Constants;
import com.qkkj.pay.common.exception.BusinessException;
import com.qkkj.pay.common.utils.MapUtil;
import com.qkkj.pay.common.utils.StringUtils;


public class HttpClientHelp {

	private static Log log = LogFactory.getLog(HttpClientHelp.class);

	public HttpClientHelp() {
		
	}
	
	
	public static String sendByGet(Map<String, Object> data, String url,Map<String, Object> headData)throws BusinessException {
		DefaultHttpClient httpclient = new DefaultHttpClient();
		
		String content = MapUtil.formtMapToHttpGetStr(data);
		int index = url.indexOf("?");
		if(index == -1){
			url += "?" + content;
		}else{
			url += content;
		}
		log.info("发送的url:"+url);
		
		HttpGet httpget = new HttpGet(url);
		
		if(null != headData){
			Iterator<Map.Entry<String, Object>> it = headData.entrySet().iterator();
			Map.Entry<String, Object> dataEntry = null;
			while(it.hasNext()){
				dataEntry = it.next();
				httpget.setHeader(dataEntry.getKey(), dataEntry.getValue().toString());
			}
			log.info("header添加完成！");
		}
		
		try {
			HttpResponse response = httpclient.execute(httpget);
			HttpEntity entity = response.getEntity();
			
			byte[] bytes = EntityUtils.toByteArray(entity);
			String respstr = new String(bytes,Constants.DEFAULT_CHARSET);
			return respstr;
		} catch (ClientProtocolException e) {
			e.printStackTrace();
			throw new BusinessException("1","协议异常！");
		} catch(UnsupportedEncodingException e) {
			throw new BusinessException("2","编码异常！");
		} catch (IOException e) {
			e.printStackTrace();
			throw new BusinessException("3","io异常！");
		}
	}
	@SuppressWarnings("unused")
	public static String sendByPost(Map<String, Object> data, String url,
			Map<String, Object> headData)throws BusinessException{
		DefaultHttpClient httpclient = new DefaultHttpClient();
		
		log.info("传入的url"+url);
		
		HttpPost httpost = new HttpPost(url); 
		
		/**
		 * 设置报文头
		 */
		if(null != headData){
			Iterator<Map.Entry<String, Object>> iterator = headData.entrySet().iterator();
			
			Map.Entry<String, Object> headEntity = null;
			while(iterator.hasNext()){
				headEntity = (Map.Entry<String, Object>)iterator.next();
				httpost.setHeader(headEntity.getKey(),headEntity.getValue().toString());
				
			}
			log.info("header添加完成！");		
		}
		
		/**
		 * 拼接url参数
		 */
		try {
			List<NameValuePair> nvps = new ArrayList<NameValuePair>();
			Iterator<Map.Entry<String, Object>> it = data.entrySet().iterator();
			Map.Entry<String, Object> entity = null;
			while(it.hasNext()){
				entity = (Map.Entry<String, Object>)it.next();
				nvps.add(new BasicNameValuePair(entity.getKey(),StringUtils.convertStr(entity.getValue())));
				
			}
			log.info(nvps);
			httpost.setEntity(new UrlEncodedFormEntity(nvps,Constants.DEFAULT_CHARSET));
		} catch (UnsupportedEncodingException e) {
			throw new BusinessException("2","编码异常！");
		}
		
		try {
			HttpResponse response = httpclient.execute(httpost);
			HttpEntity entity = response.getEntity();
			log.info("返回长度[" + entity.getContentLength() + "]");
			if (entity != null) {
				byte[] bytes = EntityUtils.toByteArray(entity);
				String value = new String(bytes, Constants.DEFAULT_CHARSET);
				return value;
			} else {
				throw new BusinessException("0", "返回长度为空");
			}
		} catch (ClientProtocolException e) {
			throw new BusinessException("1", "协议异常");
		} catch (UnsupportedEncodingException e) {
			throw new BusinessException("2", "编码异常");
		}  catch (IOException e) {
			throw new BusinessException("3","io异常");
		}
		
	}
	
	/**
	 * 构建一个字符串作为POST请求的
	 * @param dataStr
	 * @param url
	 * @param headData
	 * @return
	 * @throws BusinessException
	 */
	@SuppressWarnings("unused")
	public static String sendStrEntityByPost(String dataStr, String url,Map<String, Object> headData)throws BusinessException{
		
		DefaultHttpClient httpclient = new DefaultHttpClient();
		
		log.info("url ： "+url);
		
		HttpPost httpost = new HttpPost(url); 
		
		/**
		 * 设置报文头
		 */
		if(null != headData){
			Iterator<Map.Entry<String, Object>> iterator = headData.entrySet().iterator();
			
			Map.Entry<String, Object> headEntity = null;
			while(iterator.hasNext()){
				headEntity = (Map.Entry<String, Object>)iterator.next();
				httpost.setHeader(headEntity.getKey(),headEntity.getValue().toString());
				
			}
			log.info("header:"+headEntity);		
		}
		
		StringEntity strEntity = new StringEntity(dataStr,Constants.DEFAULT_CHARSET);
		strEntity.setContentType("application/x-www-form-urlencoded");
		
		httpost.setEntity(strEntity);
		
		try {
			HttpResponse response = httpclient.execute(httpost);
			HttpEntity entity = response.getEntity();
			
			log.info("return length [" + entity.getContentLength() + "]");
			
			if (entity != null) {
				byte[] bytes = EntityUtils.toByteArray(entity);
				String value = new String(bytes, Constants.DEFAULT_CHARSET);
				return value;
			} else {
				throw new BusinessException("0", "返回长度为空");
			}
		} catch (ClientProtocolException e) {
			throw new BusinessException("1", "协议异常");
		} catch (UnsupportedEncodingException e) {
			throw new BusinessException("2", "编码异常");
		}  catch (IOException e) {
			throw new BusinessException("3","io异常");
		}
		
	}
	
	
	
	/**
	 * HTTP请求主方法
	 * @param data
	 * @param url
	 * @param method
	 * @param head
	 * @return
	 * @throws BusinessException
	 */
	public static String sendHttpRequest(Map<String, Object> data,
			String url, String method, Map<String, Object> head)
			throws BusinessException {
		
		String respContent = null;
		if(Constants.HTTP_METHOD_GET.equals(method)){
			respContent = sendByGet(data, url, head);
		}else if(Constants.HTTP_METHOD_POST.equals(method)){
			respContent = sendByPost(data, url, head);
		}
		
		return respContent;
	}
	
}