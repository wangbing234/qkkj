package net.onlineshop.web.action.front.product;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.Action;

/**
 * <此Action类用户对创意文件进行下载处理>
 * 
 * @author WUKEZHOU
 * @since 2012-06-06
 *
 * 
 */

public class FileDownloadAction implements Action {

	private static Log logger = LogFactory.getLog(FileDownloadAction.class);
	/**
	 * 初始的通过Param指定的文件名属性
	 */
	private String fileName;

	private String newfilename;

	public String getNewfilename() {
		return newfilename;
	}

	public void setNewfilename(String newfilename) {
		this.newfilename = newfilename;
	}

	/**
	 * 通过 ServletContext，也就是application 来读取数据
	 * 
	 * @return InputStream
	 * @throws Exception
	 */
	public InputStream getInputStream() throws Exception {
		fileName = this.getDownloadFileName();

		String realPath = ServletActionContext.getServletContext().getRealPath(fileName);

		File file = new File(realPath);
		InputStream is = new FileInputStream(file);

		return is;
	}

	/**
	 * 得到下载的文件名，对文件名进行编码转换，防止下载文件名编码不支持，导致乱码，而无法下载
	 * 
	 * @return String
	 * @throws Exception
	 */
	public String getDownloadFileName() throws Exception {

		String realname = ServletActionContext.getRequest().getParameter("realName");
		String downFileName = fileName;
		try {
			downFileName = new String(downFileName.getBytes(), "ISO8859-1");

		} catch (Exception ex) {
			logger.info("下载出错了");
			throw new Exception(ex);
		}
		if (downFileName.lastIndexOf("/") != -1) {
			newfilename = downFileName.substring(downFileName.lastIndexOf("/") + 1);
		} else if (downFileName.lastIndexOf("\\") != -1) {
			newfilename = downFileName.substring(downFileName.lastIndexOf("\\") + 1);
		} else {

			newfilename = downFileName;
		}
		// 获得文件后缀名称
		int position = fileName.lastIndexOf(".");
		String extension = fileName.substring(position);

		// 获得文件后缀名称
		int position1 = realname.lastIndexOf(".");
		String extension1 = "";
		if (position1 != -1) {
			extension1 = realname.substring(position1);
		}

		if (extension.equals(extension1)) {
			newfilename = realname;

			newfilename = new String(realname.getBytes(), "ISO8859-1");
		} else {
			realname = realname + extension;
			newfilename = new String(realname.getBytes(), "ISO8859-1");

		}
		System.out.println(fileName + ":2");
		return downFileName;
	}

	/**
	 * 用于执行下载Action跳转，里面没有任何业务，逻辑代码。
	 */
	public String execute() {
		String fileName = ServletActionContext.getRequest().getParameter("fileName");

		System.out.println(fileName + ":3");
		String realPath = ServletActionContext.getServletContext().getRealPath(fileName);
		File file = new File(realPath);
		if (!file.exists()) {
			logger.info("下载出错了");
			System.out.println("文件不存在或已被删除1");

			return "fail";

		}

		return SUCCESS;
	}

	// setter and getter method
	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

}
