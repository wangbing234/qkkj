<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/resource/common_html_meat.jsp"%>
<%@ include file="/resource/common_html_validator.jsp"%>
<link rel="stylesheet" href="<%=request.getContextPath() %>/resource/jquery-jquery-ui/themes/base/jquery.ui.all.css">
<link rel="stylesheet" href="<%=request.getContextPath()%>/resource/bootstrap/css/bootstrap.min.css" type="text/css">
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/bootstrap/js/bootstrap.min.js"></script>
<style type="text/css">

.td_right {
	text-align: right;
}

.titleCss {
	background-color: #e6e6e6;
	border: solid 1px #e6e6e6;
	position: relative;
	margin: -1px 0 0 0;
	line-height: 32px;
	text-align: left;
}
.layui-layer
{
    top: 10px;
    left: 5%;
}
.tigger {
	display: block;
	width: 80px;
	padding: 10px;
	text-align: center;
	background: #fff;
	border: 1px solid #999;
	color: #333;
	cursor: pointer;
}

.aCss {
	overflow: hidden;
	word-break: keep-all;
	white-space: nowrap;
	text-overflow: ellipsis;
	text-align: left;
	font-size: 12px;
}

.liCss {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	height: 30px;
	text-align: left;
	margin-left: 10px;
	margin-right: 10px;
}

a {
	text-decoration: none;
}
</style>
<script type="text/javascript">
	var expandAllFlg = true;
	var checkAllTrueOrFalseFlg = true;
	function expandNode(e) {
		var zTree = $.fn.zTree.getZTreeObj("treeDemo2"),
		type = e.data.type,
		nodes = zTree.getSelectedNodes();
		if (type == "expandAll") {
			zTree.expandAll(true);
		} else if (type == "collapseAll") {
			zTree.expandAll(false);
		} else if (type == "expandOrCollapse") {
			zTree.expandAll(expandAllFlg);
			expandAllFlg = !expandAllFlg;
		} else if (type == "checkAllTrueOrFalse") {
			zTree.checkAllNodes(checkAllTrueOrFalseFlg);
			checkAllTrueOrFalseFlg = !checkAllTrueOrFalseFlg;
		} else {
			if (type.indexOf("All")<0 && nodes.length == 0) {
				alert("请先选择一个父节点");
			}
			var callbackFlag = $("#callbackTrigger").attr("checked");
			for (var i=0, l=nodes.length; i<l; i++) {
				zTree.setting.view.fontCss = {};
				if (type == "expand") {
					zTree.expandNode(nodes[i], true, null, null, callbackFlag);
				} else if (type == "collapse") {
					zTree.expandNode(nodes[i], false, null, null, callbackFlag);
				} else if (type == "toggle") {
					zTree.expandNode(nodes[i], null, null, null, callbackFlag);
				} else if (type == "expandSon") {
					zTree.expandNode(nodes[i], true, true, null, callbackFlag);
				} else if (type == "collapseSon") {
					zTree.expandNode(nodes[i], false, true, null, callbackFlag);
				}
			}
			
		}
	}
	
	
	function catalogChange(obj){
		var _pid = $(obj).find("option:selected").attr("pid");
	}
	
	function returnBack(obj){
		return false;
	}
	
	function addtr(){
		var trlen=$("#supplierlinkmen").find("tr").length-1;
		for(i=0;i<1;i++){
			var arrayObj = new Array();
				arrayObj.push('<tr>');
				arrayObj.push('<th style="display: none;"><input style="width:95%" type="text" name="e.children['+(trlen+i)+'].id"  value="" id="form_e_children_0__id" /></th>');
				arrayObj.push('<th><input style="width:95%" type="text" name="e.children['+(trlen+i)+'].name"  value="" class="search-squre input-small" id="form_e_children_'+(trlen+i)+'__name"/></th>');
				arrayObj.push('<th><input style="width:95%" type="text" name="e.children['+(trlen+i)+'].tel"  value="" class="search-squre input-small" id="form_e_children_'+(trlen+i)+'__tel"/></th>');
				arrayObj.push('<th><input  style="width:95%" type="text" name="e.children['+(trlen+i)+'].phone" value="" class="search-squre input-small" id="form_e_children_'+(trlen+i)+'__phone"/></th>');
				arrayObj.push('<th><input  style="width:95%" type="text" name="e.children['+(trlen+i)+'].QQ"  value="" class="search-squre input-small" id="form_e_children_'+(trlen+i)+'__qq"/></th>');
				arrayObj.push('<th><input  style="width:95%" type="text" name="e.children['+(trlen+i)+'].address"  value="" class="search-squre input-small" id="form_e_children_'+(trlen+i)+'__address"/></th>');
				arrayObj.push('<th><select style="width:95%" name="e.children['+(trlen+i)+'].isMain" id="form_e_children_'+(trlen+i)+'__isMain" class="search-squre input-small"><option value="0">否</option><option value="1">是</option></select></th>');
				arrayObj.push('<th><select  style="width:95%" name="e.children['+(trlen+i)+'].isDelete" id="form_e_children_'+(trlen+i)+'__isDelete" class="search-squre input-small"><option value="1">是</option><option value="0">否</option></select></th>');
				arrayObj.push('</tr>');
				$("#supplierlinkmen").append(arrayObj.join("")); 
		}
	}
</script>
</head>

<body>
<s:hidden name="e.id" id="id" readonly="false"/>
	<s:if test="e.id=='' or e.id==null">
		<s:set name="formAction" value="'insert'" />
	</s:if>
	<s:else>
		<s:set name="formAction" value="111" />
	</s:else>
	<s:form action="supplier!update"  theme="simple" id="form">
	供应商ID：<span class="badge badge-success"><s:property value="e.id" /></span>
		<div style="text-align: center;">
				<s:submit  id="saveSupplierBtn"  method="save" value="保存" cssClass="btn btn-primary" />
				<a class="btn btn-default btn-sm" href="supplier!selectList.action">返回</a>
		</div>
	<div id="tabs">
			<ul>
				<li><a href="#tabs-1">基本信息</a></li>
				<li><a href="#tabs-2">联系人信息</a></li>
			</ul>
			<div id="tabs-1">
					<table class="table table-bordered">
						<tr>
							<td colspan="4" style="background-color: #dff0d8; text-align: center;"><strong>供应商编辑</strong>
								&nbsp;<font color="red">${mess }</font></td>
						</tr>
						<tr style="display: none;">
							<th>id</th>
							<td><s:hidden name="e.id" id="hid"/></td>
						</tr>
						<tr>
							<th class="td_right">供应商编号</th>
							<td style="text-align: left;">
								<s:if test="e.id=='' or e.id==null">
									<s:textfield name="e.code"  readonly="false" id="supplierCode"
										data-rule="帐号:required;username;length[4~20];remote[supplier!unique.action]" />
								</s:if> 
								<s:else>
									<s:property value="e.code" />
								</s:else>
							</td>
							
							<th class="td_right">供应商名称</th>
							<td style="text-align: left;"><s:textfield name="e.name"
									id="supplierName" readonly="false"
									data-rule="昵称:required;name;length[2~20]" />
							</td>
						</tr>
						<tr>
							<th class="td_right">供应商类别</th>
							<td style="text-align: left;">
								<s:select  list="#application._productSupplierList" id="supplierType" name="e.type"
											  listKey="key" listValue="value" />
							</td>
									
							<th class="td_right">状态</th>
							<td style="text-align: left;" colspan="3"><s:select
									list="#{'y':'启用','n':'禁用'}" id="supplierStatus" name="e.status"
									  listKey="key" listValue="value" />
							</td>
						</tr>
						
						<tr>
							<th class="td_right">备注信息</th>
							<td style="text-align: left;"><s:textarea name="e.remark" cols="600" cssStyle="width:600px" rows="3"
									id="supplierRemark" readonly="false"
									data-rule="昵称:required;remark;length[2~20]" />
							</td>
							
						</tr>
						
							<tr>
							 	<th class="td_right">供应商品类别</th>
								<td colspan="3">
								<s:hidden id="catalogIds"  name="e.catalogIds"/>
										<ul id="treeDemo2" class="ztree"></ul>
								</td>
							</tr>
						<tr>
					</table>
			</div>
		<div id="tabs-2">
						<input onclick="javascript:addtr()" type="button" value="增加联系人" style="float:right;" class="btn"> 
						<table class="table" id="supplierlinkmen">
							<tr>
								<th style="width: 12%">联系人</th>
								<th style="width: 12%">手机</th>
								<th style="width: 12%">座机</th>
								<th style="width: 12%" >QQ/微信/邮箱</th>
								<th style="width: 28%">联系地址</th>
								<th  style="width: 12%">首要联系人</th>
								<th  style="width: 12%">是否显示</th>
							</tr>
							<s:if test="e.children!=null">
								<s:iterator value="e.children" var="item" status="stat">
									<tr>
										<th style="display: none;"><s:hidden name="e.children[%{#stat.index}].id" />
									</th>
									<th ><s:textfield   name="e.children[%{#stat.index}].name" cssStyle="width:95%"  cssClass="search-squre input-small" /></th>
									<th ><s:textfield name="e.children[%{#stat.index}].tel"   cssClass="search-squre input-small"  cssStyle="width:95%" /></th>
									<th><s:textfield name="e.children[%{#stat.index}].phone" cssStyle="width:95%"  cssClass="search-squre input-small" /></th>
									<th ><s:textfield name="e.children[%{#stat.index}].QQ"   cssStyle="width:95%"  cssClass="search-squre input-small"/></th> 
									<th ><s:textfield name="e.children[%{#stat.index}].address"  cssStyle="width:95%" cssClass="search-squre input-small"/></th> 
									<th >
										<s:select name="e.children[%{#stat.index}].isMain" 
												list="#{'1':'是','0':'否'}"   cssStyle="width:100%" 
												cssClass="search-squre input-small" />
									</th> 
									<th>
										<s:select name="e.children[%{#stat.index}].isDelete" 
												list="#{'1':'是','0':'否'}"    cssStyle="width:100%" 
												cssClass="search-squre input-small" />
									</th> 
									</tr>
								</s:iterator>
							</s:if>
							<s:else>
								<tr>
								   	<th ><s:hidden name="id" /><s:textfield name="e.children[0].name" cssClass="search-squre input-small"  cssStyle="width:95%"/></th>
								   	<th ><s:textfield name="e.children[0].tel" cssClass="search-squre input-small"  cssStyle="width:95%" /></th> 
									<th ><s:textfield name="e.children[0].phone" cssClass="search-squre input-small"  cssStyle="width:95%" /></th> 
									<th><s:textfield name="e.children[0].QQ" cssClass="search-squre input-small"  cssStyle="width:95%"  /></th>
									<th><s:textfield name="e.children[0].address" cssClass="search-squre" cssStyle="width:95%"/></th>
									<th>
											<s:select name="e.children[0].isMain" value="1"
												list="#{'1':'是'}"  readOnly="fasle"  cssStyle="width:95%" 
												cssClass="search-squre input-small" />
									</th>
									<th >
										<s:select name="e.children[0].isDelete" value="1"
												list="#{'1':'是'}"   readOnly="fasle" cssStyle="width:95%" 
												cssClass="search-squre input-small" />
									</th> 
								</tr>
							</s:else>
						</table>
					</div>
			</div>
	</s:form>
	 
</body>
	<script src="<%=request.getContextPath() %>/resource/jquery-jquery-ui/ui/jquery.ui.core.js"></script>
	<script src="<%=request.getContextPath() %>/resource/jquery-jquery-ui/ui/jquery.ui.widget.js"></script>
	<script src="<%=request.getContextPath() %>/resource/jquery-jquery-ui/ui/jquery.ui.tabs.js"></script>
	
	
	<script type="text/javascript">
	$(function() {
		$( "#tabs" ).tabs({
			//event: "mouseover"
		});
		 $("#username").focus();
			var setting = {
					check: {
						enable: true,
						dblClickExpand: false
					},view: {
						fontCss: getFontCss
					},callback: {
						onClick: onClick
					}
			};
			function onClick(e,treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj("treeDemo2");
				zTree.expandNode(treeNode);
			}
			
			function getFontCss(treeId, treeNode) {
				return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
			}
			
			loadMenusTree($("#id").val());
			
			//加载菜单树
			function loadMenusTree(id){
				$.ajax({
					url:"<%=request.getContextPath()%>manage/supplier!getRootCatalogs.action?e.id="+id,
					type:"get",
					dataType:"text",
					success:function(data, textStatus){
						var zNodes = eval('('+data+')');
						$.fn.zTree.init($("#treeDemo2"), setting, zNodes);
						$("#role_name").focus();
					},
					error:function(){
						alert("error");
					}
				});
			}
			
			
			
			//编辑角色
			$("#saveSupplierBtn").click(function(){
				var supplierCode = $("#supplierCode").val();
				var supplierId = $("#id").val();
				if(!supplierCode && !supplierId){
					alert("供应商编号不能为空！");
					return false;
				}
				var supplierName = $("#supplierName").val();
				if(!supplierName){
					alert("供应商名称不能为空！");
					return false;
				}
				
				var linkMenName=$("#supplierlinkmen tbody tr:eq(1) th:eq(1) input").val();
				if(!linkMenName){
					alert("主要联系人不能为空！");
					return false;
				}
				var ids = "";
				var treeObj = $.fn.zTree.getZTreeObj("treeDemo2");
				var nodes = treeObj.getCheckedNodes(true);
				for(var i=0;i<nodes.length;i++){
					ids+=nodes[i].id+",";
				}
				$("#catalogIds").val(ids);
				return true;
			});
			
	});
	</script>
	
	
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/zTree3.1/js/jquery.ztree.all-3.1.min.js"></script>
<link rel="stylesheet" href="<%=request.getContextPath()%>/resource/zTree3.1/css/zTreeStyle/zTreeStyle.css" type="text/css">
</html>
