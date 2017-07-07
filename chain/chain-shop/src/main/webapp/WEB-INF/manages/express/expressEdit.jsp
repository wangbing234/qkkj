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
	<s:form action="express" namespace="/manage" theme="simple" id="form">

		<input id="codeVal" value="${e.code}" style="display: none;" />
		<input id="catalogID" value="${areaCode}" style="display: none;" />
		<table class="table table-bordered">
			<tr style="display: none;">
				<td>id</td>
				<td><s:hidden name="e.id" label="id" id="id" /></td>
			</tr>
			<tr style="background-color: #dff0d8">
				<td colspan="2"
					style="background-color: #dff0d8; text-align: center;"><strong>配送方式编辑</strong>
				</td>
			</tr>

			<tr>
				<td style="text-align: right;">名称</td>
				<td style="text-align: left;"><select name="e.code"
					id="expresscCode" data-rule="名称:required;code;length[1~30];">
						<option value="" /></option>
						<option value="EXPRESS" />快递
						</option>
						<option value="EMS" />EMS
						</option>
						<option value="POST" />平邮
						</option>

				</select></td>
			</tr>
			<tr>
				<td style="text-align: right;">区域</td>

				<td style="text-align: left;">
					<%application.setAttribute("areaMap", SystemManager.areaMap); %> <select
					name="e.areaCode" id="areaCodeSelect"
					data-rule="区域:required;areaCodeSelect;length[1~30];">

						<option value="" /></option>


						<s:iterator value="#application.areaMap">

							<option id="<s:property escapeHtml="false" value="value.code" />"
								value="<s:property escapeHtml="false" value="value.name" />(<s:property escapeHtml="false" value="value.code" />)"><s:property
									escapeHtml="false" value="value.name" /></option>
						</s:iterator>


				</select>
				</td>
			</tr>
			<tr>
				<td style="text-align: right;">费用</td>
				<td style="text-align: left;"><s:textfield name="e.fee"
						id="fee" data-rule="费用:required;fee;length[1~5];"></s:textfield></td>
			</tr>
			<tr>
				<td style="text-align: right;">配送周期(天)</td>
				<td style="text-align: left;"><s:textfield name="e.dayNum"
						id="dayNum" data-rule="配送周期:required;dayNum;length[1~5];"></s:textfield>
				</td>
			</tr>
			<tr>
				<td style="text-align: right;">顺序</td>
				<td style="text-align: left;"><s:textfield name="e.order1"
						id="order1" data-rule="费用:required;integer;order1;length[1~5];"></s:textfield>
				</td>
			</tr>
			<tr>
				<td style="text-align: center;" colspan="2"><s:if
						test="e.id=='' or e.id==null">

						<button method="express!insert.action" class="btn btn-success">
							<i class="icon-ok icon-white"></i> 新增
						</button>
					</s:if> <s:else>

						<button method="express!update.action" class="btn btn-success">
							<i class="icon-ok icon-white"></i> 保存
						</button>
					</s:else></td>
			</tr>
		</table>

	</s:form>
	<script type="text/javascript">
	$(function(){
	selectDefaultArea();
	selectDefaultCode();
	}
	);
	function selectDefaultArea(){
	var _catalogID = $("#catalogID").val();

	if(_catalogID!=''){
	
		$("#"+_catalogID).attr("selected","selected");
	}
	}
		function selectDefaultCode(){
	var _code = $("#codeVal").val();

	if(_code!=''){
	
		$("#expresscCode").val(_code);
	}
	
}
	
	</script>
</body>
</html>
