SELECT
	*
FROM
	(
		SELECT
			hp.TG_ID tgId,
			hp. STATUS STATUS,
			gt.TG_Name tgName,
			hp.STAKENO stakeNo,
			od.TRADE_FLOW_NO flowNo,
			hp.START_TIME startTime,
			hp.END_TIME endTime,
			hp.PLAN_COUNT planCount,
			hp.SERIAL_NUM serialNum,
			hp.p p,
			hp.PLAN_ID planId
		FROM
			(
				his_ev_cg_plan hp
				INNER JOIN g_tg gt ON hp.TG_ID = gt.TG_ID
			)
		INNER JOIN ev_od od ON hp.OD_ID = od.OD_ID
		
	) result
WHERE
	1 = 1
	
	
	
		
	    <#if ( params.tgNos )?? && params.tgNos ?length gt 0 >
		   
	             and result.tgid in ( ${params.tgNos} )
		
		</#if>

	
	
		<#if ( params.stakeNo )?? && params.stakeNo  ?length gt 0>
		
			and result.stakeno = :params.stakeNo
			
		</#if>
		
	
		<#if ( params.flowNo )?? && params.flowNo  ?length gt 0>
		
			 and result.flowNo = :params.flowNo
			 
		</#if>
		
		<#if ( params.executeStatus )?? && params.executeStatus  ?length gt 0>
		
			 
			 and result.status= :params.executeStatus
		</#if>
		
			<#if ( params.startTime )?? && params.startTime  ?length gt 0>
		
			 
			 and result.startTime > :params.startTime
		</#if>
		
		
			<#if ( params.endTime )?? && params.endTime  ?length gt 0>
		
			 
			 and result.endTime < :params.endTime
		</#if>
