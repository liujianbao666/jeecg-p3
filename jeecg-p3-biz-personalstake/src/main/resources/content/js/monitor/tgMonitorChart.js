var yesCharts3;
var myChart;
var chart;
$(document).ready(function(){
	//获取仪表盘
	getGaugeCharts();
	//获取订单柱状图
	getOrderCharts();
	//居民+计划 与台区实际负荷的对比曲线
	getOptCompareCharts();
})

function refreshGaugeCharts(){
	var tgNo = $('#tgNo').val();
	var date = getToday();
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgNo":tgNo,
			  "date":date
		  },
		  url: "monitorController.do?getGaugeChartsItem",//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){
			  if(!yesCharts3){
		          return;
		     }
		     //更新数据
			  if(JSON.stringify(data) == "{}"){
				  $('#runP').html("");
				  $('#tgCap').html("");
				  data.rate = 0;
				  var option = yesCharts3.getOption();
			     // option.series[0].data = data.rate;
				  option.series[0].data[0]={
	                      value: data.rate,
	                      name: "负载率"
	                  }
			      yesCharts3.setOption(option); 
				 // window.onresize = yesCharts3.resize;
			  }
			  else{
				  var option = yesCharts3.getOption();
				  window.onresize = yesCharts3.resize;
			     // option.series[0].data = data.rate;
				  option.series[0].data[0]={
                      value: data.rate,
					 // value:50,
                      name: "负载率"
                  }
			      yesCharts3.setOption(option); 
				  window.addEventListener("resize",function(){
				  		yesCharts3.resize();
			      });
			      $('#runP').html(data.runP);
	          	  $('#tgCap').html(data.tgCap);
			  }
		     
		  }
	});
}


//仪表图
function  getGaugeCharts(){
	yesCharts3 = echarts.init(document.getElementById('Gauge'));  //初始化
	var tgNo = $('#tgNo').val();
	var date = getToday();
    $.ajax({
        async: false,   //设置为false。请求为同步请求
        cache: false,   	//不设置缓存
        type: 'post',
        dataType: "json",
        data:{
  		  "tgNo":tgNo,
  		  "date":date
  	  	},
        url: "monitorController.do?getGaugeChartsItem",//后台处理程序,获取显示数据
        error: function () {//请求失败处理函数
            return false;
        },
        success:function(data){
        	if(JSON.stringify(data) == "{}"){
        		$('#runP').html("");
            	$('#tgCap').html("");
            	data.rate = 0;
            	//data={rate:0};
        	}else{
        	/*	$('#runP').html(data.runP+"kW");
            	$('#tgCap').html(data.tgCap+"kVA");*/
        		$('#runP').html(data.runP);
            	$('#tgCap').html(data.tgCap);
        	}
            var option = {
            	//backgroundColor:'#fff',
            	//backgroundColor:'#21293B',
            	backgroundColor:'#364158',
                tooltip : {
                    formatter: "{a} <br/>{b} : {c}%"
                },grid:{
			    	bottom:0
			    },
			    title: {
			        text: "台区负载",
			        x: "center",
			        top:10,
			        textStyle: {
			            fontSize: 16,
			            color:'#C3C0BF'
			        }
			    },
                series: [
                         {
                             name: "业务指标",
                             type: "gauge",
                             detail: {
                                 formatter: '{value}%',
                                 textStyle: {
                                     fontSize: 14,
                                     fontFamily:'digitFont',
                                 }
                             },
                             data: [
                                 {
                                     value: data.rate,
                                	// value:0,
                                     name: '负载率'
                                 }
                             ],
                             radius: "77%",
                             center: ["50%", "60%"],
                             axisTick: {
                                 length: 7,
                                 splitNumber: 3
                             },
                             pointer: {
                            	 width: 5,
                                 length: "70%"
                             },
                             title: {
                                 textStyle: {
                                     fontSize: 12,
                                     color:'#fff'
                                 }
                             },
                             axisLabel: {
                                 show: false
                             },
                             axisLine: { //仪表盘轴线样式 
                         		lineStyle: { 
                 				 width: 15,
                 				color: [[0.2, "rgb(111, 195, 68)"],[0.8, "rgb(0, 195, 30)"], [0.9, "rgb(237,125,49)"], [1, "rgb(229,26,8)"]]
                 				}
                 			 }, 
                 		  splitLine: { //分割线样式 
                 		         length: 20 
                          	},
                         }
                     ]
            };
        	
            yesCharts3.setOption(option);
            window.addEventListener("resize",function(){
		  		yesCharts3.resize();
            });
            //window.onresize = yesCharts3.resize;
        }
    })
}

function refreshOrderCharts(){
	var tgNo = $('#tgNo').val();
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tg_id":tgNo
		  },
		  url: "orderController.do?getOrderChart",//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){
			  if(!myChart){
		          return;
		     }
		     //更新数据
		      var option = myChart.getOption();
		      option.series[0].data = data.normal;
		      option.series[1].data = data.yx;
		      option.series[2].data = data.all;
		      myChart.setOption(option);
		      window.addEventListener("resize",function(){
			  		myChart.resize();
		      });
		  }
	});
}

function getOrderCharts(){
	// 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById('orderEcharts'));
	var tg_id_init = $('#tgNo').val(); //台区名称
    var date = [];
	for (var i = 0; i < 24; i++) {
		date.push([intToTwoStr(i),intToTwoStr(0)].join(':'));
	}
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tg_id":tg_id_init
		  },
		  url: 'orderController.do?getOrderChart',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){ //请求成功后处理函数。 
			  var option1 = {
					  	//backgroundColor:'#21293B',
					  	backgroundColor:'#364158',
					  	tooltip : {
							trigger : 'axis',
							position : function(pt) {
								return [ pt[0], '10%' ];
							}
						},
				        legend: {
				            data:['正常充电订单','有序充电订单','总订单'],
				            top:10,
				            textStyle: {
					           // fontSize: 20,
					            color:'#C3C0BF'
					        }
				        },
				        xAxis: {
				        	type : 'category',
							name: '时间(h)',
							boundaryGap : false,
							data : date,
							nameTextStyle:{
								color:'#268ed5'
							},
							axisLine:{
								lineStyle:{
									color:'#268ed5'
								}
							},
							boundaryGap: true
				        },
				        yAxis: {
				        	type:"value",
							name:"订单数 (个)",
							nameTextStyle:{
								color:'#268ed5'
							},
							axisLine:{
								lineStyle:{
									color:'#268ed5'
								}
							}
				        },
				        grid:{
				        	right:55,
				        	bottom:30
				        },
				        dataZoom : [
							{
								type : 'inside',
								//type : 'slider',
								start : 0,
								end : 100
							}/*,{
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
						}*/],
				        series : [
						{	
							name : '正常充电订单',
							type : 'bar',
						//	stack: '订单',
							data: data.normal
						},
						{	
							name : '有序充电订单',
							type : 'bar',
						//	stack: '订单',
							data: data.yx
						},{	
							name : '总订单',
							type : 'line',
							data: data.all,
							symbol:'circle'
						}],
						color: ["#01E9FF","#FEFD40","#D48265","#AED4C2","#DDA490","#87CEFA","#6495ED","#4B94ED", "#87cefa", "#da70d6"]
				    }
				  
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option1);
			  	window.addEventListener("resize",function(){
			  		myChart.resize();
			  	});
		  }   
		})	
	
}
function refreshOptCompare(){
	var flag ="";
	var tgNo = $('#tgNo').val(); //台区名称
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgId":tgNo
		  },
		  url: "monitorController.do?getOptCompareData&flag="+flag,//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){
			  if(!chart){
		          return;
		     }
		     //更新数据
		      var option = chart.getOption();
		      option.series[0].data = data.tgPower;
		      option.series[1].data = data.power  
		      chart.setOption(option);
		      window.addEventListener("resize",function(){
			  		chart.resize();
		      });
		  }
	});
}

function getYesdayCharts(flag){
	var tgNo = $('#tgNo').val(); //台区名称
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgId":tgNo
		  },
		  url: "monitorController.do?getOptCompareData&flag="+flag,//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){
			  if(!chart){
		          return;
		     }
		     //更新数据
		      var option = chart.getOption();
		      option.series[0].data = data.tgPower;
		      option.series[1].data = data.power  
		      chart.setOption(option);
		      window.addEventListener("resize",function(){
			  		chart.resize();
		      });
		  }
	});
}

function getOptCompareCharts(){
	// 基于准备好的dom，初始化echarts实例
    chart = echarts.init(document.getElementById('optChart'));
	var tg_id_init = $('#tgNo').val(); //台区名称
	var xIndex = [];
	var nowPoint = getNowPoint();
	for (var i = nowPoint+1; i < 96; i++) {
		var hour = toHour(i);
		var min = toMinute(i);
		xIndex.push(hour+":"+min);
	}
	for(var j=0;j<=nowPoint;j++){
		var hour = toHour(j);
		var min = toMinute(j);
		xIndex.push(hour+":"+min);
	}
	
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgId":tg_id_init
		  },
		  url: 'monitorController.do?getOptCompareData&flag=2',//后台处理程序,获取显示数据  
		 // url: 'orderController.do?getOrderChart',//后台处理程序,获取显示数据  
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){ //请求成功后处理函数。 
			  var option2 = {
					  	//backgroundColor:'#21293B',
					  	backgroundColor:'#364158',
					  	tooltip : {
							trigger : 'axis',
							position : function(pt) {
								return [ pt[0], '10%' ];
							}
						},/*,
						toolbox: {
					        feature: {
					            myTool1: {
					                show: true,
					                title: '昨天',
					              //  icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
					                icon:'image://plug-in/login/images/yesterday.svg',
					                onclick: function (){
					                	getYesdayCharts(1);
					                }
					            },
					            myTool2: {
					                show: true,
					                title: '今天',
					                //icon: 'path://M432.45,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
					                icon:'image://plug-in/login/images/today.svg',
					                onclick: function (){
					                	refreshOptCompare();
					                }
					            }
					        }
						},*/
				        legend: {
				            //data:['台区负荷','居民+计划'],
				        	data:['台区负荷','未调度台区负荷'],
				            top:10,
				            textStyle: {
					           // fontSize: 20,
					            color:'#C3C0BF'
					        }
				        },
				        xAxis: {
				        	type : 'category',
							name: '时间(h)',
							boundaryGap : false,
							data : xIndex,
							nameTextStyle:{
								color:'#268ed5'
							},
							axisLine:{
								lineStyle:{
									color:'#268ed5'
								}
							},
							boundaryGap: true
				        },
				        yAxis: {
				        	type:"value",
							name:"功率(kW)",
							nameTextStyle:{
								color:'#268ed5'
							},
							axisLine:{
								lineStyle:{
									color:'#268ed5'
								}
							}
				        },
				        grid:{
				        	right:55,
				        	bottom:30
				        },
				        dataZoom : [
							{
								type : 'inside',
								start : 0,
								end : 100
							}],
				        series : [
						{	
							name : '台区负荷',
							type : 'line',
							itemStyle : {
								normal : {
									color : '#E51A08'
								}
							},
							data: data.tgPower,
							symbol: "circle"
						},
						{	
							name : '未调度台区负荷',
							type : 'line',
							itemStyle : {
								normal : {
									color : '#ED7D31'
								}
							},
							data: data.power,
							// symbol: "droplet"
							symbol:"circle"
							
						}],
					//	color: ["#E51A08","#01E9FF","#FEFD40","#D48265","#AED4C2","#DDA490","#87CEFA","#6495ED","#4B94ED", "#87cefa", "#da70d6"]
				    }
				  
				// 使用刚指定的配置项和数据显示图表。
				chart.setOption(option2);
			  	window.addEventListener("resize",function(){
			  		chart.resize();
			  	});
		  }   
		})	
	
}

