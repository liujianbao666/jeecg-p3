SELECT
	c.org_code,
	c.parentdepartid,
	c.departname,
	c.org_type,
	tg.TG_NAME,
	tg.TG_ID
FROM
	t_s_depart p
INNER JOIN t_s_depart c ON c.parentdepartid = p.org_code
LEFT JOIN g_tg tg ON c.org_code = tg.ORG_NO
where 1=1
<#if (pid)?? && pid ?length gt 0>
	AND p.org_code =:pid OR tg.TG_ID =:pid 
</#if>

