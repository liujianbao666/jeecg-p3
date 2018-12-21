package com.jeecg.personalstake.demand.service;

import java.util.Map;

import org.jeecgframework.minidao.annotation.Param;
import org.jeecgframework.minidao.pojo.MiniDaoPage;

import com.jeecg.personalstake.demand.entity.EvDemandEntity;

/**
 * 描述：需求表
 * @author: www.jeecg.org
 * @since：2018年11月22日 14时05分30秒 星期四 
 * @version:1.0
 */
public interface EvDemandService {
	public EvDemandEntity get(String id);

	public int update(EvDemandEntity evDemand);

	public void insert(EvDemandEntity evDemand);


	public MiniDaoPage<Map> getAll(EvDemandEntity evDemand,int page,int rows);
	
	public void delete(String id);
	
	public void batchDelete(String[] ids);
	
}
