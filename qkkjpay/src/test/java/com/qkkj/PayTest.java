package com.qkkj;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Random;

import javax.imageio.ImageIO;

import com.alibaba.fastjson.JSON;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.qkkj.pay.common.utils.ImageUtils;
import com.qkkj.pay.common.utils.MatrixToImageWriter;
import com.qkkj.pay.domain.rsp.ScanPayRsp;

public class PayTest 
{
	public static void main(String[] args) 
	{
		//System.out.println(createQrcode("https://qr.alipay.com/bax03199vepheqcae2ce8007"));
		ImageUtils imageUtils = new ImageUtils();
		String strpath = imageUtils.createQrcode("https://qr.alipay.com/bax03199vepheqcae2ce8007");
		
			String res = imageUtils.GetImageStr(strpath);

			System.out.println(res);
		
		/*String str = "{\"order_no\":\"149639079646317etnx\",\"retcode\":\"succ\",\"retmsg\":\"返回成功\",\"retsign\":\"https://qr.alipay.com/bax08521lu6ndyba7gag808d\"}";
		System.out.println(str);
		ScanPayRsp o = JSON.parseObject(str, ScanPayRsp.class);
		System.out.println(o.getOrder_no());
		*/
		
	}
	public static String createQrcode(String text){
        String qrcodeFilePath = null;
        try {
            int qrcodeWidth = 300;
            int qrcodeHeight = 300;
            String qrcodeFormat = "png";
            HashMap<EncodeHintType, String> hints = new HashMap<EncodeHintType, String>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            BitMatrix bitMatrix = new MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, qrcodeWidth, qrcodeHeight, hints);
            
           // BufferedImage image = new BufferedImage(qrcodeWidth, qrcodeHeight, BufferedImage.TYPE_INT_RGB);
            Random random = new Random();
            File QrcodeFile = new File("F:\\qrcode\\" + random.nextInt() + "." + qrcodeFormat);
            ImageIO.write(MatrixToImageWriter.toBufferedImage(bitMatrix), qrcodeFormat, QrcodeFile);
            qrcodeFilePath = QrcodeFile.getAbsolutePath();
        } catch (Exception e) 
        {
            e.printStackTrace();
        }
        return qrcodeFilePath;
    }

}
