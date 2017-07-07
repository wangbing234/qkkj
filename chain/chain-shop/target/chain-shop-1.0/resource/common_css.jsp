
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="net.onlineshop.core.front.SystemManager"%>
<link rel="stylesheet" href="<%=request.getContextPath()%>/resource/css/sticky-footer.css"  type="text/css">

<%
String style = request.getParameter("style");
if(StringUtils.isBlank(style)){
	style = SystemManager.systemSetting.getStyle();
}
//out.println("style="+style);
%>
<link rel="stylesheet" href="<%=request.getContextPath()%>/resource/index_css/common.min.css"  type="text/css">

<!-- <link rel="stylesheet" href="http://v3.bootcss.com/dist/css/bootstrap.css"  type="text/css"> -->

<link rel="stylesheet" href="<%=request.getContextPath()%>/resource/bootstrap3.0.0/css/<%=style %>/bootstrap.min.css"  type="text/css">

<link rel="stylesheet" href="<%=request.getContextPath()%>/resource/bootstrap3.0.0/css/docs.css"  type="text/css">
<%
System.out.println("SystemManager.systemSetting.getOpenResponsive()="+SystemManager.systemSetting.getOpenResponsive());

Object responsive_session = request.getSession().getAttribute("responsive");
boolean non_responsive = true;
if(responsive_session!=null){
	if(responsive_session.toString().equals("y")){
		non_responsive = false;
	}
}else{
	if(SystemManager.systemSetting.getOpenResponsive().equals("n")){
		non_responsive = true;
	}else{
		non_responsive = false;
	}
}
//if(SystemManager.systemSetting.getOpenResponsive().equals("n") || (responsive_session!=null && responsive_session.toString().equals("n"))){

if(non_responsive){
%>
<link rel="stylesheet" href="<%=request.getContextPath()%>/resource/bootstrap3.0.0/css/non-responsive.css"  type="text/css">
<%} %>

<script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/jquery-1.8.2.min.js"></script>