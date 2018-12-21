var yesCharts;

//刷新表格
function refreshTable(orgNo){
	var opt = {
		url : "monitorController.do?getTableData&tg_id="+orgNo,
	};
	$('#Tableid').bootstrapTable('refresh', opt); 
 
}

//获取当前选中的组织单位
function getOrgNo(){
	 var treeObj=$.fn.zTree.getZTreeObj("treeDemo");
     var nodes=treeObj.getSelectedNodes(true);
     var node = nodes[0];
     var orgNo = node.id;
     return orgNo;
}


//刷新图表
function refreshChart(orgNo){
	
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tg_id":orgNo
		  },
		  url: "monitorController.do?getRealChartsItem",//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){
			  if(!yesCharts){
		          return;
		     }
		     
		     //更新数据
		      var option = yesCharts.getOption();
		      option.series[0].data = data.price;   
		      yesCharts.setOption(option); 
		  }
	});
}




//获取三条折线图信息
function getRealCharts(tg_id_init){
 yesCharts = echarts.init(document.getElementById('charts'));  //初始化
	
 var date = [];
	for (var i = 0; i < 96; i++) {
		var hour = Math.floor((i*15)/60);
		var minute = (i*15)%60;
		date.push([intToTwoStr(hour),intToTwoStr(minute)].join(':'));
	}
	$.ajax({   
	  async : false,   //设置为false。请求为同步请求
	  cache:false,   	//不设置缓存
	  type: 'post',   
	  dataType : "json",   
	  data:{
		  "tg_id":tg_id_init
	  },
 	  url: "monitorController.do?getRealChartsItem",//后台处理程序,获取显示数据    	
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
				title : {
					left : 'left',
					text : '台区曲线图',
				},
				legend: {
					//'典型日负荷', '今日台区负荷','今日充电桩负荷','居民用电总负荷','分时电价'
			        data:['台区日负荷','负荷预测','分时电价'],
			        left:'center'
			    },
				xAxis : {
					type : 'category',
					name: '时间(h)',
					boundaryGap : false,
					data : date
				},
				yAxis : [{
					type : 'value',
					name: '功率(kW)'
				},{
					type:"value",
					name:"电价(元)",
					position:"right",
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
					name : '台区日负荷',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#05C12E'
						}
					},
					data : data.forecast
				},{	
					name : '负荷预测',
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
					name : '分时电价',
					type : 'line',
					smooth : true,
					yAxisIndex:1,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#081AD8'
						}
					},
					data : data.price
				}
			]
			};
			yesCharts.setOption(option1);
	  }   
	})	
}

//获取条形图信息
function getLineCharts(){
	var yesCharts2 = echarts.init(document.getElementById('container'));  //初始化
	option = {
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: {
		            type: 'cross',
		            crossStyle: {
		                color: '#999'
		            }
		        }
		    },
		    legend: {
		        data:['有序充电','正常充电']
		    },
		    xAxis: [
		        {
		            type: 'category',
		            name:'时间(h)',
		            data: ['0:00','2:00','4:00','6:00','8:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00'],
		            axisPointer: {
		                type: 'shadow'
		            }
		        }
		    ],
		    yAxis: [
		        {
		            type: 'value',
		            name: '订单数(个)',
		            min: 0,
		            max: 50,
		            interval: 10,
		            axisLabel: {
		                formatter: '{value}'
		            }
		        },
		    ],
		    series: [
		        {
		            name:'有序充电',
		            type:'bar',
		            data:[2.0, 4.9, 7.0, 2.2, 30.6, 17.7, 13.6, 36.2, 31.6, 28.0, 26.4, 30.3]
		        },
		        {
		            name:'正常充电',
		            type:'bar',
		            data:[20.6, 5.9, 9.0,16.4, 18.7, 27.7, 17.6, 18.2, 34.7, 18.8, 36.0, 28.3]
		        },
		    ]
		};
	yesCharts2.setOption(option);
	
} 
//饼图
function  getGaugeCharts(){
	var yesCharts3 = echarts.init(document.getElementById('Gauge'));  //初始化
    $.ajax({
        async: false,   //设置为false。请求为同步请求
        cache: false,   	//不设置缓存
        type: 'post',
        dataType: "json",
        url: "monitorController.do?getGaugeChartsItem",//后台处理程序,获取显示数据
        error: function () {//请求失败处理函数
            return false;
        },
        success:function(data){
            var option = {
                tooltip : {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                series: [{
    		    	startAngle: 180, //开始角度 左侧角度
    		    	endAngle: 0, //结束角度 右侧
    		    	name: '负载率',
    		    	type: 'gauge',
    		    	center: ['50%', '80%'], // 默认全局居中
    		    	radius: '130%',
    		    	min: 0,
    		    	max: 100, //河流最大条数
    		    	splitNumber: 10,
    		    	axisLine: { // 坐标轴线
    		    	lineStyle: { // 属性lineStyle控制线条样式
    		    color: [
    		    	[data.rate/100, '#4F8BBF'],//根据实际数据动态改变
    		    	[1, '#DCDDDD'],
    		    	[1, '#DCDDDD']
    		    	],
    		    	width: 10, //半径
    		    	shadowColor: '#fff', //默认透明
    		    	shadowBlur: 1
    		    	}
    		    	},
    		    pointer: {
    		    	width: 3,
    		    	color: '#D6654E',
    		    	length: "80%",
    		    	},
    		    	axisLabel: {
    		    	//show:false,
    		    	// 坐标轴小标记
    		    textStyle: { // 属性lineStyle控制线条样式
    		    	fontWeight: 'bolder',
    		    	color: 'transparent', //刻度数字颜色 隐藏
    		    	shadowColor: '#fff', //默认透明
    		    	shadowBlur: 10
    		    	}
    		    	},
    		    axisTick: { // 坐标轴小标记
    		    	length: 12, // 属性length控制线长
    		    	lineStyle: { // 属性lineStyle控制线条样式
    		    	color: 'transparent', //坐标轴 小刻度线颜色
    		    	shadowColor: '#fff', //默认透明
    		    	shadowBlur: 10
    		    	}
    		    	},
    		    splitLine: { // 分隔线
    		    	length: 20, // 属性length控制线长
    		    	lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
    		    	width: 3,
    		    	color: 'transparent', //分割线
    		    	shadowColor: '#fff', //默认透明
    		    	shadowBlur: 10
    		    	}
    		    	},
    		    title: {
    		    	offsetCenter: [0, '-110%'], // x, y，单位px
    		    	textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
    		    	fontWeight: 'bolder',
    		    	fontStyle: 'italic',
    		    	color: '#000',
    		    	shadowColor: '#fff', //默认透明
    		    	shadowBlur: 10
    		    	}
    		    	},
    		    detail: { //show : true ,
    		    	borderColor: '#fff',
    		    	shadowColor: '#fff', //默认透明
    		    	width: 80,
    		    	height: 30,
    		    	offsetCenter: [0, '10%'], // x, y，单位px
    		    	textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
    		    	fontWeight: 'bolder',
    		    	fontSize: 14,
    		    	color: '#000'
    		    	},
    		    	formatter: '{value}%'
    		    	    },
    		    	data: [{
    		    	   value: data.rate,
    		    	   name:"负载率"
    		    	}]
    		    	}] 
            };
            yesCharts3.setOption(option);
        }
    })
}
//表格
function TableInit(tg_id_init) {
	$('#Tableid').bootstrapTable({
        url: 'monitorController.do?getTableData',      //请求后台的URL（*）
 	   // striped: true,                      //是否显示行间隔色
         cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
         showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
         cardView: false,                    //是否显示详细视图
         detailView: false,                   //是否显示父子表
         searchOnEnterKey:false,
         clickToSelect:true,
         singleSelect:true,
        columns: [{
            checkbox: true,
            
        }, {
            field: 'id',
            title: '充电桩编号',
           
        }, {
            field: '',
            title: '订单'
        }, {
            field: '',
            title: '订单数量'
        }, {
            field: '',
            title: '充电分类'
        },{
            field: '',
            title: '充电类型'
        },{
            field: '',
            title: '充电电量'
        },{
            field: '',
            title: '充电功率'
        },{
            field: '',
            title: '预计充电时间'
        } ]
    });

};
//刷新表格
function refreshTable(){
	$('#Tableid').bootstrapTable("refresh");
}



