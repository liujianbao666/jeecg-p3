package com.jeecg.personalstake.demand.dao;

import java.util.Map;

import org.jeecgframework.minidao.annotation.Param;
import org.jeecgframework.minidao.annotation.ResultType;
import org.jeecgframework.minidao.annotation.Sql;
import org.jeecgframework.minidao.pojo.MiniDaoPage;
import org.springframework.stereotype.Repository;

import com.jeecg.personalstake.demand.entity.EvDemandEntity;

/**
 * 描述：需求表
 * @author：www.jeecg.org
 * @since：2018年11月22日 14时05分30秒 星期四 
 * @version:1.0
 */
@Repository
public interface EvDemandDao{

    /**
	 * 查询返回Java对象
	 * @param id
	 * @return
	 */
	@Sql("SELECT * FROM ev_demand WHERE ODID = :id")
	EvDemandEntity get(@Param("id") String id);
	
	/**
	 * 修改数据
	 * @param evDemand
	 * @return
	 */
	int update(@Param("evDemand") EvDemandEntity evDemand);
	
	/**
	 * 插入数据
	 * @param act
	 */
	void insert(@Param("evDemand") EvDemandEntity evDemand);
	
	/**
	 * 通用分页方法，支持（oracle、mysql、SqlServer、postgresql）
	 * @param evDemand
	 * @param page
	 * @param rows
	 * @return
	 */
	@ResultType(EvDemandEntity.class)
	public MiniDaoPage<Map> getAll(@Param("evDemand") EvDemandEntity evDemand,@Param("page")  int page,@Param("rows") int rows);
	
	@Sql("DELETE from ev_demand WHERE ID = :id")
	public void delete(@Param("id") String id);
	
	/**
	 * 根据ID删除
	 * @param id
	 */
	 @Sql("DELETE from ev_demand WHERE ID = :id")
	 public void deleteById(@Param("id") String id);
	
}

