package com.jeecg.personalstake.share.service;

import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.JSONObject;

public interface ChargingShareService {


	
//	--------------------------------------------------下面为新代码-----------------------------
    //获取所有充电桩列表
	List<Map<String, Object>> getAllPileInfo(Integer pageNo, Integer pageSize, Map<String, Object> params);
	 //获取所有充电桩总数
	long getAllPileInfoCount(Map<String, Object> params);
	//开通共享申请
	JSONObject openShareApply(Map<String, Object> params);
    //根据桩号获取桩信息
	Map<String, Object> getCgByStakeNo(String stakeNo);
   //获取待审核的共享申请信息
	List<Map<String, Object>> getChargingPileShareAduitList(int pageNo, int pageSize, Map<String, Object> params);
   //对共享申请进行审核
	JSONObject chargingPileShareAudit(String stakeNo, String checkStatus, String approvalOpinion);
   //共享申请未通过时获取审核反馈信息
	Map<String, Object> getApprovalFeedBackInfo(String stakeNo);
	//对共享申请审核总数
	long getChargingPileShareAduitListCount(Map<String, Object> params);
   //共享信息查询列表
	List<Map<String, Object>> getChargingPileShareQueryResult(int pageNo, int pageSize, Map<String, Object> params);
   //获取共享信息查询总数
	long getChargingPileShareQueryResultCount(Map<String, Object> params);
	
}
