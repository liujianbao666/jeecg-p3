



select c.org_code,c.parentdepartid,c.departname,c.org_type from t_s_depart p ,t_s_depart c 
	    			   where c.parentdepartid = p.org_code and p.org_code =  :pid
