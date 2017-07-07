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
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resource/My97DatePicker/WdatePicker.js"></script>
</head>

<body>
	<s:form action="oss" namespace="/manage" method="post" theme="simple">
		<table class="table table-bordered">
			<tr>
				<td colspan="6">
					<button method="oss!selectList.action" class="btn btn-primary"
						onclick="selectList(this)">
						<i class="icon-search icon-white"></i> 查询
					</button> <%-- 					<s:submit method="toAdd" value="添加" cssClass="btn btn-success" />  --%>
					<%-- 					<s:submit method="deletes" onclick="return deleteSelect();" value="删除" cssClass="btn btn-danger" /> --%>
					<div
						style="float: right; vertical-align: middle; bottom: 0px; top: 10px;">
						<%@ include file="/WEB-INF/manages/system/pager.jsp"%>
					</div>
				</td>
			</tr>
		</table>

		<table class="table table-bordered table-hover">
			<tr style="background-color: #dff0d8">
				<th width="20"><input type="checkbox" id="firstCheckbox" /></th>
				<th style="display: none;">编号</th>
				<th>名称</th>
				<th>代码</th>
				<th>状态</th>
				<th width="50px">操作</th>
			</tr>
			<s:iterator value="pager.list">
				<tr>
					<td><input type="checkbox" name="ids"
						value="<s:property value="id"/>" /></td>
					<td style="display: none;">&nbsp;<s:property value="id" /></td>
					<td>&nbsp;<s:property value="name" /></td>
					<td>&nbsp;<s:property value="code" /></td>
					<td>&nbsp; <s:if test="status.equals(\"y\")">
							<!-- 							<input type="radio" name="e.status" checked="checked"/> -->
							<img
								src="<%=request.getContextPath() %>/resource/images/action_check.gif">
						</s:if> <s:else>
							<!-- 							<input type="radio" name="e.status"/> -->
							<img
								src="<%=request.getContextPath() %>/resource/images/action_delete.gif">
						</s:else>
					</td>
					<td><s:a href="oss!toEdit.action?e.id=%{id}">编辑</s:a></td>
				</tr>
			</s:iterator>

			<tr>
				<td colspan="17" style="text-align: center;"><%@ include
						file="/WEB-INF/manages/system/pager.jsp"%></td>
			</tr>
		</table>
	</s:form>
</body>
</html>
