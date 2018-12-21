var chart;
var treeDataList;
$(document).ready(function(){
	
	var user = getUserinfo();
	$('#orgNo').val(user.orgNo);
	$('#orgName').val(user.orgName);
	initTree();
	
    TableInit();
    $("#search-btn").bind("click",function(){
        refreshRunTable();
    })
    //重置按钮
    $("#run-reset-btn").bind("click",function(){
        $("#cdz").val("");
        $("#stakeName").val("");
        $("#tgNo").val("");
        $('.selectpicker').selectpicker('val', '');
   	 $("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
   	 $("#orgName").val(user.orgName);
        refreshRunTable();
    })
    
    setInterval(refreshRunTable, 10000);
})

//刷新表格
function refreshRunTable(){
//   var stakeNo= $("#cdz").val();
//   var stakeName= $("#stakeName").val();
//   var orgNo=  $("#orgNo").val();
//   var status=  $("#status").val();
//    var opt = {
//        url : "dischargingPileController.do?getDischargeList&orgNo="+orgNo+"&stakeNo="+stakeNo+"&stakeName="+stakeName+"&status"+status,
//    };
   $('#runTable').bootstrapTable('refresh');
}

/*// 刷新图表
function refreshChart(stakeNo){
    var stakeNo;
    if(!stakeNo){
         stakeNo= $("#cdz").val();
    }
    else{
        stakeNo=stakeNo;
    }
    var orgNo=  $("#orgNo").val();
	$.ajax({
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',
		  dataType : "json",
		  data:{
			  "orgNo":orgNo,
			  "stakeNo":stakeNo
		  },
		  url: "ChargingPileRunController.do?getChartRunData",//后台处理程序,获取显示数据
		  error: function () {//请求失败处理函数
			  return false;
		  },
		  success:function(data){
			  if(!chart){
		          return;
		     }

		     //更新数据
		      var option = chart.getOption();
		      option.series[0].data = data.p;
		      chart.setOption(option);
		  }
	});
}*/

//获取分时功率曲线
/*function getRunChart(){
	chart = echarts.init(document.getElementById('runChart'));  //初始化
	var date = [];
    for (var i = 0; i < 288; i++) {
        date.push([toHour(5*i),toMinute(5*i)].join(':'));
    }
	$.ajax({
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  url: "ChargingPileRunController.do?getChartRunData",//后台处理程序,获取显示数据
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){ //请求成功后处理函数。 
			  //解析后台传回来的data，把它传给纵轴
			  
			  var option1={
					tooltip : {
						trigger : 'axis',
						position : function(pt) {
							return [ pt[0], '10%' ];
						}
					},
					 title : {
						left : 'left',
						text : '分时电价',
					}, 
					 legend: {
				        data:['分时电价'],
				        left:'center'
				    }, 
				    grid:{
				    	left:30,
				    	right:40,
				    	top:30
				    },
					xAxis : {
						type : 'category',
						name: '时间(h)',
						boundaryGap : false,
						data : date
					},
					yAxis : {
						type:"value",
						name:"功率(w)"
					},
					dataZoom : [
						{
							type : 'inside',
							start : 0,
							end : 100
						},{
							start : 0,
							end : 100,
							handleIcon : 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
							handleSize : '80%',
							handleStyle : {
								color : '#fff',
								shadowBlur : 3,
								shadowColor : 'rgba(0, 0, 0, 0.6)',
								shadowOffsetX : 2,
								shadowOffsetY : 2
							}
						}],  
					series : [{	
						name : '分时功率',
						type : 'line',
						smooth : false,
						//yAxisIndex:1,
						symbol : 'none',
						sampling : 'average',
						itemStyle : {
							normal : {
								color : '#081AD8'
							}
						},
						step:'end',
						data : data.p
					}
				]
				};
			  chart.setOption(option1);
		  }   
		})	
}*/

function TableInit() {
    $("#runTable").bootstrapTable({
        url: 'evCg.do?getDischargeList',         //请求后台的URL（*）
        method: 'get',                      //请求方式（*）
        contentType: "application/x-www-form-urlencoded",
        // striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        // sortable: false,                     //是否启用排序
        // sortOrder: "asc",                   //排序方式
        queryParams: function (params){//传递参数（*）
            return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            	pageSize : params.pageSize,
				pageNo : params.pageNumber,
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
        pageList: [10, 20, 50, 100],        //可供选择的每页的行数（*）
        strictSearch: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        clickToSelect: true,                //是否启用点击选中行
        height: $(window).height()-180,     //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "stakeNo",                //每一行的唯一标识，一般为主键列
        showToggle:true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        singleSelect:true,
        undefinedText:"",                      //未定义列的显示文本
        /*onClickRow: function (row) {
           refreshChart(row.stakeNo);
        },*/
        columns: [
             {field:'',
              title:'序号',
              halign:"center",
           	  width:60,
           	  align:'center',
  		        	formatter: function (value, row, index) {  
	        		 if(row.stakeNo){
	        			 return index+1;  
	        		 }else{
	        			 return "&nbsp";
	        		 } 
  	            },
             },{
                field: 'tgName',
                halign:"center",
                title: '台区名称',
                width:200
            },
            {
                field: 'stakeNo',
                halign:"center",
                align:"center",
                width:180,
                title: '桩编号'
            },
            {
                field: 'alias',
                halign:"center",
                title: '桩名称',
                align:"center",
                width:180
            },
            {
                field: 'runI',
                halign:"center",
                title: '运行电流(A)',
                align:"center",
                width:100
            },
            {
                field: 'runU',
                halign:"center",
                title: '运行电压(V)',
                align:"center",
                width:100
            },
            {
                field: 'runP',
                halign:"center",
                title: '运行功率(kW)',
                align:"center",
                width:110
            }
            ,
           {
               field: 'data_time',
               halign:"center",
               width:160,
               title: '采集时间',
               align:"center"
           }
           ,   {
               field: 'status',
               halign:"center",
               width:80,
               title: '状态',
               align:"center",
               formatter : function(status, row, index) {
   				if (status == "1") {
   					return "待机";
   				} else if (status == "2") {
   					return "工作";
   				} else if (status == "3") {
   					return "故障";
   				} else if(status  == "4") {
   					return "离线";
   				}
   				return status;
   			}
           },
            {
                field:"action",
                width:80,
                halign:"center",
                title:"操作",
                align:"center",
                formatter:function(value,row,index){
                	if(row.stakeNo){
	        			 return "<button class='btn btn-xs btn-info' title='停止' onclick='stopOrBegin(\"" + row.stakeNo + "\",2)'><span class='table-show-btn'>停止</span></button>";
 
	        		 }else{
	        			 return "&nbsp";
	        		 } 
                }
            }],
            onClickRow:function(row,$element,field){
            	$element.parent().find("tr").removeClass("click-tr-bg");
    			$element.addClass("click-tr-bg");
            },
            onLoadSuccess: function(data){  //加载成功时执行
    			
    			if(data.total==0){
    				
    				$("#runTable").bootstrapTable('load',{rows:[{},{},{},{},{},{},{},{},{},{}],total:0})
    			}
    			
                console.info("加载成功");
          },
          onLoadError: function(){  //加载失败时执行
                console.info("加载数据失败");
          }
    });
}

function toHour(minute){
var hour=parseInt(minute/60);
if(hour<10){
    return "0" + hour;
}
    return hour;
}

function toMinute(minute){
var minute=minute%60;
    if(minute<10){
        return "0" + minute;
    }
    return minute;
}


function doSearch(tgNo){
    refreshRunTable();
}

function stopOrBegin(stakeNo, state) {
	Confirm.confirm({
		message : "确认将该充电桩停止充电吗？"
	}).on(function(e) {
		if (!e) {
			return;
		}
		$.ajax({
			type : "post",
			url : "ChargingPileRunController.do?updateStatusEvcg",
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
    //传入所需要的id属性名
	treeDataList = getUserOrgTree(user.orgNo);
	treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
	orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}