$(document).ready(function(){
	init();
})

function init(){
	var selects = $('#priceDg').bootstrapTable('getSelections');
	var select = selects[0];
	var monthbegin = select.monthbegin;
	var monthend = select.monthend;
	var price = select.price;
	
	var step = select.step;
	
	var powerbegin = select.powerbegin;
	
	var powerend = select.powerend;
	
	
	var year = select.year;
	
	$('#price').val(price);
	$("#price").attr("readonly","readonly");
	/*$('#start2').datetimepicker({
		format:	'H:i',
		datepicker:false,
		value:start
	});*/
	$('#monthbegin').val(monthbegin);
	$("#monthbegin").attr("readonly","readonly");
	
	$('#monthend').val(monthend);
	$("#monthend").attr("readonly","readonly");
	
	
	$('#step').val(step);
	$("#step").attr("readonly","readonly");
	
	$('#powerbegin').val(powerbegin);
	$("#powerbegin").attr("readonly","readonly");
	
	
	$('#powerend').val(powerend);
	$("#powerend").attr("readonly","readonly");
	
	
	
	/*$('#end2').datetimepicker({
		format:	'H:i',
		datepicker:false,
		value:end
	});*/
	$('#year').val(year);
	$("#year").attr("readonly","readonly");
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
		url: "policyModelController.do?deleteStepSubmit",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
					dialog.close();   
					refreshTable(orgNo);
					quickNotify("删除成功！", "success");
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