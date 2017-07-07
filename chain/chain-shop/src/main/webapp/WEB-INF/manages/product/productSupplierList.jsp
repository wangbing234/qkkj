<%@page import="java.util.List"%>
<%@page import="net.onlineshop.core.PrivilegeUtil"%>
<%@page import ="net.onlineshop.core.emun.ProductType" %>
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
<link rel="stylesheet" href="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/themes/default/default.css"/>
<script type="text/javascript" src="<%=request.getContextPath()%>/resource/My97DatePicker/WdatePicker.js"></script>
	<style type="text/css">
			.product-name {
				display: inline-block;
				width: 250px;
				overflow: hidden; /*注意不要写在最后了*/
				white-space: nowrap;
				-o-text-overflow: ellipsis;
				text-overflow: ellipsis;
			}
			.layui-layer-content
			{
			height: 100%
			}
</style>
</head>

<body>



	<s:form action="product" namespace="/manage" method="post"
		theme="simple">
		<input type="hidden" value="<s:property value="e.catalogID"/>" id="catalogID" />
		<table class="table table-bordered table-condensed">
			<tr>

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
				<!-- ProductType 
				<td style="text-align: right;">推荐</td>
				<td style="text-align: left;">
				<s:select
						list="#{'':'','y':'是','n':'否'}" id="istui" name="e.istui"
						cssClass="input-small" listKey="key" listValue="value" /></td>
				<td style="text-align: right;">新品</td>
				<td style="text-align: left;"><s:select
						list="#{'':'','y':'是','n':'否'}" id="isnew" name="e.isnew"
						cssClass="input-small" listKey="key" listValue="value" /></td>
				<td style="text-align: right;">特价</td>
				<td style="text-align: left;"><s:select
						list="#{'':'','y':'是','n':'否'}" id="sale" name="e.sale"
						cssClass="input-small" listKey="key" listValue="value" /></td>
						-->
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
			</tr>
			<tr>
				<td colspan="20">
					<button method="product!toSupplierList.action" class="btn btn-primary" onclick="selectList(this)">
						<i class="icon-search icon-white">
						</i> 查询
					</button>
					<input   type="hidden"    name="e.supplierId" value="<s:property value="e.supplierId"/>"/>
					<button method="product!selectSupplier.action" class="btn btn-warning"
						onclick="return submitIDs(this,'确认要关联选择的产品吗？');">
						<i class="icon-plus-sign icon-white"></i> 选择
					</button>
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
				<th>状态</th>
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
					<td>&nbsp; <s:if test="status==1">
							<img alt="新增"
								src="<%=request.getContextPath() %>/resource/images/action_add.gif">
						</s:if> <s:elseif test="status==2">
							<img alt="已上架"
								src="<%=request.getContextPath() %>/resource/images/action_check.gif">
						</s:elseif> <s:elseif test="status==3">
							<img alt="已下架"
								src="<%=request.getContextPath() %>/resource/images/action_delete.gif">
						</s:elseif>
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
