var charts;
var user;
var limit;
var tgCap;
var treeDataList;
$(document).ready(function(){
    init();
	var user = getUserinfo();
	$('#orgNo').val(user.orgNo);
	$('#orgName').val(user.orgName);
    getTgCurves();
    //setInterval(refreshTgCurves,3*60000); //3*60秒刷新
    jeDate("#startDate",{
        format: "YYYY-MM-DD",
        isinitVal:true
    });
    jeDate("#endDate",{
        format: "YYYY-MM-DD",
        isinitVal:true
    });
    	 
	//查询
	$("#search-btn").bind("click",function(){
		//判空操作
		paramNotNull();
		refreshTgCurves();
	});

	
//重置按钮
	$("#reset-btn").bind("click",function(){
		
		$("#orgNo").val(user.orgNo);
		$("#orgName").val(user.orgName);
		timeInit();
		//清空图形数据
		clearCurves();
	})
});

function clearCurves(){
	//更新数据
	var option = charts.getOption();
	option.series[0].data = "";   
	option.series[1].data = "";  
	option.series[2].data = "";
	option.series[3].data = "";  
	option.series[4].data = "";  
	option.series[5].data = "";  
	option.series[6].data = "";  
	charts.setOption(option); 
}


//页面跳转参数初始化
function init(){
	//获取由台区全景监控页面跳转来的参数信息
	var orgNo = $("#org_no_g").val();
	var orgName = $('#org_name_g').val();
	var tgNo = $("#tg_no_g").val();
	$('#orgNo').val(orgNo);
	
	 if(orgName != "" && orgName != "null" && tgNo != "" && tgNo != "null"){
		 $('#orgName').val(orgName);
		 $('#tgNo').val(tgNo);
		 getSelectItem();
		 $('#tgNameSelect').selectpicker('val',tgNo); 
	 }
}

function selectInit(){
	//台区名称下拉框，模糊查询
	 $(".selectpicker").selectpicker({  
         noneSelectedText : '请输入台区名称'  
     });  
}


function refreshTgCurves(){
	var startDate = $('#startDate').val(); //开始日期
	var endDate = $('#endDate').val(); //结束日期
	var orgNo = $('#orgNo').val(); //供电单位编号
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo,
			  "startDate":startDate,
			  "endDate":endDate,
			  "provorgNo":proorgno,
		  },							
		  url: "evTg.do?getTgCharts",//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){
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
			  if(!charts){
		          return;
		     }
		      var option = charts.getOption();
		      //var times=[[1522306819000, 2], [1522306919000, 1], [1522307019000, 3], [1522307119000, 1], [1522307120000, 1],[1522307230000, 1], [1522302230000, 1], [1522307430000, 1], [1522407230000, 1]];
		      var forecastArr = new Array();
		      for(var i=0;i< data.forecast.time.length;i++){
		    	  forecastArr[i]=new Array();
		    	  forecastArr[i][0]=data.forecast.time[i];
		    	  forecastArr[i][1]=data.forecast.data[i];
		      }
		      option.series[0].data = forecastArr;  
		      
		      
		      var tgPowerarr = new Array();
		      for(var i=0;i< data.tgPower.time.length;i++){
		    	  tgPowerarr[i]=new Array();
		    	  tgPowerarr[i][0]=data.tgPower.time[i];
		    	  tgPowerarr[i][1]=data.tgPower.data[i];
		      }
		      option.series[1].data = tgPowerarr;  
		      
		      var usersPowerArr = new Array();
		      for(var i=0;i< data.usersPower.time.length;i++){
		    	  usersPowerArr[i]=new Array();
		    	  usersPowerArr[i][0]=data.usersPower.time[i];
		    	  usersPowerArr[i][1]=data.usersPower.data[i];
		      }
		      option.series[2].data = usersPowerArr;
		      
		      var piesPowerArr = new Array();
		      for(var i=0;i< data.piesPower.time.length;i++){
		    	  piesPowerArr[i]=new Array();
		    	  piesPowerArr[i][0]=data.piesPower.time[i];
		    	  piesPowerArr[i][1]=data.piesPower.data[i];
		      }
		      option.series[3].data = piesPowerArr;
		      
		      var pLimArr = new Array();
		      for(var i=0;i< data.piesPower.time.length;i++){
		    	  pLimArr[i]=new Array();
		    	  pLimArr[i][0]=data.piesPower.time[i];
		    	  pLimArr[i][1]=data.pLim;
		      }
	          option.series[4].data = pLimArr;  
	          
		      var pStartArr = new Array();
		      for(var i=0;i< data.piesPower.time.length;i++){
		    	  pStartArr[i]=new Array();
		    	  pStartArr[i][0]=data.piesPower.time[i];
		    	  pStartArr[i][1]=data.pStart;
		      }
		      option.series[5].data = pStartArr;
		      //分时电价
		      //var elePricesArr=[[1544457600000, 0.45], [1544486400000, 0.59], [1544540400000, 0.59], [1544543999000, 0.45]];
		      var elePricesArr = new Array();
		      for(var i=0;i< data.elePrices.time.length;i++){
		    	  elePricesArr[i]=new Array();
		    	  elePricesArr[i][0]=data.elePrices.time[i];
		    	  elePricesArr[i][1]=data.elePrices.data[i];
		      }
		      option.series[6].data = elePricesArr;  
		      
		      //区间内控制显示颜色
			  limit =  parseInt(data.pLim);
		      option.visualMap[0].pieces[0].gte=0;
		      option.visualMap[0].pieces[0].lte=limit;
		      
		      charts.setOption(option); 
		  }
	});
}

//获取台区曲线信息
function getTgCurves(){
	charts = echarts.init(document.getElementById('charts'));  //初始化
	//指定图标的数据和配置项	
	var orgNo = $('#orgNo').val(); //供电单位编号
	var startDate = $('#startDate').val(); //开始日期
	var endDate = $('#endDate').val(); //结束日期
// 	var xIndex = [];
//	for (var i = 0; i < 288; i++) {
//		var hour = toHour1(i);
//		var min = toMinute1(i);
//		xIndex.push(hour + ":" + min);
//	}
	$.ajax({   
	  async : false,   //设置为false。请求为同步请求
	  cache:false,   	//不设置缓存
	  type: 'post',   
	  dataType : "json",   
	  data:{
		  "orgNo":orgNo,
		  "startDate":startDate,
		  "endDate":endDate
	  },
	  url: "evTg.do?getTgCharts",//后台处理程序,获取显示数据    	
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
				legend: {
					data:['预测负荷','台区负荷','居民负荷','充电桩负荷','越限负荷','启调负荷','分时电价'],
			        left:'center'
			    },
			    grid:{
			    	top:30
			    },
				xAxis : {
            	  name:'时间(h)',
                  type: 'time',
                  splitLine: {
                      show: false
                  }
				},
				yAxis : [{
					type : 'value',
					name: '功率(kW)'
				},{
					type:"value",
					name:"电价(元)",
					position:"right",
					min: 0,
			        max: 2
				}],
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
					visualMap: {
			            show:false,
			            seriesIndex:1,
			            dimension:1,
			            pieces: [{
			            	lte:80,
			                gte: 0,
			                color: '#05C12E'
			            }],
			            outOfRange: {
			                color: 'red'
			            }
			        },
					
				series : [{	
					name : '预测负荷',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#00FFFF'
						}
					},
					data : data.forecast
				},{	
					name : '台区负荷',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#05C12E'
						}
					},
					data : data.tgPower
				},{	
					name : '居民负荷',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#FFCC00'
						}
					},
					data : data.usersPower
				},{
					name : '充电桩负荷',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#86B5E0'
						}
					},
					data : data.piesPower
				},{	
					name : '越限负荷',
					type : 'line',
					smooth : false,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : 'red'
						}
					},
					//step:'end',
					data : data.pLim
				},{	
					name : '启调负荷',
					type : 'line',
					smooth : false,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#CB55CE'
						}
					},
					//step:'end',
					data : data.pStart
				},{	
					name : '分时电价',
					type : 'line',
					smooth : false,
					yAxisIndex:1,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#081AD8'
						}
					},
					step:'end',
					data : data.elePrices
				}
			]
			};
		  charts.setOption(option1);
	  }   
	})	
}

function getToday(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	return today;
}

function paramNotNull(){
/*	var date = $('#date').val();
	var orgName = $("#orgName").val();
	if(orgName == null || orgName == ""){
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
	if(date == "" || date == null){
		$.notify({
			message : "请选择查询日期！"
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
	}*/
	/*************************以下为新修改代码************************/
  	
    	var orgName = $("#orgName").val();
    	if(orgName == null || orgName == ""){
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
    	
    	var startTime = $('#startDate').val();
		var endTime = $('#endDate').val();
		if((endTime != undefined && endTime != null && endTime != "") 
				&& (startTime != undefined && startTime != null && startTime != "")) {
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
		
    /************************以上为新修改代码*************************/
}

function initTree(){
    //传入所需要的id属性名
	treeDataList = getUserOrgTree(user.orgNo);
	treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
	orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}