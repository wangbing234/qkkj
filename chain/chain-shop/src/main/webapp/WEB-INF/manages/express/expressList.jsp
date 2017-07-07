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
	<s:form action="express" namespace="/manage" method="post"
		theme="simple">
		<table class="table table-bordered">
			<tr>
				<td colspan="8">

					<button
						method="express!toAdd.action?areaCode=<s:property escapeHtml="false" value="e.areaCode" />"
						cssClass="btn btn-success" onclick="selectList(this)">
						<i class="icon-plus-sign icon-white"></i> 添加
					</button>

					<button
						method="express!deletes.action?e.areaCode=<s:property escapeHtml="false" value="e.areaCode" />"
						class="btn btn-danger"
						onclick="return submitIDs(this,'确定删除选择的记录?');">
						<i class="icon-remove-sign icon-white"></i> 删除
					</button> <br /> <br /> <%application.setAttribute("areaMap", SystemManager.areaMap); %>

					<s:iterator value="#application.areaMap">


						<button
							method="express!selectList.action?e.areaCode=<s:property escapeHtml="false" value="value.code" />"
							class="btn btn-primary" onclick="selectList(this)">
							<s:property escapeHtml="false" value="value.name" />


						</button>

					</s:iterator>
				</td>
			</tr>
		</table>

		<table class="table table-bordered table-hover">
			<tr style="background-color: #dff0d8">
				<th width="20"><input type="checkbox" id="firstCheckbox" /></th>
				<th nowrap="nowrap">快递编码</th>
				<th nowrap="nowrap">名称</th>
				<th nowrap="nowrap">配送区域</th>
				<th nowrap="nowrap">费用</th>
				<th nowrap="nowrap">周期</th>
				<th nowrap="nowrap">顺序</th>
				<th style="width: 115px;">操作</th>
			</tr>
			<s:iterator value="pager.list">
				<tr>
					<td><input type="checkbox" name="ids"
						value="<s:property value="id"/>" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="code" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="name" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="areaCode" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="fee" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="dayNum" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="order1" /></td>
					<td nowrap="nowrap"><s:a
							href="express!toEdit.action?e.id=%{id}">编辑</s:a></td>
				</tr>
			</s:iterator>

		</table>
	</s:form>
</body>
</html>
