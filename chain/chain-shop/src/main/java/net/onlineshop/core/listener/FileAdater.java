package net.onlineshop.core.listener;

import java.io.File;

import org.apache.commons.io.monitor.FileAlterationListenerAdaptor;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

public class FileAdater extends FileAlterationListenerAdaptor{
	private static final Logger logger = LoggerFactory.getLogger(FileAdater.class);
    @Override  
    public void onFileCreate(File file) {   
    	logger.info("[create File]:" + file.getAbsolutePath());
        while(!file.delete()) {
        	try {
				Thread.sleep(100);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
        }
       
    }   
    @Override  
    public void onFileChange(File file) {   
    	logger.info("[update file]:" + file.getAbsolutePath());
    }   
    @Override  
    public void onFileDelete(File file) {
    	logger.info("[delete file]:" + file.getAbsolutePath());   
    }
}
