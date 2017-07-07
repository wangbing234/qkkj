<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>


<title>My JSP 'floor.jsp' starting page</title>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
<link rel="stylesheet" type="text/css" href="/css/basic.css" />
<link rel="stylesheet" type="text/css" href="/css/sy.css" />
</head>

<body>
	<div class="tjbox">
		<div class="ztj">


			<c:forEach items="${list1}" var="e">
				<c:if test="${e.order1==1 }">
					<div class="rmbox">
						<a href="/manage/indexImg!floorView.action?type=1&seq=1"><img
							src="${e.picture }" style="width: 450px; height: 270px;" /> </a>
					</div>
				</c:if>
				<c:if test="${e.order1==2 }">
					<div class="rmbox">
						<a href="/manage/indexImg!floorView.action?type=1&seq=2"><img
							src="${e.picture}" style="width: 450px; height: 270px;" /> </a>
					</div>
				</c:if>

				<c:if test="${e.order1==3 }">
					<div class="rmrbox">
						<a href="/manage/indexImg!floorView.action?type=1&seq=3"><img
							src="${e.picture}" style="width: 280px; height: 270px;" /> </a>
					</div>
				</c:if>
			</c:forEach>





		</div>
	</div>

	<div class="msbox">
		<div class="titone">
			<div class="bbf"></div>
			<h3>一键秒杀——每周六限量特价</h3>
		</div>

		<div class="cpbox">


			<c:forEach items="${list2}" var="e">
				<c:if test="${e.order1==1 }">


					<div class="cpbox1">
						<i class="cpbq1"></i> <a
							href="/manage/indexImg!floorView.action?type=3&seq=1"><img
							src="${e.picture}" style="width: 300px; height: 180px;" /></a>
						<div class="cpxx">
							<a href="/manage/indexImg!floorView.action?type=3&seq=1">${e.title}</a>
							<p>原价 ${e.price}</p>
							<strong>￥${e.nowPrice}</strong>
						</div>
					</div>
				</c:if>

				<c:if test="${e.order1==2 }">
					<div class="cpbox1">
						<i class="cpbq2"></i> <a
							href="/manage/indexImg!floorView.action?type=3&seq=2"><img
							src="${e.picture}" style="width: 300px; height: 180px;" /></a>
						<div class="cpxx">
							<a href="/manage/indexImg!floorView.action?type=3&seq=2">${e.title}</a>
							<p>原价 ${e.price}</p>
							<strong>￥${e.nowPrice}</strong>
						</div>
					</div>
				</c:if>
				<c:if test="${e.order1==3 }">
					<div class="cpbox2">
						<a href="/manage/indexImg!floorView.action?type=3&seq=3"><img
							src="${e.picture}" style="width: 600px; height: 290px;" /></a>
					</div>
				</c:if>
			</c:forEach>
		</div>
	</div>

	<div class="msbox">
		<div class="titone">
			<div class="bbf"></div>
			<h3>热门商品推荐</h3>
		</div>

		<div class="cpbox">
			<c:forEach items="${list3}" var="e">
				<c:if test="${e.order1==1 }">
					<div class="cpbox2">
						<a href="/manage/indexImg!floorView.action?type=4&seq=1"><img
							src="${e.picture}" style="width: 600px; height: 290px;" /></a>
					</div>
				</c:if>
				<c:if test="${e.order1>1 }">
					<div class="cpbox3">
						<a href="/manage/indexImg!floorView.action?type=4&seq=${e.order1}"><img
							src="${e.picture}" style="width: 300px; height: 180px;" //></a>
						<div class="cpxx">
							<a
								href="/manage/indexImg!floorView.action?type=4&seq=${e.order1}">${e.title}</a>
							<h4>￥${e.nowPrice}</h4>
						</div>
					</div>
				</c:if>
			</c:forEach>


		</div>
	</div>


</body>
</html>
