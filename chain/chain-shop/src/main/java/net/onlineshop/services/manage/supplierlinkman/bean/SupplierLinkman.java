/*
 * Powered By [rapid-framework]
 * Web Site: http://blog.csdn.net/houfeng30920/article/details/52730893
 * Csdn Code: 
 * Since 2015 - 2017
 */

package net.onlineshop.services.manage.supplierlinkman.bean;

import java.io.Serializable;

import net.onlineshop.core.dao.page.PagerModel;

public class SupplierLinkman  extends PagerModel implements Serializable {
	
		private static final long serialVersionUID = 1L;
	    /**  
	     *   
	     */ 
	    private String supId;  
	    /**  
	     *   
	     */ 
	    private String name;  
	    /**  
	     *   
	     */ 
	    private String tel;  
	    /**  
	     *   
	     */ 
	    private String phone;  
	    /**  
	     *   
	     */ 
	    private String qq;  
	    /**  
	     *   
	     */ 
	    private String address;  
	    /**  
	     *   
	     */ 
	    private Integer isMain;  
	    /**  
	     *   
	     */ 
	    private Integer isDelete;  
 
	    public void setSupId(String supId) {  
	        this.supId = supId;  
	    }  
	      
	    public String getSupId() {  
	        return this.supId;  
	    }  
	    public void setName(String name) {  
	        this.name = name;  
	    }  
	      
	    public String getName() {  
	        return this.name;  
	    }  
	    public void setTel(String tel) {  
	        this.tel = tel;  
	    }  
	      
	    public String getTel() {  
	        return this.tel;  
	    }  
	    public void setPhone(String phone) {  
	        this.phone = phone;  
	    }  
	      
	    public String getPhone() {  
	        return this.phone;  
	    }  
	    public void setQQ(String qq) {  
	        this.qq = qq;  
	    }  
	      
	    public String getQQ() {  
	        return this.qq;  
	    }  
	    public void setAddress(String address) {  
	        this.address = address;  
	    }  
	      
	    public String getAddress() {  
	        return this.address;  
	    }  
	    public void setIsMain(Integer isMain) {  
	        this.isMain = isMain;  
	    }  
	      
	    public Integer getIsMain() {  
	        return this.isMain;  
	    }

		public Integer getIsDelete() {
			return isDelete;
		}

		public void setIsDelete(Integer isDelete) {
			this.isDelete = isDelete;
		}  
	    
		 public void clear() {
			  /**  
			     *   
			     */ 
			   supId=null;
			    /**  
			     *   
			     */ 
			   name=null;
			    /**  
			     *   
			     */ 
			   tel=null;
			    /**  
			     *   
			     */ 
			   phone=null;
			    /**  
			     *   
			     */ 
			   qq=null;
			    /**  
			     *   
			     */ 
			   address=null;
			    /**  
			     *   
			     */ 
			    isMain=null;
			    /**  
			     *   
			     */ 
			 isDelete=null;
		}
 
}