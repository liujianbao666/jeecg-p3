package com.jeecg.personalstake.chargepile.service;

import java.util.List;
import java.util.Map;

import org.jeecgframework.minidao.pojo.MiniDaoPage;

import com.jeecg.personalstake.chargepile.entity.EvCgEntity;

/**
 * 描述：充电桩档案
 * @author: www.jeecg.org
 * @since：2018年11月22日 14时11分56秒 星期四 
 * @version:1.0
 */
public interface EvCgService {
	public EvCgEntity get(String id);

	public int update(EvCgEntity evCg);

	public void insert(EvCgEntity evCg);

	public MiniDaoPage<Map> getAll(Map evCg,int page,int rows);

	public void delete(EvCgEntity evCg);

	public List<Map<String, Object>> getChargingPileChargingAmountData(Map<String, Object> params, int pageNo,
			int pageSize);

	public long ChargingPileChargingAmountDataCount(Map<String, Object> params);

	public List<Map<String, Object>> getChargingPileDisChargeList(int pageNo, int pageSize, Map<String, Object> params);

	public long getChargingPileDisChargeListCount(Map<String, Object> params);
	
}
