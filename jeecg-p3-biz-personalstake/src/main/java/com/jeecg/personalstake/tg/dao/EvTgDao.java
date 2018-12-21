package com.jeecg.personalstake.tg.dao;

import org.jeecgframework.minidao.annotation.Param;
import org.jeecgframework.minidao.annotation.ResultType;
import org.jeecgframework.minidao.annotation.Sql;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


@Repository
public interface EvTgDao{
	
	/**
	 * 获取台区实时监控页面数据
	 */
	@ResultType(Map.class)
	List<Map<String, Object>> getTgRunTableList(@Param("params") Map<String, Object> params,@Param("page") int pageNo,@Param("rows") int pageSize);

	@Sql("SELECT * from g_tg limit 1")
	Map<String, Object> getFirstTgId(@Param("params") Map<String, Object> params);
	
	/**
	 * 获取台区概览页面立即充电曲线数据
	 */
	@Sql("SELECT * FROM big_screen_curve_normal WHERE  COll_DATE = CURDATE() AND TG_ID= :tgId")
	Map<String, Object> getNormal(@Param("tgId") String tgId);
	
	/**
	 * 获取台区概览页面策略计划曲线数据
	 */
	@Sql("SELECT * FROM big_screen_curve_orderly WHERE  COll_DATE = CURDATE() AND TG_ID=:tgId")
	Map<String, Object> getOrderly(@Param("tgId")String tgId);
	
	/**
	 * 获取台区概览页面台区负荷曲线数据
	 */
	@Sql("SELECT * FROM big_screen_curve_tg WHERE  COll_DATE = CURDATE() AND TG_ID=:tgId")
	Map<String, Object> getTg(@Param("tgId")String tgId);
	/**
	 * 获取台区概览页面预测曲线数据
	 */
	@Sql("SELECT * FROM  his_tg_P_curve_data  WHERE  COll_DATE = CURDATE() AND TG_ID= :tgId")
	Map<String, Object> getTgForecast(@Param("tgId") String tgId);

	/**
	 * 获取台区概览页面台区信息数据
	 */
	@Sql("SELECT tg.TG_CAP,run.DATA_TIME,run.RUN_P,(tg.TG_CAP*run.PLIM) as limitPower FROM ev_tg_run run,g_tg tg WHERE tg.tg_id = run.tg_id " + 
			" and TO_DAYS(run.DATA_TIME) = TO_DAYS( CURDATE()) " + 
			" AND tg.TG_ID=  :orgNo")
	Map<String, Object> tgInfo(@Param("orgNo") String orgNo);
	
	
	/**
	 * 获取台区概览页面需求信息数据
	 */
    @Sql("SELECT " + 
    		"	SUM(ev.CHARGING_DEMAND) AS power, " + 
    		"	SUM(OD_MODEL = 1) AS zc, " + 
    		"	SUM(OD_MODEL = 2) AS yx, " + 
    		"	COUNT(*) AS total " + 
    		"FROM " + 
    		"	ev_demand ev " + 
    		"WHERE " + 
    		"	ev.STAKENO IN ( " + 
    		"		SELECT " + 
    		"			cg.STAKENO " + 
    		"		FROM ev_cg cg, " + 
    		"			g_tg tg " + 
    		"		WHERE " + 
    		"			cg.TG_ID = tg.TG_ID " + 
    		"		AND tg.TG_ID = :tgid " + 
    		"	) " + 
    		"AND ev.USER_TYPE = '2' " + 
    		"AND TO_DAYS(ev.CREATE_TIME) = TO_DAYS(CURDATE())")
	Map<String, Object> needsInfo(@Param("tgid") String tgid);
    
    
    
	/**
	 * 获取台区概览页面订单总数
	 */
    @Sql("SELECT " + 
    		"	COUNT(*) AS NUM " + 
    		"FROM " + 
    		"	ev_od od " + 
    		"WHERE " + 
    		"	STAKENO IN  " + 
    		"				 ( " + 
    		"		SELECT " + 
    		"			cg.STAKENO " + 
    		"		FROM " + 
    		"			ev_cg cg, " + 
    		"			g_tg tg " + 
    		"		WHERE " + 
    		"			od.userType = '2' " + 
    		"		AND cg.TG_ID = tg.TG_ID " + 
    		"		AND tg.TG_ID =:tgid " + 
    		"	)  " + 
    		"AND TO_DAYS(od.CREATE_TIME) = TO_DAYS(CURDATE())")
	Map<String, Object> ordersInfo(@Param("tgid") String tgid);

	/**
	 * 获取台区概览页面有序订单数
	 */
    @Sql("SELECT " + 
    		"	COUNT(*) AS NUM " + 
    		"FROM " + 
    		"	ev_od od " + 
    		"WHERE " + 
    		"	STAKENO IN  " + 
    		"				 ( " + 
    		"		SELECT " + 
    		"			cg.STAKENO " + 
    		"		FROM " + 
    		"			ev_cg cg, " + 
    		"			g_tg tg " + 
    		"		WHERE " + 
    		"			od.userType = '2' " + 
    		"		AND cg.TG_ID = tg.TG_ID " + 
    		"		AND tg.TG_ID =:tgid " + 
    		"	)  " + 
    		"AND TO_DAYS(od.CREATE_TIME) = TO_DAYS(CURDATE()) AND od.OD_MODEL=1")
	Map<String, Object> yxOrdersInfo(@Param("tgid") String tgid);
    
    
	/**
	 * 获取台区概览页面订单信息中的订单号
	 */
    @Sql("SELECT " + 
    		"	od_id " + 
    		"FROM " + 
    		"	ev_od od " + 
    		"WHERE " + 
    		"	od.userType = '2' " + 
    		"AND od.STAKENO IN   " + 
    		"			 ( " + 
    		"	SELECT " + 
    		"		cg.STAKENO " + 
    		"	FROM " + 
    		"		ev_cg cg, " + 
    		"		g_tg tg " + 
    		"	WHERE " + 
    		"		tg.TG_ID = cg.TG_ID " + 
    		"	AND tg.TG_ID =:tgid " + 
    		") " + 
    		"AND TO_DAYS(od.CREATE_TIME) = TO_DAYS(CURDATE())")
	List<Map<String, Object>> planOrderList(@Param("tgid") String tgid);
    
	/**
	 * 获取台区概览页面计划总数
	 */
    @Sql("SELECT MAX(plan_count) as odcount FROM his_ev_cg_plan WHERE od_id=? ;")
	Map<String, Object> planCount(@Param("odid") String odid);
    
    
	/**
	 * 获取台区概览页面失败计划总数
	 */
    @Sql("SELECT " + 
    		"	count(*) AS planDCount " + 
    		"FROM " + 
    		"	his_ev_cg_plan plan, " + 
    		"	ev_od od " + 
    		"WHERE " + 
    		"	plan.od_id = od.od_id " + 
    		"AND od.userType = '2' " + 
    		"AND STATUS = 3 " + 
    		"AND TO_DAYS(CREATE_TIME) = TO_DAYS(CURDATE())")
	Map<String, Object> hisPlanCount();
    
    
    
    @Sql("SELECT " + 
    		"	od_id " + 
    		"FROM " + 
    		"	ev_od od " + 
    		"WHERE " + 
    		"	od.STAKENO IN   " + 
    		"				  ( " + 
    		"		SELECT " + 
    		"			cg.STAKENO " + 
    		"		FROM " + 
    		"			ev_cg cg, " + 
    		"			g_tg tg " + 
    		"		WHERE " + 
    		"			tg.TG_ID = cg.TG_ID " + 
    		"		AND tg.TG_ID =:tgid " + 
    		"	) " + 
    		"AND od.userType = '2' " + 
    		"AND TO_DAYS(CREATE_TIME) = TO_DAYS(CURDATE())")
	List<Map<String, Object>> dispatchsOrderList(@Param("tgid") String tgid);
   
    
    
    @Sql("SELECT MAX(plan_count) as odcount FROM his_ev_cg_plan WHERE od_id=:odid ")
	Map<String, Object> dispatchsPlanCount(@Param("odid") String odid);
    
    @Sql("SELECT " + 
    		"	count(*) AS planDCount " + 
    		"FROM " + 
    		"	his_ev_cg_plan plan, " + 
    		"	ev_od od " + 
    		"WHERE " + 
    		"	plan.od_id = od.od_id " + 
    		"AND od.userType = '2' " + 
    		"AND STATUS = 1 " + 
    		"AND TO_DAYS(CREATE_TIME) = TO_DAYS(CURDATE())")
  	Map<String, Object> dispatchsPlanDCount();
    
    /**
     * 获取台区总负荷数据
     */
    @Sql("select * from HIS_TG_P_CURVE_DATA where TG_ID =:params.tgId and DATA_TYPE =:params.dataType and COLL_DATE =:params.collDate")
	List<Map<String, Object>> getTgPowerDataByDate(@Param("params") Map params);
  
    /**
     * 获取台区预测负荷数据
     */
    @Sql("select * from ev_tg_forecast where tg_id=:params.tgId  and FR_DATE = :params.frDate")
	List<Map<String, Object>> getTgForecastByDate(@Param("params") Map params);
    
    /**
     * 执行拼接的sql  返回值为list
     */
    @Sql("${sql}")
	List<Map<String, Object>> getSqlListResult(@Param("sql") String sql);
   
    /**
     * 获取组织机构号下的台区信息
     */
	List<Map<String, Object>> getTgInfoList(@Param("rows") int pageSize,@Param("page") int pageNo,@Param("params") Map<String, Object> params);
 
    /**
     * 获取组织机构号下的台区总数
     * @param params
     * @return
     */
	long getTgInfoListCount(@Param("params") Map<String, Object> params);
	/**
     * 执行拼接的sql  返回值为map
     */
	   @Sql("${sql}")
	Map<String, Object> getSqlMapResult(@Param("sql") String sql);
	   /**
	     * 获取组织机构号下的充电桩信息
	     */
		@ResultType(Map.class)
	List<Map<String, Object>> getErInfoList(@Param("params") Map<String, Object> params,@Param("rows") int pageSize,@Param("page") int pageNo);

	int ChargingPileChargingAmountDataCount(@Param("params") Map<String, Object> params);

	/**
	 * 获取台区参数信息列表
	 * @param params
	 * @param pageNo
	 * @param pageSize
	 * @return
	 */
	List<Map<String, Object>> getTgParamTableList(@Param("params") Map<String, Object> params,@Param("page") int pageNo,@Param("rows") int pageSize);
	/**
	 * 获取台区参数信息列表总数
	 */
	long getTgParamTableListCount(@Param("params")Map<String, Object> params);

}

