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
</style>
</head>

<body>



	<s:form action="product" namespace="/manage" method="post"
		theme="simple">
		<input type="hidden" value="<s:property value="e.catalogID"/>"
			id="catalogID" />
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
				
				<td style="text-align: right;">供应商</td>
				<td style="text-align: left;" colspan="1">
				 <%application.setAttribute("supplierList", SystemManager.supplierList);%>
						<input type="hidden" value="<s:property value="e.supplierId"/>" id="supplierId" />
								 <s:select name="e.supplierId" headerKey="" headerValue="全部" 
					 list="#application.supplierList" id="supplierIdSelect" listKey="id" listValue="name" cssClass="input-medium">
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
				<!-- 						<td style="text-align: right;">录入人</td> -->
				<%-- 						<td style="text-align: left;"><s:textfield name="e.createID" cssClass="search-query input-small" --%>
				<%-- 								id="createID" /></td> --%>
			</tr>
			<tr>
				<td colspan="20">
					<%if(PrivilegeUtil.check(request.getSession(), "product!selectList.action")){%>
					<button method="product!selectList.action" class="btn btn-primary" onclick="selectList(this)">
						<i class="icon-search icon-white">
						</i> 查询
					</button>
					 <%} %>
					  <%if(PrivilegeUtil.check(request.getSession(), "product!toAdd.action")){%>
					<%-- 						<s:submit method="toAdd" value="添加" cssClass="btn btn-success" /> --%>

					<s:a method="toAdd" cssClass="btn btn-success">
						<i class="icon-plus-sign icon-white"></i> 添加
						</s:a> <%} %> <%if(PrivilegeUtil.check(request.getSession(), "product!deletes.action")){%>
					<%-- 						<s:submit method="deletes" onclick="return deleteSelect();" value="删除" cssClass="btn btn-danger" /> --%>
					<%-- 						<s:a method="deletes" cssClass="btn btn-danger" onclick="return deleteSelect();"> --%>
					<!-- 							<i class="icon-remove-sign icon-white"></i> 删除 --> <%-- 						</s:a> --%>
					<button method="product!deletes.action" class="btn btn-danger"
						onclick="return submitIDs(this,'确定删除选择的记录?');">
						<i class="icon-remove-sign icon-white"></i> 删除
					</button> <%} %> <%if(PrivilegeUtil.check(request.getSession(), "product!updateUp.action")){%>
					<%-- 						<s:submit method="updateUp" value="上架" cssClass="btn btn-warning" onclick="return upSelect();"/> --%>
					<%-- 						<s:a method="updateUp" cssClass="btn btn-warning" onclick="return upSelect();"> --%>
					<!-- 							<i class="icon-arrow-up icon-white"></i> 上架 --> <%-- 						</s:a> --%>
					<button method="product!updateUp.action" class="btn btn-warning"
						onclick="return submitIDs(this,'确定上架选择的记录?');">
						<i class="icon-arrow-up icon-white"></i> 上架
					</button> <%} %> <%if(PrivilegeUtil.check(request.getSession(), "product!updateDown.action")){%>
					<%-- 						<s:submit method="updateDown" value="下架" cssClass="btn btn-warning" onclick="return downSelect();"/> --%>
					<button method="product!updateDown.action" class="btn btn-warning"
						onclick="return submitIDs(this,'确定下架选择的记录?');">
						<i class="icon-arrow-down icon-white"></i> 下架
					</button> <%} %>
					<!--  <a href="javascript:void(0);"
					onclick="toCache('/freemarker!create.action?method=products')"
					class="btn btn-warning"> <i class="icon-refresh icon-white"></i>
						批量静态化
				</a> 					<a target="_blank" href="<%=SystemManager.systemSetting.getWww()%>/product/selectMemoryStock.html" class="btn btn-info"> -->
					<!-- 					<i class="icon-eye-open icon-white"></i> 内存库存查询</a> --> <%-- 					<a href="<%=SystemManager.systemSetting.getWww()%>/freemarker!create.action?method=products" class="btn btn-danger" onclick="javascript:return confirm('此操作将静态化前台所有商品的商品介绍，确定这么做吗？');">所有商品介绍全部静态化</a> --%>
					<input type="button" class="btn btn-success" id="J_selectImage"
					value="批量上传图片资源" />
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
				<th>供应商</th>
				<th>录入日期</th>
				<!-- <th>推荐</th>
				<th>新品</th>
				<th>特价</th> -->
				<th>浏览次数</th>
				<th>发货周期</th>
				<th>库存</th>
				<th>销量</th>
				<th>状态</th>
				<th width="60">操作</th>
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
						<s:a cssClass="product-name" title="%{name}"
							href="/manage/product!toEdit.action?e.id=%{id}">
							<s:property value="name" />
						</s:a> 
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
					<td>&nbsp;
						<s:iterator value="#application.supplierList" var="item">
						  <s:if test="supplierId==id">
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
					<td><s:a href="product!toEdit.action?e.id=%{id}">编辑</s:a>&nbsp;&nbsp;<s:if
							test="draft==true">
							<font color="red">草稿</font>
						</s:if> 
						<!--<s:if test="draft!=true">
							<a target="_blank" href="/product/<s:property value="id"/>.html">查看</a>
						</s:if>-->
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
