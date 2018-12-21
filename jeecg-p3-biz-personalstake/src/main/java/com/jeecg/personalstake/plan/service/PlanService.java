package com.jeecg.personalstake.plan.service;

import java.util.Map;

import org.jeecgframework.minidao.pojo.MiniDaoPage;

import com.alibaba.fastjson.JSONObject;
import com.jeecg.personalstake.order.entity.EvOdEntity;

/**
 * 描述：日志表
 * 
 * @author: www.jeecg.org
 * @since：2018年11月21日 14时39分50秒 星期三
 * @version:1.0
 */
public interface PlanService {

	public MiniDaoPage<Map> getHistoryPlanList(Map params, int pageNo, int pageSize);

	/**
	 * 得到计划和电量(576个点)
	 * @param orderId
	 * @return
	 */
	public JSONObject getPlanAndCap(String orderId);

	public Map<String, Object> getVhInfo(String orderId);

}
