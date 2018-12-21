var charts;
var user;
var tgCap;
var treeDataList;
var interval="";
var dataArr = [];
var days = 0;
$(document).ready(function(){
	
	// 页面初始化坐标轴展示
	getTgCurves();
	
	var user = getUserinfo();
	$('#orgNo').val(user.orgNo);
	$('#orgName').val(user.orgName);
	initTree();
    // 时间初始化
    timeinit();
	// 查询
	$("#search-btn").bind("click",function(){
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val()
		startDate =new Date(startDate);
		endDate =new Date(endDate);
		validateDate(startDate,endDate);
		// 开始时间到结束时间的天数
		days = daysApart(startDate,endDate);
		// 时间间隔只有五天的验证
		if(days >= 5){
			$.notify({
				message : "时间最多间隔五天！"
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
		}else{
			dataArr = [];
			for(var i = 0;i < days ;i++){
				var result = (startDate.getDate()+i)+"日";
				dataArr.push(result);
//				var result1 = startDate.getFullYear()+"-"+intToTwoStr((startDate.getMonth()+1))+"-"+(startDate.getDate()+i)+"(充电桩负荷)";
//				dataArr.push(result1);
			}
		}
		refreshTgCurves();
	});

	//重置按钮
	$("#reset-btn").bind("click",function(){
		clearInterval(interval);
		$("#searchForm input").val("");
		$("#orgNo").val(user.orgNo);
		$("#orgName").val(user.orgName);
		timeinit();
		//清空图形数据
		clearCurves();
	})
});

// 时间初始化
function timeinit(){
	var today = new Date();
//	var result = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();
	// 有开始时间的时候，初始化结束时间
	jeDate("#endDate", {
		format : "YYYY-MM-DD",
//		minDate : "2018-8-1",
		maxDate : today,
		isTime : true, // 是否开启时间选择
		// isClear:true, //是否显示清空
		// festival:true, //是否显示节日
		zIndex : 999, // 弹出层的层级高度
		isClear : true,
		isinitVal : true,
	});
	jeDate("#startDate", {
		dateCell : '#datebut',
		format : "YYYY-MM-DD",
//		minDate : "2018-8-1",
		maxDate : today,
		isTime : true, // 是否开启时间选择
		zIndex : 999, // 弹出层的层级高度
		isinitVal : true, //是否初始化时间
		isOk : true,
		initDate:[{DD:"-1"},true],   //初始化日期加3个月
	});
}

function clearCurves(){
	//更新数据
	var option = charts.getOption();
	for (var i = 0; i < dataArr.length; i++) {
		option.series[i].data = ""; 
		option.legend[0].data[i] = "";
	}
	charts.setOption(option); 
}

function refreshTgCurves(){
	charts = echarts.init(document.getElementById('charts'));  //初始化
	//指定图标的数据和配置项	
	var orgNo = $('#orgNo').val(); //供电单位编号
	// 确定x轴的288点的时间
	var xIndex = [];
	for (var i = 0; i < 288; i++) {
		var hour = to288Hour(i);
		var min = to288Minute(i);
		xIndex.push(hour + ":" + min);
	}
	
	$.ajax({   
	  async : false,   //设置为false。请求为同步请求
	  cache:false,   	//不设置缓存
	  type: 'post',   
	  dataType : "json",   
	  data:{
		  "orgNo":orgNo,
		  "startDate":$("#startDate").val(),
		  "endDate":$("#endDate").val()
	  },
	  url: "evTg.do?getTgPowerCompareCurve",//后台处理程序,获取显示数据    	
	  error: function () {//请求失败处理函数   
		  return false;
	  },   
	  success:function(data){ //请求成功后处理函数。 
		  if(data.status =="1"){
				$.notify({
					message : "请选择指定台区！"
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
		  
		  //解析后台传回来的data，把它传给纵轴
		  var option1={
				  tooltip : {
						trigger : 'axis',
						position : function(pt) {
							return [ pt[0], '10%' ];
						}
					},
					legend:{
				       data:dataArr,
				       top:10,
						},
				    xAxis: [
				        {
				            type: 'category',
				            data: xIndex,
				            axisPointer: {
				                type: 'shadow'
				            }
				        }
				    ],
				    yAxis: [
				        {
				            type: 'value',
				            name: '台区负荷(kW)',
				        }
				    ],
				    grid:{
				    	right:200
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
				    grid:{
				    	top:30
				    },
				    
				    series: getData(data)  
				};
		  charts.setOption(option1);
	  }   
	})	
}

//获取台区曲线信息
function getTgCurves(){
	charts = echarts.init(document.getElementById('charts'));  //初始化
	//指定图标的数据和配置项	
	var orgNo = $('#orgNo').val(); //供电单位编号
	var xIndex = [];
	for (var i = 0; i < 288; i++) {
		var hour = to288Hour(i);
		var min = to288Minute(i);
		xIndex.push(hour+":"+min);
	}
		  //解析后台传回来的data，把它传给纵轴
		  var option1={
				  tooltip : {
						trigger : 'axis',
						position : function(pt) {
							return [ pt[0], '10%' ];
						}
					},
				    legend: {
				        data:[],
				        top:30,
				    },
				    xAxis: [
				        {
				            type: 'category',
				            data: xIndex,
				            axisPointer: {
				                type: 'shadow'
				            }
				        }
				    ],
				    yAxis: [
				        {
				            type: 'value',
				            name: '台区负荷(kW)',
				        }
				    ],
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
				    series: []
				};
		  charts.setOption(option1);
}

// 动态加载series
function getData(data) {
    var tgPowerArr =  data.tgPower.data;
	var serie = [];
	for (var i = 0; i < tgPowerArr.length/288; i++) {
		var datatemp = tgPowerArr.slice(288*i,288*(i+1));
		var item = {
			name : dataArr[i],
			type : 'line',
			stack : dataArr[i],
			smooth : true,
			symbol : 'none',
			sampling : 'average',
			data : datatemp
		}
		serie.push(item);
	};
	return serie;
}

function initTree(){
    //传入所需要的id属性名
	treeDataList = getUserOrgTree(user.orgNo);
	treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
	orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}
