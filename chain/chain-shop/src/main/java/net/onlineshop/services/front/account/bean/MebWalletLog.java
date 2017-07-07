/*
 * Powered By [rapid-framework]
 * Web Site: http://blog.csdn.net/houfeng30920/article/details/52730893
 * Csdn Code: 
 * Since 2015 - 2017
 */

package net.onlineshop.services.front.account.bean;

import java.io.Serializable;
import java.sql.Date;

import net.onlineshop.core.dao.page.PagerModel;

public class MebWalletLog extends PagerModel implements Serializable{  
      
	    /**  
	     *   
	     */ 
	    private Integer rid;  
	    /**  
	     *   
	     */ 
	    private Integer mebId;  
	    /**  
	     *   
	     */ 
	    private String walletType;  
	    /**  
	     *   
	     */ 
	    private String walletSubType;  
	    /**  
	     *   
	     */ 
	    private Float changeAmount;  
	    /**  
	     *   
	     */ 
	    private Float newAmount;  
	    /**  
	     *   
	     */ 
	    private Date createTime;  
	    /**  
	     *   
	     */ 
	    private String changeReason;  
	    /**  
	     *   
	     */ 
	    private Integer changeId;  
	    /**  
	     *   
	     */ 
	    private String oper;  
	    /**  
	     *   
	     */ 
	    private String operRemark;  
 
	    public void setRid(Integer rid) {  
	        this.rid = rid;  
	    }  
	      
	    public Integer getRid() {  
	        return this.rid;  
	    }  
	    public void setMeb_id(Integer mebId) {  
	        this.mebId = mebId;  
	    }  
	      
	    public Integer getMeb_id() {  
	        return this.mebId;  
	    }  
	    public void setWallet_type(String walletType) {  
	        this.walletType = walletType;  
	    }  
	      
	    public String getWallet_type() {  
	        return this.walletType;  
	    }  
	    public void setWallet_sub_type(String walletSubType) {  
	        this.walletSubType = walletSubType;  
	    }  
	      
	    public String getWallet_sub_type() {  
	        return this.walletSubType;  
	    }  
	    public void setChange_amount(Float changeAmount) {  
	        this.changeAmount = changeAmount;  
	    }  
	      
	    public Float getChange_amount() {  
	        return this.changeAmount;  
	    }  
	    public void setNew_amount(Float newAmount) {  
	        this.newAmount = newAmount;  
	    }  
	      
	    public Float getNew_amount() {  
	        return this.newAmount;  
	    }  
	    public void setCreate_time(Date createTime) {  
	        this.createTime = createTime;  
	    }  
	      
	    public Date getCreate_time() {  
	        return this.createTime;  
	    }  
	    public void setChange_reason(String changeReason) {  
	        this.changeReason = changeReason;  
	    }  
	      
	    public String getChange_reason() {  
	        return this.changeReason;  
	    }  
	    public void setChange_id(Integer changeId) {  
	        this.changeId = changeId;  
	    }  
	      
	    public Integer getChange_id() {  
	        return this.changeId;  
	    }  
	    public void setOper(String oper) {  
	        this.oper = oper;  
	    }  
	      
	    public String getOper() {  
	        return this.oper;  
	    }  
	    public void setOper_remark(String operRemark) {  
	        this.operRemark = operRemark;  
	    }  
	      
	    public String getOper_remark() {  
	        return this.operRemark;  
	    }  
 
}