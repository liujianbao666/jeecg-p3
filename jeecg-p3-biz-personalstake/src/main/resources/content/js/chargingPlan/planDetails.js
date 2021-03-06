var xIndex = [];
var planPower = [];
var getPower = [];
$(document).ready(function(){
	// 调度信息
	planDetail();
})

var orderId;
// 调度信息
function planDetail(){
	
	orderId = $("#orderId_new").val();
    // 颜色
    var lightBlue = {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
            offset: 0,
            color: 'rgba(41, 121, 255, 1)' // 0% 处的颜色
        }, {
            offset: 1,
            color: 'rgba(0, 192, 255, 1)' // 100% 处的颜色
        }],
        globalCoord: false // 缺省为 false
    }
// 纹理
    var piePane = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAKElEQVQ4jWP8//8/AwXgPxMluhkYGBhGDRg1YNQAKhnAwsDAQFF+BgBtSwUd6uvSywAAAABJRU5ErkJggg=='
    var piePatternImg = new Image();
    piePatternImg.src = piePane;
	var mychartdd = echarts.init(document.getElementById('schedu'));
	$.ajax({
		async : false, // 设置为false。请求为同步请求
		cache : false, // 不设置缓存
		type : 'get',
		dataType : "json",
		data : {
		    "orderId":orderId,
		},
		url : "schedulingController.do?getScheduling",// 后台处理程序,获取显示数据
		error : function() {// 请求失败处理函数
			return false;
		},
		success : function(data) {
			
			var startIndex = parseInt(data.start);
			var endIndex = parseInt(data.firstEnd)+startIndex;
			var count = parseInt(data.firstEnd);
			for (var i = startIndex; i <= endIndex; i++) {
				// 充电时间大于200点时，每个小时为一条
				if (count >= 200) {
					getTime(data,i, startIndex,endIndex, count, 12);
				// 充电时间大于100小于200时，半小时为一条
				} else if (count >= 100) {
					getTime(data,i, startIndex,endIndex, count, 6);
				// 充电时间大于20小于100时，15分钟为一条
				} else if (count >= 20) {
					getTime(data,i, startIndex,endIndex, count, 3);
				// 充电时间小于20时，5分钟为一条
				} else {
					getPower.push(data.allCap[i - startIndex]);
					planPower.push(data.allPlan[i - startIndex]);
					var hour = to288Hour(i);
					var min = to288Minute(i);
					xIndex.push(hour + ":" + min);
				}
			}
			var totol = new Array();
			for(var i=0;i<xIndex.length-1;i++){
			    totol.push(50)
            }
    option = {
        title: {
            left: '50%',
            textAlign: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#FAC220'
                }
            },
            backgroundColor: 'rgba(255,255,255,0.5)',
            padding: [5, 10],
            textStyle: {
                color: '#7588E4',
            },
            extraCssText: 'box-shadow: 0 0 5px rgba(0,0,0,0.3)'
        },
        legend: [{
            top:40,
            data: ['充电电量','充电功率'],
            x:"center",

        }],
        xAxis: {
            type: 'category',
            name:'时间',
            data: xIndex,
            boundaryGap: false,
            splitLine: {
                show: false,
                interval: 'auto',
                lineStyle: {
                    color: ['#EEEEEE']
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#50697A'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    color:'#50697A',
                    fontSize: 13
                }
            }
        },
        yAxis: [
		        {
		        	//纵轴标尺固定 
		        	type: 'value', 
		        	name: '功率(KW)', 
		        	scale: true, 
		        	max: 100, 
		        	min: 0, 
		        	splitNumber:10, 
		        	boundaryGap: [0.2, 0.2] 
		        },
		        {
		            type: 'value',
		            name: '电量(kW·h)',
                    min:0,
                    max:100,
                    scale: true, 
		        	splitNumber:10, 
		        	boundaryGap: [0.2, 0.2]
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
							shadowOffsetY : 6
						}
					}],
        series: [
            {
                type: 'bar',
                name: '充电电量',
                label: {
                    show: true,
                    position: 'top',
                    padding: 10,
                    color: '#2979ff',
                    fontSize: 14,
                    formatter:function (value,index){
                    	var temp = (parseFloat(value.value)*2);
                    	temp =temp.toFixed(2);
                    	return	temp+"%";
                    }  
                },
                itemStyle: {
                    color: lightBlue
                },
                barWidth: '40%',
                data: getPower,
                z: 10
            },{
                name:'充电功率',
                type : 'line',
    			smooth : true,
    			symbol : 'none',
    			sampling : 'average',
    			itemStyle : {
    				normal : {
    					color : '#FAC220'
    				}
    			},
                data:planPower,
            },{
                type: 'bar',
                name: '汽车容量',
                barGap: '-100%',
                itemStyle: {
                    color: '#536dfe',
                    opacity: 0.2
                },
                barWidth: '40%',
           
                data: totol,
                z: 5

        }]
    };
    mychartdd.setOption(option);
		}
	});
}

function renderItem(params, api) {
    var yValue = api.value(2);
    var start = api.coord([api.value(0), yValue]);
    var size = api.size([api.value(1) - api.value(0), yValue]);
    var style = api.style();
    return {
        type: 'rect',
        shape: {
            x: start[0],
            y: start[1],
            width: size[0],
            height: size[1]
        },
        style: style
    };
}


//动态展示数据以及生成x轴
function getTime(data,i,startIndex,endIndex,count,decide){
	if(i == startIndex){
		getPower.push(data.allCap[0]);
		planPower.push(data.allPlan[0]);
		xIndex.push(getDateFormat(i));
	}else if(i == endIndex+1){
		getPower.push(data.allCap[count-1]);
		planPower.push(data.allPlan[count-1]);
		xIndex.push(getDateFormat(i));
	}else if((startIndex+i) % decide == 0){
		getPower.push(data.allCap[i - startIndex]);
		planPower.push(data.allPlan[i - startIndex]);
		xIndex.push(getDateFormat(i));
	}
}

function getDateFormat(i){
	var hour = to288Hour(i);
	var min = to288Minute(i);
	console.log(hour + ":" + min);
	return hour + ":" + min;
}

//页面跳转方法
function clickT(url,title){
	var url="lifeCycleController.do?lifeCycle&orderId="+orderId;
	parent.openNewTab(url,title);
}