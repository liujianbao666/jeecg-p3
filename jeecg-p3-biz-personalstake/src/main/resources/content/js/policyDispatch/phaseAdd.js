$(document).ready(function(){
	$('#start').datetimepicker({
		format:	'H:i',
		datepicker:false,
	});
	
	$('#end').datetimepicker({
		format:	'H:i',
		datepicker:false,
	});
	
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
	var type = $('#type').val();
	var price = $('#price').val();
	var startTime = $('#start').val();
	var endTime = $('#end').val();
	//var orgNo = getOrgNo();
	var orgNo = $("#orgNo").val();
	var data={
		"type":type,
		"price":price,
		"startTime":startTime,
		"endTime":endTime,
		"orgNo": orgNo
	};
	//$("#saveBtn").prop('disabled', true);
	$.ajax({
		type:"post",
		url: "policyController.do?submit",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
	    		dialog.close();
				refreshTable(orgNo);
				refreshChart(orgNo);
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
	

/* function submit(){
	var price = $('#price').val();
	var startTime = $('#start').val();
	var endTime = $('#end').val();
	//var tgId = $('#s_org_no').val();
	//var tgId = "shjpzx001tg001";
	var data={
		"price":price,
		"startTime":startTime,
		"endTime":endTime,
		"tgId": tg_id
	};
	$.ajax({
		type:"post",
		url: "policyController.do?submit",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
				$.messager.show({
             		  title:'提示',
             		  msg:'新增时段成功！',
             		  timeout:3000,
             		  showType:'slide'
             		});
				 initTableInfo();///// 
				 getPriceChart();
	    	 }else{
	    		 $.messager.show({
           		   title:'提示',
           		   msg:result.errorMsg,
           		   timeout:3000,
           		   showType:'slide'
           		});
	    	 }
   	 	}
	});
	//dialogItself.close();
	//$('#dd_add').dialog('close');  
}
 */