var chart;
var chart1;
var user;	
var tgNoParam;
$(document).ready(function(){
	
	 user = getUserOrg();
     var userOrg =user.orgNo;
     $('#orgNo').val(user.orgNo);
     $('#orgName').val(user.orgName);
     var urlQueryTree = "orgController.do?myQuery&pid="+userOrg;
     $.ajax({
         async : false,
         cache:false,
         type: 'POST',
         dataType : "json",
         url: urlQueryTree,//请求的action路径
         error: function () {//请求失败处理函数
             alert('请求失败');
         },
         success:function(data){ //请求成功后处理函数。
             treeDataList = data;   //把后台封装好的简单Json格式赋给treeNodes
         }
     });
     initTree();
     tgNoParam = "";
     
     
	 chartInit(); //桩实时充电量
	 chart1Init(); //桩实时电流、电压、功率
	 
	 //查询按钮
	 $('#search-btn').bind("click",function(){
		 
		if($.fn.zTree.getZTreeObj("treeDemo").getSelectedNodes()[0].isParent){
			
			$.notify({
				message : "请选择台区！"
			}, {
				type : "warning",
				z_index : 9999,
				placement : {
					from : "bottom",
					align : "right"
				},
				delay : 2000
			});
		}else{
			
			 tgNoParam = $.fn.zTree.getZTreeObj("treeDemo").getSelectedNodes()[0].id;  //台区级别
		}
		 
		
		 
		 refreshChart();
		 refreshChart1();
	 })
	 //重置按钮
    $("#run-reset-btn").bind("click",function(){
        $("#stakeNo").val("");
        $("#stakeName").val("");
        //$("#orgNo").val("");
        $("#tgNo").val("");
        initTree();
        tgNoParam = "";
        $('.selectpicker').selectpicker('val', '');
        $("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
   	 	$("#orgName").val(user.orgName);
        refreshChart();
    })
	    

})


//刷新图表2
function refreshChart1(){
	var tgNo= tgNoParam;
	$.ajax({
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',
		  dataType : "json",
		  data:{
			  "tgNo":tgNo
		  },
		  url: "runManageController.do?getChargeRunData",//后台处理程序,获取显示数据
		  error: function () {//请求失败处理函数
			  return false;
		  },
		  success:function(data){
			  if(!chart1){
		          return;
		     }
		     //更新数据
			  var xx = new Array();
			  for(var i = 1;i <= data.count;i++){
				  xx.push(i);
			  }
		      var option = chart1.getOption();
		      option.series[0].data = data.runI;
		      option.series[1].data = data.runU;
		      option.xAxis[0].data = xx;
		      chart1.setOption(option);
		  }
	});
}
//初始化图表2
function chart1Init(){
	chart1 = echarts.init(document.getElementById('runChart1'));  //初始化
	var tgNo= tgNoParam;
	
	$.ajax({
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  url: "runManageController.do?getChargeRunData",//后台处理程序,获取显示数据
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  data:{
			  tgNo:tgNo
		  },
		  success:function(data){ //请求成功后处理函数。 
			  //解析后台传回来的data，把它传给纵轴
			  var xx = new Array();
			  for(var i = 1;i <= data.count;i++){
				  xx.push(i);
			  }
			  var option1={
					tooltip : {
						trigger : 'axis',
						position : function(pt) {
							return [ pt[0], '10%' ];
						}
					},
					/* title : {
						left : 'left',
						text : '',
					}, */
					 legend: {
				        data:['电流','电压'],
				        left:'center'
				    }, 
				    grid:{
				    	left:30,
				    	right:60,
				    	top:30
				    },
					xAxis : {
						type : 'category',
						name: '桩个数',
						boundaryGap : true,
						data : xx
					},
					yAxis : [{
						type:"value",
						name:"电压(V)"
					},{
						type:"value",
						name:"电流(A)"
					}],
					/*dataZoom : [
						{
							type : 'inside',
							start : 0,
							end : 100
						}],  */
					series : [{	
						name : '电流',
						type : 'bar',
						smooth : false,
						yAxisIndex:1,
						symbol : 'none',
						sampling : 'average',
						/*itemStyle : {
							normal : {
								color : '#081AD8'
							}
						},*/
						//step:'end',
						data : data.runI
					},{	
						name : '电压',
						type : 'bar',
						smooth : false,
						//yAxisIndex:1,
						symbol : 'none',
						sampling : 'average',
						/*itemStyle : {
							normal : {
								color : '#000'
							}
						},*/
						//step:'end',
						data : data.runU
					}
				]
				};
			  chart1.setOption(option1);
		  }   
		})	
}
// 刷新图表
function refreshChart(){
	var tgNo= tgNoParam;
	$.ajax({
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',
		  dataType : "json",
		  data:{
			  "tgNo":tgNo
		  },
		  url: "runManageController.do?getChargeRunData",//后台处理程序,获取显示数据
		  error: function () {//请求失败处理函数
			  return false;
		  },
		  success:function(data){
			  if(!chart){
		          return;
		     }
		     //更新数据
			  var xx = new Array();
			  for(var i = 1;i <= data.count;i++){
				  xx.push(i);
			  }
		      var option = chart.getOption();
		      option.series[0].data = data.runP;
		      option.series[1].data = data.peak;
		      option.series[2].data = data.peace;
		      option.series[3].data = data.spot;
		      option.series[4].data = data.vally;
		      option.xAxis[0].data = xx;
		      chart.setOption(option);
		  }
	});
}
//初始化图表
function chartInit(){
	chart = echarts.init(document.getElementById('runChart'));  //初始化
	var tgNo= tgNoParam;
	
	$.ajax({
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  url: "runManageController.do?getChargeRunData",//后台处理程序,获取显示数据
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  data:{
			  tgNo:tgNo
		  },
		  success:function(data){ //请求成功后处理函数。 
			  //解析后台传回来的data，把它传给纵轴
			  var xx = new Array();
			  for(var i = 1;i <= data.count;i++){
				  xx.push(i);
			  }
			  var option1={
					tooltip : {
						trigger : 'axis',
						position : function(pt) {
							return [ pt[0], '10%' ];
						}
					},
					/* title : {
						left : 'left',
						text : '分时电价',
					}, */
					 legend: {
				        data:['功率','尖电量','峰电量','平电量','谷电量'],
				        left:'center'
				    }, 
				    grid:{
				    	left:30,
				    	right:60,
				    	top:30
				    },
					xAxis : {
						type : 'category',
						name: '桩个数',
						boundaryGap : true,
						data : xx
					},
					yAxis : [{
						type:"value",
						name:"电量(kVA)"
					},{
						type:"value",
						name:"功率(kW)"
					}],
					/*dataZoom : [
						{
							type : 'inside',
							start : 0,
							end : 100
						}],  */
					series : [{
						name:'尖电量',
						type:'bar',
			            stack: '电量',
			            data:data.peak
					},{
						name:'峰电量',
						type:'bar',
			            stack: '电量',
			            data:data.peace
					},{
						name:'平电量',
						type:'bar',
			            stack: '电量',
			            data:data.spot
					},{
						name:'谷电量',
						type:'bar',
			            stack: '电量',
			            data:data.vally
					},{	
						name : '功率',
						type : 'bar',
						smooth : false,
						yAxisIndex:1,
						symbol : 'none',
						sampling : 'average',
						/*itemStyle : {
							normal : {
								color : '#000'
							}
						},*/
						//step:'end',
						data : data.runP
					}
				]
				};
			  chart.setOption(option1);
		  }   
		})	
}


function initTree(){
    //传入所需要的id属性名
      treeDiv("treeDemo","treeDiv","orgName","orgNo",treeDataList);
      orgSearch('treeDemo','#orgName',null,true); //初始化模糊搜索方法
}