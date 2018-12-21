SELECT
count(*)
FROM
	g_tg e
LEFT JOIN ev_tg_run cg ON e.TG_ID = cg.TG_ID
WHERE
	1 = 1


	    <#if ( params.orgNos )?? && params.orgNos ?length gt 0 >
		   and e.ORG_NO in  (${params.orgNos})
		
		   <#else>
		    and e.TG_ID =  ${params.orgNo}
		   
		</#if>