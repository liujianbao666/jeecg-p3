
$(document).ready(function(){
	tableInit();
})

function tableInit(){
	$('#equipInfos').bootstrapTable({
		url:"queryManageController.do?getEquipInfo",
		method: 'get',                      //请求方式（*）
        contentType: "application/x-www-form-urlencoded",
        toolbar: '#toolbar',                //工具按钮用哪个容器
        // striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: function (params){		//传递参数（*）
        	return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                limit: params.pageSize,   //页面大小
                offset: params.pageNumber,  //页码
                equipname:$("#equipname").val(),
                equipcode:$("#equipcode").val(),
                equiparea:$("#position").selectpicker("val"),
                equipstate:$("#state").selectpicker("val")
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
        columns:[{
        	checkbox: true,
                 
	    }, {
	        field: 'id',
	        title: 'ID',
	       
	    }, {
	        field: 'equipName',
	        title: '设备名称'
	    }, {
	        field: 'equipCode',
	        title: '设备编号',
	        align:"right"
	    }, {
            field: 'position',
            title: '所属区域',
            formatter:function(position,row,index){
            	if(position == "01"){
            		return "I区";
            	}else if(position == "03"){
            		return "III区";
            	}
            	return position;
            }
        }, {
            field: 'state',
            title: '状态',
            formatter:function(value,row,index){
            	if(value == "1"){
            		return "启用";
            	}else if(value == "0"){
            		return "停用";
            	}
            	return value;
            }
        },{
            field: 'remark',
            title: '备注'
        }],
        onClickRow:function(row,$element,field){
        	$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
        }
	})
}