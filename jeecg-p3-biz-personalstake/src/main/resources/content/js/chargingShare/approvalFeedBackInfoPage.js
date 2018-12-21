$(document).ready(function(){
	
	
	
	
	var urlQueryTree = 'chargingPileShareController.do?getApprovalFeedBackInfo&stakeNo='+$("#stakeNo").val();
	
    $.ajax({
   		async : false,
   		cache:false,
   		type: 'post',
   		dataType : "json",
   		url: urlQueryTree,//请求的action路径
   		error: function () {//请求失败处理函数
   			alert('请求审核反馈信息失败');
   		},
   		success:function(data){ //请求成功后处理函数。  
   			
   			
   			console.log(data);
   			$("#checkStatus").val(data.checkStatus);
   			$("#approvalOpinion").val(data.feedBackInfo);
   		}
   	});
	
})




