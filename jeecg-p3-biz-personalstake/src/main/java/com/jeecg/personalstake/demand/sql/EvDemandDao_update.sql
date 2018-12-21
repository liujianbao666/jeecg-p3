UPDATE ev_demand
SET 
	   <#if evDemand.stakeno ?exists>
		   STAKENO = :evDemand.stakeno,
		</#if>
	   <#if evDemand.chargeport ?exists>
		   CHARGEPORT = :evDemand.chargeport,
		</#if>
	   <#if evDemand.acId ?exists>
		   AC_ID = :evDemand.acId,
		</#if>
	   <#if evDemand.vhId ?exists>
		   VH_ID = :evDemand.vhId,
		</#if>
	   <#if evDemand.userType ?exists>
		   USER_TYPE = :evDemand.userType,
		</#if>
	   <#if evDemand.odModel ?exists>
		   OD_MODEL = :evDemand.odModel,
		</#if>
	    <#if evDemand.vuseTime ?exists>
		   VUSE_TIME = :evDemand.vuseTime,
		</#if>
	   <#if evDemand.remaincapacity ?exists>
		   REMAINCAPACITY = :evDemand.remaincapacity,
		</#if>
	   <#if evDemand.targetcapacity ?exists>
		   TARGETCAPACITY = :evDemand.targetcapacity,
		</#if>
	   <#if evDemand.chargingDemand ?exists>
		   CHARGING_DEMAND = :evDemand.chargingDemand,
		</#if>
	    <#if evDemand.createTime ?exists>
		   CREATE_TIME = :evDemand.createTime,
		</#if>
	   <#if evDemand.odid ?exists>
		   ODID = :evDemand.odid,
		</#if>
	   <#if evDemand.status ?exists>
		   STATUS = :evDemand.status,
		</#if>
WHERE id = :evDemand.id