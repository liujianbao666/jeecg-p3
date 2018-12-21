package com.jeecg.personalstake.util;

import com.alibaba.fastjson.JSONArray;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

public final class TypeUtil {
	/**
	 * 转换为字符串,如果是null则返回""
	 * 
	 * @param value
	 *            要转换的值
	 * @return 字符串
	 */
	public static String toString(Object value) {
		return toString(value, "");
	}

	/**
	 * 转换为字符串,如果是null则返回"" 如果是String则返回String 如果是Date类型 则返回date
	 * 
	 * @param value
	 *            要转换的值
	 * @return 字符串
	 */
	public static Object toStringo(Object value) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		if (null == value) {
			return toString(value, "");
		} else if (value.getClass().getName().equals("java.lang.String")) {
			return value;
		} else {
			return sdf.format(value);
		}
	}

	/**
	 * 转换为字符串,如果是null则返回"" returnValue
	 * 
	 * @param value
	 *            要转换的值
	 * @param returnValue
	 *            null时的返回值
	 * @return 字符串
	 */
	public static String toString(Object value, String returnValue) {
		if (null == value) {
			return returnValue;
		} else {
			return value.toString();
		}
	}

	/**
	 * 将对象转成double型,如对象=null或在转换过程中出现错误则返回nullReturn
	 * 
	 * @param value
	 *            要转换的对象
	 * @return double型
	 */
	public static double toDouble(Object value, double nullReturn) {
		if (null == value || value.equals("")) {
			return nullReturn;
		} else {
			if (value instanceof Long) {
				return ((Long) value).doubleValue();
			} else if (value instanceof Integer) {
				return ((Integer) value).doubleValue();
			} else if (value instanceof Short) {
				return ((Short) value).doubleValue();
			} else if (value instanceof Byte) {
				return ((Byte) value).doubleValue();
			} else if (value instanceof Double) {
				return ((Double) value).doubleValue();
			} else {
				try {
					return Double.parseDouble(value.toString());
				} catch (Exception e) {
					return nullReturn;
				}
			}
		}
	}

	/**
	 * 将对象转成double型,如对象=null或在转换过程中出现错误则返回SystemInfo.INVALIDVALUE
	 * 
	 * @param value
	 *            要转换的对象
	 * @return double型
	 */
	public static double toDouble(Object value) {
		return toDouble(value, -2);
	}

	/**
	 * 针对参数类型为bigdecimal，但是参数值为空的情况，返回bigdecimal格式的0
	 * 
	 * @param number
	 * @return
	 */
	public static BigDecimal numNotNull(Object number) {
		/*
		 * if(number.getClass().getName().equals("java.math.BigDecimal")){
		 * return (BigDecimal) number; } else return BigDecimal.ZERO;
		 */

		if (number == null) {
			return BigDecimal.ZERO;
		} else
			return (BigDecimal) number;
	}

	/**
	 * 针对参数类型为BigDecimal，但是参数值为""的情况，返回bigdecimal格式的0
	 * 
	 * @param str
	 * @return
	 */
	public static BigDecimal numNotEmpty(String str) {
		if (str.isEmpty()) {
			return BigDecimal.ZERO;
		} else {
			return new BigDecimal(str);
		}
	}

	public static String removeTrim(String str) {
		if (str.indexOf(".") > 0) {
			str = str.replaceAll("0+?$", ""); // 去掉多于的0
			str = str.replaceAll("[.]$", ""); // 最后以为是，则去掉
		}
		return str;
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
	
	public static double getDouble(Object o) {
		String str = getStr(o);
		double d = 0;
		if (!str.equals("")) {
			d = Double.parseDouble(str);
		}
		return d;
	}


	/**
	 *转换日期
	 * @param o
	 * @param format
	 * @return
	 * @throws ParseException
	 */
	public static Date getDate(Object o, String format) throws ParseException {
		if (getStr(format).equals("")) {
			format = "yyyy-MM-dd HH:mm:ss";
		}
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		Date d = null;
		String str = getStr(o);
		if (!str.equals("")) {
			d = sdf.parse(str);
		}
		return d;
	}

	/**
	 * 日期转化为String
	 * @param o
	 * @param format
	 * @return
	 * @throws ParseException
	 */
	public static String getFormatStringByDate(Date date, String format) throws ParseException {
		if (getStr(format).equals("")) {
			format = "yyyy-MM-dd HH:mm:ss";
		}
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		return sdf.format(date);
	}

	//根据分钟转换成小时字符串   例子：5分钟 转换成 "0005"
	public static String toHourMiniute(int miniutes) {
		int hour = miniutes / 60;
		int miniute = miniutes % 60;
		String hour1 = TypeUtil.toString(hour);
		String miniute1 = TypeUtil.toString(miniute);
		if (Integer.parseInt(hour1) < 10) {
			hour1 = "0" + hour1;
		}
		if (Integer.parseInt(miniute1) < 10) {
			miniute1 = "0" + miniute1;
		}
		String time = hour1 + miniute1;
		return time;

	}
	
	/**
     * 设置某天的时分秒
     *
     * @param hour
     * @param minute
     * @param second
     * @param specifiedDay
     * @return
     */
    public static Date getNeedTime(int hour, int minute, int second, String specifiedDay) {
        Calendar calendar = Calendar.getInstance();
        Date date = null;
        try {
            date = new SimpleDateFormat("yy-MM-dd").parse(specifiedDay);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, second);
        return calendar.getTime();
    }

	/*
	 * 将时间转换为时间戳
	 */
	public static String dateToStamp(String s) throws ParseException {
		String res = "";
		SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date date = simpleDateFormat.parse(s);
		long ts = date.getTime();
		res = String.valueOf(ts);
		return res;
	}

	/*
	 * 将时间戳转换为时间
	 */
	public static Date stampToDate(String s) {
		long lt = new Long(s);
		Date date = new Date(lt);
		return date;
	}

	/**
	 * 将时间取yyyy-MM-dd的String
	 *
	 * @param o
	 * @return
	 */
	public static String subStringDate(Object o) {
		String dateToString = getStr(o).substring(0, 10);
		return dateToString;
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
	
	/**
	 * 获取某段时间内所有时间
	 *
	 * @param dBegin
	 * @param dEnd
	 * @return
	 */
	public static List<Date> findDates(Date dBegin, Date dEnd) {
		List<Date> lDate = new ArrayList<Date>();
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
}
