


var chart;
var user;
var initOrg;
$(document).ready(function(){
	
	initOrg = $("#initOrg").val();
	
	
	var user = getUserinfo();
	$('#orgNo').val(user.orgNo);
	$('#orgName').val(user.orgName);
 
	 initTree();
    if(initOrg!=""){
    	 $('#orgNo').val(initOrg);
    	 initTree();
    	$('#orgName').val($.fn.zTree.getZTreeObj("treeDemo").getSelectedNodes()[0].name);
    	
    }else{
    	
    	 $('#orgNo').val("01");
    }
     
    
    tableInit();
    refreshRunTable();
    $("#search-btn").bind("click",function(){
    	
    	var orgName = $("#orgName").val();
    	
    
    	
        refreshRunTable();
    })
    //重置按钮
    $("#run-reset-btn").bind("click",function(){
	 $("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
	 $("#orgName").val(user.orgName);
     
        refreshRunTable();
    })
   
})











function tableInit(){
	$("#multiElePriceModelTable").bootstrapTable({
        url: 'electricityPriceModelController.do?getMultiElePriceModelByOrgNo',         //请求后台的URL（*）
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
        		pageSize : params.pageSize,
				pageNo : params.pageNumber,
               orgNo: ($("#orgNo").val()=="1"?"01":$("#orgNo").val()),   
              
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        strictSearch: true,
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        clickToSelect: false,                //是否启用点击选中行
        minimumCountColumns: 2,             //最少允许的列数
        height : $(window).height()-400,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        resizable:true,                    //可拖拽列宽
        liveDrag : true,
        uniqueId: "i",                     //每一行的唯一标识，一般为主键列
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false, 
        undefinedText:"",                      //未定义列的显示文本
        columns:[
                {field:'i',halign:"center",title:'序号',width:50,align:"center",
                	 formatter: function (value, row, index) {  
                		 if(row.month_begin){
                			 return index+1;  
                		 }else{
                			 return "&nbsp";
                		 }
                         
                     }},
                {field:'departname',halign:"center",title:'应用范围',width:150,align:"left"},
                {field:'montn',halign:"center",title:'月份',width:200,align:"right", 
                	formatter: function (value, row, index) {  
                		if(row.month_begin){
                			return row.month_begin+"-"+row.month_end;
                		}else{
                			return " ";
                		}
                		
                	}
           		},
                {field:'step',halign:"center",title:'电量等级',width:300,align:"right"},
                {field:'power',halign:"center",title:'电量范围',width:100,align:"right", 
                	formatter: function (value, row, index) {  
                	
                		if(row.power_begin){
                			
                			if(parseInt(row.power_end)>90000000){
                				row.power_end = "不封顶";
                			}
                			
                			
                			return row.power_begin+" - "+row.power_end;
                		}else{
                			return " ";
                		}
                	}},
                {field:'price',halign:"center",title:'电价',width:200,align:"right"},
                {field:'year',halign:"center",title:'年份',width:150,align:"right"}
			    ],
			    onClickRow:function(row,$element,field){
			    	$element.parent().find("tr").removeClass("click-tr-bg");
			    	$element.addClass("click-tr-bg");
			    },
			    onLoadSuccess: function(data){  //加载成功时执行
	  				
	  				if(data.total==0){
	  					
	  					$("#multiElePriceModelTable").bootstrapTable('load',{rows:[{},{},{},{},{},{},{},{},{},{}],total:0})
	  				}
	  				
		                console.info("加载成功");
		          },
		          onLoadError: function(){  //加载失败时执行
		                console.info("加载数据失败");
		          }
    });
	
	//分时电价
	$("#timeElePriceModelTable").bootstrapTable({
        url: 'electricityPriceModelController.do?getTimeElePriceModelByOrgNo',         //请求后台的URL（*）
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
        		pageSize : params.pageSize,
				pageNo : params.pageNumber,
               orgNo: ($("#orgNo").val()=="1"?"01":$("#orgNo").val()),   
              
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        strictSearch: true,
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        clickToSelect: false,                //是否启用点击选中行
        minimumCountColumns: 2,             //最少允许的列数
        height : $(window).height()-400,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        resizable:true,                    //可拖拽列宽
        liveDrag : true,
        uniqueId: "i",                     //每一行的唯一标识，一般为主键列
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false, 
        undefinedText:"",                      //未定义列的显示文本
        columns:[
                {field:'i',halign:"center",title:'序号',width:50,align:"center",
                	 formatter: function (value, row, index) {  
                		 if(row.price){
                			 return index+1;  
                		 }else{
                			 return "&nbsp";
                		 }
                         
                     }},
                {field:'departname',halign:"center",title:'应用范围',width:150,align:"left"},
                {field:'montn',halign:"center",title:'月份',width:200,align:"right", 
                	formatter: function (value, row, index) { 
                		if(row.month_begin){
                			return row.month_begin+"-"+row.month_end;
                		}else{
                			return " ";
                		}
                		
                	}
           		},
                {field:'step',halign:"center",title:'时段类型',width:300,align:"left", 
                	formatter: function (value, row, index) {  
                		switch(row.step){
                		case "1" :return "尖"; break;
                		case "2" :return "峰"; break;
                		case "3" :return "平"; break;
                		case "4" :return "谷"; break;
                		default :return " "; break;
                		}
                	}},
                {field:'time',halign:"center",title:'时间范围',width:100,align:"right", 
                	formatter: function (value, row, index) {  
                	
                		if(row.time_begin){
                			return row.time_begin+"-"+row.time_end;
                		}else{
                			return " ";
                		}
                	}},
                {field:'price',halign:"center",title:'电价',width:200,align:"right"},
                {field:'year',halign:"center",title:'年份',width:150,align:"right"}
			    ],
			    onClickRow:function(row,$element,field){
			    	$element.parent().find("tr").removeClass("click-tr-bg");
			    	$element.addClass("click-tr-bg");
			    },
			    onLoadSuccess: function(data){  //加载成功时执行
	  				
	  				if(data.total==0){
	  					
	  					$("#timeElePriceModelTable").bootstrapTable('load',{rows:[{},{},{},{},{},{},{},{},{},{}],total:0})
	  				}
	  				
		                console.info("加载成功");
		          },
		          onLoadError: function(){  //加载失败时执行
		                console.info("加载数据失败");
		          }
    });
}

function selectOnchang(obj){
    var tgNo = $("#tgNameSelect option:selected").val();
    $('#tgNo').val(tgNo);
    if(tgNo != ""){
        doSearch(tgNo);
    }
}

function doSearch(tgNo){
    refreshRunTable();
}

//刷新表格
function refreshRunTable(){
    $('#multiElePriceModelTable').bootstrapTable('refresh');
    $('#timeElePriceModelTable').bootstrapTable('refresh');
    
}

function initTree(){
    //传入所需要的id属性名
	treeDataList = getUserOrgTree(user.orgNo);
      treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
      orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}