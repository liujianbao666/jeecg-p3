package com.jeecg.personalstake.plan.web;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jeecg.personalstake.order.entity.EvOdEntity;
import com.jeecg.personalstake.org.service.orgService;
import com.jeecg.personalstake.plan.service.PlanService;
import com.jeecg.personalstake.util.TypeUtil;
import org.apache.velocity.VelocityContext;
import org.jeecgframework.minidao.pojo.MiniDaoPage;
import org.jeecgframework.p3.core.util.plugin.ViewVelocity;
import org.jeecgframework.p3.core.web.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;


/**
 * 描述：计划
 * 
 * @author: www.jeecg.org
 * @since：2018年11月21日 14时39分50秒 星期三
 * @version:1.0
 */
@Controller
@RequestMapping("/personalstake/plan")
public class PlanController extends BaseController {
	@Autowired
	private PlanService planService;
	@Autowired
	private orgService orgService;

	/**
	 * 历史计划列表页面
	 * 
	 * @return
	 */
	@RequestMapping(params = "historyPlan", method = { RequestMethod.GET, RequestMethod.POST })
	public void list(@ModelAttribute EvOdEntity query, HttpServletRequest request, HttpServletResponse response,
			@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) throws Exception {

		VelocityContext velocityContext = new VelocityContext();
		
		  String TG_ID =   request.getParameter("TG_ID");
		  velocityContext.put("TG_ID", TG_ID);
		String viewName = "personalstake/plan/historyPlan.vm";
		ViewVelocity.view(request, response, viewName, velocityContext);

	}

	@RequestMapping(params = "getHistoryPlanList", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public JSONObject getHistoryPlanList(HttpServletRequest request, HttpServletResponse response,
			@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) throws Exception {

		JSONObject res = new JSONObject();

		Map params = new HashMap();
		String flowNo = request.getParameter("flowNo");
		String orgNo = request.getParameter("orgNo");
		String tgNo = request.getParameter("tgNo");
		String stakeNo = request.getParameter("stakeNo");
		String startTime = request.getParameter("startTime");
		String endTime = request.getParameter("endTime");
		String executeStatus = request.getParameter("executeStatus");

		if (!"".equals(orgNo) && orgNo != null) {

			String tgNos = orgService.getTgListofOrg(orgNo);
			if (!tgNos.isEmpty() && tgNos != null) {
				params.put("tgNos", tgNos);
			}
		}

		if (stakeNo != null && !stakeNo.isEmpty()) {
			params.put("stakeNo", stakeNo);
		}
		if (flowNo != null && !flowNo.isEmpty()) {
			params.put("flowNo", flowNo);
		}
		if (executeStatus != null && !executeStatus.isEmpty()) {
			params.put("executeStatus", executeStatus);
		}
		if (startTime != null && !startTime.isEmpty()) {
			params.put("startTime", startTime);
		}
		if (endTime != null && !endTime.isEmpty()) {
			params.put("endTime", endTime);
		}

		MiniDaoPage<Map> list = planService.getHistoryPlanList(params, pageNo, pageSize);

		res = JSONObject.parseObject(JSON.toJSONString(list));

		return res;

	}
	
	
	
	/**
	 * 充电计划详情页面
	 * 
	 * @return
	 */
	@RequestMapping(params = "planDetail", method = { RequestMethod.GET, RequestMethod.POST })
	public void planDetail(@ModelAttribute EvOdEntity query, HttpServletRequest request, HttpServletResponse response) throws Exception {

		String orderId = request.getParameter("orderId");
		VelocityContext velocityContext = new VelocityContext();
		String viewName = "personalstake/plan/planDetail.vm";
		velocityContext.put("orderId", orderId);
		ViewVelocity.view(request, response, viewName, velocityContext);

	}
	
	
	// 获取充电计划详情曲线渲染数据
	@RequestMapping(params = "getPlanDetailData")
	@ResponseBody
	public JSONObject getPlanDetailData(HttpServletRequest request) {
		JSONObject temp = new JSONObject();
		JSONObject json = new JSONObject();
		String orderId = request.getParameter("orderId");
		List<Object> allPlan = new ArrayList<Object>();
		List<Object> allCap = new ArrayList<Object>();
		
		try {
		
		if (!"-1".equals(orderId)) {
			temp = planService.getPlanAndCap(orderId);
			JSONArray parseArray1 = JSONObject.parseArray(temp.get("allCap").toString());
			JSONArray parseArray = JSONObject.parseArray(temp.get("allPlan").toString());
			for (int i = 0; i < parseArray1.size(); i++) {
				if (parseArray1.get(i) != null) {
					allCap.add(parseArray1.get(i));
					allPlan.add(parseArray.get(i));
					if (TypeUtil.getBigDecimal(parseArray1.get(i)).compareTo(new BigDecimal(50)) > 0) {
						break;
					}
				}
			}
		}
		
		int start = TypeUtil.getInt(temp.get("start"));
		int firstEnd = TypeUtil.getInt(temp.get("firstEnd"));
		Map<String,Date> mapDate =  (Map<String, Date>) temp.get("mapDate");
		Date create_time = mapDate.get("create_time");
		//获得所选的时间快转换成date类型
		List<String> timeList = new ArrayList<String>();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		for (int i = 0; i < firstEnd - start; i++) {
			long timePoint =create_time.getTime()+i*5*60*1000;
			String time = sdf.format(timePoint);
			int minute = Integer.parseInt(time.substring(time.indexOf(":")+1).trim());
			if(minute%5==0){
				timeList.add(time);
			}else{
				StringBuffer buffer = new StringBuffer();
				 buffer.append(time.substring(0,time.indexOf(":")+1));
				 minute =minute/5*5;
				 if (minute < 10) {
					 buffer.append("0"+String.valueOf(minute));
					}else{
						buffer.append(String.valueOf(minute));
					}
				 time= buffer.toString();
				timeList.add(time);
			}
		}
		
		json.put("allPlan", allPlan);
		json.put("allCap", allCap);
		json.put("start", start);
		json.put("firstEnd", allPlan.size());
		json.put("timeList", timeList);
		return json;
		}catch(Exception e) {
			
			e.printStackTrace();
			
			json.put("allPlan", "");
			json.put("allCap", "");
			json.put("start", "");
			json.put("firstEnd", "");
			json.put("timeList", "");
			
			
			return json;
			
		}
	}
	
	/**
	 * 跳转到订单生命周期页面
	 * @param request
	 * @return
	 */
	
	@RequestMapping(params = "lifeCycle")
	public void monitor( HttpServletRequest request, HttpServletResponse response) {
		String orderId = request.getParameter("orderId");
		VelocityContext velocityContext = new VelocityContext();
		String viewName = "personalstake/order/lifeCycle.vm";
		velocityContext.put("orderId", orderId);
		try {
			ViewVelocity.view(request, response, viewName, velocityContext);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	
	
	@RequestMapping(params = "getVhInfo")
	@ResponseBody
	public JSONObject getVhInfo(HttpServletRequest request) {
		Map<String, Object> result = new HashMap<String, Object>();
		JSONObject json = new JSONObject();
		String orderId = request.getParameter("orderId");
		result = planService.getVhInfo(orderId);

		if (result == null || result.isEmpty()) {
			json.put("VH_BRAND", "无");
			json.put("VH_MODEL", "无");
			json.put("BATERY_CAP", "0");
			json.put("RATED_MAX_P", "0");

		} else {
			json.put("VH_BRAND", result.get("VH_BRAND"));
			json.put("VH_MODEL", result.get("VH_MODEL"));
			json.put("BATERY_CAP", result.get("BATERY_CAP"));
			json.put("RATED_MAX_P", result.get("RATED_MAX_P"));
		}
		return json;
	}
	
	
	
//	@RequestMapping(params = "getNeedInfo")
//	@ResponseBody
//	public JSONObject getNeedInfo(HttpServletRequest request) {
//		Map<String, Object> result = new HashMap<String, Object>();
//		JSONObject json = new JSONObject();
//		String orderId = request.getParameter("orderId");
//		result = lifeCycleService.getNeedInfo(orderId);
//
//		if (result == null || result.isEmpty()) {
//			// 剩余电量
//			json.put("REMAINCAPACITY", "0");
//			// 目标电量
//			json.put("TARGETCAPACITY", "0");
//			// 充电需求电量
//			json.put("CHARGING_DEMAND", "0");
//		} else {
//
//			// 剩余电量
//			json.put("REMAINCAPACITY", result.get("REMAINCAPACITY"));
//			// 目标电量
//			json.put("TARGETCAPACITY", result.get("TARGETCAPACITY"));
//			// 充电需求电量
//			json.put("CHARGING_DEMAND", result.get("CHARGING_DEMAND"));
//
//		}
//		return json;
//	}
	
	

}
