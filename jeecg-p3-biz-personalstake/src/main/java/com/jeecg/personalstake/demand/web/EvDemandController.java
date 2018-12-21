package com.jeecg.personalstake.demand.web;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.velocity.VelocityContext;
import org.jeecgframework.minidao.pojo.MiniDaoPage;
import org.jeecgframework.p3.core.common.utils.AjaxJson;
import org.jeecgframework.p3.core.page.SystemTools;
import org.jeecgframework.p3.core.util.plugin.ViewVelocity;
import org.jeecgframework.p3.core.web.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jeecg.personalstake.demand.entity.EvDemandEntity;
import com.jeecg.personalstake.demand.service.EvDemandService;
import com.jeecg.personalstake.order.entity.EvOdEntity;
import com.jeecg.personalstake.org.service.orgService;
import com.jeecg.personalstake.util.CommonUtils;

 /**
 * 描述：需求表
 * @author: www.jeecg.org
 * @since：2018年11月22日 14时05分30秒 星期四 
 * @version:1.0
 */
@Controller
@RequestMapping("/personalstake/evDemand")
public class EvDemandController extends BaseController{
  @Autowired
  private EvDemandService evDemandService;
  @Autowired
  private orgService orgService;
  
	/**
	  * 列表页面
	  * @return
	  */
	@RequestMapping(params = "list",method = {RequestMethod.GET,RequestMethod.POST})
	public void list(@ModelAttribute EvDemandEntity query,HttpServletRequest request,HttpServletResponse response,
			@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) throws Exception{
			try {
			 	LOG.info(request, " back list");
			 	//分页数据
			 	VelocityContext velocityContext = new VelocityContext();
			    String  TG_ID =	request.getParameter("TG_ID");
		     	velocityContext.put("TG_ID",TG_ID);
				String viewName = "personalstake/demand/evDemand-list.vm";
				ViewVelocity.view(request,response,viewName,velocityContext);
			} catch (Exception e) {
				e.printStackTrace();
			}
}

	/**
	 * 详情
	 * @return
	 */
	@RequestMapping(params="getEvDemandList",method = {RequestMethod.GET,RequestMethod.POST})
	@ResponseBody
	public JSONObject getEvDemandList(HttpServletRequest request,HttpServletResponse response,
			@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize)throws Exception{
		
		
		JSONObject resultJson =new JSONObject();
		EvDemandEntity query = new EvDemandEntity();
	 	LOG.info(request, " back list");
	 	
	 	String orgNo = CommonUtils.getStr(request.getParameter("orgNo"));
		String odId = CommonUtils.getStr(request.getParameter("odId"));
		String stakeNo = CommonUtils.getStr(request.getParameter("stakeNo"));
		String status = CommonUtils.getStr(request.getParameter("status"));
		String start_time = CommonUtils.getStr(request.getParameter("start_time"));
		String end_time = CommonUtils.getStr(request.getParameter("end_time"));
		String userType = CommonUtils.getStr(request.getParameter("userType"));
		String odModel = CommonUtils.getStr(request.getParameter("odModel"));
		
		DateFormat format1 = new SimpleDateFormat("yyyy-MM-dd hh:mm");   
		if(orgNo!=null&&orgNo.length()!=0) {
			String tgNos =orgService.getTgListofOrg(orgNo);
			query.setTgNos(tgNos);
		}
		//query.setOrgNo(orgNo);
		if(odId!=null&&odId.length()!=0) {
			query.setOdId(odId);
		}
		if(status!=null&&status.length()!=0) {
			query.setStatus(status);
		}
		if(stakeNo!=null&&stakeNo.length()!=0) {
			query.setStakeNo(stakeNo);
		}
		if(userType!=null&&userType.length()!=0) {
			query.setUserType(userType);
		}
		if(odModel!=null&&odModel.length()!=0) {
			query.setOdModel(odModel);
		}
		if(start_time!=null&&start_time.length()!=0) {
			query.setStart_time(format1.parse(start_time));
		}
		if(end_time!=null&&end_time.length()!=0) {
	 	query.setEnd_time(format1.parse(end_time));
		}
	 	
		
	/*	if (!"".equals(orgNo) && orgNo != null) {
			
			String tgId = orgService.getTgByOrg(orgNo);    
			if ("".equals(tgId)) {                         //传入的是台区号  没有下属组织
				
				query.setOrgNo(orgNo); 
				
			} else {
				String orgNos = orgService.getOrgListofOrg(orgNo);  //传入的是组织机构号  还有下属组织
				if (!orgNos.isEmpty()) {
		
					orgNo=orgNos;
					
				query.setOrgNo(orgNo); 
				}
			}
		}*/
		
		
		MiniDaoPage<Map> list =  evDemandService.getAll(query,pageNo,pageSize);
		resultJson = JSONObject.parseObject(JSON.toJSONString(list));

		return resultJson;
		
		
		
	}
	
	
	//获取需求信息通过订单号
	@RequestMapping(params = "getNeedInfo")
	@ResponseBody
	public JSONObject getNeedInfo(HttpServletRequest request) {
		Map<String, Object> result = new HashMap<String, Object>();
		JSONObject json = new JSONObject();
		String orderId = request.getParameter("orderId");
		
		EvDemandEntity evDemand = evDemandService.get(orderId);
		
	

		if (evDemand == null) {
			// 剩余电量
			json.put("REMAINCAPACITY", "0");
			// 目标电量
			json.put("TARGETCAPACITY", "0");
			// 充电需求电量
			json.put("CHARGING_DEMAND", "0");
		} else {

			// 剩余电量
			json.put("REMAINCAPACITY", evDemand.getRemaincapacity());
			// 目标电量
			json.put("TARGETCAPACITY", evDemand.getTargetcapacity());
			// 充电需求电量
			json.put("CHARGING_DEMAND",evDemand.getChargingDemand());

		}
		return json;
	}
	
	
	
	 /**
	  * 详情
	  * @return
	  */
	@RequestMapping(params="toDetail",method = RequestMethod.GET)
	public void evDemandDetail(@RequestParam(required = true, value = "id" ) String id,HttpServletResponse response,HttpServletRequest request)throws Exception{
			VelocityContext velocityContext = new VelocityContext();
			String viewName = "personalstake/demand/evDemand-detail.vm";
			EvDemandEntity evDemand = evDemandService.get(id);
			velocityContext.put("evDemand",evDemand);
			ViewVelocity.view(request,response,viewName,velocityContext);
	}

	/**
	 * 跳转到添加页面
	 * @return
	 */
	@RequestMapping(params = "toAdd",method ={RequestMethod.GET, RequestMethod.POST})
	public void toAddDialog(HttpServletRequest request,HttpServletResponse response)throws Exception{
		 VelocityContext velocityContext = new VelocityContext();
		 String viewName = "personalstake/demand/evDemand-add.vm";
		 ViewVelocity.view(request,response,viewName,velocityContext);
	}

	/**
	 * 保存信息
	 * @return
	 */
	@RequestMapping(params = "doAdd",method ={RequestMethod.GET, RequestMethod.POST})
	@ResponseBody
	public AjaxJson doAdd(@ModelAttribute EvDemandEntity evDemand){
		AjaxJson j = new AjaxJson();
		try {
			evDemandService.insert(evDemand);
			j.setMsg("保存成功");
		} catch (Exception e) {
			j.setSuccess(false);
			j.setMsg("保存失败");
		    e.printStackTrace();
		}
		return j;
	}

	/**
	 * 跳转到编辑页面
	 * @return
	 */
	@RequestMapping(params="toEdit",method = RequestMethod.GET)
	public void toEdit(@RequestParam(required = true, value = "id" ) String id,HttpServletResponse response,HttpServletRequest request) throws Exception{
			 VelocityContext velocityContext = new VelocityContext();
			 EvDemandEntity evDemand = evDemandService.get(id);
			 velocityContext.put("evDemand",evDemand);
			 String viewName = "personalstake/demand/evDemand-edit.vm";
			 ViewVelocity.view(request,response,viewName,velocityContext);
	}

	/**
	 * 编辑
	 * @return
	 */
	@RequestMapping(params = "doEdit",method ={RequestMethod.GET, RequestMethod.POST})
	@ResponseBody
	public AjaxJson doEdit(@ModelAttribute EvDemandEntity evDemand){
		AjaxJson j = new AjaxJson();
		try {
			evDemandService.update(evDemand);
			j.setMsg("编辑成功");
		} catch (Exception e) {
			j.setSuccess(false);
			j.setMsg("编辑失败");
		    e.printStackTrace();
		}
		return j;
	}


	/**
	 * 删除
	 * @return
	 */
	@RequestMapping(params="doDelete",method = RequestMethod.GET)
	@ResponseBody
	public AjaxJson doDelete(@RequestParam(required = true, value = "id" ) String id){
			AjaxJson j = new AjaxJson();
			try {
				evDemandService.delete(id);
				j.setMsg("删除成功");
			} catch (Exception e) {
				j.setSuccess(false);
				j.setMsg("删除失败");
			    e.printStackTrace();
			}
			return j;
	}
	
	/**
	 * 批量删除数据
	 * @param ids
	 * @return
	 */
	@RequestMapping(params="batchDelete",method = RequestMethod.POST)
	@ResponseBody
	public AjaxJson batchDelete(@RequestParam(required = true, value = "ids") String[] ids) {
		AjaxJson j = new AjaxJson();
		try {
			evDemandService.batchDelete(ids);
			j.setMsg("批量删除成功");
		} catch(Exception e) {
			j.setSuccess(false);
			j.setMsg("批量删除失败");
			e.printStackTrace();
		}
		return j;
	}

}

