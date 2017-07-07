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
<style type="text/css">
.on {
	background-color: rgb(0, 109, 204);
	color: #fff;
	padding: 5px 10px;
	height: 32px;
}
</style>
</head>

<body>

	<a href="/manage/indexImg!selectList.action?e.type=0"
		<c:if test="${e.type==0 }">class="on"</c:if>>手机端首页banner</a>|
	<a href="/manage/indexImg!selectList.action?e.type=2"
		<c:if test="${e.type==2 }">class="on"</c:if>>PC端首页banner</a>
	<!-- <a href="/manage/advert!selectList.action?init=y"
		<c:if test="${empty e.type }">class="on"</c:if>>微信商城广告位</a> -->
	<s:form action="indexImg" namespace="/manage" method="post"
		theme="simple">
		<input name="e.type" value="${e.type}" type="hidden" />
		<c:if test="${e.type==0||e.type==2}">
			<table class="table table-bordered">
				<tr>
					<td colspan="4"><s:a
							method="selectList.action?e.type=%{e.type}"
							cssClass="btn btn-primary">
							<i class="icon-search icon-white"></i> 查询
						</s:a> <a href="/manage/indexImg!toAdd.action?e.type=${e.type}"
						class="btn btn-success"> <i class="icon-plus-sign icon-white"></i>
							添加
					</a>

						<button method="indexImg!deletes.action?e.type=%{e.type}"
							class="btn btn-danger"
							onclick="return submitIDs(this,'确定删除选择的记录?');">
							<i class="icon-remove-sign icon-white"></i> 删除
						</button></td>
				</tr>
			</table>



			<table class="table table-bordered">
				<tr style="background-color: #dff0d8">
					<th width="20"><input type="checkbox" id="firstCheckbox" /></th>
					<th style="display: none;">id</th>
					<th nowrap="nowrap">标题</th>
					<th>图片</th>
					<th>排序</th>
					<!-- 					<th>描述</th> -->
					<th style="width: 50px;">操作</th>
				</tr>

				<c:forEach items="${list}" var="indexImg">
					<tr>
						<td><input type="checkbox" name="ids" value="${indexImg.id}" /></td>
						<td style="display: none;">&nbsp;${indexImg.id}</td>
						<td>&nbsp;${indexImg.title}</td>
						<td>&nbsp; <a
							href="<%=SystemManager.systemSetting.getImageRootPath() %>${indexImg.picture}"
							target="_blank"> <img
								style="max-width: 100px; max-height: 100px;" alt=""
								src="<%=SystemManager.systemSetting.getImageRootPath() %>${indexImg.picture}">
						</a> <br>
							<div>图片链接：</div> <a target="_blank" href="${indexImg.link}">${indexImg.link}</a>
						</td>
						<td>&nbsp;${indexImg.order1}</td>
						<td><a
							href="/manage/indexImg!toEdit.action?e.id=${indexImg.id}&e.type=${indexImg.type}">编辑</a>
						</td>
					</tr>
				</c:forEach>

			</table>
		</c:if>
		<c:if test="${e.type==1}">
			<table class="table table-bordered">
				<tr>
					<td><a
						href="/manage/indexImg!toEdit.action?e.id=${indexImg1.id}&e.type=1"><img
							src="${indexImg1.picture}" width="300" height="300"></a></td>
					<td><a
						href="/manage/indexImg!toEdit.action?e.id=${indexImg2.id}&e.type=1"><img
							src="${indexImg2.picture}" width="300" height="300"></a></td>
				</tr>
				<tr>
					<td><a
						href="/manage/indexImg!toEdit.action?e.id=${indexImg3.id}&e.type=1"><img
							src="${indexImg3.picture}" width="300" height="300"></a></td>
					<td><a
						href="/manage/indexImg!toEdit.action?e.id=${indexImg4.id}&e.type=1"><img
							src="${indexImg4.picture}" width="300" height="300"></a></td>

				</tr>
			</table>
		</c:if>
	</s:form>
</body>
</html>
