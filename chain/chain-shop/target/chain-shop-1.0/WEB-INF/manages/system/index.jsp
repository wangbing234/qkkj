<%@page import="net.onlineshop.core.ManageContainer"%>
<%@page import="net.onlineshop.core.front.SystemManager"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<!DOCTYPE html>
<html>
<head>
<link rel="shortcut icon"
	href="<%=SystemManager.systemSetting.getShortcuticon()%>">
<%@ include file="/resource/common_html_meat.jsp"%>
<%@ include file="/WEB-INF/manages/system/common.jsp"%>
<script src="/resource/js/layer/layer.js"></script>
<script type="text/javascript">
	function checkbox() {

		layer
				.open({
					type : 1,
					title : "短信校验",
					shadeClose : true,
					shade : 0.4,
					area : [ '400px', '200px' ],
					content : "<p style='padding:20px;'><font color='green'>短信已发送成功，请稍后...</font><br/><input type='text' style='margin-top:10px;' name='checkcode' value='' placeholder='请输入您手机收到的短信' >&nbsp;<input type='button'  class='btn' value='校验' onclick='checkf()'></p>"
				});
	}

	$(function() {

		$("#username").focus();

		if (top.location != self.location) {
			top.location = self.location;
		}
	});
</script>
<style type="text/css">
.login {
	
}

.login .login-head {
	width: 960px;
	margin: 20px auto;
	height: 70px;
}

.login .login-head .login-head-a {
	text-align: center;
	float: left;
	margin-top: 16px;
}

.login .login-head .login-head-a img {
	
}

.login .login-head .login-head-a p {
	font-size: 20px;
	margin: 0;
}

.login .login-head .login-head-b {
	border-left: 1px solid #666666;
	float: left;
	height: 75px;
	line-height: 75px;
	margin-left: 20px;
	padding-left: 30px;
	width: 250px;
	font-size: 25px;
}

.login .login-con {
	text-align: center;
	background-color: #efefef;
	height: 450px;
}

.login .login-con .login-a {
	background: url(/mnt/data/img/images/pay-bg-3.jpg) no-repeat;
	width: 960px;
	margin: 0 auto;
	text-align: left;
	height: 450px;
}

.login .login-con .login-a form {
	
}

.login .login-con .login-a .login-b {
	float: right;
	width: 344px;
	height: 387px;
	border: solid 2px #e6e5e5;
	margin-right: 60px;
	margin-top: 20px;
	background: #fff;
}

.login .login-con .login-a .login-b .login-b-a {
	background-color: #E3E3E3;
	height: 46px;
	line-height: 46px;
	font-size: 16px;
	font-weight: bold;
	padding-left: 15px;
}

.login .login-con .login-a .login-b .login-b-b {
	padding-top: 20px;
	height: 255px;
}

.login .login-con .login-a .login-b .login-b-b ul li {
	height: 65px;
	_height: 60px;
	list-style-type: none;
	font-family: "微软雅黑", "宋体", Arial;
	font-size: 14px;
}

.login .login-con .login-a .login-b .login-b-b ul li label {
	display: inline-block;
	font-size: 16px;
	color: #666666;
}

.login .login-con .login-a .login-b .login-b-b ul li input {
	width: 180px;
	color: rgb(153, 153, 153);
	height: 32px;
	line-height: 32px;
	border: solid 1px #d3d3d3;
	font-size: 14px;
}

.login .login-con .login-a .login-b .login-b-b ul li h1 {
	font-weight: normal;
	color: #ff0000;
	background: url(../img/icon.png) no-repeat 95px -28px;
	font-size: 12px;
	padding-left: 120px;
	padding-top: 6px;
	margin: 3px 0px 0px -30px;
}

.login .login-con .login-a .login-b .login-b-b ul li #checkCode {
	height: 32px;
	line-height: 32px;
	width: 60px;
}

.login .login-con .login-a .login-b .login-b-b ul li img {
	vertical-align: middle;
	width: 76px;
	height: 33px;
}

.login .login-con .login-a .login-b .login-b-b ul li a {
	color: #447bd6;
	font-family: "微软雅黑", "宋体", Arial;
	font-size: 12px;
}

.login .login-con .login-a .login-b .login-b-b ul .login-x {
	padding-left: 65px;
	padding-top: 0px;
	height: 65px;
}

.login .login-con .login-a .login-b .login-b-b ul .login-x .login-x-a {
	width: 100px;
	height: 50px;
	float: left;
}

.login .login-con .login-a .login-b .login-b-b ul .login-x .login-x-a .x
	{
	background-position: right -208px;
	background-image: url(../img/btn-type2.png);
	background-repeat: no-repeat;
	height: 37px;
	float: left;
	width: 3px;
}

.login .login-con .login-a .login-b .login-b-b ul .login-x .login-x-a input
	{
	width: 80px;
	float: left;
	border: none;
	background-position: 0 -120px;
	background-image: url(../img/btn-type2.png);
	background-repeat: no-repeat;
	height: 37px;
	line-height: 37px;
	color: #fff;
	font-size: 14px;
	font-weight: bold;
}

.login .login-con .login-a .login-b .login-b-b ul .login-x .login-x-b {
	
}

.login .login-con .login-a .login-b .login-b-c {
	text-align: center;
	padding-top: 10px;
	border-top: solid 1px #f0f0f0;
}

.login .login-con .login-a .login-b .login-b-c a {
	color: #447bd6;
	font-family: "微软雅黑", "宋体", Arial;
	font-size: 12px;
}

.login .login-con .login-a .login-b .login-b-c a:hover {
	color: #f3ab3a;
}

.login .login-foot {
	text-align: center;
	font-size: 14px;
	color: #666666;
	margin-top: 50px;
}
</style>
</head>
<body>

	<div class="login">
		<div class="login-head">
			<div class="login-head-a">
				<img src="/mnt/data/img/images/lrg.jpg" title="" alt="" width="80">

			</div>
			<div class="login-head-b">鼎烨商城后台管理</div>
		</div>

		<div class="row login-con">


			<div class="login-a">


				<table
					style="float: right; height: 200px; width: 300px; margin-right: 160px; margin-top: 100px;">
					<caption>
						<%
						Object loginErrorObj = request.getSession().getAttribute(
								ManageContainer.loginError);
						if (loginErrorObj != null) {
					%>
						<div class="alert alert-warning alert-dismissable"
							style="margin-bottom: 0px;">
							<button type="button" class="close" data-dismiss="alert"
								aria-hidden="true">&times;</button>
							<%-- 			  <strong>登陆失败!</strong> 账号或密码错误！ --%>
							<%=loginErrorObj.toString()%>
						</div>
						<%
						}
						request.getSession().setAttribute("loginError", null);
					%>
					</caption>

					<tr>
						<td><s:form action="user!login.action" theme="simple"
								namespace="/manage" cssClass="form-horizontal">
								<div class="control-group" style="padding-top: 20px;">
									<label class="control-label" for="inputEmail">帐号</label>
									<div class="controls">
										<div class="input-prepend">
											<span class="add-on"><i class="icon-user"></i> </span>
											<s:textfield name="e.username" cssClass="len" id="username"
												style="width:130px;" />
										</div>
									</div>
								</div>
								<div class="control-group">
									<label class="control-label" for="inputPassword">密码</label>
									<div class="controls">
										<div class="input-prepend">
											<span class="add-on"><i class="icon-lock"></i> </span>
											<s:password name="e.password" cssClass="len" value=""
												id="password" label="密码" style="width:130px;" />
										</div>
									</div>
								</div>

								<div class="control-group">
									<div class="controls">
										<div class="input-prepend">
											<span class="add-on"><i class="icon-hand-right"></i> </span>
											<%-- 											<s:submit value="登录" cssClass="btn" /> --%>
											<input type="button" class="btn" value="登录"
												onclick="login(this)"/>
										</div>
									</div>
								</div>
							</s:form></td>
					</tr>

				</table>
			</div>

		</div>

	</div>
	<div class="layui-layer-shade layui-layera" id="layui-layer-shade1"
		times="1"
		style="z-index: 19891014; background-color: #000; display: none; opacity: 0.4; filter: alpha(opacity = 40);"></div>
	<div class="layui-layer layui-anim layui-layer-page layui-layera"
		id="layui-layer1" type="page" times="1" showtime="0" contype="string"
		style="z-index: 19891015; width: 340px; display: none; height: 200px; top: 30%; left: 38%;">
		<div class="layui-layer-title" style="cursor: move;" move="ok">短信校验</div>
		<div class="layui-layer-content" style="height: 157px;">

			<p style="padding: 20px;">

				<font color="green">短信已发送成功，请稍后...</font><br> <input
					type="text" style="margin-top: 10px;" name="ranCode" id="ranCode"
					value="" placeholder="请输入您手机收到的短信">&nbsp;<input
					type="button" class="btn" value="校验" onclick="checkf()">
			</p>

		</div>
		<span class="layui-layer-setwin"></span>
	</div>


</body>
</html>
