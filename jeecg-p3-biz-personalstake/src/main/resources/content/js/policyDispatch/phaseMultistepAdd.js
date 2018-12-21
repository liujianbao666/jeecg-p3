//获取当前选中的组织单位
function getOrgNo(){
	 var treeObj=$.fn.zTree.getZTreeObj("treeDemo");
     var nodes=treeObj.getSelectedNodes(true);
     var node = nodes[0];
     var orgNo = node.id;
     return orgNo;
}

function createNewPhase(dialog){
	var step = $('#step').val();
	var priceBegin = $('#priceBegin').val();
	var priceEnd = $('#priceEnd').val();
	var price = $('#price').val();
	var year = $('#year').val();
	var monthStart = $('#monthStart').val();
	var monthEnd = $('#monthEnd').val();
	//var orgNo = getOrgNo();
	var orgNo = $("#orgNo").val();
	var data={
		"step":step,
		"priceBegin":priceBegin,
		"priceEnd":priceEnd,
		"price":price,
		"year":year,
		"monthStart":monthStart,
		"monthEnd":monthEnd,
		"orgNo": orgNo
	};
	//$("#saveBtn").prop('disabled', true);
	$.ajax({
		type:"post",
		url: "policyModelController.do?submitMultistep",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
	    		dialog.close();
				refreshTable(orgNo);
				quickNotify("新增时段成功！", "success");
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
