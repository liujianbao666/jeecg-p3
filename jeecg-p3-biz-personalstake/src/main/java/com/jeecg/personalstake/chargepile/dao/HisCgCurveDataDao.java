package com.jeecg.personalstake.chargepile.dao;

import org.jeecgframework.minidao.annotation.Param;
import org.jeecgframework.minidao.annotation.ResultType;
import org.jeecgframework.minidao.annotation.Sql;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * 描述：充电桩历史曲线
 * @author：liu_jianbao
 * @since：2018年11月23日 13时45分00秒 星期五 
 * @version:1.0
 */
@Repository
public interface HisCgCurveDataDao{

    /**
     * 查询功率曲线
     * @param param
     * @return
     */
	@Sql("SELECT * FROM his_cg_p_curve_data	WHERE CG_ID = :param.cgId AND COLL_DATE = :param.collDate")
	List<Map<String,Object>> getHistoryPowerData(@Param("param") Map<String,Object> param);
    /**
     * 查询电压曲线
     * @param param
     * @return
     */
	@ResultType(Map.class)
	@Sql("SELECT * FROM his_cg_u_curve_data WHERE CG_ID = :param.cgId AND COLL_DATE = :param.collDate")
	List<Map<String,Object>> getHistoryVoltageData(@Param("param") Map<String,Object> param);
    /**
     * 查询电流曲线
     * @param param
     * @return
     */
	@ResultType(Map.class)
	@Sql("SELECT * FROM his_cg_i_curve_data WHERE CG_ID = :param.cgId AND COLL_DATE = :param.collDate")
	List<Map<String,Object>> getHistoryElectricData(@Param("param") Map<String,Object> param);
	
	/***
	 * 查询台区下的所有充电桩的总功率
	 * @param param
	 * @return
	 */
	@ResultType(Map.class)
	List<Map<String, Object>> getHistoryPowerDataByTgId(@Param("params") Map<String, Object> param);
	
	
}

