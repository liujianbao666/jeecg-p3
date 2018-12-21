UPDATE ev_od
SET 
	   <#if evOd.tradeFlowNo ?exists>
		   TRADE_FLOW_NO = :evOd.tradeFlowNo,
		</#if>
	   <#if evOd.orgNo ?exists>
		   ORG_NO = :evOd.orgNo,
		</#if>
	   <#if evOd.stakeno ?exists>
		   STAKENO = :evOd.stakeno,
		</#if>
	   <#if evOd.chargeport ?exists>
		   CHARGEPORT = :evOd.chargeport,
		</#if>
	   <#if evOd.acId ?exists>
		   AC_ID = :evOd.acId,
		</#if>
	   <#if evOd.vhId ?exists>
		   VH_ID = :evOd.vhId,
		</#if>
	   <#if evOd.usertype ?exists>
		   userType = :evOd.usertype,
		</#if>
	   <#if evOd.odModel ?exists>
		   OD_MODEL = :evOd.odModel,
		</#if>
	    <#if evOd.vuseTime ?exists>
		   VUSE_TIME = :evOd.vuseTime,
		</#if>
	   <#if evOd.chargingDemand ?exists>
		   CHARGING_DEMAND = :evOd.chargingDemand,
		</#if>
	   <#if evOd.odStatus ?exists>
		   OD_STATUS = :evOd.odStatus,
		</#if>
	    <#if evOd.startTime ?exists>
		   START_TIME = :evOd.startTime,
		</#if>
	    <#if evOd.endTime ?exists>
		   END_TIME = :evOd.endTime,
		</#if>
	   <#if evOd.startValue ?exists>
		   START_VALUE = :evOd.startValue,
		</#if>
	   <#if evOd.stopValue ?exists>
		   STOP_VALUE = :evOd.stopValue,
		</#if>
	   <#if evOd.totalchargeamount ?exists>
		   totalChargeAmount = :evOd.totalchargeamount,
		</#if>
	   <#if evOd.vallychargeamount ?exists>
		   vallyChargeAmount = :evOd.vallychargeamount,
		</#if>
	   <#if evOd.peakchargeamount ?exists>
		   peakChargeAmount = :evOd.peakchargeamount,
		</#if>
	   <#if evOd.peacechargeamount ?exists>
		   peaceChargeAmount = :evOd.peacechargeamount,
		</#if>
	   <#if evOd.spotchargeamount ?exists>
		   spotChargeAmount = :evOd.spotchargeamount,
		</#if>
	    <#if evOd.createTime ?exists>
		   CREATE_TIME = :evOd.createTime,
		</#if>
	    <#if evOd.updateTime ?exists>
		   UPDATE_TIME = :evOd.updateTime,
		</#if>
	   <#if evOd.bluetoothorder ?exists>
		   BluetoothOrder = :evOd.bluetoothorder,
		</#if>
WHERE id = :evOd.id