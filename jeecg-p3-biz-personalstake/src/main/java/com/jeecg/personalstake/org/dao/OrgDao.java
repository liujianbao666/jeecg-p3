package com.jeecg.personalstake.org.dao;

import java.util.List;
import java.util.Map;

import org.jeecgframework.minidao.annotation.Param;
import org.jeecgframework.minidao.annotation.ResultType;
import org.jeecgframework.minidao.annotation.Sql;
import org.springframework.stereotype.Repository;
@Repository
public interface OrgDao {
   
	@ResultType(Map.class)
	List<Map<String, Object>> getTgListofOrg(@Param("orgNos") String orgNos);
	
	
	@ResultType(Map.class)
	List<Map<String, Object>> getParentNode(@Param("pid") String pid);
	
	@ResultType(Map.class)
	List<Map<String, Object>> getChildTreeAndTgList(@Param("pid") String pid);
	
	@ResultType(Integer.class)
	int getTgByOrg (@Param("pid") String orgNo);
	
	@ResultType(Map.class)
	List<Map<String, Object>>   getAllNodes( @Param("pid") String pid);
	@ResultType(Map.class)
	List<Map<String, Object>>  getChildTreeList ( @Param("pid") String pid);

    @Sql("select org_code,departname,parentdepartid,org_type from t_s_depart where 1=1 and org_code=:orgNo")
	Map<String, Object> getOrgEntityByOrgNo(@Param("orgNo") String orgNo);
}