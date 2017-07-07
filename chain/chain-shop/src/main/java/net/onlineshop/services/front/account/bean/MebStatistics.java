/*
 * Powered By [rapid-framework]
 * Web Site: http://blog.csdn.net/houfeng30920/article/details/52730893
 * Csdn Code: 
 * Since 2015 - 2017
 */

package net.onlineshop.services.front.account.bean;

import java.io.Serializable;
import java.sql.Date;

public class MebStatistics  implements Serializable{  
	    /**  
	     *   
	     */ 
	    private Integer mebId;  
	    /**  
	     *   
	     */ 
	    private Integer entryStage;  
	    /**  
	     *   
	     */ 
	    private Integer entryStage2;  
	    /**  
	     *   
	     */ 
	    private Integer entryCount;  
	    /**  
	     *   
	     */ 
	    private Integer entryCount2;  
	    /**  
	     *   
	     */ 
	    private Date lastEntryTime;  
	    /**  
	     *   
	     */ 
	    private Integer lastEntryAmount;  
	    /**  
	     *   
	     */ 
	    private Float entrySum;  
	    /**  
	     *   
	     */ 
	    private Integer exitBaseCount;  
	    /**  
	     *   
	     */ 
	    private Integer exitGrowCount;  
	    /**  
	     *   
	     */ 
	    private Date lastExitTime;  
	    /**  
	     *   
	     */ 
	    private Float exitBaseSum;  
	    /**  
	     *   
	     */ 
	    private Float exitGrowSum;  
	    /**  
	     *   
	     */ 
	    private Integer entryCountMonthly;  
	    /**  
	     *   
	     */ 
	    private Integer exitBaseSumDaily;  
	    /**  
	     *   
	     */ 
	    private Integer exitGrowSumDaily;  
	    /**  
	     *   
	     */ 
	    private Integer mebGroupCount;  
	    /**  
	     *   
	     */ 
	    private Integer mebGroup2Count;  
	    /**  
	     *   
	     */ 
	    private Integer groupGeLevel;  
	    /**  
	     *   
	     */ 
	    private Integer groupGeLv3;  
	    /**  
	     *   
	     */ 
	    private Integer mebGroup3Count;  
	    /**  
	     *   
	     */ 
	    private Integer mebMaxLevel;  
	    /**  
	     *   
	     */ 
	    private String isBackActive;  
	    /**  
	     *   
	     */ 
	    private Float entrySum2;  
	    /**  
	     *   
	     */ 
	    private String isReward;  
	    /**  
	     *   
	     */ 
	    private Integer mebGroupCountEntry;  
	    /**  
	     *   
	     */ 
	    private Integer signCount;  
	    /**  
	     *   
	     */ 
	    private Date firstEntryTime;  
 
	    public void setMeb_id(Integer mebId) {  
	        this.mebId = mebId;  
	    }  
	      
	    public Integer getMeb_id() {  
	        return this.mebId;  
	    }  
	    public void setEntry_stage(Integer entryStage) {  
	        this.entryStage = entryStage;  
	    }  
	      
	    public Integer getEntry_stage() {  
	        return this.entryStage;  
	    }  
	    public void setEntry_stage2(Integer entryStage2) {  
	        this.entryStage2 = entryStage2;  
	    }  
	      
	    public Integer getEntry_stage2() {  
	        return this.entryStage2;  
	    }  
	    public void setEntry_count(Integer entryCount) {  
	        this.entryCount = entryCount;  
	    }  
	      
	    public Integer getEntry_count() {  
	        return this.entryCount;  
	    }  
	    public void setEntry_count2(Integer entryCount2) {  
	        this.entryCount2 = entryCount2;  
	    }  
	      
	    public Integer getEntry_count2() {  
	        return this.entryCount2;  
	    }  
		 
	    public void setLast_entry_time(Date lastEntryTime) {  
	        this.lastEntryTime = lastEntryTime;  
	    }  
	      
	    public Date getLast_entry_time() {  
	        return this.lastEntryTime;  
	    }  
	    public void setLast_entry_amount(Integer lastEntryAmount) {  
	        this.lastEntryAmount = lastEntryAmount;  
	    }  
	      
	    public Integer getLast_entry_amount() {  
	        return this.lastEntryAmount;  
	    }  
	    public void setEntry_sum(Float entrySum) {  
	        this.entrySum = entrySum;  
	    }  
	      
	    public Float getEntry_sum() {  
	        return this.entrySum;  
	    }  
	    public void setExit_base_count(Integer exitBaseCount) {  
	        this.exitBaseCount = exitBaseCount;  
	    }  
	      
	    public Integer getExit_base_count() {  
	        return this.exitBaseCount;  
	    }  
	    public void setExit_grow_count(Integer exitGrowCount) {  
	        this.exitGrowCount = exitGrowCount;  
	    }  
	      
	    public Integer getExit_grow_count() {  
	        return this.exitGrowCount;  
	    }  
		   
	    public void setLast_exit_time(Date lastExitTime) {  
	        this.lastExitTime = lastExitTime;  
	    }  
	      
	    public Date getLast_exit_time() {  
	        return this.lastExitTime;  
	    }  
	    public void setExit_base_sum(Float exitBaseSum) {  
	        this.exitBaseSum = exitBaseSum;  
	    }  
	      
	    public Float getExit_base_sum() {  
	        return this.exitBaseSum;  
	    }  
	    public void setExit_grow_sum(Float exitGrowSum) {  
	        this.exitGrowSum = exitGrowSum;  
	    }  
	      
	    public Float getExit_grow_sum() {  
	        return this.exitGrowSum;  
	    }  
	    public void setEntry_count_monthly(Integer entryCountMonthly) {  
	        this.entryCountMonthly = entryCountMonthly;  
	    }  
	      
	    public Integer getEntry_count_monthly() {  
	        return this.entryCountMonthly;  
	    }  
	    public void setExit_base_sum_Daily(Integer exitBaseSumDaily) {  
	        this.exitBaseSumDaily = exitBaseSumDaily;  
	    }  
	      
	    public Integer getExit_base_sum_Daily() {  
	        return this.exitBaseSumDaily;  
	    }  
	    public void setExit_grow_sum_Daily(Integer exitGrowSumDaily) {  
	        this.exitGrowSumDaily = exitGrowSumDaily;  
	    }  
	      
	    public Integer getExit_grow_sum_Daily() {  
	        return this.exitGrowSumDaily;  
	    }  
	    public void setMeb_group_count(Integer mebGroupCount) {  
	        this.mebGroupCount = mebGroupCount;  
	    }  
	      
	    public Integer getMeb_group_count() {  
	        return this.mebGroupCount;  
	    }  
	    public void setMeb_group2_count(Integer mebGroup2Count) {  
	        this.mebGroup2Count = mebGroup2Count;  
	    }  
	      
	    public Integer getMeb_group2_count() {  
	        return this.mebGroup2Count;  
	    }  
	    public void setGroup_ge_level(Integer groupGeLevel) {  
	        this.groupGeLevel = groupGeLevel;  
	    }  
	      
	    public Integer getGroup_ge_level() {  
	        return this.groupGeLevel;  
	    }  
	    public void setGroup_ge_lv3(Integer groupGeLv3) {  
	        this.groupGeLv3 = groupGeLv3;  
	    }  
	      
	    public Integer getGroup_ge_lv3() {  
	        return this.groupGeLv3;  
	    }  
	    public void setMeb_group3_count(Integer mebGroup3Count) {  
	        this.mebGroup3Count = mebGroup3Count;  
	    }  
	      
	    public Integer getMeb_group3_count() {  
	        return this.mebGroup3Count;  
	    }  
	    public void setMeb_max_level(Integer mebMaxLevel) {  
	        this.mebMaxLevel = mebMaxLevel;  
	    }  
	      
	    public Integer getMeb_max_level() {  
	        return this.mebMaxLevel;  
	    }  
	    public void setIs_back_active(String isBackActive) {  
	        this.isBackActive = isBackActive;  
	    }  
	      
	    public String getIs_back_active() {  
	        return this.isBackActive;  
	    }  
	    public void setEntry_sum2(Float entrySum2) {  
	        this.entrySum2 = entrySum2;  
	    }  
	      
	    public Float getEntry_sum2() {  
	        return this.entrySum2;  
	    }  
	    public void setIs_reward(String isReward) {  
	        this.isReward = isReward;  
	    }  
	      
	    public String getIs_reward() {  
	        return this.isReward;  
	    }  
	    public void setMeb_group_count_entry(Integer mebGroupCountEntry) {  
	        this.mebGroupCountEntry = mebGroupCountEntry;  
	    }  
	      
	    public Integer getMeb_group_count_entry() {  
	        return this.mebGroupCountEntry;  
	    }  
	    public void setSign_count(Integer signCount) {  
	        this.signCount = signCount;  
	    }  
	      
	    public Integer getSign_count() {  
	        return this.signCount;  
	    }  
	    public void setFirst_entry_time(Date firstEntryTime) {  
	        this.firstEntryTime = firstEntryTime;  
	    }  
	      
	    public Date getFirst_entry_time() {  
	        return this.firstEntryTime;  
	    }  
 
}