<%@page import="net.onlineshop.core.system.bean.User"%>
<%@page import="java.util.Map"%>
<%@page import="net.onlineshop.core.ManageContainer"%>

<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/resource/common_html_meat.jsp"%>
<head>
<%-- <script type="text/javascript">
    	//注销
    	function a(){
    		window.parent.location.href = "../user!loginOut.action";
    	}
    	//function b(){
    		//window.parent.location.href = "../../index!q.action?id=-1";
    	//}
    	//$(function(){
    		//$("#suggest1").focus().autocomplete(cities);
    	//});
    </script> --%>
</head>

<body
	style="font-size: 12px; background-color: #f0f0f0; margin: 0; padding: 0;">
	<hr style="margin: 0; padding: 0">
	<!-- <div class="row" ><div class="col-lg-2"> -->
	<!-- <input type="text" class="search-query" id="suggest1" placeholder="输入内容搜索菜单"/> -->
	<!-- </div></div> -->


	<!-- <form class="form-search" style="margin: 0px;"> -->
	<!--   <div class="input-append"> -->
	<!--     <input type="text" class="span2 search-query" placeholder="输入内容搜索菜单"> -->
	<!--     <button type="submit" class="btn">搜索</button> -->
	<!--   </div> -->
	<!-- </form> -->

	<jsp:include page="/WEB-INF/manages/system/menu/leftMenu.jsp"></jsp:include>
</body>
</html>
