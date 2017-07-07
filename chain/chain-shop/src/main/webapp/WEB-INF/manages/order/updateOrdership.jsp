<%@page import="net.onlineshop.services.manage.order.bean.Order"%>
<%@page import="net.onlineshop.core.KeyValueHelper"%>
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
<title>修改订单的配送地址信息</title>
<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/jquery-jquery-ui/themes/base/jquery.ui.all.css">
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resource/My97DatePicker/WdatePicker.js"></script>
</head>
<body>
	<div class="container" style="margin-top: 0px; padding-top: 0px;">
		<div class="row">
			<div class="col-md-9" style="min-height: 200px;">
				<div class="row">

					<div class="alert alert-info">修改订单配送地址信息</div>
					<s:form action="order!updateOrdership.action" namespace="/manage"
						method="post" theme="simple" name="form" role="form" id="form">
						<s:hidden name="e.ordership.id" />
						<s:hidden name="e.id" />
						<table class="table table-bordered">
							<tr>
								<td width="100px">收货人姓名</td>
								<td><s:textfield name="e.ordership.shipname" type="text"
										cssClass="form-control" id="name"
										data-rule="收货人姓名:required;length[2~8];name;"
										placeholder="请输入收货人姓名" /></td>
							</tr>
							<tr>
								<td>地址区域</td>
								<td>
									<%
					    	application.setAttribute("_areaMap", SystemManager.areaMap);
					    	%> <select name="e.ordership.provinceCode" id="province"
									class="mb10 mt10" onchange="changeProvince(this.value)">
										<option value="">请选择省份</option>
										<c:forEach items="${_areaMap}" var="area">

											<option value="${area.value.code}">${area.value.name}</option>
										</c:forEach>
								</select> <select name="e.ordership.cityCode" id="citySelect"
									class="mb10 mt10" onchange="changeCity(this.value)"><option
											value="">请选择城市</option></select> <select name="e.ordership.areaCode"
									id="areaSelect" class="mb10 mt10"><option value="">
											请选择地区</option></select>

								</td>
							</tr>
							<tr>
								<td>地址</td>
								<td><s:textfield name="e.ordership.shipaddress" type="text"
										style="width:320px;" cssClass="form-control" id="address"
										data-rule="地址:required;length[0~100];address;"
										placeholder="请输入收货人地址" /></td>
							</tr>
							<tr>
								<td>邮编</td>
								<td><s:textfield name="e.ordership.zip" type="text"
										cssClass="form-control" id="zip"
										data-rule="邮编:required;length[0~70];zip;"
										placeholder="请输入收货人邮编" /></td>
							</tr>
							<tr>
								<td>手机</td>
								<td><s:textfield name="e.ordership.phone" type="text"
										cssClass="form-control" id="mobile"
										data-rule="手机:required;length[0~70];mobile;"
										placeholder="请输入收货人手机" /></td>
							</tr>
							<tr>
								<td>电话号码</td>
								<td><s:textfield name="e.ordership.tel" type="text"
										cssClass="form-control" id="phone"
										data-rule="电话号码:required;length[0~70];phone;"
										placeholder="请输入收货人座机号码" /></td>
							</tr>
							<tr>
								<td colspan="2" style="text-align: center;">
									<button type="submit" class="btn btn-success btn-sm" value="保存">
										<span class="glyphicon glyphicon-ok"></span>确认修改
									</button> <input type="button" value="返回" class="btn btn-default btn-sm"
									onclick="javascript:history.go(-1);" /> <%-- 					      		<s:submit method="toEdit" value="返回" cssClass="btn btn-default btn-sm"/> --%>
								</td>
							</tr>
						</table>
					</s:form>
				</div>
			</div>
		</div>
	</div>

	<script type="text/javascript">

var pValue="${e.ordership.provinceCode}" ;
 var cValue="${e.ordership.cityCode}";
   var aValue="${e.ordership.areaCode}";
$("#province").val(pValue);


function changeProvince(value){
	var selectVal = value;
	if(!selectVal){
		console.log("return;");
		return;
	}
	var _url = "order!selectCitysByProvinceCode.action?provinceCode="+selectVal;
	console.log("_url="+_url);
	$("#citySelect").empty().show().append("<option value=''>--选择城市--</option>");
	$("#areaSelect").empty().hide().append("<option value=''>--选择区域--</option>");
	$.ajax({
	  type: 'POST',
	  url: _url,
	  data: {},
	  dataType: "json",
	  success: function(data){
		  //console.log("changeProvince success!data = "+data);
		  $.each(data,function(index,value){
			  //console.log("index="+index+",value="+value.code+","+value.name);
			  $("#citySelect").append("<option value='"+value.code+"'>"+value.name+"</option>");
		  });
		   $("#citySelect").val(cValue);
		    cValue="";
	  },
	  error:function(er){
		  console.log("changeProvince error!er = "+er);
	  }
	});
}

function changeCity(value){
var selectProvinceVal = $("#province").val();
	var selectCityVal =value;
	if(!selectProvinceVal || !selectCityVal){
		console.log("return;");
		return;
	}
	var _url = "order!selectAreaListByCityCode.action?provinceCode="+selectProvinceVal+"&cityCode="+selectCityVal;
	console.log("_url="+_url);
	$("#areaSelect").empty().show().append("<option value=''>--选择区域--</option>");
	$.ajax({
	  type: 'POST',
	  url: _url,
	  data: {},
	  dataType: "json",
	  success: function(data){
	    var as=0;
		  //console.log("changeProvince success!data = "+data);
		  $.each(data,function(index,value){
			  //console.log("index="+index+",value="+value.code+","+value.name);
			  $("#areaSelect").append("<option value='"+value.code+"'>"+value.name+"</option>");
			  as++;
		  });
		  
		  if(as==0){
		   $("#areaSelect").hide();
		  }else{
		  $("#areaSelect").show();
		  }
		    $("#areaSelect").val(aValue);
		    aValue="";
	  },
	  error:function(er){
		  console.log("changeCity error!er = "+er);
	  }
	});
}
$(function() {

<c:if test="${not empty e.ordership.provinceCode}">

changeProvince("${e.ordership.provinceCode}");
</c:if>
<c:if test="${not empty e.ordership.cityCode}">

changeCity("${e.ordership.cityCode}");


</c:if>

});
</script>
</body>
</html>
