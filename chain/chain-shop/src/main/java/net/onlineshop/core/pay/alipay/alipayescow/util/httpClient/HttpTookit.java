package net.onlineshop.core.pay.alipay.alipayescow.util.httpClient;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;

import com.alibaba.fastjson.JSON;
import net.sf.json.JSONObject;
import net.sf.json.JSONArray;
public class HttpTookit {
    /**
     * 向指定URL发送GET方法的请求
     * 
     * @param url
     *            发送请求的URL
     * @param param
     *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @return URL 所代表远程资源的响应结果
     */
    public static String sendGet(String url) {
		String result = null;
		HttpClient httpClient = new HttpClient();
		GetMethod getMethod = new GetMethod(url);
		try {
			httpClient.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET, "UTF-8");
			getMethod.getParams().setParameter("http.method.retry-handler", new DefaultHttpMethodRetryHandler());
			int statusCode = httpClient.executeMethod(getMethod);
			if (statusCode == 200) {
				StringBuffer temp = new StringBuffer();
				InputStream in = getMethod.getResponseBodyAsStream();
				BufferedReader buffer = new BufferedReader(new InputStreamReader(in, "UTF-8"));
				for (String tempstr = ""; (tempstr = buffer.readLine()) != null;)
					temp = temp.append(tempstr);
				buffer.close();
				in.close();
				result = temp.toString().trim();
			} else {
				System.err.println((new StringBuilder("Can't get page:")).append(url).append("#").append(getMethod.getStatusLine()).toString());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		finally {
			getMethod.releaseConnection();
		}
		return result;
    }
  
    /**
     * 远程
     * @param url
     * @return
     */
    public static String getRemoteToken(String url){
    	 String resultStr= sendGet(url);
    	 JSONObject jsonObj = JSONObject.fromObject(resultStr);
    	 Object token=jsonObj.get("data");
         return token!=null?token.toString():null;
    }
    
    public static String getkuaidi100(String key,String value){
    	String url = "http://www.kuaidi100.com/query?type="+key+"&postid="+value;
    	 String s= sendGet(url);
         return s;
    }
    
    public static String autoComNum(String value){
    	 String url = "http://www.kuaidi100.com/autonumber/autoComNum?text="+value;
    	 String jsonStr = sendGet(url);
         JSONObject jsonObj = JSONObject.fromObject(jsonStr);
          JSONArray autoArray = jsonObj.getJSONArray("auto");
          if(autoArray!=null)
          for (Object _auto : autoArray) {
        	  if(null!=_auto)
        	  {
        		 JSONObject jobj = (JSONObject)_auto;
        		 Object comCode = jobj.get("comCode");
        		 return comCode!=null?comCode.toString():"";
        	  }
           }
         return "";
    }
    
    
    
    public static void main(String[] args) {
        //发送 GET 请求
//        String s= getkuaidi100("zhongtong","435036844771");
//        System.out.println(s);
    	
//    	String rr=HttpTookit.getRemoteToken("http://106.14.206.109:9998/f1/token?t=0e391690-d2bb-4b87-916c-2b770f920dda");
//    	System.out.println("rrrrr"+rr);
    	String rr=HttpTookit.autoComNum("032233232");
    	System.out.println("rrrrr"+rr);
    }
}