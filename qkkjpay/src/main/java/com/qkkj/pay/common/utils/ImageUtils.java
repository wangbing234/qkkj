package com.qkkj.pay.common.utils;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Random;

import javax.imageio.ImageIO;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;

import sun.misc.BASE64Encoder;

public class ImageUtils 
{
	public  String createQrcode(String text)
	{
        String qrcodeFilePath = null;
        try
        {
            int qrcodeWidth = 300;
            int qrcodeHeight = 300;
            String qrcodeFormat = "png";
            HashMap<EncodeHintType, String> hints = new HashMap<EncodeHintType, String>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            BitMatrix bitMatrix = new MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, qrcodeWidth, qrcodeHeight, hints);
           
            //int margin = 15;  //自定义白边边框宽度

            //bitMatrix = updateBit(bitMatrix, margin);  //生成新的bitMatrix
           // BufferedImage image = new BufferedImage(qrcodeWidth, qrcodeHeight, BufferedImage.TYPE_INT_RGB);
            Random random = new Random();
            File QrcodeFile = new File(System.getProperty("user.dir")+"\\image\\" + random.nextInt() + "." + qrcodeFormat);
            ImageIO.write(MatrixToImageWriter.toBufferedImage(bitMatrix), qrcodeFormat, QrcodeFile);
            qrcodeFilePath = QrcodeFile.getAbsolutePath();
        } catch (Exception e) 
        {
            e.printStackTrace();
        }
        return qrcodeFilePath;
    }
	public byte[] imageToBytes(String path) throws IOException 
	{  
	    InputStream inputStream = new FileInputStream(path);  
	    BufferedInputStream in = new BufferedInputStream(inputStream);  
	    ByteArrayOutputStream out = new ByteArrayOutputStream(1024);  
	  
	    byte[] temp = new byte[1024];  
	    int size = 0;  
	    while ((size = in.read(temp)) != -1) 
	    {  
	        out.write(temp, 0, size);  
	    }  
	    in.close();  
	    byte[] content = out.toByteArray();  
	    return content;  
	}  
	
	/**
	 * @author smart迅
	 *
	 * @param imgFile
	 * @return
	 */
	public  String GetImageStr(String imgFile)
    {
		//将图片文件转化为字节数组字符串，并对其进行Base64编码处理
        InputStream in = null;
        byte[] data = null;
        //读取图片字节数组
        try 
        {
            in = new FileInputStream(imgFile);        
            data = new byte[in.available()];
            in.read(data);
            in.close();
            File file = new File(imgFile);
            file.delete();
        } 
        catch (IOException e) 
        {
            e.printStackTrace();
        }
        //对字节数组Base64编码
        BASE64Encoder encoder = new BASE64Encoder();
        return encoder.encode(data);//返回Base64编码过的字节数组字符串
    }
	/**
	 * @author smart迅
	 *
	 * @param matrix
	 * @param margin
	 * @return
	 */
	private BitMatrix updateBit(BitMatrix matrix, int margin)
	{

		int tempM = margin*2;

		int[] rec = matrix.getEnclosingRectangle();   //获取二维码图案的属性

		int resWidth = rec[2] + tempM;

		int resHeight = rec[3] + tempM;

		BitMatrix resMatrix = new BitMatrix(resWidth, resHeight); // 按照自定义边框生成新的BitMatrix

		resMatrix.clear();

		for(int i= margin; i < resWidth- margin; i++)
		{   //循环，将二维码图案绘制到新的bitMatrix中

			for(int j=margin; j < resHeight-margin; j++)
			{

				if(matrix.get(i-margin + rec[0], j-margin + rec[1]))
				{

					resMatrix.set(i,j);

				}

			}

		}

		return resMatrix;

	}
}
