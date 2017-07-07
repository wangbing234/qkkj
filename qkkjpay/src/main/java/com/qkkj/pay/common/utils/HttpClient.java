package com.qkkj.pay.common.utils;

import java.io.IOException;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.qkkj.pay.service.impl.PaymentServiceImpl;


/**
 * @author smart迅
 *HttpClient工具类
 */
public class HttpClient 
{
	private final  Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);
	
	/**
	 * 发送HTTP_GET请求
	 * @see 该方法会自动关闭连接,释放资源
	 * @param requestURL    请求地址(含参数)
	 * @param decodeCharset 解码字符集,解析响应数据时用之,其为null时默认采用UTF-8解码
	 * @return 远程主机响应正文
	 */
	public String sendGetRequest(String reqURL, String decodeCharset)
	{
		String responseContent = null; //响应内容
		DefaultHttpClient httpClient = new DefaultHttpClient(); //创建默认的httpClient实例
		HttpGet httpGet = new HttpGet(reqURL);           //创建org.apache.http.client.methods.HttpGet
		try
		{
			HttpResponse response = httpClient.execute(httpGet); //执行GET请求
			HttpEntity entity = response.getEntity();            //获取响应实体
			if(null != entity)
			{
				//responseLength = entity.getContentLength();
				responseContent = EntityUtils.toString(entity, decodeCharset==null ? "UTF-8" : decodeCharset);
				EntityUtils.consume(entity); //Consume response content
		}
			//System.out.println("响应内容: " + responseContent);*/
		}
		catch(ClientProtocolException e)
		{
			logger.error("该异常通常是协议错误导致,比如构造HttpGet对象时传入的协议不对(将'http'写成'htp')或者服务器端返回的内容不符合HTTP协议要求等,堆栈信息如下", e);
		}
		catch(ParseException e)
		{
			logger.error(e.getMessage(), e);
		}
		catch(IOException e)
		{
			logger.error("该异常通常是网络原因引起的,如HTTP服务器未启动等,堆栈信息如下", e);
		}
		finally
		{
			httpClient.getConnectionManager().shutdown(); //关闭连接,释放资源
		}
		return responseContent;
	}
	
	/**
	 * @author smart迅
	 *post请求
	 * @param url
	 * @param t
	 * @return
	 */
	public <T> String sendPostRequest(String url,T t)
	{
		DefaultHttpClient httpClient = new DefaultHttpClient();
		
		String str = JSON.toJSONString(t);
		
		try {
			HttpPost request = new HttpPost(url);
			StringEntity params = new StringEntity(str, "UTF-8");
			request.addHeader("content-type", "application/json");
			request.addHeader("Accept", "application/json");
			request.setEntity(params);
			HttpResponse response = httpClient.execute(request);
			int statusCode = response.getStatusLine().getStatusCode();
			logger.debug("statues code :"+statusCode);
			if (response != null) 
			{
				String responseBody = EntityUtils.toString(response.getEntity(), "UTF-8");
				return responseBody;
			}

		} catch (Exception ex) 
		{
			logger.error("error :"+ex.getMessage());
			ex.printStackTrace();
		} finally {
			httpClient.getConnectionManager().shutdown();
		}
		return null;
	
	}
	
	/**
     * 向HTTPS地址发送POST请求
     * @param reqURL 请求地址
     * @param params 请求参数
     * @return 响应内容
     */ 
    public String sendPostRequestMap(
    		String reqURL, Map<String, String> paramsMap)
    {  
    	
    	DefaultHttpClient httpClient = new DefaultHttpClient();
		
		String str = paramsMap.toString();
		
		try 
		{
			HttpPost request = new HttpPost(reqURL);
			StringEntity params = new StringEntity(str, "UTF-8");
			request.addHeader("content-type", "application/x-www-form-urlencoded");
			request.addHeader("Accept", "application/json");
			request.setEntity(params);
			HttpResponse response = httpClient.execute(request);
			int statusCode = response.getStatusLine().getStatusCode();
			logger.debug("statues code :" +statusCode);

			if (response != null) 
			{
				String responseBody = EntityUtils.toString(response.getEntity(), "UTF-8");
				
				return responseBody;
			}

		} catch (Exception ex) 
		{
			logger.error("exception :"+ex.getMessage());
			ex.printStackTrace();
		} finally {
			httpClient.getConnectionManager().shutdown();
		}
		return null;
    
    }
}