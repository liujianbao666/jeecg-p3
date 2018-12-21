var chart;
$(document).ready(function(){
	var user = getUserinfo();
	$('#orgNo').val(user.orgNo);
	$('#orgName').val(user.orgName);
	initTree();
	
	TableInit();
    $("#search-btn").bind("click",function(){
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
        refreshRunTable();
        
    })
    //重置按钮
    $("#run-reset-btn").bind("click",function(){
    	 $("#cdz").val("");
         $("#stakeName").val("");
         $("#tgNo").val("");
         $('.selectpicker').selectpicker('val', '');
         var user = getUserOrg(); //当前登录用户所属的组织单位
    	 $("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
    	 $("#orgName").val(user.orgName);
         refreshRunTable();
        
    })
})

//刷新表格
function refreshRunTable(){
   var stakeNo= $("#cdz").val();
   var stakeName= $("#stakeName").val();
   var orgNo=  $("#orgNo").val();
   var status = $("#status").val();
    var opt = "";
    $('#manageTable').bootstrapTable('refresh', opt);
}

function TableInit() {
    $("#manageTable").bootstrapTable({
        url: 'evCg.do?list',         //请求后台的URL（*）
        method: 'get',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        contentType: "application/x-www-form-urlencoded",
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams: function (params){//传递参数（*）
            return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                stakeNo:$("#cdz").val(),
                stakeName:$('#stakeName').val(),
                orgNo:$("#orgNo").val(),
                status:$("#status").val()
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
        height : height,   //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "i",                     //每一行的唯一标识，一般为主键列
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        resizable:true,
        undefinedText:"",                      //未定义列的显示文本
        columns: [
           {
            field : 'i',
            halign:"center",
            title: '序号',
            align:"center",
            width:50, 
            formatter: function (value, row, index) {  
         		 if(row.tgname){
          			 return index+1;  
          		 }else{
          			 return "&nbsp";
          		 }
               }
            },
            {
                field: 'tgname',
                halign:"center",
                align:"center",
                title: '台区名称',
                width:200
            },
            {
                field: 'stakeno',
                halign:"center",
                align:"center",
                title: '桩编号',
                width:150,
                visible:false
            },
            {
                field: 'alias',
                halign:"center",
                align:"center",
                title: '桩名称',
                width:200,
                formatter:function(value, row, index){
                    if(row.alias){
                        var url="evCg.do?cgModel&stakeNo="+row.stakeno;
                        var title = "充电桩历史曲线";
                        return '<a href="'+url+'"target="_self" style="color:blue">'+value+'</a>';
                    }else{
                        return '';
                    }
                }
            },
            {
                field: 'power',
                halign:"center",
                title: '额定功率(kW)',
                align:"center",
                width:120
            },
            {
                field: 'run_p',
                halign:"center",
                title: '运行功率(kW)',
                align:"center",
                width:120
            },
            {
                field: 'run_u',
                halign:"center",
                title: '运行电压(V)',
                align:"center",
                width:120
            },
            {
                field: 'run_i',
                halign:"center",
                title: '运行电流(A)',
                align:"center",
                width:120
            },
            {
                field: 'instAddr',
                halign:"center",
                align: "center",
                title: '地址',
                width:200
            },
            {
                field: 'status',
                halign:"center",
                title: '状态',
                align: "center",
                width:100,
                formatter:function(value,row,index){
                	if(value=="1"){
                		return "待机";
                	}else if(value=="2"){
                		return "工作";
                	}else if(value=="3"){
                		return "故障";
                	}else if(value=="4"){
                		return "充满";
                	}
                }
            },
            {
                field: 'data_time',
                halign:"center",
                title: '采集时间',
                align: "center",
                width:150,
                formatter:function(value,row,index){
                	return changeDateFormat(value);
                }
            },
            {
                field:"action",
                halign:"center",
                title:"操作",
                width:200,
                align:"center",
                formatter:function(value,row,index){
                	if(row.stakeno == null){
                		return "";
                	}else{
                		 return "<button class='btn btn-xs btn-info' title='启动' onclick='stopOrBegin(\"" + row.stakeno + "\",1)'><span class='table-show-btn'>启动</span></button>"
                         +"&nbsp;&nbsp;&nbsp;&nbsp; <button class='btn btn-xs btn-info' title='停止' onclick='stopOrBegin(\"" + row.stakeno + "\",2)'><span class='table-show-btn'>停止</span></button>"
                         +"&nbsp;&nbsp;&nbsp;&nbsp; <button class='btn btn-xs btn-info' title='功率调节' onclick='powerAdjust(\"" + row.stakeno + "\")'><span class='table-show-btn'>功率调节</span></button>";
                	}
                }
            }],
            onClickRow:function(row,$element,field){
            	$element.parent().find("tr").removeClass("click-tr-bg");
    			$element.addClass("click-tr-bg");
            },
            onLoadSuccess: function(data){  //加载成功时执行
				
				if(data.pages==0){
					$("#manageTable").bootstrapTable('load',{rows:[{},{},{},{},{},{},{},{},{},{}],total:0});
				}else{
					$("#manageTable").bootstrapTable('load',{rows:data.results,total:data.total});
				}
	      },
	      onLoadError: function(){  //加载失败时执行
	            console.info("加载数据失败");
	      }
    });
}

function selectInit(){
    //台区名称下拉框，模糊查询
    $(".selectpicker").selectpicker({
        noneSelectedText : '请输入台区名称'
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
            $('.selectpicker').selectpicker('val', '');
            $('.selectpicker').selectpicker('refresh');
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
//功率调节
function powerAdjust(stakeNo){
	//弹窗
	var dialog = new BootstrapDialog({
        title: '功率调节',
        size:"size-small",
        type:BootstrapDialog.TYPE_DEFAULT,
        message: function(dialog) {
            var $message = $('<div></div>');
            var pageToLoad = dialog.getData('pageToLoad');
            $message.load(pageToLoad);
            return $message;
        },
        closable: false,
        data: {
        	'pageToLoad': '/SESS/ChargingPileRunController.do?powerAdjustList&stakeNo='+stakeNo
        },
        buttons: [{
            label: '确认',
            cssClass: 'btn-primary',
            action: function(dialogRef){
            	powerModify(dialog);
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

function stopOrBegin(stakeNo, state) {
    var message="";
    if(state==1){
        message="确认将该充电桩启动充电吗？";
    }
    else{
        message="确认将该充电桩停止充电吗？";
    }
	Confirm.confirm({
		message : message
	}).on(function(e) {
		if (!e) {
			return;
		}
		$.ajax({
			type : "post",
			url : "/SESS/ChargingPileRunController.do?updateStatusEvcg",
			dataType : "json",
			data : {
				targetState : state,
				stakeNo : stakeNo
			},
			success : function(data) {
				if (data.success) {
                    refreshRunTable();
					// quickNotify("系统状态更新成功！", "success");
				}
			}
		});
	});
}

function initTree(){
	treeDataList = getUserOrgTree(user.orgNo);
    //传入所需要的id属性名
    treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
    orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}

//页面跳转方法
function clickT(url,title){
    openTab(url,title);
}