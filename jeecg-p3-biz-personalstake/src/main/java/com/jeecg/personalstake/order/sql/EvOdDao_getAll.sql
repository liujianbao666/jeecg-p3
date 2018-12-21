

select * from (

 SELECT
				xxxxx.*, c1.powerRate AS eleFee,
				(
					xxxxx.orderFee - c1.powerRate
				) AS income,
				c1.sharedId
			FROM
				(
					SELECT
						xxxx.*, c.powerRate AS orderFee
					FROM
						(
							SELECT
								xxx.*, evh.VH_BRAND AS vhName,
								evh.VH_MODEL AS vhModel,
								evh.RATED_MAX_P AS vhPower,
								evh.BATERY_CAP AS vhBatcap
							FROM
								(
									SELECT
										xx.*, tg.TG_NAME tg_name
									FROM
										g_tg tg,
										(
											SELECT
												e.OD_ID odid,
												e.TRADE_FLOW_NO tradeflowno,
												e.STAKENO stakeno,
												e.CHARGEPORT chargeport,
												e.AC_ID acid,
												e.VH_ID vhid,
												e.OD_MODEL odmodel,
												e.VUSE_TIME vusetime,
												e.OD_STATUS odstatus,
												e.START_TIME starttime,
												e.END_TIME endtime,
												e.totalChargeAmount cgcap,
												e.CREATE_TIME createtime,
												e.UPDATE_TIME updatetime,
												e.START_VALUE START_VALUE,
												e.STOP_VALUE STOP_VALUE,
												e.ORG_NO orgNo,
												e.CHARGING_DEMAND CHARGING_DEMAND,
												e.BluetoothOrder,
			                                    e.userType,
			                                    e.OD_MODEL,
												cg.TG_ID tgID
											FROM
												ev_od e,
												ev_cg cg
											WHERE
												e.STAKENO = cg.STAKENO
											
										) xx
									WHERE
										xx.tgID = tg.TG_ID
								) xxx
							LEFT JOIN ev_vh evh ON xxx.vhid = evh.vh_id
						) xxxx
					LEFT JOIN charging_cost c ON xxxx.odid = c.orderId
					AND c.costType = '0'
				) xxxxx
			LEFT JOIN charging_cost c1 ON xxxxx.odid = c1.orderId
			AND c1.costType = '1'
			) eo
			
			WHERE
				1 = 1


<#include "EvOdDao_condition.sql">