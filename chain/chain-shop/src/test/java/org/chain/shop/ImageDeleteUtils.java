package org.chain.shop;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;

import org.apache.commons.io.IOUtils;

import com.alibaba.simpleimage.ImageRender;
import com.alibaba.simpleimage.SimpleImageException;
import com.alibaba.simpleimage.render.ReadRender;
import com.alibaba.simpleimage.render.ScaleParameter;
import com.alibaba.simpleimage.render.ScaleRender;
import com.alibaba.simpleimage.render.WriteRender;

public class ImageDeleteUtils {
    public final  static String[] IMAGE_EXT={".gif",".jpg",".jpeg",".png",".bmp"};
	public static void main(String[] args) throws Exception {
		try
		{
			getFile(new File("C:\\data\\img\\attached\\image"));
		}
		catch (Exception e) {
			System.out.println("删除异常结束。。。。。");
			e.printStackTrace();
		}
		
	}
	
 
	
	public static void getFile(File parentFile) throws Exception
	{
		
		for (File file : parentFile.listFiles()) {
			if(file.isDirectory())
			{
				getFile(file);
				String pingYin=ChineseToEnglish.getPingYin(file.getName());
				String newPath=file.getParent()+File.separator+pingYin;
				file.renameTo(new File(newPath));
			}
		}
		
	}
	
	
	
}
