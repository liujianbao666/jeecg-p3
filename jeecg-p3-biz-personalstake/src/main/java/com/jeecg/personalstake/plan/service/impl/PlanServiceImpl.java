package com.jeecg.personalstake.plan.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.jeecg.personalstake.order.dao.EvOdDao;
import com.jeecg.personalstake.order.entity.EvOdEntity;
import com.jeecg.personalstake.plan.dao.PlanDao;
import com.jeecg.personalstake.plan.entity.HisEvCgPlan;
import com.jeecg.personalstake.plan.service.PlanService;
import com.jeecg.personalstake.util.CommonUtils;
import com.jeecg.personalstake.util.Tools;
import com.jeecg.personalstake.util.TypeUtil;
import org.jeecgframework.minidao.pojo.MiniDaoPage;
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

@Service("planService")
public class PlanServiceImpl implements PlanService {
	@Resource
	private PlanDao planDao;
	@Resource
	private EvOdDao evOdDao;
	
	
	
	@Override
	public MiniDaoPage<Map> getHistoryPlanList(Map params, int pageNo, int pageSize) {
		// TODO Auto-generated method stub

		return planDao.getHistoryPlanList(params, pageNo, pageSize);
	}

	
	
	@Override
	public JSONObject getPlanAndCap(String orderId) {
		
		JSONObject jsonObject = new JSONObject();
		try {
		EvOdEntity od = evOdDao.get(orderId);
		// 得到订单第一次计划
		List<HisEvCgPlan> orderFirstPlan = planDao.getOrderFirstPlan(orderId);
		List<BigDecimal> fristPlanPoint = plan2Point(orderFirstPlan, od.getCreateTime());
		// 得到订单第一次计划的电量
		List<BigDecimal> firstPlanCap = new ArrayList<BigDecimal>();
		BigDecimal temp = new BigDecimal(0);
		for (int i = 0;i<fristPlanPoint.size();i++) {
			BigDecimal bigDecimal = fristPlanPoint.get(i);
			if(bigDecimal!=null){
				temp = temp.add(bigDecimal.multiply(new BigDecimal(5)).divide(new BigDecimal(60), 2, BigDecimal.ROUND_HALF_UP));// 可用的电量;
				firstPlanCap.add(temp);
			}else{
				firstPlanCap.add(null);
			}
		}
		// 得到订单所有计划
		List<HisEvCgPlan> orderAllPlan = planDao.getOrderAllPlan(orderId);
		List<BigDecimal> allPlanPoint = plan2Point(orderAllPlan, od.getCreateTime());
		//得到计划的开始和结束索引
		Map<String, Integer> map = new HashMap<String,Integer>();
		if(!orderFirstPlan.isEmpty()){
			map = getPlanListStartAndEndPoint(od, orderAllPlan);
		}
		// 得到订单所有计划的电量
		List<BigDecimal> allPlanCap = new ArrayList<BigDecimal>();
		temp = new BigDecimal(0);
		for (int i = 0;i<allPlanPoint.size();i++) {
			BigDecimal bigDecimal = allPlanPoint.get(i);
			if(bigDecimal!=null){
				temp = temp.add(bigDecimal.multiply(new BigDecimal(5)).divide(new BigDecimal(60), 2, BigDecimal.ROUND_HALF_UP));// 可用的电量;
				allPlanCap.add(temp);
			}else{
				allPlanCap.add(null);
			}
		}

		int start = -1;
		int firstEnd = -1;
		if(!map.isEmpty()){
			start = map.get("start");
			firstEnd = map.get("end");
		}
		Map<String,Date> mapDate = new HashMap<String,Date>();
		
		mapDate.put("create_time", od.getCreateTime());
		
		
		
		jsonObject.put("start", start);
		jsonObject.put("firstEnd", firstEnd);
		jsonObject.put("firstPlan", fristPlanPoint);
		jsonObject.put("firstCap", firstPlanCap);
		jsonObject.put("allPlan", allPlanPoint);
		jsonObject.put("allCap", allPlanCap);
		
		jsonObject.put("mapDate", mapDate);
		
		return jsonObject;
		}catch(Exception e) {
			e.printStackTrace();
			
		return jsonObject;
		}
	
	}
	
	
	
	// 一个订单的计划转换为576个点
	public List<BigDecimal> plan2Point(List<HisEvCgPlan> plans, Date date) {
		List<BigDecimal> pList = new ArrayList<BigDecimal>();
		for (int i = 0; i < 288 * 2; i++) {
			pList.add(null);
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");

		try {
			for (int i = 0; i < plans.size(); i++) {

				String startTime = TypeUtil.getFormatStringByDate(plans.get(i).getStartTime(), "yyyy-MM-dd");
				Date startDate = sdf.parse(sdf.format(plans.get(i).getStartTime()));
				String endTime =TypeUtil.getFormatStringByDate(plans.get(i).getEndTime(), "yyyy-MM-dd");
				Date endDate = sdf.parse(sdf.format(plans.get(i).getEndTime()));
				BigDecimal p = CommonUtils.getBigDecimal(plans.get(i).getP());

				// 计算每条数据的开始时间块
				int startCount = Tools.dateToMinutes(startDate);
				int start = startCount / 5;

				// 计算每条数据的结束时间块
				int endCount = Tools.dateToMinutes(endDate);
				int end = endCount / 5;
				if (endCount % 5 != 0) {
					end++;
				}

				// 订单计划第一天
				if (endTime.equals(TypeUtil.getFormatStringByDate(date, "yyyy-MM-dd"))) {
					for (int j = start; j < end; j++) {
						pList.set(j, p);
					}
				} else {
					// 订单计划第二天
					if (!startTime.equals(TypeUtil.getFormatStringByDate(date, "yyyy-MM-dd"))) {
						for (int j = 288 + start; j < 288 + end; j++) {
							pList.set(j, p);
						}
					} else {
						// 订单计划跨天
						for (int j = start; j < 288; j++) {
							pList.set(j, p);
						}
						for (int j = 288; j < 288 + end; j++) {
							pList.set(j, p);
						}
					}
				}
				// 最后一次计划
				if (i == plans.size() - 1) {
					// 最后一次计划的结束时间在订单第一天
					if (endTime.equals(TypeUtil.getFormatStringByDate(date, "yyyy-MM-dd"))) {
						for (int j = end; j < 288 * 2; j++) {
							pList.set(j, null);
						}
					} else { // 最后一次计划在订单第二天
						for (int j = end + 288; j < 288 * 2; j++) {
							pList.set(j, null);
						}
					}

				}

			}

		} catch (ParseException e) {
			e.printStackTrace();
		}

		return pList;
	}
	
	
	/**得到计划在576点的开始和结束索引
	 * @param od
	 * @param orderFirstPlan
	 */
	private Map<String,Integer> getPlanListStartAndEndPoint(EvOdEntity od, List<HisEvCgPlan> orderFirstPlan) {
		int start = -1 ;
		int end = 0;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		try {
			Date startDate = sdf.parse(sdf.format(orderFirstPlan.get(0).getStartTime()));
			// 计算数据开始时间块
			int startCount = Tools.dateToMinutes(startDate);
			start = startCount / 5;
			
			String endTime = TypeUtil.getFormatStringByDate(orderFirstPlan.get(orderFirstPlan.size()-1).getEndTime(), "yyyy-MM-dd");
			Date endDate = sdf.parse(sdf.format(orderFirstPlan.get(orderFirstPlan.size()-1).getEndTime()));
			
			// 计算数据的结束时间块
			int endCount = Tools.dateToMinutes(endDate);
			end = endCount / 5;
			if (endCount % 5 != 0) {
				end++;
			}
			//不是同一天
			if(!endTime.equals(TypeUtil.getFormatStringByDate( od.getCreateTime(), "yyyy-MM-dd"))){
				end =end+ 288;
			}
			
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		Map<String,Integer> map = new HashMap<String,Integer>();
		map.put("start", start);
		map.put("end", end-1);
		return map;
	}



	@Override
	public Map<String, Object> getVhInfo(String orderId) {
		// TODO Auto-generated method stub
		return planDao.getVhInfo(orderId);
	}
	
}
