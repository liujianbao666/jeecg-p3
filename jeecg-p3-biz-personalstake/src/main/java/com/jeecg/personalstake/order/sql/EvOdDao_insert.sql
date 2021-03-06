INSERT  INTO
	ev_od
      ( 
      OD_ID                         
      ,TRADE_FLOW_NO                  
      ,ORG_NO                         
      ,STAKENO                        
      ,CHARGEPORT                     
      ,AC_ID                          
      ,VH_ID                          
      ,userType                       
      ,OD_MODEL                       
      ,VUSE_TIME                      
      ,CHARGING_DEMAND                
      ,OD_STATUS                      
      ,START_TIME                     
      ,END_TIME                       
      ,START_VALUE                    
      ,STOP_VALUE                     
      ,totalChargeAmount              
      ,vallyChargeAmount              
      ,peakChargeAmount               
      ,peaceChargeAmount              
      ,spotChargeAmount               
      ,CREATE_TIME                    
      ,UPDATE_TIME                    
      ,BluetoothOrder                 
      ) 
values
      (
      :evOd.odId                          
      ,:evOd.tradeFlowNo                   
      ,:evOd.orgNo                         
      ,:evOd.stakeno                       
      ,:evOd.chargeport                    
      ,:evOd.acId                          
      ,:evOd.vhId                          
      ,:evOd.usertype                      
      ,:evOd.odModel                       
      ,:evOd.vuseTime                      
      ,:evOd.chargingDemand                
      ,:evOd.odStatus                      
      ,:evOd.startTime                     
      ,:evOd.endTime                       
      ,:evOd.startValue                    
      ,:evOd.stopValue                     
      ,:evOd.totalchargeamount             
      ,:evOd.vallychargeamount             
      ,:evOd.peakchargeamount              
      ,:evOd.peacechargeamount             
      ,:evOd.spotchargeamount              
      ,:evOd.createTime                    
      ,:evOd.updateTime                    
      ,:evOd.bluetoothorder                
      )