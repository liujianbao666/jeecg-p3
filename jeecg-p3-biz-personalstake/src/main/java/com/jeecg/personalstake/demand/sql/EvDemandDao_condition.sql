
		
	    <#if ( evDemand.tgNos )?? && evDemand.tgNos ?length gt 0 >
	             and cg.TG_ID in ( ${evDemand.tgNos} )
		</#if>
		<#if ( evDemand.stakeNo  )?? && evDemand.stakeNo  ?length gt 0>
			and demand.STAKENO like CONCAT ('%',:evDemand.stakeNo,'%')
		</#if>

		<#if ( evDemand.userType )?? && evDemand.userType ?length gt 0>
		    /* 充电用户类型（1：分享充电；2：有序充电;3：蓝牙充电） */
			and demand.USER_TYPE = :evDemand.userType
		</#if>
		
		<#if ( evDemand.odModel )?? && evDemand.odModel ?length gt 0>
		    /* 充电分类（1正常充电、2有序充电） */
			and demand.OD_MODEL = :evDemand.odModel
		</#if>
		
		 <#if ( evDemand.start_time )??>
		    /* ��翪ʼʱ�� */
			and demand.CREATE_TIME > :evDemand.start_time
		</#if>
		
	    <#if ( evDemand.end_time )??>
		    /* ������ʱ�� */
			and demand.CREATE_TIME < :evDemand.end_time
		</#if>
		
		<#if ( evDemand.odId )?? && evDemand.odId ?length gt 0>
		    /* 订单编号 */
			and demand.ODID = :evDemand.odId
		</#if>
		
		
		<#if ( evDemand.status )?? && evDemand.status ?length gt 0>
		    /* 状态0充电失败1生成订单 */
			and demand.STATUS = :evDemand.status
		</#if>
ORDER BY demand.CREATE_TIME DESC