SELECT
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
					LEFT JOIN g_tg gt ON ec.tg_id = gt.tg_id
				) x1
			RIGHT JOIN person_stake_share_model p ON x1.stakeno1 = p.stakeNo
			WHERE
				1 = 1
			AND checkStatus = 0 

			
			
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
	
