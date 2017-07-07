package net.onlineshop.core;

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

public class ImgExample {
	public static void main(String[] args) {
		File in = new File("d:/borrow-icon.png");
		// 原图片
		File out = new File("d:/1445866085249_400.png");
		// 目的图片
		File out1 = new File("d:/1445866085249_50.jpg");
		// 目的图片
		ScaleParameter scaleParam = new ScaleParameter(400, 400);
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
			e.printStackTrace();
		} finally {
			IOUtils.closeQuietly(inStream);
			// 图片文件输入输出流必须记得关闭
			IOUtils.closeQuietly(outStream);
			if (wr != null) {
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
