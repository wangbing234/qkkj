package net.onlineshop.services.common;import java.io.Serializable;import net.onlineshop.core.dao.page.PagerModel;public class CommentType extends PagerModel implements Serializable {	private static final long serialVersionUID = 1L;	private String id;	private String name;	private String code;	private String status;	public static final String commentType_status_y = "y";// 启用	public void clear() {		super.clear();		id = null;		name = null;		code = null;		status = null;	}	public String getId() {		return id;	}	public void setId(String id) {		this.id = id;	}	public String getName() {		return name;	}	public void setName(String name) {		this.name = name;	}	public String getCode() {		return code;	}	public void setCode(String code) {		this.code = code;	}	public String getStatus() {		return status;	}	public void setStatus(String status) {		this.status = status;	}}