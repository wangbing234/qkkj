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
	<table class="table table-bordered">
		<tr>
			<td colspan="8"><a href="javascript:void(0);"
				onclick="toCache('/manage/control!manageCacheAll.action')"
				class="btn btn-primary"> <i class="icon-refresh icon-white"></i>
					加载后台缓存
			</a></td>
		</tr>
		<tr>
			<td colspan="8"><a href="javascript:void(0);"
				onclick="toCache('/manage/control!frontCache.action')"
				class="btn btn-success"><i class="icon-refresh icon-white"></i>
					加载前台缓存 </a></td>
		</tr>
	</table>


</body>
</html>
