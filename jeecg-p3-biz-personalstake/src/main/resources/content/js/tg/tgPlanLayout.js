var charts;
var user;
$(document).ready(function(){
	init();
	var user = getUserinfo();
	$('#orgNo').val(user.orgNo);
	$('#orgName').val(user.orgName);
	getTgCurves();
	jeDate("#start_time",{
        format: "YYYY-MM-DD",
        isinitVal:true
    });
    jeDate("#end_time",{
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
		
		//$('#searchForm').get(0).reset();
		$("#searchForm input").val("");
		$('.selectpicker').selectpicker('val', ''); 
		$("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
		$("#orgName").val(user.orgName);
		//refreshTgCurves();
		//清空图形数据
		clearCurves();
	})
});

/*function clearCurves(){
	//更新数据
	var option = charts.getOption();
	option.series[0].data = "";   
	option.series[1].data = "";  
	option.series[2].data = "";  
	charts.setOption(option); 
}*/



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
		 // getSelectItem();
		 $('#tgNameSelect').selectpicker('val',tgNo); 
	 }
}

function refreshTgCurves(){
	var start_time = $('#start_time').val(); //开始日期
	var end_time = $('#end_time').val(); //结束日期
	var orgNo = $('#orgNo').val(); //供电单位编号
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo,
			  "start_time":start_time,
			  "end_time":end_time
		  },							
		  url: "evTg.do?getTgPlanLayout",//后台处理程序,获取显示数据    	
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
		     //更新数据
		      var option = charts.getOption();
		      option.series[0].data = data.tgPower;  
		      
		      option.series[1].data = data.elePrices;  
		      option.series[2].data = data.piesPower;
		      option.series[3].data = data.tgHisPower;
		      option.series[4].data = data.usersPower;
		      option.xAxis[0].data = data.tgTime ;
		      charts.setOption(option); 
		  }
	});
}

//获取台区曲线信息
function getTgCurves(){
	charts = echarts.init(document.getElementById('charts'));  //初始化
	//指定图标的数据和配置项	
	var orgNo = $('#orgNo').val(); //供电单位编号
	var orgName = $('#orgName').val();
	var tgNo = $('#tgNo').val();
	if(tgNo!=""){
		 $('#tgNameSelect').selectpicker('val',tgNo); 
	}
	var date = $('#date').val(); //日期
	$.ajax({   
	  async : false,   //设置为false。请求为同步请求
	  cache:false,   	//不设置缓存
	  type: 'post',   
	  dataType : "json",   
	  data:{
		//  "orgNo":orgNo,
		  "orgName":orgName,
		  "tgId":tgNo,
		  "date":date
	  },
	  url: "evTg.do?getTgPlanLayout",//后台处理程序,获取显示数据    	
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
				/*title : {
					left : 'left',
					text : '台区曲线图',
				},*/
				legend: {
					data:['台区负荷'/*,'预测负荷'*/,'分时电价'/*,'越限负荷','启调负荷'*/,'充电桩负荷','昨日台区负荷','居民负荷'],
			        left:'center'
			    },
			    /*grid:{
			    	left:30,
			    	right:40,
			    	top:30
			    	bottom:0
			    },*/
				xAxis : {
					type : 'category',
					name: '时间(h)',
					boundaryGap : false,
					data :data.tgTime
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
				series : [{	
					name : '台区负荷',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#E51A08'
						}
					},
					data : data.tgPower
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
				}, 
				{
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
					name : '昨日台区负荷',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#E58753'
						}
					},
					data : data.tgHisPower
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
    	
    	var startTime = $('#start_time').val();
		var endTime = $('#end_time').val();
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