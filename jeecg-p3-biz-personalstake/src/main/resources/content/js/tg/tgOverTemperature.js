var tgId,oTable;
var user;
$(document).ready(function(){

	// 选择开始时间和结束时间
	jeDate("#startTime",{
		format: "YYYY-MM-DD hh:mm"
	});
	jeDate("#endTime",{
		format: "YYYY-MM-DD  hh:mm"
	});
	
	selectInit();
		
	
	
	//1.初始化Table
	user = getUserOrg();
	$("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
	$("#orgName").val(user.orgName);
	getSelectItem(); //显示默认组织机构下的台区
	oTable = new TableInit();
	oTable.Init();
	
		
	// 选择组织机构
	orgNoChoose();
	
});	
	

  //初始化表格
   var TableInit = function () {
   var oTableInit = new Object();
   //初始化Table
   oTableInit.Init = function () {
	$("#abnormalAlarmTable").bootstrapTable('destroy');
	$("#abnormalAlarmTable").bootstrapTable({
        url: 'alarmController.do?overTemperature',         //请求后台的URL（*）
        method: 'get',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        contentType: "application/x-www-form-urlencoded",
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: true,                     //是否启用排序
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
        height : $(window).height()-200,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "i",                     //每一行的唯一标识，一般为主键列
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        resizable:true,
      //  liveDrag : true,
        undefinedText:"",                      //未定义列的显示文本
        columns: [
                  {title:'序号',halign:"center",width:"5%",align:'center',
                	  formatter: function (value, row, index) {  
                  		 if(row.TG_NAME){
                  			 return index+1;  
                  		 }else{
                  			 return "&nbsp";
                  		 }
                       }
        } ,{ field: 'TG_NAME',title: '台区名称',halign:"center",align:"left",valign: 'middle',width:150,sortable:true
        },{ field: 'P_Limit', title: '台区限定功率',halign:"center",align:'right',width:150,valign: 'middle',sortable:true
        }, { field: 'COLL_DATE',title: '时段',halign:"center", align:'right',width:150,valign: 'middle',sortable:true
        }, {field: 'Power',halign:"center", title: '台区实际功率', align:'right',width:150,valign: 'middle',sortable:true
        }],
        onClickRow:function(row,$element,field){
        	$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
        },
        onLoadSuccess: function(data){  //加载成功时执行
				
				if(data.total==0){
					
					$("#abnormalAlarmTable").bootstrapTable('load',{rows:[{},{},{},{},{},{},{},{},{},{}],total:0})
				}
				
                console.info("加载成功");
          },
          onLoadError: function(){  //加载失败时执行
                console.info("加载数据失败");
          }
    })
    
   }
   //得到查询的参数
   oTableInit.queryParams = function (params) {
       var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
       	limit: params.pageSize,   //页面大小
           offset: params.pageNumber,  //页码//页面大小
           page: (params.offset / params.limit) + 1,   //页码
           pageIndex:params.pageNumber,//请求第几页
           tgNo:$('#tgNo').val(),
           startTime:$("#startTime").val(),
           endTime:$("#endTime").val(),
           field:'id,TG_NAME,P_Limit,COLL_DATE,Power'
       };
       var params = $("#searchForm").serializeArray();  
       for( x in params ){  
           temp[params[x].name] = params[x].value;  
       }  
       return temp;
   };
   return oTableInit; 

  }
   
	 //查询按钮
	function jeecgDemoSearch(){
		refreshTable();
	}
	
	//重置按钮
	function jeecgDemoRest(){
		$("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
		$("#orgName").val(user.orgName);
	    $("#tgNo").val("");
	    $('#tgNameSelect').selectpicker('val', '');//清空台区下拉框
	     $("#startTime").val(""),
	     $("#endTime").val(""),
	     refreshTable();
	    // oTable.Init();
	}	
	
    //刷新表格
function refreshTable(){
	//paramNotNull() ;
		var orgNo = $("#orgNo").val();
		var startTime=$("#startTime").val();
		var endTime=$("#endTime").val();
		var tgNo = $("#tgNameSelect option:selected").val();
		if(tgNo == undefined){
			tgNo = "";
		}
	    var opt = {
	        url : "alarmController.do?overTemperature&orgNo="+orgNo+"&tgId="+tgNo+"&startTime="+startTime+"&endTime="+endTime,
	    };
	    $('#abnormalAlarmTable').bootstrapTable("refresh",opt);
	}	
	
 
function selectInit(){
    //台区名称下拉框，模糊查询
    $("#tgNameSelect").selectpicker({
        noneSelectedText : '请输入台区名称'
    });
    $("#breakdown").selectpicker({
        noneSelectedText : '是否故障'
    });

}

function getSelectItem(){
    var orgNo = $('#orgNo').val();
    if(orgNo == ""){
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

    //下拉数据加载
    $.ajax({
        type : 'get',
        url : "monitorController.do?getTgName&orgNo="+orgNo,
        async:false,
        dataType : 'json',
        success : function(datas) {//返回list数据并循环获取
            $("#tgNameSelect").html(""); //清空select下拉框
            var select = $("#tgNameSelect");
            for (var i = 0; i < datas.length; i++) {
                select.append("<option value='"+datas[i].tgId+"'>"
                    + datas[i].tgName + "</option>");
            }
            $('#tgNameSelect').selectpicker('val', '');
            $('#tgNameSelect').selectpicker('refresh');
        }
    });
}

function selectOnchang(obj){
    var tgNo = $("#tgNameSelect option:selected").val();
    $('#tgNo').val(tgNo);
}

// 弹出组织机构单位
function orgNoChoose(){
	//弹出组织单位
    $("#orgName").bind("click",function(){
    	//获取当前登录用户所属的组织单位
		var userOrg =user.orgNo;
    	var dialog = new BootstrapDialog({
            title: '组织单位',
            //size:'size-small',
            type:BootstrapDialog.TYPE_DEFAULT,
            message: function(dialog) {
                var $message = $('<div></div>');
                var pageToLoad = dialog.getData('pageToLoad');
                $message.load(pageToLoad);
                return $message;
            },
            closable: false,
            data: {
            	'pageToLoad': 'orderController.do?getUserOrg&userOrg='+userOrg
            },
            buttons: [{
                label: ' 确认',
                cssClass: 'btn-primary',
                action: function(dialogRef){
                  
                	$("#orgNo").val($("#org_no").val());
                    $("#orgName").val($("#orgnoName").val());
                    getSelectItem();
                    $("#tgNameSelect").change();
                    dialogRef.close();
                }
            }, {
                label: '取消',
                action: function(dialogItself){
                    dialogItself.close();
                }
            }]
        });
        dialog.open();
    })
}

//判断为空
function paramNotNull() {
	
	// 组织机构和台区非空验证
	var orgNos =  $("#orgNo").val();
	var tgNos = $("#tgNameSelect").selectpicker('val');
	if(orgNos == "" || orgNos == null){
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
	if(tgNos == "" || tgNos == null){
		$.notify({
			message : "请选择台区！"
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
	// 时间的验证
	var startTime = $('#startTime').val();
	var endTime = $('#endTime').val();
	if((startTime != undefined && startTime != null && startTime != "")
			&& endTime != undefined && endTime != null && endTime != "" ){
		if(startTime > endTime){
			$.notify({
				message : "开始时间不能大于结束时间！"
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
}
