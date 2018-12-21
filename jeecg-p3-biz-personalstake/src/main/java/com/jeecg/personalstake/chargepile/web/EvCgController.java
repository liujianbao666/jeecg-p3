package com.jeecg.personalstake.chargepile.web;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jeecg.personalstake.chargepile.entity.EvCgEntity;
import com.jeecg.personalstake.chargepile.service.EvCgService;
import com.jeecg.personalstake.chargepile.service.HisCgCurveDataService;
import com.jeecg.personalstake.org.service.orgService;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
 /**
 * 描述：充电桩档案
 * @author: www.jeecg.org
 * @since：2018年11月22日 14时11分56秒 星期四 
 * @version:1.0
 */
@Controller
@RequestMapping("/personalstake/evCg")
public class EvCgController extends BaseController{
  @Autowired
  private EvCgService evCgService;
  @Autowired
  private orgService orgService;
  @Autowired
  private HisCgCurveDataService hisCgCurveDataService;
	  /**
	  * 跳转到列表页面
	  * @return
	  */
  @RequestMapping(params = "tolist",method = {RequestMethod.GET,RequestMethod.POST})
	public void list(@ModelAttribute EvCgEntity query,HttpServletRequest request,HttpServletResponse response) throws Exception{
			try {
				VelocityContext velocityContext = new VelocityContext();
				String viewName = "personalstake/chargepile/evCg-list.vm";
				ViewVelocity.view(request,response,viewName,velocityContext);
			} catch (Exception e) {
				e.printStackTrace();
			}
	}
	/**
	  * 列表页面
	  * @return
	  */
	@RequestMapping(params = "list",method = {RequestMethod.GET,RequestMethod.POST})
	@ResponseBody
	public MiniDaoPage<Map> list(@ModelAttribute EvCgEntity query,HttpServletRequest request,HttpServletResponse response,
			@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) throws Exception{
		
		Map<String, Object> params = new HashMap<String, Object>();
		String stakeName = request.getParameter("stakeName");
		String stakeNo = request.getParameter("stakeNo");
		String status = request.getParameter("status");
		String orgNo = request.getParameter("orgNo");
		if (stakeNo != null && !stakeNo.isEmpty()) {
			params.put("stakeNo", stakeNo);
		}
		if (stakeName != null && !stakeName.isEmpty()) {
			params.put("stakeName", "%" + stakeName + "%");
		}
		if (status != null && !status.isEmpty()) {
			params.put("status", status);
		}
		
        if (!"".equals(orgNo) && orgNo != null) {
        	 String tgNos = orgService.getTgListofOrg(orgNo);
        	 if (!tgNos.isEmpty() && tgNos != null) {
        		params.put("tgNos", tgNos);
        	 }
         }
        
		MiniDaoPage<Map> list =  evCgService.getAll(params,pageNo,pageSize);
		
		return list;
	}
	/**
	 * 跳转到充电桩
	 * @param request
	 * @param response
	 */
	@RequestMapping(params="cgModel")
	public void getTgCurve(HttpServletRequest request,HttpServletResponse response){
		String stakeNo = request.getParameter("stakeNo");
		if(stakeNo==null) {
			stakeNo="";
		}
		try {
			VelocityContext velocityContext = new VelocityContext();
			velocityContext.put("cgId",stakeNo);
			String viewName = "personalstake/chargepile/chargingcurvehistory.vm";
			ViewVelocity.view(request,response,viewName,velocityContext);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	/**
	 * 获取充电桩的历史信息（功率，电压，电流）曲线
	 * @return String
	 */
	@RequestMapping(params="getCgEcharts")
	@ResponseBody
	public JSONObject getCgEcharts(HttpServletRequest request) {
		JSONObject fullJson = new JSONObject();
		String startDate = request.getParameter("startDate");
        String endDate = request.getParameter("endDate");
		String cgId = request.getParameter("cgId");
		// 页面点击重置按钮的情况
		if (cgId == null || cgId.isEmpty()) {
			return fullJson;
		}
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("cgId",cgId);
		map.put("startDate",startDate);
        map.put("endDate",endDate);
        Map<String, Object> historyPowerData = hisCgCurveDataService.getHistoryPowerData(map);
        Map<String, Object>  historyVoltageData = hisCgCurveDataService.getHistoryVoltageData(map);
        Map<String, Object> historyElectricData = hisCgCurveDataService.getHistoryElectricData(map);
		fullJson.put("historyPowerData", historyPowerData);
		fullJson.put("historyVoltageData", historyVoltageData);
		fullJson.put("historyElectricData", historyElectricData);
		return fullJson;
	}
	
	
	
	
	
	/**
     * 跳转到充电需求监视管理页面（充电桩总充电量、有序电量、正常电量统计页面）
     * @param request
     * @return
     */
    @RequestMapping(params = "getChargingPilePower")
    public void getChargingPilePower(HttpServletRequest request,HttpServletResponse response) {
    	try {
    	VelocityContext velocityContext = new VelocityContext();
		String viewName = "personalstake/chargepile/chargingPilePower.vm";
	
			ViewVelocity.view(request,response,viewName,velocityContext);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
	
    
    
    
    /**
     * 查询充电桩充电量数据
     * @param request
     * @return
     */
    @RequestMapping(params = "getChargingPileChargingAmountData")
	@ResponseBody
    public JSONObject getChargingPileChargingAmountData(HttpServletRequest request,HttpServletResponse response,
    		@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) {
    	JSONObject result = new JSONObject();
        JSONArray array = new JSONArray();
        Map<String, Object> params = new HashMap<String, Object>();
        
		String orgNo = request.getParameter("orgNo");
		String tgNo = request.getParameter("tgNo");
		String stakeNo = request.getParameter("cdz");
		String stakeName = request.getParameter("stakeName");
		String start_time = request.getParameter("start_time");
		String end_time = request.getParameter("end_time");
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
		try {
            List<Map<String, Object>> list = evCgService.getChargingPileChargingAmountData(params,pageNo,pageSize);
            long totalrecord = evCgService.ChargingPileChargingAmountDataCount(params);
            if(list!=null&& list.size()>0){
                for(Map<String,Object> map:list) {
                    JSONObject obj = new JSONObject();
                    obj.put("stankno", TypeUtil.getStr(map.get("ErId")));
                    obj.put("stankName", TypeUtil.getStr(map.get("ErName")));
                    obj.put("totalPower", TypeUtil.getStr(map.get("ErTotalPower")));
                    obj.put("normalPower", TypeUtil.getStr(map.get("normalChargeAmount")));
                    obj.put("orderPower", TypeUtil.getStr(map.get("orderChargeAmount")));
                    array.add(obj);
                }
            }
            result.put("total", totalrecord);
            result.put("rows", array);
			return result;
        } catch (Exception e) {
            e.printStackTrace();
			return null;
        }
    }
    
    
    /**
     * 跳转到充电桩放电的页面上
     */
    @RequestMapping(params = "chargingPileDischarge")
    public void getChargingStatusPage(HttpServletRequest request,HttpServletResponse response) {
        
        VelocityContext velocityContext = new VelocityContext();
		String viewName = "personalstake/chargepile/chargingPileDischarge.vm";
	
			try {
				ViewVelocity.view(request,response,viewName,velocityContext);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        
    }
    
    /**
     * 获取充电桩放电列表
     */
    @RequestMapping(params = "getDischargeList", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject getChargingPileList(HttpServletRequest request,HttpServletResponse response,
    		@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) {
		JSONObject result = new JSONObject();
		JSONArray array = new JSONArray();
		Map<String, Object> params = new HashMap<String, Object>();
		Date now = new Date();
		// 处理前台发过来的参数
		String stakeNo = request.getParameter("stakeNo");
		String stakeName = request.getParameter("stakeName");
		String orgNo = request.getParameter("orgNo");
		String status = request.getParameter("status");
		try {
			if (stakeNo != null && !stakeNo.isEmpty()) {
				params.put("stakeNo", "%" + stakeNo + "%");
			}
			if (stakeName != null && !stakeName.isEmpty()) {
				params.put("stakeName", "%" + stakeName + "%");
			}
			if (orgNo != null && !orgNo.isEmpty()) {
				params.put("orgNo", orgNo);
			}
			if (status != null && !status.isEmpty()) {
				if ("4".equals(status)) {
					params.put("status", "");
					params.put("flag", status);
				} else {
					params.put("status", status);
				}
			}
			SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			List<Map<String, Object>> list = evCgService.getChargingPileDisChargeList(pageNo, pageSize, params);
			long totalrecord = evCgService.getChargingPileDisChargeListCount(params);

			// 离线状态的时候
			if ("4".equals(status)) {
				if (list != null && list.size() > 0) {
					for (Map<String, Object> map : list) {
						Date temp = sf.parse(TypeUtil.getStr(map.get("data_time")));
						if ((now.getTime() - temp.getTime()) / (1000 * 60) > 5) {
							JSONObject obj = new JSONObject();
							obj.put("stakeNo", TypeUtil.toString(map.get("stakeNo")));
							obj.put("alias", TypeUtil.toString(map.get("alias")));
							obj.put("tgName", TypeUtil.toString(map.get("tgName")));
							obj.put("pm", TypeUtil.toString(map.get("pm")));
							if (map.get("data_time") != null && !"".equals(map.get("data_time"))) {
								obj.put("data_time", sf.format(map.get("data_time")));
							}
							obj.put("runI", ((TypeUtil.numNotNull(map.get("runI"))).setScale(2, BigDecimal.ROUND_HALF_UP)).toString());
							obj.put("runU", ((TypeUtil.numNotNull(map.get("runU"))).setScale(0, BigDecimal.ROUND_HALF_UP)).intValue());
							obj.put("runP", ((TypeUtil.numNotNull(map.get("runP"))).setScale(2, BigDecimal.ROUND_HALF_UP)).toString());
							obj.put("status", "4");
							array.add(obj);
						}
					}
				}
				JSONArray arrays = TypeUtil.dividePage(pageSize, pageNo, array);
				result.put("total", array.size());
				result.put("rows", arrays);
			} else {

				if (list != null && list.size() > 0) {
					for (Map<String, Object> map : list) {
						JSONObject obj = new JSONObject();
						obj.put("stakeNo", TypeUtil.toString(map.get("stakeNo")));
						obj.put("alias", TypeUtil.toString(map.get("alias")));
						obj.put("tgName", TypeUtil.toString(map.get("tgName")));
						obj.put("pm", TypeUtil.toString(map.get("pm")));
						if (map.get("data_time") != null && !"".equals(map.get("data_time"))) {
							obj.put("data_time", sf.format(map.get("data_time")));
						}
						obj.put("runI", ((TypeUtil.numNotNull(map.get("runI"))).setScale(2, BigDecimal.ROUND_HALF_UP)).toString());
						obj.put("runU", ((TypeUtil.numNotNull(map.get("runU"))).setScale(0, BigDecimal.ROUND_HALF_UP)).intValue());
						obj.put("runP", ((TypeUtil.numNotNull(map.get("runP"))).setScale(2, BigDecimal.ROUND_HALF_UP)).toString());
						obj.put("status", map.get("status"));
						array.add(obj);
					}
				}
				result.put("total", totalrecord);
				result.put("rows", array);
			}

		} catch (ParseException e) {
			e.printStackTrace();
		}
		return result;
	}
    
}

