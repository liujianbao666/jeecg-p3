//自定义下拉框集成ztree
//机构树
/*传入参数tree:用于承接ztree的ul的id;treeDivId:用于承接ztree的div的id;inputId:接受显示选中文字的input的id;
	     inputHideId:接受选中文字对应的id的input的id（一个hidden的input）;treeDataList:形成树形需要的数据数组；
*/
var proorgno;
var treeDataList;
var treeObj;
var treeId;
function treeDiv(tree,treeDivId,inputId,inputHideId,treeDataList){
	treeId=tree;
	var departmentList=treeDataList;
	var setting = {
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: null
				}
			},
			callback: { 
				beforeClick:zTreeBeforeClick,
			},
		  	view :{  
	            fontCss: getFontCss
	        } 
		};
	treeObj = $.fn.zTree.init($("#"+tree+""), setting, departmentList);
	treeObj.setting.view.expandSpeed = "";
	treeObj.expandAll(false);
	treeObj.setting.view.expandSpeed = "fast";
	//回显组织机构
    var nodess = treeObj.getNodesByParam("id", $("#orgNo").val(), null);
    if (nodess != null && nodess.length > 0) {
        treeObj.selectNode(nodess[0]);
    }
    //回填组织机构的值
    $("#orgnoName").val($("#orgName").val());
    $("#orgNo").val($("#orgNo").val());
	var nodes = treeObj.getNodes();
    treeObj.expandNode(nodes[0], true, false, true);
    function zTreeBeforeClick(treeId, treeNode){
    	var parent = treeNode.getParentNode();
    	while(parent.pId!='1'&&parent.pId!=''&&parent.pId!=null) {
    		parent = parent.getParentNode();
    	}
    	proorgno = parent.id;
    	$("#"+treeDivId+"").css("display","none");
    	$("#"+inputId+"").val(treeNode.name);
    	$("#"+inputHideId+"").val(treeNode.id);
    }

	ck(treeDivId,inputId);
}



function ck(treeDivId,inputId){
    //控制departmentTreeDiv承接树形结构的div的隐藏			
    var obj=$("#"+treeDivId+"");
    var oBtn=$("#"+inputId+"");	 
    document.onclick=function(event){
	var e=event || window.event;//兼容ie和非ie的event
        var aim=e.srcElement || e.target; //兼容ie和非ie的事件源		   		       
        if(e.srcElement){
	       var aim=e.srcElement;
	       aimFun(aim,oBtn,obj);
        }else{
    	   var aim=e.target;
    	   aimFun(aim,oBtn,obj);    		          
        }
    }
}
function aimFun(aim,oBtn,obj){
     var f=true;
     if(aim==oBtn[0]){
	   obj.toggle();
     }
     if(aim.toString()=="[object HTMLButtonElement]"){
	    var btn=obj.find("button");
    	f=setTval(aim,btn);
     }
     if(aim.toString()=="[object HTMLLIElement]"){
	   var li=obj.find("li");
    	f=setTval(aim,li);
     }
     if(aim.toString()=="[object HTMLUListElement]"){
	   var ul=obj.find("ul");
    	f=setTval(aim,ul);
     }
     if(aim!=oBtn[0] && aim!=obj[0] && f){
    	 if(aim.innerText!=""){
    		 obj.css("display","none");
    	 }/*else{
    		 obj.css("display","block");
    	 }*/
     } 
 
    //当多个树形结构时，点击其中一个input暂时树形时，隐藏其他的树形结构div   
     var ulArr=$(".tree");       
     for(var i=0; i<ulArr.length;i++){
    	 if(treeId!=$(ulArr[i]).attr("id")){
    		 $(ulArr[i]).parent().css("display","none");
    	 }
     }
}
function setTval(aim,arr){
	var f=true;
	if(arr !=null &&arr!=undefined && arr.length>0){
		for(var i=0;i<arr.length;i++){
			if(aim==arr[i]){
				f=false;
				return;
			}
		}
	}
	return f;
}
function getFontCss(treeId, treeNode) {  
    return (!!treeNode.highlight) ? {color:"#0000ff", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};  
}

