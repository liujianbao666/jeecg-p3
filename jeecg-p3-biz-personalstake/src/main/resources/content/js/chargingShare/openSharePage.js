
var chart;

$(document).ready(function(){
	    


    
    jeDate("#shareDateBegin",{
        format: "YYYY-MM-DD"
    });
    jeDate("#shareDateEnd",{
        format: "YYYY-MM-DD"
    });
    
    jeDate("#shareTimeBegin",{
        format: "hh:mm"
    });
    
    jeDate("#shareTimeEnd",{
        format: "hh:mm"
    });
    
    
  
    $("#search-btn").bind("click",function(){
    	  	
    	var startTime = $('#start_time').val();
		var endTime = $('#end_time').val();
		if((endTime != undefined && endTime != null && endTime != "") 
				|| (startTime != undefined && startTime != null && startTime != "")) {
			if (startTime == undefined || startTime == null || startTime == "") {
				$.notify({
					message : "请选择开始时间！"
				}, {
					type : "warning",
					z_index : 9999,
					placement : {
						from : "bottom",
						align : "right"
					},
					delay : 2000
				});
				return false;
			} else if (endTime == undefined || endTime == null || endTime == "") {
				$.notify({
					message : "请选择结束时间！"
				}, {
					type : "warning",
					z_index : 9999,
					placement : {
						from : "bottom",
						align : "right"
					},
					delay : 2000
				});
				return false;
			} else if (startTime > endTime) {
				$.notify({
					message : "结束时间不能小于开始时间！"
				}, {
					type : "warning",
					z_index : 9999,
					placement : {
						from : "bottom",
						align : "right"
					},
					delay : 2000
				});
				return false;
			}
		}
        refreshRunTable();
    })

   
})





function openShareApply(dialog) {
		
		
			var options={
				 url:'chargingPileShareController.do?openShareApply',
				 type:"post",
				 dataType:"json",
				 beforeSubmit:function(){
					 
					 
					 
					    var chargingFee =  $('#chargingFee').val();
					if(chargingFee==null||chargingFee==undefined||chargingFee==""){
						$.notify({
							message : "请输入分享电价！"
						}, {
							type : "warning",
							z_index : 9999,
							placement : {
								from : "bottom",
								align : "right"
							},
							delay : 2000
						});
						return false;
					}
						
						var shareDateBegin = $('#shareDateBegin').val();
						var shareDateEnd = $('#shareDateEnd').val();
//						if((shareDateEnd != undefined && shareDateEnd != null && shareDateEnd != "") 
//								|| (shareDateBegin != undefined && shareDateBegin != null && shareDateBegin != "")) {
							if (shareDateBegin == undefined || shareDateBegin == null || shareDateBegin == "") {
								$.notify({
									message : "请选择开始日期！"
								}, {
									type : "warning",
									z_index : 9999,
									placement : {
										from : "bottom",
										align : "right"
									},
									delay : 2000
								});
								return false;
							} else if (shareDateEnd == undefined || shareDateEnd == null || shareDateEnd == "") {
								$.notify({
									message : "请选择结束日期！"
								}, {
									type : "warning",
									z_index : 9999,
									placement : {
										from : "bottom",
										align : "right"
									},
									delay : 2000
								});
								return false;
							} else if (shareDateBegin > shareDateEnd) {
								$.notify({
									message : "结束日期不能小于开始日期！"
								}, {
									type : "warning",
									z_index : 9999,
									placement : {
										from : "bottom",
										align : "right"
									},
									delay : 2000
								});
								return false;
							}
//						}
						
						
						var shareTimeBegin = $('#shareTimeBegin').val();
						var shareTimeEnd = $('#shareTimeEnd').val();
//						if((shareTimeEnd != undefined && shareTimeEnd != null && shareTimeEnd != "") 
//								|| (shareTimeBegin != undefined && shareTimeBegin != null && shareTimeBegin != "")) {
							if (shareTimeBegin == undefined || shareTimeBegin == null || shareTimeBegin == "") {
								$.notify({
									message : "请选择开始时间！"
								}, {
									type : "warning",
									z_index : 9999,
									placement : {
										from : "bottom",
										align : "right"
									},
									delay : 2000
								});
								return false;
							} else if (shareTimeEnd == undefined || shareTimeEnd == null || shareTimeEnd == "") {
								$.notify({
									message : "请选择结束时间！"
								}, {
									type : "warning",
									z_index : 9999,
									placement : {
										from : "bottom",
										align : "right"
									},
									delay : 2000
								});
								return false;
							} else if (shareTimeBegin > shareTimeEnd) {
								$.notify({
									message : "结束时间不能小于开始时间！"
								}, {
									type : "warning",
									z_index : 9999,
									placement : {
										from : "bottom",
										align : "right"
									},
									delay : 2000
								});
								return false;
							}
//						}
					 
					 
//					 var checkStatus = $("#checkStatus option:selected").val();
//					 var approvalOpinion =$("#approvalOpinion").val();
//					 if (checkStatus == "2") {
//						 if (approvalOpinion ==null || approvalOpinion == "")
//							 {
//								quickNotify("审核未通过，请输入审核意见！","danger");
//								return false;
//							 }
//					 }
					 
					 
				 },
				 success:function(data){
					 
					 if(data.status=="success"){
						
						 quickNotify("共享开通申请已受理，请等待审核通过！");
	            	 }else{
	            		 
	            		 $.notify({
	         	            message: "共享开通申请失败！"
	         	         },{
	         	            type: "warning",
	         	            z_index:9999,
	         	            delay:2000,
	         	            placement: {
		   	     	  			from: "bottom",
		   	     	  			align: "right"
		   	     	  			 	},
	         	            onClosed:function(){
	         	            	$("#saveBtn").prop('disabled', false); 
	         	            }
	         	         });
	            	 }
					 
					 dialog.close();
					 refreshRunTable();
				 },
			}
			$("#addForm").ajaxSubmit(options);
		
}










