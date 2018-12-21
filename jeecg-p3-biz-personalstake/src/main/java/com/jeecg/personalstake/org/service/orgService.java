package com.jeecg.personalstake.org.service;

import java.util.List;
import java.util.Map;

public interface orgService  {
	/**
	 * 获取省市以及供电所下的台区列表
	 * @param orgNo
	 * @return
	 */
	public String getTgListofOrg(String orgNo);
	/**
	 * 将组织单位下的台区信息列表存入指定的静态变量
	 */
	public void getTgNoList(String orgNo);
	/**
	 * 获取组织单位下的供电所级别的组织单位，类型为6
	 * @param orgNo
	 */
	public String getOrgListofOrg(String orgNo);
	
	/**
	 * 根据orgNo取得子节点的所有台区
	 * 
	 * @param orgNo
	 * @return
	 */
	public String getTgListByOrg(String orgNo);
	
	/**
	 * 根据orgNo取得台区
	 * 
	 * @param orgNo
	 * @return
	 */
	public String getTgByOrg(String orgNo);

	public List<Map<String, Object>> getParentNode(String pid);

	public List<Map<String, Object>> getChildTreeAndTgList(List<Map<String, Object>> list2, String pid);
	
	String getProvinceCode(String orgNo);
	Map<String, Object> getOrgEntityByOrgNo(String orgNo);
	
	public List<Map<String, Object>> getAllNodes(String orgCode);
}
