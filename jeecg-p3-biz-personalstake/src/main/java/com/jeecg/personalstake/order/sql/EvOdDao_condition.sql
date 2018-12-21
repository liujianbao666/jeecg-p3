
		
	    <#if ( evOd.orgNo )?? && evOd.orgNo ?length gt 0 >
		   
	        <#if evOd.orgNo ?contains(',') >
	     
	             and eo.orgNo in ( ${evOd.orgNo} )
	             
	             
	             <#else>
                                
	                and eo.tgID= :evOd.orgNo
              
	        
			 
			</#if>
			
		</#if>

		
		
		



		<#if ( evOd.odId )?? && evOd.odId ?length gt 0>
		    /* AC_ID */
			and eo.odid = :evOd.odId
		</#if>

		
		<#if ( evOd.stakeno )?? && evOd.stakeno ?length gt 0>
		    /* ���׮��� */
			and eo.STAKENO like CONCAT ('%',:evOd.stakeno,'%')
		</#if>
		<#if ( evOd.acId )?? && evOd.acId ?length gt 0>
		    /* AC_ID */
			and eo.ACID = :evOd.acId
		</#if>
		<#if ( evOd.usertype )?? && evOd.usertype ?length gt 0>
		    /* ����û����ͣ�1������(��ͨ�û�����2������(׮������ */
			and eo.userType = :evOd.usertype
		</#if>
		<#if ( evOd.odModel )?? && evOd.odModel ?length gt 0>
		    /* �����ࣨ1������硢2�����磩 */
			and eo.ODMODEL = :evOd.odModel
		</#if>
		
		<#if ( evOd.odStatus )?? && evOd.odStatus ?length gt 0>
		    /* ����״̬��1��ִ��ΪĬ�ϡ�2����ִ�С�3����ִ�С�4��ͣ��5ִ����ɡ�6ϵͳ��ֹ��7�û�������8̨���������㣩 */
			and eo.ODSTATUS = :evOd.odStatus
		</#if>
		
	    <#if ( evOd.startTime )??>
		    /* ��翪ʼʱ�� */
			and eo.STARTTIME > :evOd.startTime
		</#if>
		
	    <#if ( evOd.endTime )??>
		    /* ������ʱ�� */
			and eo.ENDTIME < :evOd.endTime
		</#if>
		
		
		<#if ( evOd.bluetoothorder )?? >
		    /* ������־��1:����������0������������ */
			and eo.BluetoothOrder = :evOd.bluetoothorder
		</#if>
