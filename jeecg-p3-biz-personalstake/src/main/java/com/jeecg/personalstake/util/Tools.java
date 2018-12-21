package com.jeecg.personalstake.util;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public final class Tools {

	/**
	 * 将数字转换成字符串，如果数字长度为1，前面补0,如果超过两位，不处理
	 * 
	 * @param num
	 * @return
	 */
	public static String intToTwoStr(int num) {
		String str = num + "";
		if (str.length() == 1) {
			str = "0" + str;
		}
		return str;
	}

	/**
	 * @param startTime
	 *            开始时间
	 * @param endTime
	 *            结束时间
	 * @return 总共的日期集合
	 */
	public static List<Date> fromDateToDate(Date startTime, Date endTime) {
		List<Date> dates = new ArrayList<Date>();

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date fstartTime = null;
		Date fendTime = null;
		try {
			fstartTime = sdf.parse(sdf.format(startTime));
			fendTime = sdf.parse(sdf.format(endTime));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(fstartTime);
		dates.add(startTime);
		long days = TimeUnit.MILLISECONDS.toDays(fendTime.getTime() - fstartTime.getTime());
		if (days > 0) {
			for (int i = 1; i < days; i++) {
				calendar.add(Calendar.DAY_OF_YEAR, 1);
				Date temp = calendar.getTime();
				dates.add(temp);
			}
			dates.add(endTime);
		} else {// 如果为同一天

		}
		return dates;
	}

	/**
	 * 将日期转换成分钟格式，如果秒数大于0，分钟数加1
	 * 
	 * @param date
	 * @return
	 */
	public static int dateToMinutes(Date date) {
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);
		int hours = calendar.get(Calendar.HOUR_OF_DAY);
		int minutes = calendar.get(Calendar.MINUTE);
		minutes += hours * 60;
		int seconds = calendar.get(Calendar.SECOND);
		if (seconds > 0) {
			minutes++;
		}
		return minutes;
	}
	
	 /**
     * 获取当前时间前后num天的时间
     * @param date
     * @param num
     * @return
     */
    public static Date getDateByNum(Date date,int num){
        Date targetDate=null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date d = null;
        try {
            d = sdf.parse(sdf.format(date));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(d);
        calendar.add(Calendar.DAY_OF_YEAR,num);
        targetDate=calendar.getTime();
        return targetDate;
    }

	/**
	 * 获取当前时间前后num分钟的时间
	 * @param date
	 * @param num
	 * @return
	 */
    public static Date getMinuteByNum(Date date,int num){
		Date targetDate=null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date d = null;
		try {
			d = sdf.parse(sdf.format(date));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(d);
		calendar.add(Calendar.MINUTE,num);
		targetDate=calendar.getTime();
		return targetDate;
	}
    
	/**
	 * 将对象返回为字符串类型的非空值
	 * @param object
	 * @return
	 */
	public static String isNotNull(Object object){
		String str =null;
		if(object == null){
			str = "";
		}else{
			str = (String) object;
		}
		return str;
	}
	/**
	 * 判断台区负荷曲线连续为null的起始索引，所返回的索引从D01开始计数。与库中D0i中的i对应
	 * @param tgPower
	 * @return
	 */
	public static int getTgPNullPoint(List<BigDecimal> tgPower) {
		int index = 0;
		int i=tgPower.size() -1;
		if(tgPower.size()==0){
			return 0;
		}
		while(i >= 0){
			if(tgPower.get(i) != null){
				index=i+1;
				break;
			}
			else{
				i--;
			}
		}
		return index;
	}
	
	
				// 从288个点中抽取出24个整点数据
			public static List<BigDecimal> get24Points(List<Map<String, Object>> list) {
					// List<BigDecimal> result = new ArrayList<BigDecimal>();
					List<BigDecimal> temp = new ArrayList<BigDecimal>();
					if (list != null && list.size() > 0) {
					for (int i = 0; i < list.size(); i++) {
							for (int j = 1; j <= 288; j++) {
								// 将288个点转化成24小时 24个点
								String key = "D" + intToTwoStr(j);
								temp.add((BigDecimal) list.get(i).get(key)); // 得到有序的288个点
							}
						}
					}
					return temp;
		}
			
			public static List<BigDecimal> getNotNullPoints(List<Map<String, Object>> list, int nullPoint) {
				List<BigDecimal> temp = new ArrayList<BigDecimal>();
				if (list != null && list.size() > 0) {
					Map<String, Object> map1 = list.get(0);
		
					for (int j = 1; j <= nullPoint; j++) {
						String key = "D" + intToTwoStr(j);
						temp.add((BigDecimal) map1.get(key)); // 得到有序的非null点
					}
				}
				return temp;
			}
}
