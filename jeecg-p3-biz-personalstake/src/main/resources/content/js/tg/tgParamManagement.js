$(document).ready(function(){
	var user = getUserinfo();
	$('#orgNo').val(user.orgNo);
	$('#orgName').val(user.orgName);
	
	initTree();
	
    var oTable = new TableInit();
    oTable.Init();

    //判断是否选中表格中的数据，选中后可编辑或删除
    $('#jeecgDemoList').on('check.bs.table uncheck.bs.table load-success.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table', function () {
        $('#btn_delete').prop('disabled', ! $('#tableid').bootstrapTable('getSelections').length);
        $('#btn_edit').prop('disabled', $('#tableid').bootstrapTable('getSelections').length!=1);
    });
    //2.初始化Button的点击事件
	//查询按钮
	$("#btn_query").bind("click",function(){
		refreshTable();
	})
	//重置按钮
	$("#reset-btn").bind("click",function(){
		$("#searchForm input").val("");
		$('.selectpicker').selectpicker('val', ''); 
    	$("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
    	$("#orgName").val(user.orgName);
		refreshTable();
	})
});


function intToTwoStr(num){
	if(num < 10){
		return "0" + num;
	}
	return num;
}
//初始化表格
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $("#tableid").bootstrapTable({
            url: 'evTg.do?getTgParamTableList',         //请求后台的URL（*）
            method: 'get',                      //请求方式（*）
            toolbar: '#toolbar',                //工具按钮用哪个容器
            striped: true,                      //是否显示行间隔色
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
            height : $(window).height()-130,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
            showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,                    //是否显示详细视图
            detailView: false,                   //是否显示父子表
            searchOnEnterKey:false,
            resizable:true,
            liveDrag : true,
            undefinedText:"",                      //未定义列的显示文本
            columns: [{
              checkbox: true,
              
          }, {
              field: 'id',
              title: '序号',
              halign:'center',
              width:50,
              align:"center",
              valign: 'middle',sortable:true
          },{
              field: 'tgId',
              halign:"center",
              title: '台区编码',
              align:"center",
              valign: 'middle',sortable:true
          },{
              field: 'tgName',
              title: '台区名称',
              halign:"center",
              align:"center",
              valign: 'middle',sortable:true
          },{
              field: 'tgCap',
              halign:"center",
              title: '台区容量(kVA)',
              align:"center",
              valign: 'middle',sortable:true
          },{
              field: 'economicIndex',
              halign:"center",
              title: '经济运行范围（起）',
              align:"center",
              valign: 'middle',sortable:true
          },{
              field: 'economicEnd',
              halign:"center",
              title: '经济运行范围（止）',
              align:"center",
              valign: 'middle',sortable:true
          },{   
              field: 'plim',
              halign:"center",
              title: '台区限额系数',
              align:"center",
              valign: 'middle',sortable:true
          },{
              field: 'pstart',
              halign:"center",
              title: '台区启调系数',
              align:"center",
              valign: 'middle',sortable:true
          }
//          ,
//          {
//              field: 'strategy',
//              halign:"center",
//              title: '计划策略',
//              align:"center",
//              valign: 'middle',sortable:true,
//              formatter: function (value, row, index) {  
//         		 if(value=="1"){
//         			 return "电价最优";  
//         		 }else{
//         			 return "电网最优";
//         		 } 
//              }
//          }
          ],
            onClickRow:function(row,$element,field){
                $element.parent().find("tr").removeClass("click-tr-bg");
                $element.addClass("click-tr-bg");
            },
            onLoadSuccess: function(data){  //加载成功时执行

                if(data.total==0){

                    $("#tableid").bootstrapTable('load',{rows:[{},{},{},{},{},{},{},{},{},{}],total:0})
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
                 offset: params.pageNumber,  //页码
                 orgNo:$("#orgNo").val(),
        };
        console.log(temp);
        var params = $("#searchForm").serializeArray();
        for( x in params ){
            temp[params[x].name] = params[x].value;
        }
        return temp;
    };
    return oTableInit;
}


$(document).ready(function(){
//编辑按钮点击
$("#edit-btn").bind("click",function(){
	var selects= $('#tableid').bootstrapTable('getSelections');  
	if(selects.length == 0 || selects.length > 1){
		quickNotify("请先选择一条数据！", "danger");
		return;
	}
	else{
		
		var dialog = new BootstrapDialog({
	        title: '修改台区运行信息',
	        //size:"size-small",
	        type:BootstrapDialog.TYPE_DEFAULT,
	        message: function(dialog) {
	            var $message = $('<div></div>');
	            var pageToLoad = dialog.getData('pageToLoad');
	            $message.load(pageToLoad);
	            return $message;
	        },
	        closable: false,
	        data: {
	            'pageToLoad': '/SESS/fileManagementController.do?editManagement'
	        },
	        buttons: [{
	            label: '保存',
	            cssClass: 'btn-primary',
	            action: function(dialogRef){
	                editPhase(dialog);
	            }
	        }, {
	            label: '取消',
	            action: function(dialogItself){
	                dialogItself.close();
	            }
	        }]
	    });
	    dialog.open();
	}
	
})

})

//模糊查询台区名称
function selectInit(){
	//台区名称下拉框，模糊查询
	 $(".selectpicker").selectpicker({  
         noneSelectedText : '请输入台区名称'  
     });  

}

//修改之后刷新表格数据
function refreshTable(){
	$('#tableid').bootstrapTable("refresh");
}

//根据组织机构查询名称
function selectOnchang(obj){
	var tgNo = obj.options[obj.selectedIndex].value;
	var tgName = obj.options[obj.selectedIndex].text;
	$('#tgNo').val(tgNo);
	$('#tgName').val(tgName);
	
}	


function initTree(){
    //传入所需要的id属性名
	treeDataList = getUserOrgTree(user.orgNo);
    treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
    orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}
