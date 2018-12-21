/**
 * 台区全景监控新加图形对应的js
 */
var pChart;
//var orderChart; //只画一个图
var orderChart1;
var orderChart2;

$(document).ready(function(){
	getPowerPie();
	getOrderPie();   // 1.满足条件订单/总订单      2.有序订单/满足条件订单 
	
	//getCgInfo();   //获取充电桩信息，应该是初始化方法，因为暂时没有图形只有数字，所以该方法作为刷新方法，在查询时调用
	});

function refreshPowerPie(){
	var tgNo = $('#tgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgId":tgNo
		  },
		  url: 'monitorController.do?getTgPowerAmount',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取充电电量饼图失败！");
			  return false;
		  },   
		  success:function(data){
			 // debugger;
			  if(!pChart){
		          return;
		     }
			  //有数据情况下的数据更新
			  var option = pChart.getOption();
			  option.series[0].data=[
                    {value:data.finishedAmount, name:'已充电量(kW·h)'},
					{value:data.notFinishedAmount, name:'未充电量(kW·h)'}]
			  pChart.setOption(option);
			  get4KindsPower(data);
		  }
	});
	
}

function getPowerPie(){
	pChart = echarts.init(document.getElementById('powerPie'));  //初始化
	var tgNo = $('#tgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgId":tgNo
		  },
		  url: 'monitorController.do?getTgPowerAmount',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){
			  var option = {
						//backgroundColor:'#21293B',
					  	backgroundColor:'#fff',
					    title : {
					        text: '充电电量',
					        //subtext: '纯属虚构',
					        x:'center',
					        top:10,
					        textStyle: {
					            fontSize: 20
					        }
					    },
					    tooltip : {
					        trigger: 'item',
					        formatter: "{a} <br/>{b} : {c} ({d}%)"
					    },
					    legend: {
					        orient: 'vertical',
					        //left: 'left',
					        data: ['已充电量(kW·h)','未充电量(kW·h)'],
					        x: "right",
					        y: "bottom",
					       /* textStyle: {
					            color:'#C3C0BF'
					        }*/
					    },
					    series : [
					        {
					            name: '访问来源',
					            type: 'pie',
					            radius : '55%',
					            center: ['50%', '55%'],
					            data:[
					                {value:data.finishedAmount, name:'已充电量(kW·h)'},
					                {value:data.notFinishedAmount, name:'未充电量(kW·h)'}
					            ],
					            itemStyle: {
					            	normal: {
					                     label: {
					                         show: false
					                     }
					                 },
					                emphasis: {
					                    shadowBlur: 10,
					                    shadowOffsetX: 0,
					                    shadowColor: 'rgba(0, 0, 0, 0.5)'
					                }
					            }
					        }
					    ],
					 //   color: ["#fa61b7","#ff7f50","#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0"]
					    color: ["#C55A11","#F9D3B9","#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0"]
					};
				pChart.setOption(option);
				//获取尖峰平谷时段充电量
				get4KindsPower(data);
		  }
		  
	});
	
}

function getCgInfo(){
	var tgNo = $('#tgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgId":tgNo
		  },
		  url: 'monitorController.do?getCgInfo',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取充电桩信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#all').html(data.cgAmount);
			  $('#wait').html(data.cgWaitAmount);
			  $('#normal').html(data.cgNormalAmount);
			  $('#abNormal').html(data.cgAbnormalAmount);
			  $('#normal_charge').html(data.cgNormalCharge);
			  $('#optimal_charge').html(data.cgOptimalCharge);
		  }
		  });
}

function get4KindsPower(data){
	if(data == {} || data == undefined || data == ''){
		$('#peak').html("");
		$('#peace').html("");
		$('#spot').html("");
		$('#vally').html("");
	}
	else{
		$('#peak').html(data.peakAmount);
		$('#peace').html(data.peaceAmount);
		$('#spot').html(data.spotAmount);
		$('#vally').html(data.vallyAmount);
	}
}


function refreshOrderPie(){
	var tgNo = $('#tgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgId":tgNo
		  },
		  url: 'monitorController.do?getOrderPieData',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取订单饼图失败！");
			  return false;
		  },   
		  success:function(data){
			  if(!orderChart1 || !orderChart2){
				  return;
			  }
			  var option1 = orderChart1.getOption();
			  option1.series[0].data=[
					{value:data.yesOd, name:'满足充电订单'},
					{value:data.notOd, name:'未满足充电订单'}];
			  orderChart1.setOption(option1);
			  
			  var option2 = orderChart2.getOption();
			  option2.series[0].data=[
					{value:data.optimalOd, name:'有序充电订单'},
				    {value:data.normalOd, name:'正常充电订单'}]
			  orderChart2.setOption(option2);
			  
		  }
	});
}

function getOrderPie(){
	orderChart1 = echarts.init(document.getElementById('orderPie1'));
	orderChart2 = echarts.init(document.getElementById('orderPie2'));
	var tgNo = $('#tgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgId":tgNo
		  },
		  url: 'monitorController.do?getOrderPieData',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取订单饼图失败！");
			  return false;
		  },   
		  success:function(data){
			  var option1 = {
					//backgroundColor:'#21293B',
				    backgroundColor:'#fff',
				    title : {
				    	text: "充电",
				        //x:'right',
				        top:10,
				        right:-5,
				        textStyle: {
				            fontSize: 20,
				            //color:'#fff'
				            
				        }
				        
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				        //left: 'left',
				        data: ['满足充电订单','未满足充电订单'],
				    	x:"left",
				    	y:"bottom",
				    	/*textStyle:{
				    		color:'#C3C0BF'
				    	}*/
				    },
				    series : [
				        {
				            name: '访问来源',
				            type: 'pie',
				            radius : '55%',
				            center: ['50%', '50%'],
				            data:[
				                {value:data.yesOd, name:'满足充电订单'},
				                {value:data.notOd, name:'未满足充电订单'}
				            ],
				            itemStyle: {
				            	 normal: {
				                     label: {
				                         show: false
				                     }
				                 },
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ],
				    //color: ["#b761fa","#8561fa","#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0"]
				    color: ["#869BC2","#E7EDF7","#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0"]
				    
				};
			orderChart1.setOption(option1);
			
			var option2 = {
					backgroundColor:'#fff',
				    title : {
				    	text: "订单",
				        x:'-5',
				        top:10,
				        //right:-20,
				        textStyle: {
				            fontSize: 20,
				            //color:'#C3C0BF'
				        }
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    legend: {
				        orient: 'vertical',
				       // left: 'left',
				        data: ['有序充电订单','正常充电订单'],
				        x:"right",
				        y:"bottom",
				      /*  textStyle: {
				            color:'#C3C0BF'
				        }*/
				    },
				    series : [
				        {
				            name: '访问来源',
				            type: 'pie',
				            radius : '55%',
				            center: ['50%', '50%'],
				            data:[
				                {value:data.optimalOd, name:'有序充电订单'},
				                {value:data.normalOd, name:'正常充电订单'}
				            ],
				            itemStyle: {
				            	 normal: {
				                     label: {
				                         show: false
				                     }
				                 },
				                emphasis: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ],
				   // color: ["#619bfa","#61c6fa","#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0"]
				    color: ["#548235","#C9E2B8","#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0"]
				};
			orderChart2.setOption(option2);
	  }
	});
	
	
}
