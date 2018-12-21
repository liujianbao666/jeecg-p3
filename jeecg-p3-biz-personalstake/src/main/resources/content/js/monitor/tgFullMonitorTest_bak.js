//var tgId;
var charts;
$(document).ready(function(){
	init();
	var user = getUserOrg();
	$("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
	$("#orgName").val(user.orgName);
	getSelectItem(); //显示默认组织机构下的台区
	tableInit();
	$('#tgOrder').colResizable(); //拖动改变列宽
	chartInit();
	//页面刷新
	refresh1();
	selectInit();
	
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
	         //   'pageToLoad': 'orderController.do?getOrgNo'
	        	'pageToLoad': 'orderController.do?getUserOrg&userOrg='+userOrg   //获取登录用户所属组织单位及以下级别的组织单位
	        },
	        buttons: [{
	            label: ' 确认',
	            cssClass: 'btn-primary',
	            action: function(dialogRef){
	            	/*$("#orgNo").val($("#orgNo1").val());
	            	$("#orgName").val($("#orgName1").val());*/
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
	        /*onhidden: function(dialogRef){
	        	var orgNo = $("#orgNo").val();
	        	var tgNo = $('#tgNo').val();
	        	refreshTable();
	        	refreshChart(orgNo,tgNo);
	        	
            }*/
	    });
	    dialog.open();
	});
	
	//点击当前显示台区按钮,跳转到台区曲线页面
	$('#displayTg').bind('click',function(){
		var orgNo = $("#orgNo").val();
		var orgName = $('#orgName').val();
    	var tgNo = $('#tgNo').val();
		var url="queryManageController.do?tgCurve&orgName="+orgName+"&tgNo="+tgNo+"&orgNo="+orgNo;
		var title="台区曲线监控";
		clickT(url,title);
	});
	
})


function selectOnchang(obj){
	/*var tgNo = obj.options[obj.selectedIndex].value;
	var tgName = obj.options[obj.selectedIndex].text;*/
    var tgNo = $("#tgNameSelect option:selected").val();
    var tgName =$("#tgNameSelect option:selected").text();
	$('#tgNo').val(tgNo);
	$('#tgName').val(tgName);
	 //alert(value);
	if(tgNo != "" && tgNo != undefined){
		//左上角显示台区名称
		$('#displayTg').html(tgName+"全景监控");
		//显示查询数据
		doSearch();
	}
	//没有可选台区时，清空图形和列表
	/*else{
		doSearch("");
	}*/
}

function doSearch(){
	refreshTable();  //刷新图表
	refreshChart(); //刷新台区曲线图
	refreshGaugeCharts(); //刷新仪表图
	refreshOrderCharts(); //刷新订单柱状图
	refreshPowerPie();    //刷新充电量饼图
	refreshOrderPie();    //刷新充电订单饼图
	
	getCgInfo(); //获取充电桩信息
	
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
            $('.selectpicker').selectpicker('val', '');
            $('.selectpicker').selectpicker('refresh');
        }  
    });  
}

function selectInit(){
	//台区名称下拉框，模糊查询
	 $(".selectpicker").selectpicker({  
         noneSelectedText : '请输入台区名称'  
     });  

     /*$(window).on('load', function() {
         $('.selectpicker').selectpicker('val', '');  
         $('.selectpicker').selectpicker('refresh');  
     });*/
}
//页面刷新
function refresh1(){
	setInterval(refreshTable, 10000);
	setInterval(refreshChart, 10000);
	setInterval(refreshGaugeCharts, 10000);
	setInterval(refreshOrderCharts, 10000);
	setInterval(refreshPowerPie, 10000);
	setInterval(refreshOrderPie, 10000);
	setInterval(getCgInfo, 10000);
}

function refreshTable(){
	var tgNo = $('#tgNo').val();
	var opt = {
			url : "monitorController.do?getTgInfo&tgId="+tgNo,
		};
    $('#tgOrder').bootstrapTable('refreshOptions',{pageNumber:1});
    $('#tgOrder').bootstrapTable('refresh', opt); 
	//$('#tgOrder').bootstrapTable("refresh");
}

function refreshChart(){
	var tgNo = $("#tgNameSelect option:selected").val();
	//var orgNo = $('#orgNo').val();
	var orgName = $('#orgName').val();
	var date = getToday();
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
		  url: "queryManageController.do?getTgCharts",//后台处理程序,获取显示数据    	
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
		      option.series[1].data = data.forecast;  
		      option.series[2].data = data.elePrices;  
		      option.series[3].data = data.pLim;  
		      option.series[4].data = data.pStart;
		      option.series[5].data = data.piesPower;  
		      /* option.series[4].data = data.usersPower; */
		      
		      charts.setOption(option); 
		  }
	});
}

function init(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	
	$('#date').datetimepicker({
		format:	'Y-m-d',
		timepicker:false,
		value:today
	});
	//$.datetimepicker.setLocale('ch');
	//$("#date").attr("readonly","readonly");
	$('#dateValue').html($('#date').val());
	$("#dateValue").attr("readonly","readonly");
}

function intToTwoStr(num){
	if(num < 10){
		return "0" + num;
	}
	return num;
}

function getToday(){
	var date = new Date();
	var day = intToTwoStr(date.getDate());   //28
	var month = intToTwoStr(date.getMonth()+1);   //4  + 1
	var today = date.getFullYear()+"-"+month+"-"+day;
	return today;
}

function chartInit(){
	charts = echarts.init(document.getElementById('charts'));  //初始化
	//指定图标的数据和配置项	
	var orgNo = $('#orgNo').val(); //供电单位编号
	var tgNo = $('#tgNo').val(); //台区名称
	var date = getToday();
 	var xIndex = [];
 	for (var i = 0; i < 25; i++) {
 		xIndex.push([intToTwoStr(i),intToTwoStr(0)].join(':'));
	}
	$.ajax({   
	  async : false,   //设置为false。请求为同步请求
	  cache:false,   	//不设置缓存
	  type: 'post',   
	  dataType : "json",   
	  data:{
		  "orgNo":orgNo,
		 // "tgName":tgName,
		  "tgNo":tgNo,
		  "date":date
	  },
	  url: "queryManageController.do?getTgCharts",//后台处理程序,获取显示数据    	
	  error: function () {//请求失败处理函数   
		  return false;
	  },   
	  success:function(data){ //请求成功后处理函数。 
		  //解析后台传回来的data，把它传给纵轴
		  var option1={
				backgroundColor:'#fff',
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
			       // data:['典型日负荷','今日台区负荷','今日充电桩负荷','居民用电总负荷','分时电价'],
					//data:['今日台区负荷','今日充电桩负荷','居民用电总负荷','分时电价'],
					data:['台区负荷','预测负荷','分时电价','越限负荷','启调负荷','充电桩负荷'],
			       // left:'center',
			        top:10,
			        x:"center"
			    },
			    grid:{
			    	/*left:30,
			    	top:30*/
			    	left:40,
			    	right:55,
			    	bottom:25
			    },
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
				}/*,{	
					name : '居民用电总负荷',
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
				}*/,{	
					name : '预测负荷',
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
				},{	
					name : '越限负荷',
					type : 'line',
					smooth : false,
					symbol : 'none',
					sampling : 'average',
					itemStyle : {
						normal : {
							color : '#F9A807'
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
				}
			]
			};
		  charts.setOption(option1);
	  }   
	})	
}

function tableInit(){
	//获取tgid
	$('#tgOrder').bootstrapTable({    
	    url:'monitorController.do?getTgMonitorInfo',
	    striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        pagination: true,                   //是否显示分页（*）
        searchOnEnterKey:false,
        clickToSelect:true,
        //sortName:'START_TIME',              //初始化需要排序的列
//        sortStable
        //sortOrder:'desc',                   //需要排序的列的排序方式
        singleSelect:true,
        queryParams: function (params){//传递参数（*）
        	return {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        		limit: params.pageSize,   //页面大小
                offset: params.pageNumber,  //页码
                tgId: $('#tgNo').val(),
                sortOrder: params.sortOrder,//排序方式
                sortName:params.sortName//排序字段
            };
        },
        queryParamsType:"page",
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 5,                       //每页的记录行数（*）
        pageList: [5, 10, 25, 50, 100],        //可供选择的每页的行数（*）
	    columns:[    
	        {title:'序号',width:'5%',halign:"center",align:'center',
            formatter: function (value, row, index) {  
                return index+1;  
            }},     
	        /*{field:'U',title:'电压'},
	        {field:'I',title:'电流'},
	        {field:'P',title:'功率'},*/
            {field:'stakeNo',title:'充电桩编号',visible:false,align:'center',},
            {field:'stakeName',title:'充电桩名称',width:'15%',halign:"center",
            	formatter:function(value, row, index){
            		var orgNo = $('#orgNo').val();
            		var orgName = $('#orgName').val();
            		var tgNo = $("#tgNameSelect option:selected").val()
            		var url="ChargingPileRunController.do?getChargingPileRun&stakeNo="+row.stakeNo+"&stakeName="+value+"&orgName="+orgName+"&orgNo="+orgNo+"&tgNo="+tgNo;
            		var title = "充电桩运行监控";
            		return '<a href="#" onclick="clickT(\'' + url + '\',\''+title+'\')" style="color:blue">'+value+'</a>';
            		
            	}},
	        {field:'orderId',title:'订单编号',width:'10%',halign:"center",align:'center',
            	formatter:function(value, row, index){
            		var orgNo = $('#orgNo').val();
            		var orgName = $('#orgName').val();
            		var tgNo = $("#tgNameSelect option:selected").val();
            		var url="orderController.do?orderQuery&ordNo="+value+"&stakeNo="+row.stakeNo+"&orgName="+orgName+"&orgNo="+orgNo+"&tgNo="+tgNo;
            		var title = "充电需求管理";
            		return '<a href="#" onclick="clickT(\'' + url + '\',\''+title+'\')" style="color:blue">'+value+'</a>';
            	}},
	        {field:'chargeType',title:'充电类型',width:'8%',halign:"center",align:'center',
	        	formatter:function(value, row, index){
	        		if(value == 1){
	        			return "正常充电";
	        		}
	        		else if(value == 2){
	        			return "有序充电";
	        		}
	        	}},
	        {field:'START_TIME',title:'充电开始时间',halign:"center",align:'center',width:'15%',sortable:true},
	        {field:'VUSE_TIME',title:'用车时间',halign:"center",align:'center',width:'15%',sortable:true},
	        {field:'finishedCap',title:'已充电量(kW·h)',halign:"center",align:"right"},
	        {field:'goalCap',title:'目标电量(kW·h)',halign:"center",align:"right"},
	        {field:'orderState',title:'订单状态',halign:"center",width:'8%',align:'center',
	        	formatter:function(value,row,index){
	        		if(value==1){
	        			return "待执行";
	        		}else if(value==2){
	        			return "正执行"; 
	        		}else if(value==2){
	        			return "正执行"; 
	        		}else if(value ==3){
	        			return "降低执行";
	        		}else if(value ==4){
	        			return "暂停";
	        		}else if(value ==9){
	        			return "保底执行";
	        		}
	        	}
	        		
	        }
	    ],
	    onClickRow:function(row,$element,field){
        	$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
        }
	});
}
//页面跳转方法
function clickT(url,title){
	parent.openNewTab(url,title);
}

function handCursor(){
	$('#displayTg').css("cursor","pointer");
}