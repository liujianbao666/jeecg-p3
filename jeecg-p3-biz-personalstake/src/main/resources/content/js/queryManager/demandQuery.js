var oTable;
var TG_ID;
$(function() {
	jeDate("#start_time", {	
		format : "YYYY-MM-DD hh:mm",
		isinitVal:true,
		initDate:[{hh:00,mm:00},false],
	});
	jeDate("#end_time", {
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
							url : 'evDemand.do?getEvDemandList', // 请求后台的URL（*）
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
										odId : $("#odId").val(),
									stakeNo : $("#stakeNo").val(),
									userType : $("#userType").val(),
									start_time : $("#start_time").val(),
									end_time : $("#end_time").val(),
									status : $("#status").val(),
									odModel : $("#odModel").val(),
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
											if (row.id) {
												return index + 1;
											} else {
												return "&nbsp";
											}
										}
									},{
										field : 'odId',
										halign : "center",
										title : '订单编号',
										width : 300,
										align : "center",
										sortable : true
									}, {
										field : 'stakeNo',
										halign : "center",
										title : '桩编号',
										width : 150,
										align : "center",
										sortable : true
									}, {
										field : 'alias',
										halign : "center",
										title : '桩名',
										width : 150,
										align : "center",
										sortable : true
									},{
										field : 'userType',
										halign : "center",
										title : '需求来源',
										width : 150,
										align : "center",
										sortable : true,
										formatter : function(value) {
											if (value == 1) {
												return "分享充电";
											} else if (value == 2) {
												return "有序充电";
											}else if(value ==3 ) {
					                            return "蓝牙充电";
					                        }else {
												return "";
											}
										}
									}, {
										field : 'remaincapacity',
										halign : "center",
										title : '剩余电量(%)',
										width : 150,
										align : "center",
										sortable : true
									}, {
										field : 'targetcapacity',
										halign : "center",
										title : '目标电量(%)',
										width : 150,
										align : "center",
										sortable : true
									},{
										field : 'bATERY_CAP',
										halign : "center",
										title : '电池容量',
										width : 150,
										align : "center",
										sortable : true
									},{
										field : 'rATED_MAX_P',
										halign : "center",
										title : '车辆功率',
										width : 150,
										align : "center",
										sortable : true
									}, {
										field : 'odModel',
										align : 'right',
										halign : "center",
										width : 130,
										title : '充电分类',
										align : "right",
										sortable : true,
										formatter : function(value) {
											if (value == 1) {
												return "立即充电";
											} else if (value == 2) {
												return "有序充电";
											} else {
												return "";
											}
										}
									}, {
										field : 'vH_BRAND',
										halign : "center",
										title : '车辆品牌',
										width : 150,
										align : "center",
										sortable : true
									}, {
										field : 'vH_MODEL',
										halign : "center",
										title : '车辆型号',
										width : 150,
										align : "center",
										sortable : true
									}, {
										field : 'chargingDemand',
										halign : "center",
										title : '需求电量(kW·h)',
										width : 150,
										align : "center",
										sortable : true
									}, {
										field : 'status',
										align : 'right',
										halign : "center",
										width : 130,
										title : '状态',
										align : "right",
										sortable : true,
										formatter : function(value) {
											if (value == 1) {
												return "请求成功";
											} else if (value == 2) {
												return "请求失败";
											} else {
												return "";
											}
										}
									},  {
										field : 'vuseTime',
										halign : "center",
										title : '用车时间',
										width : 150,
										align : "center",
										sortable : true,
										formatter : function(value) {
											return formatTime(value);
										}
									},  {
										field : 'createTime',
										halign : "center",
										title : '创建时间',
										width : 150,
										align : "center",
										sortable : true,
										formatter : function(value) {
											return formatTime(value);
										}
									}
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
	$('#start_time').val("");
	$('#end_time').val("");
	$("#orgNo").val(user.orgNo);// 将组织单位初始化为用户所属的组织单位，该步骤要放在初始化列表之前
	$("#orgName").val(user.orgName);
	$('#tgNo').val("");
	$('#orderStatus').val("");
	$('.selectpicker').selectpicker('val', '');// 清空台区下拉框
	var opt = {
		url : "evDemand.do?getEvDemandList", 
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


