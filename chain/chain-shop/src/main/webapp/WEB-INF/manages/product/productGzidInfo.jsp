<%@page import="net.onlineshop.core.PrivilegeUtil"%>
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



	<s:form action="product!gzidInfo.action" namespace="/manage"
		method="post" theme="simple">
		<input type="hidden" value="<s:property value="e.id"/>" name="e.id" />
		<table class="table table-bordered">
			<tr>
				<td style="text-align: right;" nowrap="nowrap">日期范围</td>
				<td style="text-align: left;"><input id="startDate"
					class="Wdate search-query input-small" type="text"
					name="e.startDate" value="<s:property value="e.startDate" />"
					onFocus="WdatePicker({readOnly:true,dateFmt:'yyyy-MM-dd',maxDate:'#F{$dp.$D(\'endDate\')||\'2050-10-01\'}'})" />
					~ <input id="endDate" class="Wdate search-query input-small"
					type="text" name="e.endDate"
					value="<s:property value="e.endDate" />"
					onFocus="WdatePicker({readOnly:true,dateFmt:'yyyy-MM-dd',minDate:'#F{$dp.$D(\'startDate\')}',maxDate:'2050-10-01'})" />
				</td>

				<td>

					<button class="btn btn-primary">
						<i class="icon-search icon-white"></i> 查询
					</button>
				</td>
			</tr>
		</table>

		<table class="table table-bordered table-condensed table-hover"
			style="width: 65%; float: left">
			<tr style="background-color: #dff0d8">

				<th>编号</th>
				<th>产品</th>
				<th>销售额</th>
				<th>订单量</th>

			</tr>
			<c:forEach items="${sellObject}" var="info" varStatus="vs">
				<tr>
					<td nowrap="nowrap">&nbsp;${vs.index+1}</td>
					<td nowrap="nowrap">&nbsp;${info.productName}</td>
					<td nowrap="nowrap">&nbsp;${info.totalSell}</td>
					<td nowrap="nowrap">&nbsp;${info.countOrder}</td>

				</tr>
			</c:forEach>



		</table>

		<table class="table table-bordered table-condensed table-hover"
			style="width: 34%; float: right">
			<tr style="background-color: #dff0d8">


				<th>编号</th>
				<th>GZID</th>
				<th>订单量</th>

			</tr>
			<c:forEach items="${gzObject}" var="info" varStatus="vs">
				<tr>
					<td nowrap="nowrap">&nbsp;${vs.index+1}</td>
					<td nowrap="nowrap">&nbsp;${info.gzid}</td>
					<td nowrap="nowrap">&nbsp;${info.num}</td>

				</tr>
			</c:forEach>


		</table>

	</s:form>


	<script type="text/javascript">


</script>
</body>
</html>
