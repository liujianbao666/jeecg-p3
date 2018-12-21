package com.jeecg.personalstake.order.web;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.velocity.VelocityContext;
import org.jeecgframework.minidao.pojo.MiniDaoPage;
import org.jeecgframework.p3.core.common.utils.AjaxJson;
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
import com.jeecg.personalstake.order.entity.EvOdEntity;
import com.jeecg.personalstake.order.service.EvOdService;
import com.jeecg.personalstake.org.service.orgService;
import com.jeecg.personalstake.util.CommonUtils;
import com.jeecg.personalstake.util.TypeUtil;

 /**
 * 描述：订单表
 * @author: www.jeecg.org
 * @since：2018年11月21日 14时39分50秒 星期三 
 * @version:1.0
 */
@Controller
@RequestMapping("/personalstake/evOd")
public class EvOdController extends BaseController{
  @Autowired
  private EvOdService evOdService;
  @Autowired
  private orgService orgService;
	/**
	  * 列表页面
	  * @return
	  */
	@RequestMapping(params = "list",method = {RequestMethod.GET,RequestMethod.POST})
	public void list(@ModelAttribute EvOdEntity query,HttpServletRequest request,HttpServletResponse response,
			@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) throws Exception{

		      String TG_ID =   request.getParameter("TG_ID");
		
		     
				VelocityContext velocityContext = new VelocityContext();
				
				 velocityContext.put("TG_ID",TG_ID);
				String viewName = "personalstake/order/historyOrder.vm";
				ViewVelocity.view(request,response,viewName,velocityContext);
	}
	
	
	
	
	@RequestMapping(params = "getHistoryOrder",method = {RequestMethod.GET,RequestMethod.POST})
	@ResponseBody
	public JSONObject getHistoryOrder(HttpServletRequest request,HttpServletResponse response,
			@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) throws Exception{

		        JSONObject res =new JSONObject();
		        EvOdEntity query= new EvOdEntity();
			 	LOG.info(request, " back list");
			 	
			 	String orgNo = CommonUtils.getStr(request.getParameter("orgNo"));
				String orderId = CommonUtils.getStr(request.getParameter("orderId"));
				String userId = CommonUtils.getStr(request.getParameter("userId"));
				String stakeNo = CommonUtils.getStr(request.getParameter("stakeNo"));
				String orderStatus = CommonUtils.getStr(request.getParameter("orderStatus"));
				String startTime = CommonUtils.getStr(request.getParameter("startTime"));
				String endTime = CommonUtils.getStr(request.getParameter("endTime"));
				String orderType = CommonUtils.getStr(request.getParameter("orderType"));
				String isBlueTooth = CommonUtils.getStr(request.getParameter("isBlueTooth"));
				String orderResource = CommonUtils.getStr(request.getParameter("orderResource"));
				
				DateFormat format1 = new SimpleDateFormat("yyyy-MM-dd hh:mm");   
				query.setOrgNo(orgNo);
				
				query.setOdId(orderId);
				query.setAcId(userId);
				query.setStakeno(stakeNo);
				query.setOdStatus(orderStatus);
				if(startTime!=null&&startTime.length()!=0) {
					query.setStartTime(format1.parse(startTime));
				}
				if(endTime!=null&&endTime.length()!=0) {
			 	query.setEndTime(format1.parse(endTime));
				}
			 	
			 	query.setOdModel(orderType);
			 	if(isBlueTooth!=null&&isBlueTooth.length()!=0) {
			 	query.setBluetoothorder(CommonUtils.getInt(isBlueTooth));
			 	}
			 	query.setUsertype(orderResource);
				
				if (!"".equals(orgNo) && orgNo != null) {
					
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
				}
				MiniDaoPage<Map> list =  evOdService.getAll(query,pageNo,pageSize);
				res = JSONObject.parseObject(JSON.toJSONString(list));
				return res;
		
}
	
	/**
	 * 通过订单号获取订单
	 */
	@RequestMapping(params = "getOrderInfo")
	@ResponseBody
	public JSONObject getOrderInfo(HttpServletRequest request) throws ParseException {
		EvOdEntity result = null;
		JSONObject json = new JSONObject();
		Calendar cal = Calendar.getInstance();
		String orderId = request.getParameter("orderId");
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		result = evOdService.get(orderId);
		if (result == null ) {
			// 充电类型
			json.put("OD_MODEL", "无");
			// 充电电量
			json.put("totalChargeAmount", "0");

			// 充电开始时间
			json.put("START_TIME", "无");

			// 充电结束时间
			json.put("END_TIME", "无");
		} else {
			// 充电类型
			int type = TypeUtil.getInt(result.getOdModel());
			if (type == 1) {
				json.put("OD_MODEL", "正常充电");
			} else {
				json.put("OD_MODEL", "有序充电");
			}
			// 充电电量
			json.put("totalChargeAmount", result.getTotalchargeamount());

			Date startTime = result.getStartTime();
			// 充电开始时间
			json.put("START_TIME", sdf.format(startTime));
			
			Date endTime = result.getEndTime();
			// 充电结束时间
			Date current = new Date();
			cal.setTime(startTime);
			cal.add(Calendar.DATE, 1);
			current = cal.getTime();
			json.put("END_TIME", endTime == null?sdf.format(current):sdf.format(endTime) );

		}
		return json;
	}
	

	 /**
	  * 详情
	  * @return
	  */
	@RequestMapping(params="toDetail",method = RequestMethod.GET)
	public void evOdDetail(@RequestParam(required = true, value = "id" ) String id,HttpServletResponse response,HttpServletRequest request)throws Exception{
			VelocityContext velocityContext = new VelocityContext();
			String viewName = "yxcd/order/evOd-detail.vm";
			EvOdEntity evOd = evOdService.get(id);
			velocityContext.put("evOd",evOd);
			ViewVelocity.view(request,response,viewName,velocityContext);
	}

	/**
	 * 跳转到添加页面
	 * @return
	 */
	@RequestMapping(params = "toAdd",method ={RequestMethod.GET, RequestMethod.POST})
	public void toAddDialog(HttpServletRequest request,HttpServletResponse response)throws Exception{
		 VelocityContext velocityContext = new VelocityContext();
		 String viewName = "yxcd/order/evOd-add.vm";
		 ViewVelocity.view(request,response,viewName,velocityContext);
	}

	/**
	 * 保存信息
	 * @return
	 */
	@RequestMapping(params = "doAdd",method ={RequestMethod.GET, RequestMethod.POST})
	@ResponseBody
	public AjaxJson doAdd(@ModelAttribute EvOdEntity evOd){
		AjaxJson j = new AjaxJson();
		try {
			evOdService.insert(evOd);
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
			 EvOdEntity evOd = evOdService.get(id);
			 velocityContext.put("evOd",evOd);
			 String viewName = "yxcd/order/evOd-edit.vm";
			 ViewVelocity.view(request,response,viewName,velocityContext);
	}

	/**
	 * 编辑
	 * @return
	 */
	@RequestMapping(params = "doEdit",method ={RequestMethod.GET, RequestMethod.POST})
	@ResponseBody
	public AjaxJson doEdit(@ModelAttribute EvOdEntity evOd){
		AjaxJson j = new AjaxJson();
		try {
			evOdService.update(evOd);
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
				evOdService.delete(id);
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
			evOdService.batchDelete(ids);
			j.setMsg("批量删除成功");
		} catch(Exception e) {
			j.setSuccess(false);
			j.setMsg("批量删除失败");
			e.printStackTrace();
		}
		return j;
	}

}

