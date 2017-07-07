package net.onlineshop.core.listener;

import org.apache.commons.io.monitor.FileAlterationMonitor;
import org.apache.commons.io.monitor.FileAlterationObserver;

public class MyFileListener {
	static FileAlterationObserver observer = null;
	static FileAdater testListener;
	// public static void main(String[] args) throws Exception{
	// // 监控目录
	// String rootDir = "c:\\data";
	// addMyFileListenter(rootDir);
	// }

	public static void addMyFileListenter(String rootDir) throws Exception {
		// 轮询间隔 5 毫秒
		long interval = Long.parseLong(""+CoreParamCache.getInstance().get("fileMonitorInterval")); 
		observer = new FileAlterationObserver(rootDir, null, null);
		testListener=new FileAdater();
		observer.addListener(testListener);
		FileAlterationMonitor monitor = new FileAlterationMonitor(interval, observer);
		// 开始监控
		monitor.start();
	}

	public static void removeFileListenter() {
		if(null!=observer && null!=testListener) {
			observer.removeListener(testListener);
		}
	}
	
}
