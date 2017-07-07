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
</head>

<body>
<% application.setAttribute("_productSupplierList", SystemManager.productSupplierList); %>
	<s:form action="supplier!selectList" namespace="/manage" method="post"
		theme="simple">
		<table class="table table-bordered">
			<tr>
			 	<td style="text-align: right;" nowrap="nowrap">供应商类别</td>
				<td style="text-align: left;">
					<select name="e.type" id="type" class="input-medium">
						<option id="" pid="" value="">全部</option>
						<s:iterator value="#application._productSupplierList">
							<option  value="<s:property value="key"/>"> <font color='red'><s:property value="value" /></font></option>
						</s:iterator>
				</select>
				</td>
				
				<td style="text-align: right;" nowrap="nowrap">供应商编号</td>
				<td style="text-align: left;"><s:textfield name="e.code"
						cssClass="input-small" id="code" /></td>
						
				<td style="text-align: right;" nowrap="nowrap">供应商名称</td>
				<td style="text-align: left;"><s:textfield name="e.name"
						cssClass="input-small" id="name" /></td>
						
				<td style="text-align: right;" nowrap="nowrap">状态</td>
				<td style="text-align: left;">
				<s:select list="#{'':'','y':'启用','n':'停用'}" id="status" name="e.status"
						cssClass="input-medium" listKey="key" listValue="value" /></td>
				<td style="text-align: right;" nowrap="nowrap">联系人</td>
				<td style="text-align: left;"><s:textfield name="e.children.name"
						cssClass="input-small" id="ename" /></td>
				<td style="text-align: right;" nowrap="nowrap">电话</td>
				<td style="text-align: left;"><s:textfield name="e.children.tel"
						cssClass="input-small" id="etel" /></td>
			</tr>
			<tr>
				<td colspan="28">
						<button method="supplier!selectList.action" class="btn btn-primary" onclick="selectList(this)">
							<i class="icon-search icon-white"></i> 查询
						</button>
						<s:a method="toAdd" cssClass="btn btn-success">
								<i class="icon-plus-sign icon-white"></i> 添加
						</s:a> 
						<button method="supplier!deletes.action" class="btn btn-danger"
								onclick="return submitIDs(this,'确定删除选择的记录?');">
								<i class="icon-remove-sign icon-white"></i> 删除
						</button>
					<div style="float: right; vertical-align: middle; bottom: 0px; top: 10px;">
						<%@ include file="/WEB-INF/manages/system/supplierPager.jsp"%>
					</div>
				</td>
			</tr>
		</table>

		<table class="table table-bordered table-hover">
			<tr style="background-color: #dff0d8">
				<th width="20"> <input type="checkbox" id="firstCheckbox" /></th>
				<th nowrap="nowrap">供应商名称</th>
				<th nowrap="nowrap">供应商编号</th>
				<th nowrap="nowrap">供应商类别</th>
				<th nowrap="nowrap">首要联系人</th>
				<th align="center">联系人电话</th>
				<th nowrap="nowrap">座机</th>
				<th nowrap="nowrap">QQ/微信/邮箱</th>
				<th nowrap="nowrap">联系地址</th>
				<th nowrap="nowrap">状态</th>
				<th nowrap="nowrap">操作</th>
			</tr>
			
			<s:iterator value="pager.list">
				<tr>
					<td><input type="checkbox" name="ids" value="<s:property value="id"/>" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="name" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="code" /> </td>
					<td nowrap="nowrap">&nbsp;
							<s:iterator value="#application._productSupplierList" var="item">
								  <s:if test="key==type">
								  		 <s:property value="value" /> 
								  </s:if>
							</s:iterator>
					</td>
					<td nowrap="nowrap">&nbsp;<s:property value="mName" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="tel" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="phone" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="QQ"/></td>
					<td nowrap="nowrap">&nbsp;<s:property value="address" /></td>
					<td nowrap="nowrap">&nbsp; 
						<s:if test="status.equals(\"n\")">
							<font color="red">停用</font>
						</s:if> 
						<s:elseif test="status.equals(\"y\")">
							启用
						</s:elseif> 
					</td>
					<td nowrap="nowrap">
						<s:a target="_self" href="supplier!toEdit.action?e.id=%{id}">编辑</s:a>
						|<s:a target="_self" href="product!toSupplierInProduct.action?e.supplierId=%{id}">关联产品</s:a>
						|<s:if test="status.equals(\"y\")">
							<s:a href="supplier!updateOne.action?e.id=%{id}&e.status=n">停用</s:a>
						</s:if>
						<s:elseif test="status.equals(\"n\")">
							<s:a href="supplier!updateOne.action?e.id=%{id}&e.status=y">启用</s:a>
						</s:elseif>
					</td>
				</tr>
			</s:iterator>
			<tr>
				<td colspan="16" style="text-align: center;"><%@ include
						file="/WEB-INF/manages/system/supplierPager.jsp"%></td>
			</tr>
		</table>
	</s:form>
	<script type="text/javascript" src="<%=request.getContextPath()%>/resource/My97DatePicker/WdatePicker.js"></script>
	<script type="text/javascript">
	$(function() {
		function c1(f) {
			$(":checkbox").each(function() {
				$(this).attr("checked", f);
			});
		}
		$("#firstCheckbox").click(function() {
			if ($(this).attr("checked")) {
				c1(true);
			} else {
				c1(false);
			}
		});

	});
	function deleteSelect() {
		if ($("input:checked").size() == 0) {
			return false;
		}
		return confirm("确定删除选择的记录?");
	}
</script>
</body>
</html>
