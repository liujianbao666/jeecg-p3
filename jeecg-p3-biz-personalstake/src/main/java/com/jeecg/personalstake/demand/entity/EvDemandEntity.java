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
		/**	 *ID	 */	private Integer id;	/**	 *充电桩编号	 */	private String stakeNo;	/**	 *充电接口标识（枪号）	 */	private String chargeport;	/**	 *用户ID	 */	private String acId;	/**	 *车辆id	 */	private String vhId;	/**	 *充电用户类型（1：分享充电；2：有序充电;3预约充电4：蓝牙充电）	 */	private String userType;	/**	 *充电分类（1正常充电、2有序充电）	 */	private String odModel;	/**	 *用车时间	 */	private Date vuseTime;	/**	 *剩余电量	 */	private BigDecimal remaincapacity;	/**	 *目标电量	 */	private BigDecimal targetcapacity;	/**	 *充电需求电量	 */	private BigDecimal chargingDemand;	/**	 *创建时间	 */	private Date createTime;	/**	 *订单编号	 */	private String odId;	/**	 *状态0充电失败1生成订单	 */	private String status;
	
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
	
		public Integer getId() {	    return this.id;	}	public void setId(Integer id) {	    this.id=id;	}	public String getChargeport() {	    return this.chargeport;	}	public void setChargeport(String chargeport) {	    this.chargeport=chargeport;	}	public String getAcId() {	    return this.acId;	}	public void setAcId(String acId) {	    this.acId=acId;	}	public String getVhId() {	    return this.vhId;	}	public void setVhId(String vhId) {	    this.vhId=vhId;	}	public String getUserType() {	    return this.userType;	}	public void setUserType(String userType) {	    this.userType=userType;	}	public String getOdModel() {	    return this.odModel;	}	public void setOdModel(String odModel) {	    this.odModel=odModel;	}	public Date getVuseTime() {	    return this.vuseTime;	}	public void setVuseTime(Date vuseTime) {	    this.vuseTime=vuseTime;	}	public BigDecimal getRemaincapacity() {	    return this.remaincapacity;	}	public void setRemaincapacity(BigDecimal remaincapacity) {	    this.remaincapacity=remaincapacity;	}	public BigDecimal getTargetcapacity() {	    return this.targetcapacity;	}	public void setTargetcapacity(BigDecimal targetcapacity) {	    this.targetcapacity=targetcapacity;	}	public BigDecimal getChargingDemand() {	    return this.chargingDemand;	}	public void setChargingDemand(BigDecimal chargingDemand) {	    this.chargingDemand=chargingDemand;	}	public Date getCreateTime() {	    return this.createTime;	}	public void setCreateTime(Date createTime) {	    this.createTime=createTime;	}	
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

