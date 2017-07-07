<%@page import="net.onlineshop.core.ManageContainer"%>
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
<link rel="stylesheet" href="<%=request.getContextPath() %>/resource/jquery-jquery-ui/themes/base/jquery.ui.all.css">
<link rel="stylesheet" href="<%=request.getContextPath()%>/resource/bootstrap/css/bootstrap.min.css" type="text/css">
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/jquery.blockUI.js"></script>
<script type="text/javascript" src="<%=request.getContextPath() %>/resource/bootstrap/js/bootstrap.min.js"></script>
<script src="/resource/js/popup_layer.js" type="text/javascript" language="javascript"></script>
<script src="/resource/js/layer/layer.js"></script>
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
.layui-layer-content
	{
	height: 100%
	}
	 #layui-layer-iframe1{
	 height: 100%
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

a.closeBtn:hover {
	color: #fff;
	border: 1px solid #85B6E2;
	background: #85B6E2;
}

a.closeBtn {
	position: absolute;
	top: 10px;
	right: 10px;
	display: block;
	width: 60px;
	padding: 4px 0;
	text-align: center;
	background: #fff;
	border: 1px solid #85B6E2;
	color: #333;
}

a {
	text-decoration: none;
}
</style>
<script type="text/javascript">
	var expandAllFlg = true;
	var checkAllTrueOrFalseFlg = true;
	var layerUI;
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
	
	function addProductType(obj){
		layerUI=layer;
		var supplierId=$("#esupplierId").val();
		try{
			layer.open({
			    type: 2,
			    title: "选择供应商",
			    shade: 0.8,
			    area: ['1200px', '90%'],
			    moveType: 1,
			  	shift: 1,
			  	shadeClose: false,
			  	closeBtn: 2,
			    content: "/manage/product!selectProductType?e.supplierId="+supplierId
			}); 
		}
		catch (e) {
			layerUI=layer;
		}
		
		$(".layui-layer-ico").click(function(){
			layer.closeAll();
			layerUI.closeAll();
			$("#_form").attr("action","product!toSupplierInProduct.action");
			$("#_form").submit();
		});
		
		
	}
	
	function addtr(){
		var trlen=$("#supplierlinkmen").find("tr").length-1;
		for(i=0;i<1;i++){
			var arrayObj = new Array();
				arrayObj.push('<tr>');
				arrayObj.push('<th style="display: none;"><input type="text" name="e.children['+(trlen+i)+'].id"  value="" id="form_e_children_0__id" /></th>');
				arrayObj.push('<th><input type="text" name="e.children['+(trlen+i)+'].name"  value="" class="search-query input-small" id="form_e_children_'+(trlen+i)+'__name"/></th>');
				arrayObj.push('<th><input type="text" name="e.children['+(trlen+i)+'].tel"  value="" class="search-query input-small" id="form_e_children_'+(trlen+i)+'__tel"/></th>');
				arrayObj.push('<th><input type="text" name="e.children['+(trlen+i)+'].phone" value="" class="search-query input-small" id="form_e_children_'+(trlen+i)+'__phone"/></th>');
				arrayObj.push('<th><input type="text" name="e.children['+(trlen+i)+'].QQ"  value="" class="search-query input-small" id="form_e_children_'+(trlen+i)+'__qq"/></th>');
				arrayObj.push('<th><input type="text" name="e.children['+(trlen+i)+'].address"  value="" class="search-query input-small" id="form_e_children_'+(trlen+i)+'__address"/></th>');
				arrayObj.push('<th><select name="e.children['+(trlen+i)+'].isMain" id="form_e_children_'+(trlen+i)+'__isMain" class="search-query input-small"><option value="n">否</option><option value="y">是</option></select></th>');
				arrayObj.push('<th><select name="e.children['+(trlen+i)+'].isDelete" id="form_e_children_'+(trlen+i)+'__isDelete" class="search-query input-small"><option value="y">显示</option><option value="n">不显示</option></select></th>');
				arrayObj.push('</tr>');
				$("#supplierlinkmen").append(arrayObj.join("")); 
		}
	}
</script>
</head>

<body>
	<s:form id="_form" action="product" namespace="/manage" method="post" theme="simple">
		<input type="hidden" value="<s:property value="e.catalogID"/>" id="catalogID" />
		<table class="table table-bordered table-condensed">
			<!-- <tr>

				<td style="text-align: right;">状态</td>
				<td style="text-align: left;">
				<s:select list="#{1:'新增',2:'已上架',3:'已下架'}" id="status" name="e.status" headerKey="" headerValue="全部" 
						cssClass="input-medium" listKey="key" listValue="value" /></td>
				<td style="text-align: right;">商品分类</td>
				<td>
					<%
					application.setAttribute("catalogs", SystemManager.catalogs);
					application.setAttribute("productTypeList", SystemManager.productTypeList);
					%> <select name="e.catalogID" id="catalogSelect"
					class="input-medium">
						<option id="" pid="" value="">全部</option>
						<s:iterator value="#application.catalogs">
							<option pid="0" value="<s:property value="id"/>"><font
									color='red'><s:property value="name" /></font></option>
							<s:iterator value="children">
								<option value="<s:property value="id"/>">&nbsp;&nbsp;&nbsp;&nbsp;
									<s:property value="name" /></option>
							</s:iterator>
						</s:iterator>
				</select>
				</td>
				<td style="text-align: right;">商品类型</td>
				<td>
					 <s:select name="e.productType" headerKey="" headerValue="全部" 
					 	list="#application.productTypeList" id="productType" listKey="index" listValue="name" cssClass="input-medium">
					</s:select>
				</td>
			</tr>
			<tr>
				<td style="text-align: right;">商品编号</td>
				<td style="text-align: left;"><s:textfield name="e.id"
						cssClass="search-query input-small" id="id" /></td>
				<td style="text-align: right;">商品名称或编码</td>
				<td style="text-align: left;"><s:textfield name="e.name" id="name" /></td>

				<td style="text-align: right;">商品价格</td>
				<td style="text-align: left;" colspan="9"><input id="d4311"
					class="search-query input-small" type="text" name="e.startPrice"
					value="<s:property value="e.startPrice" />" /> ~ <input
					id="d4312" class="search-query input-small" type="text"
					name="e.endPrice" value="<s:property value="e.endPrice" />" />
				</td>
			</tr> -->
			<tr>
				 <td colspan="20">
				 <button onclick="javascript:addProductType()" type="button"   class="btn btn-primary">
						 <i class="icon-remove-sign icon-white"></i> 关联产品
				 </button>
				 <button method="product!remvoeProducts.action" class="btn btn-danger"
						onclick="return submitIDs(this,'确定移除记录吗?');">
						<i class="icon-remove-sign icon-white"></i> 取消关联
				</button>
				 <button method="supplier!selectList.action" class="btn" onclick="selectList(this)">
								<i class="icon-share-alt icon-white">
								</i> 返回
						</button>
				 <input id="esupplierId" type="hidden"   name="e.supplierId" value="<s:property value="e.supplierId"/>"/>
					<div
						style="float: right; vertical-align: middle; bottom: 0px; top: 10px;">
						<%@ include file="/WEB-INF/manages/system/productPager.jsp"%>
					</div>
				</td>
			</tr>
		</table>

		<table class="table table-bordered table-condensed table-hover">
			<tr style="background-color: #dff0d8">
				<th width="20"><input type="checkbox" id="firstCheckbox" /></th>
				<th nowrap="nowrap">编号</th>
				<th>名称</th>
				<th>商品编码</th>
				<th>定价</th>
				<th>现价</th>
				<th>产品类型</th>
				<th>录入日期</th>
				<!-- <th>推荐</th>
				<th>新品</th>
				<th>特价</th> -->
				<th>浏览次数</th>
				<th>发货周期</th>
				<th>库存</th>
				<th>销量</th>
				<!-- <th>状态</th> -->
			</tr>
			<s:iterator value="pager.list">
				<tr>
					<td><input type="checkbox" name="ids"
						value="<s:property value="id"/>" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="id" /></td>

					<td><img width="60" src="<s:property value="picurl160" />"
						style="float: left;"> 
						<s:if test="giftID!=null and giftID!=''">
							【赠品】
						</s:if> 
							<s:property value="name" />
						<s:if test="taourl==null or taoutl==''">
							<span style="float: right; background: red; color: #fff; font-size: 10px; padding: 2px; border-radius: 3px; line-height: 12px;">包邮</span>
						</s:if>
					</td>
					<td>&nbsp;<s:property value="shortname" /></td>
					<td>&nbsp;<s:property value="price" /></td>
					<td>&nbsp;<s:property value="nowPrice" /></td>
					<td>&nbsp;
						<s:iterator value="#application.productTypeList" var="item">
						  <s:if test="productType==index">
						  		 <s:property value="name" /> 
						  </s:if>
						</s:iterator>
					</td>
					
					<td>&nbsp;<s:property value="createtime" /></td>
					<!-- 
					<td>&nbsp; <s:if test="istui.equals(\"n\")">
							<font color='red'></font>
						</s:if> <s:elseif test="istui.equals(\"y\")">
							<img alt="推荐"
								src="<%=request.getContextPath() %>/resource/images/action_check.gif">
						</s:elseif>
					</td>
					<td>&nbsp; <s:if test="isnew.equals(\"n\")">
							<font color='red'></font>
						</s:if> <s:elseif test="isnew.equals(\"y\")">
							<img alt="新品"
								src="<%=request.getContextPath() %>/resource/images/action_check.gif">
						</s:elseif>
					</td>
					<td>&nbsp; <s:if test="sale.equals(\"n\")">
							<font color='red'></font>
						</s:if> <s:elseif test="sale.equals(\"y\")">
							<img alt="特价"
								src="<%=request.getContextPath() %>/resource/images/action_check.gif">
						</s:elseif>
					</td>-->
					<td>&nbsp;<s:property value="hit" /></td>
					<td>&nbsp;<s:property value="maxPicture" /></td>
					<td>&nbsp; <s:if test="stock>0">
							<s:property value="stock" />
						</s:if> <s:else>
							<span class="badge badge-important">库存告急</span>
						</s:else>
					</td>
					<td>&nbsp;<s:property value="sellcount" /></td>
				<!--  <td>&nbsp; <s:if test="status==1">
							<img alt="新增"
								src="<%=request.getContextPath() %>/resource/images/action_add.gif">
						</s:if> <s:elseif test="status==2">
							<img alt="已上架"
								src="<%=request.getContextPath() %>/resource/images/action_check.gif">
						</s:elseif> <s:elseif test="status==3">
							<img alt="已下架"
								src="<%=request.getContextPath() %>/resource/images/action_delete.gif">
						</s:elseif>-->	
					</td>
				</tr>
			</s:iterator>

			<tr>
				<td colspan="70" style="text-align: center;"><%@ include
						file="/WEB-INF/manages/system/productPager.jsp"%></td>
			</tr>
		</table>

		<div class="alert alert-info" style="text-align: left; font-size: 14px; margin: 2px 0px;">
			图标含义： <img alt="新增"
				src="<%=request.getContextPath() %>/resource/images/action_add.gif">：新增商品
			<img alt="已上架"
				src="<%=request.getContextPath() %>/resource/images/action_check.gif">：商品已上架
			<img alt="已下架"
				src="<%=request.getContextPath() %>/resource/images/action_delete.gif">：商品已下架
		</div>

	</s:form>
	<script charset="utf-8"
		src="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/kindeditor-min.js"></script>
	<script charset="utf-8"
		src="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/lang/zh_CN.js"></script>
	<script type="text/javascript">



			KindEditor.ready(function(K) {
				var editor = K.editor({

					allowFileManager : true
				});
				K('#J_selectImage').click(function() {
					editor.loadPlugin('multiimage', function() {
						editor.plugin.multiImageDialog({
							clickFn : function(urlList) {
								var div = K('#J_imageView');
								div.html('');
								K.each(urlList, function(i, data) {
									div.append('<img src="' + data.url + '">');
								});
								editor.hideDialog();
							}
						});
					});
				});
			});

	$(function() {
		selectDefaultCatalog();
	});
	
	
	function selectDefaultCatalog(){
		var _catalogID = $("#catalogID").val();
		if(_catalogID!='' && _catalogID>0){
			$("#catalogSelect").val(_catalogID);
		}
	}
</script>
</body>
</html>
