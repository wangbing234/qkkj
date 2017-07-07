package net.onlineshop.core;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;

import net.onlineshop.core.sms.SMSWebChinese;
import net.onlineshop.services.manage.sms.bean.Sms;

import org.apache.commons.httpclient.HttpException;

public class SmsThread implements Runnable {

	private List<Sms> sendlist;

	public SmsThread(List<Sms> sendlist) {
		this.sendlist = sendlist;

	}

	@Override
	public void run() {
		for (Sms sms : sendlist) {
			sms.setContent("亲您好！您订购的商品，已发" + sms.getExcom() + "：" + sms.getExno() + ",祝您生活愉快！");
			if (sms.getPhone() != null && sms.getPhone().length() > 10) {
				System.out.println(sms.getPhone() + sms.getContent());
				try {
					SMSWebChinese.sendSMS(sms);
				} catch (HttpException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}

		}
	}

}
