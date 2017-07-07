<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/resource/common_html_meat.jsp"%>
<%@ include file="/WEB-INF/manages/system/common.jsp"%>
</head>

<body>
	<s:form action="comment" namespace="/manage" theme="simple" name="form"
		id="form">
		<table id="result_table" class="table table-bordered"
			style="width: 95%; margin: auto;">
			<tr style="background-color: #dff0d8">
				<td colspan="2"
					style="background-color: #dff0d8; text-align: center;"><strong>自定义评论</strong>
				</td>
			</tr>
			<tr style="display: none;">
				<td>id</td>
				<td><s:hidden name="e.id" label="id" /></td>
			</tr>

			<tr>
				<td style="text-align: right;">评论昵称</td>
				<td style="text-align: left;"><s:textfield name="e.nickname"
						data-rule="评论昵称:required;nickname;length[1~45];" id="nickname" /></td>
			</tr>
			<tr>
				<td style="text-align: right;">商品ID</td>
				<td style="text-align: left;"><s:textfield name="e.productID"
						data-rule="商品ID:required;productID;length[1~45];" id="productID" />
				</td>
			</tr>
			<tr>
				<td style="text-align: right;">评论内容</td>
				<td style="text-align: left;"><s:textarea name="e.content"
						id="content" style="width:100%;height:100px;"
						data-rule="回复内容:required;content;length[5~3000];"></s:textarea></td>
			</tr>
			<tr>
				<td colspan="2" style="text-align: center;">
					<%-- 					<s:submit method="updateReply" value="回复" cssClass="btn btn-primary"/> --%>
					<button method="comment!add.action" class="btn btn-success">
						<i class="icon-ok icon-white"></i> 提交评论
					</button> <%-- 					<s:submit method="back" value="返回" cssClass="btn btn-inverse"/> --%>
				</td>
			</tr>
		</table>
	</s:form>
	<%@ include file="/resource/common_html_validator.jsp"%>
	<link rel="stylesheet"
		href="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/themes/default/default.css" />
	<script charset="utf-8"
		src="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/kindeditor-min.js"></script>
	<script charset="utf-8"
		src="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/lang/zh_CN.js"></script>
	<script>
	var editor;
	KindEditor.ready(function(K) {
		editor = K.create('textarea[name="e.reply"]', {
			allowFileManager : true
		});
		K('input[name=getHtml]').click(function(e) {
			alert(editor.html());
		});
		K('input[name=isEmpty]').click(function(e) {
			alert(editor.isEmpty());
		});
		K('input[name=getText]').click(function(e) {
			alert(editor.text());
		});
		K('input[name=selectedHtml]').click(function(e) {
			alert(editor.selectedHtml());
		});
		K('input[name=setHtml]').click(function(e) {
			editor.html('<h3>Hello KindEditor</h3>');
		});
		K('input[name=setText]').click(function(e) {
			editor.text('<h3>Hello KindEditor</h3>');
		});
		K('input[name=insertHtml]').click(function(e) {
			editor.insertHtml('<strong>插入HTML</strong>');
		});
		K('input[name=appendHtml]').click(function(e) {
			editor.appendHtml('<strong>添加HTML</strong>');
		});
		K('input[name=clear]').click(function(e) {
			editor.html('');
		});
	});
	
	$(function() {
		$("#reply").focus();
	});

</script>
</body>
</html>
