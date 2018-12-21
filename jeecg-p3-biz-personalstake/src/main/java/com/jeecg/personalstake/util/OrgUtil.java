package com.jeecg.personalstake.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 项目参数工具类
 * 
 */
public class OrgUtil {
	public static final String LOCAL_CLINET_USER = "LOCAL_CLINET_USER";
	

	/**
	 * 某用户所属的组织机构的所有下属组织机构，包括自身
	 */
	public static Map<String,List<Map<String,Object>>> allChildrenOrgs = new HashMap<String,List<Map<String,Object>>>();
	
	/**
	 * 所有组织单位的下属组织单位列表，包括自身
	 */
	public static Map<String,Object> allOrgofOrgs = new HashMap<String,Object>();
	
	/**
	 * 所有组织单位的下属组织单位列表以及台区
	 */
	public static Map<String,List<Map<String,Object>>> allOrgAndTgByOrgs = new HashMap<String,List<Map<String,Object>>>();
	

	

}
