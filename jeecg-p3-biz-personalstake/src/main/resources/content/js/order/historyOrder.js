var oTable;
var TG_ID;
$(function() {
	jeDate("#startTime", {
		format : "YYYY-MM-DD hh:mm",
		isinitVal:true,
		initDate:[{hh:00,mm:00},false],
	});
	jeDate("#endTime", {
		format : "YYYY-MM-DD hh:mm",
		isinitVal:true,
	});
	var user = getUserinfo();
	$('#orgNo').val(user.orgNo);
	$('#orgName').val(user.orgName);
	
	TG_ID = $("#TG_ID").val();
	if (TG_ID == undefined || TG_ID == "" || TG_ID == null || TG_ID == "null") {
		TG_ID = "";
		
		initTree();
	} else {
		$('#orgNo').val(TG_ID);
		initTree();
		$('#orgName').val(
				$.fn.zTree.getZTreeObj("treeDemo").getSelectedNodes()[0].name);
	}
	
	
	

	// 1.初始化Table
	oTable = new TableInit();
	oTable.Init();
});

// 初始化表格s
var TableInit = function() {
	var oTableInit = new Object();
	// 初始化Table
	oTableInit.Init = function() {
		$("#orderList")
				.bootstrapTable(
						{
							url : 'evOd.do?getHistoryOrder', // 请求后台的URL（*）
							method : 'get', // 请求方式（*）
							toolbar : '#toolbar', // 工具按钮用哪个容器
							contentType : "application/x-www-form-urlencoded",
							cache : false, // 是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
							pagination : true, // 是否显示分页（*）
							// queryParams: oTableInit.queryParams,//传递参数（*）
							queryParams : function(params) {// 传递参数（*）
								return { // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
									pageSize : params.pageSize,
									pageNumber : params.pageNumber,
									sortName : params.sortName,
									sortOrder : params.sortOrder,
									orgNo : ($("#orgNo").val() == "1" ? "01"
											: $("#orgNo").val()),
									orderId : $("#orderId").val(),
									userId : $("#userId").val(),
									stakeNo : $("#stakeNo").val(),
									orderStatus : $("#orderStatus").val(),
									startTime : $("#startTime").val(),
									endTime : $("#endTime").val(),
									orderStatus : $("#orderStatus").val(),
									orderType : $("#orderType").val(),
									isBlueTooth : $("#isBlueTooth").val(),
									orderResource : $("#orderResource").val()
								};
							},
							queryParamsType : "page",
							sidePagination : "server", // 分页方式：client客户端分页，server服务端分页（*）
							pageNumber : 1, // 初始化加载第一页，默认第一页
							pageSize : 10, // 每页的记录行数（*）
							pageList : [ 10, 25, 50, 100 ], // 可供选择的每页的行数（*）
							strictSearch : true,
							sortable : false, // 是否起用排序
							showColumns : true, // 是否显示所有的列
							showRefresh : true, // 是否显示刷新按钮
							clickToSelect : true, // 是否启用点击选中行
							uniqueId : "id", // 每一行的唯一标识，一般为主键列
							minimumCountColumns : 2, // 最少允许的列数
							height : height, // 行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
							showToggle : true, // 是否显示详细视图和列表视图的切换按钮
							cardView : false, // 是否显示详细视图
							detailView : false, // 是否显示父子表
							searchOnEnterKey : false,
							undefinedText : "", // 未定义列的显示文本
							columns : [
									{
										field : 'i',
										halign : "center",
										title : '序号',
										width : 50,
										align : "center",
										formatter : function(value, row, index) {
											if (row.odid) {
												return index + 1;
											} else {
												return "&nbsp";
											}
										}
									},
									{
										field : 'odid',
										halign : "center",
										align : "center",
										title : '订单编号',
										width :  150,
										sortable : true,
						                visible:false,
										formatter : function(value, row, index) {
											if (row.odid) {
												var url = "schedulingController.do?SchedulingDetails&order="
														+ value;
												var title = "计划调度详情";
												return '<ahref="#" onclick="clickT(\''
														+ url
														+ '\',\''
														+ title
														+ '\')" style="color:blue">'
														+ value + '</a>';
											} else
												return "";
										}
									}, {
										field : 'tg_name',
										halign : "center",
										title : '台区名称',
										width : 200,
										align : "left",
										sortable : true
									}, {
										field : 'stakeno',
										halign : "center",
										title : '桩编号',
										width : 150,
										align : "left",
										sortable : true
									}, {
										field : 'odmodel',
										halign : "center",
										title : '充电分类',
										width : 150,
										align : "left",
										sortable : true,
										formatter : function(value) {
											if (value == 1) {
												return "正常充电";
											} else if (value == 2) {
												return "有序充电";
											} else {
												return "";
											}
										}
									}, {
										field : 'usertype',
										align : 'right',
										halign : "center",
										width : 130,
										title : '订单来源',
										align : "left",
										sortable : true,
										formatter : function(value) {
											if (value == 1) {
												return "有序充电APP";
											} else if (value == 2) {
												return "分享充电APP";
											} else {
												return "";
											}
										}
									}, {
										field : 'odstatus',
										halign : "center",
										title : '状态',
										align : "left",
										width : 150,
										sortable : true,
										formatter : function(value) {
											return getOrderStatus(value);
										}
									}, {
										field : 'charging_demand',
										align : 'right',
										halign : "center",
										width : 130,
										title : '目标电量(kW·h)',
										align : "right",
										sortable : true
									}, {
										field : 'cgcap',
										halign : "center",
										title : '已充电量(kW·h)',
										align : "right",
										width : 130,
										sortable : true
									}, {
										field : 'starttime',
										halign : "center",
										title : '开始时间',
										width : 150,
										align : "center",
										sortable : true,
										formatter : function(value) {
											return formatTime(value);
										}
									}, {
										field : 'endtime',
										halign : "center",
										title : '结束时间',
										width : 150,
										align : "left",
										sortable : true,
										formatter : function(value) {
											return formatTime(value);
										}
									}, {
										field : 'vusetime',
										halign : "center",
										title : '用车时间',
										width : 150,
										align : "left",
										sortable : true,
										formatter : function(value) {
											return formatTime(value);
										}
									},

									// {
									// field : 'createtime',
									// halign : "center",
									// title : '创建时间',
									// width : 150,
									// align : "center",
									// valign : 'middle',
									// sortable : true
									// },
									// {
									// field : 'updatetime',
									// halign : "center",
									// title : '更新时间',
									// width : 150,
									// align : "center",
									// valign : 'middle',
									// sortable : true
									// },
									{
										field : 'acid',
										halign : "center",
										title : '用户ID',
										width : 150,
										align : "left",
										sortable : true
									}, {
										field : 'bluetoothorder',
										halign : "center",
										title : '蓝牙订单',
										width : 150,
										align : "left",
										sortable : true,
										formatter : function(value) {

											if (value == undefined) {
												return "";
											} else if (value == "0") {
												return "否";
											} else if (value == "1") {
												return "是";
											} else {
												return "";
											}
										}
									}, {
										field : 'orderfee',
										halign : "center",
										title : '订单金额',
										width : 150,
										align : "right",
										sortable : true
									}, {
										field : 'elefee',
										halign : "center",
										title : '电价',
										width : 150,
										align : "right",
										sortable : true
									}, {
										field : 'income',
										halign : "center",
										title : '订单收入',
										width : 150,
										align : "right",
										sortable : true
									}
							// {
							// field : 'elePriceModel',
							// halign : "center",
							// title : '电价模型',
							// width : 150,
							// align : "center",
							// valign : 'middle',
							// sortable : true,
							// formatter : function(value, row) {
							// if (row.orgNo) {
							// return "<a href=\"#\"
							// onclick=\"clickT('elePriceModelController.do?getElePriceModel&amp;orgNo="
							// + row.orgNo
							// + "','电价模型')\" style=\"color:blue\">查看电价模型</a>";
							// }
							// }
							// },{ field:'action',
							// align:'center',
							// title:'操作',
							// formatter : function(value,row,index) {
							// if(row.OD_ID != null && row.OD_ID != "" &&
							// row.OD_ID != undefined){
							// return "<button class='btn btn-xs btn-success'
							// style='margin-right:5px' title='编辑'
							// onclick='editRole(\"" + row.OD_ID + "\")'><span
							// class='glyphicon
							// glyphicon-pencil'></span></button>";
							// }
							// }
							// }, {
							// field : 'sharedId',
							// visible : false
							// }, {
							// field : 'orgNO',
							// visible : false
							// }, {
							// field : 'tgID',
							// visible : false
							],
							onClickRow : function(row, $element, field) {
								$element.parent().find("tr").removeClass(
										"click-tr-bg");
								$element.addClass("click-tr-bg");
							},
							responseHandler : function(res) {
								// 在ajax获取到数据，渲染表格之前，修改数据源
								var nres = [];
								nres.push({
									total : res.total,
									rows : res.results
								});
								return nres[0];
							},
							onLoadSuccess : function(data) { // 加载成功时执行
								if (data.total == 0) {

									$("#orderList").bootstrapTable(
											'load',
											{
												rows : [ {}, {}, {}, {}, {},
														{}, {}, {}, {}, {} ],
												total : 0
											})
								}

								console.info("加载成功");
							},
							onLoadError : function() { // 加载失败时执行
								console.info("加载数据失败");
							}

						});
	};

	return oTableInit;
}

// 查询按钮
function jeecgDemoSearch() {
	refreshTable();
}

// 重置按钮
function jeecgDemoRest() {
	$('#stakeNo').val("");
	$('#orderId').val("");
	$('#startTime').val("");
	$('#endTime').val("");
	$("#orgNo").val(user.orgNo);// 将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
	$("#orgName").val(user.orgName);
	$('#tgNo').val("");
	$('#orderStatus').val("");
	$('.selectpicker').selectpicker('val', '');// 清空台区下拉框
	var opt = {
		url : "evOd.do?getHistoryOrder",
	};
	$('#orderList').bootstrapTable("refresh", opt);

}

// 刷新表格
function refreshTable() {

	$('#orderList').bootstrapTable("refresh");
}

// 页面跳转方法
function clickT(url, title) {
	parent.openNewTab(url, title);
}

function initTree() {
	treeDataList = getUserOrgTree(user.orgNo);
	// 传入所需要的id属性名
	treeDiv("treeDemo", "treeDiv", "orgName", "orgNo", treeDataList);
	orgSearch('treeDemo', '#orgName', null, true); // 初始化模糊搜索方法
}


function getOrderStatus(status){
	switch(status){
	case "1": return "待执行"; break;
	case "2": return "正在执行"; break;
	case "3": return "降低执行"; break;
	case "4": return "暂停"; break;
	case "5": return "执行完成"; break;
	case "6": return "系统终止"; break;
	case "7": return "用户结束"; break;
	case "8": return "台区容量不足"; break;
	case "9": return "订单状态异常"; break;
	default : return "";
	}
}
