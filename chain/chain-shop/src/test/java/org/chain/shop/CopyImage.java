package org.chain.shop;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
public class CopyImage {
	public static String  path="E:\\open";
	public static File targetFile=new File("C:\\data\\img\\target");
	
	
	public static void main(String[] args) throws Exception {
		System.out.println(targetFile.exists());
//		if(!targetFile.exists())
//			targetFile.mkdirs();
//		getFile(new File(path));
	}
	
	
	private static void getFile(File parentFile) throws Exception
	{
		for (File file : parentFile.listFiles()) {
			if(file.isDirectory())
			{
				getFile(file);
			}
			else
			{
				copyFile(file);
			}
		}
	}
	
	private static void copyFile(File oldFile) throws Exception {
		String path=targetFile.getAbsolutePath()+File.separator+oldFile.getName();
		System.out.println(path);
		FileOutputStream outputStream = new FileOutputStream(new File(path)); 
		
		FileInputStream inputStream = new FileInputStream(oldFile);
		byte[] wxj = new byte[1024];
		int length = inputStream.read(wxj);
		while (length != -1) {
			outputStream.write(wxj, 0, length);
			length = inputStream.read(wxj);
		}
		outputStream.close();
		inputStream.close();
	}

}
