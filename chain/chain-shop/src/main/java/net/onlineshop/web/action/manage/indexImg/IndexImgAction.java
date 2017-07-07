/**
 * 2012-7-8
 * 
 */
package net.onlineshop.web.action.manage.indexImg;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;

import net.onlineshop.core.BaseAction;
import net.onlineshop.services.manage.indexImg.IndexImgService;
import net.onlineshop.services.manage.indexImg.bean.IndexImg;

import org.apache.commons.io.FileUtils;
import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.ActionContext;

/**
 * 滚动图片,九宫格
 * 
 * 
 * 
 */
public class IndexImgAction extends BaseAction<IndexImg> {
	private static final long serialVersionUID = 1L;
	private IndexImgService indexImgService;

	public void setIndexImgService(IndexImgService indexImgService) {
		this.indexImgService = indexImgService;
	}

	private File image;

	public File getImage() {
		return image;
	}

	public void setImage(File image) {
		this.image = image;
	}

	@Override
	public IndexImg getE() {
		return this.e;
	}

	@Override
	public void prepare() throws Exception {
		if (this.e == null) {
			this.e = new IndexImg();
		}
	}

	/**
	 * 跳转到编辑页面
	 * 
	 * @return
	 * @throws Exception
	 */
	@Override
	public String toEdit() throws Exception {
		e = getServer().selectOne(getE());
		this.getRequest().setAttribute("type", e.getType());
		return toEdit;
	}

	@Override
	public String toAdd() throws Exception {

		this.getRequest().setAttribute("type", e.getType());
		e.clear();
		return toAdd;
	}

	@Override
	public void insertAfter(IndexImg e) {
		e.clear();
	}

	@Override
	public String selectList() throws Exception {
		if (e.getType() == 0 || e.getType() == 2) {
			this.getRequest().setAttribute("list", getServer().selectList(getE()));
		}

		return toList;
	}

	@Override
	protected void selectListAfter() {
		pager.setPagerUrl("/manage/indexImg!selectList.action");
	}

	@Override
	public String insert() throws Exception {
		// uploadImage();
		getServer().insert(getE());

		String url = "/manage/indexImg!selectList.action?e.type=" + e.getType();
		insertAfter(getE());

		this.getResponse().sendRedirect(url);
		return null;
	}

	/**
	 * 首页楼层设置
	 * 
	 * @return
	 */
	public String floorInit() {

		IndexImg floor1 = new IndexImg();
		floor1.setType(1);

		List list1 = indexImgService.selectList(floor1);

		IndexImg floor2 = new IndexImg();
		floor2.setType(3);

		List list2 = indexImgService.selectList(floor2);

		IndexImg floor3 = new IndexImg();
		floor3.setType(4);

		List list3 = indexImgService.selectList(floor3);

		this.getRequest().setAttribute("list1", list1);
		this.getRequest().setAttribute("list2", list2);
		this.getRequest().setAttribute("list3", list3);

		return "floor";
	}

	public String floorView() throws IOException {

		String type = this.getRequest().getParameter("type");
		String order1 = this.getRequest().getParameter("seq");
		IndexImg floor = new IndexImg();
		floor.setType(Integer.parseInt(type));
		floor.setOrder1(Integer.parseInt(order1));
		List list1 = indexImgService.selectList(floor);
		if (list1 != null && list1.size() > 0) {
			this.getRequest().setAttribute("e", list1.get(0));

		} else {

			e.setType(Integer.parseInt(type));
			e.setOrder1(Integer.parseInt(order1));
			e.setTitle("标题");
			e.setPicture("");
			Integer a = indexImgService.insert(e);
			e.setId(a.toString());

		}

		return "floorView";
	}

	public String floorUpdate() throws IOException, ServletException {
		indexImgService.update(getE());
		forward("/manage/indexImg!floorInit.action");  
		return null;
	}

	@Override
	public String update() throws Exception {
		getServer().update(getE());
		String url = "/manage/indexImg!selectList.action?e.type=" + e.getType();
		insertAfter(getE());
		forward(url);  
		return null;
	}

	// 上传文件
	@Deprecated
	private void uploadImage() throws IOException {
		if (image == null) {
			return;
		}
		String imageName = String.valueOf(System.currentTimeMillis()) + ".jpg";
		String realpath = ServletActionContext.getServletContext().getRealPath("/indexImg/");
		// D:\apache-tomcat-6.0.18\webapps\struts2_upload\images
		System.out.println("realpath: " + realpath);
		if (image != null) {
			File savefile = new File(new File(realpath), imageName);
			if (!savefile.getParentFile().exists())
				savefile.getParentFile().mkdirs();
			FileUtils.copyFile(image, savefile);
			ActionContext.getContext().put("message", "文件上传成功");
		}
		// SystemInfo sInfo = SystemSingle.getInstance().getSystemInfo();
		// String url = sInfo.getWww_ip() + "/file/img/" + imageName;
		String url = "/indexImg/" + imageName;
		e.setPicture(url);
		image = null;
	}

	public String deletes() throws Exception {

		getServer().deletes(getIds());
		return selectList();
	}

	/**
	 * 同步缓存
	 * 
	 * @return
	 * @throws Exception
	 */
	public String syncCache() throws Exception {
		// SystemSingle.getInstance().sync(Container.imgList);
		return super.selectList();
	}

}
