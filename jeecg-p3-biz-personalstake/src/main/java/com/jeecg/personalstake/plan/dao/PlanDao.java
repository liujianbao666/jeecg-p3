package com.jeecg.personalstake.plan.dao;

import java.util.List;
import java.util.Map;

import org.jeecgframework.minidao.annotation.Param;
import org.jeecgframework.minidao.annotation.ResultType;
import org.jeecgframework.minidao.annotation.Sql;
import org.jeecgframework.minidao.pojo.MiniDaoPage;
import org.springframework.stereotype.Repository;

import com.jeecg.personalstake.order.entity.EvOdEntity;
import com.jeecg.personalstake.plan.entity.HisEvCgPlan;

/**
 * 描述：日志表
 * @author：www.jeecg.org
 * @since：2018年11月21日 14时39分50秒 星期三 
 * @version:1.0
 */
@Repository
public interface PlanDao{

    /**
	 * 查询返回Java对象
	 * @param id
	 * @return
	 */
	@Sql("SELECT * FROM ev_od WHERE ID = :id")
	EvOdEntity get(@Param("id") String id);
	
	/**
	 * 修改数据
	 * @param evOd
	 * @return
	 */
	int update(@Param("evOd") EvOdEntity evOd);
	
	/**
	 * 插入数据
	 * @param act
	 */
	void insert(@Param("evOd") EvOdEntity evOd);
	
	/**
	 * 通用分页方法，支持（oracle、mysql、SqlServer、postgresql）
	 * @param evOd
	 * @param page
	 * @param rows
	 * @return
	 */
	@ResultType(Map.class)
	public MiniDaoPage<Map>  getAll(@Param("evOd") EvOdEntity evOd,@Param("page")  int page,@Param("rows") int rows);
	
	@Sql("DELETE from ev_od WHERE ID = :id")
	public void delete(@Param("id") String id);
	
	/**
	 * 根据ID删除
	 * @param id
	 */
	 @Sql("DELETE from ev_od WHERE ID = :id")
	 public void deleteById(@Param("id") String id);
	 
	 
	 @ResultType(Map.class)
	 MiniDaoPage<Map> getHistoryPlanList(@Param("params")Map params,@Param("page")  int pageNo,@Param("rows") int pageSize);
	
	 
	 
	  @Sql("select * from his_ev_cg_plan where  OD_ID=:odId and STATUS=2 and PLAN_COUNT='1' order by START_TIME")
	  public List<HisEvCgPlan>  getOrderFirstPlan(@Param("odId") String odId);
	  
	  @Sql("select * from his_ev_cg_plan where  OD_ID=:odId and STATUS=2  order by PLAN_COUNT,SERIAL_NUM")
	  public List<HisEvCgPlan>  getOrderAllPlan(@Param("odId") String odId);

	  
	  @Sql("SELECT * FROM ev_od od,ev_demand demand,ev_vh vh WHERE demand.ODID = od.OD_ID AND demand.VH_ID = vh.VH_ID AND od.OD_ID= :odId")
	  public  Map<String, Object> getVhInfo(@Param("odId") String orderId);
	 
}

