package com.qkkj.pay.common.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;


/**
 *
 *
 * 类名称：DateUtil
 * 类描述：
 * 创建人：mzw
 * 创建时间：2015年5月8日 下午1:18:23
 * 修改人：mzw
 * 修改时间：2015年5月8日 下午1:18:23
 * Modification History:
 * =============================================================================
 *   Author         Date           Description
 *  ---------------------------------------------------------------------------
 * =============================================================================
 * @version 1.0.0
 *  日期格式化工具类
 */
public class DateUtil {

	public static final String TIMEFORMAT_1="yyyy-MM-dd HH:mm:ss";

	public static final String TIMEFORMAT_2="yyyyMMddHHmmss";

	public static final String TIMEFORMAT_3="yyyyMMdd";

	public static final String TIMEFORMAT_4="HHmmss";
	
	public static final String TIMEFORMAT_5="yyyy-MM-dd";
	
	public static final String TIMEFORMAT_6="HH:mm:ss";
	
	public static final String TIMEFORMAT_7="yyMMdd";
	
	public static final  SimpleDateFormat defaultDateFormat = new SimpleDateFormat(TIMEFORMAT_3);
	
	/**
	 * 当前系统时间
	 * @return
	 */
	public static String getStringDate(String format){
		Date date=new Date();
		SimpleDateFormat simpleDateFormat=new SimpleDateFormat(format);
		return simpleDateFormat.format(date);
	}

    /**
     * 试用参数Format格式化Calendar成字符串
     * @param cal
     * @param pattern
     * @return String
     */
    public static String format(Calendar cal ,String pattern){
    	return cal == null ? "" : new SimpleDateFormat(pattern).format(cal.getTime());
    }


	/**
	 * 
	* @description: 获取制定时间格式的Date对象 
	* @param format
	* @return Date   
	* @author HANBO 
	* @date 2016年5月17日上午9:14:15
	 */
	public static Date getCusTime(String format){
		SimpleDateFormat simpleDateFormat=new SimpleDateFormat(format);
		try {
			return simpleDateFormat.parse(getStringDate(format));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return null;
	}
	
    /**
     *
     * getSysDateTime 获取当前系统的日期时间串 yyyyMMddHHmmss
     * @return
     * String
     * @exception
     * @since  1.0.0
     */
	public static String getSysDateTime(){
		 Calendar calendar =  Calendar.getInstance();
		 SimpleDateFormat simpleDateFormat=new SimpleDateFormat(TIMEFORMAT_2);
		 return simpleDateFormat.format(calendar.getTime());
	}
	
	/**
	 * 
	 * getSysDate
	 * 获取当前指定格式的日期格式字符串
	 * @param format
	 * @return 
	 * String
	 * @exception 
	 * @since  1.0.0
	 */
	public static String getSysDate(String format){
		Calendar calendar =  Calendar.getInstance();
		 SimpleDateFormat simpleDateFormat=new SimpleDateFormat(format);
		 return simpleDateFormat.format(calendar.getTime());
	}
	
	/**  
	* @description: 获取系统时间字符串  HHmmss
	* @return String   
	* @author HANBO 
	* @date 2016年5月18日下午4:06:34
	*/ 
	public static String getSysTime(){
		Calendar calendar =  Calendar.getInstance();
		 SimpleDateFormat simpleDateFormat=new SimpleDateFormat(TIMEFORMAT_4);
		 return simpleDateFormat.format(calendar.getTime());
	}
	
	
	/**  
	* @description: 获取系统日期 （yyyyMMdd）
	* @return String   
	* @author HANBO 
	* @date 2016年5月18日下午4:38:49
	*/ 
	public static String getSysDay(){
		Date date=new Date();
		return defaultDateFormat.format(date);
	}
	
    /**  
    * @description: 获取日期字符串  （yyMMdd）
    * @return String   
    * @author HANBO 
    * @date 2016年5月18日下午4:40:12
    */ 
    public static String getBatchOfDate(){
		SimpleDateFormat dateFormat = new SimpleDateFormat(TIMEFORMAT_7);
		return dateFormat.format(new Date());
    }
	
	 /**
    *
    * 日期格式转换
    * @param srcDate 原日期字符串
    * @param srcPattern 原日期格式
    * @param destPattern 目标日期格式
    * @return 目标日期
    */

   public static String transformDate(String srcDate,String srcPattern,String destPattern){
   	if(srcDate==null){
   		return "";
   	}
   	if(StringUtils.isBlank(srcPattern)){
   		return "";
   	}
   	if(StringUtils.isBlank(destPattern)){
   		destPattern = "yyyymmdd";
   	}

   	String destDateStr = "";
   	SimpleDateFormat sf1 = new SimpleDateFormat(srcPattern);
   	SimpleDateFormat sf2 = new SimpleDateFormat(destPattern);
   	try {
			Date date = sf1.parse(srcDate);
			destDateStr = sf2.format(date);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

   	return destDateStr;
   }

	/****
	 * 时间字符串转换毫秒
	 * @param str 时间字符串(yyyyMMddHHmmss)
	 * @return
	 */
	public static long getMsecond(String str){

		SimpleDateFormat simpleDateFormat=new SimpleDateFormat(TIMEFORMAT_2);
		Calendar c=Calendar.getInstance();
		try {
			c.setTime(simpleDateFormat.parse(str.toString()));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return c.getTimeInMillis();
	}
	
    /**
     * Date型转化到Calendar型
     * @param date
     * @return Calendar
     */
    public static Calendar date2Cal(Date date) {
    	Calendar c = Calendar.getInstance();
    	c.setTime(date);
    	return c;
    }
	
    /**
     * 当前时间
     * @return Calendar实例
     */
    public static Calendar nowCal() {
    	return Calendar.getInstance();
    }
    
    
    /**  
    * @description: 获取一个月前的日期
    * @param cal
    * @return Calendar   
    * @author HANBO 
    * @date 2016年5月23日上午9:30:28
    */ 
    public static Calendar preMonth(Calendar cal){
    	return beforeMonths(cal,1);
    }
    
    
    /**  
    * @description: 根据制定的格式、日期字符串及天数，计算日期 
    * @return
    * @throws ParseException String   
    * @author HANBO 
    * @date 2016年5月17日上午11:14:37
    */ 
    public static String afterDays(String dateStr , String datePattern,int dayNum) throws ParseException{
    	SimpleDateFormat dateFormat = new SimpleDateFormat(datePattern);
    	Date date = dateFormat.parse(dateStr) ;
    	Calendar cal = Calendar.getInstance();
    	cal.setTime(date);
    	//调起日期计算方法
    	Calendar resCal = afterDays(cal, dayNum);
    	
    	return dateFormat.format(resCal.getTime());
    }
    
    /**  
    * @description: 根据制定的格式、日期对象及天数，计算日期 
    * @return
    * @throws ParseException String   
    * @author HANBO 
    * @date 2016年5月17日上午11:22:37
    */
    public static String afterDays(Date date,String datePattern,int dayNum){
    	SimpleDateFormat dateFormat = new SimpleDateFormat(datePattern);
    	Calendar cal = Calendar.getInstance();
    	cal.setTime(date);
    	Calendar resCal = afterDays(cal, dayNum);
    	
    	return dateFormat.format(resCal.getTime());
    }
    
    /**  
    * @description: 获取当前日期之前的n天
    * @param cal
    * @param n
    * @return Calendar   
    * @author HANBO 
    * @date 2016年5月17日上午10:36:58
    */ 
    public static Calendar afterDays(Calendar cal, int n){
    	if(null == cal){
    		return null;
    	}
    	Calendar c = (Calendar)cal.clone();
    	c.add(Calendar.DAY_OF_YEAR, n);
    	return c;
    }
    
    public static Calendar beforeMonths(Calendar cal, int n){
    	if(null == cal){
    		return null;
    	}
    	Calendar c = (Calendar)cal.clone();
    	c.set(Calendar.MONTH,Calendar.MONTH - n);
    	return c;
    }
    
    /**
     * 后n月
     * @param cal
     * @param n
     * @return Calendar
     */
    public static Calendar afterMonths(Calendar cal, int n) {
    	if (cal == null) {
    		return null;
    	}
    	Calendar c = (Calendar) cal.clone();
    	c.set(Calendar.MONTH, cal.get(Calendar.MONTH) + n);
    	return c;
    }
    
    
    /**  
    * @description: 将毫秒时间转为制定日期格式 
    * @param millis
    * @param format
    * @return String   
    * @author HANBO 
    * @date 2016年5月23日上午9:51:31
    */ 
    public static String millisToDate(long millis, String format){
    	//设置制定毫秒数，新建一个Date对象
    	Date date = new Date(millis);
    	//转换为制定日期格式
    	SimpleDateFormat simpleDateFormat=new SimpleDateFormat(format);
    	
    	return simpleDateFormat.format(date);
    }
    

	public static void main(String[] args) throws ParseException{
		
		System.out.println(transformDate("2016-03-01 15:05:24",TIMEFORMAT_1,TIMEFORMAT_2));
		System.out.println(afterDays("20160325","yyyyMMdd",30));
		Date date = new Date();
		
		long timestr = date.getTime();
		
		System.out.println(millisToDate(timestr,"HHmmss"));
		System.out.println(getSysDay()+"---"+getSysTime());
		System.out.println(DateUtil.getStringDate("HHmmss")); 
	}
	

}
