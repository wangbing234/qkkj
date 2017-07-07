
package net.onlineshop.services.front.account.impl;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;

import org.apache.commons.codec.binary.Base64;

import net.onlineshop.core.util.ImageUtil;

/**
 * 图片工具类
 * @author bing.wang
 *
 */
public class ImageUtils {

	
	/**
	 * 存图片数据到指定磁盘路径
	 * @param imgData 图片数据
	 * @param filePath 图片路径
	 */
	public static void  saveImageByPath(byte[] imgData, final String filePath) throws Exception{
			OutputStream out = null;
			File file=new File(filePath);
			File parentFile=file.getParentFile();
			if(!parentFile.exists())
				parentFile.mkdirs();
			out = new FileOutputStream(file);
			out.write(imgData);
			out.flush();
			out.close();
			
			new Thread(new Runnable(){
				  public void run(){
					  File f=new File(filePath);
					  ImageUtil.zoomImage(filePath,f.getParent()+File.separator+"s_"+f.getName(), 400, 400);
				  }
			}).start();
	}
	
	/**
	 * 
	 * @param file
	 * @param filePath
	 */
	public static void  saveImageByPath(File file, String filePath) throws Exception{
		saveImageByPath(file2byte(file), filePath);
	}
	
	/**
	 * 文件转换成byte
	 * @param filePath
	 * @return
	 */
	public static byte[] file2byte(File file)throws Exception
    {  
        byte[] buffer = null;  
        FileInputStream fis = new FileInputStream(file);  
        ByteArrayOutputStream bos = new ByteArrayOutputStream();  
        byte[] b = new byte[1024];  
        int n;  
        while ((n = fis.read(b)) != -1)  
        {  
            bos.write(b, 0, n);  
        }  
        fis.close();  
        bos.close();  
        buffer = bos.toByteArray();  
        return buffer;  
    }  
	
	/**
	 * 替换最后一个图片字符
	 * 
	 * @param string
	 * @param toReplace
	 * @param replacement
	 * @return
	 */
	public static String replaceLast(String str, String toReplace, String replacement) {
		String imageExt = toReplace+"." ;
		int pos = str.lastIndexOf(imageExt);
		if (pos > -1)
			return str.replace(imageExt,replacement+ ".");
		return str;
	}
	
	public static void main(String[] args) {
		System.out.println(replaceLast("sf_1sf_1.jpg", "_1", "_3"));
	}
}
