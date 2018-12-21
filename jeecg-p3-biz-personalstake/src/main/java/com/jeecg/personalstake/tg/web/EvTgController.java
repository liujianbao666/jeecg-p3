package com.jeecg.personalstake.tg.web;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jeecg.personalstake.chargepile.service.HisCgCurveDataService;
import com.jeecg.personalstake.electricityPriceModel.service.ElectricityPriceModelService;
import com.jeecg.personalstake.org.service.orgService;
import com.jeecg.personalstake.tg.service.EvTgService;
import com.jeecg.personalstake.util.TypeUtil;
import org.apache.velocity.VelocityContext;
import org.jeecgframework.p3.core.util.plugin.ViewVelocity;
import org.jeecgframework.p3.core.web.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 台区Controller
 */
@Controller
@RequestMapping("/personalstake/evTg")
public class EvTgController extends BaseController {
	@Autowired
	private EvTgService evTgService;

	@Autowired
	private HisCgCurveDataService hisCgCurveDataService;

	@Autowired
	private orgService orgService;
	@Autowired
	private ElectricityPriceModelService electricityPriceModelService;
	private double totalPower = 0;

	/**
	 * 跳转到台区实时监控页面
	 */
	@RequestMapping(params = "getTgrun", method = { RequestMethod.GET })
	public void getTableList(HttpServletRequest request, HttpServletResponse response) throws Exception {
		String tgId = request.getParameter("TG_ID");
		String tgName = request.getParameter("TG_NAME");
		VelocityContext velocityContext = new VelocityContext();
		velocityContext.put("TG_ID", tgId);
		velocityContext.put("TG_NAME", tgName);
		String viewName = "personalstake/tg/tgrunMonitoring.vm";
		ViewVelocity.view(request, response, viewName, velocityContext);

	}

	/**
	 * 跳转到有序台区概览
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(params = "tgOverview", method = { RequestMethod.GET })
	public void tgMonitor(HttpServletRequest request, HttpServletResponse response) {
		try {
			String TG_ID = request.getParameter("TG_ID");
			String TG_NAME = request.getParameter("TG_NAME");
			VelocityContext velocityContext = new VelocityContext();
			if (TG_ID == null || TG_ID.isEmpty() || TG_NAME == null || TG_NAME.isEmpty()) {
				Object userInfo = request.getSession().getAttribute("userInfo");
				JSONObject userInfoJson = new JSONObject();
				if (userInfo != null) {
					userInfoJson = JSON.parseObject(JSON.toJSONString(userInfo));
				}
				Map<String, Object> params = new HashMap<String, Object>();
				params.put("TG_ID",1111);
				Map<String, Object> map1 = evTgService.getFirstTgId(params);
				request.setAttribute("TG_ID", map1.get("TG_ID"));
				request.setAttribute("TG_NAME", map1.get("TG_NAME"));
			} else {
				velocityContext.put("TG_ID", TG_ID);
				velocityContext.put("TG_NAME", TG_NAME);
			}
			String viewName = "personalstake/tg/tgOverview.vm";
			ViewVelocity.view(request, response, viewName, velocityContext);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 跳转到台区(时序)历史数据对比（充电桩负荷和台区负荷对比）
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(params = "getShowResult")
	public void getCompareResult(HttpServletRequest request, HttpServletResponse response) {
		try {
			VelocityContext velocityContext = new VelocityContext();
			String viewName = "personalstake/tg/tgPowerCompareCurve.vm";
			ViewVelocity.view(request, response, viewName, velocityContext);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	/**
	 * 跳转到台区曲线监控页面(台区历史监控)
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(params = "tgCurve", method = { RequestMethod.GET })
	public void getTgCurve(HttpServletRequest request, HttpServletResponse response) {
		String orgNo = request.getParameter("orgNo");
		String orgName = request.getParameter("orgName");
		String tgNo = request.getParameter("tgNo");
		try {
			VelocityContext velocityContext = new VelocityContext();
			velocityContext.put("orgNo", orgNo);
			velocityContext.put("orgName", orgName);
			velocityContext.put("tgNo", tgNo);
			String viewName = "personalstake/tg/tgCurveMonitor.vm";
			ViewVelocity.view(request, response, viewName, velocityContext);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	/**
	 * 跳转到台区计划曲线页面
	 * 
	 * @param request
	 * @return
	 */

	@RequestMapping(params = "tgPlanLayout")
	public void tgPlanLayout(HttpServletRequest request, HttpServletResponse response) {
		String orgNo = request.getParameter("orgNo");
		String orgName = request.getParameter("orgName");
		String tgNo = request.getParameter("tgNo");
		try {
			VelocityContext velocityContext = new VelocityContext();
			velocityContext.put("orgNo", orgNo);
			velocityContext.put("orgName", orgName);
			velocityContext.put("tgNo", tgNo);
			String viewName = "personalstake/tg/tgPlanLayout.vm";
			ViewVelocity.view(request, response, viewName, velocityContext);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 跳转到台区充电电量监视页面
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(params = "getCharging")
	public void getCharging(HttpServletRequest request, HttpServletResponse response) {
		VelocityContext velocityContext = new VelocityContext();
		String viewName = "personalstake/tg/tgchargingPower.vm";
		try {
			ViewVelocity.view(request, response, viewName, velocityContext);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * 获取台区实时监控页面数据
	 * 
	 * @param limit
	 * @param offset
	 * @param request
	 * @return
	 */
	@RequestMapping(params = "getEvtgRunList", method = RequestMethod.GET)
	@ResponseBody
	public JSONObject getEvtgRunList(Integer limit, Integer offset, HttpServletRequest request,
			@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) {
		JSONObject result = new JSONObject();
		String tgId = request.getParameter("tgId");
		String status = request.getParameter("status");
		Map<String, Object> params = new HashMap<String, Object>();
		String orgNo = request.getParameter("orgNo");
		if (tgId == null || tgId.isEmpty() || "null".equals(tgId)) {
			params.put("tgId", "");
			if (orgNo != null && !orgNo.isEmpty()) {
				params.put("orgNo", orgNo);
			}
			if (!"".equals(orgNo) && orgNo != null) {
				String tgNos = orgService.getTgListofOrg(orgNo);
				if (!tgNos.isEmpty() && tgNos != null) {
					params.put("tgNos", tgNos);
				}
			}
		} else {
			params.put("tgId", tgId);
		}
		// 处理前台发过来的参数
		List<Map<String, Object>> list = evTgService.getTgRunTableList(params, pageNo, pageSize);
		result.put("total", list.size());
		result.put("rows", list);
		return result;
	}

	// 台区概览页面曲线 （台区 立即充电、台区负荷、策略计划、预测曲线）
	@RequestMapping(params = "getTgCurves")
	@ResponseBody
	public JSONObject getTgCurves(HttpServletRequest request) {
		String orgNo = request.getParameter("orgNo");
		String tgId = "";
		JSONObject obj = new JSONObject();
		// 选择组织机构的时候
		String temp = orgService.getTgByOrg(orgNo);
		String status = "";
		if (!"".equals(temp)) {
			status = "1";
			obj.put("status", status);
			return obj;
		} else {
			tgId = orgNo;
		}
		// 选择台区的时候
		// 台区实际运行曲线
//		List<BigDecimal> tgPowerList = tgPowerService.getRealityTgPower(tgId, date);
//		//无序曲线
//		List<BigDecimal> normalPowerList = tgPowerService.getAllImmediatelyTgPower(tgId, date);
//		//有序曲线
//		List<BigDecimal> optPowerList = tgPowerService.getAllOrderTgPower(tgId, date);
//		//预测曲线
//		List<BigDecimal> forecastPowerList = tgPowerService.getForecastTgPower(tgId, date);

		List<BigDecimal> normalList = evTgService.getNormal(tgId);
		List<BigDecimal> orderlyList = evTgService.getOrderly(tgId);
		List<BigDecimal> tgList = evTgService.getTg(tgId);
		List<BigDecimal> tgForecastList = evTgService.getTgForecast(tgId);

		obj.put("tgPowerList", tgList);
		obj.put("normalPowerList", normalList);
		obj.put("optPowerList", orderlyList);
		obj.put("forecastPowerList", tgForecastList);
		obj.put("status", "0");

		return obj;
	}

	// 台区全景监控页面获取 台区信息
	@RequestMapping(params = "tgList")
	@ResponseBody
	public JSONObject tgList(HttpServletRequest request) {
		JSONObject obj = new JSONObject();
		String orgNo = request.getParameter("orgNo");
		if (orgNo == null || orgNo.isEmpty()) {
			obj.put("tgCap", 0);
			obj.put("tgLimit", 0);
			obj.put("tgP", 0);
			obj.put("rate", 0);
			return obj;
		}
		Map<String, Object> map = evTgService.tgInfo(orgNo);
		if (map != null && map.size() != 0) {
			obj.put("tgCap", map.get("tg_Cap"));
			obj.put("tgLimit", map.get("limitPower"));
			obj.put("tgP", map.get("RUN_P"));
			obj.put("rate", map.get("num"));
		} else {
			obj.put("tgCap", 0);
			obj.put("tgLimit", 0);
			obj.put("tgP", 0);
			obj.put("rate", 0);
		}
		return obj;
	}

	// 台区全景监控页面获取 需求信息
	@RequestMapping(params = "needList")
	@ResponseBody
	public JSONObject needList(HttpServletRequest request) {
		JSONObject obj = new JSONObject();
		String orgNo = request.getParameter("orgNo");
		if (orgNo == null || orgNo.isEmpty()) {
			obj.put("power", 0);
			obj.put("total", 0);
			obj.put("zc", 0);
			obj.put("yx", 0);
			return obj;
		}
		Map<String, Object> map = evTgService.needsInfo(orgNo);
		if (map != null && map.size() != 0) {
			totalPower = TypeUtil.getDouble(map.get("power"));
			obj.put("power", TypeUtil.getDouble(map.get("power")));
			obj.put("total", map.get("total"));
			obj.put("zc", TypeUtil.getInt(map.get("zc")));
			obj.put("yx", TypeUtil.getInt(map.get("yx")));
		} else {
			obj.put("power", 0);
			obj.put("total", 0);
			obj.put("zc", 0);
			obj.put("yx", 0);
		}
		return obj;
	}

	// 台区全景监控页面获取 订单信息
	@RequestMapping(params = "orderList")
	@ResponseBody
	public JSONObject orderList(HttpServletRequest request) {
		JSONObject obj = new JSONObject();
		String orgNo = request.getParameter("orgNo");
		if (orgNo == null || orgNo.isEmpty()) {
			obj.put("order_total", 0);
			obj.put("normal", 0);
			obj.put("allOrderly", 0);
			return obj;
		}
		Map<String, Object> map = evTgService.ordersInfo(orgNo);
		if (map != null && map.size() != 0) {
			obj.put("order_total", map.get("total"));
			obj.put("normal", map.get("normals"));
			obj.put("allOrderly", map.get("allOrderly"));
		} else {
			obj.put("order_total", 0);
			obj.put("normal", 0);
			obj.put("allOrderly", 0);
		}
		return obj;
	}

	// 台区全景监控页面获取 计划信息
	@RequestMapping(params = "planList")
	@ResponseBody
	public JSONObject planList(HttpServletRequest request) {
		JSONObject obj = new JSONObject();
		String orgNo = request.getParameter("orgNo");
		if (orgNo == null || orgNo.isEmpty()) {
			obj.put("plan_total", 0);
			obj.put("planP", 0);
			obj.put("planDCount", 0);
			return obj;
		}
		Map<String, Object> map = evTgService.plansInfo(orgNo);
		if (map != null && map.size() != 0) {
			// 计划总数
			obj.put("plan_total", map.get("plan_total"));
			// 计划总功率
			obj.put("planP", totalPower);
			// 计划失败数
			obj.put("planDCount", 0);
		} else {
			obj.put("plan_total", 0);
			obj.put("planP", 0);
			obj.put("planDCount", 0);
		}
		return obj;
	}

	// 台区全景监控页面获取 调度信息
	@RequestMapping(params = "dispathList")
	@ResponseBody
	public JSONObject dispathList(HttpServletRequest request) {
		JSONObject obj = new JSONObject();
		String orgNo = request.getParameter("orgNo");
		if (orgNo == null || orgNo.isEmpty()) {
			obj.put("pispath_Count", 0);
			obj.put("pispathDcount", 0);
			obj.put("pispathP", 0);
			return obj;
		}
		Map<String, Object> map = evTgService.dispatchsInfo(orgNo);
		if (map != null && map.size() != 0) {
			// 调度总数
			obj.put("pispath_Count", map.get("pispath_Count"));
			// 调度失败数
			obj.put("pispathDcount", 0);
			// 调度总功率
			obj.put("pispathP", totalPower);
		} else {
			obj.put("pispath_Count", 0);
			obj.put("pispathDcount", 0);
			obj.put("pispathP", 0);
		}
		return obj;
	}

	/**
	 * 获取台区相关曲线信息(台区历史信息)
	 * 
	 * @param request
	 * @return
	 * @throws ParseException
	 */
	@RequestMapping(params = "getTgCharts")
	@ResponseBody
	public JSONObject getTgCharts(HttpServletRequest request) throws ParseException {
		JSONObject fullJson = new JSONObject();
		String provorgNo = request.getParameter("provorgNo");
		String orgNo = request.getParameter("orgNo");
		String startDate = request.getParameter("startDate");
		String endDate = request.getParameter("endDate");
		String tgId = "";
		// 根据组织单位名称获取组织单位编号
		String orgNotemp = orgService.getTgByOrg(orgNo);
		if ("".equals(orgNotemp) || orgNotemp == null) {
			tgId = orgNo;
		} else {
			fullJson.put("status", "1");
			return fullJson;
		}
		try {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("provorgNo", provorgNo);
			map.put("tgId", tgId);
			map.put("startDate", startDate);
			map.put("endDate", endDate);
			map.put("dataType", "1"); // 台区总功率
			// 获取台区总负荷数据
			Map<String, Object> tgPower = evTgService.getTgPowerDataByDate(map);
			fullJson.put("tgPower", tgPower);

			// 获取充电桩总负荷数据
			Map<String, Object> piesPower = hisCgCurveDataService.getHistoryPowerDataByTgId(map);
			fullJson.put("piesPower", piesPower);

			// 居民用电负荷曲线
			Map<String, Object> usersPower = new HashMap<String, Object>();
			if (tgPower.size() == piesPower.size()) {
				List<Double> userPowertmp = new ArrayList<Double>();
				for (int i = 0; i < ((List) tgPower.get("data")).size(); i++) {// 天数
					Double tg = (((List) tgPower.get("data")).get(i) == null ? 0
							: Double.parseDouble(String.valueOf(((List) tgPower.get("data")).get(i))));
					Double pie = (((List) piesPower.get("data")).get(i) == null ? 0
							: Double.parseDouble(String.valueOf(((List) piesPower.get("data")).get(i))));
					userPowertmp.add(tg - pie);
				}
				usersPower.put("data", userPowertmp);
				usersPower.put("time", piesPower.get("time"));
			}
			fullJson.put("usersPower", usersPower);

			// 预测负荷
			Map<String, Object> forecast = evTgService.getTgForecastByDate(map);
			fullJson.put("forecast", forecast);

			// 分时电价曲线start_time,end_time,price
			Map<String, Object> elePrices = electricityPriceModelService.getElecPrice(map);
			fullJson.put("elePrices", elePrices);

			List<Map<String, Object>> limit = evTgService.getTgRunTableList(map, 1, 2);
			String pLimStr = TypeUtil.getStr(limit.get(0).get("pLim"));
			String pStartStr = TypeUtil.getStr(limit.get(0).get("pStart"));
			String tgCap = TypeUtil.getStr(limit.get(0).get("tgCap"));
			// 台区越限负荷
			fullJson.put("pLim", Double.parseDouble(pLimStr) * Integer.parseInt(tgCap));
			// 台区起调负荷
			fullJson.put("pStart", Double.parseDouble(pStartStr) * Integer.parseInt(tgCap));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return fullJson;

	}

	/**
	 * 获取台区历史数据对比页面曲线数据（充电桩负荷和台区负荷对比）
	 * 
	 * @param request
	 * @return
	 */
	@RequestMapping(params = "getTgPowerCompareCurve")
	@ResponseBody
	public JSONObject getForecastAndPlan(HttpServletRequest request) {
		String orgNo = request.getParameter("orgNo");
		String startDate = request.getParameter("startDate");
		String endDate = request.getParameter("endDate");
		JSONObject json = new JSONObject();
		String tgId = "";
		String status = "";
		// 选择组织机构的时候
		String temp = orgService.getTgByOrg(orgNo);
		if (!"".equals(temp)) {
			status = "1";
			json.put("status", status);
			return json;
		}
		// 选择台区的时候
		tgId = orgNo;

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("tgId", tgId);
		map.put("dataType", "1"); // 台区总功率
		map.put("startDate", startDate);
		map.put("endDate", endDate);
		// 获取台区总负荷数据
		Map<String, Object> tgPower = evTgService.getTgPowerDataByDate(map);
		json.put("tgPower", tgPower);
		return json;

	}

	@RequestMapping(params = "getTgPlanLayout")
	@ResponseBody
	public JSONObject getTgPlanLayout(HttpServletRequest request) throws ParseException {

		JSONObject fullJson = new JSONObject();
		String yesterday = "";
		String orgNo = request.getParameter("orgNo");
		// String date = request.getParameter("date");
		String startDate = request.getParameter("startDate");
		String endDate = request.getParameter("endDate");
		String tgId = "";
		String status = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm");

		// 根据组织单位名称获取组织单位编号
		String orgNotemp = orgService.getTgByOrg(orgNo);
		if ("".equals(orgNotemp)) {
			tgId = orgNo;

		} else {
			status = "1";
			fullJson.put("status", status);
			return fullJson;
		}
		// 未选择时间的处理
		Date today = new Date();

		if (startDate.isEmpty() && endDate.isEmpty()) {
			startDate = sdf.format(today);
			endDate = sdf.format(today);
			yesterday = sdf.format(today.getTime() - 24 * 60 * 60 * 1000);
		} else {
			// 取昨日时间
			Date date1 = sdf.parse(startDate);
			Date yesterday1 = new Date(date1.getTime() - 24 * 60 * 60 * 1000);
			yesterday = sdf.format(yesterday1);
		}

		try {
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("tgId", tgId);
			map.put("startDate", startDate);
			map.put("endDate", endDate);
			map.put("yesterday", yesterday);
			map.put("dataType", "1"); // 台区总功率
			// 获取今日台区时间段内的总负荷数据
//				Map<String,Object> tgPowerMap = evTgService.getTgTimeIntervalPowerData(map);
//				List<BigDecimal> tgPower =  (List<BigDecimal>) tgPowerMap.get("data");
//				fullJson.put("tgPower", tgPower);

			// 获取所选择的时间段内的时间点
//				List<String> tgTime =  (List<String>) tgPowerMap.get("time");
//				fullJson.put("tgTime", tgTime);
//				map.put("tgTime", tgTime);

			// 获取台区功率曲线中开始为null的点
//				int nullPoint = Tools.getTgPNullPoint(tgPower);
//				map.put("nullPoint", nullPoint);

			// 获取昨日台区总负荷数据
//				List<BigDecimal> tgHisPower = evTgService.getTgyesterdayHisPowerData(map);
//				fullJson.put("tgHisPower", tgHisPower);
//				
//				//获取今日充电桩总负荷数据 
//				List<BigDecimal> piesPower = evTgService.getTgCgTimeIntervalPowerData(map);
//				fullJson.put("piesPower", piesPower);

			// 居民用电负荷曲线
			List<BigDecimal> usersPower = new ArrayList<BigDecimal>();
//				if(tgPower!=null && tgPower.size()>0){
//					for(int i = 0;i < nullPoint;i++) {
//						BigDecimal tg = tgPower.get(i) == null? BigDecimal.ZERO:tgPower.get(i);
//						BigDecimal pie = piesPower.get(i) == null?new BigDecimal(0):piesPower.get(i);
//						usersPower.add(tg.subtract(pie).compareTo(BigDecimal.ZERO)<0?new BigDecimal(0):tg.subtract(pie).setScale(2, BigDecimal.ROUND_HALF_UP));
//				
//					}
//				}
//				fullJson.put("usersPower", usersPower);

			// 分时电价曲线
//				List<BigDecimal> elePrices = evTgService.getTimeIntervalElecPrice(orgNo,tgTime);
//				fullJson.put("elePrices", elePrices);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return fullJson;

	}

	/**
	 * 台区充电电量监视页面数据获取（台区充电量）
	 * 
	 * @return
	 */
	@RequestMapping(params = "getTgUserEleList", method = RequestMethod.GET)
	@ResponseBody
	public JSONObject getTgUserEleList(HttpServletRequest request, HttpServletResponse response,
			@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) {
		JSONObject result = new JSONObject();
		JSONArray array = new JSONArray();
		Map<String, Object> params = new HashMap<String, Object>();
		// 处理前台发过来的参数
		String orgNo = request.getParameter("orgNo");
		String tgNo = request.getParameter("tgNo");
		String startTime = request.getParameter("startTime");
		String endTime = request.getParameter("endTime");
		if (orgNo != null && !orgNo.isEmpty()) {
			params.put("orgNo", orgNo);
		}
		if (tgNo != null && !tgNo.isEmpty()) {
			params.put("tgNo", tgNo);
		}
		if (startTime != null && !startTime.isEmpty()) {
			params.put("startTime", startTime);
		}
		if (endTime != null && !endTime.isEmpty()) {
			params.put("endTime", endTime);
		}
		try {
			List<Map<String, Object>> list = evTgService.getTgUserEleList(params, pageNo, pageSize);

			long totalrecord = evTgService.getTgUserEleListCount(params);
			int a = 0;
			if (list != null && list.size() > 0) {
				for (Map<String, Object> map : list) {
					JSONObject obj = new JSONObject();
					a++;
					obj.put("i", a);
					obj.put("tgId", TypeUtil.toString(map.get("tgId")));
					obj.put("tgName", TypeUtil.toString(map.get("tgName")));
					obj.put("UserPower",
							((TypeUtil.numNotNull(map.get("UserPower"))).setScale(2, BigDecimal.ROUND_HALF_UP))
									.toString());
					obj.put("chargeAmount",
							((TypeUtil.numNotNull(map.get("chargeAmount"))).setScale(2, BigDecimal.ROUND_HALF_UP))
									.toString());
					obj.put("normalChargeAmount",
							((TypeUtil.numNotNull(map.get("normalChargeAmount"))).setScale(2, BigDecimal.ROUND_HALF_UP))
									.toString());
					obj.put("orderChargeAmount",
							((TypeUtil.numNotNull(map.get("orderChargeAmount"))).setScale(2, BigDecimal.ROUND_HALF_UP))
									.toString());
					array.add(obj);
				}
			}
			result.put("total", totalrecord);
			result.put("rows", array);

		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	/**
	 * 跳转到台区参数管理页面
	 * 
	 * @return
	 */
	@RequestMapping(params = "tgParamManagement")
	public void management(HttpServletRequest request, HttpServletResponse response) {
		VelocityContext velocityContext = new VelocityContext();
		String viewName = "personalstake/tg/tgParamManagement.vm";
		try {
			ViewVelocity.view(request, response, viewName, velocityContext);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	/**
	 * 查询台区参数列表
	 * 
	 * @return
	 */
	@RequestMapping(params = "getTgParamTableList", method = RequestMethod.GET)
	@ResponseBody
	public JSONObject getTopicList(HttpServletRequest request, HttpServletResponse response,
			@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) {
		JSONObject result = new JSONObject();
		JSONArray array = new JSONArray();
		Map<String, Object> params = new HashMap<String, Object>();
		Map<String, Object> map1 = new HashMap<String, Object>();
		// 处理前台发过来的参数
		String orgNo = request.getParameter("orgNo");
		if (orgNo != null && !orgNo.isEmpty()) {
			// params.put("orgNo","%" + orgNo + "%");
			if ("1".equals(orgNo)) {
				orgNo = "01";
			}
			params.put("orgNo", orgNo);
			map1.put("组织单位编码", orgNo);
		}
		try {
			List<Map<String, Object>> list = evTgService.getTgParamTableList(params, pageNo, pageSize);
			long totalrecord = evTgService.getTgParamTableListCount(params);
			int i = 0;
			for (Map<String, Object> map : list) {
				JSONObject obj = new JSONObject();
				i++;
				obj.put("id", i);
				obj.put("tgId", TypeUtil.toStringo(map.get("tgId")));
				obj.put("orgNo", TypeUtil.toStringo(map.get("orgNo")));
				obj.put("tgName", TypeUtil.toStringo(map.get("tgName")));
				obj.put("tgCap", TypeUtil.toDouble(map.get("tgCap")));
				obj.put("economicIndex", TypeUtil.numNotNull(map.get("economicIndex")));
				obj.put("economicEnd", TypeUtil.numNotNull(map.get("economicEnd")));
				obj.put("plim", TypeUtil.numNotNull(map.get("plim")));
				obj.put("pstart", TypeUtil.numNotNull(map.get("pstart")));
				obj.put("strategy", TypeUtil.toString(map.get("strategy")));
				array.add(obj);
			}
			result.put("total", totalrecord);
			result.put("rows", array);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
}
