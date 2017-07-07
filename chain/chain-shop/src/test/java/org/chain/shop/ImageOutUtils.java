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

public class ImageOutUtils {
    public final  static String[] IMAGE_EXT={".gif",".jpg",".jpeg",".png",".bmp"};
	public static void main(String[] args) throws Exception {
		try
		{
			System.out.println("开始转换。。。。。");
			getFile(new File("C:\\data\\img\\attached\\image\\111"));
			System.out.println("结束转换。。。。。");
		}
		catch (Exception e) {
			System.out.println("转换异常结束。。。。。");
			e.printStackTrace();
		}
		
	}
	
	
	public static void callPicture(File file)
	{
		
		if(isEndWithExt(file.getAbsolutePath().toLowerCase()))
		{
			printPicture(file,"_1",160,160);
			printPicture(file,"_2",400,400);
			file.renameTo(getFileNameExt(file,"_3"));
		}
	}
	
	private static Boolean isEndWithExt(String fileName){
		for (String  ext : IMAGE_EXT) { 
			if(fileName.endsWith(ext))
				{
					return true;
				}
		}
		System.out.println("无法转换的文件名："+fileName);
		return false;
	}
	
	public static void getFile(File parentFile) throws Exception
	{
		for (File file : parentFile.listFiles()) {
			if(file.isDirectory())
			{
				System.out.println("正在转换文件夹："+file.getAbsolutePath());
				getFile(file);
			}
			else
			{
				callPicture(file);
			}
		}
	}
	
	private static File getFileNameExt(File in,String suf)
	{
		// 原图片
		String parentFile=in.getParent();
		String fileName=in.getName().substring(0, in.getName().indexOf("."))+suf;
		String fileNameSuff=in.getName().substring(in.getName().indexOf("."));
		return new File(parentFile+File.separator+fileName+fileNameSuff);
	}
	
	public static void printPicture(File in,String ext,int width,int heigth){
		// 原图片
		File out = getFileNameExt(in,ext);
		// 目的图片
		ScaleParameter scaleParam = new ScaleParameter(width, heigth);
		// 将图像缩略到1024x1024以内，不足1024x1024则不做任何处理
		FileInputStream inStream = null;
		FileOutputStream outStream = null;
		WriteRender wr = null;
		try {
			inStream = new FileInputStream(in);
			outStream = new FileOutputStream(out);
			ImageRender rr = new ReadRender(inStream);
			ImageRender sr = new ScaleRender(rr, scaleParam);
			wr = new WriteRender(sr, outStream);
			wr.render();
			// 触发图像处理
		} catch (Exception e) {
			System.out.println("转换文件失败："+in.getAbsolutePath()); 
		} finally {
			IOUtils.closeQuietly(inStream);
			// 图片文件输入输出流必须记得关闭
			IOUtils.closeQuietly(outStream);
			if (wr !=null) {
				try {
					wr.dispose();
					// 释放simpleImage的内部资源
				} catch (SimpleImageException ignore) {
					// skip ...
				}
			}
		}
	}
}
