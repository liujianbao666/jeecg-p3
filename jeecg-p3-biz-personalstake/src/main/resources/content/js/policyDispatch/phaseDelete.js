$(document).ready(function(){
	init();
})

function init(){
	var selects = $('#priceDg').bootstrapTable('getSelections');
	var select = selects[0];
	var type = select.type;
	var price = select.price;
	var start = select.start;
	var end = select.end;
	$("#type2 option[value=" + type + "]").attr("selected","selected");
	$("#type2").attr("disabled","disabled");
	$('#price2').val(price);
	$("#price2").attr("readonly","readonly");
	$('#start2').datetimepicker({
		format:	'H:i',
		datepicker:false,
		value:start
	});
	$("#start2").attr("readonly","readonly");
	$('#end2').datetimepicker({
		format:	'H:i',
		datepicker:false,
		value:end
	});
	$("#end2").attr("readonly","readonly");
}

function deletePhase(dialog){
	var selects = $('#priceDg').bootstrapTable('getSelections');
	var select = selects[0];
	/*var start = select.start;
	var end = select.end;*/
	//var orgNo=getOrgNo();
	var orgNo = $("#orgNo").val();
	var id = select.id;
	var data={
			"id":id
		};
	$.ajax({
		type:"post",
		url: "policyController.do?deleteSubmit",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
					dialog.close();   
					refreshTable(orgNo);
					refreshChart(orgNo);
					quickNotify("删除时段成功！", "success");
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