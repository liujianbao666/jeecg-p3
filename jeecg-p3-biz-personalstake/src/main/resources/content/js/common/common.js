
projectName = "/SESS/";
//控制表格的高度
var height = $(window).height()*0.97;
//转换日期格式(时间戳转换为datetime格式)
function changeDateFormat(cellval) {
    var dateVal = cellval + "";
    if (cellval != null) {
        var date = new Date(parseInt(dateVal.replace("/Date(", "").replace(")/", ""), 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        return date.getFullYear() + "-" + month + "-" + currentDate + " " + hours + ":" + minutes + ":" + seconds;
    }
}


function quickNotify(msg,type){
	if(type == null || type == undefined){
		type = "warning";
	}
	$.notify({
		message: msg,
		target: '_blank'
	},{
		type: type,
		placement: {
			from: "bottom",
			align: "right"
		},
		z_index: 9999,
		delay: 200,
	});
}
function slowNotify(msg,type){
	if(type == null || type == undefined){
		type = "warning";
	}
	$.notify({
		message: msg,
		target: '_blank'
	},{
		type: type,
		placement: {
			from: "bottom",
			align: "right"
		},
		z_index: 9999,
		delay: 5000,
	});
}

//将时间数据转成yyyy-MM-dd HH:mm:ss格式
function formatDate(time){
    var date = new Date(time);

    var year = date.getFullYear(),
        month = date.getMonth() + 1,//月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    if(sec < 10){
    	sec = "0" + sec;
    }
    if(min < 10){
    	min = "0" + min;
    }
    if(hour < 10){
    	hour = "0" + hour;
    }
    if(day < 10){
    	day = "0" + day;
    }
    if(month < 10){
    	month = "0" + month;
    }
    var newTime = year + '-' +
                month + '-' +
                day + ' ' +
                hour + ':' +
                min + ':' +
                sec;
    return newTime;         
}


function compareTime(startTime, endTime) {
	var date1 = new Date(startTime);
	var date2 = new Date(endTime);
	if (date1.getTime() > date2.getTime()) {
		return true;
		
	} else {
		return false;
	}
}


function getDateFormat(time) {
	var d = new Date(time);
	var times = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
	return times;

}

function formatTime(time){
	if(time==undefined||time==''){
		return "";
	}
    var date = new Date(time);
    var year = date.getFullYear(),
        month = date.getMonth() + 1,//月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
        if(month<10){
        	month = "0"+month
        }
        if(day<10){
        	day = "0"+day
        }
        if(hour<10){
        	hour = "0"+hour
        }
        if(min<10){
        	min = "0"+min
        }
        if(sec<10){
        	sec = "0"+sec
        }
    var newTime = year + '-' +
                month + '-' +
                day + ' ' +
                hour + ':' +
                min + ':' +
                sec;
    return newTime;         
}
//时间校验
function validateDate(startDate,endDate){
    // 非空判断
    if(startDate == null || startDate=="" || startDate == undefined){
        $.notify({
            message : "开始时间不能为空！"
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
    if(endDate == null || endDate=="" || endDate == undefined){
        $.notify({
            message : "结束时间不能为空！"
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

    // 开始时间不能大于结束时间验证
    if(startDate > endDate){
        $.notify({
            message : "开始时间不能大于结束时间！"
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
//日期操作
function addDate(date,days){ 
    var d=new Date(date); 
    d.setDate(d.getDate()+days); 
    var m=d.getMonth()+1; 
    return d.getFullYear()+'-'+m+'-'+d.getDate(); 
  } 
//开始时间到结束时间的天数
function daysApart(startTime,endTime){
	var datespan = endTime - startTime;
	datespan = Math.abs(datespan);
	days = Math.floor(datespan/(24*3600*1000)+1);
	return days
}


//echarts图中x轴显示
//288个点对应的小时
function to288Hour(minute) {
	var hour = parseInt(minute * 5 / 60);
	if (hour < 10) {
		return "0" + hour;
	}
	return hour;
}

//288个点对应的分钟
function to288Minute(minute) {
	var minute = minute * 5 % 60;
	if (minute < 10) {
		return "0" + minute;
	}
	return minute;
}

//96个点对应的分钟
function toMinute(minute) {
	var minute = minute * 15 % 60;
	if (minute < 10) {
		return "0" + minute;
	}
	return minute;
}

function intToTwoStr(num){
	if(num < 10){
		return "0" + num;
	}
	return num;
}
