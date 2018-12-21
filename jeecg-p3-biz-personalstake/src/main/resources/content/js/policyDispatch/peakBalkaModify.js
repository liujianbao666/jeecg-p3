var preStart; //存放修改之前的开始时间和结束时间
var preEnd; 
var preType;
var prePrice;
var startDate;
var endDate;
var id;

$(document).ready(function(){
	init();
	timeInit();
	timeInit1();
});
function timeInit(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	//var today = date.getFullYear()+month;
	$('#start2').datetimepicker({
		format:'Ym',
		timepicker:false,
		validateOnBlur: false,
		value:month
	});
	$.datetimepicker.setLocale('ch');
	 $('#start2').val(startDate);
}
function timeInit1(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	//var today = date.getFullYear()+month;
	$('#end2').datetimepicker({
		format:	'Ym',
		timepicker:false,
		validateOnBlur: false,
		value:month
	});
	$.datetimepicker.setLocale('ch');
	 $('#end2').val(endDate);
}
function init(){
	var selects = $('#priceDg').bootstrapTable('getSelections');
	var select = selects[0];
	preType = select.type;
	prePrice = select.price;
	preStart = select.start;
	preEnd = select.end;
	id = select.id;
	startDate =select.startDate;
	endDate =select.endDate ;
	$("#type1 option[value=" + preType + "]").attr("selected","selected");
	$('#price1').val(prePrice);
	$('#start1').datetimepicker({
		format:'H:i',
		formatTime:	'H:i',
		datepicker:false,
		value:preStart,
		step: 30
	});
	
	$('#end1').datetimepicker({
		format:'H:i',
		formatTime:	'H:i',
		datepicker:false,
		value:preEnd,
		step: 30
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

function editPhase(dialog){
	var price = $('#price1').val();
	var startTime = $('#start1').val();
	var endTime = $('#end1').val();
	var type=$('#type1').val();
	var startDate=$('#start2').val();
	var endDate=$('#end2').val();
	//var orgNo = getOrgNo();//获取当前选中的组织单位
	var orgNo = $("#orgNo").val();
	var data={
		"id":id,
		"startTime":startTime,
		"endTime":endTime,
		"type":type,
		"orgNo": orgNo,
		"startDate":startDate,
		"endDate":endDate,
	};
	//$("#saveBtn").prop('disabled', true);
	$.ajax({
		type:"post",
		url: "peakBalkaController.do?modifySubmit",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
	    		dialog.close();
				refreshTable(orgNo);
				quickNotify("修改时段成功！", "success");
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
						/*onClosed : function() {
							$("#saveBtn").remove("disabled")
						}*/
					});
	    	 }
   	 	}
	});
}

