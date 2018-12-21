
var chart;

$(document).ready(function(){
	
	
	var user = getUserinfo();
	$('#orgNo').val(user.orgNo);
	$('#orgName').val(user.orgName);
	initTree();
	
    
    jeDate("#start_time",{
        format: "YYYY-MM-DD"
    });
    jeDate("#end_time",{
        format: "YYYY-MM-DD"
    });
    tableInit();
    $("#search-btn").bind("click",function(){
    	var tgNo = $("#tgNameSelect option:selected").val();
    	var orgName = $("#orgName").val();
    	if (orgName == null || orgName == "") {
    		$.notify({
    			message : "请选择组织单位！"
    		}, {
    			type : "warning",
    			z_index : 9999,
    			placement : {
    				from : "bottom",
    				align : "right"
    			},
    			delay : 2000
    		});
    		return false;
    	}
    	var startTime = $('#start_time').val();
		var endTime = $('#end_time').val();
		if((endTime != undefined && endTime != null && endTime != "") 
				|| (startTime != undefined && startTime != null && startTime != "")) {
			if (startTime == undefined || startTime == null || startTime == "") {
				$.notify({
					message : "请选择开始时间！"
				}, {
					type : "warning",
					z_index : 9999,
					placement : {
						from : "bottom",
						align : "right"
					},
					delay : 2000
				});
				return false;
			} else if (endTime == undefined || endTime == null || endTime == "") {
				$.notify({
					message : "请选择结束时间！"
				}, {
					type : "warning",
					z_index : 9999,
					placement : {
						from : "bottom",
						align : "right"
					},
					delay : 2000
				});
				return false;
			} else if (startTime > endTime) {
				$.notify({
					message : "结束时间不能小于开始时间！"
				}, {
					type : "warning",
					z_index : 9999,
					placement : {
						from : "bottom",
						align : "right"
					},
					delay : 2000
				});
				return false;
			}
		}
        refreshRunTable();
    })
    //重置按钮
    $("#run-reset-btn").bind("click",function(){
    	 $("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
    	 $("#orgName").val(user.orgName);
        $("#start_time").val("");
        $("#end_time").val("");
        $("#tgNo").val("");
        $('.selectpicker').selectpicker('val', '');
        $('#cdz').val("");
        $('#stakeName').val("");
        refreshRunTable();
    })
   
})


//查询按钮
function doSearch(tgNo){
     refreshRunTable();
}


function tableInit(){
	$("#chargingPilePowerTable").bootstrapTable({
        url: 'evCg.do?getChargingPileChargingAmountData',         //请求后台的URL（*）
        method: 'get',                      //请求方式（*）
        contentType: "application/x-www-form-urlencoded",
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        queryParams: function (params){
        	return {   
        		pageSize : params.pageSize,
				pageNo : params.pageNumber,
                orgNo: $("#orgNo").val(),
                tgNo: $("#tgNo").val(),
                cdz: $("#cdz").val(),
                stakeName: $("#stakeName").val(),
                start_time: $("#start_time").val(),
                end_time: $("#end_time").val()
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        strictSearch: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        clickToSelect: true,                //是否启用点击选中行
        uniqueId: "id",                     //每一行的唯一标识，一般为主键列
        height : $(window).height()-190,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        undefinedText:"",
        columns:[
                {field:'i',halign:"center",title:'序号',width:'5%',align:"center",
                	  formatter: function (value, row, index) {  
                 		 if(row.stankno){
                  			 return index+1;  
                  		 }else{
                  			 return "&nbsp";
                  		 }
                       }},
                {field:'stankno',halign:"center",title:'充电桩编号',width:'10%',align:"right"},
                {field:'stankName',halign:"center",title:'充电桩名称',width:'10%',align:"left"},
                {field:'totalPower',halign:"center",title:'总充电量(kWh)',width:'20%',align:"right"},
                {field:'normalPower',halign:"center",title:'正常充电量(kWh)',width:'20%',align:"right"},
                {field:'orderPower',halign:"center",title:'有序充电量(kWh)',width:'20%',align:"right"}
			    ],
			    onClickRow:function(row,$element,field){
			    	$element.parent().find("tr").removeClass("click-tr-bg");
			    	$element.addClass("click-tr-bg");
			    },
			    onLoadSuccess: function(data){  //加载成功时执行
	  				if(data.total==0){
	  					
	  					$("#chargingPilePowerTable").bootstrapTable('load',{rows:[{},{},{},{},{},{},{},{},{},{}],total:0});
	  				}
	  				
	  	            console.info("加载成功");
	  	      },
	  	          onLoadError: function(){  //加载失败时执行
	  	            console.info("加载数据失败");
	  	      }
    });
}



function doSearch(tgNo){
    refreshRunTable();
}

//刷新表格
function refreshRunTable(){
//    var orgNo=  $("#orgNo").val();
//    var tgNo = $("#tgNameSelect option:selected").val();
//    var cdz = $("#cdz").val();
//    var stakeName = $("#stakeName").val();
//    var startTime=  $("#start_time").val();
//    var endTime=  $("#end_time").val();
//    if(tgNo==undefined){
//         tgNo="";
//     }
//  var opt ="";
//     $('#chargingPilePowerTable').bootstrapTable('refreshOptions',{pageNumber:1});
    $('#chargingPilePowerTable').bootstrapTable('refresh');
    
}
function initTree(){
    //传入所需要的id属性名
	treeDataList = getUserOrgTree(user.orgNo);
	treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
	orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}
