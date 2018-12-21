package com.jeecg.personalstake.tg.service.impl;

import com.jeecg.personalstake.org.service.orgService;
import com.jeecg.personalstake.tg.dao.EvTgDao;
import com.jeecg.personalstake.tg.service.EvTgService;
import com.jeecg.personalstake.util.*;
import org.jeecgframework.minidao.annotation.Param;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * 
 * @author: www.jeecg.org
 * @since：2018年11月21日 14时39分50秒 星期三
 * @version:1.0
 */

@Service("evTgService")
public class EvTgServiceImpl implements  EvTgService {
	@Resource
	private orgService orgService;
	@Resource
	private EvTgDao evTgDao;
	@Override
	public List<Map<String, Object>> getTgRunTableList(Map<String, Object> params, int pageNo, int pageSize) {
		// TODO Auto-generated method stub
		return evTgDao.getTgRunTableList(params,pageNo,pageSize);
	}
	@Override
	public Map<String, Object> getFirstTgId(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return evTgDao.getFirstTgId(params);
	}
	@Override
	public List<BigDecimal> getNormal(String tgId) {
		// TODO Auto-generated method stub
		List<BigDecimal> result = new ArrayList<BigDecimal>();
		
		Map<String, Object> map =  evTgDao.getNormal(tgId);
		if (map == null || map.isEmpty()) {
			return result;
		} else {
			result = this.getResult(map, true);
		}
		return result;
		
	}
	@Override
	public List<BigDecimal> getOrderly(String tgId) {
		// TODO Auto-generated method stub
		List<BigDecimal> result = new ArrayList<BigDecimal>();
		Map<String, Object> map =  evTgDao.getOrderly(tgId);
		if (map == null || map.isEmpty()) {
			return result;
		} else {
			result = this.getResult(map, true);
		}
		return result;
		
	}
	@Override
	public List<BigDecimal> getTg(String tgId) {
		// TODO Auto-generated method stub
		
		List<BigDecimal> result = new ArrayList<BigDecimal>();
		Map<String, Object> map = evTgDao.getTg(tgId);
		if (map == null || map.isEmpty()) {
			return result;
		} else {
			result = this.getResult(map, true);
		}
		return result;
	}
	@Override
	public List<BigDecimal> getTgForecast(String tgId) {
		// TODO Auto-generated method stub
		
		List<BigDecimal> result = new ArrayList<BigDecimal>();
		Map<String, Object> map = evTgDao.getTgForecast(tgId);
		if (map == null || map.isEmpty()) {
			return result;
		} else {
			result = this.getResult(map, true);
		}
		return result;
		
	}
	@Override
	public Map<String, Object> tgInfo(String orgNo) {
		// TODO Auto-generated method stub
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		Map<String, Object> tgInfo = evTgDao.tgInfo(orgNo);
		if (tgInfo == null || tgInfo.isEmpty()) {
			map.put("tg_Cap", 0);
			map.put("RUN_P", 0);
			map.put("limitPower", 0);
			map.put("num", "0");
		} else {
			map.put("tg_Cap", tgInfo.get("TG_CAP"));
			map.put("RUN_P", tgInfo.get("RUN_P"));
			map.put("limitPower", tgInfo.get("limitPower"));
			double tacap = TypeUtil.getDouble(tgInfo.get("TG_CAP"));
			double runP = TypeUtil.getDouble(tgInfo.get("RUN_P"));
			int num = (int) (runP / tacap * 100);
			map.put("num", num);
		}
		return map;
	}
	@Override
	public Map<String, Object> needsInfo(String orgNo) {
		// TODO Auto-generated method stub
		return evTgDao.needsInfo(orgNo);
	}
	@Override
	public Map<String, Object> ordersInfo(String tgid) {
		// TODO Auto-generated method stub
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		Map<String, Object> total = evTgDao.ordersInfo(tgid);
		int normals = 0;
		if (total == null || total.isEmpty()) {
			// 全部订单数
			map.put("total", 0);
			map.put("normals", 0);
			// 有序充电数
			map.put("allOrderly", 0);
		} else {
			int allOrders = TypeUtil.getInt(total.get("NUM"));
			// 有序充电订单数
			Map<String, Object> normal = evTgDao.yxOrdersInfo(tgid);
			if (!normal.isEmpty()) {

				normals = TypeUtil.getInt(normal.get("NUM"));
			}
			// 全部订单数
			map.put("total", allOrders);

			map.put("normals", normals);
			// 有序充电数
			map.put("allOrderly", (allOrders - normals));
		}

		return map;
	}
	@Override
	public Map<String, Object> plansInfo(String tgId) {
		// TODO Auto-generated method stub
		
		Map<String, Object> map = new HashMap<String, Object>();
		
		
		List<Map<String, Object>> odList = evTgDao.planOrderList(tgId);
		
		int sum = 0;
		for (Map<String, Object> map2 : odList) {
			Map<String, Object> count = new HashMap<String, Object>();
			List<String> list1 = new ArrayList<String>();
			StringBuffer sql2 = new StringBuffer("");
			count = evTgDao.planCount(map2.get("od_id").toString());
			int a = TypeUtil.getInt(count.get("odcount"));
			sum += a;
		}
		// 当前台区下所有订单的计划总数
		map.put("plan_total", sum);
		
		Map<String, Object> planDCountTemp = evTgDao.hisPlanCount();
		int planDCount = TypeUtil.getInt(planDCountTemp.get("planDCount"));
		// 当前台区下所有的失败计划数
		map.put("planDCount", planDCount);
		
		
		
		return map;
	}
	@Override
	public Map<String, Object> dispatchsInfo(String tgId) {
		Map<String, Object> map = new HashMap<String, Object>();
		
		List<Map<String, Object>> odList = evTgDao.dispatchsOrderList(tgId);
		int odcount = odList.size();
		int sum = 0;
		for (Map<String, Object> map2 : odList) {
			Map<String, Object> count = new HashMap<String, Object>();
			count = evTgDao.dispatchsPlanCount(map2.get("od_id").toString());
			int a = TypeUtil.getInt(count.get("odcount"));
			sum += a;
		}
		// 调度总数
		map.put("pispath_Count", (sum - odcount));
		Map<String, Object> planDCountTemp = evTgDao.dispatchsPlanDCount();
		int planDCount = TypeUtil.getInt(planDCountTemp.get("planDCount"));
		// 调度失败数
		map.put("planDCount", planDCount);
		
		
		return map;
	}
	

	/**
	 * 取得功率集合
	 * 
	 * @param map
	 * @return
	 */
	public List<BigDecimal> getResult(Map<String, Object> map, boolean flag) {
		List<BigDecimal> list = new ArrayList<BigDecimal>();
		if (flag) {
			for (int i = 1; i <= 96; i++) {
				BigDecimal temp = TypeUtil.getBigDecimal(map.get("D" + Tools.intToTwoStr(i)));
				list.add(temp);
			}
		} else {

			for (int i = 1; i <= 288; i++) {
				if (i % 3 == 0) {
					BigDecimal temp = TypeUtil.getBigDecimal(map.get("D" + Tools.intToTwoStr(i)));
					list.add(temp);
				}

			}
		}
		return list;
	}
	//288个点对应的分钟
	public String toMinute( int _minute) {
		int minute = _minute * 5 % 60;
		if (minute < 10) {
			return "0" + minute;
		}
		return minute+"";
	} 
	//288个点对应的小时
	public String to288Hour(int _hour) {
		int hour = _hour * 5 / 60;
		if (hour < 10) {
			return "0" + hour;
		}
		return hour+"";
	}
	
	
	
	@Override
	public List<String> getTimeIntervalPoint(String paramName, List<String> tgTime) {
		List<String> list = new ArrayList<String>();
		for (int i = 1; i <= tgTime.size(); i++) {
			list.add(paramName);
		}
		return list;
	}
	@Override
	public List<Map<String, Object>> getTgUserEleList(Map<String, Object> params, int pageNo, int pageSize) {
		List<Map<String, Object>> list = null;
		String tgNo = (String) params.get("tgNo");
		String orgNo = (String) params.get("orgNo");

		if (!"".equals(orgNo) && orgNo != null) {
			String tgNos = orgService.getTgListofOrg(orgNo);
			if (!tgNos.isEmpty() && tgNos != null) {
				params.put("tgNos", tgNos);
			}
		}
		
		
		list = evTgDao.getTgInfoList(pageSize, pageNo, params);
		if (list != null && list.size() > 0) {
			for (Map<String, Object> map : list) {
				String tgId = map.get("tgId").toString();
				if (tgId!=null&&tgId!="") {
					
					params.put("tgId", tgId);
					// 已用总电量
					BigDecimal UserPower = getTgUserPower(tgId,params);
					// 充电总量
					BigDecimal chargeAmount = getChargeAmount(tgId, params);
					// 正常充电量
					BigDecimal normalChargeAmount = getChargeAmountByType(tgId, params, "1");
					// 有序充电量
					BigDecimal orderChargeAmount = getChargeAmountByType(tgId, params, "2");
					map.put("UserPower", UserPower);
					map.put("chargeAmount", chargeAmount);
					map.put("normalChargeAmount", normalChargeAmount);
					map.put("orderChargeAmount", orderChargeAmount);
				}

			}
		}
		return list;
	}
	
	@Override
	public long getTgUserEleListCount(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return evTgDao.getTgInfoListCount(params);
	}
	
	/**
	 * 查询某一时间段台区已用总电量
	 */
	@Override
	public BigDecimal getTgUserPower(String tgId, Map<String, Object> params) {
		BigDecimal decimal = new BigDecimal(0);
		String startTime = (String) params.get("startTime");
		String endTime = (String) params.get("endTime");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		BigDecimal middleData = new BigDecimal(0);
		BigDecimal firstData = new BigDecimal(0);
		BigDecimal lastData = new BigDecimal(0);
		Date dBegin;
		Date dEnd;
		if (StringUtil.isNotEmpty(startTime)) {
			try {
				if (StringUtil.isEmpty(endTime)) {
					endTime = formatter.format(new Date());
				}
				dBegin = sdf.parse(startTime);
				dEnd = sdf.parse(endTime);
				List<Date> dates = TypeUtil.findDates(dBegin, dEnd);
				// 取第二天到倒数第二天的数据
				if (dates.size() == 1) {
					firstData = getPartHistoryData("his_tg_p_curve_data", startTime, endTime, tgId);
				} else if (dates.size() >= 2) {
					if (dates.size() == 3) {
						String secondTime = formatter.format(dates.get(1));
						middleData = getHistoryData("his_tg_p_curve_data", secondTime, secondTime, tgId);
					} else if (dates.size() >= 4) {
						String secondTime = formatter.format(dates.get(1));
						String lSecondTime = formatter.format(dates.get(dates.size() - 2));
						middleData = getHistoryData("his_tg_p_curve_data", secondTime, lSecondTime, tgId);
					}
					// 第一天的数据
					dEnd = getNeedTime(23, 55, 0, startTime);
					String eTime = formatter.format(dEnd);
					firstData = getPartHistoryData("his_tg_p_curve_data", startTime, eTime, tgId);
					// 最后一天的数据
					dBegin = getNeedTime(0, 0, 0, endTime);
					String sTime = formatter.format(dBegin);
					lastData = getPartHistoryData("his_tg_p_curve_data", sTime, endTime, tgId);
				}
				decimal = firstData.add(middleData).add(lastData);
			} catch (ParseException e) {
				e.printStackTrace();
			}
		}
		if (StringUtil.isNotEmpty(endTime) && StringUtil.isEmpty(startTime)) {
			// 获取结束时间之前的数据
			String time = getSpecifiedDayBefore(endTime);
			BigDecimal beforeData = getHistoryData("his_tg_p_curve_data", null, time, tgId);
			dBegin = getNeedTime(0, 0, 0, endTime);
			String sTime = formatter.format(dBegin);
			BigDecimal todayData = getPartHistoryData("his_tg_p_curve_data", sTime, endTime, tgId);
			decimal = beforeData.add(todayData);
		}
		if (StringUtil.isEmpty(startTime) && StringUtil.isEmpty(endTime)) {
			decimal = getHistoryData("his_tg_p_curve_data", null, null, tgId);
		}
		decimal = (decimal.multiply(new BigDecimal(5)).divide(new BigDecimal(60), 2)).setScale(2);
		return decimal;
	}

	
	/**
	 * 获取不完整天的历史数据
	 *
	 * @param tableName
	 * @param startTime
	 * @param endTime
	 * @param tgId
	 * @return
	 */
	public BigDecimal getPartHistoryData(String tableName, String startTime, String endTime, String tgId) {
		StringBuffer sqlbuffer = new StringBuffer("");
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date d = DateUtils.str2Date(endTime, format);
		BigDecimal decimal = new BigDecimal(0);
		String s = joinSumString(startTime, endTime);
		List<Object> lista = new ArrayList<Object>();

		if (StringUtil.isNotEmpty(s)) {
			sqlbuffer.append("select  ");
			sqlbuffer.append(s);
			sqlbuffer.append(" sum_p from " + tableName + " where 1=1");
			if (!"".equals(tgId) && tgId != null) {
				sqlbuffer.append(" and TG_ID= "+tgId);
				//lista.add(tgId);
			}
			if (!"".equals(endTime) && endTime != null) {
				sqlbuffer.append(" and COLL_DATE = "+format.format(d));
			//	lista.add(format.format(d));
			}
			String sql = sqlbuffer.toString();
			
		//	Map<String, Object> map = this.findOneForJdbc(sql, lista.toArray());
			Map<String, Object> map =evTgDao.getSqlMapResult(sql);
			
			if (map != null) {
				if (map.get("sum_p") != null) {
					decimal = new BigDecimal((map.get("sum_p")).toString());
				}
			}
		}
		return decimal;
	}
	
	
	@Override
	public String joinSumString(String startTime, String endTime) {
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
		// 开始时间的小时数
		String sHour = sTime.substring(0, 2);
		// 开始时间的分钟数
		String sMinute = sTime.substring(sTime.length() - 2, sTime.length());
		// 结束时间的小时数
		String eHour = Etime.substring(0, 2);
		// 结束时间的分钟数
		String eMinute = Etime.substring(Etime.length() - 2, Etime.length());
		int hours = Integer.parseInt(sHour);
		int minutes = Integer.parseInt(sMinute);
		int houre = Integer.parseInt(eHour);
		int minutee = Integer.parseInt(eMinute);
		int sTimePoint = hours * 60 + minutes;
		int eTimePoint = houre * 60 + minutee;
		int s, e;
		if (sTimePoint % 5 == 0) {
			s = sTimePoint / 5;
		} else {
			s = (sTimePoint / 5) + 1;
		}
		if (eTimePoint % 5 == 0) {
			e = eTimePoint / 5;
		} else {
			e = (eTimePoint / 5);
		}
		// BigDecimal decimal;
		for (int j = s; j <= e; j++) {
			if (j * 5 > sTimePoint && j * 5 <= eTimePoint) {
				if ((j) < 10) {
					sqlbuffer.append(" IFNULL(D0" + j + ",0)+");
					/*
					 * decimal =new BigDecimal((map.get("D0"+j)).toString()); data.add(decimal);
					 */

				} else {
					sqlbuffer.append(" IFNULL(D" + j + ",0)+");
					/*
					 * decimal =new BigDecimal((map.get("D"+j)).toString()); data.add(decimal);
					 */
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
	 * 获取整天的历史数据
	 *
	 * @param tableName
	 * @param startTime
	 * @param endTime
	 * @param tgId
	 * @return
	 */
	public BigDecimal getHistoryData(String tableName, String startTime, String endTime, String tgId) {
		StringBuffer sqlbuffer = new StringBuffer("");
		BigDecimal decimal = new BigDecimal(0);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date e = DateUtils.str2Date(endTime, format);
		Date s = DateUtils.str2Date(startTime, format);
		List<Object> lista = new ArrayList<Object>();

		sqlbuffer.append("select  ");
		for (int j = 1; j < 289; j++) {
			if (j < 10) {
				sqlbuffer.append("sum(IFNULL(D0" + j + ",0)) + ");
			} else if (j < 288) {
				sqlbuffer.append("sum(IFNULL(D" + j + ",0)) + ");
			} else {
				sqlbuffer.append("sum(IFNULL(D" + j + ",0))");
			}
		}
		sqlbuffer.append(" sum_p from " + tableName + " where 1=1");

		if (!"".equals(tgId) && tgId != null) {
			sqlbuffer.append(" and TG_ID= '"+tgId+"'");
			//lista.add(tgId);
		}
		if (!"".equals(endTime) && endTime != null) {
			sqlbuffer.append(" and date(COLL_DATE) <= "+format.format(e));
			//lista.add(format.format(e));
		}
		if (!"".equals(startTime) && startTime != null) {
			sqlbuffer.append(" and date(COLL_DATE) >= "+format.format(s));
			//lista.add(format.format(s));
		}
		String sql = sqlbuffer.toString();
		List<Map<String, Object>> listMap =evTgDao.getSqlListResult(sql);
		for (Map<String, Object> map : listMap) {
			if (map != null) {
				if (map.get("sum_p") != null) {
					decimal = new BigDecimal((map.get("sum_p")).toString()).add(decimal);
				}
			}
		}

		return decimal;
	}
	
	@Override
	public BigDecimal getChargeAmount(String tgId, Map<String, Object> params) {
		/*
		 * String startTime = (String) params.get("startTime"); String endTime =
		 * (String) params.get("endTime");
		 */
		BigDecimal decimal = getChargeAmountByType(tgId, params, null);
		return decimal;
	}

	@Override
	public BigDecimal getChargeAmountByType(String tgId, Map<String, Object> params, String type) {
		String startTime = (String) params.get("startTime");
		String endTime = (String) params.get("endTime");
		BigDecimal b = getChargeAmountData(startTime, endTime, tgId, type);
		return b;
	}
	
	public BigDecimal getChargeAmountData(String startTime, String endTime, String tgId, String type) {
		StringBuffer sqlbuffer = new StringBuffer("");
		BigDecimal decimal = new BigDecimal(0);
		List<Object> lista = new ArrayList<Object>();

		sqlbuffer.append("select  ");
		sqlbuffer.append("sum(IFNULL(eo.totalChargeAmount,0))");
		sqlbuffer.append(" total_amount from ev_cg ec inner join ev_od  eo on ec.STAKENO=eo.STAKENO");
		if (!"".equals(tgId) && tgId != null) {
			sqlbuffer.append(" and ec.TG_ID= '"+tgId+"'" );
			//lista.add(tgId);
		}
		sqlbuffer.append(" where 1=1");
		if (!"".equals(type) && type != null) {
			sqlbuffer.append(" and eo.OD_MODEL= "+type);
			//lista.add(type);
		}
		if (!"".equals(endTime) && endTime != null) {
			sqlbuffer.append(" and eo.START_TIME <= "+endTime);
			//lista.add(endTime);
		}
		if (!"".equals(startTime) && startTime != null) {
			sqlbuffer.append(" and eo.START_TIME >= "+startTime);
			lista.add(startTime);
		}
		String sql = sqlbuffer.toString();
		//Map<String, Object> map = this.findOneForJdbc(sql, lista.toArray());
		Map<String, Object> map =evTgDao.getSqlMapResult(sql);
		if (map != null) {
			if (map.get("total_amount") != null) {
				decimal = new BigDecimal((map.get("total_amount")).toString());
			}
		}
		return decimal;

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
	private Date getNeedTime(int hour, int minute, int second, String specifiedDay) {
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
	
	/**
	 * 获得指定日期的前一天
	 *
	 * @param specifiedDay
	 * @return
	 */
	public String getSpecifiedDayBefore(String specifiedDay) {// 可以用new Date().toLocalString()传递参数
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

		String dayBefore = new SimpleDateFormat("yyyy-MM-dd").format(c.getTime());
		return dayBefore;
	}
	
	
	@Override
	public List<Map<String, Object>> getErInfoList(Map<String, Object> params, int pageSize, int pageNo) {
		StringBuffer sqlbuffer = new StringBuffer("");
		String tgNo = (String) params.get("tgNo");
		String orgNo = (String) params.get("orgNo");
		String stakeNo = (String) params.get("stakeNo");
		String stakeName = (String) params.get("stakeName");
		List<Map<String, Object>> list = null;
		// 台区编码不为空，直接作为判断条件
		if (!"".equals(orgNo) && orgNo != null) {
			String tgNos = orgService.getTgListofOrg(orgNo);
			if (!tgNos.isEmpty() && tgNos != null) {
				params.put("tgNos", tgNos);
			}
		}
		
		list = evTgDao.getErInfoList(params,pageSize,pageNo);
		return list;
	}
	
	
	@Override
	public BigDecimal getErTotalPower(String ErId, Map<String, Object> params) {
		// TODO Auto-generated method stub
			BigDecimal decimal = new BigDecimal(0);
			String startTime = (String) params.get("start_time");
			String endTime = (String) params.get("end_time");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			BigDecimal middleData = new BigDecimal(0);
			BigDecimal firstData = new BigDecimal(0);
			BigDecimal lastData = new BigDecimal(0);
			Date dBegin;
			Date dEnd;
			if (StringUtil.isNotEmpty(startTime)) {
				try {
					if (StringUtil.isEmpty(endTime)) {
						endTime = formatter.format(new Date());
					}
					dBegin = sdf.parse(startTime);
					dEnd = sdf.parse(endTime);
					List<Date> dates = TypeUtil.findDates(dBegin, dEnd);
					// 取第二天到倒数第二天的数据
					if (dates.size() == 1) {
						firstData = getPartHistoryData("his_cg_p_curve_data", startTime, endTime, ErId);
					} else if (dates.size() >= 2) {
						if (dates.size() == 3) {
							String secondTime = formatter.format(dates.get(1));
							middleData = getHistoryData("his_cg_p_curve_data", secondTime, secondTime, ErId);
						} else if (dates.size() >= 4) {
							String secondTime = formatter.format(dates.get(1));
							String lSecondTime = formatter.format(dates.get(dates.size() - 2));
							middleData = getHistoryData("his_cg_p_curve_data", secondTime, lSecondTime, ErId);
						}
						// 第一天的数据
						dEnd = TypeUtil.getNeedTime(23, 55, 0, startTime);
						String eTime = formatter.format(dEnd);
						firstData = getPartHistoryData("his_cg_p_curve_data", startTime, eTime, ErId);
						// 最后一天的数据
						dBegin = TypeUtil.getNeedTime(0, 0, 0, endTime);
						String sTime = formatter.format(dBegin);
						lastData = getPartHistoryData("his_cg_p_curve_data", sTime, endTime, ErId);
					}
					decimal = firstData.add(middleData).add(lastData);
				} catch (ParseException e) {
					e.printStackTrace();
				}
			}
			if (StringUtil.isNotEmpty(endTime) && StringUtil.isEmpty(startTime)) {
				// 获取结束时间之前的数据
				String time = getSpecifiedDayBefore(endTime);
				BigDecimal beforeData = getHistoryData("his_cg_p_curve_data", null, time, ErId);
				dBegin = TypeUtil.getNeedTime(0, 0, 0, endTime);
				String sTime = formatter.format(dBegin);
				BigDecimal todayData = getPartHistoryData("his_cg_p_curve_data", sTime, endTime, ErId);
				decimal = beforeData.add(todayData);
			}
			if (StringUtil.isEmpty(startTime) && StringUtil.isEmpty(endTime)) {
				decimal = getHistoryData("his_cg_p_curve_data", null, null, ErId);
			}
			decimal = (decimal.multiply(new BigDecimal(5)).divide(new BigDecimal(60), 2)).setScale(2);
			return decimal;
		
	}
	@Override
	public List<Map<String, Object>> getTgParamTableList(Map<String, Object> params, int pageNo, int pageSize) {
		String orgNo = (String) params.get("orgNo");
		StringBuffer sqlbuffer = new StringBuffer("");
		String orgNos = orgService.getOrgListofOrg(orgNo);
			if (orgNos != null) {
				params.put("orgNos", orgNos);
			}
			List<Map<String, Object>> list = evTgDao.getTgParamTableList(params,pageNo,pageSize);
			return list;
	}
	@Override
	public long getTgParamTableListCount(Map<String, Object> params) {
		// TODO Auto-generated method stub
		
		return evTgDao.getTgParamTableListCount(params);
	}
	
	
	@Override
	public Map<String,Object> getTgPowerDataByDate(Map<String, Object> param) {
		Map<String,Object> result = new HashMap<String,Object>();
        List<Double> data = new ArrayList<Double>();
        List<Long> time = new ArrayList<Long>();
		try {
			Date dBegin = TypeUtil.getDate(param.get("startDate"), "yyyy-MM-dd");
			Date dEnd = TypeUtil.getDate(param.get("endDate"), "yyyy-MM-dd");
			List<Date> findDates = CommonUtils.findDates(dBegin, dEnd);
			for (int i = 0; i < findDates.size(); i++) {
				param.put("collDate", TypeUtil.getFormatStringByDate(findDates.get(i),"yyyy-MM-dd"));
			    List<Map<String, Object>> todayPowerData =  evTgDao.getTgPowerDataByDate(param);
			    List<Double> dayslist = CommonUtils.getDataList(todayPowerData);
			    List<Long> dataTimeList = CommonUtils.getDataTimeList(todayPowerData);
			    data.addAll(dayslist);
			    time.addAll(dataTimeList);
			}
			result.put("data", data);
			result.put("time", time);
			
		} catch (ParseException e) {
			e.printStackTrace();
		}
        return result;
	}
	
	@Override
	public Map<String,Object> getTgForecastByDate(Map<String, Object> param) {
    	Map<String,Object> results = new HashMap<String,Object>();
        List<Double> data = new ArrayList<Double>();
        List<Long> time = new ArrayList<Long>();
		try {
			Date dBegin = TypeUtil.getDate(param.get("startDate"), "yyyy-MM-dd");
			Date dEnd = TypeUtil.getDate(param.get("endDate"), "yyyy-MM-dd");
			List<Date> findDates = CommonUtils.findDates(dBegin, dEnd);
			for (int i = 0; i < findDates.size(); i++) {
				param.put("frDate", TypeUtil.getFormatStringByDate(findDates.get(i), "yyyy-MM-dd"));
				List<Map<String, Object>> todayPowerData = evTgDao.getTgForecastByDate(param);
				List<Double> dayslist = CommonUtils.getDataList(todayPowerData);
 			    List<Long> dataTimeList = CommonUtils.getDataTimeList(todayPowerData);
 			    data.addAll(dayslist);
 			    time.addAll(dataTimeList);
			}
			results.put("data", data);
			results.put("time", time);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return results;
	}
	
}
