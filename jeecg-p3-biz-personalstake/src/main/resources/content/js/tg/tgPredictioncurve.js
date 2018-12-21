var charts;
$(document).ready(function(){
	//$('#tgName').val('shjpzx001tg001');  //测试数据
	selectInit();
	init();
	timeInit();
	var user = getUserOrg();
	$("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
	$("#orgName").val(user.orgName);
	getSelectItem(); //显示默认组织机构下的台区
	getTgCurves();
	//查询
	$("#search-btn").bind("click",function(){
		//判空操作
		paramNotNull();
		refreshTgCurves();
	});
	//选择组织单位
	$("#orgName").bind("click",function(){
		//获取当前登录用户所属的组织单位
		var userOrg =user.orgNo;
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
	          //  'pageToLoad': 'orderController.do?getOrgNo'
	        	'pageToLoad': 'orderController.do?getUserOrg&userOrg='+userOrg   //获取登录用户所属组织单位及以下级别的组织单位
	        },
	        buttons: [{
	            label: ' 确认',
	            cssClass: 'btn-primary',
	            action: function(dialogRef){
	            	$("#orgNo").val($("#org_no").val());
	            	$("#orgName").val($("#orgnoName").val());
	            	getSelectItem();
	        		dialog.close();
	        		$("#tgNameSelect").change();
	            }
	        }, {
	            label: '取消',
	            action: function(dialogItself){
	                dialogItself.close();
	            }
	        }]
	    });
	    dialog.open();
	});
	
//重置按钮
	$("#reset-btn").bind("click",function(){
		
		//$('#searchForm').get(0).reset();
		$("#searchForm input").val("");
		$('.selectpicker').selectpicker('val', ''); 
		//refreshTgCurves();
		//清空图形数据
		clearCurves();
	})
});

function clearCurves(){
	//更新数据
	var option = charts.getOption();
	option.series[0].data = "";    
	charts.setOption(option); 
}

function timeInit(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	$('#date').datetimepicker({
		//lang:"ch",
		format:	'Y-m-d',
		timepicker:false,
		value:today
	});
	$.datetimepicker.setLocale('ch');
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

	 //跳转的时候加上下面的代码会覆盖前一个页面带过来的台区
    /* $(window).on('load', function() {  
         $('.selectpicker').selectpicker('val', '');  
         $('.selectpicker').selectpicker('refresh');  
     }); */ 
}

function getSelectItem(){
	var orgNo = $('#orgNo').val();
	if(orgNo == ""){
		$.notify({
			message : "请先选择组织单位！"
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
	
    //下拉数据加载  
    $.ajax({  
        type : 'get',  
        url : "monitorController.do?getTgName&orgNo="+orgNo,  
        async:false,
        dataType : 'json',  
        success : function(datas) {//返回list数据并循环获取  
        	$("#tgNameSelect").html(""); //清空select下拉框
            var select = $("#tgNameSelect");  
            for (var i = 0; i < datas.length; i++) {  
                select.append("<option value='"+datas[i].tgId+"'>"  
                        + datas[i].tgName + "</option>");  
            }  
            $('#tgNameSelect').selectpicker('val', '');  
            $('#tgNameSelect').selectpicker('refresh');  
            
        }  
    });  
}

function selectOnchang(obj){
	var tgNo = obj.options[obj.selectedIndex].value;
	var tgName = obj.options[obj.selectedIndex].text;
	if(tgNo != ""){
		$('#tgNo').val(tgNo);
		$('#tgName').val(tgName);
	}
}
function intToTwoStr(num){
	if(num < 10){
		return "0" + num;
	}
	return num;
}

function refreshTgCurves(){
	var date = $('#date').val();
	//var orgNo = $('#orgNo').val(); //供电单位编号
	var orgName = $('#orgName').val();
	var tgNo = $("#tgNameSelect option:selected").val();
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "orgName":orgName,
			  "tgId":tgNo,
			  "date":date
		  },
		  url: "PredictioncurveController.do?tgPredictioncurves",//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){
			  if(!charts){
		          return;
		     }
		     //更新数据
		      var option = charts.getOption();
		      option.series[0].data = data.tgPower;   
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
 	var xIndex = [];
	for (var i = 0; i < 288; i++) {
		var hour = toHour1(i);
		var min = toMinute1(i);
		xIndex.push(hour + ":" + min);
	}
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
	  url: "PredictioncurveController.do?tgPredictioncurves",//后台处理程序,获取显示数据    	
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
					data:['预测曲线'],
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
					data : xIndex
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
					name : '预测曲线',
					type : 'line',
					smooth : true,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#86B5E0'
						}
					},
					data : data.tgPower
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
	var date = $('#date').val();
	var tgNo = $("#tgNameSelect option:selected").val();
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
	if(tgNo == null || tgNo == ""){
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
	}
}
