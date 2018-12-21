var charts;
var num = 0;
$(document).ready(
function() {
    dwr.engine.setActiveReverseAjax(true);
    dwr.engine.setNotifyServerOnPageUnload(true);
    var user = getUserOrg();
	$("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
	$("#orgName").val(user.orgName);
	// 能源控制器通信参数
	communicationTable();
	// 台区基本参数列表
	tgParamInit();
	// 路由器档案参数列表
	routParamInit();
    // 台区路由器负荷预测曲线
	getTgCurves();
	// 表格列拉伸
	$("#ecParamInfo").colResizable();
	$("#tgParamInfo").colResizable();
	$("#routParamInfo").colResizable();
	// 下拉框模糊查询
	selectInit();
	// 时间初始化
	initTime();
	// 页面刷新10秒一次
	refresh1();
    // 时间控件
	jeDate("#date", {
	format : "YYYYMMDD"
	});
	jeDate("#date", {
	format : "YYYYMMDD"
	});
	// 点击下发按钮下发
	$("#push-btn").bind("click",function() {
//		$("#push-btn").attr({"disabled":"disabled"});
			paramNotNull();
			var tgno = $("#tgNo").val();
			var tgname = $("#tgName").val();
			var orgno = $("#orgNo").val();
			var type = $("#paramType").val();
			var date = $("#date").val();
			var Rtype = $("#Rtype").selectpicker(
					'val');
			if (orgno == "" || orgno == null) {
				$("#push-btn").removeAttr("disabled");
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
			if (type == undefined || type == null
					|| type == "") {
				$("#push-btn").removeAttr("disabled");
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

			switch (type) {
			case "ECC14":
				count=$('#routParamInfo').bootstrapTable('getSelections').length;
				var getSelectRows =	$('#routParamInfo').bootstrapTable('getSelections');
				if(getSelectRows.length==0){
					$.notify({
						message : "请先选择一条数据！"
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
				var ids = new Array();
				for (var i in getSelectRows) {
					ids.push(getSelectRows[i].erNo);
				}
				var total = $('#routParamInfo').bootstrapTable('getOptions').totalRows;
				var erIds = JSON.stringify(ids);

				$.ajax({
							type : 'get',
							url : "communicationController.do?downControlParam",
							dataType : 'json',
							async : false,
							data : {
								"tgno" : tgno,
								"tgname" : tgname,
								"orgno" : orgno,
								"type" : type,
								"total" : total,
								"erIds" : erIds
							},
							success : function(
									result) {
							}
						});
				break;
			case "ECC10":
				var getSelectRows = $('#ecParamInfo').bootstrapTable('getData');
				if(getSelectRows.length==0){
					$.notify({
						message : "数据为空，无法下发！"
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
				
				var jsonArray = JSON.stringify(getSelectRows);
				$.ajax({
						type : 'get',
						url : "communicationController.do?downControlParam",
						dataType : 'json',
						async : false,
						data : {
							"tgno" : tgno,
							"tgname" : tgname,
							"orgno" : orgno,
							"type" : type,
							"getSelectRows" : jsonArray
						},
						success : function(result) {
						}
					});
				break;
			case "ECC12":
				var getSelectRows = $('#tgParamInfo').bootstrapTable('getData');
				if(getSelectRows.length==0){
					$.notify({
						message : "数据为空，无法下发！"
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
				var jsonArray = JSON.stringify(getSelectRows);
				$.ajax({
							type : 'get',
							url : "communicationController.do?downControlParam",
							dataType : 'json',
							async : false,
							data : {
								"tgno" : tgno,
								"tgname" : tgname,
								"orgno" : orgno,
								"type" : type,
								"getSelectRows" : jsonArray
							},
							success : function(
									result) {
							}
						});
				break;
			case "ECC16":
				$.ajax({
					type : 'get',
					url : "communicationController.do?downControlParam",
					dataType : 'json',
					async : false,
					data : {
						"tgno" : tgno,
						"tgname" : tgname,
						"orgno" : orgno,
						"type" : type,
						"date" : date,
						"Rtype" : Rtype
					},
					success : function(
							result) {
					}
				});
		           break;
			case "ECC45":
				
				var getSelectRows = $('#tguserinfo').bootstrapTable('getData');
				if(getSelectRows.length==0){
					$.notify({
						message : "数据为空，无法下发！"
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
				var jsonArray = JSON.stringify(getSelectRows);
				
				$.ajax({
					type : 'get',
					url : "communicationController.do?downControlParam",
					dataType : 'json',
					async : false,
					data : {
						"tgno" : tgno,
						"tgname" : tgname,
						"orgno" : orgno,
						"type" : type,
						"date" : date,
						"getSelectRows" : jsonArray
					},
					success : function(
							result) {
					}
				});
		           break;
				 
			default:
				break;

			}

	});
	
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
	

    //选择曲线触发的时间
	  $(function() {
          //给div添加change事件
		  $("#paramType").change(function() {
              if($(this).val() == 'ECC16' ) {
            	  $(".tgCurveDiv").show();
              }else if($(this).val()=='ECC10'){
            	  $(".tgCurveDiv").hide(); 
              }else if($(this).val()=='ECC12'){
            	  $(".tgCurveDiv").hide(); 
              }else if($(this).val()=='ECC14'){
            	  $(".tgCurveDiv").hide(); 
              }else if($(this).val()=='ECC43'){
                  $(".tgCurveDiv").hide();
              }else if($(this).val()=='ECC45'){
                  $(".tgCurveDiv").hide();
                  tgUserinfoInit();
              }
          })  
      })
	


	// 查询按钮
	$("#ec-search-btn").bind("click",function() {
     // 先清空列表区域
		$(".ecParamDiv").css('display', 'none');
		$(".tgParamDiv").css('display', 'none');
		$(".routParamDiv").css('display', 'none');
		$(".echarts").css('display', 'none');
		var orgNo = $("#orgNo").val();
		var type = $("#paramType").selectpicker('val');
		var date = $("#date").val();
		if (orgNo == "" || orgNo == null) {
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
		}else if (type == undefined || type == null|| type == "") {
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
		 switch (type) {

				case "ECC10":
					$(".ecParamDiv").css('display', 'block');
					refreshEnerconTable("ecParamInfo", orgNo,type);
					break;
				case "ECC12":
					$(".tgParamDiv").css('display', 'block');
					refreshTgTable("tgParamInfo", orgNo, type);
					break;
				case "ECC14":
					$(".routParamDiv").css('display', 'block');
					refreshRouList("routParamInfo", orgNo, type);
					break;
				case "ECC16":
					if (date == "" || date == null) {
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
					}else{
					$(".echarts").css('display', 'block');
					getTgCurves();
					}
					break;
				default:
					break;
			}

	 });

})

// 页面刷新
function refresh1() {
	setInterval(refreshEnerconTable, 10000);
	setInterval(refreshTgTable, 10000);
	setInterval(refreshRouList, 10000);
}

// 表格路径
function refreshEnerconTable(id, orgNo, ecNo, type) {
	var opt = {
		url : "communicationController.do?getEnerconTableList&orgNo=" + orgNo
				+ "&ecNo=" + ecNo + "&type=" + type,
	};
	$('#' + id).bootstrapTable('refresh', opt);
}

function refreshTgTable(id, orgNo, ecNo, type) {
	var opt = {
		url : "communicationController.do?getTgTable&orgNo=" + orgNo
				+ "&ecNo=" + ecNo + "&type=" + type,
	};
	$('#' + id).bootstrapTable('refresh', opt);
}

function refreshRouList(id, orgNo, ecNo, type) {
	var opt = {
		url : "communicationController.do?getRouList&orgNo=" + orgNo
				+ "&ecNo=" + ecNo + "&type=" + type,
	};
	$('#' + id).bootstrapTable('refresh', opt);
}


// 能源控制器通信参数
function communicationTable() {
	$('#ecParamInfo').bootstrapTable({
		method : 'get', // 请求方式（*）
		contentType : "application/x-www-form-urlencoded",
		toolbar : '#toolbar', // 工具按钮用哪个容器
		// striped: true, //是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination : false,
		sortable : false, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : function(params) {// 传递参数（*）
			return { 
				orgNo : $("#orgNo").val(),
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
        undefinedText:"",                      //未定义列的显示文本
		columns : [ {
			field : 'ecId',
			title : '能源控制器编号',
			halign : 'center',
			align : "center",
			width : 150,
		}, {
			field : 'ip',
			title : '主站ip地址(主用)',
			halign : 'center',
			align : "center",
			width : 150,
		}, {
			field : 'port',
			title : '主站端口(主用)',
			halign : 'center',
			align : "center",
			width : 100,
		}, {
			field : 'ipBak',
			title : '主站ip地址(备用)',
			halign : 'center',
			align : "center",
			width : 150,
		}, {
			field : 'portBak',
			title : '主站端口(备用)',
			halign : 'center',
			align : "center",
			width : 100,
		}, {
			field : 'apn',
			title : '接入点名称',
			halign : 'center',
			align : "center",
			width : 80,
		}, {
			field : 'Longitude',
			title : '经度',
			halign : 'center',
			align : "center",
			width : 80,
		}, {
			field : 'LatiTude',
			title : '纬度',
			halign : 'center',
			align : "center",
			width : 80,
		}],
		onClickRow : function(row, $element, field) {
			$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
		}
	});

};

/**
 * 台区基本参数列表
 */
function tgParamInit() {
	$('#tgParamInfo').bootstrapTable({
		method : 'get', // 请求方式（*）
		contentType : "application/x-www-form-urlencoded",
		toolbar : '#toolbar', // 工具按钮用哪个容器
		// striped: true, //是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination : false, // 是否显示分页（*）
		sortable : false, // 是否启用排序
		sortOrder : "asc", // 排序方式
		queryParams : function(params) {// 传递参数（*）
			return {
				orgNo : $("#orgNo").val(),
				tgNo : $("#tgNo").val(),
				tgName : $('#tgName').val()
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
		columns : [{
			field : 'ecId',
			title : '能源控制器编号',
			width : 150,
			align : 'center'
		}, {
			field : 'ratedCapacity',
			title : '台区配变额定容量',
			width : 150,
			halign : "center",
			align : 'center'
		}, {
			field : 'maxLoad',
			title : '最大负荷',
			width : 150,
			halign : "center",
			align : 'center'
		}, {
			field : 'maxTime',
			title : '最大持续时间',
			width : 150,
			halign : "center",
			align : 'center'
		}, {
			field : 'vRatio',
			title : '电压互感器变比',
			width : 150,
			halign : "center",
			align : 'center'
		}, {
			field : 'cRatio',
			title : '电流互感器变比',
			width : 150,
			halign : "center",
			align : 'center'
		}],
		onClickRow : function(row, $element, field) {
			$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
		}
	});
}

/**
 * 路由器档案参数列表
 */
function routParamInit() {
	$('#routParamInfo').bootstrapTable({
		method : 'get', // 请求方式（*）
		contentType : "application/x-www-form-urlencoded",
		toolbar : '#toolbar', // 工具按钮用哪个容器
		striped : false, // 是否显示行间隔色
		cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
		pagination : true, // 是否显示分页（*）
		sortable: true, //是否启用排序
		sortOrder: "asc", //排序方式
        queryParams : function(params) {// 传递参数（*）
			return { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
				limit : params.pageSize, // 页面大小
				offset : params.pageNumber, // 页码
				pageSize: params.limit,
				pageNumber: params.pageNumber,
				orgNo : $("#orgNo").val(),
				tgNo : $("#tgNo").val(),
				tgName : $('#tgName').val()
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
		columns : [ {
			checkbox : true
		}, {
            field : 'rouserialnum',
            title : '路由器序号',
            halign : "center",
            align : "center",
            width : 100
        }, {
			field : 'ecId',
			title : '能源控制器编号',
			align : 'center',
			width : 180
		}, {
			field : 'erNo',
			title : '路由器编号',
			halign : "center",
			align : 'center',
			width : 180
		}, {
			field : 'erAddr',
			title : '路由器地址',
			halign : "center",
			align : 'center',
			width : 120
		}, {
			field : 'meterAddr',
			title : '通信地址',
			halign : "center",
			align : 'center',
			width : 120
		}, {
			field : 'pileId',
			title : '充电桩编号',
			halign : "center",
			align : 'center',
			width : 200
		}, {
			field : 'gunNo',
			title : '充电接口标识',
			halign : "center",
			align : 'center',
			width : 100
		}, {
			field : 'pileAddr',
			title : '充电桩安装地址',
			halign : "center",
			align : "center",
			width : 200
		}, {
			field : 'minPower',
			title : '充电桩最低充电功率',
			halign : "center",
			align : "center",
			width : 160
		}, {
			field : 'rtedPower',
			title : '额定功率',
			halign : "center",
			align : "center",
			width : 120
		}],
		onClickRow : function(row, $element, field) {
			$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
		}
		
	});
}

/**
 * 台区用户信息列表
 */
function tgUserinfoInit() {
    $('#tguserinfo').bootstrapTable({
        url: 'communicationController.do?getTgUserinfo',         //请求后台的URL（*）
        method : 'get', // 请求方式（*）
        contentType : "application/x-www-form-urlencoded",
        toolbar : '#toolbar', // 工具按钮用哪个容器
        striped : false, // 是否显示行间隔色
        cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination : true, // 是否显示分页（*）
        sortable: true, //是否启用排序
        sortOrder: "asc", //排序方式
        clickToSelect : true, // 是否启用点击选中行
        height : $(window).height()-130,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        queryParams : function(params) {// 传递参数（*）
            return { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                limit : params.pageSize, // 页面大小
                offset : params.pageNumber, // 页码
                pageSize: params.limit,
                pageNumber: params.pageNumber,
                orgNo : $("#orgNo").val(),
                tgNo : $("#tgNo").val(),
                tgName : $('#tgName').val()
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
        uniqueId: "i",                     //每一行的唯一标识，一般为主键列
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        resizable:true,
      //  liveDrag : true,
        undefinedText:"",                      //未定义列的显示文本
        columns : [ {
            checkbox : true
        }, {
            field : 'ROUSERIALNUM',
            title : '路由器序号',
            halign : "center",
            align : "center",
            width : 100
        }, {
            field : 'USER_ID',
            title : '用户编号',
            align : 'center',
            width : 180
        }, {
            field : 'TOKEN',
            title : 'token',
            halign : "center",
            align : 'center',
            width : 180
        }, {
            //field : 'USERACOUNTFLAG',
            title : '是否欠费',
            halign : "center",
            align : 'center',
            width : 120,
            formatter: function (value, row, index) {  
       		 if(row.USERACOUNTFLAG=="1"){
    			 return "否";  
    		 }else{
    			 return "是";
    		 }
         }
        }, {
            field : 'STAKENO',
            title : '充电桩编号',
            halign : "center",
            align : 'center',
            width : 200
        }, {
            field : 'INST_ADDR',
            title : '充电桩安装地址',
            halign : "center",
            align : "center",
            width : 200
        },{
            field : 'EC_ID',
            title : 'ecid',
            halign : "center",
            align : "center",
            width : 200,
            hide:true
        },{
            field : 'ER_ID',
            title : 'erid',
            halign : "center",
            align : "center",
            hide:true
        },{
            field : 'USERACOUNTFLAG',
            title : 'USERACOUNTFLAG',
            halign : "center",
            align : "center",
            hide:true
        }],
        onClickRow : function(row, $element, field) {
            $element.parent().find("tr").removeClass("click-tr-bg");
            $element.addClass("click-tr-bg");
        }
    });
    $(".tguserinfoDiv").css('display', 'block');
}
/**
 * 台区负荷预测曲线
 */
function getTgCurves() {
	charts = echarts.init(document.getElementById('charts')); // 初始化

	// 指定图标的数据和配置项
	var orgNo = $('#orgNo').val(); // 供电单位编号
	var orgName = $('#orgName').val();
	var date = $('#date').val(); // 日期
    var Rtype=$('#Rtype').val();
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
			"date" : date,
			"Rtype":Rtype
		},
		url : "communicationController.do?getCurveList",// 后台处理程序,获取显示数据
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
			charts.setOption(option1);
		}
   })

}

//台区控制目标曲线
function getMCurves() {
	charts = echarts.init(document.getElementById('Mcharts')); // 初始化

	// 指定图标的数据和配置项
	var orgNo = $('#orgNo').val(); // 供电单位编号
	var orgName = $('#orgName').val();
	var tgNo = $('#tgNo').val();
	if (tgNo != "") {
		$('#tgNameSelect').selectpicker('val', tgNo);
	}
	var date = $('#date').val(); // 日期
    var Rtype=$('#Rtype').val();
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
			"Rtype":Rtype
		},
/*		url : "communicationController.do?",// 后台处理程序,获取显示数据
*/		error : function() {// 请求失败处理函数
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
					name : '台区控制目标曲线',
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
			charts.setOption(option1);
		}
   })

}


// 下拉框模糊查询
function selectInit() {
	// 台区名称下拉框，模糊查询
	$(".selectpicker").selectpicker({
		noneSelectedText : '请输入台区名称'
	});
}

// 下拉模糊查询列表
function selectOnchang(obj) {
	var tgNo = obj.options[obj.selectedIndex].value;
	var tgName = obj.options[obj.selectedIndex].text;
	$('#tgNo').val(tgNo);
	$('#tgName').val(tgName);
	// alert(value);
}

// 选择组织单位
function getSelectItem() {
	var orgNo = $('#orgNo').val();
	if (orgNo == "") {
		$.notify({
			message : "请先选择组织单位！"
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

	// 下拉数据加载
	$.ajax({
		type : 'get',
		url : "monitorController.do?getTgName&orgNo=" + orgNo,
		dataType : 'json',
		async : false,
		success : function(datas) {// 返回list数据并循环获取
			$("#tgNameSelect").html(""); // 清空select下拉框
			var select = $("#tgNameSelect");
			for (var i = 0; i < datas.length; i++) {
				select.append("<option value='" + datas[i].tgId + "'>"
						+ datas[i].tgName + "</option>");
			}
			$('.selectpicker').selectpicker('val', '');
			$('.selectpicker').selectpicker('refresh');
		}
	});
}

// 时间初始化
function initTime() {
	var preDate = new Date();
	var manth = (preDate.getMonth() + 1) > 9 ? (preDate.getMonth() + 1)
			: ("0" + (preDate.getMonth() + 1));
	var datea = (preDate.getDate() > 9) ? (preDate.getDate()) : ("0" + (preDate
			.getDate()));
	var sysDate1 = preDate.getFullYear() + manth + datea;
	$("#date").val(sysDate1);
}

//判断为空
function paramNotNull() {
	var date = $('#date').val();
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
}

//接收dwr推送的MQ消息
/*function showDownMessage(data){
	var tgNo = $("#tgNameSelect").selectpicker('val');
	console.log(data);
	mqData = data;
	var obj = JSON.parse(mqData);
	$.ajax({
		async : false, // 设置为false。请求为同步请求
		cache : false, // 不设置缓存
		type : 'get',
		dataType : "json",
		url : "monitorController.do?getEcIdData&tgNo=" + tgNo,
		success : function(data) {
			ecId = data.EcId;
		}
	});
	if (obj.ECID == ecId && obj.success == 0) {
		$("#push-btn").removeAttr("disabled");
		$.notify({
			message :  "下发成功！"
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
}*/

//下发弹出进度条
function showDownMessage(data){
	$('#wrapper').show();
    setTimeout("$('#wrapper').css('display','none')",10000); 
  $("#push-btn").removeAttr("disabled");
	var tgNo = $("#tgNameSelect").selectpicker('val');
	console.log(data); 
	mqData = data;
	var obj = JSON.parse(mqData);
  var rec = function () {
	  
        num++;
        if (num <= count) {
            $('#fill').html('下发' + num + '/' + count + '条成功');
            getDate(rec)
        }else{
        	num = 0;
        }
    };
    var getDate = function (callback) {
        $.ajax({
        	async : false, // 设置为false。请求为同步请求
 			cache : false, // 不设置缓存
 			type : 'get',
 		    dataType : "json",
 			url : "monitorController.do?getEcIdData&tgNo=" + tgNo,
            success: function (data) {
                callback();
            },
            error: function (xml) {
            }
        })
    };
    rec();
}

//点击弹出组织机构
function initTree(){
    //传入所需要的id属性名
    treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
    orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}

