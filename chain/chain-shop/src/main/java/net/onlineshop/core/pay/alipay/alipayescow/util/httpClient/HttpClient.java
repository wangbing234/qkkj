package net.onlineshop.core.pay.alipay.alipayescow.util.httpClient;

import java.io.IOException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import com.alibaba.fastjson.JSON;


/**
 * @author smart迅
 *HttpClient工具类
 */
public class HttpClient 
{
	
	/**
	 * 发送HTTP_GET请求
	 * @see 该方法会自动关闭连接,释放资源
	 * @param requestURL    请求地址(含参数)
	 * @param decodeCharset 解码字符集,解析响应数据时用之,其为null时默认采用UTF-8解码
	 * @return 远程主机响应正文
	 */
	public String sendGetRequest(String reqURL, String decodeCharset)
	{
		long responseLength = 0;       //响应长度
		String responseContent = null; //响应内容
		DefaultHttpClient httpClient = new DefaultHttpClient(); //创建默认的httpClient实例
		HttpGet httpGet = new HttpGet(reqURL);           //创建org.apache.http.client.methods.HttpGet
		try
		{
			HttpResponse response = httpClient.execute(httpGet); //执行GET请求
			HttpEntity entity = response.getEntity();            //获取响应实体
			if(null != entity){
				responseLength = entity.getContentLength();
				responseContent = EntityUtils.toString(entity, decodeCharset==null ? "UTF-8" : decodeCharset);
				EntityUtils.consume(entity); //Consume response content
		}
			/*System.out.println("请求地址: " + httpGet.getURI());
			System.out.println("响应状态: " + response.getStatusLine());
			System.out.println("响应长度: " + responseLength);
			System.out.println("响应内容: " + responseContent);*/
		}
		catch(ClientProtocolException e)
		{
			//LogUtil.getLogger().error("该异常通常是协议错误导致,比如构造HttpGet对象时传入的协议不对(将'http'写成'htp')或者服务器端返回的内容不符合HTTP协议要求等,堆栈信息如下", e);
		}
		catch(ParseException e)
		{
			//LogUtil.getLogger().error(e.getMessage(), e);
		}
		catch(IOException e)
		{
			//LogUtil.getLogger().error("该异常通常是网络原因引起的,如HTTP服务器未启动等,堆栈信息如下", e);
		}
		finally
		{
			httpClient.getConnectionManager().shutdown(); //关闭连接,释放资源
			httpClient.close();
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
		System.out.println(str);
		try {
			HttpPost request = new HttpPost(url);
			StringEntity params = new StringEntity(str, "UTF-8");
			request.addHeader("content-type", "application/json");
			request.addHeader("Accept", "application/json");
			request.setEntity(params);
			HttpResponse response = httpClient.execute(request);
			int statusCode = response.getStatusLine().getStatusCode();
			System.out.println(statusCode);

			if (response != null) 
			{
				String responseBody = EntityUtils.toString(response.getEntity(), "UTF-8");
				//System.out.println(responseBody.toString());
				return responseBody;
			}

		} catch (Exception ex) 
		{
			ex.printStackTrace();
		} finally {
			httpClient.getConnectionManager().shutdown();
			httpClient.close();
		}
		return null;
	
	}
}
