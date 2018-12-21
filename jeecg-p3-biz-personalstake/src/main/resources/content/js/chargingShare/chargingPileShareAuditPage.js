$(document).ready(function(){
	$('#addForm').bootstrapValidator({
        fields:{
        	//审核意见check
        	approvalOpinion: {
				validators: {
					stringLength: {
                        min: 0,
                        max: 128,
                        message: '审核意见必须在128个字符范围以内'
                    }
				}
			}
        }
    });
})



function updateApprovalShare(dialog) {
	var validator = $("#addForm").data("bootstrapValidator")
	//手动触发验证
    validator.validate();
	if(validator.isValid()){
		$("#saveBtn").prop('disabled', true); 
		var options={
			 url:'chargingPileShareController.do?chargingPileShareAudit',
			 type:"post",
			 dataType:"json",
			 beforeSubmit:function(){
				 var checkStatus = $("#checkStatus option:selected").val();
				 var approvalOpinion =$("#approvalOpinion").val();
				 if (checkStatus == "2") {
					 if (approvalOpinion ==null || approvalOpinion == "")
						 {
							quickNotify("审核未通过，请输入审核意见！","danger");
							return false;
						 }
				 }
			 },
			 success:function(data){
				 
				 if(data.status="success"){
					 
					 
//					 if(data.checkStatus == 2) {
//						 updateApprovalFunctions();
//					 } else if (data.checkStatus == 3) { 
//						
//					 }
					 
					 quickNotify("审核成功！","warning");
					 dialog.close();
					 refreshRunTable();
            		 
            	 }else{
            		 
            		 $.notify({
         	            message: "审核失败！"
         	         },{
         	            type: "danger",
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
            		 
            		 dialog.close();
    				 refreshRunTable();
            	 }
				 
				// quickNotify("审核未通过，审核状态更新成功！","danger");
			
			 },
		}
		$("#addForm").ajaxSubmit(options);
	}
}
