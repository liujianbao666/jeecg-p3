var charts;
$(document).ready(function(){
	jeDate("#startDate", {
        format : "YYYY-MM-DD",
        isinitVal:true
	});
    jeDate("#endDate", {
        format : "YYYY-MM-DD",
        isinitVal:true
    });
	getCgCurves();
	// 查询
	$("#search-btn").bind("click", function() {
		// 判空操作
		var cgId = $("#cgId").val();
		var startDate = $("#startDate").val();
	    var endDate = $("#endDate").val();
		if(cgId == null||cgId == ""){
			$.notify({
				message : "请输入充电桩编号！"
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
		if(startDate == "" || startDate == null){
			$.notify({
				message : "请选择开始日期！"
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
	    if(endDate == "" || endDate == null){
	        $.notify({
	            message : "请选择结束日期！"
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
		refreshTgCurves();
	});

	// 重置按钮
	$("#reset-btn").bind("click", function() {
		$("#cgId").val("");
		// 清空图形数据
		clearCurves();
	})
});

function clearCurves(){
	//更新数据
	var option = charts.getOption();
	option.series[0].data = "";
	option.series[1].data = "";
	option.series[2].data = "";
	charts.setOption(option);
}

function refreshTgCurves(){
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var cgId = $('#cgId').val();
	$.ajax({
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',
		  dataType : "json",
		  data:{
			  "cgId":cgId,
			  "startDate":startDate,
			  "endDate":endDate
		  },
		  url: "evCg.do?getCgEcharts",//后台处理程序,获取显示数据
		  error: function () {//请求失败处理函数
			  return false;
		  },
		  success:function(data){
			  if(!charts){
		          return;
		     }
			  if((!data.historyPowerData) || (data.historyPowerData.length == 0 &&
					  data.historyPowerData.length == 0 &&
					  	data.historyElectricData.length == 0)){
				  $.notify({
					  message : "今日没有该充电桩数据!"
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
		     //更新数据
		      var option = charts.getOption();
		      
		      var historyPowerDataArr = new Array();
		      for(var i=0;i< data.historyPowerData.time.length;i++){
		    	  historyPowerDataArr[i]=new Array();
		    	  historyPowerDataArr[i][0]=data.historyPowerData.time[i];
		    	  historyPowerDataArr[i][1]=data.historyPowerData.data[i];
		      }
		      option.series[0].data = historyPowerDataArr;
		      
		      var historyVoltageDataArr = new Array();
		      for(var i=0;i< data.historyVoltageData.time.length;i++){
		    	  historyVoltageDataArr[i]=new Array();
		    	  historyVoltageDataArr[i][0]=data.historyVoltageData.time[i];
		    	  historyVoltageDataArr[i][1]=data.historyVoltageData.data[i];
		      }
		      option.series[1].data = historyVoltageDataArr;
		      
		      var historyElectricDataArr = new Array();
		      for(var i=0;i< data.historyElectricData.time.length;i++){
		    	  historyElectricDataArr[i]=new Array();
		    	  historyElectricDataArr[i][0]=data.historyElectricData.time[i];
		    	  historyElectricDataArr[i][1]=data.historyElectricData.data[i];
		      }
		      option.series[2].data = historyElectricDataArr;
		      charts.setOption(option);
		  }
	});
}

//获取充电桩曲线信息
function getCgCurves(){
	charts = echarts.init(document.getElementById('charts'));  //初始化
	//指定图标的数据和配置项
	var cgId = $('#cgId').val();
	var startDate = $('#startDate').val(); //日期
    var endDate = $('#endDate').val(); //日期
	$.ajax({
	  async : false,   //设置为false。请求为同步请求
	  cache:false,   	//不设置缓存
	  type: 'post',
	  dataType : "json",
	  data:{
		  "cgId":cgId,
		  "startDate":startDate,
          "endDate":endDate,
	  },
	  url: "evCg.do?getCgEcharts",//后台处理程序,获取显示数据
	  error: function () {//请求失败处理函数
		  return false;
	  },
	  success:function(data){ //请求成功后处理函数。
		  //解析后台传回来的data，把它传给纵轴
          stakeOption = {
              tooltip: {
                  trigger: 'axis',
              },
              legend: {
					data:['功率(kw)','电压(V)','电流(A)'],
			        left:'center'
			    },
		      color:['#FF0000','#800080','#00FF7F'],
              xAxis: {
            	  name:'时间(h)',
                  type: 'time',
                  splitLine: {
                      show: false
                  }
              },
              yAxis: {
                  type: 'value',
                  boundaryGap: [0, '100%'],
                  splitLine: {
                      show: false
                  }
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
              series: [{
					name : '功率(kw)',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					data : data.historyPowerData
				},{
					name : '电压(V)',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					data : data.historyVoltageData
				},{
					name : '电流(A)',
					type : 'line',
					smooth : false,
					symbol : 'none',
					sampling : 'average',
					step:'end',
					data : data.historyElectricData
				}]
          };
		  charts.setOption(stakeOption);
      }
	})
}



