package net.onlineshop.core.kuaidi;

import java.io.BufferedReader;
import java.io.InputStreamReader;

public class GetDataByURL {
	public static String getWebCon(String domain) {
		// System.out.println("开始读取内容...("+domain+")");
		StringBuffer sb = new StringBuffer();
		try {
			java.net.URL url = new java.net.URL(domain);
			BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));
			String line;
			while ((line = in.readLine()) != null) {
				sb.append(line);
			}
			System.out.println(sb.toString());
			in.close();
		} catch (Exception e) { // Report any errors that arise
			sb.append(e.toString());
			System.err.println(e);
			System.err.println("Usage:   java   HttpClient   <URL>   [<filename>]");
		}
		return sb.toString();
	}
	public static void main(String[] args) {
//		getWebCon("http://www.kuaidi100.com/chaxun?com=shunfeng&nu=212624690238");
		getWebCon("http://127.0.0.1:9080/order/confirmOrders.html");
	}
}