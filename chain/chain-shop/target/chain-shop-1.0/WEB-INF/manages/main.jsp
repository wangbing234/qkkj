<%@page import="net.onlineshop.core.system.bean.User"%>
<%@page import="java.util.Map"%>
<%@page import="net.onlineshop.core.front.SystemManager"%>
<%@page import="net.onlineshop.core.ManageContainer"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html>
<html>
<head>
<title>鼎烨商城后台管理</title>
<link rel="shortcut icon"
	href="<%=SystemManager.systemSetting.getShortcuticon()%>">
<style type="text/css">
frameset {
	border: none;
}

frameset {
	border: 0px;
}

frame {
	border: 0px;
}
</style>
</head>

<%
		User u =  (User)session.getAttribute(ManageContainer.manage_session_user_info);
		if(u==null){
			out.println("u="+u);
			response.sendRedirect("/manage/user!loginOut201501212lssm222.action");
			return;
		}
		//out.print(u.getNickname()+"("+u.getUsername()+")");
	%>

<frameset rows="50,*" frameborder="NO" border="0" framespacing="0">
	<frame src="/manage/control!top.action">
	<frameset cols="180,*">
		<frame src="/manage/control!left.action" name="leftFrame" noresize="noresize" />
		<frame src="<%=request.getContextPath()%>/manage/user!initManageIndex.action" name="rightFrame" />
	</frameset>
</frameset>


</html>
