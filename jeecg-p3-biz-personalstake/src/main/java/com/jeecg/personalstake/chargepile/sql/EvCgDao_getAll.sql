SELECT
	ec.STAKENO stakeNo,
	ec.ALIAS alias,
	gt.TG_NAME tgName,
	ec.PWSP_MODE pm,
	ec.INST_ADDR instAddr,
	ec.power power,
	run. STATUS status,
	run.run_p,
	run.run_u,
	run.run_i,
	run.data_time
FROM
	ev_cg ec
INNER JOIN g_tg gt on gt.tg_id = ec.tg_id
LEFT JOIN ev_cg_run run ON ec.STAKENO = run.stakeno
AND ec.TG_ID = gt.TG_ID
WHERE 1=1

<#if (evCg.stakeName)?? && evCg.stakeName ?length gt 0>
    /* 充电桩名称 */
	and ec.alias = :evCg.stakeName
</#if>
<#if ( evCg.stakeNo )?? && evCg.stakeNo ?length gt 0>
    /* 充电桩编号 */
	and ec.stakeNo = :evCg.stakeNo
</#if>
<#if ( evCg.tgNos )?? && evCg.tgNos ?length gt 0 >
    and gt.TG_ID in ( ${evCg.tgNos} )
</#if>
<#if ( evCg.status )?? && evCg.status ?length gt 0>
    /* 状态 */
	and run.status = :evCg.status
</#if>