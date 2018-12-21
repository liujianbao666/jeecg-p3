package com.jeecg.personalstake.share.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.velocity.VelocityContext;
import org.jeecgframework.p3.core.util.plugin.ViewVelocity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jeecg.personalstake.share.service.ChargingShareService;

@Controller
@RequestMapping("/personalstake/chargingPileShareController")
public class ChargingShareController {
	
	@Autowired
	private ChargingShareService chargingShareService;
	    
	/**
	 * 待开通共享桩页面
	 */
	@RequestMapping(params = "showAllStakeInfoForOpenShare")
	public void showAllStakeInfoForOpenShare(HttpServletRequest request, HttpServletResponse response,
			@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) {
		try {
		VelocityContext velocityContext = new VelocityContext();
		
		String viewName = "personalstake/chargingShare/allStakeInfoForOpenShare.vm";
		
			ViewVelocity.view(request, response, viewName, velocityContext);
		} catch (Exception e) {
			e.printStackTrace();
		}

		 
	}
	
	/*
	 * 获取待开通共享桩列表
	 */
	  @ResponseBody
	  @RequestMapping(params = "getAllStakeInfoForOpenShare")
	  public JSONObject getAllStakeInfoForOpenShare( HttpServletRequest request , HttpServletResponse response,
				@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
				@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) {
		  
		  JSONObject res = new JSONObject();
		  
		  Map<String, Object> params = new HashMap<String, Object>();
		  
		  		String orgNo = request.getParameter("orgNo");
		  		String tgNo = request.getParameter("tgNo");
		  		String stakeNo = request.getParameter("cdz");
		  		String stakeName = request.getParameter("stakeName");
		  		String shareStatus = request.getParameter("shareStatus");
		  		
		  		if(orgNo != null && !orgNo.isEmpty()) {
		  			params.put("orgNo",orgNo);
		  		}
		  		if(tgNo != null && !tgNo.isEmpty()) {
		  			params.put("tgNo",tgNo);
		  		}
		  		if(stakeNo != null && !stakeNo.isEmpty()) {
		  			params.put("stakeNo",stakeNo);
		  		}
		  		if(stakeName != null && !stakeName.isEmpty()) {
		  			params.put("stakeName",stakeName);
		  		}
		  		if(shareStatus != null && !shareStatus.isEmpty()) {
		  			params.put("shareStatus",shareStatus);
		  		}
		  		JSONArray array = new JSONArray();
		  
		  		List<Map<String, Object>> list   = chargingShareService.getAllPileInfo(pageNo, pageSize, params);
		  		
		  		array = JSON.parseArray(JSON.toJSONString(list));
		  		
		  		long total = chargingShareService.getAllPileInfoCount(params);
		  		
		  		
		  		res.put("rows", array);
		  		res.put("total", total);
		  		
	        return res;
	    }
	
	

	/**
	 * 开通共享页面
	 * @param request
	 * @return
	 */
	@RequestMapping(params = "openSharePage")
	public void openSharePage(HttpServletRequest request,HttpServletResponse response) {
		
		String stakeNo = request.getParameter("stakeNo");
		Map<String, Object> ec =chargingShareService.getCgByStakeNo(stakeNo);
			VelocityContext velocityContext = new VelocityContext();
			
			String viewName = "personalstake/chargingShare/openSharePage.vm";
			velocityContext.put("stakeNo", stakeNo);
			velocityContext.put("stakeName", ec.get("ALIAS"));
			velocityContext.put("instAddr", ec.get("INST_ADDR"));
			try {
				ViewVelocity.view(request, response, viewName, velocityContext);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	}
	
	/**
	 * 开通共享申请
	 * @param request
	 * @return
	 */
	@RequestMapping(params = "openShareApply")
	@ResponseBody
	public JSONObject openShareApply(HttpServletRequest request) {

       JSONObject  result = new JSONObject();

		String stakeNo = request.getParameter("stakeNo");
		String chargingFee = request.getParameter("chargingFee");
		String shareDateBegin = request.getParameter("shareDateBegin");
		String shareDateEnd = request.getParameter("shareDateEnd");
		String shareTimeEnd = request.getParameter("shareTimeEnd");
		String shareTimeBegin = request.getParameter("shareTimeBegin");
		String userid = request.getParameter("userid");
		
		
		Map<String, Object> params = new HashMap<String, Object>();
		
		params.put("stakeNo", stakeNo);
		params.put("chargingFee", chargingFee);
		params.put("shareDateBegin", shareDateBegin);
		params.put("shareDateEnd", shareDateEnd);
		params.put("shareTimeEnd", shareTimeEnd);
		params.put("shareTimeBegin", shareTimeBegin);
		params.put("userid", userid);
		
		result =  chargingShareService.openShareApply(params);
		
		return result;
	}
	
	
	/**
	 * 跳转审核信息反馈页面
	 * @param request
	 * @return
	 */
	@RequestMapping(params = "approvalFeedBackInfoPage")
	public void approvalFeedBackInfoPage(HttpServletRequest request,HttpServletResponse response) {

		VelocityContext velocityContext = new VelocityContext();
		String stakeNo = request.getParameter("stakeNo");
		String viewName = "personalstake/chargingShare/approvalFeedBackInfoPage.vm";
		velocityContext.put("stakeNo", stakeNo);
		try {
			ViewVelocity.view(request, response, viewName, velocityContext);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	//共享申请失败时获取审核的反馈信息
	@RequestMapping(params = "getApprovalFeedBackInfo")
	@ResponseBody
	public JSONObject getApprovalFeedBackInfo(HttpServletRequest request) {
		JSONObject result = new JSONObject();

		String stakeNo = request.getParameter("stakeNo");
		Map<String, Object> res  =	chargingShareService.getApprovalFeedBackInfo(stakeNo);
			
		result.put("stakeNo", res.get("stakeNo"));
		result.put("checkStatus", res.get("checkStatus"));
		result.put("feedBackInfo", res.get("feedBackInfo"));
		
		return result;
	}
	
	
	/**
     * 跳转到共享审核页面
     * @param request
     * @return
     */
    @RequestMapping(params = "getChargingPileShareAudit")
    public void getChargingPileShareAudit(HttpServletRequest request,HttpServletResponse response) {
        
        try {
    		VelocityContext velocityContext = new VelocityContext();
    		
    		String viewName = "personalstake/chargingShare/chargingPileShareAudit.vm";
    		
    			ViewVelocity.view(request, response, viewName, velocityContext);
    		} catch (Exception e) {
    			// TODO Auto-generated catch block
    			e.printStackTrace();
    		}
    }
    
    
    /**
     * 查询待审核共享信息列表
     * @param request
     * @return
     */
    @RequestMapping(params = "showChargingPileShareAuditData")
    @ResponseBody
    public JSONObject showChargingPileShareAuditData( HttpServletRequest request , HttpServletResponse response,
			@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) {
    	JSONObject result = new JSONObject();
        JSONArray array = new JSONArray();
        Map<String, Object> params = new HashMap<String, Object>();
        
		String orgNo = request.getParameter("orgNo");
		String tgNo = request.getParameter("tgNo");
		String stakeNo = request.getParameter("stakeNo");
		String stakeName = request.getParameter("stakeName");
		String start_time = request.getParameter("start_time");
		String end_time = request.getParameter("end_time");
		//String chargingFee = request.getParameter("chargingFee");
		
		if(orgNo != null && !orgNo.isEmpty()) {
            params.put("orgNo",orgNo);
        }
        if(tgNo != null && !tgNo.isEmpty()) {
            params.put("tgNo",tgNo);
        }
        if(stakeNo != null && !stakeNo.isEmpty()) {
            params.put("stakeNo",stakeNo);
        }
        if(stakeName != null && !stakeName.isEmpty()) {
            params.put("stakeName",stakeName);
        }
        if(start_time != null && !start_time.isEmpty()) {
            params.put("start_time",start_time);
        }
        if(end_time != null && !end_time.isEmpty()) {
            params.put("end_time",end_time);
        }
		
  		
        
  		List<Map<String, Object>> list = chargingShareService.getChargingPileShareAduitList(pageNo, pageSize, params);
  		array = JSON.parseArray(JSON.toJSONString(list));
  		
  		long total = chargingShareService.getChargingPileShareAduitListCount(params);
  		result.put("rows", array);
  		result.put("total", total);
  		return result;
    }
    
    
	/**
	 * 跳转共享申请审核页面
	 * @param request
	 * @return
	 */
	@RequestMapping(params = "chargingShareApprovalPage")
	public void chargingShareApprovalPage(HttpServletRequest request,HttpServletResponse response) {

		String stakeNo = request.getParameter("stakeNo");

		  try {
	    		VelocityContext velocityContext = new VelocityContext();
	    		
	    		String viewName = "personalstake/chargingShare/chargingPileShareAuditPage.vm";
	    		velocityContext.put("stakeNo", stakeNo);
	    			ViewVelocity.view(request, response, viewName, velocityContext);
	    		} catch (Exception e) {
	    			// TODO Auto-generated catch block
	    			e.printStackTrace();
	    		}
		
	}
	
	// 对共享申请进行审核
	@RequestMapping(params = "chargingPileShareAudit")
	@ResponseBody
	public JSONObject chargingPileShareAudit(HttpServletRequest request) {
		JSONObject result = new JSONObject();

		String stakeNo = request.getParameter("stakeNo");
		String checkStatus = request.getParameter("checkStatus");
		String approvalOpinion = request.getParameter("approvalOpinion");
	    result =chargingShareService.chargingPileShareAudit(stakeNo,checkStatus,approvalOpinion);
			
		return result;
	}
	
	/**
     *  跳转到共享信息查询页面
     * @param request
     * @return
     */
    @RequestMapping(params = "getSharingInformationQuery")
    public void chargingPileShareAudit(HttpServletRequest request,HttpServletResponse response) {
        
        try {
    		VelocityContext velocityContext = new VelocityContext();
    		
    		String viewName = "personalstake/chargingShare/chargingPileQuery.vm";
    		
    			ViewVelocity.view(request, response, viewName, velocityContext);
    		} catch (Exception e) {
    			// TODO Auto-generated catch block
    			e.printStackTrace();
    		}
    }
    
    /**
     *  获取共享信息查询结果
     * @param request
     * @return
     */
	  @ResponseBody
	  @RequestMapping(params = "getSharingInformationQueryResult")
	  public JSONObject getChargingPileShareQueryResult( HttpServletRequest request , HttpServletResponse response,
				@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
				@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) {
		  JSONObject result = new JSONObject();
	        JSONArray array = new JSONArray();
		  
		  Map<String, Object> params = new HashMap<String, Object>();
		  
		  		String orgNo = request.getParameter("orgNo");
		  		String tgNo = request.getParameter("tgNo");
		  		
		  		String stakeNo = request.getParameter("stakeNo");
		  		String stakeName = request.getParameter("stakeName");
		  		
		  		String freeStatus = request.getParameter("freeStatus");  //空闲状态
		  		String lowFee = request.getParameter("lowFee");           //价格查询 起始
				String highFee = request.getParameter("highFee");         //价格查询 结束
				String location =  request.getParameter("location");      //位置查询
		  		
		  		if(orgNo != null && !orgNo.isEmpty()) {
		  			params.put("orgNo",orgNo);
		  		}
		  		if(tgNo != null && !tgNo.isEmpty()) {
		  			params.put("tgNo",tgNo);
		  		}
		  		if(stakeNo != null && !stakeNo.isEmpty()) {
		  			params.put("stakeNo",stakeNo);
		  		}
		  		
		  		if(stakeName != null && !stakeName.isEmpty()) {
		  			params.put("stakeName",stakeName);
		  		}
		  		if(lowFee != null && !lowFee.isEmpty()) {
		  			params.put("lowFee",lowFee);
		  		}
		  		if(highFee != null && !highFee.isEmpty()) {
		  			params.put("highFee",highFee);
		  		}
		  		if(freeStatus != null && !freeStatus.isEmpty()) {
		  			params.put("freeStatus",freeStatus);
		  		}
		  		if(location != null && !location.isEmpty()) {
		  			params.put("location",location);
		  		}
		  
		  List<Map<String, Object>> list= chargingShareService.getChargingPileShareQueryResult(pageNo, pageSize, params);
		  	array = JSON.parseArray(JSON.toJSONString(list));
		  	long total=chargingShareService.getChargingPileShareQueryResultCount(params);
		  	result.put("rows", array);
	  		result.put("total", total);
		  	return result;
	    }
    
    
    
}