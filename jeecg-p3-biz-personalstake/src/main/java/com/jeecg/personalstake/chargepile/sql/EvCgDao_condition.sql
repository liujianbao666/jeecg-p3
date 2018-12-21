		<#if ( evCg.ecId )?? && evCg.ecId ?length gt 0>
		    /* 控制器ID */
			and ec.EC_ID = :evCg.ecId
		</#if>
		<#if ( evCg.tgId )?? && evCg.tgId ?length gt 0>
		    /* 台区ID */
			and ec.TG_ID = :evCg.tgId
		</#if>
		<#if ( evCg.userId )?? && evCg.userId ?length gt 0>
		    /* 用户ID */
			and ec.USER_ID = :evCg.userId
		</#if>
		<#if ( evCg.alias )?? && evCg.alias ?length gt 0>
		    /* 充电桩别名 */
			and ec.ALIAS = :evCg.alias
		</#if>
		<#if ( evCg.chargeno )?? && evCg.chargeno ?length gt 0>
		    /* 充电接口标识 */
			and ec.CHARGENO = :evCg.chargeno
		</#if>
		<#if ( evCg.assetNo )?? && evCg.assetNo ?length gt 0>
		    /* 资产编号 */
			and ec.ASSET_NO = :evCg.assetNo
		</#if>
		<#if ( evCg.instAddr )?? && evCg.instAddr ?length gt 0>
		    /* 位置 */
			and ec.INST_ADDR = :evCg.instAddr
		</#if>
		<#if ( evCg.meterId )?? && evCg.meterId ?length gt 0>
		    /* 电能表ID */
			and ec.METER_ID = :evCg.meterId
		</#if>
		<#if ( evCg.modelCode )?? && evCg.modelCode ?length gt 0>
		    /* 型号 */
			and ec.MODEL_CODE = :evCg.modelCode
		</#if>
		<#if ( evCg.type )?? && evCg.type ?length gt 0>
		    /* 充电设备接口类型(1：家用插座（模式2）
				2：交流接口插座（模式3，连接方式B ）
				3：交流接口插头（带枪线，模式3，连接方式C）
				4：直流接口枪头（带枪线，模式4）) */
			and ec.TYPE = :evCg.type
		</#if>
		<#if ( evCg.pwspMode )?? && evCg.pwspMode ?length gt 0>
		    /* 供电模式（交流、直流） */
			and ec.PWSP_MODE = :evCg.pwspMode
		</#if>
		<#if ( evCg.power )?? && evCg.power ?length gt 0>
		    /* 额定功率(最大输出功率) */
			and ec.POWER = :evCg.power
		</#if>
		<#if ( evCg.ratedMinP )?? && evCg.ratedMinP ?length gt 0>
		    /* 最小输出功率 */
			and ec.RATED_MIN_P = :evCg.ratedMinP
		</#if>
		<#if ( evCg.maxoutvolt )?? && evCg.maxoutvolt ?length gt 0>
		    /* 最大输出电压 */
			and ec.MAXOUTVOLT = :evCg.maxoutvolt
		</#if>
		<#if ( evCg.minoutvolt )?? && evCg.minoutvolt ?length gt 0>
		    /* 最小输出电压 */
			and ec.MINOUTVOLT = :evCg.minoutvolt
		</#if>
		<#if ( evCg.maxoutcurrent )?? && evCg.maxoutcurrent ?length gt 0>
		    /* 最大输出电流 */
			and ec.MAXOUTCURRENT = :evCg.maxoutcurrent
		</#if>
		<#if ( evCg.uuid )?? && evCg.uuid ?length gt 0>
		    /* 主键 */
			and ec.UUID = :evCg.uuid
		</#if>
	    <#if ( evCg.createdat )??>
		    /* 创建时间 */
			and ec.CREATEDAT = :evCg.createdat
		</#if>
		<#if ( evCg.creatoruuid )?? && evCg.creatoruuid ?length gt 0>
		    /* 创建人 */
			and ec.CREATORUUID = :evCg.creatoruuid
		</#if>
	    <#if ( evCg.updatedat )??>
		    /* 修改时间 */
			and ec.UPDATEDAT = :evCg.updatedat
		</#if>
		<#if ( evCg.updateruuid )?? && evCg.updateruuid ?length gt 0>
		    /* 修改人 */
			and ec.UPDATERUUID = :evCg.updateruuid
		</#if>
		<#if ( evCg.status )?? && evCg.status ?length gt 0>
		    /* 运行状态（1000：未删除
1001：已删除） */
			and ec.STATUS = :evCg.status
		</#if>
		<#if ( evCg.stakename )?? && evCg.stakename ?length gt 0>
		    /* 充电桩名称 */
			and ec.STAKENAME = :evCg.stakename
		</#if>
		<#if ( evCg.rouserialnum )?? && evCg.rouserialnum ?length gt 0>
		    /* 路由器下发参数，序号（仅供参数下发使用） */
			and ec.ROUSERIALNUM = :evCg.rouserialnum
		</#if>
		<#if ( evCg.shared )?? && evCg.shared ?length gt 0>
		    /* 0非共享桩, 1共享桩 */
			and ec.SHARED = :evCg.shared
		</#if>
		<#if ( evCg.provinceCode )?? && evCg.provinceCode ?length gt 0>
		    /* 省级行政单位编号 */
			and ec.PROVINCE_CODE = :evCg.provinceCode
		</#if>
		<#if ( evCg.cityCode )?? && evCg.cityCode ?length gt 0>
		    /* 市级行政单位编号 */
			and ec.CITY_CODE = :evCg.cityCode
		</#if>
		<#if ( evCg.countyCode )?? && evCg.countyCode ?length gt 0>
		    /* 县级行政单位编号 */
			and ec.COUNTY_CODE = :evCg.countyCode
		</#if>
		<#if ( evCg.stakeType )?? && evCg.stakeType ?length gt 0>
		    /* 充电桩类型(0:国网桩 1:社会桩 2:个人桩 3:国网投资个人桩) */
			and ec.STAKE_TYPE = :evCg.stakeType
		</#if>
		<#if ( evCg.ouCode )?? && evCg.ouCode ?length gt 0>
		    /* 产权单位 */
			and ec.OU_CODE = :evCg.ouCode
		</#if>
		<#if ( evCg.longitude )?? && evCg.longitude ?length gt 0>
		    /* 经度 */
			and ec.LONGITUDE = :evCg.longitude
		</#if>
		<#if ( evCg.latitude )?? && evCg.latitude ?length gt 0>
		    /* 纬度 */
			and ec.LATITUDE = :evCg.latitude
		</#if>
		<#if ( evCg.supportWakeup )?? && evCg.supportWakeup ?length gt 0>
		    /* 支持唤醒-模拟插拔（0：不支持1：支持） */
			and ec.SUPPORT_WAKEUP = :evCg.supportWakeup
		</#if>
