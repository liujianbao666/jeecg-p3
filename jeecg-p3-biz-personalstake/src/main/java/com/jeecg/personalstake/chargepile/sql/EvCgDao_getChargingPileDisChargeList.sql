SELECT
	ec.STAKENO stakeNo,
	ec.ALIAS alias,
	gt.TG_NAME tgName,
	ec.PWSP_MODE pm,
	ecr.run_i runI,
	ecr.run_u runU,
	ecr.run_p runP,
	ecr.data_time,
	ecr. STATUS
FROM
	ev_cg_run ecr
INNER JOIN ev_cg ec ON ec.STAKENO = ecr.stakeno
INNER JOIN g_tg gt ON ec.TG_ID = gt.TG_ID
WHERE
	1 = 1
	
  	<#if ( params.tgNos )?? && params.tgNos ?length gt 0 >
         and ec.TG_ID in ( ${params.tgNos} )
	</#if>
	
    <#if ( params.stakeNo )?? && params.stakeNo ?length gt 0 >
    	ecr.stakeno LIKE ${params.stakeNo} 
	</#if>
	
    <#if ( params.stakeName )?? && params.stakeName ?length gt 0 >
         and ec.ALIAS LIKE  ${params.stakeName} 
	</#if>
	
	<#if ( params.status )?? && params.status ?length gt 0 >
        and ecr.status=  ${params.status} 
	</#if>