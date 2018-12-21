 SELECT  
 demand.ID,  
 demand.STAKENO, 			
 demand.USER_TYPE, 
 demand.OD_MODEL, 
 demand.CREATE_TIME,
 demand.VUSE_TIME, 
 demand.REMAINCAPACITY, 
 demand.TARGETCAPACITY, 
 demand.CHARGING_DEMAND, 
 demand.ODID, 
 demand.STATUS,  
 vh.BATERY_CAP, 
 vh.VH_BRAND, 
 vh.VH_MODEL, 
 vh.RATED_MAX_P, 
 cg.TG_ID ,
 cg.ALIAS           
 FROM                                            
		ev_demand demand                              
				 LEFT JOIN ev_vh vh ON demand.VH_ID = vh.VH_ID   
				 LEFT JOIN ev_cg cg ON demand.STAKENO = cg.STAKENO
WHERE    1=1                      


<#include "EvDemandDao_condition.sql">