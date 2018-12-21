var orderlyChargeNum; 
var orderlyChargePower; 
var orderlyChargeRate;
var point;
var expiryDate;
var effectiveDate;
var id;

$(document).ready(function(){
	init();
	timeInit();
	timeInit1();
	 $('#addForm1').bootstrapValidator({
         feedbackIcons: {/*输入框不同状态，显示图片的样式*/
             valid: 'glyphicon glyphicon-ok',
             invalid: 'glyphicon glyphicon-remove',
             validating: 'glyphicon glyphicon-refresh'
         },
         fields: {/*验证*/
        	 orderlyChargeRate2: {
                     validators: {
                         notEmpty: {/*非空提示*/
                             message: '有序充电占比不能为空'
                         },
                         regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                             regexp:/^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/,
                             message: '输入0到100之间数且小数位不能超过三位'
                         }
                     }
                 },
         }
     });
})

function timeInit(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	$('#effectiveDate2').datetimepicker({
		format:	'Y-m-d',
		timepicker:false,
		value:today
	});
	$.datetimepicker.setLocale('ch');
	$('#effectiveDate2').val(effectiveDate);
}
function timeInit1(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	$('#expiryDate2').datetimepicker({
		format:	'Y-m-d',
		timepicker:false,
		value:today
	});
	$.datetimepicker.setLocale('ch');
	$('#expiryDate2').val(expiryDate);
}
function init(){
	var selects = $('#priceDg').bootstrapTable('getSelections');
	var select = selects[0];
	id = select.id;
	orderlyChargeNum = select.orderlyChargeNum;
	orderlyChargePower = select.orderlyChargePower;
	orderlyChargeRate = select.orderlyChargeRate;
	point = select.point;
	effectiveDate = select.effectiveDate;
	expiryDate = select.expiryDate;
	$('#orderlyChargeNum2').val(orderlyChargeNum);
	$('#orderlyChargePower2').val(orderlyChargePower);
	$('#orderlyChargeRate2').val(orderlyChargeRate);
	$('#point2').val(point);
	
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
	orderlyChargeNum = $('#orderlyChargeNum2').val();;
	orderlyChargePower = $('#orderlyChargePower2').val();
	orderlyChargeRate = $('#orderlyChargeRate2').val();
	point = $('#point2').val();
	effectiveDate = $('#effectiveDate2').val();
	expiryDate = $('#expiryDate2').val();
	var orgNo = getOrgNo();
	var data={
		"id":id,
		"orderlyChargeNum":orderlyChargeNum,
		"orderlyChargePower":orderlyChargePower,
		"orderlyChargeRate":orderlyChargeRate,
		"orderlyChargeRate":orderlyChargeRate,
		"orgNo": orgNo,
		"point":point,
		"effectiveDate":effectiveDate,
		"expiryDate":expiryDate,
	};
	$.ajax({
		type:"post",
		url: "rewardController.do?modifySubmit",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
	    		dialog.close();
				refreshTable(orgNo);
				quickNotify("修改奖励机制成功！", "success");
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

