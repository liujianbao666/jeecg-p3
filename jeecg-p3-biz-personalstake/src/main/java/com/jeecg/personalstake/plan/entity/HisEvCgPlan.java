package com.jeecg.personalstake.plan.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;


public class HisEvCgPlan implements Serializable {

	private static final long serialVersionUID = 6794268610147181927L;

	private String planId;

	private String tgId;

	private String stakeno;

	private String odId;

	private Integer planCount;

	private Integer serialNum;

	private Date startTime;

	private Date endTime;

	private BigDecimal p;

	private String status;

	public String getPlanId() {
		return planId;
	}

	public void setPlanId(String planId) {
		this.planId = planId;
	}

	public String getTgId() {
		return tgId;
	}

	public void setTgId(String tgId) {
		this.tgId = tgId;
	}

	public String getStakeno() {
		return stakeno;
	}

	public void setStakeno(String stakeno) {
		this.stakeno = stakeno;
	}

	public String getOdId() {
		return odId;
	}

	public void setOdId(String odId) {
		this.odId = odId;
	}

	public Integer getPlanCount() {
		return planCount;
	}

	public void setPlanCount(Integer planCount) {
		this.planCount = planCount;
	}

	public Integer getSerialNum() {
		return serialNum;
	}

	public void setSerialNum(Integer serialNum) {
		this.serialNum = serialNum;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public BigDecimal getP() {
		return p;
	}

	public void setP(BigDecimal p) {
		this.p = p;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Override
	public String toString() {
		return "EvCgPlan [planId=" + planId + ", tgId=" + tgId + ", stakeno=" + stakeno + ", odId=" + odId + ", planCount=" + planCount
				+ ", serialNum=" + serialNum + ", startTime=" + startTime + ", endTime=" + endTime + ", p=" + p + ", status=" + status + "]";
	}
}