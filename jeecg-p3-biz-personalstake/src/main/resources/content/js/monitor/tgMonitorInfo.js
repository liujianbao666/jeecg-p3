/**
 * 获取台区信息
 */
function getTgInfo(){
	var tgNo = $('#tgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgNo":tgNo
		  },
		  url: 'monitorController.do?getTgInfo',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取台区信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#tg_name').html($('#tgName').val());
			  $('#tg_cap').html(data.tgCap);
			  $('#tg_limit').html(data.tgLimit);
			/*  $('#tg_I').html(data.tgI);
			  $('#tg_V').html(data.tgV);*/
			  $('#tg_P').html(data.tgP);
		  }
		  });
}

/**
 * 获取桩信息
 */
function getCgInfo(){
	var tgNo = $('#tgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgId":tgNo
		  },
		  url: 'monitorController.do?getCgInfo',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取充电桩信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#all').html(data.cgAmount);
			  $('#wait').html(data.cgWaitAmount);
			  $('#normal').html(data.cgNormalAmount);
			  $('#abNormal').html(data.cgAbnormalAmount);
			  $('#normal_charge').html(data.cgNormalCharge);
			  $('#optimal_charge').html(data.cgOptimalCharge);
		  }
		  });
}

/**
 * 获取订单信息
 */
function getOrderInfo(){
	var tgNo = $('#tgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgNo":tgNo
		  },
		  url: 'monitorController.do?getOrderInfo',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取订单信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#all_order').html(data.odAmount);
			  $('#optimal_order').html(data.optimalOd);
			  $('#normal_order').html(data.normalOd);
			  /*$('#allow_order').html(data.yesOd);
			  $('#not_allow_order').html(data.notOd);*/
		  }
		  });
}

/**
 * 获取电量信息，包括台区用电量、居民用电量、桩用电量、正常订单需求电量、有序订单需求电量
 */
function getPowerInfo(){
	var tgNo = $('#tgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgNo":tgNo
		  },
		  url: 'monitorController.do?getPowerInfo',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取电量信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#tg_power').html(data.tgPower);
			  $('#people_power').html(data.peoplePower);
			  $('#stake_power').html(data.stakePower);
			 /* $('#normal_power').html(data.normalPower);
			  $('#optimal_power').html(data.optPower);*/
		  }
		  });
}

/**
 * 获取指标信息
 */
function getIndexInfo(){
	var tgNo = $('#tgNo').val();
	$.ajax({
		async : false,   //设置为false。请求为同步请求
		  cache:false,   	//不设置缓存
		  type: 'post',   
		  dataType : "json",   
		  data:{
			  "tgNo":tgNo
		  },
		  url: 'monitorController.do?getIndexInfo',//后台处理程序,获取显示数据    	
		  error: function () {//请求失败处理函数   
			  console.info("获取指标信息失败！");
			  return false;
		  },   
		  success:function(data){
			  $('#optimalRate').html(data.optimalRate+"%");
			  $('#vallyRate').html(data.vallyRate+"%");
			  $('#doneOptimalRate').html(data.doneOptimalRate+"%");
			 /* $('#doneRate').html(data.doneRate);
			  $('#abNormalRate').html(data.abNormalRate);*/
		  }
	});
}