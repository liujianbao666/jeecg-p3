$(document).ready(function(){
	init();
})

function init(){
	var selects = $('#priceDg').bootstrapTable('getSelections');
	var select = selects[0];
	var strategyName = select.strategyName;
	var strategyValue = select.strategyValue;
	var strategyCode = select.strategyCode;
	var remark = select.remark;
	var unit = select.unit;
	$('#strategyName1').val(strategyName);
	$("#strategyName1").attr("readonly","readonly");
	$('#strategyValue1').val(strategyValue);
	$("#strategyValue1").attr("readonly","readonly");
	$('#code1').val(strategyCode);
	$("#code1").attr("readonly","readonly");
	$('#remark1').val(remark);
	$("#remark1").attr("readonly","readonly");
	$('#unit1').val(unit);
	$("#unit1").attr("readonly","readonly");
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
		url: "strategyConfigController.do?deleteSubmit",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
					dialog.close();   
					refreshTable(orgNo);
					quickNotify("删除策略配置成功！", "success");
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