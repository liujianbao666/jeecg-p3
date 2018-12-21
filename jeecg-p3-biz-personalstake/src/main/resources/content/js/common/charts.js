/**
 * 
 */
var pChart;
/**
 * 充电电量饼图
 */
function getPowerPie(divId,orgNo){
	pChart = echarts.init(document.getElementById(divId));  //初始化
	//var orgNo = $('#orgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: 'runManageController.do?getTgPowerAmount',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){
			  var option = {
					  /*	backgroundColor:'#F5FFFA',*/
					    title : {
					        text: '充电电量',
					        //subtext: '纯属虚构',
					        x:'left',
					        top:10,
					        textStyle: {
					            fontSize: 20,
					            color:'#676a6c',
					            fontWeight: 'bold'
					        }
					    },
					    tooltip : {
					        trigger: 'item',
					        formatter: "{a} <br/>{b} : {c} ({d}%)"
					    },
					    legend: {
					       // orient: 'vertical',
					        //left: 'left',
					        data: ['有序充','正常充'/*,'居民'*/],
					        x: "right",
					        y: "bottom",
					        textStyle: {
					            color:'#676a6c'
					        }
					    },
					    grid:{
					    	top:30
					    },
					    series : [
					        {
					            name: '访问来源',
					            type: 'pie',
					            radius : '55%',
					            center: ['50%', '55%'],
					            label: {
					                normal: {
					                    formatter: '{a} \n{b}: {c} ({d}%)', //'{a|{a}}{abg|}\n{hr|}\n  {b|{b}:}{c}  {per|{d}%}  ', //'{a} \n{b}: {c} ({d}%)',      
					                    backgroundColor: '#eee',
					                    borderColor: '#aaa',
					                    borderWidth: 1,
					                    borderRadius: 4,
					                    // shadowBlur:3,
					                    // shadowOffsetX: 2,
					                    // shadowOffsetY: 2,
					                    // shadowColor: '#999',
					                    // padding: [0, 7],
					                    /*rich: {
					                        a: {
					                        	fontSize: 12,
					                            color: '#999',
					                            lineHeight: 18,
					                            align: 'center'
					                        },
					                        // abg: {
					                        //     backgroundColor: '#333',
					                        //     width: '100%',
					                        //     align: 'right',
					                        //     height: 22,
					                        //     borderRadius: [4, 4, 0, 0]
					                        // },
					                        hr: {
					                            borderColor: '#aaa',
					                            width: '100%',
					                            borderWidth: 0.5,
					                            height: 0
					                        },
					                        b: {
					                            fontSize: 12,
					                            lineHeight: 24
					                        },
					                        per: {
					                            color: '#67d82e',//'#eee',
					                            backgroundColor: '#334455',
					                            padding: [2, 4],
					                            borderRadius: 2
					                        }
					                    }*/
					                }
					            },
					            data:[
					               /* {value:data.finishedAmount, name:'已充电量(kW·h)'},
					                {value:data.notFinishedAmount, name:'未充电量(kW·h)'},*/
					                {value:data.optUsed, name:'有序充'},
					                {value:data.normalUsed, name:'正常充'}/*,
					                {value:data.residentUsed, name:'居民'}*/
					            ],
					            itemStyle: {
					            	normal: {
					                     label: {
					                         show: true
					                     },labelLine: {
						                        show: true
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
					 //   color: ["#87CEFA","#6495ED","#268ed5","#4B94ED", "#87cefa", "#da70d6", "#32cd32", "#0838ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0"]
					};
				pChart.setOption(option);
				window.addEventListener("resize",function(){
					pChart.resize();
				});
				//获取尖峰平谷时段充电量
				//get4KindsPower(data);
		  }
		  
	});
	
}

function refreshPowerPie(orgNo){
	
	if(orgNo){
		$.ajax({
			async : false,   //设置为false。请求为同步请求
			  cache:false,   	//不设置缓存
			  type: 'post',   
			  dataType : "json",   
			  data:{
				  "orgNo":orgNo
			  },
			  url: 'runManageController.do?getTgPowerAmount',//后台处理程序,获取显示数据    	
			  error: function () {//请求失败处理函数   
				  console.info("获取充电电量饼图失败！");
				  return false;
			  },   
			  success:function(data){
				  if(!pChart){
			          return;
			     }
				  //有数据情况下的数据更新
				  var option = pChart.getOption();
				  option.series[0].data=[
	                    /*{value:data.finishedAmount, name:'已充电量(kW·h)'},
						{value:data.notFinishedAmount, name:'未充电量(kW·h)'}]*/
	                    {value:data.optUsed, name:'有序充'},
						{value:data.normalUsed, name:'正常充'}/*,
						{value:data.residentUsed, name:'居民'}*/]
				  pChart.setOption(option);
				  window.addEventListener("resize",function(){
					  pChart.resize();
					});
				 // get4KindsPower(data);
			  }
		});
	}else{
		  var option = pChart.getOption();
		  option.series[0].data=[
              /*{value:data.finishedAmount, name:'已充电量(kW·h)'},
				{value:data.notFinishedAmount, name:'未充电量(kW·h)'}]*/
              {value:0, name:'有序充'},
				{value:0, name:'正常充'}/*,
				{value:0, name:'居民'}*/]
		 pChart.setOption(option);
		  window.addEventListener("resize",function(){
			  pChart.resize();
			});
		
	}
	//var orgNo = $('#orgNo').val();
	
	
}


//各设备接入设备柱状图
var equChart;

function drawEquipmentChart(departname,orgType,useData){
	
	
    option = {
    	    /*title: {
    	        text: '各地区设备接入数量'
    	    },*/
    	    tooltip: {},
    	    legend: {
    	        data:['充电桩数'],
    	        left:'2%',
    	        top:30
    	        
    	    },
    	    xAxis: {
    	        data: ["北京","河南","上海","江苏"]
    	    },
    	    yAxis: {},
    	    grid:{
    	    	top:60,
    	    },
    	    series: [{
    	        name: '充电桩数',
    	        type: 'bar',
    	        data: [5, 20, 36, 10],
    	        barWidth:'10%',
    	        barGap: '10%',
    	        itemStyle : {
					normal : {
						color : '#466baa'
					}
				},
    	    }]
    	};
    
    option.xAxis.data = [];
    option.series[0].data=[];
   for(var i = 0;i <useData.length;i++){
	  
	   option.xAxis.data.push(useData[i].name);
	   option.series[0].data.push(useData[i].value);
    }
    
    
     equChart = echarts.init(document.getElementById('stake'));
    equChart.setOption(option);
	window.addEventListener("resize",function(){
  		equChart.resize();
	});
	
}


function refreshEquipmentChart(data){
	
	if(data.useData){
		var useData = data.useData;
	}else{
		var useData = data;
	}
	
	
	  if(!equChart){
          return;
     }
	  //有数据情况下的数据更新
	  var option = equChart.getOption();
	  
	    option.xAxis[0].data = [];
	    option.series[0].data=[];
	   for(var i = 0;i <useData.length;i++){
		  
		   option.xAxis[0].data.push(useData[i].name);
		   option.series[0].data.push(useData[i].value);
	    }
	    
	  
	  
	   equChart.setOption(option);
	  window.addEventListener("resize",function(){
		  equChart.resize();
		});
	
	
}