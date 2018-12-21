package com.jeecg.personalstake.demand.service.impl;

import javax.annotation.Resource;

import java.util.Map;
import java.util.UUID;

import org.jeecgframework.minidao.pojo.MiniDaoPage;
import org.springframework.stereotype.Service;

import com.jeecg.personalstake.demand.dao.EvDemandDao;
import com.jeecg.personalstake.demand.entity.EvDemandEntity;
import com.jeecg.personalstake.demand.service.EvDemandService;

/**
 * 描述：需求表
 * @author: www.jeecg.org
 * @since：2018年11月22日 14时05分30秒 星期四 
 * @version:1.0
 */

@Service("evDemandService")
public class EvDemandServiceImpl implements EvDemandService {
	@Resource
	private EvDemandDao evDemandDao;

	@Override
	public EvDemandEntity get(String id) {
		return evDemandDao.get(id);
	}

	@Override
	public int update(EvDemandEntity evDemand) {
		return evDemandDao.update(evDemand);
	}

	@Override
	public void insert(EvDemandEntity evDemand) {
		String randomSeed = UUID.randomUUID().toString().replaceAll("-", "").toUpperCase();
//		evDemand.set(randomSeed);
		evDemandDao.insert(evDemand);
		
	}

	@Override
	public MiniDaoPage<Map> getAll(EvDemandEntity evDemand, int page, int rows) {
		return evDemandDao.getAll(evDemand, page, rows);
	}

	@Override
	public void delete(String id) {
		evDemandDao.delete(id);
		
	}
	
	@Override
	public void batchDelete(String[] ids) {
		for(int i = 0; i < ids.length; i++) {
			String id = ids[i];
			evDemandDao.deleteById(id);
		}
	}
}
