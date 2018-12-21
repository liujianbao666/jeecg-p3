
var chart;

$(document).ready(function(){
	    
	
	
	var user = getUserinfo();
	$('#orgNo').val(user.orgNo);
	$('#orgName').val(user.orgName);
	
	initTree();


 
    tableInit();
    refreshRunTable();
    $("#search-btn").bind("click",function(){
    	  	
    	
    	
        refreshRunTable();
    })
    //重置按钮
    $("#run-reset-btn").bind("click",function(){
  // 	 var user = getUserOrg();
   	 $("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
	 $("#orgName").val(user.orgName);
       
        $('#cdz').val("");
        $('#stakeName').val("");
        
        $('#shareStatus').selectpicker('val','');
        refreshRunTable();
    })
   
})






function tableInit(){
	$("#pileTable").bootstrapTable({
        url: 'chargingPileShareController.do?getAllStakeInfoForOpenShare',         //请求后台的URL（*）
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
                cdz: $("#cdz").val(),
                stakeName: $("#stakeName").val(),
                shareStatus: $("#shareStatus").val()
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
        resizable:true,                    //可拖拽列宽
        liveDrag : true,
        uniqueId: "i",                     //每一行的唯一标识，一般为主键列
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false, 
        undefinedText:"",                      //未定义列的显示文本
        columns:[
                {field:'i',halign:"center",title:'序号',width:50,align:"center",
                	 formatter: function (value, row, index) {  
                		 if(row.stakeno1){
                			 return index+1;  
                		 }else{
                			 return "&nbsp";
                		 }
                         
                     }},
                {field:'stakeno1',halign:"center",title:'充电桩编号',width:150,align:"right"},
                {field:'alias',halign:"center",title:'充电桩名称',width:200,align:"left"},
                {field:'inst_addr',halign:"center",title:'充电桩地址',width:300,align:"left"},
                {field:'tg_name',halign:"center",title:'台区名称',width:100,align:"left"},
                {field:'sharestatus',halign:"center",title:'共享状态',width:150,align:"left",
                	formatter:function(value,row,index){
                  if(row.tg_id){
                    if(row.chargingfee){
                    	
                    	if(row.checkstatus=="0"){
                    		
                    		return "待审核";
                    	}else if(row.checkstatus=="1"){
                    		
                    		 return "已分享";
                    	}else if(row.checkstatus=="2"){
                    		return "审核未通过";
                    	} 
                       
                    }else{
                        return "未分享";

                    }
                  }else{
                	  return "";
                  }

                }},
                {field:'#',halign:"center",title:'操作',width:150,align:"center",
                    formatter:function(value,row,index){
                        if(row.tg_id){
                        if(row.chargingfee){
                        	
                        	 if(row.checkstatus=="2"){  //审核未通过  重新提交开通共享申请
                        		 
                        		    return "<button class='btn btn-xs btn-success' style='margin-right:5px' title='重新申请开通共享' onclick='openShare(\"" + row.stakeno1 + "\")'><span class='glyphicon glyphicon glyphicon-share-alt'></span></button>"+
                        		    "<button class='btn btn-xs btn-fail' style='margin-right:5px' title='查看审核反馈信息' onclick='showFeedBackInfo(\"" + row.stakeno1 + "\")'><span class='glyphicon glyphicon glyphicon-share-alt'></span></button>";

                        		                             		  
                         	} 
                         //   return "<button class='btn btn-xs btn-success' style='margin-right:5px' title='审核' onclick='approval(\"" + row.stankno + "\")'><span class='glyphicon glyphicon-wrench'></span></button>";
                       
                        }else{
                             return "<button class='btn btn-xs btn-success' style='margin-right:5px' title='申请开通共享' onclick='openShare(\"" + row.stakeno1 + "\")'><span class='glyphicon glyphicon glyphicon-share-alt'></span></button>";
                             
                        }
                        }else{
                        	
                        	return "";
                        }

                    }}
			    ],
			    onClickRow:function(row,$element,field){
			    	$element.parent().find("tr").removeClass("click-tr-bg");
			    	$element.addClass("click-tr-bg");
			    }
//        		,
//			    responseHandler:function(res){
//	                //在ajax获取到数据，渲染表格之前，修改数据源
//	                var nres = [];
//	                nres.push({total:res.total,rows:res.list});
//	                return nres[0];
//	            }
        		,
			    onLoadSuccess: function(data){  //加载成功时执行
	  				
	  				if(data.total==0){
	  					
	  					$("#pileTable").bootstrapTable('load',{rows:[{},{},{},{},{},{},{},{},{},{}],total:0})
	  				}
	  				
		                console.info("加载成功");
		          },
		          onLoadError: function(){  //加载失败时执行
		                console.info("加载数据失败");
		          }
    });
}

//页面跳转方法
function clickT(url,title){
 	parent.openNewTab(url,title);
}  

//刷新表格
function refreshRunTable(){
    $('#pileTable').bootstrapTable('refresh');
}

function initTree(){
    //传入所需要的id属性名
	treeDataList = getUserOrgTree(user.orgNo);
	treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
	orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}

//跳转到共享审核页面
function openShare(stakeNo){
    var dialog = new BootstrapDialog({
        title: '开通共享',
        type:BootstrapDialog.TYPE_DEFAULT,
        message: function(dialog) {
            var $message = $('<div></div>');
            var pageToLoad = dialog.getData('pageToLoad');
            $message.load(pageToLoad);
            return $message;
        },
        closable: false,
        data: {
            'pageToLoad': 'chargingPileShareController.do?openSharePage&stakeNo=' + stakeNo
        },
        buttons: [{
            label: '确定',
            cssClass: 'btn-primary',
            action: function(dialogRef){
            	openShareApply(dialog);
            }
        }, {
            label: '取消',
            cssClass: 'btn-default',
            action: function(dialogItself){
                dialogItself.close();
            }
        }]
    });
    dialog.open();
}

//审核未通过时查看审核反馈信息
function showFeedBackInfo(stakeNo){
	
    var dialog = new BootstrapDialog({
        title: '审核反馈信息',
        type:BootstrapDialog.TYPE_DEFAULT,
        message: function(dialog) {
            var $message = $('<div></div>');
            var pageToLoad = dialog.getData('pageToLoad');
            $message.load(pageToLoad);
            return $message;
        },
        closable: false,
        data: {
            'pageToLoad': 'chargingPileShareController.do?approvalFeedBackInfoPage&stakeNo=' + stakeNo
        },
        buttons: [{
            label: '确定',
            cssClass: 'btn-primary',
            action: function(dialogItself){
            	dialogItself.close();
            }
        }]
    });
    dialog.open();
}
