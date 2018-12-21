$(document).ready(function(){
	tableInit(); //初始化列表
	selectInit();
	$('#query-btn').bind("click",function(){
		refreshTable();
		//tableInit();
	});

	//选择组织单位
	$('#orgName').bind("click",function(){
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
	            'pageToLoad': 'orderController.do?getOrgNo'
	        },
	        buttons: [{
	            label: ' 确认',
	            cssClass: 'btn-primary',
	            action: function(dialogRef){
	            	$("#orgNo").val($("#org_no").val());
	            	$("#orgName").val($("#orgnoName").val());
	            	dialog.close();
	            	getSelectItem();  //后台获取下拉框选项
	            	$('#tgNameSelect').change();
	        		
	            }
	        }, {
	            label: '取消',
	            action: function(dialogItself){
	                dialogItself.close();
	            }
	        }]
	    });
	    dialog.open();
	});
	
	$('#reset-btn').bind('click',function(){
		$("#searchForm input").val("");
		$('#tgNameSelect').selectpicker('val','');
		refreshTable();
	})
})

function refreshTable(){
	var orgNo=$("#orgNo").val();
	var tgId = $("#tgNameSelect option:selected").val();
	 if(tgId==undefined){
	        tgId="";
	    }
    //var tgId=$("#tgNo").val();
    var orderId=$("#orderId").val();
    var chargeId=$("#chargeId").val();
	var opt = {
			url : "queryManageController.do?getCmdInfoList&tgId="+tgId+"&orderId="+orderId+"&chargeId="+chargeId+"&orgNo="+orgNo,
		};
    $('#cmdInfo').bootstrapTable('refreshOptions',{pageNumber:1});
    $('#cmdInfo').bootstrapTable('refresh', opt); 
}


function tableInit(){
	$('#cmdInfo').bootstrapTable({
        url: 'queryManageController.do?getCmdInfoList',         //请求后台的URL（*）
        method: 'get',                      //请求方式（*）
        contentType: "application/x-www-form-urlencoded",
        toolbar: '#toolbar',                //工具按钮用哪个容器
        // striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: function (params){//传递参数（*）
        	return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                limit: params.pageSize,   //页面大小  行数吗？？？
                offset: params.pageNumber,  //页码
             //   pageSize: params.limit,
             //   pageNumber: params.pageNumber,
                orgNo:$("#orgNo").val(),
                tgId:$("#tgNo").val(),
                orderId:$("#orderId").val(),
                chargeId:$("#chargeId").val()
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 20, 50, 100],        //可供选择的每页的行数（*）
        strictSearch: true,
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
//        height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "id",                     //每一行的唯一标识，一般为主键列
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        columns: [{  
        	field:'',title:'序号',halign:"center",width:'5%',
        	formatter: function (value, row, index) {  
                return index+1;  
            }
        },{
        	field:'chargeId',halign:"center",title:'充电桩编号'
        }, {
        	field:'orderId',halign:"center",title:'订单编号',sortable:true
        }, {
        	field:'cmdType',halign:"center",title:'指令类型',align:'center',
        	formatter: function(value){
				if (value=='01'){
					return "充电";
				} else if(value == '02') {
					return "停电";
				}else if(value == '0301'){
					return "功率绝对值";
				}else if(value == '0302'){
					return "功率占空比";
				}
		}
        }, {
        	field:'cmdValue',halign:"center",title:'指令值'},
		//{field:'cmd_reasion',title:'控制原因',align:'center',width:100,align:'center'},
		{field:'cmdState',halign:"center",title:'状态',
        	formatter: function(value){
				if (value== 100){
					return "下发成功";
				} else if(value == 101) {
					return "下发失败";
				}else if(value == 200){
					return "执行成功";
				}else if(value == 104){
					return "执行失败";
				}
		}},
		{field:'createTime',halign:"center",title:'发送日期',align:'center'}
        ],
		    onClickRow:function(row,$element,field){
			    	$element.parent().find("tr").removeClass("click-tr-bg");
			    	$element.addClass("click-tr-bg");
			    }
    });
	
 	
}
//获取指令信息列表
function getCmdList(){
	$('#cmdInfo').bootstrapTable("refresh");
}

function selectInit(){
	//台区名称下拉框，模糊查询
	 $(".selectpicker").selectpicker({  
         noneSelectedText : '请输入台区名称'  
     });  

     $(window).on('load', function() {  
         $('.selectpicker').selectpicker('val', '');  
         $('.selectpicker').selectpicker('refresh');  
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
        dataType : 'json',  
        async:false,
        success : function(datas) {//返回list数据并循环获取  
        	 $("#tgNameSelect").html(""); //清空select下拉框
            var select = $("#tgNameSelect");  
            for (var i = 0; i < datas.length; i++) {  
                select.append("<option value='"+datas[i].tgId+"'>"  
                        + datas[i].tgName + "</option>");  
            }  
            $('.selectpicker').selectpicker('val', '');  
            $('.selectpicker').selectpicker('refresh');  
        }  
    });  
}

function selectOnchang(obj){
	var tgNo = obj.options[obj.selectedIndex].value;
	var tgName = obj.options[obj.selectedIndex].text;
	if(tgNo != ""){
		$('#tgNo').val(tgNo);
		$('#tgName').val(tgName);
	}
}