package com.jeecg.personalstake.org.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jeecg.personalstake.org.dao.OrgDao;
import com.jeecg.personalstake.org.service.orgService;
import com.jeecg.personalstake.util.OrgUtil;
import com.jeecg.personalstake.util.TypeUtil;

@Service
public class orgServiceImpl  implements orgService {

	 @Autowired
	 private OrgDao orgDao;
	
	public static Map<String, Object> tgNoList = new HashMap<String, Object>(); // 存放相关前端页面选择的组织单位的下属组织单位列表
	public static Map<String, Object> orgNoList = new HashMap<String, Object>(); // 存放供电单位下属的所有组织单位列表，不再单独寻找供电所级别的组织单位


	@Override
	public String getTgListofOrg(String orgNo) {
		StringBuffer buffer = new StringBuffer("");
		if (orgNo == null || orgNo.isEmpty()) {
			return "";
		}
		if ("1".equals(orgNo)) {
			orgNo = "01";
		}
		Map<String, Object> orgMap = OrgUtil.allOrgofOrgs;
		String orgNos = TypeUtil.getStr(orgMap.get(orgNo));
		if ("".equals(orgNos)) {
			return " '" + orgNo + "' ";
		}
		// String sql ="select tg1.TG_ID tgId from g_tg tg1 where tg1.org_no in
		// ("+sb.toString()+")";
//		String sql = "select tg1.TG_ID tgId from g_tg tg1 where tg1.org_no in (" + orgNos + ")";
//		List<Map<String, Object>> list = this.findForJdbc(sql);
		
		List<Map<String, Object>> list = orgDao.getTgListofOrg(orgNos);

		if (list != null && list.size() > 0) {
			for (int i = 0; i < list.size(); i++) {
				Map<String, Object> map = list.get(i);
				if (i == list.size() - 1) {
					buffer.append("'" + map.get("tgId").toString() + "'");
				} else {
					buffer.append("'" + map.get("tgId").toString() + "'");
					buffer.append(",");
				}
			}
		}

		return buffer.toString();
	}

	@Override
	public String getTgListByOrg(String orgNo) {

		Object childOrgNo = OrgUtil.allOrgofOrgs.get(orgNo);
		if (childOrgNo.equals("") || childOrgNo == null) {

			return orgNo;
		} else {
			// for()childOrgNo
		}

		return orgNo;

	}



	@Override
	public void getTgNoList(String orgNo) {
		if (orgNo != null && !orgNo.isEmpty()) {
			// 1.当前组织机构不在台区缓存中时，需要查询并加入缓存
			if (tgNoList.get(orgNo) == null || tgNoList.get(orgNo).toString().isEmpty()) {
				String tgNos = this.getTgListofOrg(orgNo); // 调用获取组织单位下的台区的方法
				tgNoList.put(orgNo, tgNos);
			}
		}
	}

	@Override
	public String getOrgListofOrg(String orgNo) {
		/*
		 * if(orgNoList!=null){ if(orgNoList.get(orgNo)!=null &&
		 * !orgNoList.get(orgNo).toString().isEmpty()){ String orgNos =
		 * orgNoList.get(orgNo).toString(); return orgNos; } }
		 */
		/*
		 * List<Map<String,Object>> list1 = new ArrayList<Map<String,Object>>();
		 * StringBuffer sb = new StringBuffer(""); StringBuffer buffer = new
		 * StringBuffer("");
		 */
		/*
		 * String orgType = this.getOrgType(orgNo); if(orgType.isEmpty()){ return
		 * buffer.toString(); }
		 */
		/*
		 * else if(orgType.equals("6")){ //所选组织单位为供电所级别 sb = new StringBuffer(orgNo);
		 * return sb.toString(); }else{
		 */
		// 所选组织单位为供电所以上级别
		/*
		 * List<Map<String, Object>> allChildren = this.getChildTreeList(list1, orgNo);
		 * if(allChildren == null || allChildren.size()==0){ return ""; }
		 * 
		 * for(int i=0;i<allChildren.size();i++){ Map<String,Object> map =
		 * allChildren.get(i); //从所有子节点中选择类型为供电所的组织单位 if(i == allChildren.size()-1){
		 * //if(map.get("orgType").toString().equals("6")){
		 * sb.append("'"+map.get("orgCode").toString()+"'"); //} }else{
		 * //if(map.get("orgType").toString().equals("6")){
		 * sb.append("'"+map.get("orgCode").toString()+"'"); sb.append(","); //} } }
		 * orgNoList.put(orgNo, sb.toString()); return sb.toString();
		 */
		// }
		if (orgNo == null || orgNo.isEmpty()) {
			return "";
		}
		Map<String, Object> orgMap = OrgUtil.allOrgofOrgs;
		if (orgMap.get(orgNo) != null && !"".equals(orgMap)) {
			String orgNos = orgMap.get(orgNo).toString();
			return orgNos;
		}
		return null;
	}

	@Override
	public String getTgByOrg(String orgNo) {
		String status = "";
		if ("1".equals(orgNo)) {
			orgNo = "01";
		}
//		String sql2 = "SELECT count(*)  FROM t_s_depart WHERE org_code= '" + orgNo + "' ";
//		List<Map<String, Object>> list2 = this.findListbySql(sql2);
		
		
		Integer list2  = orgDao.getTgByOrg(orgNo);
		
		int num = TypeUtil.getInt(list2);
		if (num != 0) {
			status = "1";
			return status;
		}
		return status;
	}
	
	
	 //获取单一组织机构下的所有下级组织机构，包括自身
	@Override
	 public List<Map<String, Object>> getAllNodes(String pid){
		 	List list = new ArrayList();
//	    	list.add(pid);
//	    	String sql="select org_code,parentdepartid,departname from t_s_depart where org_code=?";
//	    	List<Map<String, Object>> parent = this.findForJdbc(sql,list.toArray());
		 	List<Map<String, Object>> parent = orgDao.getAllNodes(pid);
	    	List<Map<String, Object>> list1 = new ArrayList<Map<String, Object>>();
	    	List<Map<String, Object>> children = this.getChildTreeList(list1, pid);
	    	children.addAll(parent);
	    	return children;
	 }
	 
	 
	 public List<Map<String, Object>> getChildTreeList(List<Map<String,Object>> list1,String pid) {
			List<Map<String,Object>> list2 = new ArrayList<Map<String,Object>>();
//	    	List list = new ArrayList();
//	    	list.add(pid);
//	    	String sql =  
//	    			"select c.org_code,c.parentdepartid,c.departname,c.org_type from t_s_depart p ,t_s_depart c "+
//	    			 "where c.parentdepartid = p.org_code and p.org_code = ?                 ";
//	    	list2 = this.findForJdbc(sql,list.toArray());
	    	
	    	list2 = orgDao.getChildTreeList(pid);
	    	list1.addAll(list2);
	    	if(list2.size() == 0){
	    		return list1;
	    	}
	    	else{
	    		for(Map<String,Object> map:list2){
	    			getChildTreeList(list1,map.get("org_code").toString());
	    		}
	    	}
			return list1;	
			}
	 
	 
	 public List<Map<String, Object>> getChildTreeAndTgList(List<Map<String, Object>> list1, String pid) {
			List<Map<String, Object>> list2 = new ArrayList<Map<String, Object>>();
			List<String> list = new ArrayList<String>();
//			list.add(pid);
//			list.add(pid);
//			String sql = "select c.org_code,c.parentdepartid,c.departname,c.org_type,tg.TG_NAME,tg.TG_ID from t_s_depart p INNER JOIN t_s_depart c ON c.parentdepartid = p.org_code "
//					+ " LEFT JOIN g_tg tg ON c.org_code = tg.ORG_NO where p.org_code =? OR tg.TG_ID =? ";
//			list2 = this.findForJdbc(sql, list.toArray());
			
			list2 = orgDao.getChildTreeAndTgList(pid);
			list1.addAll(list2);
			if (list2.size() == 0) {
				return list1;
			} else {
				for (Map<String, Object> map : list2) {
					
					//list2 = this.findForJdbc(sql, list.toArray());
					list2 = orgDao.getChildTreeAndTgList(pid);
					// 递归组织单位的子节点
					getChildTreeAndTgList(list1, map.get("org_code").toString());
				}
			}
			return list1;
		}
		
		
		 public List<Map<String, Object>> getParentNode(String pid) {
		    	List list = new ArrayList();
//		    	list.add(pid);
//		    	String sql="select org_code,parentdepartid,departname from t_s_depart where org_code=?";
//		    	List<Map<String, Object>> parent = this.findForJdbc(sql,list.toArray());
		    	List<Map<String, Object>> parent =	orgDao.getParentNode(pid);
				return parent;
			}
		 
			@Override
			public String getProvinceCode(String orgNo) {
				String provinceCode = null;
				Map<String, Object> map = null;
				if (orgNo!=null&&orgNo!="") {
					map = getOrgEntityByOrgNo(orgNo);
					if (map != null && map.size() > 0) {
						String parentCode = TypeUtil.toString(map.get("parentdepartid"));
						String level = TypeUtil.toString(map.get("org_type"));
						String code = TypeUtil.toString(map.get("org_code"));
						if (("2").equals(level) && ("01").equals(parentCode)) {
							return code;
						} else {
							return getProvinceCode(parentCode);
						}
					} else {
						return provinceCode;
					}

				}
				return provinceCode;
			}
			
			
			@Override
			public Map<String, Object> getOrgEntityByOrgNo(String orgNo) {
				Map<String, Object> map = null;
				if (null!=orgNo&&orgNo!="") {
					map = 	orgDao.getOrgEntityByOrgNo(orgNo);
				}
				return map;
			}

}
