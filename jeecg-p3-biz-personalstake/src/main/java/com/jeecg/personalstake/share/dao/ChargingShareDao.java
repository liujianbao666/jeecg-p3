package com.jeecg.personalstake.share.dao;

import java.util.List;
import java.util.Map;

import org.jeecgframework.minidao.annotation.Param;
import org.jeecgframework.minidao.annotation.Sql;
import org.springframework.stereotype.Repository;

@Repository
public interface ChargingShareDao{

	List<Map<String, Object>> getAllPileInfo(@Param("page")Integer pageNo, @Param("rows")Integer pageSize, @Param("params")Map<String, Object> params);

	long getAllPileInfoCount(@Param("params")Map<String, Object> params);

	
	@Sql(" insert into person_stake_share_model (stakeNo,chargingFee, " + 
			" workBeginTime,workEndTime,restBeginTime,restEndTime, checkStatus,updateTime,userId,isvalid) " + 
			" values(:params.stakeNo,:params.chargingFee,:params.shareDateBegin,:params.shareDateEnd,:params.shareTimeBegin,"
			+ ":params.shareTimeEnd,:params.checkStatus,:params.updateTime,:params.userid,:params.isvalid)")
	int openShareApplyInsert(@Param("params") Map<String, Object> params);
	
	@Sql(" update  person_stake_share_model set  chargingFee =  :params.chargingFee, " + 
			" workBeginTime = :params.shareDateBegin ,workEndTime = :params.shareDateEnd,"
			+ " restBeginTime = :params.shareTimeBegin,restEndTime = :params.shareTimeEnd, "
			+ " checkStatus = :params.checkStatus ,updateTime = :params.updateTime,userId = :params.userid,"
			+ " isvalid = :params.isvalid where stakeNo = :params.stakeNo ")
	int openShareApplyUpdate(@Param("params") Map<String, Object> params);
	
    @Sql("  select STAKENO,ALIAS,INST_ADDR from ev_cg where STAKENO = :stakeNo")
	Map<String, Object> getCgByStakeNo(@Param("stakeNo") String stakeNo);
    @Sql(" select stakeNo,checkStatus,remark as feedBackInfo from person_stake_share_model where stakeNo = :stakeNo")
	Map<String, Object> getApprovalFeedBackInfo(@Param("stakeNo") String stakeNo);

	List<Map<String, Object>> getChargingPileShareAduitList(@Param("page")Integer pageNo, @Param("rows")Integer pageSize, @Param("params")Map<String, Object> params);

	long getChargingPileShareAduitListCount(@Param("params") Map<String, Object> params);

	
	@Sql("  update person_stake_share_model set checkStatus = :checkStatus ,remark = :approvalOpinion where stakeNo = :stakeNo")
	int chargingPileShareAudit(@Param("stakeNo") String stakeNo,@Param("checkStatus") String checkStatus,@Param("approvalOpinion") String approvalOpinion);
	@Sql("select stakeNo from person_stake_share_model where stakeNo = :params.stakeNo ")
	List<Map<String, Object>> getShareModelByStakeNo(@Param("params") Map<String, Object> params);

	/**共享信息查询
	 */
	List<Map<String, Object>> getChargingPileShareQueryResult(int pageNo, int pageSize, Map<String, Object> params);

	/**共享信息查询总数
	 */
	long getChargingPileShareQueryResultCount(Map<String, Object> params);

	 
}

