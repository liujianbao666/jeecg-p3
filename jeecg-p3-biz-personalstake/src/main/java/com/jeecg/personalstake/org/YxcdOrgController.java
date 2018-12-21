package com.jeecg.personalstake.org;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.jeecg.personalstake.org.dao.OrgDao;
import com.jeecg.personalstake.org.service.orgService;
import com.jeecg.personalstake.util.OrgUtil;
import com.jeecg.personalstake.util.TypeUtil;
import net.sf.json.JSONArray;
import org.jeecgframework.p3.core.web.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/personalstake/org")
public class YxcdOrgController extends BaseController {

	@Autowired
	orgService orgService;
	@Autowired
	OrgDao OrgDao;

	@RequestMapping(params = "getUserInfo")
	@ResponseBody
	public JSONObject getUserOrg(HttpServletRequest request, HttpServletResponse response) {

		Object userInfo = request.getSession().getAttribute("userInfo");
		JSONObject userInfoJson = new JSONObject();
		if (userInfo != null) {
			userInfoJson = JSON.parseObject(JSON.toJSONString(userInfo));
		} else {
			// 未获取到session中的用户信息
			userInfoJson.put("userName", "未登录");
			userInfoJson.put("orgNo", "01");
			userInfoJson.put("orgName", "国家电网公司");
		}
		return userInfoJson;
	}

	@PostConstruct
	public void initOrgTree() {
		// 为了提高取值速度，现将数据存入缓存
		List<Map<String, Object>> list2 = new ArrayList<Map<String, Object>>();
		// 有台区的tree
		List<Map<String, Object>> childOrgsAndTg = orgService.getChildTreeAndTgList(list2, "01");
		List<Map<String, Object>> parent = orgService.getParentNode("01");
		childOrgsAndTg.addAll(parent);
		OrgUtil.allOrgAndTgByOrgs.put("01", childOrgsAndTg);
		
		List<Map<String, Object>> orgNoList = orgService.getAllNodes("01"); 
		
		if(orgNoList != null && orgNoList.size()>0){
			for(Map<String,Object> map:orgNoList){
				String orgCode = map.get("org_code").toString();
				List<Map<String, Object>> org = orgService.getAllNodes(orgCode);
				StringBuffer sb = new StringBuffer("");
				if(org!=null && org.size()>0){
					for(int i=0;i<org.size();i++){
						if(i==org.size()-1){
							sb.append(org.get(i).get("org_code").toString());
						}
						else{
							sb.append(org.get(i).get("org_code").toString());
							sb.append(",");
						}
					}
					OrgUtil.allOrgofOrgs.put(orgCode, sb.toString());
				}
				
			}
		}
	}

	// 获取组织机构树数据
	@RequestMapping(params = "myQuery", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public void ztreeStandardData(HttpServletRequest request, HttpServletResponse response) throws IOException {
		List<String> lstTree = new ArrayList<String>();
		response.setHeader("Content-type", "text/html;charset=UTF-8");
		String pid = request.getParameter("pid");
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		
		list = OrgUtil.allOrgAndTgByOrgs.get(pid);

		String temp = "";
		for (Map<String, Object> map : list) {
			// 左链接组织机构相等的时候只加入tgId
			if (temp.equals(map.get("org_code"))) {
				temp = TypeUtil.getStr(map.get("org_code"));
				String s2 = "{id:" + map.get("TG_ID") + ", pId:" + map.get("org_code") + ", name:\""
						+ map.get("TG_NAME") + "\" , open:true}";
				lstTree.add(s2);
			} else {
				// 左链接组织机构不相等的时候加入组织机构
				temp = TypeUtil.getStr(map.get("org_code"));
				String s1 = "{id:" + map.get("org_code") + ", pId:" + map.get("parentdepartid") + ", name:\""
						+ map.get("departname") + "\" , open:true}";
				lstTree.add(s1);
				if (!"".equals(map.get("TG_ID")) && map.get("TG_ID") != null) {
					String s3 = "{id:" + map.get("TG_ID") + ", pId:" + map.get("org_code") + ", name:\""
							+ map.get("TG_NAME") + "\" , open:true}";
					lstTree.add(s3);
				}
			}
		}
		// 再次添加树结构方法类似
		response.getWriter().print(JSONArray.fromObject(lstTree).toString());
	}

	/**
	 * 刷新本地的组织机构缓存
	 * 
	 * @return
	 */

	@RequestMapping(params = "updateOrgCache", method = { RequestMethod.GET, RequestMethod.POST })
	@ResponseBody
	public JSONObject updateOrgCache(HttpServletRequest request, HttpServletResponse response) {
		JSONObject result = new JSONObject();
		String pid = request.getParameter("pid");
		try {
			List<Map<String, Object>> list2 = new ArrayList<Map<String, Object>>();
			// 有台区的tree
			List<Map<String, Object>> childOrgsAndTg = orgService.getChildTreeAndTgList(list2, pid);

			List<Map<String, Object>> parent = orgService.getParentNode(pid);
			childOrgsAndTg.addAll(parent);
			OrgUtil.allOrgAndTgByOrgs.put(pid, childOrgsAndTg);
//			orgService.getAllOrgsofOrg();
			result.put("status", "success");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("status", "fails");
		}
		return result;
	}

}
