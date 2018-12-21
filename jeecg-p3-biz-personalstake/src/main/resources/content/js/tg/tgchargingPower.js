var user ;
var chart;
$(document).ready(function(){
	
	 user = getUserinfo();
	$('#orgNo').val(user.orgNo);
	$('#orgName').val(user.orgName);
    

	initTree();
    TableInit();

    jeDate("#start_time",{
        format: "YYYY-MM-DD"
    });
    jeDate("#end_time",{
        format: "YYYY-MM-DD"
    });
    $("#search-btn").bind("click",function(){
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
//    	if (tgNo == null || tgNo == "") {
//    		$.notify({
//    			message : "请选择台区！"
//    		}, {
//    			type : "warning",
//    			z_index : 9999,
//    			placement : {
//    				from : "bottom",
//    				align : "right"
//    			},
//    			delay : 2000
//    		});
//    		return false;
//    	}
		var startTime = $('#start_time').val();
		var endTime = $('#end_time').val();
		if((endTime != undefined && endTime != null && endTime != "") 
				|| (startTime != undefined && startTime != null && startTime != "")) {
			if (startTime == undefined || startTime == null || startTime == "") {
				$.notify({
					message : "请选择开始时间！"
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
			} else if (endTime == undefined || endTime == null || endTime == "") {
				$.notify({
					message : "请选择结束时间！"
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
			} else if (startTime > endTime) {
				$.notify({
					message : "结束时间不能小于开始时间！"
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
        refreshRunTable();
    })
    //重置按钮
    $("#run-reset-btn").bind("click",function(){
    	$("#orgNo").val(user.orgNo);
		$("#orgName").val(user.orgName);
        $("#start_time").val("");
        $("#end_time").val("");
        $("#tgNo").val("");
        $('.selectpicker').selectpicker('val', '');
        refreshRunTable();
    })

})

//刷新表格
function refreshRunTable(){
  
    $('#charging').bootstrapTable('refresh');
}

function TableInit() {
    $("#charging").bootstrapTable({
        url: 'evTg.do?getTgUserEleList',         //请求后台的URL（*）
        method: 'get',                      //请求方式（*）
        contentType: "application/x-www-form-urlencoded",
        // striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        queryParams: function (params){//传递参数（*）
            return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                limit: params.pageSize,   //页面大小
                offset: params.pageNumber,  //页码
                orgNo:$("#orgNo").val(),
                tgNo:$("#tgNo").val(),
                startTime:$("#start_time").val(),
                endTime:$("#end_time").val()
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 20, 50, 100],        //可供选择的每页的行数（*）
        strictSearch: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        clickToSelect: true,                //是否启用点击选中行
        height: $(window).height()-160,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "tgId",                     //每一行的唯一标识，一般为主键列
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        singleSelect:true,
        undefinedText:"",                      //未定义列的显示文本
        columns: [
            {
            field: 'i',
            title: '序号',
            halign:"center",
            align:"center",
            width:'5%',
            formatter: function (value, row, index) {  
        		 if(row.tgName){
         			 return index+1;  
         		 }else{
         			 return "&nbsp";
         		 }
              }
            },
            {
                field: 'tgName',
                halign:"center",
                title: '台区名称'
            },
            {
                field: 'UserPower',
                halign:"center",
                title: '已用电量(kWh)',align:'right',
                formatter:function(value,row,index){
                    if(value != null && value != ""){
                        return "<span style='width:100px;display:inline-block' title='" +
                            value + "'>" + value + "</span>";
                    }
                    return value;
                },
            },
            {
                field: 'chargeAmount',
                halign:"center",
                title: '总充电量(kWh)',align:'right',
                formatter:function(value,row,index){
                    if(value != null && value != ""){
                        return "<span style='width:100px;display:inline-block' title='" +
                            value + "'>" + value + "</span>";
                    }
                    return value;
                },
            },
            {
                field: 'normalChargeAmount',
                halign:"center",
                title: '正常充电量(kWh)',align:'right',
                formatter:function(value,row,index){
                    if(value != null && value != ""){
                        return "<span style='width:100px;display:inline-block' title='" +
                            value + "'>" + value + "</span>";
                    }
                    return value;
                },
            },
            {
                field: 'orderChargeAmount',
                halign:"center",
                title: '有序充电量(kWh)',align:'right',
                formatter:function(value,row,index){
                    if(value != null && value != ""){
                        return "<span style='width:100px;display:inline-block' title='" +
                            value + "'>" + value + "</span>";
                    }
                    return value;
                },
            }
            ],
  			    onClickRow:function(row,$element,field){
  			    	$element.parent().find("tr").removeClass("click-tr-bg");
  			    	$element.addClass("click-tr-bg");
  			    },
  			  onLoadSuccess: function(data){  //加载成功时执行
  				if(data.total==0){
  					
  					$("#charging").bootstrapTable('load',{rows:[{},{},{},{},{},{},{},{},{},{}],total:0});
  				}
  				
  	            console.info("加载成功");
  	      },
  	          onLoadError: function(){  //加载失败时执行
  	            console.info("加载数据失败");
  	      }
    });

}



function doSearch(tgNo){
    refreshRunTable();
}
/**
 * 合并单元格
 *
 * @param data
 *            原始数据（在服务端完成排序）
 * @param fieldName
 *            合并参照的属性名称
 * @param colspan
 *            合并开始列
 * @param target
 *            目标表格对象
 * @param fieldList
 *            要合并的字段集合
 */
function mergeCells(data,fieldName,colspan,target,fieldList){
// 声明一个map计算相同属性值在data对象出现的次数和
    var sortMap = {};
    for(var i = 0 ; i < data.length ; i++){
        for(var prop in data[i]){
            //例如people.unit.name
                var fieldArr=fieldName.split(".");
                getCount(data[i],prop,fieldArr,0,sortMap);
        }
    }
    var index = 0;
    for(var prop in sortMap){
        var count = sortMap[prop];
        for(var i = 0 ; i < fieldList.length ; i++){
            $(target).bootstrapTable('mergeCells',{index:index, field:fieldList[i], colspan: colspan, rowspan: count,align: 'center'});
        }
        index += count;
    }
}

function initTree(){
    //传入所需要的id属性名
	treeDataList = getUserOrgTree(user.orgNo);
	treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
	orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}
/**
 * 递归到最后一层 统计数据重复次数
 * 比如例如people.unit.name 就一直取到name
 * 类似于data["people"]["unit"]["name"]
 */
function getCount(data,prop,fieldArr,index,sortMap){
    if(index == fieldArr.length-1){
        if(prop == fieldArr[index]){
            var key = data[prop];
            if(sortMap.hasOwnProperty(key)){
                sortMap[key] = sortMap[key]+ 1;
            } else {
                sortMap[key] = 1;
            }
        }
        return;
    }
    if(prop == fieldArr[index]){
        var sdata = data[prop];
        index=index+1;
        getCount(sdata,fieldArr[index],fieldArr,index,sortMap);
    }
}
