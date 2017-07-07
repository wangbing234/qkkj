/*
 * Powered By [rapid-framework]
 * Web Site: http://blog.csdn.net/houfeng30920/article/details/52730893
 * Csdn Code: 
 * Since 2015 - 2017
 */

package net.onlineshop.services.front.account.bean;

import java.io.Serializable;

/**
 * 消费钱包
 * @author bing.wang
 *
 */
public class MebWallet  implements Serializable{
	   
		private static final long serialVersionUID = 1L;

		/**  
	     *   
	     */ 
	    private Integer mebId;  
	    
	    /**  
	     *   
	     */ 
	    private Float shopFree;  
	    
 
	    public void setMeb_id(Integer mebId) {  
	        this.mebId = mebId;  
	    }  
	      
	    public Integer getMeb_id() {  
	        return this.mebId;  
	    }  
	   
	    public void setShop_free(Float shopFree) {  
	        this.shopFree = shopFree;  
	    }  
	      
	    public Float getShop_free() {  
	        return this.shopFree;  
	    }  
}