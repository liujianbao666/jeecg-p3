package com.jeecg.personalstake.electricityPriceModel.dao;

import java.util.List;
import java.util.Map;

import org.jeecgframework.minidao.annotation.Param;
import org.jeecgframework.minidao.annotation.Sql;
import org.springframework.stereotype.Repository;

@Repository
public interface ElectricityPriceModelDao {

	@Sql("SELECT " + 
			"	CASE " + 
			"WHEN x.org_type = '2' THEN " + 
			"	x.org_code " + 
			"ELSE " + 
			"	x.parentdepartid " + 
			"END AS orgcode " + 
			"FROM " + 
			"	( " + 
			"		SELECT " + 
			"			* " + 
			"		FROM " + 
			"			t_s_depart t " + 
			"		WHERE " + 
			"			t.org_code = :org " + 
			"	) x")
	Map<String, Object> getProvOrgByOrg(@Param("org") String org);

	@Sql("SELECT " + 
			"	x.*, tsd.departname " + 
			"FROM " + 
			"	( " + 
			"		SELECT " + 
			"			* " + 
			"		FROM " + 
			"			multistep_electricity_price m " + 
			"		WHERE " + 
			"			m.org_no = :params.orgNo " + 
			"	) x " + 
			"LEFT JOIN t_s_depart tsd ON x.org_no = tsd.org_code")
	List<Map<String, Object>> getMultiElePriceModelList(@Param("rows")Integer pageSize,@Param("page") Integer pageNo,@Param("params") Map<String, Object> params);
	
	@Sql("SELECT " + 
			"	count(*) " + 
			"FROM " + 
			"	( " + 
			"		SELECT " + 
			"			* " + 
			"		FROM " + 
			"			multistep_electricity_price m " + 
			"		WHERE " + 
			"			m.org_no = :params.orgNo " + 
			"	) x " + 
			"LEFT JOIN t_s_depart tsd ON x.org_no = tsd.org_code")
	Long getMultiElePriceModelListCount(@Param("params") Map<String, Object> params);
	@Sql("SELECT " + 
			"	count(*) " + 
			"FROM " + 
			"	( " + 
			"		SELECT " + 
			"			* " + 
			"		FROM " + 
			"			timeofuse_electricity_price m " + 
			"		WHERE " + 
			"			m.org_no = :params.orgNo " + 
			"	) x " + 
			"LEFT JOIN t_s_depart tsd ON x.org_no = tsd.org_code")
	Long getTimeElePriceModelListCount(@Param("params") Map<String, Object> params);
    @Sql("SELECT " + 
    		"	x.*, tsd.departname " + 
    		"FROM " + 
    		"	( " + 
    		"		SELECT " + 
    		"			* " + 
    		"		FROM " + 
    		"			timeofuse_electricity_price m " + 
    		"		WHERE " + 
    		"			m.org_no = :params.orgNo " + 
    		"	) x " + 
    		"LEFT JOIN t_s_depart tsd ON x.org_no = tsd.org_code")
	List<Map<String, Object>> getTimeElePriceModelList(@Param("rows")Integer pageSize,@Param("page") Integer pageNo,@Param("params") Map<String, Object> params);
   
    /**
     * 获取台区分时电价曲线数据
     */
    @Sql("select start_time,end_time,price from ev_elec_price where org_no=:params.provorgNo")
	List<Map<String, Object>> getElecPrice(@Param("params") Map<String, Object> params );
 
}
