SELECT
	ev.TG_ID tg_id,
	ev.EC_ID,
	ev.RUN_P runP,
	ev.RUN_IA runIA,
	ev.RUN_IB runIB,
	ev.RUN_IC runIC,
	ev.RUN_UA runUA,
	ev.RUN_UB runUB,
	ev.RUN_UC runUC,
	ev.PLIM pLim,
	ev.PSTART pStart,
	ev.DATA_TIME dataTime,
	g.tg_name tgName,
	g.tg_cap tgCap
FROM
	ev_tg_run ev
LEFT JOIN g_tg g ON ev.TG_ID = g.TG_ID
WHERE
	1 = 1
AND ev.TG_ID = g.TG_ID
<#if ( params.tgId )?? && params.tgId ?length gt 0 >
	 and ev.TG_ID in ( ${params.tgId} )	
</#if>
<#if ( params.tgNos )?? && params.tgNos ?length gt 0 >
	 and ev.TG_ID in ( ${params.tgNos} )	
</#if>