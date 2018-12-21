/**
 * 
 *///var tgId;
var charts;
var result=[];
$(document).ready(function(){
	setInterval(init,1000);
	var user = getUserOrg();
//页面刷新
	refresh1();
	selectInit();
	//获取充电需求管理页面
	getOrderInfo();
	//订单页面
	getPlanInfo();
	//充电桩页面
	getstakeInfo();
	//台区页面
	getTgInfo();
	//计划曲线
	getTgCurves();
	
})

function selectInit(){
	//台区名称下拉框，模糊查询
	 $(".selectpicker").selectpicker({  
         noneSelectedText : '请输入台区名称'  
     });  

}
//页面刷新
function refresh1(){
	setInterval(refreshTable, 10000);
	
}

function refreshTable(){
	var tgNo = $('#tgNo').val();
	var opt = {
			url : "monitorController.do?getTgInfo&tgId="+tgNo,
		};
		$('#tgOrder').bootstrapTable('refresh', opt); 
	
}


function init(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	var hour = intToTwoStr(date.getHours());
	var minute = intToTwoStr(date.getMinutes());
	var second =intToTwoStr(date.getSeconds());
	var now = today+" "+hour+":"+minute+":"+second;
	
	jeDate("#date",{
	       format: "YYYY-MM-DD hh:mm:ss"
	   });
	$('#date').val(now);
	$('#dateValue').html($('#date').val());
	$("#dateValue").attr("readonly","readonly");
}

function intToTwoStr(num){
	if(num < 10){
		return "0" + num;
	}
	return num;
}

function getToday(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	return today;
}

//页面跳转方法
function clickT(url,title){
//	parent.openNewTab(url,title);
	openTab(url,title);
}

function handCursor(){
	$('#displayTg').css("cursor","pointer");
}

/**
 * 获取充电需求信息
 */
function getOrderInfo(){
	var tgNo = $('#tgNo').val();
	var OdId = $('#OdId').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgNo":tgNo,
			  "OdId":OdId
		  },
		  url: 'orderController.do?ChargeplanList',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取充电需求信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#VUSE_TIME').html(data.VUSE_TIME);
			  $('#OD_MODEL').html(data.OD_MODEL);
			  $('#CHARGING_DEMAND').html(data.CHARGING_DEMAND);
		  }
		  });
}

/**
 * 获取订单信息
 */
function getPlanInfo(){
	var tgNo = $('#tgNo').val();
	var OdId = $('#OdId').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgNo":tgNo,
			  "OdId":OdId
		  },
		  url: 'orderController.do?orderList',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取订单信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#od_startTime').html(data.od_startTime);
			  $('#od_endTime').html(data.od_endTime);
			  $('#od_status').html(data.od_status);
			  $('#cgCap').html(data.cgCap);
		  }
		});
}

/**
 * 获取充电桩信息
 */
function getstakeInfo(){
	var tgNo = $('#tgNo').val();
	var OdId = $('#OdId').val();
	var stakeNo = $('#stakeNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgNo":tgNo,
			  "OdId":OdId,
			  "stakeNo":stakeNo
		  },
		  url: 'orderController.do?stakeList',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取充电桩信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#s_stakeNo').html(data.s_stakeNo);
			  $('#s_runI').html(data.s_runI);
			  $('#s_runU').html(data.s_runU);
			  $('#s_runP').html(data.s_runP);
			  $('#data_time').html(data.data_time);
		  }
		});
}


/**
 * 获取台区信息
 */
function getTgInfo(){
	var tgNo = $('#tgNo').val();
	var OdId = $('#OdId').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgNo":tgNo,
			  
		  },
		  url: 'orderController.do?tgList',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取台区信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#tgCap').html(data.tgCap);
			  $('#runP').html(data.runP);
		  }
		});
}



/**
 * 计划曲线
 */
function getTgCurves(){
	charts = echarts.init(document.getElementById('Mcharts')); // 初始化
	// 指定图标的数据和配置项
    var  OdId=$('#OdId').val();
	var startTime = $('#startTime').val();
	var endTime = $('#endTime').val();
	
	var xIndex = [];
	for (var i = 0; i < 288*2; i++) {
		var hour = toHour(i);
		var min = toMinute(i);
		xIndex.push(hour + ":" + min);
	}
	
	function getRandomColor() {
		var arr = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
		var str = '#';
		for(var i = 0; i < 6; i++){
			var random = Math.floor(Math.random() * 15);
			str+=arr[random];
		}
		return str;
	}

	$.ajax({
		async : false, // 设置为false。请求为同步请求
		cache : false, // 不设置缓存
		type : 'get', 
		dataType : "json",
		data : {
		    "OdId":OdId,
			"startTime":startTime,
			"endTime":endTime
		},
		url : "orderController.do?getPlanList",// 后台处理程序,获取显示数据
		error : function() {// 请求失败处理函数
			return false;
		},
		success : function(data11) { // 请求成功后处理函数。
			var list = data11.forecast;
		    var series=[];
		    var plegend=[];
			for(var i = 0;i<list.length;i++){//计划数
                plegend.push('计划'+(i+1));
				for (var j  =0;j<list[i].length;j++){//段数
                    var start = list[i][j].start_time;
                    var p = list[i][j].p;
					if(list[i][j].start_time == list[i][j].end_time){
                        series.push(
                            {
                                name: '计划'+(i+1),
                                type: 'line',
                                showSymbol: false,
                                hoverAnimation: false,
                                symbol:'circle',
                                data: [[list[i][j].start_time,list[i][j].p]],
                                markPoint : {
                                    itemStyle:{
                                        normal:{label:{
                                                show: true,
                                                position: 'bottom',
                                                formatter: function (param) {
                                                    return param.value;
                                                }
                                            }
                                        }

                                    },
                                    data : [
                                        { name: '停止标注', value: '停止', xAxis: start,yAxis :p }
                                    ]
                                }
                            }
                        );
					}else{
                        series.push(
                            {
                                name: '计划'+(i+1),
                                type: 'line',
                                showSymbol: false,
                                hoverAnimation: false,
                                symbol:'circle',
                                data: [[list[i][j].start_time,list[i][j].p],[list[i][j].end_time,list[i][j].p]]
                            }
                        );
					}

                }
            }

            var option1 = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:plegend,
                    textStyle:{
                        color:'#fff'
                    }
                },
                xAxis: {
                    type: 'time',
                    name : '时间',
                    boundaryGap : false,
                    nameTextStyle:{
                        color:'#268ed5'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#268ed5'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    name : '功率(kW)',
                    nameTextStyle:{
                        color:'#268ed5'
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#268ed5'
                        }
                    },
                    boundaryGap: [0, '10%'],
                    splitLine: {
                        show: false
                    }
                },
                series: series,
                color: ["#01E9FF","#FEFD40","#D48265","#AED4C2","#DDA490","#87CEFA","#6495ED","#4B94ED", "#87cefa", "#da70d6"]
            };
		// var option1 = {
		// 		tooltip : {
		// 			trigger : 'axis',
		// 			position : function(pt) {
		// 				return [ pt[0], '10%' ];
		// 			}
		// 		},
		// 		xAxis : {
		// 			type : 'time',
		// 			name : '时间(H)',
		// 			boundaryGap : false,
		// 			nameTextStyle:{
		// 				color:'#268ed5'
		// 			},
		// 			axisLine:{
		// 				lineStyle:{
		// 					color:'#268ed5'
		// 				}
		// 			},
		// 			splitLine: {
		// 				show: false
		// 			}
		// 		},
		// 		yAxis : [ {
		// 			type : 'value',
		// 			name : '功率(kW)',
		// 			nameTextStyle:{
		// 				color:'#268ed5'
		// 			},
		// 			min:0,
		// 			max:10,
		// 			axisLine:{
		// 				lineStyle:{
		// 					color:'#268ed5'
		// 				}
		// 			},
		// 			splitLine: {
		// 				show: false
		// 			}
		// 		} ],
		// 		grid: {
		// 			show: false
		// 		},
		// 		dataZoom : [
		// 			{
		// 				type : 'inside',
		// 				//type : 'slider',
		// 				start : 0,
		// 				end : 100
		// 			}],
		// 		/*series : [
		// 			{
		// 			name : '功率(KW)',
		// 			type : 'line',
		// 			smooth : true,
		// 			symbol : 'none',
		// 			sampling : 'average',
		// 			itemStyle : {
		// 				normal : {
		// 					color : '#05C12E'
		// 				}
		// 			},
		// 			data : list[0]
		// 		} */
        //         series:series
		//
		// 	};
			charts.setOption(option1);
			window.onresize = charts.resize;
		}
   })

}










