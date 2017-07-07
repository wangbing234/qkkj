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
	<s:form action="transport" namespace="/manage" method="post"
		theme="simple">

		<table class="table table-bordered">
			<tr>
				<td colspan="4">
					<%-- 						<s:submit method="selectList" value="查询" cssClass="btn btn-primary"/> --%>
					<s:a method="list.action" cssClass="btn btn-primary">
						<i class="icon-search icon-white"></i> 查询
						</s:a> <%-- 						<s:submit method="toAdd" value="添加" cssClass="btn btn-success"/> --%>
					<a href="/manage/transport!toAdd.action" class="btn btn-success">
						<i class="icon-plus-sign icon-white"></i> 添加
				</a>


					<button method="transport!deletes.action" class="btn btn-danger"
						onclick="return submitIDs(this,'确定删除选择的记录?');">
						<i class="icon-remove-sign icon-white"></i> 删除
					</button>


				</td>
			</tr>
		</table>



		<table class="table table-bordered">
			<tr style="background-color: #dff0d8">
				<th width="20"><input type="checkbox" id="firstCheckbox" /></th>
				<th width="40">序号</th>
				<th nowrap="nowrap">标题</th>


				<th style="width: 50px;">操作</th>
			</tr>


			<c:forEach items="${list}" var="transport" varStatus="vs">
				<tr>
					<td><input type="checkbox" name="ids" value="${transport.id }" /></td>
					<td>&nbsp;${vs.index+1}</td>
					<td>&nbsp;${transport.trans_name}</td>


					<td><a
						href="/manage/transport!toEdit.action?id=${transport.id}">编辑</a></td>
				</tr>
			</c:forEach>

		</table>
	</s:form>
</body>
</html>
