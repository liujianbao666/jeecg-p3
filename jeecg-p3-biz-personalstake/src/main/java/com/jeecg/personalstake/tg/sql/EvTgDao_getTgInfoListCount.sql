select  
count(*)
from g_tg gt 
where 1=1 


	    <#if ( params.tgNos )?? && params.tgNos ?length gt 0 >
		   
	             and tg_id in ( ${params.tgNos} )
		
		</#if>