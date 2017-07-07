package net.onlineshop.web.action.manage.system;

import java.io.File;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Random;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.struts2.ServletActionContext;

import net.onlineshop.core.BaseAction;
import net.onlineshop.core.NameComparator;
import net.onlineshop.core.SizeComparator;
import net.onlineshop.core.TypeComparator;
import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.core.front.SystemManager;
import net.onlineshop.core.oscache.FrontCache;
import net.onlineshop.core.oscache.ManageCache;
import net.onlineshop.core.oss.OSSFileManagerJson;
import net.onlineshop.services.common.SystemSetting;
import net.sf.json.JSONObject;

/**
 * 控制中心
 * 
 * @author WUKEZHOU
 *
 */

public class ControlAction extends BaseAction {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private File imgFile;

	private String imgFileFileName;

	private ManageCache manageCache;
	private FrontCache frontCache;

	public String top() {
		return "top";

	}

	public String area() {
		return "area";

	}

	public String menu() {
		return "menu";
	}

	public String cache() {
		return "cache";
	}

	public String left() {

		return "left";

	}

	public String right() {
		return "right";

	}

	@Override
	public void prepare() throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public PagerModel getE() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void insertAfter(PagerModel e) {
		// TODO Auto-generated method stub

	}

	@Override
	protected void selectListAfter() {
		// TODO Auto-generated method stub

	}

//	public String uploadFile() throws Exception {
//		// 定义允许上传的文件扩展名
//		HashMap<String, String> extMap = new HashMap<String, String>();
//		extMap.put("image", "gif,jpg,jpeg,png,bmp");
//		extMap.put("flash", "swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb");
//		extMap.put("media", "swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb");
//		extMap.put("file", "doc,docx,xls,xlsx,ppt,htm,html,txt,zip,rar,gz,bz2");
//
//		HttpServletResponse response = ServletActionContext.getResponse();
//		response.setCharacterEncoding("utf-8"); // 务必，防止返回文件名是乱码
//		// 检查扩展名
//		String fileExt = imgFileFileName.substring(imgFileFileName.lastIndexOf(".") + 1).toLowerCase();
//
//		String newFileName1 = null;// 小图
//		String newFileName2 = null;// 中图
//		String newFileName3 = null;// 大图
//		String newFileName0 = String.valueOf(System.currentTimeMillis());
//		// 相对路径
//
//		String savePath = "/attached/image/" + new SimpleDateFormat("yyyyMMdd").format(new Date()) + "/";
//
//		String realPath = ServletActionContext.getServletContext().getRealPath(savePath);
//		newFileName3 = newFileName0 + "_3." + fileExt;
//		// 建立一个目标文件
//		File target = new File(realPath, newFileName3);
//
//		// 将临时文件复制到目标文件
//		FileUtils.copyFile(imgFile, target);
//
//		newFileName1 = newFileName0 + "_1";
//		newFileName2 = newFileName0 + "_2";
//
//		File uploadedFile1 = new File(realPath, newFileName1 + "." + fileExt);
//		File uploadedFile2 = new File(realPath, newFileName2 + "." + fileExt);
//
////		ImageUtils.ratioZoom2(target, uploadedFile1, Double.valueOf(SystemManager.getInstance().getProperty("product_image_1_w")));
////		ImageUtils.ratioZoom2(target, uploadedFile2, Double.valueOf(SystemManager.getInstance().getProperty("product_image_2_w")));
//
//		JSONObject obj = new JSONObject();
//		obj.put("error", 0);
//		obj.put("url", savePath + newFileName3);
//
//		ServletActionContext.getResponse().getWriter().print(obj.toString());
//		return null;
//	}

	public String fileManage() throws IOException {
		HttpServletRequest request = this.getRequest();
		HttpServletResponse response = this.getResponse();
		response.setCharacterEncoding("utf-8"); // 务必，防止返回文件名是乱码
		boolean oss = SystemManager.isOSS;
		if (oss) {

			OSSFileManagerJson ossManager = new OSSFileManagerJson();
			String json = ossManager.write(request, response);
			response.setContentType("application/json; charset=UTF-8");
			System.out.println("json=" + json);
			getResponse().getWriter().write(json);

			return null;
		} else {

			SystemSetting systemSetting = SystemManager.systemSetting;
			// 根目录路径，可以指定绝对路径，比如 /var/www/attached/
			String rootPath = ServletActionContext.getServletContext().getRealPath("/") + "attached/";

			// String rootPath = "D:\\workspace\\myshop\\web\\attached\\";//pageContext.getServletContext().getRealPath("/") + "attached/";
			// 根目录URL，可以指定绝对路径，比如 http://www.yoursite.com/attached/
			String rootUrl = systemSetting.getImageRootPath() + "/attached/";// request.getContextPath() + "/attached/";
			// 图片扩展名
			String[] fileTypes = new String[] { "gif", "jpg", "jpeg", "png", "bmp" };

			String dirName = request.getParameter("dir");
			if (dirName != null) {
				if (!Arrays.<String>asList(new String[] { "image", "flash", "media", "file" }).contains(dirName)) {

					getResponse().getWriter().write("Invalid Directory name.");
					return null;
				}
				rootPath += dirName + "/";
				rootUrl += dirName + "/";
				File saveDirFile = new File(rootPath);
				if (!saveDirFile.exists()) {
					saveDirFile.mkdirs();
				}
			}
			// 根据path参数，设置各路径和URL
			String path = request.getParameter("path") != null ? request.getParameter("path") : "";
			String currentPath = rootPath + path;
			String currentUrl = rootUrl + path;
			String currentDirPath = path;
			String moveupDirPath = "";
			if (!"".equals(path)) {
				String str = currentDirPath.substring(0, currentDirPath.length() - 1);
				moveupDirPath = str.lastIndexOf("/") >= 0 ? str.substring(0, str.lastIndexOf("/") + 1) : "";
			}

			// 排序形式，name or size or type
			String order = request.getParameter("order") != null ? request.getParameter("order").toLowerCase() : "name";

			// 不允许使用..移动到上一级目录
			if (path.indexOf("..") >= 0) {

				getResponse().getWriter().write("Access is not allowed.");
				return null;
			}
			// 最后一个字符不是/
			if (!"".equals(path) && !path.endsWith("/")) {

				getResponse().getWriter().write("Parameter is not valid.");
				return null;
			}
			// 目录不存在或不是目录
			File currentPathFile = new File(currentPath);
			if (!currentPathFile.isDirectory()) {

				getResponse().getWriter().write("Directory does not exist.");
				return null;
			}

			// 遍历目录取的文件信息
			List<Hashtable> fileList = new ArrayList<Hashtable>();
			Map<String, String> addFileMap = new HashMap<String, String>();

			if (currentPathFile.listFiles() != null) {
				for (File file : currentPathFile.listFiles()) {
					Hashtable<String, Object> hash = new Hashtable<String, Object>();
					String fileName = file.getName();
					if (file.isDirectory()) {
						hash.put("is_dir", true);
						hash.put("has_file", (file.listFiles() != null));
						hash.put("filesize", 0L);
						hash.put("is_photo", false);
						hash.put("filetype", "");
					} else if (file.isFile()) {
						String fileExt = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

						String _fileName = fileName.substring(0, fileName.lastIndexOf("."));
						String fileNameA = _fileName.split("_")[1];
						// System.out.println("fileNameA="+fileNameA);

						if (fileNameA.equals("1") || fileNameA.equals("2")) {
							// if(addFileMap.get(fileNameA)!=null){
							continue;
						}
						// addFileMap.put(fileNameA, fileNameA);

						hash.put("is_dir", false);
						hash.put("has_file", false);
						hash.put("filesize", file.length());
						hash.put("is_photo", Arrays.<String>asList(fileTypes).contains(fileExt));
						hash.put("filetype", fileExt);
					}
					hash.put("filename", fileName);
					hash.put("datetime", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(file.lastModified()));
					fileList.add(hash);
				}
			}

			if ("size".equals(order)) {
				Collections.sort(fileList, new SizeComparator());
			} else if ("type".equals(order)) {
				Collections.sort(fileList, new TypeComparator());
			} else {
				Collections.sort(fileList, new NameComparator());
			}
			JSONObject result = new JSONObject();
			result.put("moveup_dir_path", moveupDirPath);
			result.put("current_dir_path", currentDirPath);
			result.put("current_url", currentUrl);
			result.put("total_count", fileList.size());
			result.put("file_list", fileList);

			response.setContentType("application/json; charset=UTF-8");

			getResponse().getWriter().write(result.toString());
			return null;
		}

	}

	public File getImgFile() {
		return imgFile;
	}

	public void setImgFile(File imgFile) {
		this.imgFile = imgFile;
	}

	public String getImgFileFileName() {
		return imgFileFileName;
	}

	public void setImgFileFileName(String imgFileFileName) {
		this.imgFileFileName = imgFileFileName;
	}

	// 为上传文件自动分配文件名称，避免重复
	private String generateFileName(String fileName) {
		// 获得当前时间
		DateFormat format = new SimpleDateFormat("yyMMddHHmmss");
		// 转换为字符串
		String formatDate = format.format(new Date());
		// 随机生成文件编号
		int random = new Random().nextInt(10000);
		// 获得文件后缀名称
		int position = fileName.lastIndexOf(".");
		String extension = fileName.substring(position);
		// 组成一个新的文件名称
		return formatDate + random + extension;
	}

	public String manageCacheAll() throws Exception {
		manageCache.loadAllCache();
		getResponse().getWriter().write("success");
		return null;
	}

	public String frontCache() throws Exception {
		String method = getRequest().getParameter("method");

		try {
			if (StringUtils.isBlank(method)) {
				frontCache.loadAllCache();
				getResponse().getWriter().write("success");

			} else if (method.equals("activity")) {

				frontCache.loadActivityMap();
				frontCache.loadActivityProductList();
				frontCache.loadActivityScoreProductList();
				frontCache.loadActivityTuanProductList();
				getResponse().getWriter().write("success");
			} else if (method.equals("loadIndexImgs")) {

				frontCache.loadIndexImgs();
				getResponse().getWriter().write("success");
			} else if (method.equals("loadindexNineImgs")) {

				frontCache.loadindexNineImgs();
				getResponse().getWriter().write("success");
			} else if (method.equals("loadAdvertList")) {

				frontCache.loadAdvertList();
				getResponse().getWriter().write("success");
			} else if (method.equals("loadNotifyTemplate")) {

				frontCache.loadNotifyTemplate();
				getResponse().getWriter().write("success");
			} else if (method.equals("loadProductStock")) {

				// frontCache.loadProductStock();
				getResponse().getWriter().write("success");
			} else if (method.equals("hotquery")) {

				frontCache.loadHotquery();
				getResponse().getWriter().write("success");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

	public void setManageCache(ManageCache manageCache) {
		this.manageCache = manageCache;
	}

	public void setFrontCache(FrontCache frontCache) {
		this.frontCache = frontCache;
	}

}
