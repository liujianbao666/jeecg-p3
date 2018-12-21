select cg.STAKENO,cg.ALIAS
from ev_cg cg 
where 1=1


	    <#if ( params.tgNos )?? && params.tgNos ?length gt 0 >
		   
	             and tg_id in ( ${params.tgNos} )
		
		</#if>
		
		
       <#if ( params.stakeNo )?? && params.stakeNo ?length gt 0 >
		   
	             and STAKENO = ${params.stakeNo} 
		
		</#if>
		
		   <#if ( params.stakeName )?? && params.stakeName ?length gt 0 >
		   
	          and ALIAS like CONCAT('%', ${params.stakeName}, '%')
		
		</#if>