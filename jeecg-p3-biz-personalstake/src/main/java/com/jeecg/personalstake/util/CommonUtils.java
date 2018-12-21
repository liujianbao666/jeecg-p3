package com.jeecg.personalstake.util;

import com.alibaba.fastjson.JSONArray;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Pattern;

public final class CommonUtils {

	/**
	 * 将数据库中查询出来List的列名D1,D2....D288转化为时间字符串List
	 * @param DList
	 * @return
	 */
	public static List<Double> getDataList(List<Map<String,Object>> DList){
		List<Double> result = new ArrayList<Double>();
		for (Map<String,Object> map : DList) {
			for (String key : map.keySet()) { 
		        Pattern digit = Pattern.compile("^d\\d+$");
		        if (digit.matcher(key).matches()) {
					result.add(map.get(key)==null?0:Double.parseDouble(String.valueOf(map.get(key))));
				}
			}
		}
		return result;
	}
	
	
	/**
	 * 将数据库中查询出来List的列名D1,D2....D288转化为时间字符串List
	 * @param DList
	 * @return
	 */
	public static List<Long> getDataTimeList(List<Map<String,Object>> DList){
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		List<Long> result = new ArrayList<Long>();
		for (Map<String,Object> map : DList) {
			for (String key : map.keySet()) { 
		        Pattern digit = Pattern.compile("^d\\d+$");
		        if (digit.matcher(key).matches()) {
					String time = CommonUtils.parseColDtoTime(key);
					try {
						long longtime = sdf.parse(map.get("coll_date")+" "+time).getTime();
						result.add(longtime);
					} catch (ParseException e) {
						e.printStackTrace();
					}
				}
			}
		}
		return result;
	}
	/**
	 * 将数据库中的列名D1,D2....D288转化为时间字符串
	 * @param colname
	 * @return
	 */
	public static String parseColDtoTime(String colname) {
		String hourtime="";
		String mintime="";
		int hour = Integer.parseInt(colname.substring(1))*5/60;
		if(hour<10) {
			hourtime="0"+hour;
		}else {
			hourtime=""+hour;
		}
		int min = Integer.parseInt(colname.substring(1))*5%60;
		
		if(min<10) {
			mintime="0"+min;
		}else {
			mintime=""+min;
		}
		return hourtime+":"+mintime;
	}
	/**
	 * 获取字符串
	 * 
	 * @param o
	 * @return
	 */
	public static String getStr(Object o) {
		if (o == null) {
			return "";
		} else if (o.toString().toLowerCase().equals("null")) {
			return "";
		}
		return o.toString().trim();
	}

	public static String getStr16(String str) {
		str = getStr(str);
		while (str.length() < 16) {
			str = "0" + str;
		}
		return str;
	}

	public static double getDouble(Object o) {
		String str = getStr(o);
		double d = 0;
		if (!str.equals("")) {
			d = Double.parseDouble(str);
		}
		return d;
	}

	public static int getInt(Object o) {
		String str = getStr(o);
		int d = 0;
		if (!str.equals("")) {
			d = Integer.parseInt(str);
		}
		return d;
	}

	public static BigDecimal getBigDecimal(Object o) {
		String str = getStr(o);
		BigDecimal b = new BigDecimal(0);
		if (!str.equals("")) {
			b = new BigDecimal(str);
		}
		return b;
	}


	/**
	 * 将字符串转成utf-8字节
	 * 
	 * @param str
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	public static byte[] getBytesForUTF8(String str) throws UnsupportedEncodingException {
		byte[] bytes = null;
		bytes = str.getBytes("UTF-8");
		return bytes;
	}

	/**
	 * 生成uuid主键
	 * 
	 * @return
	 */
	public static String getUUID() {
		String uuid = UUID.randomUUID().toString();
		// 去掉“-”符号
		return uuid.replaceAll("-", "");
	}

	 /**
     * 获取某段时间内所有日期
     *
     * @param dBegin
     * @param dEnd
     * @return
     */
    public static List<Date> findDates(Date dBegin, Date dEnd) {
        List lDate = new ArrayList();
        lDate.add(dBegin);
        Calendar calBegin = Calendar.getInstance();
        // 使用给定的 Date 设置此 Calendar 的时间
        calBegin.setTime(dBegin);
        Calendar calEnd = Calendar.getInstance();
        // 使用给定的 Date 设置此 Calendar 的时间
        calEnd.setTime(dEnd);
        // 测试此日期是否在指定日期之后
        while (dEnd.after(calBegin.getTime())) {
            // 根据日历的规则，为给定的日历字段添加或减去指定的时间量
            calBegin.add(Calendar.DAY_OF_MONTH, 1);
            lDate.add(calBegin.getTime());
        }
        return lDate;
    }
    
    public static String joinSumString(String startTime, String endTime) {
        StringBuffer sqlbuffer = new StringBuffer("");
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        Date dStartTime = null;
        Date dEndTime = null;
        try {
            dStartTime = format.parse(startTime);
            dEndTime = format.parse(endTime);
        } catch (ParseException e1) {
            e1.printStackTrace();
        }
        String sTime = sdf.format(dStartTime);
        String Etime = sdf.format(dEndTime);
        //开始时间的小时数
        String sHour = sTime.substring(0, 2);
        //开始时间的分钟数
        String sMinute = sTime.substring(sTime.length() - 2, sTime.length());
        //结束时间的小时数
        String eHour = Etime.substring(0, 2);
        //结束时间的分钟数
        String eMinute = Etime.substring(Etime.length() - 2, Etime.length());
        int hours = Integer.parseInt(sHour);
        int minutes = Integer.parseInt(sMinute);
        int houre = Integer.parseInt(eHour);
        int minutee = Integer.parseInt(eMinute);
        int sTimePoint = hours * 60 + minutes;
        int eTimePoint = houre * 60 + minutee;
        int s,e;
        if(sTimePoint%5==0){
            s=sTimePoint/5;
        }else{
            s=(sTimePoint/5)+1;
        }
        if(eTimePoint%5==0){
            e=eTimePoint/5;
        }else{
            e=(eTimePoint/5);
        }
        for (int j = s; j <=e; j++) {
            if (j * 5 >sTimePoint && j * 5 <= eTimePoint) {
                if ((j ) < 10) {
                    sqlbuffer.append(" IFNULL(D0" + j + ",0)+");    

                } else {
                    sqlbuffer.append(" IFNULL(D" + j + ",0)+");
                }
            } else if (j * 5 > eTimePoint) {
                break;
            }
        }
        String str = sqlbuffer.toString();
        if (str.length() > 0) {
            str = str.substring(0, str.length() - 1);
        }
        return str;
    }
    
    /**
     * 获得指定日期的前一天
     *
     * @param specifiedDay
     * @return
     */
    public static String getSpecifiedDayBefore(String specifiedDay) {//可以用new Date().toLocalString()传递参数
        Calendar c = Calendar.getInstance();
        Date date = null;
        try {
            date = new SimpleDateFormat("yy-MM-dd").parse(specifiedDay);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        c.setTime(date);
        int day = c.get(Calendar.DATE);
        c.set(Calendar.DATE, day - 1);

        String dayBefore = new SimpleDateFormat("yyyy-MM-dd").format(c
                .getTime());
        return dayBefore;
    }
    
    public static String joinSumStringNow(String startTime, String endTime) {
        StringBuffer sqlbuffer = new StringBuffer("");
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date dStartTime = null;
        Date dEndTime = null;
        try {
            dStartTime = format.parse(startTime);
            dEndTime = format.parse(endTime);
        } catch (ParseException e1) {
            e1.printStackTrace();
        }
        String sTime = sdf.format(dStartTime);
        String Etime = sdf.format(dEndTime);
        //开始时间的小时数
        String sHour = sTime.substring(0, 2);
        //开始时间的分钟数
        String sMinute = sTime.substring(sTime.length() - 2, sTime.length());
        //结束时间的小时数
        String eHour = Etime.substring(0, 2);
        //结束时间的分钟数
        String eMinute = Etime.substring(Etime.length() - 2, Etime.length());
        int hours = Integer.parseInt(sHour);
        int minutes = Integer.parseInt(sMinute);
        int houre = Integer.parseInt(eHour);
        int minutee = Integer.parseInt(eMinute);
        int sTimePoint = hours * 60 + minutes;
        int eTimePoint = houre * 60 + minutee;
        int s,e;
        if(sTimePoint%5==0){
            s=sTimePoint/5;
        }else{
            s=(sTimePoint/5)+1;
        }
        if(eTimePoint%5==0){
            e=eTimePoint/5;
        }else{
            e=(eTimePoint/5);
        }
        for (int j = s; j <=e; j++) {
            if (j * 5 >sTimePoint && j * 5 <= eTimePoint) {
                if ((j ) < 10) {
                    sqlbuffer.append(" IFNULL(D0" + j + ",0)+");    

                } else {
                    sqlbuffer.append(" IFNULL(D" + j + ",0)+");
                }
            } else if (j * 5 > eTimePoint) {
                break;
            }
        }
        String str = sqlbuffer.toString();
        if (str.length() > 0) {
            str = str.substring(0, str.length() - 1);
        }
        return str;
    }
    
	/**
	 * 对结果集进行分页
	 * 
	 * @param limit
	 * @param offset
	 * @param array
	 * @return
	 */
	public static JSONArray dividePage(Integer limit, Integer offset, JSONArray array) {
		JSONArray temp = new JSONArray();
		int start = (offset.intValue() - 1) * limit.intValue();
		int count = (offset.intValue()) * limit.intValue();
		if (count > array.size()) {
			limit = array.size() % limit.intValue();
		}
		for (int i = start; i < start + limit; i++) {
			temp.add(array.get(i));
		}
		return temp;
	}
	

}
