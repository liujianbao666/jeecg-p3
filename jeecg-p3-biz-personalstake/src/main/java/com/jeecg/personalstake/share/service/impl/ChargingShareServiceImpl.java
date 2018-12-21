package com.jeecg.personalstake.share.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.jeecg.personalstake.org.service.orgService;
import com.jeecg.personalstake.share.dao.ChargingShareDao;
import com.jeecg.personalstake.share.service.ChargingShareService;

@Service
public class ChargingShareServiceImpl  implements ChargingShareService {

	@Autowired
	private orgService orgService;
	
	@Resource
	private ChargingShareDao chargingShareDao;


/**
 * 获取所有充电桩信息
 */
	@Override
public   List<Map<String, Object>>  getAllPileInfo(Integer pageNo, Integer pageSize, Map<String, Object> params) {
		List<Map<String, Object>> list = null;

		String orgNo = (String) params.get("orgNo");
		String tgNos = orgService.getTgListofOrg(orgNo);
		params.put("tgNos", tgNos);
		
	    list = chargingShareDao.getAllPileInfo(pageNo,pageSize,params);

	return list;
}

	@Override
	public long getAllPileInfoCount(Map<String, Object> params) {
		String orgNo = (String) params.get("orgNo");
		String tgNos = orgService.getTgListofOrg(orgNo);
		params.put("tgNos", tgNos);
		
		return  chargingShareDao.getAllPileInfoCount(params);
		
	}
	
	
@Override
public JSONObject openShareApply(Map<String, Object> params) {
	JSONObject result = new JSONObject();
	try {
	Date updateTime = new Date();
	params.put("checkStatus", "0");
	params.put("isvalid", "0");
	params.put("updateTime", updateTime);
	
	List<Map<String, Object>> list = chargingShareDao.getShareModelByStakeNo(params);  //查看表中是否有记录 有就更新 没有就插入
	int res;
	if(list.size()>0) {
		
		 res = chargingShareDao.openShareApplyUpdate(params);
		
	}else {
		
		 res = chargingShareDao.openShareApplyInsert(params);
		
	}
	  if(res==1||res==2) {   //当更新表中数据时受影响行数为2
		  result.put("status", "success");
	  }
	  else {
		  result.put("status", "fail");
	  }
	}catch(Exception e) {
		
		e.printStackTrace();
		result.put("exceptionMsg", e.getMessage());
	}
	return result;
}


@Override
public Map<String, Object> getCgByStakeNo(String stakeNo) {
	// TODO Auto-generated method stub
	return chargingShareDao.getCgByStakeNo(stakeNo);
}

@Override
public Map<String, Object> getApprovalFeedBackInfo(String stakeNo) {
	Map<String, Object> res = chargingShareDao.getApprovalFeedBackInfo(stakeNo);
	
	return res;
}


@Override
public List<Map<String, Object>> getChargingPileShareAduitList(int pageNo, int pageSize, Map<String, Object> params) {
	List<Map<String, Object>> list = null;
	String orgNo = (String) params.get("orgNo");
	String tgNos = orgService.getTgListofOrg(orgNo);
	params.put("tgNos", tgNos);
	
    list = chargingShareDao.getChargingPileShareAduitList(pageNo,pageSize,params);

return list;
}


@Override
public JSONObject chargingPileShareAudit(String stakeNo, String checkStatus, String approvalOpinion) {
JSONObject result = new JSONObject();
	
	try {
		int res = chargingShareDao.chargingPileShareAudit(stakeNo,checkStatus,approvalOpinion);
	  if(res==1) {  
		  result.put("status", "success");
	 }else {
		result.put("status", "fail");
	  }
	}catch(Exception e) {
		e.printStackTrace();
		result.put("exceptionMsg", e.getMessage());
	}
	return result;
}


@Override
public List<Map<String, Object>> getChargingPileShareQueryResult(int pageNo, int pageSize, Map<String, Object> params) {
	List<Map<String, Object>> list = null;
	String orgNo = (String) params.get("orgNo");
	String tgNos = orgService.getTgListofOrg(orgNo);
	params.put("tgNos", tgNos);
	
    list = chargingShareDao.getChargingPileShareQueryResult(pageNo,pageSize,params);

    return list;
}


@Override
public long getChargingPileShareQueryResultCount(Map<String, Object> params) {
	String orgNo = (String) params.get("orgNo");
	String tgNos = orgService.getTgListofOrg(orgNo);
	params.put("tgNos", tgNos);
	
	return  chargingShareDao.getChargingPileShareQueryResultCount(params);
}

@Override
public long getChargingPileShareAduitListCount(Map<String, Object> params) {

	String orgNo = (String) params.get("orgNo");
	String tgNos = orgService.getTgListofOrg(orgNo);
	params.put("tgNos", tgNos);
	
	return  chargingShareDao.getChargingPileShareAduitListCount(params);
}






}
