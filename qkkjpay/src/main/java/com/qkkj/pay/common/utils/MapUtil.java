package com.qkkj.pay.common.utils;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 *
 *
 * 类名称：MapUtil
 * 类描述：
 * 创建人：mzw
 * 创建时间：2015年8月13日 上午10:28:03
 * 修改人：mzw
 * 修改时间：2015年8月13日 上午10:28:03
 * Modification History:
 * =============================================================================
 *   Author         Date           Description
 *  ---------------------------------------------------------------------------
 * =============================================================================
 * @version 1.0.0
 * 操作map的工具类
 */
public class MapUtil {
    /**
     *
     * formtMapToStr 将map转化为http get请求串
     * @param data
     * void
     * @exception
     * @since  1.0.0
     */
    public static String formtMapToHttpGetStr(Map<String,Object> data){
       if(data == null || data.size() == 0){
    	   return "";
       }
       StringBuilder builder = new StringBuilder();
       Iterator<Map.Entry<String, Object>> iterator  =  data.entrySet().iterator();
       Map.Entry<String, Object> temp = null;
       while(iterator.hasNext()){
    	   temp = (Map.Entry<String, Object>)iterator.next();
    	   builder.append(temp.getKey()).append("=").append(temp.getValue());
    	   if(iterator.hasNext()){
    		   builder.append("&");
    	   }
       }

       return builder.toString();
    }

    public static void main(String[] args){

       Map<String, Object> data = new HashMap<String, Object>();
       data.put("key1", 11);
       data.put("key2", "234234");

       System.out.println(formtMapToHttpGetStr(data));


    }


}
