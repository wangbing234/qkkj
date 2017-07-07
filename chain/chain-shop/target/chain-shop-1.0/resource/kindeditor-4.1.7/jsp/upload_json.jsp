<%@page import="net.onlineshop.core.listener.CoreParamCache"%>
<%@page import="org.apache.struts2.dispatcher.multipart.MultiPartRequest"%>
<%@page import="net.onlineshop.core.front.SystemManager"%>
<%@page import="com.alibaba.fastjson.JSONObject"%>
<%@page import="org.slf4j.Logger"%>
<%@page import="org.slf4j.LoggerFactory"%>
<%@page import="net.onlineshop.core.util.ImageUtils"%>
<%@page import="net.onlineshop.core.oss.OSSObjectSample"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@page import="net.onlineshop.services.front.systemSetting.bean.SystemSetting"%>
<%@page import="net.onlineshop.core.ManageContainer"%>
<%@ page import="java.util.*,java.io.*" %>
<%@ page import="java.text.SimpleDateFormat" %>
<%@ page import="org.apache.commons.fileupload.*" %>
<%@ page import="org.apache.commons.fileupload.disk.*" %>
<%@ page import="org.apache.commons.fileupload.servlet.*" %>

<%@ page import="java.io.File" %>
<%@ page import="java.io.FileInputStream" %>
<%@ page import="java.io.FileOutputStream" %>
<%@ page import="org.apache.commons.io.IOUtils" %>
<%@ page import="com.alibaba.simpleimage.ImageRender" %>
<%@ page import="com.alibaba.simpleimage.SimpleImageException" %>
<%@ page import="com.alibaba.simpleimage.render.ReadRender" %>
<%@ page import="com.alibaba.simpleimage.render.ScaleParameter" %>
<%@ page import="com.alibaba.simpleimage.render.ScaleRender" %>
<%@ page import="com.alibaba.simpleimage.render.WriteRender" %>
<%

/**
 * KindEditor JSP
 * 
 * 本JSP程序是演示程序，建议不要直接在实际项目中使用。
 * 如果您确定直接使用本程序，使用之前请仔细确认相关安全设置。
 * 
 */
Logger logger = LoggerFactory.getLogger(OSSObjectSample.class);
SystemSetting systemSetting = SystemManager.systemSetting;
//文件保存目录路径
String savePath = CoreParamCache.getInstance().get("productPath") + "attached"+File.separator;
System.out.println(savePath);
//文件保存目录URL
String saveUrl  = systemSetting.getImageRootPath() +"/attached/";

//定义允许上传的文件扩展名
HashMap<String, String> extMap = new HashMap<String, String>();
extMap.put("image", "gif,jpg,jpeg,png,bmp");
extMap.put("flash", "swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb");
extMap.put("media", "swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb");
extMap.put("file", "doc,docx,xls,xlsx,ppt,htm,html,txt,zip,rar,gz,bz2");

//最大文件大小
long maxSize = 1000000;

session.setAttribute("ajax_upload", 1);
response.setContentType("text/html; charset=UTF-8");
if(!ServletFileUpload.isMultipartContent(request)){
	out.println(getError("请选择文件。"));
	return;
}
//检查目录
File uploadDir = new File(savePath);
if(!uploadDir.exists())
{
	uploadDir.mkdir();
}
if(!uploadDir.isDirectory()){
	out.println(getError("上传目录不存在。"));
	return;
}
//检查目录写权限
if(!uploadDir.canWrite()){
	out.println(getError("上传目录没有写权限。"));
	return;
}

String dirName = request.getParameter("dir");
if (dirName == null) {
	dirName = "image";
}
if(!extMap.containsKey(dirName)){
	out.println(getError("目录名不正确。"));
	return;
}
//创建文件夹
savePath += dirName + File.separator;
saveUrl += dirName +"/";
File saveDirFile = new File(savePath);
if (!saveDirFile.exists()) {
	saveDirFile.mkdirs();
}
SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
String ymd = sdf.format(new Date());
savePath += ymd + File.separator;
saveUrl += ymd +"/";
File dirFile = new File(savePath);
if (!dirFile.exists()) {
	dirFile.mkdirs();
}

FileItemFactory factory = new DiskFileItemFactory();
ServletFileUpload upload = new ServletFileUpload(factory);
upload.setHeaderEncoding("UTF-8");

//request = (HttpServletRequest)pageContext.getRequest();

List items = upload.parseRequest(request);
//session.setAttribute("ajax_upload", null);
Iterator itr = items.iterator();
while (itr.hasNext()) {
	FileItem item = (FileItem) itr.next();
	String fileName = item.getName();
	long fileSize = item.getSize();
	if (!item.isFormField()) {
		//检查文件大小
		if(item.getSize() > maxSize){
			out.println(getError("上传文件大小超过限制。"));
			return;
		}
		//检查扩展名
		String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
		String fileNameNotExt = fileName.substring(0,fileName.lastIndexOf("."));
		if(!Arrays.<String>asList(extMap.get(dirName).split(",")).contains(fileExt)){
			out.println(getError("上传文件扩展名是不允许的扩展名。\n只允许" + extMap.get(dirName) + "格式。"));
			return;
		}

		SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
		String newFileName1 = null;//小图
		String newFileName2 = null;//中图
		String newFileName3 = null;//大图 ，也是原图
		synchronized(OSSObjectSample.lock) {
			String newFileName0 = fileNameNotExt;
			logger.error("newFileName0="+newFileName0);
			newFileName1 = newFileName0 + "_1";
			newFileName2 = newFileName0 + "_2";
			newFileName3 = newFileName0 + "_3." + fileExt;
		}
		logger.info("newFileName1="+newFileName1+",newFileName2="+newFileName2+",newFileName3="+newFileName3);
//		String newFileName = df.format(new Date()) + "_" + new Random().nextInt(1000) + "." + fileExt;
		String rootPath = "attached"+File.separator+dirName+File.separator+ df.format(new Date()) +File.separator;//云存储目录前缀
		//String newFileName1_filePath = rootPath + newFileName1;
		//String newFileName2_filePath = rootPath + newFileName2;
		//String newFileName3_filePath = rootPath + newFileName3;
		
		File uploadedFile3 = new File(savePath, newFileName3);
		try{
		
		uploadedFile3.setWritable(true,false);
			item.write(uploadedFile3);
	
			File uploadedFile1 = new File(savePath, newFileName1+"."+fileExt);
			File uploadedFile2 = new File(savePath, newFileName2+"."+fileExt);
			
					// 目的图片
		ScaleParameter scaleParam = new ScaleParameter(160, 160);
		
		FileInputStream inStream = null;
		FileOutputStream outStream = null;
		WriteRender wr = null;
		try {
			inStream = new FileInputStream(uploadedFile3);
			outStream = new FileOutputStream(uploadedFile1);
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
			
			
								// 目的图片
		ScaleParameter scaleParam1 = new ScaleParameter(400, 400);
		// 将图像缩略到1024x1024以内，不足1024x1024则不做任何处理
		FileInputStream inStream1 = null;
		FileOutputStream outStream1 = null;
		WriteRender wr1 = null;
		try {
			inStream1 = new FileInputStream(uploadedFile3);
			outStream1 = new FileOutputStream(uploadedFile2);
			ImageRender rr1 = new ReadRender(inStream1);
			ImageRender sr1 = new ScaleRender(rr1, scaleParam1);
			wr1 = new WriteRender(sr1, outStream1);
			wr1.render();
			// 触发图像处理
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			IOUtils.closeQuietly(inStream1);
			// 图片文件输入输出流必须记得关闭
			IOUtils.closeQuietly(outStream1);
			if (wr1 != null) {
				try {
					wr1.dispose();
					// 释放simpleImage的内部资源
				} catch (SimpleImageException ignore) {
					// skip ...
				}
			}
		}
		}catch(Exception e){
			e.printStackTrace();
			logger.error("上传文件异常："+e.getMessage());
			out.println(getError("上传文件失败。"));
			return;
		}
		out.println("{\"error\":0,\"url\":\""+saveUrl+newFileName3+"\"}");
	}
}
%>
<%!
private String getError(String message) {

	return "{\"error\":1,\"message\":\""+message+"\"}";
}
%>