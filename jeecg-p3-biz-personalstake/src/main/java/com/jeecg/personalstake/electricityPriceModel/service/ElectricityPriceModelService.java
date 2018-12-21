package com.jeecg.personalstake.electricityPriceModel.service;

import java.util.List;
import java.util.Map;

public interface ElectricityPriceModelService {

	List<Map<String, Object>> getMultiElePriceModelList(Integer limit, Integer offset, Map<String, Object> params);

	long getMultiElePriceModelListCount(Map<String, Object> params);

	long getTimeElePriceModelListCount(Map<String, Object> params);

	List<Map<String, Object>> getTimeElePriceModelList(Integer limit, Integer offset, Map<String, Object> params);

	public Map<String,Object> getProvOrgByOrg(String org);
	
	Map<String, Object> getElecPrice(Map<String,Object> param);
}
