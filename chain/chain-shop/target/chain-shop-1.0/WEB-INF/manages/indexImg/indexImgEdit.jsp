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
	href="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/themes/default/default.css" />
</head>

<body>
	<s:form action="indexImg" namespace="/manage" theme="simple"
		enctype="multipart/form-data">
		<input name="e.type" value="${type}" type="hidden" />
		<span id="pifeSpan" class="input-group-addon" style="display: none"><%=SystemManager.systemSetting.getImageRootPath()%></span>
		<table class="table table-bordered">
			<tr style="background-color: #dff0d8">
				<td colspan="2"
					style="background-color: #dff0d8; text-align: center;"><strong>
						<c:choose>
							<c:when test="${type==0 }">
					 手机端banner &nbsp;规格1920*490
					</c:when>
							<c:when test="${type==1 }">
					手机首页推荐
					</c:when>
							<c:when test="${type==2}">
				            首页banner &nbsp;规格1920*490
					</c:when>
						</c:choose>

				</strong></td>
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
				<th>图片地址<br /> <!-- 				${type==0?('<font color="red">注:长宽为1460*490像素</font>'):('')} -->


				</th>
				<td style="text-align: left;" colspan="3"><input type="button"
					name="filemanager" value="浏览图片" class="btn btn-warning" />&nbsp;<input
					type="button" class="btn btn-success" id="J_selectImage"
					value="我要上传" /> <s:textfield name="e.picture" id="picture"
						ccc="imagesInput" style="width: 600px;"
						data-rule="图片地址:required;picture;" />
					<div id="J_imageView">
						<s:if test="e.picture!=null">
							<a target="_blank"
								href="<%=SystemManager.systemSetting.getImageRootPath()%>/<s:property value="e.picture" />">
								<img src="${e.picture}" style="max-width: 360px;" />


							</a>
						</s:if>

					</div></td>
			</tr>
			<tr>
				<th>广告链接</th>
				<td style="text-align: left;"><s:textfield name="e.link"
						id="link" style="width:600px;" /></td>
			</tr>
			<tr>
				<th>排序</th>
				<td style="text-align: left;"><c:if test="${type==0||type==2}">
						<s:textfield name="e.order1"
							data-rule="排序:integer;order1;length[1~5];" id="order1" />
					</c:if> <c:if test="${type==1}">
						<s:textfield name="e.order1" readonly="true" id="order1" />
					</c:if></td>
			</tr>
			<tr>
				<th>描述</th>
				<td style="text-align: left;"><s:textfield name="e.desc1"
						data-rule="排序:desc1;length[1~100];" id="desc1" /></td>
			</tr>
			<tr>
				<td colspan="2" style="text-align: center;"><s:if
						test="e.id=='' or e.id==null">

						<button method="indexImg!insert.action" class="btn btn-success">
							<i class="icon-ok icon-white"></i> 新增
						</button>
					</s:if> <s:else>

						<button method="indexImg!update.action" class="btn btn-success">
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
					var div = K('#J_imageView');
								div.html('');
								div.append('<img src="' + url+ '">');
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
					var imagesInputObj =$("#picture");
					editor1.loadPlugin('multiimage', function() {
						editor1.plugin.multiImageDialog({
							clickFn : function(urlList) {
								
								var div = K('#J_imageView');
								div.html('');
								K.each(urlList, function(i, data) {
									div.append('<img src="' + data.url + '">');
									imagesInputObj.val(data.url);
								});
								editor1.hideDialog();
								clearRootImagePath(imagesInputObj);//$("#picture"));
								
							}
						});
					});
				});
		
	
});
</script>

</body>
</html>
