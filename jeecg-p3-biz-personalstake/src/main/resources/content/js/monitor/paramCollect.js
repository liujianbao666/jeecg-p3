var fCharts;
var mqData;
var ecId;
var usre;
$(document).ready(function(){
	dwr.engine.setActiveReverseAjax(true);  
	dwr.engine.setNotifyServerOnPageUnload(true);  
	init();//初始化时间控件
	//初始化列表
	//tgEcInit();  //初始化控制器列表
	ecParamInit();
	$('#ecParamInfo').colResizable(); //拖动改变列宽
	tgParamInit();
	routParamInit();
	//tgForecastInit();
	tgForeChartInit();
	
    //选择曲线触发的时间
	  $(function() {
        //给div添加change事件
		  $("#paramType").change(function() {
            if($(this).val() == '1' ) {
          	  $(".tgCurveDiv").hide();
            }else if($(this).val()=='2'){
          	  $(".tgCurveDiv").hide(); 
            }else if($(this).val()=='3'){
          	  $(".tgCurveDiv").hide(); 
            }else if($(this).val()=='4'){
          	  $(".tgCurveDiv").show(); 
            }else if($(this).val()=='5'){
              $(".tgCurveDiv").show(); 
            }
        })  
    })
		
	//点击组织单位出来选择框
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
    initTree();
	
    //召测按钮
	$("#search-btn").bind("click",function(){
		//先清空召测列表区域
		$(".ecParamDiv").css('display','none');
		$(".tgParamDiv").css('display','none');
		$(".routParamDiv").css('display','none');
		$(".tgForecastDiv").css('display','none');
		$(".ecClickDiv").css('display','none');
		$(".routClickDiv").css('display','none');
		
		var orgNo =  $("#orgNo").val();
		var ecNos = $('#ecNo').val();
		var type = $("#paramType option:selected").val();
		var date = $("#date").val();
		var startTime= $('#startTime').val();
		var endTime= $('#endTime').val();
		if(orgNo == "" || orgNo == null){
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
		if(type == undefined || type == null || type == ""){
			$("#search-btn").removeAttr("disabled");
			$.notify({
				message : "请选择参数类型！"
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
		
		switch(type){
		case "1":
			$(".ecParamDiv").css('display','block');
			//召测数据，刷新对应的表格
			refreshTable("ecParamInfo",orgNo,type);
			break;
		case "2":
			$(".tgParamDiv").css('display','block');
			refreshTable("tgParamInfo",orgNo,type);
			break;
		case "3":
			var selects = $('#tgRouterInfo').bootstrapTable('getSelections');
			if(selects.length == 0){
				quickNotify("请先选择一条数据","warning");
				return false;
			}
			var serialNos = JSON.stringify(selects);
			var obj = JSON.parse(serialNos);
			var serialNo = obj[0].rSerialNo;
			$(".routParamDiv").css('display','block');
			refreshTable("routParamInfo",orgNo,type,serialNo);
			break;
		case "4":
			$("#search-btn").removeAttr("disabled");
			if(date == undefined || date == null || date == ""){
				$.notify({
					message : "请选择日期！"
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
			}else if(startTime == undefined || startTime == null || startTime == ""){
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
			} else if(endTime == undefined || endTime == null || endTime == ""){
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
			}else if(startTime > endTime){
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
			}else{
			$(".tgForecastDiv").css('display','block');
			refreshFCharts();
		}
			break;
		case "5":
			$("#search-btn").removeAttr("disabled");
			if(date == undefined || date == null || date == ""){
				$.notify({
					message : "请选择日期！"
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
			}else if(startTime == undefined || startTime == null || startTime == ""){
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
			} else if(endTime == undefined || endTime == null || endTime == ""){
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
			}else if(startTime > endTime){
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
			}else{
			$(".tgForecastDiv").css('display','block');
			refreshFCharts();
			}
			break;
		case "6":
			$(".routClickDiv").css('display','block');
			refreshTable("routClickInfo",orgNo,type);
			break;
		default:
			break;
		}
		
	});
	//判断为空
	$('#paramType').change(function(){
		//组织单位、台区判空
		var orgNo =  $("#orgNo").val();
		if(orgNo == "" || orgNo == undefined || orgNo == null){
			quickNotify("请先选择组织单位！","warning");
			//return false;
		}
		else{
			//路由器档案参数
			 if($(this).val() == '3' ) {
	       	 // $(".tgRouterDiv").css('display','block');
				 //先清空显示区域
				 $(".ecParamDiv").css('display','none');
				 $(".tgParamDiv").css('display','none');
				 $(".routParamDiv").css('display','none');
				 $(".tgForecastDiv").css('display','none');
				 $(".tgRouterDiv").show();
				 getTgRouterInfo();
	         }
			 else{
				 $(".tgRouterDiv").hide();
			 }
		}
		
	});
})

function refreshTable(id,orgNo,type,serialNo){
	if(type == "3"){
		var opt = {
				url : "monitorController.do?getCollectData&orgNo="+orgNo+"&type="+type+"&serialNo="+serialNo,
			};
			$('#'+id).bootstrapTable('refresh', opt); 
	} else{
		$.ajax({   
			  async : false,   //设置为false。请求为同步请求
			  cache:false,   	//不设置缓存
			  type: 'get',   
			  dataType : "json",   
			  url: "monitorController.do?getCollectData&orgNo="+orgNo+"&type="+type
		});
	}
	
}

function refreshTgEcTable(){
	var orgNos =  $("#orgNo").val();
	var tgNos = $("#tgNameSelect").selectpicker('val');
	var opt = {
			url:"monitorController.do?getTgEcData&orgNos="+orgNos+"&tgNos="+tgNos,
		};
	$('#tgEcInfo').bootstrapTable('refresh', opt); 
}

//刷新台区基础负荷预测曲线
function refreshFCharts(){
	var tgNo = $("#tgNameSelect option:selected").val();
	//var orgNo = $('#orgNo').val();
	//var orgName = $('#orgName').val();
	var date = $("#date").val();
	var startTime= $('#startTime').val();
	var endTime= $('#endTime').val();
	
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'get',   
		  dataType : "json",   
		  data:{
			  //"orgName":orgName,
			  "tgId":tgNo,
			  "date":date,
			  "type":'4',
			  "startTime":startTime,
			  "endTime":endTime
		  },
		  url: "monitorController.do?getTgForeCurveData",//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){
			  debugger
			  if(!fCharts){
		          return;
		     }
		     //更新数据
		      var option = fCharts.getOption();
		      option.series[0].data = data.forecast;   
		      fCharts.setOption(option); 
		  }
	});
}
//初始化时间的方法
function init(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	
	jeDate("#date",{
	       format: "YYYY-MM-DD"
	   });
	jeDate("#startTime",{
	       format: "hh:mm"
	   });
	jeDate("#endTime",{
	       format: "hh:mm"
	   });
}

//获取今天的时间
function getToday(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	return today;
}


//下拉框模糊查询
function selectInit(){
	//台区名称下拉框，模糊查询
	 $(".selectpicker").selectpicker({  
         noneSelectedText : '请输入台区名称'  
     });  
}

/**
 * 初始化所选台区对应的控制器参数列表
 */
/*function tgEcInit(){
	var tgNos = $("#tgNameSelect").selectpicker('val');
	var orgNos=$('#orgNos').val();
	
	$('#tgEcInfo').bootstrapTable({    
	    url:'monitorController.do?getTgEcData',
	    striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        pagination: true,                   //是否显示分页（*）
        searchOnEnterKey:false,
        clickToSelect:true,
        //singleSelect:true,
        queryParams: function (params){//传递参数（*）
        	return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        		limit: params.pageSize,   //页面大小
                offset: params.pageNumber,  //页码
                orgNos:orgNos,
                tgNos:tgNos
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 20, 25, 50, 100],        //可供选择的每页的行数（*）
	    columns:[    
	        {checkbox:true},
	        {title:'序号',width:'5%',halign:"center",align:'center',
            formatter: function (value, row, index) {  
                return index+1;  
            }},     
            {field:'orgName',title:'组织单位名称',width:'13%',halign:"center",align:'center'},
	        {field:'tgName',title:'台区名称',width:'13%',halign:"center",align:'center'},
	        {field:'ecNo',title:'能源控制器编号',width:'13%',align:'center',align:'center'},
	        {field:'cpNo',title:'采集点标识',width:'13%',halign:"center",align:'center'},
	        {field:'runStatus',title:'运行状态',width:'13%',halign:"center",align:'center'}
	    ],
	    onClickRow:function(row,$element,field){
        	$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
        }
	});
}*/

/**
 * 获取台区下的充电桩对应的路由器信息，主要是体现出路由器的序号,以便召测路由器档案参数使用
 */
function getTgRouterInfo(){
	$('#tgRouterInfo').bootstrapTable({    
	    url:'monitorController.do?getTgRouterInfo',
	    striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        pagination: true,                   //是否显示分页（*）
        searchOnEnterKey:false,
        clickToSelect:true,
        singleSelect:true,
        queryParams: function (params){//传递参数（*）
        	return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        		limit: params.pageSize,   //页面大小
                offset: params.pageNumber,  //页码
                orgNo:$('#orgNo').val()
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        strictSearch: true,
        sortable:false,						//是否起用排序
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        clickToSelect: true,                //是否启用点击选中行
        uniqueId: "id",                     //每一行的唯一标识，一般为主键列
        minimumCountColumns: 2,             //最少允许的列数
        height : $(window).height()-150,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        undefinedText:"",                      //未定义列的显示文本
	    columns:[    
	        {checkbox:true},
	        {title:'序号',width:'5%',halign:"center",align:'center',
            formatter: function (value, row, index) {  
                return index+1;  
            }},     
	        {title:'台区名称',field:'tgName',align:'center'},
	        {title:'充电桩编号',field:'stakeNo',align:'center'},
	        {title:'充电桩名称',field:'stakeName',align:'center'},
	        {title:'路由器编号',field:'routerNo',align:'center'},
	        {title:'路由器序号',field:'rSerialNo',align:'center'}
	    ],
	    onClickRow:function(row,$element,field){
        	$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
        }
	});
}

/**
 * 能源控制器通信参数列表
 */
function ecParamInit(){
	$('#ecParamInfo').bootstrapTable({    
	  //  url:'monitorController.do?getTgInfo',
	    striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        pagination: true,                   //是否显示分页（*）
        searchOnEnterKey:false,
        clickToSelect:true,
        singleSelect:true,
        queryParams: function (params){//传递参数（*）
        	return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        		limit: params.pageSize,   //页面大小
                offset: params.pageNumber  //页码
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        strictSearch: true,
        sortable:false,						//是否起用排序
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        clickToSelect: true,                //是否启用点击选中行
        uniqueId: "id",                     //每一行的唯一标识，一般为主键列
        minimumCountColumns: 2,             //最少允许的列数
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        undefinedText:"",                      //未定义列的显示文本
	    columns:[    
	        {title:'序号',width:'5%',halign:"center",align:'center',
            formatter: function (value, row, index) {  
                return index+1;  
            }},     
            {field:'ECID',title:'能源控制器编号',width:'13%',halign:"center",align:'center',
            	formatter:function(value, row, index){
	        		if(row.ECID_flag == "1"){
	        			return '<label style="color:red">'+value+'</label>';
	        		}
	        		else{
	        			return value;
	        		}
	        		
	        }},
            {field:'mIp',title:'主站ip地址(主用)',width:'13%',halign:"center",align:'center',
            	formatter:function(value, row, index){
	        		if(row.mIp_flag == "1"){
	        			return '<label style="color:red">'+value+'</label>';
	        		}
	        		else{
	        			return value;
	        		}
	        		
	        }},
	        {field:'mPort',title:'主站端口(主用)',width:'13%',halign:"center",align:'center',
            	formatter:function(value, row, index){
	        		if(row.mPort_flag == "1"){
	        			return '<label style="color:red">'+value+'</label>';
	        		}
	        		else{
	        			return value;
	        		}
	        		
	        }},
	        {field:'sIp',title:'主站ip地址(备用)',width:'13%',halign:"center",align:'center',
            	formatter:function(value, row, index){
	        		if(row.sIp_flag == "1"){
	        			return '<label style="color:red">'+value+'</label>';
	        		}
	        		else{
	        			return value;
	        		}
	        		
	        }},
	        {field:'sPort',title:'主站端口(备用)',width:'13%',halign:"center",align:'center',
            	formatter:function(value, row, index){
	        		if(row.sPort_flag == "1"){
	        			return '<label style="color:red">'+value+'</label>';
	        		}
	        		else{
	        			return value;
	        		}
	        		
	        }},
	        {field:'apn',title:'接入点名称(apn)',width:'13%',halign:"center",align:'center',
            	formatter:function(value, row, index){
	        		if(row.apn_flag == "1"){
	        			return '<label style="color:red">'+value+'</label>';
	        		}
	        		else{
	        			return value;
	        		}
	        		
	        }},
	        {field:'longitude',title:'经度',halign:"center",align:"center",
            	formatter:function(value, row, index){
	        		if(row.longitude_flag == "1"){
	        			return '<label style="color:red">'+value+'</label>';
	        		}
	        		else{
	        			return value;
	        		}
	        		
	        }},
	        {field:'latitude',title:'纬度',halign:"center",align:"center",
            	formatter:function(value, row, index){
	        		if(row.latitude_flag == "1"){
	        			return '<label style="color:red">'+value+'</label>';
	        		}
	        		else{
	        			return value;
	        		}
	        		
	        }},
	        
	        {field:'ECID_flag',visible:false},
            {field:'mIp_flag',visible:false},
	        {field:'mPort_flag',visible:false},
	        {field:'sIp_flag',visible:false},
	        {field:'sPort_flag',visible:false},
	        {field:'apn_flag',visible:false},
	        {field:'longitude_flag',visible:false},
	        {field:'latitude_flag',visible:false}
	    ],
	    onClickRow:function(row,$element,field){
        	$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
        }
	});
}

/**
 * 台区基本参数列表
 */
function tgParamInit(){
	$('#tgParamInfo').bootstrapTable({    
	  //  url:'monitorController.do?getTgInfo',
		method : 'get', // 请求方式（*）
		contentType : "application/x-www-form-urlencoded",
		toolbar : '#toolbar', // 工具按钮用哪个容器
		// striped: true, //是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination : false, // 是否显示分页（*）
		sortable : false, // 是否启用排序
		sortOrder : "asc", // 排序方式
        queryParams: function (params){//传递参数（*）
        	return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        		limit: params.pageSize,   //页面大小
                offset: params.pageNumber  //页码
            };
        },
        strictSearch: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        clickToSelect: true,                //是否启用点击选中行
        minimumCountColumns: 2,             //最少允许的列数
        uniqueId: "i",                     //每一行的唯一标识，一般为主键列
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        resizable:true,
      //  liveDrag : true,
        undefinedText:"",                      //未定义列的显示文本
	    columns:[    
	        {title:'序号',width:'5%',halign:"center",align:'center',
            formatter: function (value, row, index) {  
                return index+1;  
            }},     
            {field:'ECID',title:'能源控制器编号',halign:"center",align:'center',
            	formatter:function(value, row, index){
            		if(row.ecNo_flag == "1"){
            			return '<label style="color:red">'+value+'</label>';
            		}else{
            			return value;
            		}
            	}},
            {field:'ratedCapacity',title:'台区配变额定容量',width:'15%',align:'center',halign:"center",
                	formatter:function(value, row, index){
                		if(row.tgNp_flag == "1"){
                			return '<label style="color:red">'+value+'</label>';
                		}else{
                			return value;
                		}
                }},
	        {field:'maxLoad',title:'最大负荷',halign:"center",align:'center',
                	formatter:function(value, row, index){
                		if(row.maxLoad_flag == "1"){
                			return '<label style="color:red">'+value+'</label>';
                		}else{
                			return value;
                		}
                }},
	        {field:'maxTime',title:'最大持续时间',width:'15%',align:'center',halign:"center",
                	formatter:function(value, row, index){
                		if(row.maxLastedTime_flag == "1"){
                			return '<label style="color:red">'+value+'</label>';
                		}else{
                			return value;
                		}
                }},
	        {field:'vRatio',title:'电压互感器变比',width:'15%',halign:"center",align:'center',
                	formatter:function(value, row, index){
                		if(row.VTransferR_flag == "1"){
                			return '<label style="color:red">'+value+'</label>';
                		}else{
                			return value;
                		}
                }},
	        {field:'cRatio',title:'电流互感器变比',width:'15%',halign:"center",align:'center',
                	formatter:function(value, row, index){
                		if(row.ITransferR_flag == "1"){
                			return '<label style="color:red">'+value+'</label>';
                		}else{
                			return value;
                		}
                }},
	        
	        {field:'ecNo_flag',visible:false},
            {field:'tgNp_flag',visible:false},
	        {field:'maxLoad_flag',visible:false},
	        {field:'maxLastedTime_flag',visible:false},
	        {field:'VTransferR_flag',visible:false},
	        {field:'ITransferR_flag',visible:false}
	    ],
	    onClickRow:function(row,$element,field){
        	$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
        }
	});
}

/**
 * 路由器档案参数列表
 */
function routParamInit(){
	$('#routParamInfo').bootstrapTable({    
	  //  url:'monitorController.do?getTgInfo',
		 method: 'get',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        contentType: "application/x-www-form-urlencoded",
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        //queryParams: oTableInit.queryParams,//传递参数（*）
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
        uniqueId: "i",                     //每一行的唯一标识，一般为主键列
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        resizable:true,
      //  liveDrag : true,
        undefinedText:"",                      //未定义列的显示文本
       queryParams: function (params){//传递参数（*）
        	return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        		limit: params.pageSize,   //页面大小
                offset: params.pageNumber  //页码
            };
        },
	    columns:[    
	        {title:'序号',width:'5%',halign:"center",align:'center',
            formatter: function (value, row, index) {  
                return index+1;  
            }},     
            {field:'ECID',title:'能源控制器编号',width:'12%',halign:"center",align:'center',
            	formatter:function(value, row, index){
            		if(row.ecNo_flag == "1"){
            			return '<label style="color:red">'+value+'</label>';
            		}else{
            			return value;
            		}
            }},
	        {field:'erNo',title:'路由器编号',width:'10%',halign:"center",align:'center',
            	formatter:function(value, row, index){
            		if(row.routerNo_flag == "1"){
            			return '<label style="color:red">'+value+'</label>';
            		}else{
            			return value;
            		}
            }},
	        {field:'erAddr',title:'路由器地址',width:'10%',halign:"center",align:'center',
            	formatter:function(value, row, index){
            		if(row.routerAddr_flag == "1"){
            			return '<label style="color:red">'+value+'</label>';
            		}else{
            			return value;
            		}
            }},
	        {field:'meterAddr',title:'通信地址',width:'10%',halign:"center",align:'center',
            	formatter:function(value, row, index){
            		if(row.comAddr_flag == "1"){
            			return '<label style="color:red">'+value+'</label>';
            		}else{
            			return value;
            		}
            }},
	        {field:'pileId',title:'充电桩编号',width:'10%',halign:"center",align:'center',
            	formatter:function(value, row, index){
            		if(row.cgNo_flag == "1"){
            			return '<label style="color:red">'+value+'</label>';
            		}else{
            			return value;
            		}
            }},
	        {field:'gunNo',title:'充电接口标识',width:'10%',halign:"center",align:'center',
            	formatter:function(value, row, index){
            		if(row.cgInterface_flag == "1"){
            			return '<label style="color:red">'+value+'</label>';
            		}else{
            			return value;
            		}
            }},
	        {field:'pileAddr',title:'充电桩安装地址',width:'13%',halign:"center",align:"center",
            	formatter:function(value, row, index){
            		if(row.cgAddr_flag == "1"){
            			return '<label style="color:red">'+value+'</label>';
            		}else{
            			return value;
            		}
            }},
	        {field:'minPower',title:'充电桩最低功率',width:'14%',halign:"center",align:"center",
            	formatter:function(value, row, index){
            		if(row.cgMinP_flag == "1"){
            			return '<label style="color:red">'+value+'</label>';
            		}else{
            			return value;
            		}
            }},
	        {field:'rtedPower',title:'额定功率',width:'10%',halign:"center",align:"center",
            	formatter:function(value, row, index){
            		if(row.NP_flag == "1"){
            			return '<label style="color:red">'+value+'</label>';
            		}else{
            			return value;
            		}
            }},
	        
	        {field:'ecNo_flag',visible:false},
	        {field:'routerNo_flag',visible:false},
	        {field:'routerAddr_flag',visible:false},
	        {field:'comAddr_flag',visible:false},
	        {field:'cgNo_flag',visible:false},
	        {field:'cgInterface_flag',visible:false},
	        {field:'cgAddr_flag',visible:false},
	        {field:'cgMinP_flag',visible:false},
	        {field:'NP_flag',visible:false}
	    ],
	    onClickRow:function(row,$element,field){
        	$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
        }
	});
}



/**
 * 台区预测负荷曲线图
 */
function tgForeChartInit(){
	fCharts = echarts.init(document.getElementById('tgForeChart')); // 初始化

	// 指定图标的数据和配置项
	var orgNo = $('#orgNo').val(); // 供电单位编号
	var orgName = $('#orgName').val();
	var tgNo = $("#tgNameSelect option:selected").val();
	var date = $('#date').val(); // 日期、
	var startTime= $('#startTime').val();
	var endTime= $('#endTime').val();
    var xIndex = [];
	for (var i = 0; i < 288; i++) {
		xIndex.push(i+1);
	}
	$.ajax({
		async : false, // 设置为false。请求为同步请求
		cache : false, // 不设置缓存
		type : 'get',
		dataType : "json",
		data : {
			 "orgNo":orgNo,
			"orgName" : orgName,
			"tgNo" : tgNo,
			"date" : date,
			"startTime" :startTime,
			"endTime" :endTime
		},
		url : "monitorController.do?getTgForeCurveData",// 后台处理程序,获取显示数据
		error : function() {// 请求失败处理函数
			return false;
		},
		success : function(data) { // 请求成功后处理函数。
			// 解析后台传回来的data，把它传给纵轴
			var option1 = {
				tooltip : {
					trigger : 'axis',
					position : function(pt) {
						return [ pt[0], '10%' ];
					}
				},
				xAxis : {
					type : 'category',
					name : '点个数(num)',
					boundaryGap : false,
					data : xIndex
					        
				},
				yAxis : [ {
					type : 'value',
					name : '功率(kW)'
				} ],
				dataZoom : [
						{
							type : 'inside',
							start : 0,
							end : 100
						},
						{
							start : 0,
							end : 100,
							handleIcon : 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
							handleSize : '80%',
							handleStyle : {
								color : '#fff',
								shadowBlur : 3,
								shadowColor : 'rgba(0, 0, 0, 0.6)',
								shadowOffsetX : 2,
								shadowOffsetY : 2
							}
						} ],
				series : [ {
					name : '预测负荷',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#05C12E'
						}
					},
					data : data.forecast
				} ]
			};
			fCharts.setOption(option1);
		}
	})
}
/*
*/
/**
 * 台区基础负荷预测参数列表  
 *//*
function tgForecastInit(){
	$('#tgForecast').bootstrapTable({    
	  //  url:'monitorController.do?getTgInfo',
	    striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        pagination: true,                   //是否显示分页（*）
        searchOnEnterKey:false,
        clickToSelect:true,
        singleSelect:true,
        queryParams: function (params){//传递参数（*）
        	return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        		limit: params.pageSize,   //页面大小
                offset: params.pageNumber  //页码
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 20, 25, 50, 100],        //可供选择的每页的行数（*）
	    columns:[    
	        {title:'序号',width:'5%',halign:"center",align:'center',
            formatter: function (value, row, index) {  
                return index+1;  
            }},     
            {field:'ecNo',title:'能源控制器编号',width:'13%',align:'center',},
            {field:'date',title:'日期',width:'13%',halign:"center"},
            {field:'startTime',title:'开始时间',width:'13%',halign:"center"},
	        {field:'endTime',title:'结束时间 ',width:'13%',halign:"center",align:'center'},
	        {field:'power',title:'功率设定值',width:'13%',halign:"center",align:'center'}
	    ],
	    onClickRow:function(row,$element,field){
        	$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
        }
	});
}
*/
/**
 * 控制器查询列表
 */
function ecClickInit(){
	$('#ecClickInfo').bootstrapTable({    
	  //  url:'monitorController.do?getTgInfo',
	    striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        pagination: true,                   //是否显示分页（*）
        searchOnEnterKey:false,
        clickToSelect:true,
        singleSelect:true,
        /*queryParams: function (params){//传递参数（*）
        	return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        		limit: params.pageSize,   //页面大小
                offset: params.pageNumber  //页码
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 20, 25, 50, 100],        //可供选择的每页的行数（*）
*/	    columns:[    
	        {title:'序号',width:'5%',halign:"center",align:'center',
            formatter: function (value, row, index) {  
                return index+1;  
            }},     
            {field:'ecNo',title:'能源控制器编号',align:'center',},
            {field:'erNo',title:'能源路由器编号',halign:"center"},
	        {field:'endPointTime',title:'终端时间',halign:"center",align:'center'},
	        
	    ],
	    onClickRow:function(row,$element,field){
        	$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
        }
	});
}

/**
 * 路由器时钟列表  //表不确定
 */
function routClickInit(){
	$('#routClickInfo').bootstrapTable({    
	  //  url:'monitorController.do?getTgInfo',
	    striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        pagination: true,                   //是否显示分页（*）
        searchOnEnterKey:false,
        clickToSelect:true,
        singleSelect:true,
        /*queryParams: function (params){//传递参数（*）
        	return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        		limit: params.pageSize,   //页面大小
                offset: params.pageNumber  //页码
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 20, 25, 50, 100],        //可供选择的每页的行数（*）
*/	    columns:[    
	        {title:'序号',width:'5%',halign:"center",align:'center',
            formatter: function (value, row, index) {  
                return index+1;  
            }},     
            {field:'ecNo',title:'能源控制器编号',width:'13%',align:'center',},
            {field:'mainStIp',title:'主站ip地址(主用)',width:'13%',halign:"center"},
	        {field:'mainStPoint',title:'主站端口(主用)',width:'13%',halign:"center",align:'center'},
	        {field:'mainStIpBak',title:'主站ip地址(备用)',width:'13%',halign:"center",align:'center'},
	        {field:'mainStPointBak',title:'主站端口(备用)',width:'13%',halign:"center",align:'center'},
	        {field:'apn',title:'接入点名称(apn)',width:'13%',halign:"center",align:'center'},
	        {field:'longitude',title:'经度',halign:"center",align:"right"},
	        {field:'latitude',title:'纬度',halign:"center",align:"right"}
	    ],
	    onClickRow:function(row,$element,field){
        	$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
        }
	});
}

function intToTwoStr(num){
	if(num < 10){
		return "0" + num;
	}
	return num;
}

//召测数据
function show(data) {
	var orgNo = $("#orgNo").val();
	mqData = data; //jsonobject
	var obj = JSON.parse(mqData); //json对象
	var dataType = obj.dataType;
	var array = new Array();
	array.push(obj);
	var o = {};
	o.rows = array;
	o.total = 1;
	$.ajax({
		async : false, // 设置为false。请求为同步请求
		cache : false, // 不设置缓存
		type : 'get',
		dataType : "json",
		url : "monitorController.do?getEcIdData&orgNo=" + orgNo,
		success : function(data) {
			ecId = data.EcId;
		}
	});
	if (obj.ECID == ecId) {
		switch (dataType) {
		case "ECC21": //能源控制器信息
			$("#ecParamInfo").bootstrapTable('load', o);
			break;
		case "ECC22": //台区信息
			console.log(o);
			$("#tgParamInfo").bootstrapTable('load', o);
			break;
		case "ECC23": //路由器信息
			var routers = obj.erInfos;
			var array1 = new Array();
			routers[0].ECID = obj.ECID;
			array1.push(routers[0]);
			var o1 = {};
			o1.rows = array1;
			o1.total = 1;
			$("#routParamInfo").bootstrapTable('load', o1);
			break;
		case "ECC24": //曲线信息
			//更新数据
		      var option = fCharts.getOption();  
		      fCharts.setOption(option); 
			break;
		default:
			break;
		}
	}
}

//点击弹出组织机构
function initTree(){
    //传入所需要的id属性名
    treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
    orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}

