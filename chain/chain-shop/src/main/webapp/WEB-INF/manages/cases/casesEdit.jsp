<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/resource/common_html_meat.jsp"%>
<%@ include file="/WEB-INF/manages/system/common.jsp"%>
<%@ include file="/resource/common_html_validator.jsp"%>
<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/themes/default/default.css" />
</head>

<body>
	<s:form action="cases" namespace="/manage" theme="simple"
		enctype="multipart/form-data">
		<input name="e.type" value="${type}" type="hidden" />
		<span id="pifeSpan" class="input-group-addon" style="display: none"><%=SystemManager.systemSetting.getImageRootPath()%></span>
		<table class="table table-bordered">
			<tr style="background-color: #dff0d8">
				<td colspan="2"
					style="background-color: #dff0d8; text-align: center;"><strong>案例编
						辑 </strong></td>
			</tr>
			<tr style="display: none;">
				<th>id</th>
				<td><s:hidden name="e.id" label="id" id="idd" /></td>
			</tr>
			<tr>
				<th class="right">标题</th>
				<td style="text-align: left;"><s:textfield name="e.title"
						data-rule="标题:required;title;length[1~45];" id="title" /></td>
			</tr>
			<tr>
				<th>描述</th>
				<td style="text-align: left;"><s:textfield name="e.notes"
						data-rule="描述:notes;length[1~100];" style="width:360px" id="notes" /></td>
			</tr>
			<tr>
				<th>图片地址</th>
				<td style="text-align: left;" colspan="3"><input type="button"
					name="filemanager" value="浏览图片" class="btn btn-warning" />&nbsp;<input
					type="button" class="btn btn-success" id="J_selectImage"
					value="我要上传" /> <s:textfield name="e.picUrl" id="picture"
						ccc="imagesInput" style="width: 400px;"
						data-rule="图片地址:required;picture;" />
					<div id="J_imageView">
						<s:if test="e.picUrl!=null and e.picUrl!=''">
							<a target="_blank"
								href="<%=SystemManager.systemSetting.getImageRootPath()%>/..<s:property value="e.picUrl" />">
								<img style="max-width: 50px; max-height: 50px;" alt=""
								src="<%=SystemManager.systemSetting.getImageRootPath()%>/..<s:property value="e.picUrl" />">
							</a>
						</s:if>
					</div></td>
			</tr>

			<tr>
				<th>排序</th>
				<td style="text-align: left;"><s:textfield name="e.order1"
						data-rule="排序:integer;order1;length[1~5];" id="order1" /></td>
			</tr>
			<tr>
				<th>案例介绍</th>
				<td style="text-align: left;">注:图片最宽不要超过960像素 <s:textarea
						data-rule="案例介绍;required;desc1;" id="desc1" name="e.desc1"
						style="width:100%;height:500px;visibility:hidden;"></s:textarea>


				</td>
			</tr>

			<tr>
				<td colspan="2" style="text-align: center;"><s:if
						test="e.id=='' or e.id==null">
						<%-- 						<s:submit method="insert" value="新增" cssClass="btn btn-primary"/> --%>
						<%-- 						<s:a method="insert" cssClass="btn btn-success"> --%>
						<!-- 							<i class="icon-plus-sign icon-white"></i> 新增 -->
						<%-- 						</s:a> --%>
						<button method="cases!insert.action" class="btn btn-success">
							<i class="icon-ok icon-white"></i> 新增
						</button>
					</s:if> <s:else>
						<%-- 						<s:submit method="update" value="保存" cssClass="btn btn-primary"/> --%>
						<%-- 						<s:a method="update" cssClass="btn btn-success"> --%>
						<!-- 							<i class="icon-ok icon-white"></i> 保存 -->
						<%-- 						</s:a> --%>
						<button method="cases!update.action" class="btn btn-success">
							<i class="icon-ok icon-white"></i> 保存
						</button>
					</s:else>
			</tr>
		</table>
	</s:form>
	<script charset="utf-8"
		src="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/kindeditor-min.js"></script>
	<script charset="utf-8"
		src="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/lang/zh_CN.js"></script>
	<script>
//删除图片主路径
function clearRootImagePath(picInput){
	var _pifeSpan = $("#pifeSpan").text();
	var _imgVal = picInput.val();
	picInput.val(_imgVal.substring(_imgVal.indexOf("/attached/")));
	//if(_imgVal && _imgVal.length>0 && _imgVal.indexOf(_pifeSpan)==0){
		//picInput.val(_imgVal.substring(_pifeSpan.length));
	//}
}

KindEditor.ready(function(K) {
	var editor = K.editor({
	  		
			allowFileManager : true
	});
	K('input[name=filemanager]').click(function() {
		var imagesInputObj = $(this).parent().children("input[ccc=imagesInput]");
		editor.loadPlugin('filemanager', function() {
			editor.plugin.filemanagerDialog({
				viewType : 'VIEW',
				dirName : 'image',
				clickFn : function(url, title) {
					//K('#picture').val(url);
					//alert(url);
					imagesInputObj.val(url);
					editor.hideDialog();
					clearRootImagePath(imagesInputObj);//$("#picture"));
				}
			});
		});
	});
	
	
				
				var editor1 = K.editor({
				
			allowFileManager : true
				});
				K('#J_selectImage').click(function() {
					editor1.loadPlugin('multiimage', function() {
					var imagesInputObj =$("#picture");
						editor1.plugin.multiImageDialog({
							clickFn : function(urlList) {
								var div = K('#J_imageView');
								div.html('');
								K.each(urlList, function(i, data) {
									div.append('<img src="' + data.url + '">');
									imagesInputObj.val(data.url);
								});
								editor1.hideDialog();
								clearRootImagePath(imagesInputObj);
							}
						});
					});
				});
		
	
});

	var editor;
	KindEditor.ready(function(K) {
		editor = K.create('textarea[name="e.desc1"]', {
		
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
	
	function addTrFunc(){
		var cc = $("#firstTr").clone();
		$("#firstTr").after(cc);
		
		cc.find("a").show();
	}
	
	function removeThis(t){
		$(t).parent().parent().remove();
		return false;
	}
</script>

</body>
</html>
