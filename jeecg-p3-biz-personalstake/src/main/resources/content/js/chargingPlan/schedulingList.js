var chart;
var user;
var tgNo;
var orderType; //订单类型 共享订单为1
var flowID; //从订单页面点击过来传递的参数
$(document).ready(function(){
	user = getUserOrg();
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
	    

    orderType = $("#orderType").val(); //订单类型 共享订单为1
    
    flowID = $("#flowID").val();
    if(flowID=="null"||flowID==null){
    	flowID = "";
    }
    $("#flowNo").val(flowID);
    
    var initTgid = $("#TG_ID").val();
	 if(initTgid!="null"){
   	 $('#orgNo').val(initTgid);
   	 initTree();
   	$('#orgName').val($.fn.zTree.getZTreeObj("treeDemo").getSelectedNodes()[0].name);
   	tgNo = initTgid;
   }else{
   	 $('#orgNo').val("01");
   }

    TableInit();
    
    jeDate("#start_time",{
        format: "YYYY-MM-DD hh:mm"
    });
    jeDate("#end_time",{
        format: "YYYY-MM-DD  hh:mm"
    });
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
		if((endTime != undefined && endTime != null && endTime != "") && (startTime != undefined && startTime != null && startTime != "")) {
			var start = new Date(startTime.replace("-", "/").replace("-", "/"));
			var end = new Date(endTime.replace("-", "/").replace("-", "/"));

			if (start > end) {
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
        $("#odId").val("");
        $("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
   	 	$("#orgName").val(user.orgName);
        $("#tgName").val("");
        $("#start_time").val("");
        $("#end_time").val("");
        $("#stakeNo").val("");
        $("#org").val("");
        //$("#tgNo").val("");
        tgNo = "";
        $("#flowNo").val("");
        $('#tgNameSelect').html("");
        $("#executeStatus")[0].selectedIndex=0
        refreshRunTable();
    })
})

//刷新表格
function refreshRunTable(){
   var odId= $("#odId").val();
   var orgNo=  $("#orgNo").val();
   var tgName=  $("#tgName").val();
   var startTime=  $("#start_time").val();
   var endTime=  $("#end_time").val();
    var opt = {
        url : "schedulingController.do?getSchedulingList&orgNo="+orgNo+"&odId="+odId
        +"&startTime="+startTime+"&endTime="+endTime+"&orderType="+orderType
    };
    var opt = "";
    $('#planTable').bootstrapTable('refresh', opt);
}

function TableInit() {
    $("#planTable").bootstrapTable({
        url: 'schedulingController.do?getSchedulingList',         //请求后台的URL（*）
        method: 'get',                      //请求方式（*）
        contentType: "application/x-www-form-urlencoded",
         striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        queryParams: function (params){//传递参数（*）
            return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                limit: params.pageSize,   //页面大小
                offset: params.pageNumber,  //页码
                flowNo:$("#flowNo").val(),
                stakeNo:$("#stakeNo").val(),
                orgNo:$("#orgNo").val(),
                tgNo:tgNo,
                startTime:$("#start_time").val(),
                endTime:$("#end_time").val(),
                executeStatus:$("#executeStatus").val(),
                orderType:orderType//订单类型 共享订单为1
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 20, 50, 100],        //可供选择的每页的行数（*）
        strictSearch: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        clickToSelect: true,                //是否启用点击选中行
        minimumCountColumns: 2,             //最少允许的列数
        height : $(window).height()-150,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "tgId",                     //每一行的唯一标识，一般为主键列
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,        				//是否显示行间隔色
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        singleSelect:true,
        undefinedText:"",                      //未定义列的显示文本
        columns: [  
            {
            field: 'i',
            title: '序号',
            halign:"center",
            align:"center",
            width:50,
            },{
                field: 'flowNo',
                halign:"center",
                align:"center",
                title: '流水号',
                width:150,
                formatter:function(value, row, index){
            		if(row.flowNo){
                		var url="schedulingController.do?SchedulingDetails&flowNo="+row.flowNo+"&orderType="+orderType;
                		var title = "计划调度详情";
                		return '<a href="#" onclick="clickT(\'' + url + '\',\''+title+'\')" style="color:blue">'+value+'</a>';
            		}
            		else
            			return "";
            	}
            }, {
                field: 'tgName',
                halign:"center",
                align:"center",
                title: '台区名称',
                width:150,
            },
            {
                field: 'stakeNo',
                halign:"center",
                align:"center",
                title: '桩编号',
                width:150,
            },{
                field: 'startTime',
                halign:"center",
                align:"center",
                title: '开始时间',
                width:150,

            },
            {
                field: 'endTime',
                halign:"center",
                align:"center",
                title: '结束时间',
                width:150,
            },
            {
                field: 'p',
                halign:"center",
                title: '功率(kW)',
                align:'center',
                width:100,

            },
            {
                field: 'status',
                halign:"center",
                title: '状态',
                align:'center',
                width:100,
                formatter:function(value,row,index){
                    if (row.status == "1"){
                        return "下发中";
                    } else if(row.status == "2") {
                        return "下发成功";
                    }else if(row.status == "3"){
                        return "下发失败";
                    }
                },
            },
            {
                field: 'planCount',
                halign:"center",
                title: '制定次数',
                align:'center',
                width:100,
            },
            {
                field: 'serialNum',
                title: '时段序号',
                halign:"center",
                align:'center',
                width:100,
            }
           ],
  			    onClickRow:function(row,$element,field){
  			    	$element.parent().find("tr").removeClass("click-tr-bg");
  			    	$element.addClass("click-tr-bg");
  			    }
        
        		,onLoadSuccess: function(data){  //加载成功时执行
	  				
	  				if(data.total==0){
	  					
	  					$("#planTable").bootstrapTable('load',{rows:[{i:"&nbsp"},{i:"&nbsp"},{i:"&nbsp"},{i:"&nbsp"},{i:"&nbsp"},{i:"&nbsp"},{i:"&nbsp"},{i:"&nbsp"},{i:"&nbsp"},{i:"&nbsp"}],total:0})
	  				}
	  				
		                console.info("加载成功");
		          },
		          onLoadError: function(){  //加载失败时执行
		                console.info("加载数据失败");
		          }
    });

}

function init(){
	if($('#stake_no_g').val() != "" && $('#stake_no_g').val() !="null"){
		$('#odId').val($('#stake_no_g').val());
	}
	if($('#stake_no_y').val() != "" && $('#stake_no_y').val() !="null"){
		$('#orgNo').val($('#stake_no_y').val());
	}
    if($('#stake_no_n').val() != "" && $('#stake_no_n').val() !="null"){
        $('#orgName').val($('#stake_no_n').val());
    }
    if($('#stakeNo_no').val() != "" && $('#stakeNo_no').val() !="null"){
        $('#stakeNo').val($('#stakeNo_no').val());
    }
    if($('#tg_no_g').val() != "" && $('#tg_no_g').val() !="null"){
		 $('#tgNameSelect').selectpicker('val',$('#tg_no_g').val()); 
    }
    refreshRunTable();
}

function doSearch(tgNo){
    refreshRunTable();
}
/**
 * 合并单元格
 *
 * @param data
 *            原始数据（在服务端完成排序）
 * @param fieldName
 *            合并参照的属性名称
 * @param colspan
 *            合并开始列
 * @param target
 *            目标表格对象
 * @param fieldList
 *            要合并的字段集合
 */
function mergeCells(data,fieldName,colspan,target,fieldList){
// 声明一个map计算相同属性值在data对象出现的次数和
    var sortMap = {};
    for(var i = 0 ; i < data.length ; i++){
        for(var prop in data[i]){
            //例如people.unit.name
                var fieldArr=fieldName.split(".");
                getCount(data[i],prop,fieldArr,0,sortMap);
        }
    }
    var index = 0;
    for(var prop in sortMap){
        var count = sortMap[prop];
        for(var i = 0 ; i < fieldList.length ; i++){
            $(target).bootstrapTable('mergeCells',{index:index, field:fieldList[i], colspan: colspan, rowspan: count,align: 'center'});
        }
        index += count;
    }
}
/**
 * 递归到最后一层 统计数据重复次数
 * 比如例如people.unit.name 就一直取到name
 * 类似于data["people"]["unit"]["name"]
 */
function getCount(data,prop,fieldArr,index,sortMap){
    if(index == fieldArr.length-1){
        if(prop == fieldArr[index]){
            var key = data[prop];
            if(sortMap.hasOwnProperty(key)){
                sortMap[key] = sortMap[key]+ 1;
            } else {
                sortMap[key] = 1;
            }
        }
        return;
    }
    if(prop == fieldArr[index]){
        var sdata = data[prop];
        index=index+1;
        getCount(sdata,fieldArr[index],fieldArr,index,sortMap);
    }

}

//页面跳转方法
function clickT(url,title){
	parent.openNewTab(url,title);
}  

//初始化树的方法
function initTree(){
    //传入所需要的id属性名
      treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
      orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}