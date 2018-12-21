$(document).ready(function(){
	init();
})
function init(){
	var selects = $('#tableid').bootstrapTable('getSelections');
	var select = selects[0];
	var type = select.type;
	var economicIndex = select.economicIndex;
	var plim = select.plim;
	var pstart = select.pstart;
    var tgId=select.tgId; 
    var economicIndexEnd = select.economicEnd
	$('#economicIndex').val(economicIndex);
	$('#plim').val(plim);
	$('#pstart').val(pstart);
	$('#tgId').val(tgId);
	$('#economicIndex1').val(economicIndexEnd);


}
//修改提交
function editPhase(dialog){
	var economicIndex = $('#economicIndex').val();
	var plim = $('#plim').val();
	var pstart = $('#pstart').val();
	var tg_id = $('#tgId').val();
	var economicEnd = $('#economicIndex1').val();
	var strategy = $('#strategy').val();
	var data={
		"economicIndex":economicIndex,
		"plim":plim,
		"pstart":pstart,
		"tgId": tg_id,
		"economicEnd":economicEnd,
		"strategy":strategy
	};
	//$("#saveBtn").prop('disabled', true);
	$.ajax({
		type:"post",
		url: "fileManagementController.do?editSubmit",
    	 	dataType:"json",
    	 	data:data,
    	 	success:function(result){
   	 		var success = result.success;
	    	 if(success == true){
	    		dialog.close();
				refreshTable(tg_id);
				quickNotify("修改信息成功！", "success");
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

function refreshTable(tg_id){
	var opt = {
			url : "fileManagementController.do?getTableList&tg_id="+tg_id,
		};
	$('#tableid').bootstrapTable("refresh");
}


