$(document).ready(function(){
	timeInit();
	timeInit1();
	
});
function timeInit(){
	var date = new Date();
	//var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+month;
	$('#start').datetimepicker({
		format:	'Y-m',
		timepicker:false,
		validateOnBlur: false,
		weeks: false, 
		value:today
	});
	$.datetimepicker.setLocale('ch');
}
function timeInit1(){
	var date = new Date();
	//var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+month;
	$('#end').datetimepicker({
		format:	'Y-m',
		timepicker:false,
		validateOnBlur: false,
		weeks: false, 
		value:today
	});
	$.datetimepicker.setLocale('ch');
}
//获取当前选中的组织单位
function getOrgNo(){
	 var treeObj=$.fn.zTree.getZTreeObj("treeDemo");
     var nodes=treeObj.getSelectedNodes(true);
     var node = nodes[0];
     var orgNo = node.id;
     return orgNo;
}

function createNewPhase(dialog){
	var type = $('#type').val();
	var price = $('#price').val();
	var startDate = $('#start').val();
	var endDate = $('#end').val();
	//var orgNo = getOrgNo();
	var orgNo = $("#orgNo").val();
	var data={
		"type":type,
		"price":price,
		"startDate":startDate,
		"endDate":endDate,
		"orgNo": orgNo
	};
	//$("#saveBtn").prop('disabled', true);
	$.ajax({
		type:"post",
		url: "policyModelController.do?submit",
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
