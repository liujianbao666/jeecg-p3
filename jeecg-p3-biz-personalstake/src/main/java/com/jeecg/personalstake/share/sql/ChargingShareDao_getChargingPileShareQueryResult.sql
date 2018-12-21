SELECT 
  p.stakeNo,
  p.chargingFee,
  e.STAKENAME AS stakeName,
  e.INST_ADDR AS stakeAddress,
  CONCAT(
    p.workBeginTime,'~',p.workEndTime
  ) AS sharedDate,
  CONCAT(
    p.restBeginTime,'~', p.restEndTime
  ) AS sharedTime
FROM
  person_stake_share_model p,
  ev_cg e 
WHERE p.stakeNo = e.STAKENO 
  AND 1 = 1 ;
	
	
	
		
	    <#if ( params.tgNos )?? && params.tgNos ?length gt 0 >
		   
	             and result.tg_id in ( ${params.tgNos} )
		</#if>

	
	
		<#if ( params.stakeNo )?? && params.stakeNo  ?length gt 0>
		
			and result.stakeno = :params.stakeNo
			
		</#if>
		
	
		<#if ( params.stakeName )?? && params.stakeName  ?length gt 0>
		
				and result.alias like CONCAT('%', :params.stakeName,'%')
			 
		</#if>
		
		
			<#if ( params.shareStatus )?? && params.shareStatus  ?length gt 0 && params.shareStatus ?contains('0') >
		
			 
			and result.chargingfee is null
			
			
			<#elseif ( params.shareStatus )?? && params.shareStatus  ?length gt 0 && params.shareStatus ?contains('1') >
			and result.chargingfee is not null
		
			
		</#if>
		
