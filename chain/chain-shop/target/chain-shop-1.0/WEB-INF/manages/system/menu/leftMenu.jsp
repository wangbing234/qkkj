<%@page import="net.onlineshop.core.ManageContainer"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>



<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>jquery鼎烨商城系统导航</title>

<script type="text/javascript" src="/resource/js/jquery-1.9.1.min.js"></script>


<style type="text/css">
* {
	margin: 0;
	padding: 0;
	list-style-type: none;
}

a, img {
	border: 0;
}

body {
	font: 12px/180% "微软雅黑";
}

a, a:hover {
	color: #000;
	text-decoration: none;
}

.left {
	width: 160px;
	height: 100%;
	border-right: 1px solid #CCCCCC; # FFFFFF;
	color: #000000;
	font-size: 14px;
	text-align: center;
	position: absolute;
	left: 0;
	top: 0;
}

.div1 {
	text-align: center;
	width: 160px;
}

.div2 {
	height: 40px;
	line-height: 40px;
	cursor: pointer;
	font-size: 13px;
	position: relative;
	border-bottom: #ccc 1px dotted;
}

.jbsz {
	position: absolute;
	height: 20px;
	width: 20px;
	left: 20px;
	top: 10px;
}

.jbsz img {
	width: 20px;
}

.div3 {
	display: none;
	font-size: 13px;
}

.div3 ul {
	margin: 0;
	padding: 0;
}

.div3 li {
	height: 30px;
	line-height: 30px;
	list-style: none;
	border-bottom: #ccc 1px dotted;
	text-align: center;
}

.div3 li:hover {
	background-color: #f4f5f9;
}

.div3 li.on {
	background-color: #f4f5f9;
}

.div2:hover {
	text-decoration: none;
	background-color: #f4f5f9;
}
</style>

</head>
<body>

	<div class="left">
		<div class="left_top"
			style="border-bottom: 1px solid #CCCCCC; height: 40px; line-height: 40px; font-weight: 800">
			<a href='/manage/user!initManageIndex.action' target='rightFrame'>商城首页</a>
		</div>
		<div class="div1">


			<div class="div2">
				<div class="jbsz"></div>
				基本管理
			</div>
			<div class="div3">
				<ul>
					<li><a href="#">网站配置</a></li>
					<li><a href="#">管理设置</a></li>
					<li><a href="#">导航菜单</a></li>
				</ul>
			</div>

		</div>
	</div>

	<script type="text/javascript">

$(function(){
var mycars=new Array()
$(".div1").html("加载中");
	$.ajax({
		url:"/manage/menu!selectJsonMenu.action",
		type:"post",
		dataType:"json",
		success:function(data, textStatus){
          
           $(data).each(function(i,value){
           if(value.url!=null&&value.url!=""){
            mycars.push("<div class='div2'><div class='jbsz'><img src='"+value.icon+"' /></div><a href='"+value.url+"'  target='rightFrame'>"+value.name+"</a></div>")
           }else{
              mycars.push("<div class='div2'><div class='jbsz'><img src='"+value.icon+"' /></div>"+value.name+"</div>")
            }
            
           
                    if(value.children!=null&&value.children.length>0){
          
             mycars.push("<div class='div3'><ul>")
           
             $(value.children).each(function(j,chr){
             
           
             
           if(chr.url!=null&&value.chr!=""){
             mycars.push("<li><a href='"+chr.url+"'  target='rightFrame' class='tourl'  >"+chr.name+"</a></li>")
           }else{
              mycars.push("<li>"+chr.name+"</li>")
            }
             });
                mycars.push("</ul></div>")
          } 
           
            
           });
           
 
        
          $(".div1").html( mycars.join(""));
          
          $(".div2").click(function(){ 
		$(this).next("div").slideToggle().siblings(".div3:visible").slideUp();
	});
               $(".tourl").click(function(){ 
               $(".tourl").parent().removeClass("on");
               
             $(this).parent().addClass("on")
		
	});   
          
		},
		error:function(){
			alert("加载菜单失败！");
		}
	});	});

</script>
</body>
</html>

