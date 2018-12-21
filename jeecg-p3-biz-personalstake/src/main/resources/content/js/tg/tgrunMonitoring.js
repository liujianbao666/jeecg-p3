$(document).ready(function(){
	var user = getUserinfo();
	$('#orgNo').val(user.orgNo);
	$('#orgName').val(user.orgName);
	    
		var tgId = $("#tgId").val();
		if(tgId == "" || tgId == null || tgId == undefined || tgId =="null"){
		    $('#orgNo').val(user.orgNo);
		    $('#orgName').val(user.orgName);
		}else{
			$('#orgNo').val(tgId);
			initTree()
			$('#orgName').val($.fn.zTree.getZTreeObj("treeDemo").getSelectedNodes()[0].name);
		}
	    
	    var oTable = new TableInit();
	    oTable.Init();
	    
		//查询按钮
		$("#search-btn").bind("click",function(){
			refreshTable();
		})
		//重置按钮
		$("#reset-btn").bind("click",function(){
			$("#tgId").val("");
		    $('#orgNo').val(user.orgNo);
		    $('#orgName').val(user.orgName);
		    $("#status").selectpicker("val","");
			refreshTable();
		})
//    	setInterval(refreshTable, 10000);
	});
	
	  
	  //页面跳转方法
	   function clickT(url,title){
	    	parent.openNewTab(url,title);
	   }  
	    
	//初始化表格
	var TableInit = function () {
	    var oTableInit = new Object();
	    //初始化Table
	    oTableInit.Init = function () {
	        $("#tgrunList").bootstrapTable('destroy').bootstrapTable({
	            url:'evTg.do?getEvtgRunList',        //请求后台的URL（*）
	            method: 'get',                      //请求方式（*）
	            toolbar: '#toolbar',                //工具按钮用哪个容器
	            striped: false,                      //是否显示行间隔色
	            contentType: "application/x-www-form-urlencoded",
	            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	            pagination: true,                   //是否显示分页（*）
	            sortable: false,                     //是否启用排序
	            sortOrder: "asc",                   //排序方式
	            queryParams: oTableInit.queryParams,//传递参数（*）
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
	            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
	            showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
	            cardView: false,                    //是否显示详细视图
	            detailView: false,                   //是否显示父子表
	            searchOnEnterKey:false,
	            resizable:false,
	            liveDrag : true,
	            undefinedText:"",                      //未定义列的显示文本
	            columns: [
	            [{
	                title: '序号',
	                valign: "middle",
	                width: 50,
	                align: 'center',
	                colspan: 1,
	                rowspan: 2,
	                formatter: function(value, row, index) {
	                    if (row.tgname) {
	                        return index + 1;
	                    } else {
	                        return "&nbsp";
	                    }
	                }
		          },{
		                field: 'tgname',
		                valign: "middle",
		                title: '台区名称',
		                width: 180,
		                align: "center",
		                colspan: 1,
		                rowspan: 2,
		                formatter: function(value, row, index) {
		                    if (row.tgname) {
		                        var url = "personalstake/evTg.do?tgOverview&TG_ID=" + row.tg_id + "&TG_NAME=" + row.tgname;
		                        var title = "有序充电台区概览";
		                        return '<a href="#" onclick="clickT(\'' + url + '\',\'' + title + '\')" style="color:blue">' + value + '</a>';
		                    } else return "";
		                }
		            },{
		                field: 'ec_id',
		                valign: "middle",
		                title: '控制器编号',
		                align: "center",
		                colspan: 1,
		                rowspan: 2,
		                width: 200,
		                visible: false
		            },{
		                field: 'tg_id',
		                valign: "middle",
		                title: '台区编号',
		                align: "center",
		                colspan: 1,
		                rowspan: 2,
		                width: 100,
		                visible: false
		            },{
		                field: 'plim',
		                valign: "middle",
		                title: '限额系数',
		                align: "center",
		                colspan: 1,
		                rowspan: 2,
		                width: 100,
		                visible: false
		            },{
		                field: 'pstart',
		                valign: "middle",
		                title: '启调系数',
		                align: "center",
		                colspan: 1,
		                rowspan: 2,
		                width: 100,
		                visible: false
		            },{
		                field: 'tgcap',
		                valign: "middle",
		                title: '台区容量(kVA)',
		                align: "center",
		                colspan: 1,
		                rowspan: 2,
		                width: 120
		            },
		            {
		                field: 'runp',
		                valign: "middle",
		                title: '功率(kW)',
		                align: "center",
		                colspan: 1,
		                rowspan: 2,
		                width: 100
		            },
		            {
		                valign: "middle",
		                title: '电流(A)',
		                align: "center",
		                colspan: 3,
		                rowspan: 1,
		                width: 300
		            },
		            {
		                valign: "middle",
		                title: '电压(V)',
		                align: "center",
		                colspan: 3,
		                rowspan: 1,
		                width: 300
		            },
		            {
		                field: 'datatime',
		                valign: "middle",
		                title: '采集时间',
		                align: "center",
		                colspan: 1,
		                rowspan: 2,
		                width: 150,
		                formatter: function(value, row, index) {
		                	if(row.datatime){
		                		return changeDateFormat(row.datatime);
		                	}
		                }
		                
		            },
		            {
		                field: 'status',
		                valign: "middle",
		                title: '状态',
		                align: "center",
		                colspan: 1,
		                rowspan: 2,
		                width: 150,
		                formatter: function(value, row, index) {
		                	var time = new Date(row.datatime).getTime();
		                	var now = new Date().getTime();
		                    if ((now - time)/1000<60) {
		                        return "在线";
		                    } else {
		                        return "离线";
		                    }
		                }
		            }], 
		            [{
		                field: 'runia',
		                valign: "middle",
		                title: 'A相',
		                align: "center",
		                width: 100
		            },
		            {
		                field: 'runib',
		                valign: "middle",
		                title: 'B相',
		                align: "center",
		                width: 100
		            },
		            {
		                field: 'runic',
		                valign: "middle",
		                title: 'C相',
		                align: "center",
		                width: 100
		            },
		            {
		                field: 'runua',
		                valign: "middle",
		                title: 'A相',
		                align: "center",
		                width: 100
		            },
		            {
		                field: 'runub',
		                valign: "middle",
		                title: 'B相',
		                align: "center",
		                width: 100
		            },
		            {
		                field: 'runuc',
		                valign: "middle",
		                title: 'C相',
		                align: "center",
		                width: 100
		            },
		            ]
	            ],
	            onClickRow:function(row,$element,field){
	                $element.parent().find("tr").removeClass("click-tr-bg");
	                $element.addClass("click-tr-bg");
	            },

	            onLoadSuccess: function(data){  //加载成功时执行

	                if(data.total==0){
	                    $("#tgrunList").bootstrapTable('load',{rows:[{},{},{},{},{},{},{},{},{},{}],total:0})
	                }
	            },
	            onLoadError: function(){  //加载失败时执行
	                console.info("加载数据失败");
	            }

	        });
	    };
	    //得到查询的参数
	    oTableInit.queryParams = function (params) {
	        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	            limit: params.pageSize,   //页面大小
	            tgId:$("#tgId").val(),
	            tgName:$("#tgName").val(),
	            status:$("#status").val(),
	            offset: params.pageNumber,  //页码//页面大小
	            page: (params.offset / params.limit) + 1,   //页码
	            pageIndex:params.pageNumber,//请求第几页
	            field:'ID,TGNAME,TG_CAP,RUN_P,RUN_Ia,RUN_Ib,RUN_Ic,RUN_Ua,RUN_Ub,RUN_Uc,dataTime'
	        };
	        var params = $("#searchForm").serializeArray();
	        for( x in params ){
	            temp[params[x].name] = params[x].value;
	        }
	        return temp;
	    };
	    return oTableInit;
	}
	function refreshTable(){
		$('#tgrunList').bootstrapTable("refresh");
	}
	
	function initTree(){
	    //传入所需要的id属性名
		treeDataList = getUserOrgTree(user.orgNo);
		treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
		orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
	}