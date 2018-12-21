package com.jeecg.personalstake.chargepile.service.impl;

import com.jeecg.personalstake.chargepile.dao.HisCgCurveDataDao;
import com.jeecg.personalstake.chargepile.service.HisCgCurveDataService;
import com.jeecg.personalstake.util.CommonUtils;
import com.jeecg.personalstake.util.TypeUtil;

import org.springframework.stereotype.Service;

import javax.annotation.Resource;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 描述：充电桩历史曲线
 *
 * @author: www.jeecg.org
 * @since：2018年11月23日 13时45分00秒 星期五
 * @version:1.0
 */

@Service("hisCgCurveDataService")
public class HisCgCurveDataServiceImpl implements HisCgCurveDataService {
    @Resource
    private HisCgCurveDataDao hisCgCurveDataDao;

    @Override
    public Map<String,Object> getHistoryPowerData(Map<String, Object> param) {

    	Map<String,Object> results = new HashMap<String,Object>();
        List<Double> data = new ArrayList<Double>();
        List<Long> time = new ArrayList<Long>();
		try {
			Date dBegin = TypeUtil.getDate(param.get("startDate"), "yyyy-MM-dd");
			Date dEnd = TypeUtil.getDate(param.get("endDate"), "yyyy-MM-dd");
			List<Date> findDates = CommonUtils.findDates(dBegin, dEnd);
			for (int i = 0; i < findDates.size(); i++) {
				param.put("collDate", TypeUtil.getFormatStringByDate(findDates.get(i),"yyyy-MM-dd"));
			    List<Map<String, Object>> historyPowerData = hisCgCurveDataDao.getHistoryPowerData(param);
			    List<Double> dayslist = CommonUtils.getDataList(historyPowerData);
			    List<Long> dataTimeList = CommonUtils.getDataTimeList(historyPowerData);
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

    @Override
    public Map<String,Object> getHistoryVoltageData(Map<String, Object> param) {
    	Map<String,Object> results = new HashMap<String,Object>();
        List<Double> data = new ArrayList<Double>();
        List<Long> time = new ArrayList<Long>();
      		try {
      			Date dBegin = TypeUtil.getDate(param.get("startDate"), "yyyy-MM-dd");
      			Date dEnd = TypeUtil.getDate(param.get("endDate"), "yyyy-MM-dd");
      			List<Date> findDates = CommonUtils.findDates(dBegin, dEnd);
      			for (int i = 0; i < findDates.size(); i++) {
      				param.put("collDate", TypeUtil.getFormatStringByDate(findDates.get(i),"yyyy-MM-dd"));
      			    List<Map<String, Object>> historyVoltageData = hisCgCurveDataDao.getHistoryVoltageData(param);
      			    List<Double> dayslist = CommonUtils.getDataList(historyVoltageData);
    			    List<Long> dataTimeList = CommonUtils.getDataTimeList(historyVoltageData);
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

    @Override
    public Map<String,Object> getHistoryElectricData(Map<String, Object> param) {
    	Map<String,Object> results = new HashMap<String,Object>();
        List<Double> data = new ArrayList<Double>();
        List<Long> time = new ArrayList<Long>();
      		try {
      			Date dBegin = TypeUtil.getDate(param.get("startDate"), "yyyy-MM-dd");
      			Date dEnd = TypeUtil.getDate(param.get("endDate"), "yyyy-MM-dd");
      			List<Date> findDates = CommonUtils.findDates(dBegin, dEnd);
      			for (int i = 0; i < findDates.size(); i++) {
      				param.put("collDate", TypeUtil.getFormatStringByDate(findDates.get(i),"yyyy-MM-dd"));
      				List<Map<String, Object>> historyElectricData = hisCgCurveDataDao.getHistoryElectricData(param);
      			    List<Double> dayslist = CommonUtils.getDataList(historyElectricData);
    			    List<Long> dataTimeList = CommonUtils.getDataTimeList(historyElectricData);
    			    data.addAll(dayslist);
    			    time.addAll(dataTimeList);
      			}
      			results.put("data", data);
    			results.put("time", time);
      		} catch (ParseException e) {
      			// TODO Auto-generated catch block
      			e.printStackTrace();
      		}
             
              return results;
    }

	@Override
	public 	Map<String,Object> getHistoryPowerDataByTgId(Map<String, Object> param) {
		Map<String,Object> results = new HashMap<String,Object>();
        List<Double> data = new ArrayList<Double>();
        List<Long> time = new ArrayList<Long>();
		try {
			Date dBegin = TypeUtil.getDate(param.get("startDate"), "yyyy-MM-dd");
			Date dEnd = TypeUtil.getDate(param.get("endDate"), "yyyy-MM-dd");
			List<Date> findDates = CommonUtils.findDates(dBegin, dEnd);
			for (int i = 0; i < findDates.size(); i++) {
				param.put("collDate", TypeUtil.getFormatStringByDate(findDates.get(i),"yyyy-MM-dd"));
			    List<Map<String, Object>> todayPowerData =  hisCgCurveDataDao.getHistoryPowerDataByTgId(param);
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
