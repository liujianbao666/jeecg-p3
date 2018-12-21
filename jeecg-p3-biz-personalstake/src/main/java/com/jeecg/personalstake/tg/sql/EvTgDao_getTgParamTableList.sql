SELECT
	e.TG_ID tgId,
	e.org_no orgNo,
	e.TG_NAME tgName,
	e.tg_cap tgCap,
	cg.ECONOMIC_INDEX economicIndex,
	cg.ECONOMIC_INDEX_END economicEnd,
	cg.PLIM plim,
	cg.PSTART pstart
FROM
	g_tg e
LEFT JOIN ev_tg_run cg ON e.TG_ID = cg.TG_ID
WHERE
	1 = 1


	    <#if ( params.orgNos )?? && params.orgNos ?length gt 0 >
		   and e.ORG_NO in  (  ${params.orgNos} )
		
		   <#else>
		    and e.TG_ID =  ${params.orgNo}
		   
		</#if>