
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
	id = select.id;
	$('#strategyName2').val(strategyName);
	$('#strategyValue2').val(strategyValue);
	$('#code2').val(strategyCode);
	$('#remark2').val(remark);
	$('#unit2').val(unit);
}
//获取当前选中的组织单位
function getOrgNo(){
	 var treeObj=$.fn.zTree.getZTreeObj("treeDemo");
     var nodes=treeObj.getSelectedNodes(true);
     var node = nodes[0];
     var orgNo = node.id;
     return orgNo;
}

function editPhase(dialog){
	var code = $('#code2').val();
	var strategyName = $('#strategyName2').val();
	var strategyValue = $('#strategyValue2').val();
	var remark = $('#remark2').val();
	var unit = $('#unit2').val();
	var orgNo = getOrgNo();
	var data={
		"id":id,
		"strategyCode":code,
		"strategyName":strategyName,
		"strategyValue":strategyValue,
		"remark":remark,
		"unit":unit,
		"orgNo": orgNo
	};
	$.ajax({
		type:"post",
		url: "strategyConfigController.do?modifySubmit",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
	    		dialog.close();
				refreshTable(orgNo);
				quickNotify("修改策略配置成功！", "success");
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

