<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/resource/common_html_meat.jsp"%>
<%@ include file="/WEB-INF/manages/system/common.jsp"%>
<%@ include file="/resource/common_html_validator.jsp"%>
<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/jquery-jquery-ui/themes/base/jquery.ui.all.css">
<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/themes/default/default.css" />



<title>批量导入</title>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

</head>

<body>
	<form action="/manage/order!doImport.action" method="post"
		enctype="multipart/form-data" name="form">
		<div class="list-div">
			<div align="left"></div>
			<table class="table table-bordered" style="width: 95%; margin: auto;">
				<tbody>
					<tr style="background-color: #dff0d8">
						<td colspan="2"
							style="background-color: #dff0d8; text-align: center;"><span
							style="float: left; color: green"></span> <span
							class="badge badge-success">批量导入</span>&nbsp; <span
							style="float: right;">
								<button type="submit" class="btn btn-warning">
									<i class="icon-white"></i>批量导入
								</button>
						</span></td>
					</tr>

					<tr>
						<th width="150" align="left">方式</th>
						<td>说明：1.单列为快递单号模式(改变订单状态)<br />
							<p style="padding-left: 37px;">2.双列为订单ID+制表符+快递单号（录入快递单号）</p>
						</td>
					</tr>
					<!-- 			<tr> -->
					<!-- 				<th width="150" align="left">选择文件</th> -->
					<!-- 				<td> -->
					<!-- 				<input type="file" name="file"> -->

					<!-- 				</td> -->
					<!-- 			</tr>			 -->
					<tr>
						<th align="left">选择状态</th>
						<td><s:select cssClass="search-query " style="width:150px;"
								list="#{'':'请选择订单状态','pass':'已付款，待发货','send':'已发货，待签收','sign':'已签收','cancel':'已取消','exception':'确认异常','return':'退货处理','transferable':'退换处理','returnsign':'退货已签收'}"
								name="e.status" id="status" listKey="key" listValue="value" />

							<%
					application.setAttribute("_expressMap", SystemManager.manageExpressMap);
					%> <s:select list="#application._expressMap" listKey="key"
								listValue="value" style="width:150px;" headerKey=""
								headerValue="请选择物流公司" name="e.expressCompanyName"
								id="expressCompanyName" /> <s:select
								cssClass="search-query input-small"
								style="width:150px;display:none;" list="#{'y':'已付款'}"
								name="e.paystatus" id="paystatus" listKey="key"
								listValue="value" /></td>
					</tr>
					<tr>
						<th align="left">内容</th>
						<td>


							<table>
								<tr>
									<td><textarea style="width: 300px;" rows="20"
											name="content"></textarea></td>

									<td>${mess}</br> <c:forEach items="${result }" var="rr">${rr }<br />
										</c:forEach>
									</td>
								</tr>
							</table>
						</td>

					</tr>

				</tbody>
			</table>
		</div>
	</form>
</body>
</html>
