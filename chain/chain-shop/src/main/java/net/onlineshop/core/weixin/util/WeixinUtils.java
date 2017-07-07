package net.onlineshop.core.weixin.util;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.ConnectException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Date;
import java.util.Hashtable;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;

import org.apache.log4j.Logger;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;

import net.onlineshop.core.DateUtil;
import net.onlineshop.core.listener.CoreParamCache;
import net.onlineshop.core.weixin.bean.AccessToken;
import net.onlineshop.core.weixin.bean.WeiXinMenu;
import net.onlineshop.core.weixin.bean.WeixinUsers;
import net.sf.json.JSONException;
import net.sf.json.JSONObject;

/**
 * 类说明
 * 
 * @author WUKZ
 * @version V1.0
 */
public class WeixinUtils {
	// 原始ID
	public static String ysid = "gh_b1e74f823807";
	// 第三方用户唯一凭证
	public static String appid = "wxc5f83dce93c8e235";
	// 第三方用户唯一凭证密钥
	public static String appsecret = "5929243a2e49585afb555658abe8fa34";
	// 商户号
	public static String partner = "1284867401";
	// 商户号Key
	public static String partnerkey = "szyhgouqi201607201041157788abcde";
	public static String payurl = "https://api.mch.weixin.qq.com/pay/unifiedorder";
	// 获取access_token的接口地址（GET） 限2000（次/天）
	public final static String access_token_url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET";

	public static String menu_create_url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=ACCESS_TOKEN";
	// 用户信息
	public static String user_info_url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN";
	// 用户信息
	public static String net_user_info_url = "https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN";
	// 客服消息
	public static String customer_mess_url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN";
	public static final String UPLOAD_IMAGE_URL = "https://api.weixin.qq.com/cgi-bin/media/upload?access_token=ACCESS_TOKEN&type=TYPE";// 上传临时素材

//	public static final String NEWS_URL = "https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=ACCESS_TOKEN";// 获得素材列表
	// 统一下单接口
//	public static final String pay_url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
	// 网页授权调用接口
	public static final String net_oauth_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect";
	// 网页授权获得access_tokenSECRET
	public static final String net_access_token_url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code";
	// 网页授权校验
//	public static final String check_access_token = "https://api.weixin.qq.com/sns/auth?access_token=ACCESS_TOKEN&openid=OPENID";
	// 获得客服列表
//	public static final String kf_getkflist = "https://api.weixin.qq.com/cgi-bin/customservice/getkflist?access_token=ACCESS_TOKEN";
	// 获得在线客服接待信息
//	public static final String kf_getonlinekflist = "https://api.weixin.qq.com/cgi-bin/customservice/getonlinekflist?access_token=ACCESS_TOKEN";
	// 添加客服
//	public static final String kf_add = "https://api.weixin.qq.com/customservice/kfaccount/add?access_token=ACCESS_TOKEN";
	// 设置客服
//	public static final String kf_update = "https://api.weixin.qq.com/customservice/kfaccount/update?access_token=ACCESS_TOKEN";
	// 红包
//	private static final String hongbao = "https://api.mch.weixin.qq.com/mmpaymkttransfers/sendredpack";
	/**
	 * 上传头像
	 */
//	public static final String kf_uploadheadimg = "http://api.weixin.qq.com/customservice/kfaccount/uploadheadimg?access_token=ACCESS_TOKEN&kf_account=KFACCOUNT";
//	// 删除账号
//	public static final String kf_del = "https://api.weixin.qq.com/customservice/kfaccount/del?access_token=ACCESS_TOKEN&kf_account=KFACCOUNT";
//
//	public static final String showqrcode = "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=TICKET";
//	/**
//	 * 在线客服信息
//	 */
//	public static final String getonlinekflist = "https://api.weixin.qq.com/cgi-bin/customservice/getonlinekflist?access_token=ACCESS_TOKEN";
//	// 模板消息
//	public static final String templateMessage = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=ACCESS_TOKEN";
	private static final Logger log = Logger.getLogger(WeixinUtils.class);
	/**
	 * 获取access_token
	 * 
	 * @param appid
	 *            凭证
	 * @param appsecret
	 *            密钥
	 * @return
	 */
	public static AccessToken getAccessToken(String appid, String appsecret) {
		AccessToken accessToken = null;

		String requestUrl = access_token_url.replace("APPID", appid).replace("APPSECRET", appsecret);
		JSONObject jsonObject = httpRequest(requestUrl, "GET", null);
		// 如果请求成功
		if (null != jsonObject) {
			try {
				accessToken = new AccessToken();
				accessToken.setToken(jsonObject.getString("access_token"));
				accessToken.setExpiresIn(jsonObject.getInt("expires_in"));
			} catch (JSONException e) {
				accessToken = null;
				// 获取token失败

			}
		}
		return accessToken;
	}

//	public static Integer online(String accessToken, String account) {
//
//		Integer states = 0;
//		String requestUrl = getonlinekflist.replace("ACCESS_TOKEN", accessToken);
//		JSONObject jsonObject = httpRequest(requestUrl, "GET", null);
//		JSONArray jsonArray = jsonObject.getJSONArray("kf_online_list");
//		for (int i = 0; i < jsonArray.size(); i++) {
//			JSONObject o = jsonArray.getJSONObject(i);
//			String onlineAccount = o.getString("kf_account");
//			if (onlineAccount.equals(account)) {
//				states = o.getInt("status");
//			}
//
//		}
//
//		return states;
//	}

	/**
	 * 获得网页授权的Token
	 * 
	 * @param appid
	 * @param appsecret
	 * @param code
	 * @return
	 */
	public static AccessToken getNetAccessToken(String appid, String appsecret, String code) {
		AccessToken accessToken = null;
		String requestUrl = WeixinUtils.net_access_token_url.replace("APPID", appid).replace("SECRET", appsecret).replace("CODE", code);

		JSONObject jsonObject = httpRequest(requestUrl, "GET", null);
		// 如果请求成功
		if (null != jsonObject) {
			try {
				accessToken = new AccessToken();
				accessToken.setToken(jsonObject.getString("access_token"));
				accessToken.setExpiresIn(jsonObject.getInt("expires_in"));
				accessToken.setOpenid(jsonObject.getString("openid"));
			} catch (JSONException e) {

				accessToken = null;
				// 获取token失败

			}
		}
		return accessToken;
	}

	/**
	 * 发起https请求并获取结果
	 * 
	 * @param requestUrl
	 *            请求地址
	 * @param requestMethod
	 *            请求方式（GET、POST）
	 * @param outputStr
	 *            提交的数据
	 * @return JSONObject(通过JSONObject.get(key)的方式获取json对象的属性值)
	 */
	public static JSONObject httpRequest(String requestUrl, String requestMethod, String outputStr) {
		JSONObject jsonObject = null;
		StringBuffer buffer = new StringBuffer();
		try {
			// 创建SSLContext对象，并使用我们指定的信任管理器初始化
			TrustManager[] tm = { new MyX509TrustManager() };
			SSLContext sslContext = SSLContext.getInstance("SSL", "SunJSSE");
			sslContext.init(null, tm, new java.security.SecureRandom());
			// 从上述SSLContext对象中得到SSLSocketFactory对象
			SSLSocketFactory ssf = sslContext.getSocketFactory();

			URL url = new URL(requestUrl);
			HttpsURLConnection httpUrlConn = (HttpsURLConnection) url.openConnection();
			httpUrlConn.setSSLSocketFactory(ssf);

			httpUrlConn.setDoOutput(true);
			httpUrlConn.setDoInput(true);
			httpUrlConn.setUseCaches(false);
			// 设置请求方式（GET/POST）
			httpUrlConn.setRequestMethod(requestMethod);

			if ("GET".equalsIgnoreCase(requestMethod))
				httpUrlConn.connect();

			// 当有数据需要提交时
			if (null != outputStr) {
				OutputStream outputStream = httpUrlConn.getOutputStream();
				// 注意编码格式，防止中文乱码
				outputStream.write(outputStr.getBytes("UTF-8"));
				outputStream.close();
			}

			// 将返回的输入流转换成字符串
			InputStream inputStream = httpUrlConn.getInputStream();
			InputStreamReader inputStreamReader = new InputStreamReader(inputStream, "utf-8");
			BufferedReader bufferedReader = new BufferedReader(inputStreamReader);

			String str = null;
			while ((str = bufferedReader.readLine()) != null) {
				buffer.append(str);
			}
			bufferedReader.close();
			inputStreamReader.close();
			// 释放资源
			inputStream.close();
			inputStream = null;
			httpUrlConn.disconnect();

			jsonObject = JSONObject.fromObject(buffer.toString());

			System.out.println(requestUrl + "  WKZ请求" + DateUtil.dateFormat(new Date(), DateUtil.LONG_MODEL) + buffer.toString());
			if (buffer.toString().indexOf("errcode") != -1) {
				if (jsonObject.getString("errcode").equals("-1")) {
					System.out.println("系统繁忙 WKZ----" + buffer.toString());

				} else if (jsonObject.getString("errcode").equals("42001")) {
					System.out.println("AccessToken过期 WKZ----" + buffer.toString());
					TokenThread.accessToken = WeixinUtils.getAccessToken(WeixinUtils.appid, WeixinUtils.appsecret);

				}

			} else {

				System.out.println("正常 WKZ----" + buffer.toString());
			}
		} catch (ConnectException ce) {

		} catch (Exception e) {

		}
		return jsonObject;
	}

	public static boolean checkSignature(String token, String signature, String timestamp, String nonce) {
		if (signature == null || timestamp == null || nonce == null) {
			return false;
		}
		String[] arr = new String[] { token, timestamp, nonce };
		Arrays.sort(arr);
		StringBuilder content = new StringBuilder();
		for (int i = 0; i < arr.length; i++) {
			content.append(arr[i]);
		}
		MessageDigest md = null;
		String tmpStr = null;

		try {
			md = MessageDigest.getInstance("SHA-1");
			byte[] digest = md.digest(content.toString().getBytes());
			tmpStr = byteToStr(digest);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}

		content = null;
		return tmpStr != null ? tmpStr.equals(signature.toUpperCase()) : false;
	}

	// 将字节转换为十六进制字符串
	private static String byteToHexStr(byte ib) {
		char[] Digit = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };
		char[] ob = new char[2];
		ob[0] = Digit[(ib >>> 4) & 0X0F];
		ob[1] = Digit[ib & 0X0F];

		String s = new String(ob);
		return s;
	}

	// 将字节数组转换为十六进制字符串
	private static String byteToStr(byte[] bytearray) {
		String strDigest = "";
		for (int i = 0; i < bytearray.length; i++) {
			strDigest += byteToHexStr(bytearray[i]);
		}
		return strDigest;
	}

	public static int createMenu(WeiXinMenu menu, String accessToken) {
		int result = 0;

		// 拼装创建菜单的url
		String url = menu_create_url.replace("ACCESS_TOKEN", accessToken);
		// 将菜单对象转换成json字符串
		String jsonMenu = JSONObject.fromObject(menu).toString();

		System.out.println(jsonMenu);
		// 调用接口创建菜单
		JSONObject jsonObject = httpRequest(url, "POST", jsonMenu);

		if (null != jsonObject) {
			if (0 != jsonObject.getInt("errcode")) {
				result = jsonObject.getInt("errcode");

				log.error("创建菜单失败 errcode:" + jsonObject.getInt("errcode") + " errmsg:" + jsonObject.getString("errmsg"));
			}
		}

		return result;
	}

	/**
	 * 获得客户信息
	 * 
	 * @param accessToken
	 * @param openid
	 * @return
	 */
	public static WeixinUsers findUserInfo(String accessToken, String openid) {
		WeixinUsers userInfo = new WeixinUsers();
		int result = 0;

		// 拼装创建菜单的url
		String url = user_info_url.replace("ACCESS_TOKEN", accessToken).replace("OPENID", openid);
		System.out.println("----------------" + url);

		// 调用接口创建菜单
		JSONObject jsonObject = httpRequest(url, "GET", null);

		if (jsonObject != null) {
			//
			//
			if (jsonObject.getString("subscribe").equals("1")) {
				userInfo.setNickname(jsonObject.getString("nickname"));
				userInfo.setHeadimgurl(jsonObject.getString("headimgurl") == null ? "/images/upload/weixin/defhead.jpg" : jsonObject.getString("headimgurl").replace("/0", "/46"));
				userInfo.setOpenid(jsonObject.getString("openid"));
				userInfo.setSubscribe(jsonObject.getString("subscribe"));
			}
		}
		return userInfo;

	}

	/**
	 * 客服发送消息
	 * 
	 * @param accessToken
	 * @param openid
	 * @param mess
	 * @return
	 */
	public static int sendMess(String accessToken, String openid, String content, String msgtype) {

		String url = customer_mess_url.replace("ACCESS_TOKEN", accessToken).replace("OPENID", openid);
		String attrs = "{\"touser\": \"" + openid + "\", \"msgtype\": \"" + msgtype + "\", \"text\": {\"content\": \"" + content + "\"}}";
		httpRequest(url, "POST", attrs);
		return 0;
	}

	/**
	 * 发送模板消息
	 * 
	 * @param accessToken
	 * @param openid
	 * @param content
	 * @param msgtype
	 * @return
	 */
//	public static int sendTemplateMessage(String accessToken, String content) {
//
//		String url = templateMessage.replace("ACCESS_TOKEN", accessToken);
//
//		httpRequest(url, "POST", content);
//		return 0;
//	}

	/**
	 * 上传到微信服务器
	 * 
	 * @param url
	 * @param filePath
	 * @return
	 * @throws IOException
	 */

	public static String send(String url, String filePath) throws IOException {

		String result = null;

		File file = new File(filePath);
		if (!file.exists() || !file.isFile()) {
			throw new IOException("文件不存在");
		}

		/**
		 * 第一部分
		 */
		URL urlObj = new URL(url);
		// 连接
		HttpURLConnection con = (HttpURLConnection) urlObj.openConnection();

		/**
		 * 设置关键值
		 */
		con.setRequestMethod("POST"); // 以Post方式提交表单，默认get方式
		con.setDoInput(true);
		con.setDoOutput(true);
		con.setUseCaches(false); // post方式不能使用缓存

		// 设置请求头信息
		con.setRequestProperty("Connection", "Keep-Alive");
		con.setRequestProperty("Charset", "UTF-8");

		// 设置边界
		String BOUNDARY = "----------" + System.currentTimeMillis();
		con.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + BOUNDARY);

		// 请求正文信息

		// 第一部分：
		StringBuilder sb = new StringBuilder();
		sb.append("--"); // 必须多两道线
		sb.append(BOUNDARY);
		sb.append("\r\n");
		// 上传头像和上传多媒体主要是下面这句话有却别
		// 头像：
		// sb.append("Content-Disposition: form-data;name=\"media\";filename=\""
		// + file.getName() + "\"\r\n");
		// 多媒体：
		sb.append("Content-Disposition: form-data;name=\"file\";filename=\"" + file.getName() + "\"\r\n");
		sb.append("Content-Type:application/octet-stream\r\n\r\n");

		byte[] head = sb.toString().getBytes("utf-8");

		// 获得输出流
		OutputStream out = new DataOutputStream(con.getOutputStream());
		// 输出表头
		out.write(head);

		// 文件正文部分
		// 把文件已流文件的方式 推入到url中
		DataInputStream in = new DataInputStream(new FileInputStream(file));
		int bytes = 0;
		byte[] bufferOut = new byte[1024];
		while ((bytes = in.read(bufferOut)) != -1) {
			out.write(bufferOut, 0, bytes);
		}
		in.close();

		// 结尾部分
		byte[] foot = ("\r\n--" + BOUNDARY + "--\r\n").getBytes("utf-8");// 定义最后数据分隔线

		out.write(foot);

		out.flush();
		out.close();

		StringBuffer buffer = new StringBuffer();
		BufferedReader reader = null;
		try {
			// 定义BufferedReader输入流来读取URL的响应
			reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String line = null;
			while ((line = reader.readLine()) != null) {
				// System.out.println(line);
				buffer.append(line);
			}
			if (result == null) {
				result = buffer.toString();

				System.out.println("------------------------555555555555555555555------------------" + result);
			}
		} catch (IOException e) {
			System.out.println("发送POST请求出现异常！" + e);
			e.printStackTrace();
			throw new IOException("数据读取异常");
		} finally {
			if (reader != null) {
				reader.close();
			}

		}

		JSONObject jsonObj = JSONObject.fromObject(result);
		String mediaId = jsonObj.getString("media_id");
		System.out.println("上传服务器获得mediaId：" + mediaId);
		return mediaId;
	}

	/**
	 * 上传多客服头像
	 * 
	 * @param url
	 * @param filePath
	 * @throws IOException
	 */
	public static int uploadHeadImg(String url, String filePath) throws IOException {
		String result = null;

		File file = new File(filePath);
		if (!file.exists() || !file.isFile()) {
			throw new IOException("文件不存在");
		}

		/**
		 * 第一部分
		 */
		URL urlObj = new URL(url);
		// 连接
		HttpURLConnection con = (HttpURLConnection) urlObj.openConnection();

		/**
		 * 设置关键值
		 */
		con.setRequestMethod("POST"); // 以Post方式提交表单，默认get方式
		con.setDoInput(true);
		con.setDoOutput(true);
		con.setUseCaches(false); // post方式不能使用缓存

		// 设置请求头信息
		con.setRequestProperty("Connection", "Keep-Alive");
		con.setRequestProperty("Charset", "UTF-8");

		// 设置边界
		String BOUNDARY = "----------" + System.currentTimeMillis();
		con.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + BOUNDARY);

		// 请求正文信息

		// 第一部分：
		StringBuilder sb = new StringBuilder();
		sb.append("--"); // 必须多两道线
		sb.append(BOUNDARY);
		sb.append("\r\n");
		// 上传头像和上传多媒体主要是下面这句话有却别
		// 头像：
		sb.append("Content-Disposition: form-data;name=\"media\";filename=\"" + file.getName() + "\"\r\n");

		sb.append("Content-Type:application/octet-stream\r\n\r\n");

		byte[] head = sb.toString().getBytes("utf-8");

		// 获得输出流
		OutputStream out = new DataOutputStream(con.getOutputStream());
		// 输出表头
		out.write(head);

		// 文件正文部分
		// 把文件已流文件的方式 推入到url中
		DataInputStream in = new DataInputStream(new FileInputStream(file));
		int bytes = 0;
		byte[] bufferOut = new byte[1024];
		while ((bytes = in.read(bufferOut)) != -1) {
			out.write(bufferOut, 0, bytes);
		}
		in.close();

		// 结尾部分
		byte[] foot = ("\r\n--" + BOUNDARY + "--\r\n").getBytes("utf-8");// 定义最后数据分隔线

		out.write(foot);

		out.flush();
		out.close();

		StringBuffer buffer = new StringBuffer();
		BufferedReader reader = null;
		try {
			// 定义BufferedReader输入流来读取URL的响应
			reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String line = null;
			while ((line = reader.readLine()) != null) {
				// System.out.println(line);
				buffer.append(line);
			}
			if (result == null) {
				result = buffer.toString();

			}
		} catch (IOException e) {
			System.out.println("发送POST请求出现异常！" + e);
			e.printStackTrace();
			throw new IOException("数据读取异常");
		} finally {
			if (reader != null) {
				reader.close();
			}

		}

		System.out.println(result + "--------111------------------");

		if (result.indexOf("invalid kf_account") != -1) {

			return -2;
		}
		JSONObject jsonObj = JSONObject.fromObject(result);

		String rr = jsonObj.getString("errcode");

		if (rr.equals("0")) {

			return 0;
		} else {
			return -1;
		}

	}

//	public static JSONObject findArticleList(String accessToken, int offset) {
//
//		String type = "news";
//		String url = NEWS_URL.replace("ACCESS_TOKEN", accessToken);
//		String attrs = "{\"type\": \"" + type + "\", \"offset\": \"" + offset + "\", \"count\": \"" + 8 + "\"}";
//		JSONObject jsonObject = httpRequest(url, "POST", attrs);
//
//		return jsonObject;
//
//	}

//	public static JSONObject findVoiceList(String accessToken, int offset) {
//
//		String type = "voice";
//		String url = NEWS_URL.replace("ACCESS_TOKEN", accessToken);
//		String attrs = "{\"type\": \"" + type + "\", \"offset\": \"" + offset + "\", \"count\": \"" + 8 + "\"}";
//		JSONObject jsonObject = httpRequest(url, "POST", attrs);
//
//		return jsonObject;
//
//	}



	public static String hcPic(File fileOne, File fileTwo, File outFile) {

		String result = null;
		try {
			// 读取第一张图片

			BufferedImage ImageOne = ImageIO.read(fileOne);
			int width = ImageOne.getWidth();// 图片宽度
			int height = ImageOne.getHeight();// 图片高度
			// 从图片中读取RGB
			int[] ImageArrayOne = new int[width * height];
			ImageArrayOne = ImageOne.getRGB(0, 0, width, height, ImageArrayOne, 0, width);
			// 对第二张图片做相同的处理
			if (!fileTwo.exists()) {

				System.out.println(fileTwo + "---------------");
			}
			BufferedImage ImageTwo = ImageIO.read(fileTwo);
			int widthTwo = ImageTwo.getWidth();// 图片宽度
			int heighTwo = ImageTwo.getHeight();// 图片高度
			int[] ImageArrayTwo = new int[widthTwo * heighTwo];
			ImageArrayTwo = ImageTwo.getRGB(0, 0, widthTwo, heighTwo, ImageArrayTwo, 0, widthTwo);

			// 生成新图片
			BufferedImage ImageNew = new BufferedImage(widthTwo, heighTwo, BufferedImage.TYPE_INT_RGB);

			ImageNew.setRGB(0, 0, widthTwo, heighTwo, ImageArrayTwo, 0, widthTwo);// 设置右半部分的RGB
			ImageNew.setRGB(325, 400, width, height, ImageArrayOne, 0, width);// 二维码位置

			// Graphics2D g = ImageNew.createGraphics();
			//
			// g.setFont(new Font("黑体", Font.BOLD, 24));
			// g.setColor(Color.WHITE);
			// g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP, 1f));
			//
			// g.drawString(nikeName, 354, 485 );
			// g.dispose();

			ImageIO.write(ImageNew, "jpg", outFile);

			System.out.println("二维码合成完毕...");
			String accessToken = TokenThread.accessToken.getToken();
			String url = WeixinUtils.UPLOAD_IMAGE_URL.replace("ACCESS_TOKEN", accessToken).replace("TYPE", "image");

			result = WeixinUtils.send(url, outFile.getPath());

			return result;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	/**
	 * emoji表情转换(hex -> utf-16)
	 * 
	 * @param hexEmoji
	 * @return
	 */
	public static String emoji(int hexEmoji) {
		return String.valueOf(Character.toChars(hexEmoji));
	}

	public boolean isMobile(String str) {
		String regExp = "^[1]([3][0-9]{1}|59|58|88|89)[0-9]{8}$";

		Pattern p = Pattern.compile(regExp);

		Matcher m = p.matcher(str);

		return m.find();
	}

}
