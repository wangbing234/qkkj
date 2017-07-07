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
	<s:form action="recharge!selectList" namespace="/manage" method="post"
		theme="simple">
		<table class="table table-bordered">
			<tr>
				<td style="text-align: right;" nowrap="nowrap">账号</td>
				<td style="text-align: left;"><s:textfield
						name="e.createAccount" cssClass="search-query input-small"
						id="account" /></td>
				<td style="text-align: right;" nowrap="nowrap">充值日期</td>
				<td style="text-align: left;" colspan="3" nowrap="nowrap"><input
					id="d4311" class="Wdate search-query input-small" type="text"
					name="e.startDate" value="<s:property value="e.startDate" />"
					onFocus="WdatePicker({maxDate:'#F{$dp.$D(\'d4312\')||\'2020-10-01\'}'})" />
					~ <input id="d4312" class="Wdate search-query input-small"
					type="text" name="e.endDate"
					value="<s:property value="e.endDate" />"
					onFocus="WdatePicker({minDate:'#F{$dp.$D(\'d4311\')}',maxDate:'2020-10-01'})" />
				</td>
				<td style="text-align: right;" nowrap="nowrap">充值方式</td>
				<td style="text-align: left;"><s:select
						list="#{'':'','alipay':'支付宝','weixin':'微信','netbank':'网银'}"
						id="type" name="e.type" cssClass="input-medium" listKey="key"
						listValue="value" /></td>
			</tr>
			<tr>
				<td colspan="28">
					<button method="recharge!selectList.action" class="btn btn-primary"
						onclick="selectList(this)">
						<i class="icon-search icon-white"></i> 查询
					</button>

					<div
						style="float: right; vertical-align: middle; bottom: 0px; top: 10px;">
						<%@ include file="/WEB-INF/manages/system/rechargePager.jsp"%>
					</div>
				</td>
			</tr>
		</table>

		<table class="table table-bordered table-hover">
			<tr style="background-color: #dff0d8">
				<th nowrap="nowrap">帐号</th>
				<th nowrap="nowrap">充值金额</th>
				<th nowrap="nowrap">现金券</th>
				<th nowrap="nowrap">充值时间</th>
				<th nowrap="nowrap">充值方式</th>
			</tr>
			<s:iterator value="pager.list">
				<tr>
					<td nowrap="nowrap">&nbsp;<s:property value="createAccount" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="money" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="fee" /></td>
					<td nowrap="nowrap">&nbsp;<s:property value="createtime" /></td>
					<td nowrap="nowrap"><s:if test="type=='alipay'">支付宝</s:if> <s:elseif
							test="type=='weixin'">微信</s:elseif> <s:elseif
							test="type=='netbank'">网银</s:elseif> <s:else>
						未知
						</s:else></td>

				</tr>
			</s:iterator>
			<tr>
				<td colspan="16" style="text-align: center;"><%@ include
						file="/WEB-INF/manages/system/rechargePager.jsp"%>
				</td>
			</tr>
		</table>
	</s:form>
	<script type="text/javascript"
		src="<%=request.getContextPath()%>/resource/My97DatePicker/WdatePicker.js"></script>
</body>
</html>
