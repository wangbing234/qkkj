<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ page session="false"%>
<%@ taglib uri="http://jsptags.com/tags/navigation/pager" prefix="pg"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/resource/common_html_meat.jsp"%>
<%@ include file="/WEB-INF/manages/system/common.jsp"%>
<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/zTree3.1/css/zTreeStyle/zTreeStyle.css"
	type="text/css">
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resource/My97DatePicker/WdatePicker.js"></script>
<style type="text/css">
.titleCss {
	background-color: #e6e6e6;
	border: solid 1px #e6e6e6;
	position: relative;
	margin: -1px 0 0 0;
	line-height: 32px;
	text-align: left;
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
</style>
</head>

<body>
	<s:form action="report!userSales.action" namespace="/manage"
		method="post" theme="simple" id="form" name="form">
		<table class="table table-bordered">
			<tr>
				<td style="text-align: right;" nowrap="nowrap">日期范围</td>
				<td style="text-align: left;"><input id="startDate"
					class="Wdate search-query input-small" type="text"
					name="e.startDate" value="<s:property value="e.startDate" />"
					onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\'endDate\')||\'2020-10-01\'}'})" />
					~ <input id="endDate" class="Wdate search-query input-small"
					type="text" name="e.endDate"
					value="<s:property value="e.endDate" />"
					onFocus="WdatePicker({dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\'startDate\')}',maxDate:'2020-10-01'})" />
				</td>
				<td>用户类型</td>
				<td><s:select cssStyle="width:100px;"
						list="#{'':'','0':'个人','1':'企业'}" name="e.userType" id="userType"
						listKey="key" listValue="value" /></td>
			</tr>
			<tr>
				<td colspan="16">
					<button method="report!userSales.action" class="btn btn-primary"
						onclick="selectList(this)">
						<i class="icon-search icon-white"></i> 查询
					</button> <input type="hidden" name="type" value="${type}" />
				</td>
			</tr>
		</table>

		<table class="table table-bordered table-hover">
			<tr style="background-color: #dff0d8">
				<th width="220px">统计开始时间</th>
				<th width="220px">统计结束时间</th>
				<th>用户类型</th>
				<th>注册数量</th>
			</tr>
			<c:forEach items="${list}" var="item">
				<tr>
					<c:if
						test="${(e.startDate == '' || e.startDate == null) && (e.endDate == '' || e.endDate == null)}">
						<td>&nbsp;截止当前</td>
						<td>&nbsp;截止当前</td>
					</c:if>
					<c:if
						test="${(e.startDate != '' && e.startDate != null) || (e.endDate != '' && e.endDate != null)}">
						<td>&nbsp;${e.startDate }</td>
						<td>&nbsp;${e.endDate }</td>
					</c:if>
					<td>&nbsp;<c:if test="${item.userType == 0 }">个人</c:if> <c:if
							test="${item.userType == 1 }">企业</c:if>
					</td>
					<td>&nbsp;${item.productSellCount}</td>
				</tr>
			</c:forEach>
		</table>
	</s:form>


	<SCRIPT type="text/javascript">
function queryForm(obj){
	var _form = $("#form");
	var year = $("#year");
	var month = $("#month");
	var day = $("#day");
	var cc = true;
	if($.trim(day.val()) != "" && $.trim(day.val()).length > 0){
		if($.trim(year.val()) == "" || $.trim(year.val()).length == 0){
			cc = false;
			alert("请选择年份");
			return false;
		}
		if($.trim(month.val()) == "" || $.trim(month.val()).length == 0){
			alert("请选择月份");
			cc = false;
			return false;
		}
	}else if($.trim(month.val()) != "" && $.trim(month.val()).length > 0){
		if($.trim(year.val()) == "" || $.trim(year.val()).length == 0){
			alert("请选择年份");
			cc = false;
			return false;
		}
	}
	if(cc){
		_form.attr("action",$(obj).attr("method"));
		_form.submit();
	}
}
</SCRIPT>
</body>
</html>
