package com.jeecg.personalstake.chargepile.service.impl;

import com.jeecg.personalstake.chargepile.dao.EvCgDao;
import com.jeecg.personalstake.chargepile.entity.EvCgEntity;
import com.jeecg.personalstake.chargepile.service.EvCgService;
import com.jeecg.personalstake.org.service.orgService;
import com.jeecg.personalstake.tg.dao.EvTgDao;
import com.jeecg.personalstake.tg.service.EvTgService;
import com.jeecg.personalstake.util.DateUtils;
import com.jeecg.personalstake.util.StringUtil;
import com.jeecg.personalstake.util.TypeUtil;
import org.jeecgframework.minidao.pojo.MiniDaoPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 描述：充电桩档案
 * @author: www.jeecg.org
 * @since：2018年11月22日 14时11分56秒 星期四 
 * @version:1.0
 */

@Service("evCgService")
public class EvCgServiceImpl implements EvCgService {
	@Resource
	private EvCgDao evCgDao;
	@Resource
	private EvTgDao evTgDao;
	@Autowired
	private EvTgService evTgService;
	@Autowired
	private orgService orgService;
	
	@Override
	public EvCgEntity get(String id) {
		return evCgDao.get(id);
	}

	@Override
	public int update(EvCgEntity evCg) {
		return evCgDao.update(evCg);
	}

	@Override
	public void insert(EvCgEntity evCg) {
		evCgDao.insert(evCg);
		
	}

	@Override
	public MiniDaoPage<Map> getAll(Map evCg, int page, int rows) {
		return evCgDao.getAll(evCg, page, rows);
	}

	@Override
	public void delete(EvCgEntity evCg) {
		evCgDao.delete(evCg);
		
	}

	/**
	 * 获取充电桩充电电量数据
	 */
	@Override
	public List<Map<String, Object>> getChargingPileChargingAmountData(Map<String, Object> params, int pageNo,
			int pageSize) {
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		String tgNo = (String) params.get("tgNo");
		String orgNo = (String) params.get("orgNo");
		// 路由器编号集合
		List<Map<String, Object>> listErId = evTgService.getErInfoList(params, pageSize, pageNo);
		for (Map<String, Object> map : listErId) {
			Map<String, Object> mapEr = new HashMap<String, Object>();
			String ErId = map.get("STAKENO").toString();
			String ErName = map.get("ALIAS").toString();

			// 总充电量
			BigDecimal ErTotalPower = getErTotalPower(ErId, params);
			// 正常充电量
			BigDecimal normalChargeAmount = getChargeAmountByType(ErId, params, "1");
			// 有序充电量
			BigDecimal orderChargeAmount = getChargeAmountByType(ErId, params, "2");
			mapEr.put("ErId", ErId);
			mapEr.put("ErName", ErName);
			mapEr.put("ErTotalPower", ErTotalPower);
			mapEr.put("normalChargeAmount", normalChargeAmount);
			mapEr.put("orderChargeAmount", orderChargeAmount);
			list.add(mapEr);
		}
		return list;

	}
	
	
	@Override
	public long ChargingPileChargingAmountDataCount(Map<String, Object> params) {
		// TODO Auto-generated method stub
		
		
		return evTgDao.ChargingPileChargingAmountDataCount(params);
	}
	
	
	public BigDecimal getErTotalPower(String ErId, Map<String, Object> params) {
		// TODO Auto-generated method stub
			BigDecimal decimal = new BigDecimal(0);
			String startTime = (String) params.get("start_time");
			String endTime = (String) params.get("end_time");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
			BigDecimal middleData = new BigDecimal(0);
			BigDecimal firstData = new BigDecimal(0);
			BigDecimal lastData = new BigDecimal(0);
			Date dBegin;
			Date dEnd;
			if (StringUtil.isNotEmpty(startTime)) {
				try {
					if (StringUtil.isEmpty(endTime)) {
						endTime = formatter.format(new Date());
					}
					dBegin = sdf.parse(startTime);
					dEnd = sdf.parse(endTime);
					List<Date> dates = TypeUtil.findDates(dBegin, dEnd);
					// 取第二天到倒数第二天的数据
					if (dates.size() == 1) {
						firstData = getPartHistoryData("his_cg_p_curve_data", startTime, endTime, ErId);
					} else if (dates.size() >= 2) {
						if (dates.size() == 3) {
							String secondTime = formatter.format(dates.get(1));
							middleData = getHistoryData("his_cg_p_curve_data", secondTime, secondTime, ErId);
						} else if (dates.size() >= 4) {
							String secondTime = formatter.format(dates.get(1));
							String lSecondTime = formatter.format(dates.get(dates.size() - 2));
							middleData = getHistoryData("his_cg_p_curve_data", secondTime, lSecondTime, ErId);
						}
						// 第一天的数据
						dEnd = TypeUtil.getNeedTime(23, 55, 0, startTime);
						String eTime = formatter.format(dEnd);
						firstData = getPartHistoryData("his_cg_p_curve_data", startTime, eTime, ErId);
						// 最后一天的数据
						dBegin = TypeUtil.getNeedTime(0, 0, 0, endTime);
						String sTime = formatter.format(dBegin);
						lastData = getPartHistoryData("his_cg_p_curve_data", sTime, endTime, ErId);
					}
					decimal = firstData.add(middleData).add(lastData);
				} catch (ParseException e) {
					e.printStackTrace();
				}
			}
			if (StringUtil.isNotEmpty(endTime) && StringUtil.isEmpty(startTime)) {
				// 获取结束时间之前的数据
				String time = TypeUtil.getSpecifiedDayBefore(endTime);
				BigDecimal beforeData = getHistoryData("his_cg_p_curve_data", null, time, ErId);
				dBegin = TypeUtil.getNeedTime(0, 0, 0, endTime);
				String sTime = formatter.format(dBegin);
				BigDecimal todayData = getPartHistoryData("his_cg_p_curve_data", sTime, endTime, ErId);
				decimal = beforeData.add(todayData);
			}
			if (StringUtil.isEmpty(startTime) && StringUtil.isEmpty(endTime)) {
				decimal = getHistoryData("his_cg_p_curve_data", null, null, ErId);
			}
			decimal = (decimal.multiply(new BigDecimal(5)).divide(new BigDecimal(60), 2)).setScale(2);
			return decimal;
		
	}
	
	
	/**
	 * 获取不完整天的历史数据
	 *
	 * @param tableName
	 * @param startTime
	 * @param endTime
	 * @param tgId
	 * @return
	 */
	public BigDecimal getPartHistoryData(String tableName, String startTime, String endTime, String ErId) {
		StringBuffer sqlbuffer = new StringBuffer("");
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date d = DateUtils.str2Date(endTime, format);
		BigDecimal decimal = new BigDecimal(0);
		String s = TypeUtil.joinSumStringNow(startTime, endTime);
		List<Object> lista = new ArrayList<Object>();

		if (StringUtil.isNotEmpty(s)) {
			sqlbuffer.append("select  ");
			sqlbuffer.append(s);
			sqlbuffer.append(" sum_p from " + tableName + " where 1=1");
			if (!"".equals(ErId) && ErId != null) {
				sqlbuffer.append(" and CG_ID= "+ErId);
				//lista.add(ErId);
			}
			if (!"".equals(endTime) && endTime != null) {
				sqlbuffer.append(" and COLL_DATE = "+format.format(d));
			//	lista.add(format.format(d));
			}
			String sql = sqlbuffer.toString();
			//Map<String, Object> map = this.findOneForJdbc(sql, lista.toArray());
			
			Map<String, Object> map =  evTgDao.getSqlMapResult(sql);
			if (map != null) {
				if (map.get("sum_p") != null) {
					decimal = new BigDecimal((map.get("sum_p")).toString());
				}
			}
		}
		return decimal;
	}

	/**
	 * 获取整天的历史数据
	 *
	 * @param tableName
	 * @param startTime
	 * @param endTime
	 * @param tgId
	 * @return
	 */
	public BigDecimal getHistoryData(String tableName, String startTime, String endTime, String ErId) {
		StringBuffer sqlbuffer = new StringBuffer("");
		BigDecimal decimal = new BigDecimal(0);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date e = DateUtils.str2Date(endTime, format);
		Date s = DateUtils.str2Date(startTime, format);
		List<Map<String, Object>> list = null;
		List<Object> lista = new ArrayList<Object>();

		sqlbuffer.append("select  ");
		for (int j = 1; j < 289; j++) {
			if (j < 10) {
				sqlbuffer.append("sum(IFNULL(D0" + j + ",0))+");
			} else if (j < 288) {
				sqlbuffer.append("sum(IFNULL(D" + j + ",0))+");
			} else {
				sqlbuffer.append("sum(IFNULL(D" + j + ",0))");
			}
		}
		sqlbuffer.append(" sum_p from " + tableName + " where 1=1");

		if (!"".equals(ErId) && ErId != null) {
			sqlbuffer.append(" and CG_ID= "+ErId);
		//	lista.add(ErId);
		}
		if (!"".equals(endTime) && endTime != null) {
			sqlbuffer.append(" and date(COLL_DATE) <= "+format.format(e));
			//lista.add(format.format(e));
		}
		if (!"".equals(startTime) && startTime != null) {
			sqlbuffer.append(" and date(COLL_DATE) >= "+format.format(s));
			//lista.add(format.format(s));
		}
		String sql = sqlbuffer.toString();
	//	List<Map<String, Object>> listMap = this.findForJdbc(sql, lista.toArray());
		List<Map<String, Object>> listMap = evTgDao.getSqlListResult(sql);
		for (Map<String, Object> map : listMap) {
			if (map != null) {
				if (map.get("sum_p") != null) {
					decimal = new BigDecimal((map.get("sum_p")).toString()).add(decimal);
				}
			}
		}
		return decimal;
	}

	public BigDecimal getChargeAmountByType(String ErId, Map<String, Object> params, String type) {
		String startTime = (String) params.get("startTime");
		String endTime = (String) params.get("endTime");
		BigDecimal b = getChargeAmountData(startTime, endTime, ErId, type);
		return b;
	}

	public BigDecimal getChargeAmountData(String startTime, String endTime, String ErId, String type) {
		StringBuffer sqlbuffer = new StringBuffer("");
		BigDecimal decimal = new BigDecimal(0);
		List<Object> lista = new ArrayList<Object>();

		sqlbuffer.append("select  ");
		sqlbuffer.append("sum(IFNULL(eo.totalChargeAmount,0))");
		sqlbuffer.append(" total_amount from ev_cg ec inner join ev_od  eo on ec.STAKENO=eo.STAKENO");
		if (!"".equals(ErId) && ErId != null) {
			sqlbuffer.append(" and ec.STAKENO= "+ErId);
			//lista.add(ErId);
		}
		sqlbuffer.append(" where 1=1");
		if (!"".equals(type) && type != null) {
			sqlbuffer.append(" and eo.OD_MODEL= "+type);
		//	lista.add(type);
		}
		if (!"".equals(endTime) && endTime != null) {
			sqlbuffer.append(" and eo.START_TIME <= "+endTime);
		//	lista.add(endTime);
		}
		if (!"".equals(startTime) && startTime != null) {
			sqlbuffer.append(" and eo.START_TIME >= "+startTime);
		//	lista.add(startTime);
		}
		String sql = sqlbuffer.toString();
		//Map<String, Object> map = this.findOneForJdbc(sql, lista.toArray());
		Map<String, Object> map =evTgDao.getSqlMapResult(sql);
		if (map != null) {
			if (map.get("total_amount") != null) {
				decimal = new BigDecimal((map.get("total_amount")).toString());
			}
		}
		return decimal;

	}

	/**
	 * 获取充电桩放电列表数据
	 */
	@Override
	public List<Map<String, Object>> getChargingPileDisChargeList(int pageNo, int pageSize,
			Map<String, Object> params) {
		String orgNo = (String) params.get("orgNo");
		String stakeNo = (String) params.get("stakeNo");
		String stakeName = (String) params.get("stakeName");
		String status = (String) params.get("status");
		String flag = (String) params.get("flag");
		StringBuffer sqlbuffer = new StringBuffer("");
		List<Map<String, Object>> list = null;
		List<Object> lista = new ArrayList<Object>();
		
		if (!"".equals(orgNo) && orgNo != null) {
			String tgNos = orgService.getTgListofOrg(orgNo);
			if (!tgNos.isEmpty() && tgNos != null) {
				params.put("tgNos", tgNos);
			}
		}
		
		list = evCgDao.getChargingPileDisChargeList(pageNo,pageSize,params);
		// }
		return list;
	}

	@Override
	public long getChargingPileDisChargeListCount(Map<String, Object> params) {
		// TODO Auto-generated method stub
		return evCgDao.getChargingPileDisChargeListCount(params);
	}


	

}
