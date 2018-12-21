package com.jeecg.personalstake.demand.entity;

import java.io.Serializable;
import java.util.Date;
import java.math.BigDecimal;

/**
 * 描述：需求表
 * @author: www.jeecg.org
 * @since：2018年11月22日 14时05分30秒 星期四 
 * @version:1.0
 */
public class EvDemandEntity implements Serializable{
	private static final long serialVersionUID = 1L;
	
	
	/**
	 *创建开始时间
	 */
	private Date start_time;
	/**
	 *创建结束时间
	 */
	private Date end_time;
	
	/**
	 *组织单位编码
	 */
	private String orgNo;
	/**
	 *桩名
	 */
	private String alias;
	/**
	 *电池容量
	 */
	private String BATERY_CAP;
	/**
	 *车辆功率
	 */
	private String RATED_MAX_P;
	/**
	 *车辆品牌
	 */
	private String VH_BRAND;
	/**
	 *车辆型号
	 */
	private String VH_MODEL;
	/**
	 *根据orgNo查出来的台区编号
	 */
	private String tgNos;
	
	
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getStakeNo() {
		return stakeNo;
	}
	public void setStakeNo(String stakeNo) {
		this.stakeNo = stakeNo;
	}
	
	
	
	
	public String getOdId() {
		return odId;
	}
	public void setOdId(String odId) {
		this.odId = odId;
	}
	public Date getStart_time() {
		return start_time;
	}
	public void setStart_time(Date start_time) {
		this.start_time = start_time;
	}
	public Date getEnd_time() {
		return end_time;
	}
	public void setEnd_time(Date end_time) {
		this.end_time = end_time;
	}
	public String getOrgNo() {
		return orgNo;
	}
	public void setOrgNo(String orgNo) {
		this.orgNo = orgNo;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	public String getBATERY_CAP() {
		return BATERY_CAP;
	}
	public void setBATERY_CAP(String bATERY_CAP) {
		BATERY_CAP = bATERY_CAP;
	}
	public String getRATED_MAX_P() {
		return RATED_MAX_P;
	}
	public void setRATED_MAX_P(String rATED_MAX_P) {
		RATED_MAX_P = rATED_MAX_P;
	}
	public String getVH_BRAND() {
		return VH_BRAND;
	}
	public void setVH_BRAND(String vH_BRAND) {
		VH_BRAND = vH_BRAND;
	}
	public String getVH_MODEL() {
		return VH_MODEL;
	}
	public void setVH_MODEL(String vH_MODEL) {
		VH_MODEL = vH_MODEL;
	}
	public String getTgNos() {
		return tgNos;
	}
	public void setTgNos(String tgNos) {
		this.tgNos = tgNos;
	}
	
}
