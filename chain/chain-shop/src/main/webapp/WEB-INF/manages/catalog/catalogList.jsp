<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ page session="false"%>
<%@ taglib uri="http://jsptags.com/tags/navigation/pager" prefix="pg"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/resource/common_html_meat.jsp"%>
<%@ include file="/WEB-INF/manages/system/common.jsp"%>
<script type="text/javascript">
	$(function() {

	});
	function deleteSelect() {
		var node = $('#treegrid').treegrid('getSelected');
		if (!node) {
			alert("请选择要删除的类别！");
			return false;
		}
		try{
			if(confirm("确定删除选择的记录?")){
				$.blockUI({ message: "系统处理中，请等待...",css: { 
			        border: 'none', 
			        padding: '15px', 
			        backgroundColor: '#000', 
			        '-webkit-border-radius': '10px', 
			        '-moz-border-radius': '10px', 
			        opacity: .5, 
			        color: '#fff' 
			    }});
				var _url = "catalog!deleteByID.action?id="+node.id;
				$.ajax({
				  type: 'POST',
				  url: _url,
				  data: {},
				  async:false,
				  success: function(data){
					  console.log("ajax.data="+data);
					  if(!data){
						var _form = $("#form");
						_form.attr("action","catalog!selectList.action");
						_form.submit();
					  }
					  else
						  {
							alert(data);
						  }
					  jQuery.unblockUI();
				  },
				  dataType: "text",
				  error:function(){
					  	jQuery.unblockUI();
						alert("加载失败，请联系管理员。");
				  }
				});
			}
		}catch(e){
			console.log("eee="+e);
		}
		return false;
	}
	//编辑
	function editSelect(){
		var node = $('#treegrid').treegrid('getSelected');
		if (!node) {
			alert("请选择要编辑的类别！");
			return false;
		}
		//document.form1.action = "catalog!toEdit.action?e.id="+node.id;   
        //document.form1.submit();
        var _url = "catalog!toEdit.action?e.id="+node.id;
        var _form = $("#form");
		_form.attr("action",_url);
		_form.submit();
	}
	//添加
	function addSelect(){
		var node = $('#treegrid').treegrid('getSelected');
		 var _url;
		if(node && node.pid==0){
			 _url = "catalog!toAdd.action?e.pid="+node.id;
		}
		else if(node){
			_url = "catalog!toAdd.action?e.pid="+node.pid;
		}
		else {
		_url = "catalog!toAdd.action";
		}
         var _form = $("#form");
		_form.attr("action",_url);
		_form.submit();
	}
</script>
</head>

<body>
	<s:form action="catalog" name="form" id="form" namespace="/manage"
		method="post" theme="simple">
		<s:hidden name="e.type" id="_type" />
		<table class="table table-bordered table-condensed table-hover">
			<tr><td colspan="16">
			<!-- 	<s:submit method="selectList" value="查询"
						cssClass="btn btn-primary" /> -->

					<button class="btn btn-success" onclick="return addSelect();">
						<i class="icon-plus-sign icon-white"></i> 添加
					</button>

					<button class="btn btn-warning" onclick="return editSelect();">
						<i class="icon-edit icon-white"></i> 编辑
					</button>
					<button method="catalog!deletes.action" class="btn btn-danger"
						onclick="return deleteSelect();">
						<i class="icon-remove-sign icon-white"></i> 删除
					</button></td>
			</tr>
		</table>
	</s:form>

	<div class="alert alert-info" style="margin-bottom: 2px;">友情提示：商品目录一般分为两层，大类别、小类别。商品目录编码必须唯一。</div>
	<table id="treegrid" title="商品类别目录" class="easyui-treegrid"
		style="min-width: 800px; min-height: 250px"
		data-options="
				url: '<%=request.getContextPath() %>/manage/catalog/catalog!getRootWithTreegrid.action?e.type=<s:property value="e.type"/>',
				method: 'get',
				rownumbers: true,
				idField: 'id',
				treeField: 'name',
				onClickRow:function(row){
					//alert(row.id);
				}
			">
		<thead>
			<tr>
				<th data-options="field:'id'" nowrap="nowrap">ID</th>
				<th data-options="field:'name'" nowrap="nowrap">类别名称</th>
				<!-- <th data-options="field:'order1'" nowrap="nowrap">顺序</th> -->
				<th data-options="field:'code'" nowrap="nowrap">编码</th>
				<!-- <th data-options="field:'showInNavStr'" nowrap="nowrap">是否在导航条显示</th> -->

			</tr>
		</thead>
	</table>

	<link rel="stylesheet" type="text/css"
		href="<%=request.getContextPath() %>/resource/jquery-easyui-1.3.4/themes/default/easyui.css">
	<link rel="stylesheet" type="text/css"
		href="<%=request.getContextPath() %>/resource/jquery-easyui-1.3.4/themes/icon.css">
	<link rel="stylesheet" type="text/css"
		href="<%=request.getContextPath() %>/resource/jquery-easyui-1.3.4/demo/demo.css">

	<script type="text/javascript"
		src="<%=request.getContextPath() %>/resource/jquery-easyui-1.3.4/jquery.easyui.min.js"></script>
</body>
</html>
