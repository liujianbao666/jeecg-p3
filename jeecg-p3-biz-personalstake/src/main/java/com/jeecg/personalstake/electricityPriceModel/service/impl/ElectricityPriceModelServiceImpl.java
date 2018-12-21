package com.jeecg.personalstake.electricityPriceModel.service.impl;

import com.jeecg.personalstake.electricityPriceModel.dao.ElectricityPriceModelDao;
import com.jeecg.personalstake.electricityPriceModel.service.ElectricityPriceModelService;
import com.jeecg.personalstake.util.CommonUtils;
import com.jeecg.personalstake.util.TypeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.*;


@Service
public class ElectricityPriceModelServiceImpl  implements ElectricityPriceModelService {

	@Autowired 
	private ElectricityPriceModelDao electricityPriceModelDao;
	
/**
 * 查询阶梯电价数据
 */
	@Override
	public List<Map<String, Object>> getMultiElePriceModelList(Integer pageSize, Integer pageNo,
			Map<String, Object> params) {
		
		List<Map<String, Object>> list = electricityPriceModelDao.getMultiElePriceModelList(pageSize,pageNo,params);
		return list;
	}
	/**
	 * 查询阶梯电价数据总数
	 */
	@Override
	public long getMultiElePriceModelListCount(Map<String, Object> params) {

		Long totalrecord = electricityPriceModelDao.getMultiElePriceModelListCount(params);
		return totalrecord;
	}
	/**
	 * 查询分时电价数据总数
	 */
	@Override
	public long getTimeElePriceModelListCount(Map<String, Object> params) {

		Long totalrecord = electricityPriceModelDao.getTimeElePriceModelListCount(params);
		
		return totalrecord;
	}
	/**
	 * 查询分时电价数据
	 */
	@Override
	public List<Map<String, Object>> getTimeElePriceModelList(Integer pageSize, Integer pageNo,
			Map<String, Object> params) {

		List<Map<String, Object>> list = electricityPriceModelDao.getTimeElePriceModelList(pageSize,pageNo,params);
		return list;
	}

	/**
	 *  通过下级组织机构获取省级组织机构号
	 */
	@Override
	public Map<String, Object> getProvOrgByOrg(String org) {

		if (org.length() > 5) {
			org = org.substring(0, 5);
		}
		Map<String, Object> res =  electricityPriceModelDao.getProvOrgByOrg(org);

		return res;
	}
	
	@Override
	public Map<String, Object> getElecPrice(Map<String,Object> param) {
		Map<String,Object> results = new HashMap<String,Object>();
        List<Double> data = new ArrayList<Double>();
        List<Long> time = new ArrayList<Long>();
		try {
			Date dBegin = TypeUtil.getDate(param.get("startDate"), "yyyy-MM-dd");
			Date dEnd = TypeUtil.getDate(param.get("endDate"), "yyyy-MM-dd");
			List<Date> findDates = CommonUtils.findDates(dBegin, dEnd);
			List<Map<String, Object>> elePricesList = electricityPriceModelDao.getElecPrice(param);
			for (int i = 0; i < findDates.size(); i++) {
				for (Map<String, Object> elePric : elePricesList) {
					Date startTime = TypeUtil.getDate(elePric.get("start_time"), "HH:mm:ss");
					Date endTime = TypeUtil.getDate(elePric.get("end_time"), "HH:mm:ss");
					Double price =  TypeUtil.getDouble(elePric.get("price"));
					if(startTime.getTime()-endTime.getTime()>0) {//开始时间大于结束时间跨天以00:00拆分
					    data.add(price);
					    time.add(findDates.get(i).getTime());
					    data.add(price);
					    time.add(TypeUtil.getDate(TypeUtil.getFormatStringByDate(findDates.get(i), "yyyy-MM-dd ")+"23:59:59", "yyyy-MM-dd HH:mm:ss").getTime());
					}
				    data.add(price);
				    time.add(TypeUtil.getDate(TypeUtil.getFormatStringByDate(findDates.get(i), "yyyy-MM-dd ")+TypeUtil.getStr(elePric.get("start_time")), "yyyy-MM-dd HH:mm:ss").getTime());
				    data.add(price);
				    time.add(TypeUtil.getDate(TypeUtil.getFormatStringByDate(findDates.get(i), "yyyy-MM-dd ")+TypeUtil.getStr(elePric.get("end_time")), "yyyy-MM-dd HH:mm:ss").getTime());
				}
			}
			//冒泡排序
			for (int i = 0; i < time .size(); i++) {  
		        for (int j = time .size()-1; j > i; j--)  {  
		            Long no= time .get(j);
		            Long no_1= time .get(j-1);
		            if (no.compareTo(no_1)<0)    {  
		                 Long  tmp = time.get(j);
		                 time.set(j, time.get(j-1));
		                 time.set(j-1, tmp );
		                 Double  tmpdata = data.get(j);
		                 data.set(j, data.get(j-1));
		                 data.set(j-1, tmpdata );
		            }  
		        }  
			} 
			results.put("data", data);
			results.put("time", time);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return results;
	}

}
