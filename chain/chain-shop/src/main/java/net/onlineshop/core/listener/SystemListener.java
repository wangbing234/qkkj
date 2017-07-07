package net.onlineshop.core.listener;

import java.io.File;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.ServletRequestEvent;
import javax.servlet.ServletRequestListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import net.onlineshop.core.oscache.FrontCache;
import net.onlineshop.core.oscache.ManageCache;
import net.onlineshop.services.front.account.bean.Busi;

/**
 * 系统配置加载监听器
 */
public class SystemListener implements  ServletRequestListener, ServletContextListener, HttpSessionListener{
	private static final org.slf4j.Logger logger = LoggerFactory.getLogger(SystemListener.class);

	public void contextDestroyed(ServletContextEvent arg0) {
		MyFileListener.removeFileListenter();
	}

	public void contextInitialized(ServletContextEvent serletContext) {
		initFileMonitor(serletContext);
		loadAllCache(serletContext);
	}
	
	private void initFileMonitor(ServletContextEvent serletContext)
	{
			//增加数据文件监听
			if(Busi.YES.equals(String.valueOf(CoreParamCache.getInstance().get("fileMonitorOpen")))) {
				String rootDir=serletContext.getServletContext().getRealPath("/");
				try {
					MyFileListener.addMyFileListenter(new File(rootDir).getParent());
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
	}
	
	private void loadAllCache(ServletContextEvent serletContext)
	{
		try {
			//初始化缓存
			WebApplicationContext app = WebApplicationContextUtils.getWebApplicationContext(serletContext.getServletContext());
			FrontCache frontCache = (FrontCache) app.getBean("frontCache");
			ManageCache manageCache = (ManageCache) app.getBean("manageCache");
			frontCache.loadAllCache();
			manageCache.loadAllCache();
		} catch (Throwable e) {
			e.printStackTrace();
			logger.debug("System load faild!" + e.getMessage());
			try {
				throw new Exception("系统初始化失败！");
			} catch (Exception e1) {
				e1.printStackTrace();
			}
		}
	}

	@Override
	public void sessionCreated(HttpSessionEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void sessionDestroyed(HttpSessionEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void requestDestroyed(ServletRequestEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void requestInitialized(ServletRequestEvent arg0) {
		// TODO Auto-generated method stub
		
	}

}
