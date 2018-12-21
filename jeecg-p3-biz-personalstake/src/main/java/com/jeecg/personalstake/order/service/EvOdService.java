package com.jeecg.personalstake.order.service;

import java.util.Map;

import org.jeecgframework.minidao.pojo.MiniDaoPage;

import com.jeecg.personalstake.order.entity.EvOdEntity;

/**
 * 描述：日志表
 * @author: www.jeecg.org
 * @since：2018年11月21日 14时39分50秒 星期三 
 * @version:1.0
 */
public interface EvOdService {
	public EvOdEntity get(String id);

	public int update(EvOdEntity evOd);

	public void insert(EvOdEntity evOd);

	public MiniDaoPage<Map> getAll(EvOdEntity evOd,int page,int rows);

	public void delete(String id);
	
	public void batchDelete(String[] ids);
	
}
