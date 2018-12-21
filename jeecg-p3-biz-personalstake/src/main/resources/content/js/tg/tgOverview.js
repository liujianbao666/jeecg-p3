/**
 * 
 */
var charts;
$(document).ready(function(){
//	setInterval(init,1000);
	chartInit();
	$("#displayTg").html($("#tgName").val());
	doSearch();
	//页面刷新
	setInterval(chartInit,10000);
})


  //页面跳转方法
function clickneed(url,title){
	var tgId = $("#tgId").val();
	var opt = url+tgId;
	parent.openNewTab(opt,title);
}  

function doSearch(){
//	refreshChart(); //刷新台区曲线图
	getTgInfo(); //获取台区信息
	getneedInfo(); //获取需求信息
	getorderInfo(); //订单信息
	getpispathInfo(); //调度信息
	getplanInfo();   //计划信息
}


function chartInit(){
	charts = echarts.init(document.getElementById('charts'));  //初始化
	var orgNo =$("#tgId").val();
	var xIndex = [];
	for (var i = 0; i < 96; i++) {
		var hour = toHour(i);
		var min = toMinute(i);
		xIndex.push(hour + ":" + min);
	}
	
	$.ajax({   
	  async : true,   //设置为false。请求为同步请求
	  cache:false,   	//不设置缓存
	  type: 'post',   
	  dataType : "json",   
	  data:{
		  "orgNo":orgNo
	  },
	  url: "evTg.do?getTgCurves",
	  error: function () {//请求失败处理函数   
		  return false;
	  },   
	  success:function(data){ //请求成功后处理函数。 
		  //解析后台传回来的data，把它传给纵轴
		  var option1={
				//backgroundColor:'#364158',
				tooltip : {
					trigger : 'axis',
					position : function(pt) {
						return [ pt[0], '10%' ];
					}
				},
				
				legend: {
					data:['立即充电','台区负荷','策略计划','预测曲线'],
			        top:10,
			        x:"center",
			        textStyle:{
			        	color:'#000'
			        }
			    },
			    grid:{
			    	top:80,
			    	left:50,
			    	right:60,
			    	bottom:25
			    },
		        dataZoom : [
					{
						type : 'inside',
						start : 0,
						end : 100
					}],
				xAxis : {
					type : 'category',
					name: '时间(h)',
					boundaryGap : false,
					data:xIndex,
					nameTextStyle:{
						color:'#000'
					},
					axisLine:{
						lineStyle:{
							color:'#000'
						}
					}
				},
				yAxis : [{
					type : 'value',
					name: '功率(kW)',
					splitLine: {
		                show: false
		            },
					nameTextStyle:{
						color:'#000'
					},
					axisLine:{
						lineStyle:{
							color:'#000'
						}
					}
				}],
				series : [{	
					name : '立即充电',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#E51A08'
						}
					},
					data:data.normalPowerList
				},{	
					name : '台区负荷',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#ED7D31'
						}
					},
					data:data.tgPowerList
				},{	
					name : '策略计划',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#05C12E'
						}
					},
					data:data.optPowerList
				},{	
				name : '预测曲线',
				type : 'line',
				smooth : true,
				symbol : 'none',
				sampling : 'average',
				itemStyle : {
					normal : {
						color : '#4A4AFF'
					}
				},
				data:data.forecastPowerList
			}
			]
			};
		  charts.setOption(option1);
		  window.addEventListener("resize",function(){
		  		charts.resize();
	      });
	  }   
	})	
}

/**
 * 获取台区信息
 */
function getTgInfo(){
	var orgNo = $("#tgId").val();
	$.ajax({
		async : true,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo,
		  },
		  url: 'evTg.do.do?tgList',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取台区信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#tg_cap').html(data.tgCap);
			  $('#tg_limit').html(data.tgLimit);
			  $('#tg_P').html(data.tgP);
			  $('#rate').html(data.rate);
		  }
		});
}


/**
 * 获取需求信息
 */
function getneedInfo(){
	var orgNo = $("#tgId").val();
	$.ajax({
		async : true,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: 'evTg.do?needList',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取台区信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#power').html(data.power);
			  $('#total').html(data.total);
			  $('#yx').html(data.yx);
			  $('#zc').html(data.zc);
		  }
		});
}


/**
 * 获取订单信息
 */
function getorderInfo(){
	var orgNo = $("#tgId").val();
	$.ajax({
		async : true,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: 'evTg.do?orderList',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取台区信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#order_total').html(data.order_total);
			  $('#normal').html(data.normal);
			  $('#allOrderly').html(data.allOrderly);
		  }
		});
}



//获取计划信息
function getplanInfo(){
	var orgNo = $("#tgId").val();
	$.ajax({
		async : true,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: 'evTg.do?planList',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取台区信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#plan_total').html(data.plan_total);
			  $('#planP').html(data.planP);
			  $('#planDCount').html(data.planDCount);
		  }
		});
}


/**
 * 获取调度信息
 */
function getpispathInfo(){
	var orgNo = $("#tgId").val();
	$.ajax({
		async : true,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: 'evTg.do?dispathList',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取台区信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#pispath_Count').html(data.pispath_Count);
			  $('#pispathDcount').html(data.pispathDcount);
			  $('#pispathP').html(data.pispathP);
		  }
		});
}


//288个点转化的小时
function toHour1(minute) {
	var hour = parseInt(minute * 5 / 60);
	if (hour < 10) {
		return "0" + hour;
	}
	return hour;
}
//288个点对应的分钟
function toMinute1(minute) {
	var minute = minute * 5 % 60;
	if (minute < 10) {
		return "0" + minute;
	}
	return minute;
} 
//96个点对应的小时
function toHour(minute) {
	var hour = parseInt(minute * 15 / 60);
	if (hour < 10) {
		return "0" + hour;
	}
	return hour;
}
//288个点对应的小时
function to288Hour(minute) {
	var hour = parseInt(minute * 5 / 60);
	if (hour < 10) {
		return "0" + hour;
	}
	return hour;
}
//96个点对应的分钟
function toMinute(minute) {
	var minute = minute * 15 % 60;
	if (minute < 10) {
		return "0" + minute;
	}
	return minute;
}

//288个点对应的分钟
function to288Minute(minute) {
	var minute = minute * 5 % 60;
	if (minute < 10) {
		return "0" + minute;
	}
	return minute;
}
/**
 * 获取当前时间在96个点中的对应点
 * @returns
 */
function getNowPoint(){
	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var nowPoint = parseInt((hour*60+minute)/15);   
	return nowPoint;
} 

/**
 * 获取当前时间在288个点中的对应点
 * @returns
 */
function getNow5Point(){
	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var nowPoint = parseInt((hour*60+minute)/5);   
	return nowPoint;
} 
