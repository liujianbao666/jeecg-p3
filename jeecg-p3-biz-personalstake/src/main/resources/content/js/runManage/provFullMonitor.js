var chart;
var myChart;
var pChart;
$(document).ready(function(){
//	var user = getUserOrg() ;
//	$('#orgName').val(user.orgName);
//	$('#orgNo').val(user.orgNo);
//	getSelectItem(); //显示默认组织机构下的台区
	getOrderChart();
	getPowerPie();
	init();
	
	$('#orgImg').bind('click',function(){
		var user = getUserOrg();
		var userOrg =user.orgNo;
		var dialog = new BootstrapDialog({
			title: '组织单位台区选择',
	        //size:'size-small',
	        type:BootstrapDialog.TYPE_DEFAULT,
	        message: function(dialog) {
	            var $message = $('<div></div>');
	            var pageToLoad = dialog.getData('pageToLoad');
	            $message.load(pageToLoad);
	            return $message;
	        },
	        closable: false,
	        data: {
	        	'pageToLoad': 'monitorController.do?getOrgTgPage&userOrg='+userOrg   
	        },
	        buttons: [{
	            label: ' 确认',
	            cssClass: 'btn-primary',
	            action: function(dialogRef){
	            	
	            	$("#orgNo").val($("#orgNo1").val()); 
	            	$("#orgName").val($("#orgName1").val());
	            	$("#tgNo").val($('#tgNo1').val());
	            	$("#tgName").val($('#tgName1').val());
	            	var orgNo1 = $("#orgNo1").val();
	            	var tgNo1 = $('#tgNo1').val();
	               // getSelectItem();
	               // $("#tgNameSelect").change();
	        		dialog.close();
	        		doSearch();
	            }
	        }, {
	            label: '取消',
	            action: function(dialogItself){
	                dialogItself.close();
	            }
	        }],
	    });
	    dialog.open();
	});
	$("#powerPie").find("div:first").css("border-bottom-left-radius",0);
	$("#powerPie").find("div:first").css("border-bottom-right-radius",0);
	
})



function init(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	var hour = intToTwoStr(date.getHours());
	var minute = intToTwoStr(date.getMinutes());
	var second =intToTwoStr(date.getSeconds());
	var now = today+" "+hour+":"+minute+":"+second;
	
//	$('#date').datetimepicker({
//		format:	'Y-m-d',
//		timepicker:false,
//		value:today
//	});
//	jeDate("#date",{
//	       format: "YYYY-MM-DD hh:mm:ss"
//	   });
//	$('#date').val(now);
	$('#dateValue').html(now);
	$("#dateValue").attr("readonly","readonly");
	$('#date1').html(today);
}
function selectOrg(){
	var orgNo = $('#orgNo').val();
	var orgName = $('#orgName').val();
	if(orgNo != "" && orgNo != undefined){
		//左上角显示台区名称
		$('#displayOrg').html(orgName+"—全景监控");
		//显示查询数据
		doSearch();
	}
}
function doSearch(){
	getTgNoList();
	getTgInfo();
	getCgInfo();
	getOrderInfo();
	getPowerInfo();
	getIndexInfo();
	
	refreshOrderChart();
	refreshPowerPie();
}

/**
 * 获取所选组织机构下的所有台区信息列表，存放在静态变量中，避免重复获取占用cpu资源
 */
function getTgNoList(){
	var orgNo = $('#orgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: 'runManageController.do?getTgNolist',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取台区列表失败！");
			  return false;
		  }
	});
}

//第一行图形信息
/**
 * 获取台区信息
 */
function getTgInfo(){
	var orgNo = $('#orgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: 'runManageController.do?getTgInfo',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取台区信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#tg_amount').html(data.tgAmount);
			  $('#tg_cap').html(data.tgCap);
			  $('#tg_P').html(data.tgP);
		  }
	});
}

/**
 * 获取充电桩信息
 * 
 */
function getCgInfo(){
	var orgNo = $('#orgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: 'runManageController.do?getCgInfo',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取桩信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#cg_amount').html(data.cgAmount);
			  $('#normal_amount').html(data.norAmount);
			  $('#opt_amount').html(data.optAmount);
		  }
	});
}

/**
 * 获取订单信息
 */
function getOrderInfo(){
	var orgNo = $('#orgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: 'runManageController.do?getOrderInfo',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取桩信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#all_order').html(data.odAmount);
			  $('#optimal_order').html(data.optimalOd);
			  $('#normal_order').html(data.normalOd);
		  }
	});
}
/**
 * 获取负荷信息
 */
function getPowerInfo(){
	var orgNo = $('#orgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: 'runManageController.do?getPowerInfo',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取桩信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#tg_power').html(data.tgPower);
			  $('#people_power').html(data.peoplePower);
			  $('#stake_power').html(data.stakePower);
		  }
	});
}

/**
 * 获取指标信息
 */
function getIndexInfo(){
	var orgNo = $('#orgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: 'runManageController.do?getIndexInfo',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取桩信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#optimalRate').html(data.optimalRate+"%");
			  $('#vallyRate').html(data.vallyRate+"%");
			  $('#doneOptimalRate').html(data.doneOptimalRate+"%");
		  }
	});
}
function refreshOrderChart(){
	var orgNo = $('#orgNo').val();
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: "runManageController.do?getOrderChart",//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){
			  if(!myChart){
		          return;
		     }
		     //更新数据
		      var option = myChart.getOption();
		     // window.onresize = myChart.resize;
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
/**
 * 订单柱状图
 */
function getOrderChart(){
	// 基于准备好的dom，初始化echarts实例
    myChart = echarts.init(document.getElementById('orderEcharts'));
	var orgNo = $('#orgNo').val(); //台区名称
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
			  "orgNo":orgNo
		  },
		  url: 'runManageController.do?getOrderChart',//后台处理程序,获取显示数据    	
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
				        	bottom:59
				        },
				        dataZoom : [
							{
								type : 'inside',
								//type : 'slider',
								start : 0,
								end : 100
							}],
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
			  	//window.onresize = myChart.resize;
		  }   
		})	
}

function refreshPowerPie(){
	var orgNo = $('#orgNo').val();
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
			 // debugger;
			  if(!pChart){
		          return;
		     }
			  //有数据情况下的数据更新
			  var option = pChart.getOption();
			  //window.onresize = pChart.resize;
			  option.series[0].data=[
                    /*{value:data.finishedAmount, name:'已充电量(kW·h)'},
					{value:data.notFinishedAmount, name:'未充电量(kW·h)'}]*/
                    {value:data.optUsed, name:'有序充'},
					{value:data.normalUsed, name:'正常充'},
					{value:data.residentUsed, name:'居民'}]
			  pChart.setOption(option);
			  window.addEventListener("resize",function(){
				  pChart.resize();
				});
			  get4KindsPower(data);
		  }
	});
	
}

/**
 * 充电电量饼图
 */
function getPowerPie(){
	pChart = echarts.init(document.getElementById('powerPie'));  //初始化
	var orgNo = $('#orgNo').val();
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
						//backgroundColor:'#21293B',
					  	backgroundColor:'#364158',
					    title : {
					        text: '充电电量',
					        //subtext: '纯属虚构',
					        x:'left',
					        top:10,
					        textStyle: {
					            fontSize: 16,
					            color:'#C3C0BF'
					        }
					    },
					    tooltip : {
					        trigger: 'item',
					        formatter: "{a} <br/>{b} : {c} ({d}%)"
					    },
					    legend: {
					        orient: 'vertical',
					        //left: 'left',
					        data: ['有序充','正常充','居民'],
					        x: "left",
					        y: "bottom",
					        textStyle: {
					            color:'#C3C0BF'
					        }
					    },
					    series : [
					        {
					            name: '访问来源',
					            type: 'pie',
					            radius : '55%',
					            center: ['50%', '55%'],
					            label: {
					                normal: {
					                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}:}{c}  {per|{d}%}  ', //'{a} \n{b}: {c} ({d}%)',      
					                    backgroundColor: '#eee',
					                    borderColor: '#aaa',
					                    borderWidth: 1,
					                    borderRadius: 4,
					                    // shadowBlur:3,
					                    // shadowOffsetX: 2,
					                    // shadowOffsetY: 2,
					                    // shadowColor: '#999',
					                    // padding: [0, 7],
					                    rich: {
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
					                    }
					                }
					            },
					            data:[
					               /* {value:data.finishedAmount, name:'已充电量(kW·h)'},
					                {value:data.notFinishedAmount, name:'未充电量(kW·h)'},*/
					                {value:data.optUsed, name:'有序充'},
					                {value:data.normalUsed, name:'正常充'},
					                {value:data.residentUsed, name:'居民'}
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
					 //   color: ["#fa61b7","#ff7f50","#ff7f50", "#87cefa", "#da70d6", "#32cd32", "#6495ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0"]
					    color: ["#87CEFA","#6495ED","#268ed5","#4B94ED", "#87cefa", "#da70d6", "#32cd32", "#0838ed", "#ff69b4", "#ba55d3", "#cd5c5c", "#ffa500", "#40e0d0"]
					};
				pChart.setOption(option);
				window.addEventListener("resize",function(){
					pChart.resize();
				});
				//获取尖峰平谷时段充电量
				get4KindsPower(data);
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

