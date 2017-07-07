/*
 * Powered By [rapid-framework]
 * Web Site: http://blog.csdn.net/houfeng30920/article/details/52730893
 * Csdn Code: 
 * Since 2015 - 2017
 */

package net.onlineshop.services.front.account.bean;

import java.io.Serializable;

/**
 * 消费积分系统
 * @author bing.wang
 *
 */
public class MebPoint  implements Serializable{  
	    
		private static final long serialVersionUID = 1L;
		/**  
	     *   
	     */ 
	    private Integer mebId;  
	    /**  
	     *   
	     */ 
	    private Float pointFree;  
	    /**  
	     *   
	     */ 
	    private Float point2Free;  
 
	    public void setMeb_id(Integer mebId) {  
	        this.mebId = mebId;  
	    }  
	      
	    public Integer getMeb_id() {  
	        return this.mebId;  
	    }  
	    public void setPoint_free(Float pointFree) {  
	        this.pointFree = pointFree;  
	    }  
	      
	    public Float getPoint_free() {  
	        return this.pointFree;  
	    }

	    public void setPoint2_free(Float point2Free) {  
	        this.point2Free = point2Free;  
	    }  
	      
	    public Float getPoint2_free() {  
	        return this.point2Free;  
	    }  
	    
	    
 
}