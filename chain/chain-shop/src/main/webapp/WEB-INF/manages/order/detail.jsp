<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/resource/common_html_meat.jsp"%>
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/resource/bootstrap/css/bootstrap.min.css"
	type="text/css">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/resource/css/base.css"
	type="text/css">

<script type="text/javascript" src="/mobile/js/jquery.min.js"></script>


<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/jquery-jquery-ui/themes/base/jquery.ui.all.css">
<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/themes/default/default.css" />
<style type="text/css">
.olexon-prod-color-list li, .olexon-prod-size-list li {
	cursor: pointer;
	display: inline-block;
	float: left;
	margin: 4px;
	min-width: 50px;
	border: 1px solid #ccc;
	line-height: 30px;
	padding: 1px 5px;
	border-radius: 3px;
	box-shadow: 0 2px 3px rgba(0, 0, 0, 0.12);
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.olexon-prod-color-list li.on, .olexon-prod-size-list li.on {
	border: 2px solid #900;
	padding: 0px 4px;
	color: #444;
	background: #fff url(../../mobile/images/ico_dui.gif) no-repeat right
		bottom;
}

.specNotAllowed {
	background-color: #F0F0F0;
}

.olexon-prod-color-list img {
	width: auto
}

.olexon-prod-size-list a {
	text-align: center;
}

.olexon-prod-size-list a.none {
	background-color: #DFDFDF;
	color: #B6B6B6;
}

.olexon-prod-num input {
	border: 1px solid #ccc;
	text-align: center;
	width: 50px;
	vertical-align: middle;
	border-radius: 0;
	margin-top: 10px;
}

.olexon-prod-num .reduce, .olexon-prod-num .add {
	display: inline-block;
	border: 1px solid #ccc;
	color: #444;
	line-height: 30px;
	padding: 0 10px;
	vertical-align: middle;
	background-image: -webkit-linear-gradient(top, #F2F2F2, #D8D8D8);
	background-image: -moz-linear-gradient(top, #F2F2F2, #D8D8D8);
	background-image: -ms-linear-gradient(top, #F2F2F2, #D8D8D8);
	background-image: linear-gradient(top, #F2F2F2, #D8D8D8);
}

.olexon-prod-num .reduce {
	border-right: none;
	border-radius: 3px 0 0 3px;
}

.olexon-prod-num .add {
	border-left: none;
	border-radius: 0 3px 3px 0;
}
</style>


</head>

<body>




	<table class="table table-bordered" style="width: 95%; margin: auto;">
		<tr style="background-color: #dff0d8">
			<td colspan="2"
				style="background-color: #dff0d8; text-align: center;"><strong><span
					class="badge badge-important">修改订单项</span></strong></td>
		</tr>
		<tr style="display: none;">
			<td>id</td>
			<td><input name="id" value="${orderdetail.id}" id="id" /></td>
		</tr>
		<tr>
			<td style="text-align: right;">已经购买</td>
			<td style="text-align: left;">${orderdetail.productName } 【
				${orderdetail.specInfo} ${orderdetail.price}×${orderdetail.number}】
			</td>
		</tr>


		<tr>
			<td style="text-align: right;">修改信息</td>


			<td class="olexon-prod-color-list">
				<ul style="list-style: none;" id="specColor">
					<select name="buy" id="buy" onchange="buychange()">
						<option value="0">-请选择规格-</option>
						<c:forEach items="${specList}" var="item">

							<option value="${item.id}" data-value="${item.specStock}">
								${item.specColor} ${item.specSize}</option>
						</c:forEach>
					</select> &nbsp;&nbsp; 现有库存：
					<span id="stock" style="width: 120px;">0</span>&nbsp; 购买数量：
					<input name="buyNum" id="buyNum" onchange="valueChange()"
						onkeyup="valueChange()" value="0" type="number">

				</ul>



			</td>

		</tr>

		<tr>
			<td colspan="2" align="center" style="text-align: center"><input
				type="button" onclick="subDetail();" value="保存"
				class="btn btn-primary" /> <a
				href="/manage/order!toEdit.action?e.id=${orderdetail.orderID}"
				class="btn btn-primary"></i>返回</a></td>
		</tr>
	</table>

	<script type="text/javascript">
function buychange(){

$("#buyNum").val(0);

  $.ajax({ 
	      type :"post",  //提交方式 
	      url :"/api.action" ,         //请求链接 
	       data:{"sid":$("#buy").val(),"a":"getStock"},              
	      dataType :"json", //返回数据类型
	      error:function(){   //后台出错，显示提示信息 
	       	alert("请输入正确的数据信息");
	      }, 
	      success :function(res) { 
	      $("#stock").text(res.specStock);
	      }});

}
function valueChange(){
var aa=parseInt($("#stock").text());
if($("#buy").val()==0){
$("#buyNum").val(0);
}

else if(aa==0){
$("#buyNum").val(0);
}
else if(aa<$("#buyNum").val()){
$("#buyNum").val(aa);
}
else if($("#buyNum").val()<1){
$("#buyNum").val(1)
}
}
function subDetail(){
if($("#buy").val()==0){
alert("请选择规格");
return false;
}

if($("#buyNum").val()==0){
alert("请选择购买数量");
return false;
}


  $.ajax({ 
	      type :"post",  //提交方式 
	      url :"/manage/order!updateOrderdetail.action" ,         //请求链接 
	       data:{"id":$("#id").val(),"buy":$("#buy").val(),"buyNum":$("#buyNum").val()},              
	      dataType :"json", //返回数据类型
	      error:function(){   //后台出错，显示提示信息 
	       	alert("请输入正确的数据信息");
	      }, 
	      success :function(res) { 
	      if(res.mess==0){
	      alert("修改成功");
	      window.location.href="/manage/order!toEdit.action?e.id=${orderdetail.orderID}";
	      }
	     
	      }});

}
</script>


</body>
</html>
