var yesCharts3;
var myChart;
$(document).ready(function(){
	//获取仪表盘
	getGaugeCharts();
	//获取订单柱状图
	getOrderCharts();
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
				  option.series[0].data={
	                      value: data.rate,
	                      name: "负载率"
	                  }
			      yesCharts3.setOption(option); 
			  }
			  else{
				  var option = yesCharts3.getOption();
			     // option.series[0].data = data.rate;
				  option.series[0].data={
                      value: data.rate,
                      name: "负载率"
                  }
			      yesCharts3.setOption(option); 
			      $('#runP').html(data.runP+"kW");
	          	  $('#tgCap').html(data.tgCap+"kVA");
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
        		$('#runP').html(data.runP+"kW");
            	$('#tgCap').html(data.tgCap+"kVA");
        	}
            var option = {
            	backgroundColor:'#fff',
            	//backgroundColor:'#21293B',
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
			            fontSize: 20,
			           // color:'#C3C0BF'
			        }
			    },
                series: [
                         {
                             name: "业务指标",
                             type: "gauge",
                             detail: {
                                 formatter: "{value}%",
                                 textStyle: {
                                     fontSize: 19
                                 }
                             },
                             data: [
                                 {
                                     value: data.rate,
                                	// value:0,
                                     name: "负载率"
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
                                     fontSize: 12
                                 }
                             },
                             axisLabel: {
                                 show: false
                             },
                          axisLine: { //仪表盘轴线样式 
                         		lineStyle: { 
                 				 width: 15
                 				} 
                 			 }, 
                 		  splitLine: { //分割线样式 
                 		         length: 20 
                          	},
                         }
                     ]
            };
            yesCharts3.setOption(option);
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
		      myChart.setOption(option);
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
					  	backgroundColor:'#fff',
					  	//backgroundColor:'#21293B',
				        tooltip: {},
				        legend: {
				            data:['正常充电订单','有序充电订单'],
				            top:10,
				            textStyle: {
					            fontSize: 20,
					           // color:'#C3C0BF'
					        }
				        },
				        xAxis: {
				        	type : 'category',
							name: '时间(h)',
							boundaryGap : false,
				        },
				        yAxis: {
				        	type:"value",
							name:"订单数 (个)"
				        },
				        grid:{
				        	right:55,
				        	bottom:25
				        },
				        series : [
						{	
							name : '正常充电订单',
							type : 'bar',
							data: data.normal
						},
						{	
							name : '有序充电订单',
							type : 'bar',
							data: data.yx
						}]
				    }
				  
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option1);
		  }   
		})	
	
}