<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>


<title>My JSP 'floorView.jsp' starting page</title>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/jquery-jquery-ui/themes/base/jquery.ui.all.css">
<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/themes/default/default.css" />
<script type="text/javascript"
	src="<%=request.getContextPath() %>/resource/js/jquery-1.9.1.min.js"></script>
<script charset="utf-8"
	src="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/kindeditor-min.js"></script>
<script charset="utf-8"
	src="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/lang/zh_CN.js"></script>
</head>

<body>

	<div
		style="width: 800px; margin: auto; margin-top: 100px; padding: 20px; height: 500px; border: #ccc 1px solid;">


		<form action="/manage/indexImg!floorUpdate.action" id="form"
			name="form">

			<input name="e.id" value="${e.id}" type="text" style="display: none;" />
			<s:textfield type="text" id="picture" name="e.picture"
				ccc="imagesInput" style="display: none;" />
			&nbsp;图片规格：
			<c:choose>
				<c:when test="${e.type==1}">
					<c:if test="${e.order1==1||e.order1==2}">

	450*270
	
	<div id="J_imageView"
							style="border-top: #ccc 1px solid; padding: 10px; margin-top: 10px;">

							<c:if test="${not empty e.picture }">
								<a target="_blank" href="${e.picture}"> <img alt=""
									src="${e.picture }"
									style="width: 450px; height: 270px; border: #ccc 1px solid;">
								</a>
							</c:if>
							<c:if test="${empty e.picture }">
								<img alt="" src="/data/img/images/450270.jpg"
									style="width: 450px; height: 270px; border: #ccc 1px solid;">
							</c:if>
						</div>
						<br />

						<input name="e.order1" type="hidden" value="${e.order1}">
						<input name="e.type" type="hidden" value="${e.type}">
						<input type="button" name="filemanager" value="浏览图片"
							class="btn btn-success" />&nbsp;<input type="button"
							class="btn btn-success" id="J_selectImage" value="我要上传" />
					</c:if>
					<c:if test="${e.order1==3}">
	280*270
	
	<div id="J_imageView"
							style="border-top: #ccc 1px solid; padding: 10px; margin-top: 10px;">

							<c:if test="${not empty e.picture }">
								<a target="_blank" href="${e.picture}"> <img alt=""
									src="${e.picture }"
									style="width: 280px; height: 270px; border: #ccc 1px solid;">
								</a>
							</c:if>
							<c:if test="${empty e.picture }">
								<img alt="" src="/data/img/images/280270.jpg"
									style="width: 280px; height: 270px; border: #ccc 1px solid;">
							</c:if>
						</div>

						<br />

						<input name="e.order1" type="hidden" value="${e.order1}">
						<input name="e.type" type="hidden" value="${e.type}">
						<input type="button" name="filemanager" value="浏览图片"
							class="btn btn-success" />&nbsp;<input type="button"
							class="btn btn-success" id="J_selectImage" value="我要上传" />

					</c:if>

				</c:when>
				<c:when test="${e.type==3}">

					<c:if test="${e.order1==1||e.order1==2}">
	
	
	300*180
	
	<div id="J_imageView"
							style="border-top: #ccc 1px solid; padding: 10px; margin-top: 10px;">

							<c:if test="${not empty e.picture }">
								<a target="_blank" href="${e.picture}"> <img alt=""
									src="${e.picture }"
									style="width: 300px; height: 180px; border: #ccc 1px solid;">
								</a>
							</c:if>
							<c:if test="${empty e.picture }">
								<img alt="" src="/data/img/images/300180.jpg"
									style="width: 300px; height: 180px; border: #ccc 1px solid;">
							</c:if>
						</div>

						<br />

						<input name="e.order1" type="hidden" value="${e.order1}">
						<input name="e.type" type="hidden" value="${e.type}">
						<input type="button" name="filemanager" value="浏览图片"
							class="btn btn-success" />&nbsp;<input type="button"
							class="btn btn-success" id="J_selectImage" value="我要上传" />
						<br />
						<br />	
							原价 ： <input name="e.price" type="text" value="${e.price}">	 现价 ： <input
							name="e.nowPrice" type="text" value="${e.nowPrice}">
						<br />


					</c:if>



					<c:if test="${e.order1==3}">
	600*290
	
	<div id="J_imageView"
							style="border-top: #ccc 1px solid; padding: 10px; margin-top: 10px;">

							<c:if test="${not empty e.picture }">
								<a target="_blank" href="${e.picture}"> <img alt=""
									src="${e.picture }"
									style="width: 600px; height: 290px; border: #ccc 1px solid;">
								</a>
							</c:if>
							<c:if test="${empty e.picture }">
								<img alt="" src="/data/img/images/600290.jpg"
									style="width: 600px; height: 290px; border: #ccc 1px solid;">
							</c:if>
						</div>

						<br />

						<input name="e.order1" type="hidden" value="${e.order1}">
						<input name="e.type" type="hidden" value="${e.type}">
						<input type="button" name="filemanager" value="浏览图片"
							class="btn btn-success" />&nbsp;<input type="button"
							class="btn btn-success" id="J_selectImage" value="我要上传" />

						<br />


					</c:if>
				</c:when>
				<c:when test="${e.type==4}">

					<c:if test="${e.order1==1}">
	600*290
	
	<div id="J_imageView"
							style="border-top: #ccc 1px solid; padding: 10px; margin-top: 10px;">

							<c:if test="${not empty e.picture }">
								<a target="_blank" href="${e.picture}"> <img alt=""
									src="${e.picture }"
									style="width: 600px; height: 290px; border: #ccc 1px solid;">
								</a>
							</c:if>
							<c:if test="${empty e.picture }">
								<img alt="" src="/data/img/images/600290.jpg"
									style="width: 600px; height: 290px; border: #ccc 1px solid;">
							</c:if>
						</div>

						<br />

						<input name="e.order1" type="hidden" value="${e.order1}">
						<input name="e.type" type="hidden" value="${e.type}">
						<input type="button" name="filemanager" value="浏览图片"
							class="btn btn-success" />&nbsp;<input type="button"
							class="btn btn-success" id="J_selectImage" value="我要上传" />

						<br />


					</c:if>
					<c:if test="${e.order1>1}">
	300*180
	
	<div id="J_imageView"
							style="border-top: #ccc 1px solid; padding: 10px; margin-top: 10px;">

							<c:if test="${not empty e.picture }">
								<a target="_blank" href="${e.picture}"> <img alt=""
									src="${e.picture }"
									style="width: 300px; height: 180px; border: #ccc 1px solid;">
								</a>
							</c:if>
							<c:if test="${empty e.picture }">
								<img alt="" src="/data/img/images/300180.jpg"
									style="width: 300px; height: 180px; border: #ccc 1px solid;">
							</c:if>
						</div>

						<br />

						<input name="e.order1" type="hidden" value="${e.order1}">
						<input name="e.type" type="hidden" value="${e.type}">
						<input type="button" name="filemanager" value="浏览图片"
							class="btn btn-success" />&nbsp;<input type="button"
							class="btn btn-success" id="J_selectImage" value="我要上传" />
						<br />
						<br />	
							原价 ： <input name="e.price" type="text" value="${e.price}">	 现价 ： <input
							name="e.nowPrice" type="text" value="${e.nowPrice}">
						<br />
					</c:if>
				</c:when>
			</c:choose>


			<br /> 标题 ： <input name="e.title" type="text" value="${e.title}">

			链接 ： <input name="e.link" type="text" value="${e.link}"> <br />
			<br />
			<p style="width: 400px; text-align: center;">
				<button method="/manage/indexImg!floorUpdate.action"
					style="width: 200px;">保存</button>
				<button method="/manage/indexImg!floorInit.action">返回</button>
			</p>
		</form>
	</div>

	<script type="text/javascript">

KindEditor.ready(function(K) {


	var editor1 = K.editor({

					allowFileManager : true
				});
			K('#J_selectImage').click(function() {
				var imagesInputObj = $(this).parent().children("input[ccc=imagesInput]");
					editor1.loadPlugin('multiimage', function() {
						editor1.plugin.multiImageDialog({
							clickFn : function(urlList) {
// 								var div = K('#J_imageView');
// 								div.html('');
								K.each(urlList, function(i, data) {
								
// 									imagesInputObj.val(data.url);
					
// 									div.append('<img src="' + data.url + '" >');
								});
								editor1.hideDialog();
							}
						});
					});
				});

				var editor = K.editor({

	});

					K('input[name=filemanager]').click(function() {
		var imagesInputObj = $(this).parent().children("input[ccc=imagesInput]");
			var imagesdiv = $(this).parent().children("#J_imageView");
		editor.loadPlugin('filemanager', function() {
			editor.plugin.filemanagerDialog({
				viewType : 'VIEW',
				dirName : 'image',
				clickFn : function(url, title) {
						
							
					imagesInputObj.val(url);
					imagesdiv.html("");
					imagesdiv.append('<img src="' +url + '" style="max-width:450px;" />');
					editor.hideDialog();
					clearRootImagePath(imagesInputObj);//$("#picture"));
				}
			});
		});
	});

});



//删除图片主路径
function clearRootImagePath(picInput){
	var _pifeSpan = $("#pifeSpan").text();
	var _imgVal = picInput.val();


		picInput.val(_imgVal.substring(_imgVal.indexOf("/attached/")));

}





</script>
</body>
</html>
