var chart;
$(document).ready(function(){
	
	var user = getUserOrg() ;
	$('#orgName').val(user.orgName);
	$('#orgNo').val(user.orgNo);
	getSelectItem(); //显示默认组织机构下的台区
	chartInit();
	
	//查询按钮
	$('#search-btn').bind("click",function(){
		refreshChart();
	})
	
	//弹出组织单位
	$('#orgName').bind("click",function(){
		//获取当前登录用户所属的组织单位
		//var userOrg = user.orgNo;
		
		var dialog = new BootstrapDialog({
			title: '组织单位',
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
	        //  'pageToLoad': 'monitorController.do?getMultiOrgNo'  //组织单位多选
	           // 'pageToLoad': 'orderController.do?getOrgNo'   //组织单位单选
	        	//'pageToLoad': 'orderController.do?getUserOrg&userOrg='+userOrg   //获取登录用户所属组织单位及以下级别的组织单位
	        	'pageToLoad': 'runManageController.do?getPcOrg'
	        },
	        buttons: [{
	            label: ' 确认',
	            cssClass: 'btn-primary',
	            action: function(dialogRef){
	            	$("#orgNo").val($("#org_no").val());
	            	$("#orgName").val($("#orgnoName").val());
                    getSelectItem();
                    $("#tgNameSelect").change();
	        		dialog.close();
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
})


function refreshChart(){
	var orgNo = $('#orgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgNo":orgNo
		  },
		  url: 'runManageController.do?getCityChargeData',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取市级全景饼图失败！");
			  return false;
		  },   
		  success:function(data){
			  if(!chart){
		          return;
		     }
			  //根据date 
			  if(data.flag == false){
				  quickNotify(data.msg,"warning");
				  return false;
			  }
			  else if(data.flag == true){
				//有数据情况下的数据更新
				  var option = chart.getOption();
				  option.series[0].data=[
                    {value:data.optNum, name:'有序充'},
					{value:data.normalNum, name:'正常充'},
					{value:data.waitNum, name:'待机数'},
					{value:data.badNum, name:'故障数'}]
				  chart.setOption(option);
			  }
		  }
	});
}
function chartInit(){
	chart = echarts.init(document.getElementById('cityChart'));  //初始化
	var orgNo = $('#orgNo').val();
	
	$.ajax({
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  url: "runManageController.do?getCityChargeData",//后台处理程序,获取显示数据
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  data:{
			  orgNo:orgNo
		  },
		  success:function(data){ //请求成功后处理函数。 
			  //解析后台传回来的data，把它传给纵轴
			  var option1;
			  if(data.flag == false){
				  quickNotify(data.msg,"warning");
				  return false;
			  }
			  else if(data.flag == true){
				  option1={
					/*tooltip : {
						trigger : 'axis',
						position : function(pt) {
							return [ pt[0], '10%' ];
						}
					},*/
					/* title : {
						left : 'left',
						text : '',
					}, */
					 legend: {
				        data:['有序充','正常充','待机数','故障数'],
				        left:'center'
				    }, 
				    tooltip : {
				        trigger: 'item',
				        formatter: "{a} <br/>{b} : {c} ({d}%)"
				    },
				    grid:{
				    	left:30,
				    	right:60,
				    	top:30
				    },
					series : [{	
						name : '访问来源',
						type : 'pie',
						radius : '55%',
			            center: ['50%', '55%'],
			            data:[
				                {value:data.optNum, name:'有序充'},
				                {value:data.normalNum, name:'正常充'},
				                {value:data.waitNum, name:'待机数'},
				                {value:data.badNum, name:'故障数'},
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
					}]
				};
			  }
			  
			  chart.setOption(option1);
		  }   
		})	
} 
