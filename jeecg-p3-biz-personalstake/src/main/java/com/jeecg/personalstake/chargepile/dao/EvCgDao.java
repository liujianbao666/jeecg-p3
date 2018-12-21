package com.jeecg.personalstake.chargepile.dao;

import java.util.List;
import java.util.Map;

import org.jeecgframework.minidao.annotation.Param;
import org.jeecgframework.minidao.annotation.ResultType;
import org.jeecgframework.minidao.annotation.Sql;
import org.jeecgframework.minidao.pojo.MiniDaoPage;
import org.springframework.stereotype.Repository;

import com.jeecg.personalstake.chargepile.entity.EvCgEntity;

/**
 * 描述：充电桩档案
 * @author：www.jeecg.org
 * @since：2018年11月22日 14时11分56秒 星期四 
 * @version:1.0
 */
@Repository
public interface EvCgDao{

    /**
	 * 查询返回Java对象
	 * @param id
	 * @return
	 */
	@Sql("SELECT * FROM ev_cg WHERE ID = :id")
	EvCgEntity get(@Param("id") String id);
	
	/**
	 * 修改数据
	 * @param evCg
	 * @return
	 */
	int update(@Param("evCg") EvCgEntity evCg);
	
	/**
	 * 插入数据
	 * @param act
	 */
	void insert(@Param("evCg") EvCgEntity evCg);
	
	/**
	 * 通用分页方法，支持（oracle、mysql、SqlServer、postgresql）
	 * @param evCg
	 * @param page
	 * @param rows
	 * @return
	 */
	@ResultType(Map.class)
	public MiniDaoPage<Map> getAll(@Param("evCg") Map evCg,@Param("page")  int page,@Param("rows") int rows);
	
	@Sql("DELETE from ev_cg WHERE ID = :evCg.id")
	public void delete(@Param("evCg") EvCgEntity evCg);

	List<Map<String, Object>> getChargingPileDisChargeList(@Param("page") int pageNo,@Param("rows") int pageSize,@Param("params") Map<String, Object> params);

	long getChargingPileDisChargeListCount(@Param("params") Map<String, Object> params);
	
}

