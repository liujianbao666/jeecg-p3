$(document).ready(function(){
	timeInit();
	timeInit1();
	 $('#addForm').bootstrapValidator({
         feedbackIcons: {/*输入框不同状态，显示图片的样式*/
             valid: 'glyphicon glyphicon-ok',
             invalid: 'glyphicon glyphicon-remove',
             validating: 'glyphicon glyphicon-refresh'
         },
         fields: {/*验证*/
        	 orderlyChargeRate: {
                     validators: {
                         notEmpty: {/*非空提示*/
                             message: '有序充电占比不能为空'
                         },
                         regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                             regexp:/^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/,
                             message: '输入0到100之间数且小数位不能超过三位'
                         }
                     }
                 },
         }
     });
});

//获取当前选中的组织单位
function getOrgNo(){
	 var treeObj=$.fn.zTree.getZTreeObj("treeDemo");
     var nodes=treeObj.getSelectedNodes(true);
     var node = nodes[0];
     var orgNo = node.id;
     return orgNo;
}
function timeInit(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	$('#effectiveDate').datetimepicker({
		format:	'Y-m-d',
		timepicker:false,
		value:today
	});
	$.datetimepicker.setLocale('ch');
}
function timeInit1(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	$('#expiryDate').datetimepicker({
		format:	'Y-m-d',
		timepicker:false,
		value:today
	});
	$.datetimepicker.setLocale('ch');
}
function createNewPhase(dialog){
	var orderlyChargeNum = $('#orderlyChargeNum').val();
	var orderlyChargePower = $('#orderlyChargePower').val();
	var orderlyChargeRate = $('#orderlyChargeRate').val();
	var point = $('#point').val();
	var effectiveDate = $('#effectiveDate').val();
	var expiryDate = $('#expiryDate').val();
	var orgNo = $("#orgNo").val();
	var data={
		"orderlyChargeNum":orderlyChargeNum,
		"orderlyChargePower":orderlyChargePower,
		"orderlyChargeRate":orderlyChargeRate,
		"point":point,
		"orgNo": orgNo,
		"effectiveDate": effectiveDate,
		"expiryDate": expiryDate
	};
	$.ajax({
		type:"post",
		url: "rewardController.do?submit",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
	    		dialog.close();
				refreshTable(orgNo);
				quickNotify("新增奖励机制成功！", "success");
	    	 }else{
	    		 $.notify({
						message : result.errorMsg
					}, {
						type : "warning",
						z_index : 9999,
						placement : {
							from : "bottom",
							align : "right"
						},
						delay : 2000,
						onClosed : function() {
							$("#saveBtn").remove("disabled")
						}
					});
	    	 }
   	 	}
	});
}
