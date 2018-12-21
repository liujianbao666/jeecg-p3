SELECT 
  COUNT(*) 
FROM
  person_stake_share_model p,
  ev_cg e 
WHERE p.stakeNo = e.STAKENO 
  AND 1 = 1 

			
			
        <#if ( params.tgNos )?? && params.tgNos ?length gt 0 >
		   
	             and tg_id in ( ${params.tgNos} )
		</#if>

	
	
		<#if ( params.stakeNo )?? && params.stakeNo  ?length gt 0>
		
			and stakeno = :params.stakeNo
			
		</#if>
		
	
		<#if ( params.stakeName )?? && params.stakeName  ?length gt 0>
		
				and alias like CONCAT('%', :params.stakeName,'%')
			 
		</#if>
		
		<#if ( params.start_time )?? && params.start_time  ?length gt 0>
			and TIME_FORMAT(:params.start_time,"%H:%i") &lt; TIME_FORMAT(:params.restBeginTime,"%H:%i")
		</#if>
		
		<#if ( params.end_time )?? && params.end_time  ?length gt 0>
			and TIME_FORMAT(:params.end_time,"%H:%i") &lt; TIME_FORMAT(:params.restEndTime,"%H:%i")
		</#if>
	