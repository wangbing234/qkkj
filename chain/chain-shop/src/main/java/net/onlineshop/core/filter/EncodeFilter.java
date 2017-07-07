package net.onlineshop.core.filter;

import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;

import net.onlineshop.core.freemarker.front.FreemarkerHelper;
import net.onlineshop.core.front.SystemManager;

public class EncodeFilter implements Filter {
	private static final Logger logger = Logger.getLogger(EncodeFilter.class);
	private Set<String> mappingURLMap;
	
	public void destroy() {
	}
	
	
	 private void getHeadersInfo(ServletRequest req) {
		    HttpServletRequest request=(HttpServletRequest)req;
	        String customUrl=request.getRequestURI();
	        String cType=req.getContentType();
	        StringBuffer sbffer=new StringBuffer("\r\n\r\n\rbegin getHeadersInfo()   EncodeFilter").append("\r\n");
	        sbffer.append("URL='").append(customUrl).append("'").append("\r\n")
	        .append("ContentType=").append(cType).append("\r\n")
	        .append("QueryString=").append("'") .append(request.getQueryString()).append("'").append("\r\n")
	        .append("array headers:").append("\r\n");
		    Map<String, String> map = new HashMap<String, String>();
		    Enumeration headerNames = request.getHeaderNames();
		    while (headerNames.hasMoreElements()) {
		        String key = (String) headerNames.nextElement();
		        String value = request.getHeader(key);
		        sbffer.append("'").append(key).append("'").append(": '").append(value).append("'").append("\r\n"); 
		    }
		    
		    sbffer.append("ParameterNames:").append("\r\n");
		    Enumeration em = request.getParameterNames();
		    while (em.hasMoreElements()) {
		       String name = (String) em.nextElement();
		       String value = req.getParameter(name);
		       sbffer.append("name=").append(name).append(" , value:").append(value).append("\r\n");
		   }
		    
		    sbffer.append(" getHeadersInfo() end").append("\r\n\r\n\r\n");
		    logger.info(sbffer.toString()); 
		 }

	public void doFilter(ServletRequest req, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		req.setCharacterEncoding("utf-8");
		response.setCharacterEncoding("utf-8");
		String cType=req.getContentType();
		 HttpServletRequest request=(HttpServletRequest)req;
	     String customUrl=request.getRequestURI();
		getHeadersInfo(req);
		if (cType != null) {
			String contentType = cType.toLowerCase(Locale.ENGLISH);
			if(isExist(contentType,customUrl)) {
				chain.doFilter(request, response);
			}
			else{
				logger.info("success Filter in EncodeFilter, customUrl:"+customUrl); 
			}
		} else {
			chain.doFilter(request, response);
		}
	}
	
	
	private boolean isExist(String contentType,String url){
		if(contentType.length()>100)
		{
			logger.info("success Filter in EncodeFilter.ContentType>50"+contentType); 
			return false;
		}
		for(String key :mappingURLMap){
		    if(url.indexOf(key)==0) {
		    	return true;
		    }
		}
		return false;
	}
	

	public void init(FilterConfig arg0) throws ServletException {
		mappingURLMap=SystemManager.mappingURLMap.keySet();
	}

}
