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
<%-- <%@ include file="/WEB-INF/manages/system/common.jsp"%> --%>

<link rel="stylesheet"
	href="<%=request.getContextPath()%>/resource/bootstrap/css/bootstrap.min.css"
	type="text/css">
<link rel="stylesheet" href="<%=request.getContextPath()%>/resource/css/base.css" type="text/css">
<script type="text/javascript"
	src="<%=request.getContextPath() %>/resource/js/jquery-1.9.1.min.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath() %>/resource/js/jquery.blockUI.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath() %>/resource/bootstrap/js/bootstrap.min.js"></script>

<%-- <script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/manage.js"></script> --%>

<%@ include file="/resource/common_html_validator.jsp"%>
<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/jquery-jquery-ui/themes/base/jquery.ui.all.css">
</head>
<body>
	<s:form id="form" name="form" method="post" theme="simple">
		<input type="hidden" name="WIDtrade_no"
			value="<s:property value="e.tradeNo"/>" />
		<input type="hidden" id="orderid" name="orderid"
			value="<s:property value="e.id"/>" />
	<input  type="hidden" id="orderDetailId" name="e.orderDetailId"
			value="<s:property value="e.orderDetailId"/>" />
		<table  class="table table-bordered" style="width: 95%; margin: auto;">
			<tr style="background-color: #dff0d8">
				<td colspan="2" style="background-color: #dff0d8; text-align: center;font-size: 15px"><strong>确认发货</strong>
			</tr>
			<tr>
				<td  style="text-align: right;font-size: 14px;width: 30%">物流方式</td>
				<td style="text-align: left;"><c:if test="${e.payType == 1 }">
						<div class="alert alert-info" id="WIDtransport_type_msg">
							发货10天后，若对方没有确认收货，交易结束，金额自动进入您的账户。</div>
					</c:if> <s:select list="#{'EXPRESS':'快递','no':'自提 '}"
						name="WIDtransport_type" id="WIDtransport_type"
						onchange="changeSendMethod(this)" /></td>
			</tr>
			<tr id="companyNo" style="display:none">
				<td  style="text-align: right;font-size: 14px">提货地点</td>
				<td style="text-align: left;">
					<s:select list="#application.companyConfigMap" listKey="key"
						listValue="value" headerKey="" headerValue=""
						name="companyAddress" id="companyAddress" />
				</td>
			</tr>
			<tr id="expressNo">
				<td  style="text-align: right;font-size: 14px">运单号</td>
				<td style="text-align: left;"><s:textfield name="WIDinvoice_no" id="WIDinvoice_no"
						data-rule="运单号:required;WIDinvoice_no;length[1~20];"
						maxlength="20" size="20" /></td>
			</tr>
			<tr id="companyTR">
				<td  style="text-align: right;font-size: 14px">物流公司名称</td>
				<td style="text-align: left;">
					 <s:select list="#application._expressMap" listKey="key"
						listValue="value" headerKey="" headerValue=""
						name="expressCompanyName" id="expressCompanyName" />
				</td>
			</tr>
			<tr>
				<td  style="text-align: right;font-size: 14px">发货备注</td>
				<td style="text-align: left;"><s:textarea name="confirmSendProductRemark" id="confirmSendProductRemark"
						data-rule="确认发货备注:confirmSendProductRemark;length[1~50];"
						maxlength="50" size="50"   rows="4" cssStyle="width:60%;" /></td>
			</tr>
			<tr>
				<td nowrap="nowrap" colspan="2" style="text-align: center;">
					<input type="button" id="sendProductBut" class="btn btn-primary" value="发货" onclick="return sendProduct()" /> 
					<span style="width:20%"></span>
					<input type="button" value="返回" class="btn btn-default btn-sm" onclick="javascript:history.go(-1);" />
				</td>
			</tr>
		</table>
	</s:form>

	<script type="text/javascript">
	
	
	function changeExpressNo(obj){
		var expressNo = $(obj).val();
		if(expressNo && expressNo.length>5) {
				var _url = "<%=request.getContextPath()%>/manage/order!autoComNum.action?value="+expressNo;
				  $.ajax(
					{
			            url: _url,
			            type: 'get',
			            dataType: 'json',
			            success: function(d){
			            	if(d && d.code==0 &&  d.data) {
			            		 $("#expressCompanyName").val(d.data);
			            	}
			            },
						 error:function(d){
						 }
					}
				);
		}
	}
	function changeSendMethod(obj){
		var selectVal = $(obj).val();
		console.log("selectVal="+selectVal);
		if("no"==selectVal){
			$("#companyNo").show();
			$("#expressNo").hide();
			$("#companyTR").hide();
		}
		else{
			$("#companyNo").hide();
			$("#expressNo").show();
			$("#companyTR").show();
		}
	}
	
	function sendProduct(){
		var WIDinvoice_no;
		var expressCompanyName;
			if($("#WIDtransport_type").val()=="no") {
				if(!$("#companyAddress").val()){
					alert("自提地点不能为空！");
					$("#companyAddress").focus();
					return false;
				}
				expressCompanyName='zt';
				WIDinvoice_no=$("#companyAddress").val();
			}
			else {
				expressCompanyName=$("#expressCompanyName").val();
				WIDinvoice_no=$("#WIDinvoice_no").val();
				if(!WIDinvoice_no){
					alert("运单号不能为空！");
					$("#WIDinvoice_no").focus();
					return false;
				}
				if(!$("#expressCompanyName").val()){
					alert("请选择物流公司！");
					$("#expressCompanyName").focus();
					return false;
				}
			}
			console.log("验证通过..");
			var url;
			var mage;
	           url = '<%=request.getContextPath()%>/manage/order!sendProduct.action';
	       	   mage = '发货接口';
		
			$.blockUI({ message: "正在请求"+mage+"，请稍候...",css: { 
	            border: 'none', 
	            padding: '15px', 
	            backgroundColor: '#000', 
	            '-webkit-border-radius': '10px', 
	            '-moz-border-radius': '10px', 
	            opacity: .5, 
	            color: '#fff' 
	        }});
	        
	        var _orderid = $("#orderid").val();
	        var _url = "<%=request.getContextPath()%>/manage/order!toEdit.action?e.id="+_orderid;
	        $("#form").action = _url;
	        
	        
	        var cc = {
	        	"orderid":_orderid,
	        	"e.orderDetailId":$("#orderDetailId").val(),
	        	"WIDinvoice_no":WIDinvoice_no,
	        	"expressCompanyName":expressCompanyName,
	        	"confirmSendProductRemark":$("#expressCompanyName").val()
	        }
	        console.log(cc);
	        $("#sendProductBut").attr({"disabled":"disabled"});
      	     $.ajax({
	            url: url,
	            type: 'post',
	            data: cc,
	            dataType: 'json',
	            //async : false,
	            success: function(d){
	            	console.log("success="+d+",code="+d.code+",error="+d.error);
	            	 $("#sendProductBut").removeAttr("disabled");
	            	if(d.code=="0"){
	            		alert("发货成功！");
	            		window.location.href =_url;
	            	}else if(d.code=="1"){
	            		var errorStr = d.error;
	            		if(d.error=="TRADE_NOT_EXIST"){
	            			errorStr = "支付宝中不存在此交易号！";
	            		}else{
	            			
	            		}
	            		alert("请求发货失败！原因："+errorStr);
	            	}
	            	jQuery.unblockUI();
	            	return false;
	            },
	            error:function(d){
	            	 $("#sendProductBut").removeAttr("disabled");
	            	console.log("error="+d+",code="+d.code+",error="+d.error);
	            	alert("发送请求失败！请联系站点管理员！");
	            	jQuery.unblockUI();
	            }
	        });
		//});
	}
	
	$(function(){
		$('#WIDinvoice_no').bind('input propertychange ',function(e){
			changeExpressNo(e.currentTarget);
		});
	});
	</script>
</body>
</html>
