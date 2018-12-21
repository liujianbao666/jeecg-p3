$(document).ready(function(){
	init();
})

function init(){
	var selects = $('#priceDg').bootstrapTable('getSelections');
	var select = selects[0];
	var orderlyChargeNum = select.orderlyChargeNum;
	var orderlyChargePower = select.orderlyChargePower;
	var orderlyChargeRate = select.orderlyChargeRate;
	var point = select.point;
	var effectiveDate = select.effectiveDate;
	var expiryDate = select.expiryDate;
	
	$('#orderlyChargeNum1').val(orderlyChargeNum);
	$("#orderlyChargeNum1").attr("readonly","readonly");
	$('#orderlyChargePower1').val(orderlyChargePower);
	$("#orderlyChargePower1").attr("readonly","readonly");
	$('#orderlyChargeRate1').val(orderlyChargeRate);
	$("#orderlyChargeRate1").attr("readonly","readonly");
	$('#point1').val(point);
	$("#point1").attr("readonly","readonly");
	$('#effectiveDate1').val(effectiveDate);
	$("#effectiveDate1").attr("readonly","readonly");
	$('#expiryDate1').val(expiryDate);
	$("#expiryDate1").attr("readonly","readonly");
	
}

function deletePhase(dialog){
	var selects = $('#priceDg').bootstrapTable('getSelections');
	var select = selects[0];
	var orgNo = $("#orgNo").val();
	var id = select.id;
	var data={
			"id":id
		};
	$.ajax({
		type:"post",
		url: "rewardController.do?deleteSubmit",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
					dialog.close();   
					refreshTable(orgNo);
					quickNotify("删除奖励机制成功！", "success");
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
						delay : 2000
						/* onClosed : function() {
							$("#saveBtn").remove("disabled")
						} */
					});
	    	 }
   	 	}
	});
}

//获取当前选中的组织单位
function getOrgNo(){
	 var treeObj=$.fn.zTree.getZTreeObj("treeDemo");
     var nodes=treeObj.getSelectedNodes(true);
     var node = nodes[0];
     var orgNo = node.id;
     return orgNo;
}