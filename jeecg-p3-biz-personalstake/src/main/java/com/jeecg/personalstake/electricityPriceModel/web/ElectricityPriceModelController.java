package com.jeecg.personalstake.electricityPriceModel.web;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jeecg.personalstake.electricityPriceModel.service.ElectricityPriceModelService;
import com.jeecg.personalstake.util.TypeUtil;
import org.apache.velocity.VelocityContext;
import org.jeecgframework.p3.core.util.plugin.ViewVelocity;
import org.jeecgframework.p3.core.web.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
*电价模型Controller
*/
@Controller
@RequestMapping("/personalstake/electricityPriceModelController")
public class ElectricityPriceModelController extends BaseController{

	
	@Autowired
	private ElectricityPriceModelService elePriceModelService;
	/**
     * 跳转到计费模型页面
     * @param request
     * @return
     */
    @RequestMapping(params = "getElePriceModel")
    public void getElePriceModel(HttpServletRequest request,HttpServletResponse response) {
    	try {
    	String orgNo = request.getParameter("orgNo");
    	
    	if(""!=orgNo&&null!=orgNo) {
    	
    	orgNo =	TypeUtil.getStr(elePriceModelService.getProvOrgByOrg(orgNo).get("orgcode"));
    	
    	}
        
    	VelocityContext velocityContext = new VelocityContext();
    	String viewName = "personalstake/elePriceModel/ElePriceModel.vm";
    	velocityContext.put("initOrg", orgNo);
    
			ViewVelocity.view(request,response,viewName,velocityContext);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    }
    
    
    
    /**
     * 查询阶梯电价数据
     * @param request
     * @return
     */
    @RequestMapping(params = "getMultiElePriceModelByOrgNo")
	  @ResponseBody
    public JSONObject getMultiElePriceModelByOrgNo(HttpServletRequest request,
    		@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) {
    	JSONObject result = new JSONObject();
        JSONArray array = new JSONArray();
        Map<String, Object> params = new HashMap<String, Object>();
        
		String orgNo = request.getParameter("orgNo");

		if(orgNo != null && !orgNo.isEmpty()) {
            params.put("orgNo",orgNo);
        }

        try {
            List<Map<String, Object>> list = elePriceModelService.getMultiElePriceModelList(pageSize,pageNo,params);
            long totalrecord = elePriceModelService.getMultiElePriceModelListCount(params);
//            long totalrecord = list.size();
            if(list!=null&& list.size()>0){
                for(Map<String,Object> map:list) {
                    JSONObject obj = new JSONObject();
                    obj.put("month_begin", TypeUtil.getStr(map.get("month_begin")));
                    obj.put("month_end", TypeUtil.getStr(map.get("month_end")));
                    obj.put("step", TypeUtil.getStr(map.get("step")));
                    obj.put("power_begin", TypeUtil.getStr(map.get("power_begin")));
                    obj.put("power_end", TypeUtil.getStr(map.get("power_end")));
                    obj.put("price", TypeUtil.getStr(map.get("price")));
                    obj.put("departname", TypeUtil.getStr(map.get("departname")));
                    obj.put("year", TypeUtil.getStr(map.get("year")));
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
     * 查询阶梯电价数据
     * @param request
     * @return
     */
    @RequestMapping(params = "getTimeElePriceModelByOrgNo")
	  @ResponseBody
    public JSONObject getTimeElePriceModelByOrgNo(HttpServletRequest request,
    		@RequestParam(required = false, value = "pageNo", defaultValue = "1") int pageNo,
			@RequestParam(required = false, value = "pageSize", defaultValue = "10") int pageSize) {
    	JSONObject result = new JSONObject();
        JSONArray array = new JSONArray();
        Map<String, Object> params = new HashMap<String, Object>();
        
		String orgNo = request.getParameter("orgNo");
	
		if(orgNo != null && !orgNo.isEmpty()) {
            params.put("orgNo",orgNo);
        }
        
        try {
            List<Map<String, Object>> list = elePriceModelService.getTimeElePriceModelList(pageSize,pageNo,params);
            long totalrecord = elePriceModelService.getTimeElePriceModelListCount(params);
            if(list!=null&& list.size()>0){
                for(Map<String,Object> map:list) {
                    JSONObject obj = new JSONObject();
                    obj.put("month_begin", TypeUtil.getStr(map.get("month_begin")));
                    obj.put("month_end", TypeUtil.getStr(map.get("month_end")));
                    obj.put("step", TypeUtil.getStr(map.get("step")));
                    obj.put("time_begin", TypeUtil.getStr(map.get("time_begin")));
                    obj.put("time_end", TypeUtil.getStr(map.get("time_end")));
                    obj.put("price", TypeUtil.getStr(map.get("price")));
                    obj.put("departname", TypeUtil.getStr(map.get("departname")));
                    obj.put("year", TypeUtil.getStr(map.get("year")));
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
}
