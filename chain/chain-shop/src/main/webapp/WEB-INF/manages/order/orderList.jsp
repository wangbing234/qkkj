<%@page import="net.onlineshop.core.KeyValueHelper"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ page session="false"%>
<%@ taglib uri="http://jsptags.com/tags/navigation/pager" prefix="pg"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/resource/common_html_meat.jsp"%>
<%@ include file="/WEB-INF/manages/system/common.jsp"%>
<%
response.setContentType("text/html;charset=utf-8");
request.setCharacterEncoding("utf-8");
%>
<script src="/resource/js/popup_layer.js" type="text/javascript"
	language="javascript"></script>
<script src="/resource/js/orderScript.js" type="text/javascript"
	language="javascript"></script>
<script src="/resource/js/layer/layer.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resource/My97DatePicker/WdatePicker.js"></script>
<style type="text/css">
.titleCss {
	background-color: #e6e6e6;
	border: solid 1px #e6e6e6;
	position: relative;
	margin: -1px 0 0 0;
	line-height: 32px;
	text-align: left;
}

.tigger {
	display: block;
	width: 80px;
	padding: 10px;
	text-align: center;
	background: #fff;
	border: 1px solid #999;
	color: #333;
	cursor: pointer;
}

.aCss {
	overflow: hidden;
	word-break: keep-all;
	white-space: nowrap;
	text-overflow: ellipsis;
	text-align: left;
	font-size: 12px;
}

.liCss {
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	height: 30px;
	text-align: left;
	margin-left: 10px;
	margin-right: 10px;
}

a.closeBtn:hover {
	color: #fff;
	border: 1px solid #85B6E2;
	background: #85B6E2;
}

a.closeBtn {
	position: absolute;
	top: 10px;
	right: 10px;
	display: block;
	width: 60px;
	padding: 4px 0;
	text-align: center;
	background: #fff;
	border: 1px solid #85B6E2;
	color: #333;
}

a {
	text-decoration: none;
}
table-bordered input[type="text"]{
  box-sizing: border-box;
  display:block;
  outline:0;
  padding:0 1em;
}
</style>
</head>

<body>
	<%application.setAttribute("_expressMap", SystemManager.manageExpressMap); %>
	<%application.setAttribute("supplierList", SystemManager.supplierList);%>
	<%application.setAttribute("companyConfigMap", SystemManager.companyConfigMap);%>
	
	<s:form action="order" namespace="/manage" method="post" theme="simple">
		<table class="table table-bordered">
			<tr>
				<td><!-- 'sure':'截图确认', -->
				订单状态&nbsp;<s:select cssClass="search-query input-small"   
					list="#{'':'','init':'待付款','pass':'待发货','send':'待签收','sign':'完成','cancel':'已取消'}"
					name="e.status" id="status" listKey="key" listValue="value" />&nbsp;
				订单项状态&nbsp;<s:select cssClass="search-query input-small" 
					list="#{'':'','pass':'待发货','send':'待签收','sign':'已签收'}"
					name="e.sstatus" id="sstatus" listKey="key" listValue="value" />&nbsp;
					
				 订单类型&nbsp; <s:select list="#{'cutWallet':'消费商品','cutScore':'积分商品'}" 
					listKey="key" listValue="value"   headerKey="" headerValue="" cssClass="search-query input-small" 
					name="e.updateAmount" id="updateAmount" />  &nbsp;
				过滤订单项&nbsp; <s:select list="#{'1':'过滤','0':'不过滤'}" 
						listKey="key" listValue="value"   headerKey="" headerValue="" cssClass="search-query input-small" 
						name="e.fiter" id="fiter" />  &nbsp;
				物流公司 &nbsp;<s:select list="#application._expressMap" listKey="key" cssClass="search-query input-small" 
					listValue="value" style="width:120px;" headerKey="" headerValue=""
					name="e.expressCompanyName" id="expressCompanyName" /> &nbsp;
					
				供应商&nbsp;&nbsp; <input type="hidden" value="<s:property value="e.supplierId"/>" id="supplierId" />
						<s:select name="e.supplierId" headerKey="" headerValue="" 
					 	list="#application.supplierList" id="supplierIdSelect" listKey="id" listValue="name" cssClass="input-small">
						</s:select> &nbsp;
				商品名称&nbsp;&nbsp;<s:textfield name="e.productName" id="productName"  cssClass="input-small"/>
				商品编码&nbsp;&nbsp;<s:textfield name="e.shortName" id="shortName"  cssClass="input-small"/>
			</tr>
			<tr>
				<td>
					订单号&nbsp;<s:textfield name="e.orderNo"  cssClass=" input-medium"  style="width:205px;" />&nbsp;
					快递单号&nbsp;<s:textfield  name="e.expressNo" cssStyle="width:150px;" />&nbsp;&nbsp;&nbsp;
				       下单手机&nbsp;<s:textfield cssClass="input-small" name="e.orderMobile"   />&nbsp;&nbsp;&nbsp;
				       下单人姓名&nbsp;<s:textfield   name="e.nickname" cssStyle="width:70px;" />&nbsp;&nbsp;&nbsp; 
					收件姓名<s:textfield  cssStyle="width:70px;" name="e.shipname" />
						&nbsp; 时间范围&nbsp;<input id="d4311"
					class="Wdate search-query input-small" type="text"
					name="e.startDate" value="<s:property value="e.startDate" />"
					onFocus="WdatePicker({maxDate:'#F{$dp.$D(\'d4312\')||\'2020-10-01\'}'})" />~ <input id="d4312" class="Wdate search-query input-small"
					type="text" name="e.endDate"
					value="<s:property value="e.endDate" />"
					onFocus="WdatePicker({minDate:'#F{$dp.$D(\'d4311\')}',maxDate:'2020-10-01'})" />
					&nbsp;&nbsp;&nbsp;
				</td>

			</tr>

			<tr>
				<td>
					<%-- 					<s:submit action="order" method="selectList" value="查询" cssClass="btn btn-primary" />  --%>
					<%-- 						<s:a method="selectList" cssClass="btn btn-primary"> --%>
					<!-- 							<i class="icon-search icon-white"></i> 查询 --> <%-- 						</s:a> --%>
					<button method="order!selectList.action" id="orderQueryButton" class="btn btn-primary"
						onclick="selectList(this)">
						<i class="icon-search icon-white"></i> 查询
					</button> 
					<button method="order!exportSimpleExl.action"
						class="btn btn-success" onclick="selectList(this)">订单导出</button>
					<button method="order!exportFinanceExl.action"
					class="btn btn-success" onclick="selectList(this)">财务导出</button>
					<%-- 	<button method="order!initImport.action" class="btn btn-warning"
						onclick="selectList(this)">
						<i class="icon-white"></i>批量单号
					</button> 				<s:submit action="order"  method="importXls" value="导出" cssClass="btn btn-success" />  --%>
					<div
						style="float: right; vertical-align: middle; bottom: 0px; top: 10px;">
						<%@ include file="/WEB-INF/manages/system/orderPager.jsp"%>
					</div>
				</td>
			</tr>
		</table>

		<table class="table table-bordered">
			<tr style="background-color: #dff0d8">
				<!-- 				<th width="20"><input type="checkbox" id="firstCheckbox" /></th> -->
				<th colspan="3">商品信息</th>
				<th>创建日期</th>
				<th>订单状态</th>
				<!-- 				<th>支付状态</th> -->
				<!-- 				<th>付款方式</th> -->
				<th width="60px">操作</th>
			</tr>
			<s:iterator value="pager.list" var="item">
				<tr style="background: #f5f5f5">
					<td style="{font-size: 18px!important}">
						订单号:
						<a href="/manage/order!toEdit.action?e.id=${id}"><s:property value="orderNo" /></a> 
					      <s:if test="lowStocks.equals(\"y\")">
							<font color="red">【缺货】</font>
						</s:if>
					</td>
					<td align="center">商品总数:<s:property value="quantity" /></td>
					<td style="display:none">
							<c:if test="${fn:contains(account,'游客') }">
							游客
							</c:if> <c:if test="${!fn:contains(account,'游客') }">
							会员:<!--<s:a>
							 href="accounts!show.action?account=%{account}">  target="_blank" href="#"
										
								</s:a>-->	
									<s:property value="account" />
								</c:if>
					</td>
					<td style="text-align: center; vertical-align: middle; width: 11%" rowspan="${fn:length(item.orderdetail)+1}" valign="middle">总金额:
						<br /> 
						<font style="font-size: 16px; color: red"> 
						<s:property value="amount" /></font> 元<s:if test="updateAmount.equals(\"y\")">
							<font color="red">【修】</font>
						</s:if>
						<c:if test="${item.fee!='0.00'}">(含邮费:${item.fee })</c:if>
					</td>
					<td>${fn:substring(item.createdate,0,16)}</td>
					<td>
					<span class="badge badge-success"> 
						<s:property value="statusStr" />
					</span></td>
					<td>
						<nobr>
						<s:a href="/manage/order!toEdit.action?e.id=%{id}">编辑</s:a>
						 <s:if test="status=='sure' || (status=='pass' && (cutMoney=='' ||cutMoney==0))"> 
								 <s:a href="javascript:cancelOrder(%{id})"  >取消</s:a>
						 </s:if>
						</nobr>
					</td>
				</tr>
					<% application.setAttribute("productTypeList", SystemManager.productTypeList); %>

				<c:forEach items="${item.orderdetail}" var="dddd" varStatus="vs">
					<tr>
						<td colspan="2" style="width:47%">
							<span style="float: left; text-align: left;width:55%">
								<img src="${dddd.picurl160}" width="50" style="padding: 5px; float: left;" />
								<a href="product!toEdit.action?e.id=${dddd.productID}">${dddd.productName }</a>
												
								<br /> 
								<s:iterator value="#application.productTypeList" var="item11">
									<c:if test="${index==dddd.productType}">
							  			产品类型: <span style="font-size: 13px;color: red;">${name}</span>
							  		 </c:if>
								</s:iterator>
								<br /> 
								
								<s:iterator value="#application.supplierList" var="itemrr">
								  	 <c:if test="${id==dddd.supplierId}">
							  			供应商:  <span>${name}</span>
							  		 </c:if>
								</s:iterator>
							</span>
							<span style="float: right; text-align: right;width:45%">
									<c:choose>
										<c:when test="${dddd.status=='pass'}">
												<s:textfield name="expressNo"  placeholder="请输入快递单号"  onkeyup="javascript:changeExpressNo(this)"
															 data-rule="运单号:required;WIDinvoice_no;length[1~20];" cssStyle="width:160px;height: 18px;" maxlength="20" size="20" />
												<br/>
												
												<s:select list="#application._expressMap" listKey="key"
													 	  listValue="value" headerKey="" headerValue="选择物流公司"  cssStyle="width:120px;height: 28px;" 
														  name="expressCompanyName" id="expressCompanyName" />&nbsp;
											 	<input value="发货" style="font: 13px;margin-top: -10px;" type="button" class="btn btn-small"  onclick="javascript:sendProduct(${dddd.orderID},${dddd.id},this)"/>
										 </c:when>
										 <c:when test="${dddd.status=='init'}"> 
											 状态：待付款
										 </c:when>
										 <c:when test="${dddd.status=='pass'}"> 
											 状态：待审核
										 </c:when>
										 <c:when test="${dddd.status=='send'}"> 
											 状态：已发货
										 </c:when>
										 <c:when test="${dddd.status=='sign'}"> 
											 状态：已签收
										 </c:when>
										   
									</c:choose>
									<c:choose>
											<c:when test="${dddd.status=='sign'||dddd.status=='send'}"> 
												 <br/>
												 ${dddd.expressCompanyChinaName}:
												 <c:if  test="${dddd.expressCompanyName!='zt'}"> 
													 <a href="javascript:;" onclick="queryEx(${dddd.id},'${dddd.expressCompanyChinaName }','${dddd.expressNo}')">${dddd.expressNo }
													 </a>
												 </c:if>
												<c:if  test="${dddd.expressCompanyName=='zt'}"> 
												 自提
												</c:if>
											 </c:when>
									 </c:choose>
									<br />
									小计:${dddd.price }×${dddd.number }=${dddd.total0 }元
									<br />
								<font color="green">${dddd.remarks}</font>
							</span>
						</td>
						<c:if test="${vs.index==0 }">
							<td rowspan="${fn:length(item.orderdetail)}" colspan="5">
							   <span style="float: right">
									 <c:if  test="${item.otherRequirement!='' && item.otherRequirement!=null}"> 
										顾客要求:<font style="color:red">${item.otherRequirement}</font>
									 </c:if>
									 <c:if  test="${item.ordership.remark!='' && item.ordership.remark!=null}"> 
										<br/>后台备注:<font style="color:red">${item.ordership.remark}</font>
									 </c:if>
								</span>
							       下单人姓名:<b><s:property value="nickname" /></b> <br />
								下单人手机:<b><s:property value="orderMobile" /></b> 
								<br/>收件人姓名:<s:property value="ordership.shipname" />
								<br /> 收件人手机：<b>${item.ordership.phone }</b> <br />
								收件人地址：${item.ordership.province } ${item.ordership.city }
								${item.ordership.area } <s:property value="ordership.shipaddress" /> <br />
								
							</td>
						</c:if>
					</tr>
				</c:forEach>
			</s:iterator>

			<tr>
				<td colspan="55" style="text-align: center;">
					<%@ include file="/WEB-INF/manages/system/orderPager.jsp"%>
				</td>
			</tr>
		</table>



	</s:form>
	<div id="blk1" class="blk" style="display: none;">
		<div class="head">
			<div class="head-right"></div>
		</div>
		<div class="main">
			<h2>
				请输入对应商品的款号 <input class="input-small" id="queryCode"
					name="queryCode" onkeyup="queryCode(this.value)">
			</h2>
			<a href="javascript:void(0)" id="close1" class="closeBtn">关闭</a>
			<ul id="pidlist">
			</ul>
		</div>
		<div class="foot">
			<div class="foot-right"></div>
		</div>
	</div>
<script type="text/javascript">
	$(function() {
		function c1(f) {
			$(":checkbox").each(function() {
				$(this).attr("checked", f);
			});
		}
		$("#firstCheckbox").click(function() {
			if ($(this).attr("checked")) {
				c1(true);
			} else {
				c1(false);
			}
		});
			//示例1，默认弹出层
			new PopupLayer({trigger:"#ele1",popupBlk:"#blk1",closeBtn:"#close1"});
	});
	function deleteSelect() {
		if ($("input:checked").size() == 0) {
			return false;
		}
		return confirm("确定删除选择的记录?");
	}
	function updateInBlackList() {
		if ($("input:checked").size() == 0) {
			return false;
		}
		return confirm("确定将选择的记录拉入新闻黑名单吗?");
	}
	function cancelOrder(value){
		doCancelOrder(value,function(data){
			$("#orderQueryButton").click();
		})
	}
	 
	function queryCode(value){
	  $.ajax({
	      type :"post",  //提交方式 
	      url :"/manage/product!queryCode.action" ,         //请求链接 
	       data:{"code":value},              
	      dataType :"json", //返回数据类型
	      error:function(){   //后台出错，显示提示信息 
	        $("#pidlist").html("");
	      }, 
	      success :function(res) {
	      var stringbef = new Array();
	     $("#pidlist").html("");
	       $.each(res, function(i,val){
	       	stringbef
				.push("<div><a href='/product/"+val.id+".html' target='_blank'>【"+val.quality+"】"+val.name+"</a></div>");
	       
	       });
	       $("#pidlist").html(stringbef.join(""));

	       }});
	}
	
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
			            	if(d && d.code==0 && d.data) {
			            			var expressCom=$(obj).next().next();
				            		expressCom.val(d.data);
			            	}
			            },
						 error:function(d){
						 }
					}
				);
		}
	}
	
	function sendProduct(id,orderDetailId,obj){
		 var commpanyNo=$(obj).prev("select").val();
         var expressNo=$(obj).prev().prev().prev().val();
 		 if(!expressNo) {
 			 alert("请输入快递单号！");
        	 return;
         }
 		 if(!commpanyNo) {
        	 alert("请选择快递公司！");
        	 return;
         }
		if(!confirm("确定要发货?")){
			return;
		}
		$.blockUI({ message: "正在请求，请稍候...",css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        }});
		var cc = {"orderid":id,
				"e.orderDetailId":orderDetailId,
				"WIDinvoice_no":expressNo,
				"expressCompanyName":commpanyNo,
				"confirmSendProductRemark":"默认注释"}
		 var _url ='<%=request.getContextPath()%>/manage/order!sendProduct.action';
  	     $.ajax({
            url: _url,
            type: 'post',
            data: cc,
            dataType: 'json',
            success: function(d){
            	console.log("success="+d+",code="+d.code+",error="+d.error);
            	 $("#sendProductBut").removeAttr("disabled");
            	if(d.code=="0"){
            		window.location.href =$("#selectPageLinkInput").val();
            	}else if(d.code=="1"){
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
</script>
</body>
</html>
