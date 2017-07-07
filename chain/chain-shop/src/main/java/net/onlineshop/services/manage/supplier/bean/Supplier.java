/*
 * Powered By [rapid-framework]
 * Web Site: http://blog.csdn.net/houfeng30920/article/details/52730893
 * Csdn Code: 
 * Since 2015 - 2017
 */

package net.onlineshop.services.manage.supplier.bean;

import java.io.Serializable;
import java.util.List;

import net.onlineshop.core.dao.page.PagerModel;
import net.onlineshop.services.manage.supplierlinkman.bean.SupplierLinkman;

public class Supplier extends SupplierLinkman implements Serializable {
	private static final long serialVersionUID = 1L;
	    /**  
	     *   
	     */ 
	    private String code;  
	    /**  
	     *   
	     */ 
	    private String name;  
	    
	    private String mName;
	    /**  
	     *   
	     */ 
	    private String type;  
	    /**  
	     *   
	     */ 
	    private String status;  //y: 使用，n停用
	    /**  
	     *   
	     */ 
	    private String remark;  
	    /**  
	     *   
	     */ 
	    private String catalogIds;
	    
	    private String createtime;// 录入时间
	    
	    private String updatetime;
	    
	    private List<SupplierLinkman> children;
	    
	    public void clear() {
	    	super.clear();
		     code=null; 
		   	 name=null; 
		   	 type=null; 
		   	mName=null;
		   	 status=null; 
		   	 remark=null; 
		   	 catalogIds=null; 
		   	 createtime=null; 
		   	 updatetime=null; 
		   	 children=null; 
		}
	    
	    
 
	    public String getmName() {
			return mName;
		}



		public void setmName(String mName) {
			this.mName = mName;
		}



		public void setCode(String code) {  
	        this.code = code;  
	    }  
	      
	    public String getCode() {  
	        return this.code;  
	    }  
	    public void setName(String name) {  
	        this.name = name;  
	    }  
	      
	    public String getName() {  
	        return this.name;  
	    }  
	    public void setType(String type) {  
	        this.type = type;  
	    }  
	      
	    public String getType() {  
	        return this.type;  
	    }  
	    public void setStatus(String status) {  
	        this.status = status;  
	    }  
	      
	    public String getStatus() {  
	        return this.status;  
	    }  
	    public void setRemark(String remark) {  
	        this.remark = remark;  
	    }  
	      
	    public String getRemark() {  
	        return this.remark;  
	    }

		public String getCatalogIds() {
			return catalogIds;
		}

		public void setCatalogIds(String catalogIds) {
			this.catalogIds = catalogIds;
		}

		public String getCreatetime() {
			return createtime;
		}

		public void setCreatetime(String createtime) {
			this.createtime = createtime;
		}

		public String getUpdatetime() {
			return updatetime;
		}

		public void setUpdatetime(String updatetime) {
			this.updatetime = updatetime;
		}

		public List<SupplierLinkman> getChildren() {
			return children;
		}

		public void setChildren(List<SupplierLinkman> children) {
			this.children = children;
		}  
	  
	    
	    
 
}