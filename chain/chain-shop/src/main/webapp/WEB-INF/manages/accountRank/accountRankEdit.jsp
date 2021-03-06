<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/resource/common_html_meat.jsp"%>
<%@ include file="/WEB-INF/manages/system/common.jsp"%>
<%@ include file="/resource/common_html_validator.jsp"%>
</head>

<body>
	<s:form action="accountRank" namespace="/manage" theme="simple"
		id="form">
		<table class="table table-bordered">
			<tr>
				<td colspan="2"
					style="background-color: #dff0d8; text-align: center;"><strong>会员等级编辑</strong>
				</td>
			</tr>
			<tr style="display: none;">
				<td>id</td>
				<td><s:hidden name="e.id" label="id" id="id" /></td>
			</tr>
			<tr>
				<td style="text-align: right;">code</td>
				<td style="text-align: left;"><s:textfield name="e.code"
						id="code" data-rule="code:required;code;length[1~10];" /></td>
			</tr>
			<tr>
				<td style="text-align: right;">等级名称</td>
				<td style="text-align: left;"><s:textfield name="e.name"
						data-rule="等级名称:required;name;length[1~10];" id="name"></s:textfield></td>
			</tr>

			<tr>
				<td style="text-align: right;">备注</td>
				<td style="text-align: left;"><s:textfield name="e.remark"
						id="remark" /></td>
			</tr>
			<tr>
				<td style="text-align: center;" colspan="2"><s:if
						test="e.id=='' or e.id==null">
						<%-- 					<s:submit method="insert" value="新增" cssClass="btn btn-primary"/> --%>
						<%-- 					<s:a method="insert" cssClass="btn btn-success"> --%>
						<!-- 						<i class="icon-plus-sign icon-white"></i> 新增 -->
						<%-- 					</s:a> --%>
						<button method="accountRank!insert.action" class="btn btn-success">
							<i class="icon-ok icon-white"></i> 新增
						</button>
					</s:if> <s:else>
						<%-- 					<s:submit method="update" value="保存" cssClass="btn btn-primary"/> --%>
						<%-- 					<s:a method="update" cssClass="btn btn-success"> --%>
						<!-- 						<i class="icon-ok icon-white"></i> 保存 -->
						<%-- 					</s:a> --%>
						<button method="accountRank!update.action" class="btn btn-success">
							<i class="icon-ok icon-white"></i> 保存
						</button>
					</s:else> <%-- 				<s:submit method="back" value="返回" cssClass="btn btn-inverse"/> --%>
				</td>
			</tr>
		</table>
	</s:form>
</body>
</html>
