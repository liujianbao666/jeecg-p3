
var chart;
var orgNo;
var orpid;
var user;
$(document).ready(function(){
	initTableInfo();
	user = getUserOrg();
	$("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
	$("#orgName").val(user.orgName);
	//getSelectItem(); //显示默认组织机构下的台区
	//新建按钮点击
	$("#add-btn").bind("click",function(){
		if(!orgCheck()){
			return;
		}
		var dialog = new BootstrapDialog({
	        title: '新建策略配置',
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
	            'pageToLoad': 'strategyConfigController.do?add'
	        },
	        buttons: [{
	            label: '保存',
	            cssClass: 'btn-primary',
	            action: function(dialogRef){
	                createNewPhase(dialog);
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
	//重置按鈕
$("#reset-btn").bind("click",function(){
		
		//$('#searchForm').get(0).reset();
		$("#searchForm input").val("");
		$('.selectpicker').selectpicker('val', ''); 
		 $("#orgNo").val(user.orgNo);
		 $("#orgName").val(user.orgName);
		refreshTable();
	})
	//编辑按钮点击
	$("#edit-btn").bind("click",function(){
		orgCheck();
		var selects= $('#priceDg').bootstrapTable('getSelections');  
		if(selects.length == 0 || selects.length > 1){
			quickNotify("请先选择一条数据！", "danger");
			return;
		}
		else{
			var dialog = new BootstrapDialog({
		        title: '修改策略配置',
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
		            'pageToLoad': 'strategyConfigController.do?modify'
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
	
	//删除按钮点击
	$("#remove-btn").bind("click",function(){
		orgCheck();
		var selects= $('#priceDg').bootstrapTable('getSelections');  
		if(selects.length == 0 || selects.length > 1){
			quickNotify("请先选择一条数据！", "danger");
			return;
		}
		else{
			
			var dialog = new BootstrapDialog({
		        title: '删除策略配置确认',
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
		            'pageToLoad': 'strategyConfigController.do?deletePrice'
			        },
			        buttons: [{
			            label: '确认删除？',
			            cssClass: 'btn-primary',
			            action: function(dialogRef){
			                deletePhase(dialog);
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
		
	});
	
	//弹出组织单位
	$('#orgName').bind("click",function(){
		//获取当前登录用户所属的组织单位
		var userOrg =user.orgNo;
		var dialog = new BootstrapDialog({
			title: '组织单位',
	        size:'size-small',
	        type:BootstrapDialog.TYPE_DEFAULT,
	        message: function(dialog) {
	            var $message = $('<div></div>');
	            var pageToLoad = dialog.getData('pageToLoad');
	            $message.load(pageToLoad);
	            return $message;
	        },
	        closable: false,
	        data: {
	        	'pageToLoad': 'strategyConfigController.do?orgNoSelect&userOrg='+userOrg
	        },
	        buttons: [{
	            label: ' 确认',
	            cssClass: 'btn-primary',
	            action: function(dialogRef){
	            	$("#orgNo").val($("#orgNo1").val());
	            	$("#orgName").val($("#orgName1").val());
	            	$("#orgPid1").val($("#orgPid").val());
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
	});
	
	//查询按钮
	$("#search-btn").bind("click",function(){
		orgNo = $("#orgNo").val();
		if(orgNo == ""){
			quickNotify("请选择组织单位", "danger");
			return null;
		}
		
		refreshTable();
	});
	
})


//刷新表格
function refreshTable(){
	var orgNo = $('#orgNo').val();
	var opt = {
		url : "strategyConfigController.do?getTableData&orgNo="+orgNo,
	};
	$('#priceDg').bootstrapTable('refresh', opt); 
 
}



function initTableInfo(tg_id_init){
	$('#priceDg').bootstrapTable({    
	    url:'strategyConfigController.do?getTableData',
	   // striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        clickToSelect:true,
        singleSelect:true,
        
	    columns:[  
	        {checkbox:true},   
	        {field:'i',halign:"center",title:'序号',width:50,align:"center",
           	 formatter: function (value, row, index) {  
                    return index+1;  
                }},
	        {field:'id',visible:false}, //
	        {field:'strategyName',halign:"center",title:'策略原则',width:300,align:'left'},
	        {field:'strategyCode',visible:false},
	        {field:'strategyValue',halign:"center",title:'配置值',width:150,align:'center',
	        	formatter: function(position,row,index){
					if (row.type == "01"){
						if(row.strategyValue == "0"){
							return "关闭";
						}else{
							return "开启";
						}
					} else if(row.type == "02") {
						return row.strategyValue;
					}
					
				}
	        },
	        {field:'unit',halign:"center",title:'单位',width:150,align:'center'},
	        {field:'type',visible:false},
	        {field:'remark',halign:"center",title:'描述',width:550,align:'left'},
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

function mergeCells(data){
	var fieldName = "type"; //合并属性名称
	
	//声明一个map计算相同属性值在data对象出现的次数和
   // var sortMap = {};
	var typeArray = []; //存放数据记录从上到下的类型（无重复）
	var lengthArray = []; //存放每一种类型的记录数，前提是每一种类型的记录存放是不间断的
	var index = []; //存放每一种类型的开始索引
	//type = data[0]["type"];
	var type = data[0]['type'];
	typeArray.push(type);
	
    for(var i = 0 ; i < data.length ; i++){
        for(var prop in data[i]){
            if(prop == fieldName){
                var key = data[i][prop];
                /*if(sortMap.hasOwnProperty(key)){
                    sortMap[key] = sortMap[key] * 1 + 1;
                } else {
                    sortMap[key] = 1;
                }*/
                if(type != key && typeArray.indexOf(key) > -1){
                	typeArray.push(key);
                }
                else{
                	continue;
                }
            } 
        }
    }
    
    for(var i=0;i<typeArray.length;i++){
		count = 0;
		type=typeArray[i];
		for(var j=0;j<data.total;j++){
			if(type == data[j]["type"]){
				count++;
				continue;
			}
		}
		lengthArray.push(count);
		if(i==0){
			index.push(0);
		}
		else{
			index.push(data.total-lengthArray[i]);
		}
	}
    
    for(var i=0; i<lengthArray.length; i++){
		$('#priceDg').bootstrapTable('mergeCells',{
			index: index[i],
			field: 'type',
            halign:"center",
			colspan:1,
			rowspan: lengthArray[i]
		});
	}
    
    
}

function orgCheck(){
	orgNo = $("#orgNo").val();
	orpid = $("#orgPid1").val();
	if(orgNo ==""){
		quickNotify("请选择省公司组织单位");
		$(this).attr("disabled",true);
		return false;
	}else if(orpid != "1"){
		quickNotify("请选择省公司组织单位");
		$(this).attr("disabled",true);
		return false;
	}
	return true;
}
