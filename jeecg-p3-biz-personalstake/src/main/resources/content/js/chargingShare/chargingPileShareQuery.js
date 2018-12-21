
var chart;

$(document).ready(function(){
	    
	var user = getUserOrg();
    var userOrg =user.orgNo;
    $('#orgNo').val(user.orgNo);
    $('#orgName').val(user.orgName);
    var urlQueryTree = "orgController.do?myQuery&pid="+userOrg;
    $.ajax({
   		async : false,
   		cache:false,
   		type: 'POST',
   		dataType : "json",
   		url: urlQueryTree,//请求的action路径
   		error: function () {//请求失败处理函数
   			alert('请求失败');
   		},
   		success:function(data){ //请求成功后处理函数。  
   			treeDataList = data;   //把后台封装好的简单Json格式赋给treeNodes
   		}
   	});


    
    jeDate("#start_time",{
        format: "YYYY-MM-DD"
    });
    jeDate("#end_time",{
        format: "YYYY-MM-DD"
    });
    tableInit();
    refreshRunTable();
    $("#search-btn").bind("click",function(){
    	  	
    	
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
   	 var user = getUserOrg();
	 $("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
	 $("#orgName").val(user.orgName);
        $("#start_time").val("");
        $("#end_time").val("");
        $("#searchForm  select").html("");
        $('#cdz').val("");
        $('#stakeName').val("");
        refreshRunTable();
    })
   
})






function tableInit(){
	$("#chargingPileShareTable").bootstrapTable({
        url: 'chargingPileShareController.do?getChargingPileShareByTgNo',         //请求后台的URL（*）
        method: 'get',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,        				//是否显示行间隔色
        contentType: "application/x-www-form-urlencoded",
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: function (params){
        	return {   
        		limit: params.pageSize,   
                offset: params.pageNumber,  
               orgNo: ($("#orgNo").val()=="1"?"01":$("#orgNo").val()),   
              
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
        minimumCountColumns: 2,             //最少允许的列数
        height : $(window).height()-150,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        resizable:true,                    //可拖拽列宽
        liveDrag : true,
        uniqueId: "i",                     //每一行的唯一标识，一般为主键列
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false, 
        undefinedText:"",                      //未定义列的显示文本
        columns:[
                {field:'i',halign:"center",title:'序号',width:50,align:"center",
                	 formatter: function (value, row, index) {  
                		 if(row.stankno){
                			 return index+1;  
                		 }else{
                			 return "&nbsp";
                		 }
                         
                     }},
                {field:'stankno',halign:"center",title:'充电桩编号',width:150,align:"right"},
                {field:'stankName',halign:"center",title:'充电桩名称',width:200,align:"left"},
                {field:'stankAddress',halign:"center",title:'充电桩地址',width:300,align:"left"},
                {field:'sharedPrice',halign:"center",title:'电价',width:100,align:"right"},
                {field:'sharedDate',halign:"center",title:'分享日期',width:200,align:"right"},
                {field:'sharedTime',halign:"center",title:'分享时间',width:150,align:"right"},
                {field:'auditStatus',halign:"center",title:'审核状态',width:150,align:"center"},
                {field:'#',halign:"center",title:'操作',width:150,align:"center",
                    formatter:function(value,row,index){

                        if(row.stankno){
                            return "<button class='btn btn-xs btn-success' style='margin-right:5px' title='审核' onclick='approval(\"" + row.stankno + "\")'><span class='glyphicon glyphicon-wrench'></span></button>"+
                                   "<button class='btn btn-xs btn-primary' style='margin-right:5px' title='修改' onclick='edit(\"" + row.stankno + "\")'><span class='glyphicon glyphicon-pencil'></span></button>"+
                                   "<button class='btn btn-xs btn-danger' style='margin-right:5px' title='停止' onclick='stop(\"" + row.stankno + "\")'><span class='glyphicon glyphicon-stop'></span></button>"
                        }else{
                            return "";

                        }


                    }}
			    ],
			    onClickRow:function(row,$element,field){
			    	$element.parent().find("tr").removeClass("click-tr-bg");
			    	$element.addClass("click-tr-bg");
			    },
			    onLoadSuccess: function(data){  //加载成功时执行
	  				
	  				if(data.total==0){
	  					
	  					$("#chargingPileShareTable").bootstrapTable('load',{rows:[{},{},{},{},{},{},{},{},{},{}],total:0})
	  				}
	  				
		                console.info("加载成功");
		          },
		          onLoadError: function(){  //加载失败时执行
		                console.info("加载数据失败");
		          }
    });
}

//页面跳转方法
function clickT(url,title){
 	parent.openNewTab(url,title);
}  

//刷新表格
function refreshRunTable(){
    $('#chargingPileShareTable').bootstrapTable('refresh');
}

function initTree(){
    //传入所需要的id属性名
	treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
	orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}

//跳转到共享审核页面
function approval(stakeNo){
    var dialog = new BootstrapDialog({
        title: '共享审核',
        type:BootstrapDialog.TYPE_DEFAULT,
        message: function(dialog) {
            var $message = $('<div></div>');
            var pageToLoad = dialog.getData('pageToLoad');
            $message.load(pageToLoad);
            return $message;
        },
        closable: false,
        data: {
            'pageToLoad': 'chargingPileShareController.do?chargingPileApprovalPage&stakeNo=' + stakeNo
        },
        buttons: [{
            label: '更新',
            cssClass: 'btn-primary',
            action: function(dialogRef){
                updateApprovalShare(dialog);
            }
        }, {
            label: '取消',
            cssClass: 'btn-default',
            action: function(dialogItself){
                dialogItself.close();
            }
        }]
    });
    dialog.open();
}
//跳转到修改页面
    function edit(stakeNo){
    	var dialog = new BootstrapDialog({
    		title: '修改信息',
    		type:BootstrapDialog.TYPE_DEFAULT,
    		message: function(dialog) {
    			var $message = $('<div></div>');
    			var pageToLoad = dialog.getData('pageToLoad');
    			$message.load(pageToLoad);
    			return $message;
    		},
    		closable: false,
    		data: {
    			'pageToLoad': 'chargingPileShareController.do?editChargingPile&stakeNo=' + stakeNo
    		},
    		buttons: [{
    			label: '修改',
    			cssClass: 'btn-primary',
    			action: function(dialogRef){
    				updateApprovalShare(dialog);
    			}
    		}, {
    			label: '取消',
    			cssClass: 'btn-default',
    			action: function(dialogItself){
    				dialogItself.close();
    			}
    		}]
    	});
    	dialog.open();

}

