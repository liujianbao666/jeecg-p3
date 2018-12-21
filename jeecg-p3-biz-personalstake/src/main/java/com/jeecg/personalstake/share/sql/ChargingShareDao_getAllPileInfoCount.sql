	select count(*) from (SELECT
		*
		FROM
		(
		SELECT
		ec.stakeno AS stakeno1,
		ec.tg_id,
		ec.user_id,
		ec.alias,
		ec.inst_addr,
		gt.tg_name
		FROM
		ev_cg ec
		LEFT JOIN g_tg gt ON
		ec.tg_id = gt.tg_id
		) x1
		LEFT JOIN person_stake_share_model p ON
		x1.stakeno1 = p.stakeNo ) result
		WHERE
		1 = 1
	
	
	
		
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
		
