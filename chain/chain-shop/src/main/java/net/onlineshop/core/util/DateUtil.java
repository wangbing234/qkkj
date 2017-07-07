package net.onlineshop.core.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 日期操作
 * 
 * @author zhaozhi3758
 */
public class DateUtil {
	public static final String LONG_MODEL = "yyyy-MM-dd HH:mm:ss";
	public static final String SHORT_MODEL = "yyyy-MM-dd";

	/**
	 * 时间格式化
	 * 
	 * @param d
	 * @return
	 */
	public static String dateFormat(Date d) {
		SimpleDateFormat sdf = new SimpleDateFormat(LONG_MODEL);
		return sdf.format(d);
	}

	/**
	 * 时间格式化
	 * 
	 * @param d
	 * @return
	 */
	public static String dateFormat(Date d, String model) {
		SimpleDateFormat sdf = new SimpleDateFormat(model);
		return sdf.format(d);
	}

	/**
	 * 字符串转日期，支持两种格式 1."日期 时间" 2."纯日期"
	 * 
	 * @param s
	 * @return
	 * @throws ParseException
	 */
	public static Date StringToDate(String s) throws ParseException {

		DateFormat sdf = new SimpleDateFormat(LONG_MODEL);
		try {
			return sdf.parse(s);
		} catch (ParseException e) {
			DateFormat sdf2 = new SimpleDateFormat(SHORT_MODEL);
			try {
				return sdf2.parse(s);
			} catch (ParseException e2) {
			}
		}
		return null;
	}

	/**
	 * 计算 h个小时后的时间 "以当前时间为基准"
	 * 
	 * @param h
	 * @return
	 */
	public static Date calculateDate(int h) {

		return calculateDate(new Date(), h, 0);
	}

	/**
	 * 计算 h个小时，m分钟后的时间 "以当前时间为基准"
	 * 
	 * @param h
	 * @param m
	 * @return
	 */
	public static Date calculateDate(int h, int m) {

		return calculateDate(new Date(), h, m);
	}

	/**
	 * 计算 h个小时后的时间 "以fromdate为基准"
	 * 
	 * @param fromdate
	 * @param h
	 * @return
	 */
	public static Date calculateDate(Date fromdate, int h) {

		return calculateDate(fromdate, h, 0);
	}

	/**
	 * 计算 h个小时，m分钟后的时间 "以fromdate为基准"
	 * 
	 * @param fromdate
	 * @param h
	 * @param m
	 * @return
	 */
	public static Date calculateDate(Date fromdate, int h, int m) {

		Date date = null;
		Calendar cal = Calendar.getInstance();
		cal.setTime(fromdate);
		cal.add(Calendar.HOUR_OF_DAY, h);
		cal.add(Calendar.MINUTE, m);
		date = cal.getTime();
		return date;
	}

	/**
	 * 两个时间相差的分钟数
	 * 
	 * @param d1
	 * @param d2
	 * @return
	 */
	public static long dateDiff(Date d1, Date d2) {

		return dateCompare(d1, d2) / 1000 / 60;
	}

	/**
	 * 时间大小的比较，返回相差的毫秒数
	 * 
	 * @param d1
	 * @param d2
	 * @return
	 */
	public static long dateCompare(Date d1, Date d2) {
		Calendar cal = Calendar.getInstance();
		Calendar ca2 = Calendar.getInstance();
		cal.setTime(d1);
		ca2.setTime(d2);
		long l1 = cal.getTimeInMillis();
		long l2 = ca2.getTimeInMillis();
		return l1 - l2;
	}
	// 同时要注意整个系统取的是什么时间。比如是数据库时间，服务器时间，jdk时间,还是客户端时间。我这里取的是当前系统时间

	// 同时，如果当前时间是2012-2-29 那么，today.getMonth()的值是一。

	public static int userBirthdayGetAge(String birthday) {

		try {
			Calendar cal = Calendar.getInstance();

			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

			String mDateTime = formatter.format(cal.getTime());// 当前时间

			java.util.Date today = formatter.parse(mDateTime);

			java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat(

					"yyyy-MM-dd");

			java.util.Date birday = sdf.parse(birthday);// 当前对当前的情况

			int age = today.getYear() - birday.getYear();

			if (today.getMonth() == birday.getMonth()

					&& today.getDate() == birday.getDate()

					&& birday.getYear() % 4 != 0 && today.getYear() != 0

					&& birday.getMonth() != 1 && today.getMonth() != 1) {// 月份和日期都与当前时间相同(除去生日和当前年是闰年，并且是二月的情况)

				return age;

			} else if (today.getMonth() < birday.getMonth()) {// 生日的月份大于当前时间的月份

				return age - 1;

			} else if (birday.getMonth() == 1 && birday.getDate() == 29// 生日是闰年，当前年不一定是闰年

					&& today.getMonth() == 1) {// 生日是闰年的情况,并且本月是二月

				if (today.getYear() % 4 == 0) {// 当前年是闰年 2月有二十九

					if (today.getDate() < birday.getDate()) {//

						return age - 1;

					} else {

						return age;

					}

				} else {// 当前是年二月是二十八天

					if (today.getDate() < birday.getDate() - 1) {

						return age - 1;

					} else {

						return age;

					}

				}

			} else if (today.getMonth() == 1 && today.getDate() == 29

					&& birday.getMonth() == 1) { // 当前年是闰年，生日年不一定是闰年

				if (birday.getYear() % 4 == 0) {// 生日年是闰年 二月有二十九天

					if (today.getDate() < birday.getDate()) {//

						return age - 1;

					} else {

						return age;

					}

				} else {// 生日年二月是二十八天

					if (today.getDate() + 1 < birday.getDate()) {

						return age - 1;

					} else {

						return age;

					}

				}

			} else if (today.getMonth() > birday.getMonth()) {// 不是同一年，生日的月份不大于当前的月份的情况

				return age;

			} else if (today.getDate() < birday.getDate()) {// 正常的日期(非闰年) 当前 小于 出生

				return age - 1;

			} else if (today.getDate() == birday.getDate()) {// 当前 等于 出生

				return age;

			} else {

				return age; // 当前 大于 出生

			}
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return 0;
	}

	/**
	 * 得到几天后的时间
	 * 
	 * @param d
	 * @param day
	 * @return
	 */
	public static Date getDateAfter(Date d, int day) {
		Calendar now = Calendar.getInstance();
		now.setTime(d);
		now.set(Calendar.DATE, now.get(Calendar.DATE) + day);
		return now.getTime();
	}
}
