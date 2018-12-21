package com.jeecg.personalstake.order.service.impl;

import java.util.Map;
import java.util.UUID;

import javax.annotation.Resource;

import org.jeecgframework.minidao.pojo.MiniDaoPage;
import org.springframework.stereotype.Service;

import com.jeecg.personalstake.order.dao.EvOdDao;
import com.jeecg.personalstake.order.entity.EvOdEntity;
import com.jeecg.personalstake.order.service.EvOdService;

/**
 * 描述：订单表
 * @author: www.jeecg.org
 * @since：2018年11月21日 14时39分50秒 星期三 
 * @version:1.0
 */

@Service("evOdService")
public class EvOdServiceImpl implements EvOdService {
	@Resource
	private EvOdDao evOdDao;

	@Override
	public EvOdEntity get(String id) {
		return evOdDao.get(id);
	}

	@Override
	public int update(EvOdEntity evOd) {
		return evOdDao.update(evOd);
	}

	@Override
	public void insert(EvOdEntity evOd) {
		String randomSeed = UUID.randomUUID().toString().replaceAll("-", "").toUpperCase();
		//evOd.setId(randomSeed);
		evOdDao.insert(evOd);
		
	}

	@Override
	public MiniDaoPage<Map>  getAll(EvOdEntity evOd, int page, int rows) {
		return evOdDao.getAll(evOd, page, rows);
	}

	@Override
	public void delete(String id) {
		evOdDao.delete(id);
		
	}
	
	@Override
	public void batchDelete(String[] ids) {
		for(int i = 0; i < ids.length; i++) {
			String id = ids[i];
			evOdDao.deleteById(id);
		}
	}
}
