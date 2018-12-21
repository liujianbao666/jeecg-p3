package com.jeecg.personalstake.chargepile.service;

import java.util.Map;


/**
 * 描述：充电桩历史曲线
 * @author: www.jeecg.org
 * @since：2018年11月23日 13时45分00秒 星期五 
 * @version:1.0
 */
public interface HisCgCurveDataService {
	public Map<String,Object> getHistoryPowerData(Map<String,Object> param);
	public Map<String,Object> getHistoryVoltageData(Map<String,Object> param);
	public Map<String,Object> getHistoryElectricData(Map<String,Object> param);
	//充电桩充电功率曲线
	public Map<String,Object> getHistoryPowerDataByTgId(Map<String, Object> map);
}
