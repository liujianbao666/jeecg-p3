package com.jeecg.personalstake.tg.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 描述：日志表
 * 
 * @author: www.jeecg.org
 * @since：2018年11月21日 14时39分50秒 星期三
 * @version:1.0
 */
public interface EvTgService {

	List<Map<String, Object>> getTgRunTableList(Map<String, Object> params, int pageNo, int pageSize);

	Map<String, Object> getFirstTgId(Map<String, Object> params);

	List<BigDecimal> getNormal(String tgId);

	List<BigDecimal> getOrderly(String tgId);

	List<BigDecimal> getTg(String tgId);

	List<BigDecimal> getTgForecast(String tgId);

	Map<String, Object> tgInfo(String orgNo);

	Map<String, Object> needsInfo(String orgNo);

	Map<String, Object> ordersInfo(String orgNo);

	Map<String, Object> plansInfo(String orgNo);

	Map<String, Object> dispatchsInfo(String orgNo);
	
	//负荷曲线
	Map<String,Object> getTgPowerDataByDate(Map<String, Object> param);
	//预测曲线
	Map<String,Object> getTgForecastByDate(Map<String, Object> map);

	List<String> getTimeIntervalPoint(String pLimStr, List<String> tgTime);

	List<Map<String, Object>> getTgUserEleList(Map<String, Object> params, int pageNo, int pageSize);


	BigDecimal getTgUserPower(String tgId, Map<String, Object> params);

	String joinSumString(String startTime, String endTime);

	BigDecimal getChargeAmount(String tgId, Map<String, Object> params);

	BigDecimal getChargeAmountByType(String tgId, Map<String, Object> params, String type);

	List<Map<String, Object>> getErInfoList(Map<String, Object> params, int pageSize, int pageNo);

	BigDecimal getErTotalPower(String erId, Map<String, Object> params);

	long getTgUserEleListCount(Map<String, Object> params);

	List<Map<String, Object>> getTgParamTableList(Map<String, Object> params, int pageNo, int pageSize);

	long getTgParamTableListCount(Map<String, Object> params);


}
