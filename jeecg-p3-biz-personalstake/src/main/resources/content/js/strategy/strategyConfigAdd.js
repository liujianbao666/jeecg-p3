$(document).ready(function(){
	/*$('#start').datetimepicker({
		format:	'H:i',
		datepicker:false,
	});*/
	
	/*$('#end').datetimepicker({
		format:	'H:i',
		datepicker:false,
	});
	*/
})
//获取当前选中的组织单位
function getOrgNo(){
	 var treeObj=$.fn.zTree.getZTreeObj("treeDemo");
     var nodes=treeObj.getSelectedNodes(true);
     var node = nodes[0];
     var orgNo = node.id;
     return orgNo;
}

function createNewPhase(dialog){
	var code = $('#code').val();
	var strategyName = $('#strategyConfig').val();
	var strategyValue = $('#strategyValue').val();
	var remark = $('#remark').val();
	var unit = $('#unit').val();
	//var orgNo = getOrgNo();
	var orgNo = $("#orgNo").val();
	var data={
		"strategyCode":code,
		"strategyName":strategyName,
		"strategyValue":strategyValue,
		"remark":remark,
		"unit":unit,
		"orgNo": orgNo
	};
	//$("#saveBtn").prop('disabled', true);
	$.ajax({
		type:"post",
		url: "strategyConfigController.do?submit",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
	    		dialog.close();
				refreshTable(orgNo);
				quickNotify("新增策略配置成功！", "success");
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