package net.onlineshop.web.action.front.fileUpload;

import java.io.File;
import java.nio.file.Files;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.servlet.http.HttpServletResponse;

import net.onlineshop.core.BaseAction;
import net.onlineshop.services.front.account.bean.Account;
import net.sf.json.JSONObject;

import org.apache.commons.io.FileUtils;
import org.apache.struts2.ServletActionContext;

public class FilesUploadAction extends BaseAction<Account> {
	private String name;

	private File file;
	private File imgFile;
	private String imgFileFileName;
	private String fileFileName;

	public String getFileFileName() {
		return fileFileName;
	}

	public void setFileFileName(String fileFileName) {
		this.fileFileName = fileFileName;
	}

	/**
	 * 操作权限
	 * 
	 * 默认0：操作删除，1只下载
	 */
	private int act;

	// 名称
	private String[] names;
	// 说明
	private String[] notes;

	// ID
	private Integer[] pids;
	private String msg;

	public String getMsg() {
		return msg;
	}

	public void setMsg(String msg) {
		this.msg = msg;
	}

	// 描述
	private String[] descriptions;
	private Files files;

	public Files getFiles() {
		return files;
	}

	public void setFiles(Files files) {
		this.files = files;
	}

	public List<Files> getFilesList() {
		return filesList;
	}

	public void setFilesList(List<Files> filesList) {
		this.filesList = filesList;
	}

	private String writeHtml;
	private String callback; // 回调函数
	private List<Files> filesList;

	// 为上传文件自动分配文件名称，避免重复
	public String generateFileName(String fileName) {
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

	public String uploadFiles() throws Exception {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8"); // 务必，防止返回文件名是乱码
		// 保存新的文件名
		String newFileName = "";
		// 相对路径
		String savePath = "/upload/plant/" + new SimpleDateFormat("yyyy-MM").format(new Date()) + "/" + new SimpleDateFormat("dd").format(new Date()) + "/";
		String realPath = ServletActionContext.getServletContext().getRealPath(savePath);
		newFileName = generateFileName(name);
		// 建立一个目标文件
		File target = new File(realPath, newFileName);
		// 将临时文件复制到目标文件
		FileUtils.copyFile(file, target);
		JSONObject obj = new JSONObject();
		obj.put("error", 0);
		obj.put("url", savePath + newFileName);
		this.write(obj.toString());
		return null;
	}

	public String uploadFile() throws Exception {

		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("utf-8"); // 务必，防止返回文件名是乱码

		// 保存新的文件名
		String newFileName = "";

		// 相对路径

		String savePath = "/upload/plant/" + new SimpleDateFormat("yyyy-MM").format(new Date()) + "/" + new SimpleDateFormat("dd").format(new Date()) + "/";
		String realPath = ServletActionContext.getServletContext().getRealPath(savePath);
		newFileName = generateFileName(imgFileFileName);
		// 建立一个目标文件
		File target = new File(realPath, newFileName);
		// 将临时文件复制到目标文件
		FileUtils.copyFile(imgFile, target);

		JSONObject obj = new JSONObject();
		obj.put("error", 0);
		obj.put("url", savePath + newFileName);

		ServletActionContext.getResponse().getWriter().print(obj.toString());
		return null;
	}

	/**
	 * 上传后跳到添加信息页面
	 * 
	 * @return
	 */
	public String modifyfiles() {

		return "modifylist";
	}

	public String toupload() {

		return "toupload";
	}

	public String[] getNames() {
		return names;
	}

	public void setNames(String[] names) {
		this.names = names;
	}

	public String[] getNotes() {
		return notes;
	}

	public void setNotes(String[] notes) {
		this.notes = notes;
	}

	public Integer[] getPids() {
		return pids;
	}

	public void setPids(Integer[] pids) {
		this.pids = pids;
	}

	public String[] getDescriptions() {
		return descriptions;
	}

	public void setDescriptions(String[] descriptions) {
		this.descriptions = descriptions;
	}

	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getAct() {
		return act;
	}

	public void setAct(int act) {
		this.act = act;
	}

	public String getWriteHtml() {
		return writeHtml;
	}

	public void setWriteHtml(String writeHtml) {
		this.writeHtml = writeHtml;
	}

	public String getCallback() {
		return callback;
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

	public void setCallback(String callback) {
		this.callback = callback;
	}

	@Override
	public void prepare() throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public Account getE() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void insertAfter(Account e) {
		// TODO Auto-generated method stub

	}

	@Override
	protected void selectListAfter() {
		// TODO Auto-generated method stub

	}

}
