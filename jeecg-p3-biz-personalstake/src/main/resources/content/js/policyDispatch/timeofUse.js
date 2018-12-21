
var chart;
var orgNo;
var orpid;
$(document).ready(function(){
	getPriceChart();
	initTableInfo();
	var user = getUserOrg();
	$("#orgNo").val(user.orgNo);//将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
	$("#orgName").val(user.orgName);
	//getSelectItem(); //显示默认组织机构下的台区
	//新建按钮点击
	$("#add-btn").bind("click",function(){
		orgCheck();
		var dialog = new BootstrapDialog({
	        title: '新建电价时段',
	        size:"size-small",
	        type:BootstrapDialog.TYPE_DEFAULT,
	        message: function(dialog) {
	            var $message = $('<div></div>');
	            var pageToLoad = dialog.getData('pageToLoad');
	            $message.load(pageToLoad);
	            return $message;
	        },
	        closable: false,
	        data: {
	            'pageToLoad': 'policyController.do?add'
	        },
	        buttons: [{
	            label: '保存',
	            cssClass: 'btn-primary',
	            action: function(dialogRef){
	                createNewPhase(dialog);
	            }
	        }, {
	            label: '取消',
	            action: function(dialogItself){
	                dialogItself.close();
	            }
	        }]
	    });
	    dialog.open();
	})
	//编辑按钮点击
	$("#edit-btn").bind("click",function(){
		orgCheck();
		var selects= $('#priceDg').bootstrapTable('getSelections');  
		if(selects.length == 0 || selects.length > 1){
			quickNotify("请先选择一条数据！", "danger");
			return;
		}
		else{
			var dialog = new BootstrapDialog({
		        title: '修改电价时段',
		        size:"size-small",
		        type:BootstrapDialog.TYPE_DEFAULT,
		        message: function(dialog) {
		            var $message = $('<div></div>');
		            var pageToLoad = dialog.getData('pageToLoad');
		            $message.load(pageToLoad);
		            return $message;
		        },
		        closable: false,
		        data: {
		            'pageToLoad': 'policyController.do?modify'
		        },
		        buttons: [{
		            label: '保存',
		            cssClass: 'btn-primary',
		            action: function(dialogRef){
		                editPhase(dialog);
		            }
		        }, {
		            label: '取消',
		            action: function(dialogItself){
		                dialogItself.close();
		            }
		        }]
		    });
		    dialog.open();
		}
		
	})
	
	//删除按钮点击
	$("#remove-btn").bind("click",function(){
		orgCheck();
		var selects= $('#priceDg').bootstrapTable('getSelections');  
		if(selects.length == 0 || selects.length > 1){
			quickNotify("请先选择一条数据！", "danger");
			return;
		}
		else{
			
			var dialog = new BootstrapDialog({
		        title: '删除电价时段确认',
		        size:"size-small",
		        type:BootstrapDialog.TYPE_DEFAULT,
		        message: function(dialog) {
		            var $message = $('<div></div>');
		            var pageToLoad = dialog.getData('pageToLoad');
		            $message.load(pageToLoad);
		            return $message;
		        },
		        closable: false,
		        data: {
		            'pageToLoad': 'policyController.do?deletePrice'
			        },
			        buttons: [{
			            label: '确认删除？',
			            cssClass: 'btn-primary',
			            action: function(dialogRef){
			                deletePhase(dialog);
			            }
			        }, {
			            label: '取消',
			            action: function(dialogItself){
			                dialogItself.close();
			            }
			        }]
		    });
		    dialog.open();
		}
		
	});
	
	//弹出组织单位
	$('#orgName').bind("click",function(){
		//获取当前登录用户所属的组织单位
		var userOrg =user.orgNo;
		var dialog = new BootstrapDialog({
			title: '组织单位',
	        size:'size-small',
	        type:BootstrapDialog.TYPE_DEFAULT,
	        message: function(dialog) {
	            var $message = $('<div></div>');
	            var pageToLoad = dialog.getData('pageToLoad');
	            $message.load(pageToLoad);
	            return $message;
	        },
	        closable: false,
	        data: {
	          //  'pageToLoad': 'policyController.do?orgNoSelect'
	        	'pageToLoad': 'policyController.do?orgNoSelect&userOrg='+userOrg
	        },
	        buttons: [{
	            label: ' 确认',
	            cssClass: 'btn-primary',
	            action: function(dialogRef){
	            	$("#orgNo").val($("#orgNo1").val());
	            	$("#orgName").val($("#orgName1").val());
	            	$("#orgPid1").val($("#orgPid").val());
	            	dialogRef.close();
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
	
	//查询按钮
	$("#search-btn").bind("click",function(){
		orgNo = $("#orgNo").val();
		if(orgNo == ""){
			quickNotify("请选择组织单位", "danger");
			return null;
		}
		
		refreshTable();
	    refreshChart();
	});
	
})


//刷新表格
function refreshTable(){
	var orgNo = $('#orgNo').val();
	var opt = {
		url : "policyController.do?getTableData&orgNo="+orgNo,
	};
	$('#priceDg').bootstrapTable('refresh', opt); 
 
}

// 刷新图表
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
		  url: "policyController.do?getPriceChartItem",//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  return false;
		  },   
		  success:function(data){
			  if(!chart){
		          return;
		     }
		     //更新数据
		      var option = chart.getOption();
		      option.series[0].data = data.price;   
		      chart.setOption(option); 
		  }
	});
}

//获取分时电价曲线
function getPriceChart(tg_id_init){
	chart = echarts.init(document.getElementById('priceChart'));  //初始化
	var date = [];
	for (var i = 0; i < 25; i++) {
		date.push([intToTwoStr(i),intToTwoStr(0)].join(':'));
	}
	
	$.ajax({   
		  async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tg_id":tg_id_init
		  },
		  url: "policyController.do?getPriceChartItem",//后台处理程序,获取显示数据    	
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
					/* title : {
						left : 'left',
						text : '分时电价',
					}, */
					/* legend: {
				        data:['分时电价'],
				        left:'center'
				    }, */
				    grid:{
				    	left:30,
				    	right:40,
				    	top:30
				    },
					xAxis : {
						type : 'category',
						name: '时间(h)',
						boundaryGap : false,
						data : date
					},
					yAxis : {
						type:"value",
						name:"价格(元)"
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
					series : [{	
						name : '分时电价',
						type : 'line',
						smooth : false,
						//yAxisIndex:1,
						symbol : 'none',
						sampling : 'average',
						itemStyle : {
							normal : {
								color : '#081AD8'
							}
						},
						step:'end',
						data : data.price
					}
				]
				};
			  chart.setOption(option1);
		  }   
		})	
}

function initTableInfo(tg_id_init){
	$('#priceDg').bootstrapTable({    
	    url:'policyController.do?getTableData',
	   // striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        searchOnEnterKey:false,
        clickToSelect:true,
        singleSelect:true,
	    columns:[  
	        {checkbox:true},    
	        {field:'id',visible:false}, //
	        {field:'type',halign:"center",title:'时段类型',align:'center',
	        	formatter: function(position,row,index){
					if (row.type == "1"){
						return "尖";
					} else if(row.type == "2") {
						return "峰";
					}else if(row.type == "3"){
						return "平";
					}else if(row.type == "4"){
						return "谷";
					} 
				}

	        },    
	        {field:'start',halign:"center",title:'时段(起始)',align:'center'},
	        {field:'end',halign:"center",title:'时段(停止)',align:'center'},
	        {field:'price',halign:"center",title:'价格(元)',align:"right"}
	    ],
	    onClickRow:function(row,$element,field){
        	$element.parent().find("tr").removeClass("click-tr-bg");
			$element.addClass("click-tr-bg");
        }
	});
}

function intToTwoStr(num){
	if(num < 10){
		return "0" + num;
	}
	return num;
}

function mergeCells(data){
	var fieldName = "type"; //合并属性名称
	
	//声明一个map计算相同属性值在data对象出现的次数和
   // var sortMap = {};
	var typeArray = []; //存放数据记录从上到下的类型（无重复）
	var lengthArray = []; //存放每一种类型的记录数，前提是每一种类型的记录存放是不间断的
	var index = []; //存放每一种类型的开始索引
	//type = data[0]["type"];
	var type = data[0]['type'];
	typeArray.push(type);
	
    for(var i = 0 ; i < data.length ; i++){
        for(var prop in data[i]){
            if(prop == fieldName){
                var key = data[i][prop];
                /*if(sortMap.hasOwnProperty(key)){
                    sortMap[key] = sortMap[key] * 1 + 1;
                } else {
                    sortMap[key] = 1;
                }*/
                if(type != key && typeArray.indexOf(key) > -1){
                	typeArray.push(key);
                }
                else{
                	continue;
                }
            } 
        }
    }
    
    for(var i=0;i<typeArray.length;i++){
		count = 0;
		type=typeArray[i];
		for(var j=0;j<data.total;j++){
			if(type == data[j]["type"]){
				count++;
				continue;
			}
		}
		lengthArray.push(count);
		if(i==0){
			index.push(0);
		}
		else{
			index.push(data.total-lengthArray[i]);
		}
	}
    
    for(var i=0; i<lengthArray.length; i++){
		$('#priceDg').bootstrapTable('mergeCells',{
			index: index[i],
			field: 'type',
            halign:"center",
			colspan:1,
			rowspan: lengthArray[i]
		});
	}
    
    
}

function orgCheck(){
	orgNo = $("#orgNo").val();
	orpid = $("#orgPid1").val();
	if(orgNo ==""){
		quickNotify("请选择省公司组织单位");
		this.attr("disabled",true);
		return false;
	}else if(orpid != "1"){
		quickNotify("请选择省公司组织单位");
		this.attr("disabled",true);
		return false;
	}
	return true;
}
