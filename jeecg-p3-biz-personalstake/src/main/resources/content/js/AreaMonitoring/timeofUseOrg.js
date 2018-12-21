/**
 * 
 */
var treeNodes;
var treeObj;
var myQueryValue;
var nodeList;
//var query_org_no;
//初始化树
function initTree(){
	//加载树的设置
	var setting = {
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId",
					rootPId: 0
				}
			},
			callback: { 
				onClick: ztree_click
			},
		  	view :{  
	            fontCss: getFontCss
	        } 
		};
	//点击左侧树触发事件儿
	function ztree_click(event, treeId, treeNode){
		myQueryValue = treeNode.name;
		creatIframe(treeNode.id);
	}
	var urlQueryTree = "orgController.do?myQuery";
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
			treeNodes = data;   //把后台封装好的简单Json格式赋给treeNodes
			treeObj =$.fn.zTree.init($("#treeDemo"), setting, treeNodes);
			treeObj.expandAll(false);
			var nodes = treeObj.getNodes();
	        treeObj.expandNode(nodes[0], false, false, true);
	        //设置ztree默认选中项
	        var query_org_no = '22403010503';
	        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	        var node = zTree.getNodeByParam("id",query_org_no);
	        zTree.selectNode(node);
	        //
	        creatIframe(query_org_no);
		}
	});
		
	}
	var myTreeObj;

	$(document).ready(function() {
		/*if(!treeObj){
			setTimeout('initTree()',400);
		}*/
		initTree();
	});

	function myQuery(){
		var treeName = $("#treeName").val();
	    if(treeName != ""){  
	        nodeList = treeObj.getNodesByParamFuzzy("name", treeName);
	        if(nodeList && nodeList.length>0){  
	            updateNodes(true);  
	        }  
	    } 
	}
	
	var treeId = "treeDemo";
	function getFontCss(treeId, treeNode) {  
	    return (!!treeNode.highlight) ? {color:"#0000ff", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};  
	} 
		
	function updateNodes(highlight) {  
	    for( var i=0; i<nodeList.length;  i++) {  
	        nodeList[i].highlight = highlight;  
	        treeObj.updateNode(nodeList[i]);  
	    }  
	}
		
	function creatIframe(orgNo){
	//	var iframeurl = "powerController.do?powerTab&orgNo="+orgNo+"&orderID=1";
		/*var iframeurl = "policyController.do?timeElectricPrice&orgNo="+orgNo+"&orderID=1";
		if($("#right_iframe").find("iframe").length>0){
			$("#right_iframe iframe").remove();
			$("#right_iframe").append("<iframe src="+iframeurl+" style='width:100%;height:100%;border:1px solid #eee'></iframe>");
		}else{
			$("#right_iframe").append("<iframe src="+iframeurl+" style='width:100%;height:100%;border:1px solid #eee'></iframe>");
		}*/
		refreshTable(orgNo);
		refreshChart(orgNo);
	}
	
	