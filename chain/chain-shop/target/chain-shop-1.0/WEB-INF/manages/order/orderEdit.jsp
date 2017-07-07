<%@page import="net.onlineshop.services.manage.order.bean.Order"%>
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
<script src="/resource/js/orderScript.js" type="text/javascript"></script>
<script src="/resource/js/layer/layer.js"></script>
<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/jquery-jquery-ui/themes/base/jquery.ui.all.css">
<style>
.simpleOrderReport {
	font-weight: 700;
	font-size: 16px;
	color: #f50;
}
</style>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resource/My97DatePicker/WdatePicker.js"></script>
</head>
<body>
	<s:form action="order" namespace="/manage" method="post" theme="simple"
		name="form1">
		<s:hidden name="e.id" />

		<div id="buttons"
			style="text-align: center; border-bottom: 1px solid #ccc; padding: 5px;">
			<div id="updateMsg">
				<font color='red'><s:property value="updateMsg" /></font>
			</div>
			<!-- 		订单状态		 -->
			<c:choose>
				<c:when test="${e.status=='pass'&&e.paystatus=='y'}"> 
				</c:when>
			</c:choose>

		</div>
		<div id="addPayDiv" style="display: none;">
			<table class="table">
				<tr>
					<td colspan="2">
						<h4>添加支付记录</h4>
					</td>
				</tr>
				 <tr>
					<td>确认类型</td>
					<td>
						<select name="e.type">
							<option value="sure">已经确认付款</option>
							<option value="false">假单(取消订单)</option>
						</select>
					</td>
				</tr>
				<tr>
					<td>是否保留积分(实际)</td>
					<td>
						<s:select    list="#{'1':'保留','0':'不保留'}"
						name="e.isSaveScoreFinal" id="isSaveScoreFinal" listKey="key" listValue="value" />
					</td>
				</tr>
				<tr>
					<td>备注</td>
					<td>
						<div class="controls">
							<input name="e.orderpay.remark" value="">
						</div>
					</td>
				</tr>
				<tr>
					<td colspan="2">
					<s:submit type="button" method="insertOrderpay" onclick="return onSubmit(this);" value="确认" cssClass="btn btn-primary" />
					 <input id="cancelPayBtn" type="button" value="取消" class="btn" /></td>
				</tr>
			</table>
		</div>
		<div id="addNotesDiv" style="display: none;">
			<table class="table">
				<tr>
					<td colspan="2">
						<h4>添加/修改订单备注</h4>
					</td>
				</tr>

				<tr>
					<td>备注</td>
					<td>
						<div class="controls">
							<textarea name="content" col="20" row="3"><s:property
									value="e.ordership.remark" /></textarea>
						</div>
					</td>
				</tr>
				<tr>
					<td colspan="2"><s:submit type="button" method="saveNotes"
							onclick="return onSubmit(this);" value="确认"
							cssClass="btn btn-primary" /> <input id="cancelNotesBtn"
						type="button" value="取消" class="btn" /></td>
				</tr>
			</table>
		</div>
		<div id="updatePayMoneryDiv" style="display: none;">
			<table class="table">
				<tr>
					<td colspan="2">
						<h4>修改订单总金额</h4>
					</td>
				</tr>
				<tr>
					<td>支付金额</td>
					<td><input name="e.amount"></td>
				</tr>
				<tr>
					<td>备注</td>
					<td>
						<div class="controls">
							<input name="e.updatePayMoneryRemark" placeholder="修改订单金额备注">
						</div>
					</td>
				</tr>
				<tr>
					<td colspan="2">
					<s:submit type="button"
							method="updatePayMonery"
							onclick="javascript:return confirm('确认本次操作?');" value="确认"
							cssClass="btn btn-primary" /> <input
						id="cancelUpdatePayMoneryBtn" type="button" value="取消" class="btn" />
					</td>
				</tr>
			</table>
		</div>

		<div id="tabs">
			<ul>
				<li><a href="#tabs-1">订单信息</a></li>
				<li><a href="#tabs-2">订单日志</li>
				<!-- 	        <span style="float:right;padding:10px;">下单入口：${e.orderFrom}&nbsp;&nbsp;gzid：${not empty e.gzid?(e.gzid):("暂无") }</span> -->
			</ul>
			<div id="tabs-1">
				<s:if test="e.refundStatusStr!=null and e.refundStatusStr!=''">
					<div class="alert alert-danger" style="margin-bottom: 2px;">
						<strong>退款状态：</strong>
						<s:property value="e.refundStatusStr" />
						(
						<s:property value="e.refundStatus" />
						) <br>

					</div>
				</s:if>

				<div class="alert alert-info" style="margin-bottom: 2px;">
					<strong>订单信息（${e.payType==3?('货到付款'):('在线支付')}）</strong>
					<s:if test="e.score>0">
						<span class="badge badge-success" style="margin-left: 20px;">赠送<s:property
								value="e.score" />个积分点
						</span>
					</s:if>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<s:if test="e.amountExchangeScore>0">
						<span class="badge badge-default" style="margin-left: 20px;">消耗掉会员<s:property
								value="e.amountExchangeScore" />个积分点
						</span>
					</s:if>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<s:if test="e.hasGift">
						<span class="badge badge-success" style="margin-left: 20px;">【订单含赠品】</span>
					</s:if>


				 <span style="float: right;">
					 <s:if test="e.status=='sure'"> 
						<input type="button" id="addPayBtn" onclick="return addPayFunc(this);" value="添加回款记录" class="btn btn-warning" /> 
					 </s:if>
				 	 <s:if test="e.status=='sure' || (e.status=='pass'   && (e.cutMoney=='' ||e.cutMoney==0))"> 
						<input type="button" id="addPayBtn" onclick="cancelOrder(${e.id});"   value="取消订单" class="btn btn-warning" /> 
					 </s:if>
					 <a class="btn" href="/manage/order!selectOrdership.action?orderid=<s:property value="e.id" />">修改收货人配送信息</a>
					 <input type="button" id="addNotesBtn" onclick="return addNotesyFunc(this);" value="添加订单备注" class="btn success" />
				 </span>
					<a class="btn btn-default btn-sm" href="order!selectList.action">返回</a>
				</div>
				<table class="table table-bordered">
					<tr>
						<td colspan="10">订单号：<b>
							<s:property value="e.orderNo" /> </b>
							<!--<s:if test="e.paydate!=null and e.paydate!=''">
								<span style="float: right;">付款时间：${fn:substring(e.paydate,0,16)}</span>
								<span style="float: right;width:20px;"></span>
							</s:if>-->
							<span style="float: right;">创建时间：${fn:substring(e.createdate,0,16)}&nbsp;&nbsp;&nbsp;</span>
						</td>
					</tr>
					<tr>
						<th>&nbsp;ID</th>
						<th>数量</th>
						<th>订单状态</th>
						<th>支付状态</th>
						<th>订单总金额</th>
						<s:if test="e.paydate!=null and e.paydate!=''">
							<th>商品扣款明细</th>
						</s:if>
					<!--<th>总配送费</th>
						 					<th>支付方式</th> -->
						<!-- 					<th>订单备注</th> -->
						<th>下单人信息</th>
						<th>收货人信息</th>
					</tr>

					<tr>
						<td>&nbsp;<s:property value="e.id" /></td>
						<td>&nbsp;<s:property value="e.quantity" /></td>
						<td>
							<s:if test="e.status.equals(\"sign\") or e.status.equals(\"file\")">
									<span class="badge badge-success">
									<s:property value="e.statusStr" /></span>
								</s:if> 
								<s:else>
									<span class="badge badge-important">
									<s:property value="e.statusStr" /></span>
								</s:else>
						</td>
						<td><s:if test="e.paystatus.equals(\"y\")">
								<span class="badge badge-success"><s:property
										value="e.paystatusStr" /></span>
							</s:if> <s:else>
								<span class="badge badge-important"><s:property
										value="e.paystatusStr" /></span>
							</s:else></td>
						<td>&nbsp;<span><s:property
									value="e.amount" /></span> <s:if test="e.updateAmount.equals(\"y\")">
								<font color="red">【修】</font>
							</s:if>
						</td>
						<s:if test="e.paydate!=null and e.paydate!=''">
						<td>
								<!--<s:if test="e.imagesPath!=null and e.imagesPath!=''">
									<div>
										<div>打款金额：<span class="simpleOrderReport">￥<s:property value="e.cutMoney" /></span></div>
										<div>保留积分(客户)：${e.isSaveScore=='1'?'保留':'不保留'}</div>
										<s:if test="e.status!='sure'">
											<div>保留积分(最终)：${e.isSaveScoreFinal=='1'?'保留':'不保留'}</div>
										</s:if>
										<div>返利额度：${e.reurnScore}</div>
									</div>
								</s:if> 
								<s:if test="e.cutScorePoint!=0">
										<div>扣除消费积分：${e.cutScorePoint}</div>
								</s:if>
								<s:if test="e.cutScore-e.cutScorePoint!=0">
										<div>扣除消费券：${e.cutScore-e.cutScorePoint}</div>
								</s:if>
								-->
								<s:if test="e.cutPointFree!=0">
										<div>扣消费积分：${e.cutPointFree}</div>
								</s:if>
								<s:if test="e.cutShopFree!=0">
									<div>
										<div>扣消费钱包：${e.cutShopFree}</div>
									</div>
								</s:if>
							</td>
							</s:if>
						<!-- <td>&nbsp;<s:property value="e.fee" /></td> -->

						<td>
							下单人姓名：<s:property value="e.nickname" /><br>
							下单人手机：<s:property value="e.orderMobile" /><br>
						</td>
						<td>
							姓名：<s:property value="e.ordership.shipname" /><br>
							手机：<s:property value="e.ordership.phone" /><br> 
							<!-- 			性别：<s:property value="e.ordership.sex" /><br> --> 
							<!-- 			座机：<s:property value="e.ordership.tel" /><br> -->
							<s:property value="e.ordership.phoneAddress" />
							地址：<s:property value="e.ordership.province" /> <s:property value="e.ordership.city" /> <s:property value="e.ordership.area" />
							<s:property value="e.ordership.shipaddress" /><br> 
							邮编：<s:property value="e.ordership.zip" /><br>
						</td>
					</tr>
					<s:if test="e.imagesPath!=null and e.imagesPath!=''">
						<tr>
							<td colspan="20">打款截图: <img style=" width: 400px;height: 600px;" src="<s:property value="e.imagesPath" />">
						    </td>
						</tr>
					</s:if> 
					<tr>
						<td colspan="20">顾客要求:<s:property
								value="e.otherRequirement" /></td>
					</tr>
					<tr>
						<td colspan="20">后台订单备注:<s:property
								value="e.ordership.remark" /></td>
					</tr>
				</table>

				<div class="alert alert-success" style="margin-bottom: 2px;">
					<strong>订单明细<s:if test="e.lowStocks.equals(\"y\")">
							<font color="red">【缺货】</font>
						</s:if></strong>
				</div>

				<table class="table table-bordered">
					<tr style="background-color: #dff0d8">
						<th width="50px">序号</th>
						<th>商品编号</th>
						<th>商品名称</th>
						<th>供应商</th>
						<th>购买的商品规格</th>
						<th>数量</th>
						<th>单价</th>
						<th>小计</th>
						<th>状态</th>
						<th>发货公司</th>
						<th>物流单号</th>
						<th>操作</th>
					</tr>
					<s:iterator value="e.orderdetail" status="i" var="odetail">
						<tr>
							<td>&nbsp;<s:property value="#i.index+1" /></td>
							<td nowrap="nowrap"><s:a target="_blank"
									style="text-decoration: underline;"
									href="product!toEdit.action?e.id=%{productID}">
									<s:property value="productID" />
								</s:a> <s:if test="lowStocks.equals(\"y\")">
									<font color="red">【缺货】</font>
								</s:if></td>
							<td>
								<a target="_blank" style="text-decoration: underline;"><s:property
										value="productName" /></a> <br> <s:if
									test="giftID!=null and giftID!=''">
									<s:a target="_blank" style="text-decoration: underline;"
										href="gift!show.action?e.id=%{giftID}">
									【查看赠品】
								</s:a>
								</s:if>
							</td>
							<td>
								<s:iterator value="#application.supplierList" var="itemrr">
								  <s:if test="supplierId==id">
								  		供应商: <span><s:property value="name" /></span>
								  </s:if>
								</s:iterator>
							</td>
							<td>&nbsp; <s:property value="specInfo" /> ${'默认规格'}</td>
							<td>&nbsp;<s:property value="number" /></td>
							<td>&nbsp;￥<s:property value="price" /></td>
							<td>&nbsp;￥<s:property value="total0" /></td>
							<td>
								<s:property value="StatusStr" />
							</td>
							<td>
								<c:choose>
									<c:when test="${expressCompanyName!='zt'}"> 
										<a  onclick="queryEx(${id},'${expressCompanyChinaName }','${expressNo}')">
											<s:property value="expressCompanyChinaName" />
										 </a>
									</c:when>
									 <c:otherwise>   
										    	自提
									 </c:otherwise>
								</c:choose>

							</td>
							<td>${expressCompanyChinaName }
								<c:choose>
									<c:when test="${expressCompanyName!='zt'}"> 
										<a href="javascript:;" onclick="queryEx(${id},'${expressCompanyChinaName }','${expressNo}')">
											<s:property value="expressNo" />
										</a>
								</c:when>
									 <c:otherwise>   
										    	${expressCompanyChinaName }
									 </c:otherwise>
								</c:choose>
							</td>
							<td>
								<c:choose>
									<c:when test="${status=='pass'}"> 
										 <a href="order!updateOrderStatus.action?e.id=<s:property value="e.id"/>&e.status=send&e.orderDetailId=<s:property value="id" />" 
										  class="btn btn-small">发货</a>
									 </c:when>
									 
									 <c:when test="${status=='send'}"> 
										 <a href="order!updateOrderStatus.action?e.id=<s:property value="e.id"/>&e.status=sign&e.orderDetailId=<s:property value="id" />"
										 	onclick="return onPassSubmit(this);" class="btn btn-small">顾客已签收</a>
									 </c:when>
									 <c:otherwise>   
									    	无  
									  </c:otherwise> 
								</c:choose>
							</td>
							
							<!--修改信息：<td>
								<a href="/manage/order!viewOrderdetail.action?id=<s:property value="id" />">编辑</a></td> -->
						</tr>
					</s:iterator>
				</table>

				<div class="alert alert-success" style="margin-bottom: 2px;display:none">
					<strong>订单支付记录</strong>
				</div>
				<table class="table table-bordered" style="display:none">
					<tr>
						<th width="50px">序号</th>
						<th nowrap="nowrap">支付ID</th>
						<th nowrap="nowrap">支付方式</th>
						<th nowrap="nowrap">支付金额</th>
						<th nowrap="nowrap">支付时间</th>
						<th nowrap="nowrap">支付状态</th>
						<th nowrap="nowrap">交易号</th>
						<th nowrap="nowrap">备注</th>
					</tr>
					<s:iterator value="e.orderpayList" status="i" var="orderpay">
						<tr>
							<td>&nbsp;<s:property value="#i.index+1" /></td>
							<td>&nbsp;<s:property value="id" /></td>
							<td><s:if test="paymethod.equals(\"alipayescow\")">
								支付宝
							</s:if> <s:elseif test="paymethod.equals(\"weixin\")">
								微信支付
							</s:elseif> <s:elseif test="paymethod.equals(\"ticket\")">
								认种卷
							</s:elseif> <s:elseif test="paymethod.equals(\"money\")">
								现金劵
							</s:elseif></td>
							<td>&nbsp;<s:property value="payamount" /></td>
							<td>&nbsp;<s:property value="createtime" /></td>
							<td><s:if test="paystatus.equals(\"n\")">
									<%=KeyValueHelper.get("orderpay_paystatus_n")%>
								</s:if> <s:elseif test="paystatus.equals(\"y\")">
									<span class="badge badge-success"><%=KeyValueHelper.get("orderpay_paystatus_y")%></span>
								</s:elseif></td>
							<td>&nbsp;<s:property value="tradeNo" /></td>
							<td>&nbsp;<s:property value="remark" /></td>
						</tr>
					</s:iterator>
				</table>

			</div>



			<div id="tabs-2">
				<table class="table table-bordered">
					<tr style="background-color: #dff0d8">
						<th width="50px">序号</th>
						<th>操作人</th>
						<th>操作人类型</th>
						<th>时间</th>
						<th>日志</th>
					</tr>
					<s:iterator value="e.orderlogs" status="i" var="orderlog">
						<tr>
							<td>&nbsp;<s:property value="#i.index+1" /></td>
							<td nowrap="nowrap">&nbsp; <s:if
									test="accountType.equals(\"w\")">
									<s:a target="_blank"
										href="account!show.action?account=%{account}">
										<s:property value="account" />
									</s:a>
								</s:if> <s:elseif test="accountType.equals(\"m\")">
									<s:a target="_blank" href="user!show.action?account=%{account}">
										<s:property value="account" />
									</s:a>
								</s:elseif> <s:elseif test="accountType.equals(\"p\")">
								第三方支付系统
							</s:elseif> <s:else>
								未知
							</s:else>
							</td>
							<td>&nbsp; <s:if test="accountType.equals(\"w\")">
								客户
							</s:if> <s:elseif test="accountType.equals(\"m\")">
									<%=SystemManager.systemSetting.getSystemCode() %>(系统)
							</s:elseif> <s:elseif test="accountType.equals(\"p\")">
								${e.payType==1?'支付宝':e.payType==2?'微信':'其它' }
							</s:elseif> <s:else>
								未知
							</s:else>
							</td>
							<td>&nbsp;<s:property value="createdate" /></td>
							<td>&nbsp;<s:property value="content" /></td>
						</tr>
					</s:iterator>
				</table>
			</div>
		</div>
	</s:form>

	<%-- <link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resource/jquery-easyui-1.3.4/themes/default/easyui.css"> --%>
	<%-- <link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resource/jquery-easyui-1.3.4/themes/icon.css"> --%>
	<%-- <link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resource/jquery-easyui-1.3.4/demo/demo.css"> --%>
	<%-- <script type="text/javascript" src="<%=request.getContextPath() %>/resource/jquery-easyui-1.3.4/jquery.min.js"></script> --%>
	<%-- <script type="text/javascript" src="<%=request.getContextPath() %>/resource/jquery-easyui-1.3.4/jquery.easyui.min.js"></script> --%>

	<script
		src="<%=request.getContextPath() %>/resource/jquery-jquery-ui/jquery-1.5.1.js"></script>
	<script
		src="<%=request.getContextPath() %>/resource/jquery-jquery-ui/ui/jquery.ui.core.js"></script>
	<script
		src="<%=request.getContextPath() %>/resource/jquery-jquery-ui/ui/jquery.ui.widget.js"></script>
	<script
		src="<%=request.getContextPath() %>/resource/jquery-jquery-ui/ui/jquery.ui.tabs.js"></script>



	<script>
$(function() {
	$( "#tabs" ).tabs({
		//event: "mouseover"
	});
	$("#cancelPayBtn").click(function(){
		$("#addPayDiv").slideUp();
		$("#addPayBtn").show();
		//$("#buttons").find("input[type=button]").each(function(){
			//$(this).attr("disabled","");
		//});
		return false;
	});
	$("#cancelNotesBtn").click(function(){
		$("#addNotesDiv").slideUp();
		$("#addNotesBtn").show();
		
		return false;
	});
	$("#cancelUpdatePayMoneryBtn").click(function(){
		$("#updatePayMoneryDiv").slideUp();
		$("#updatePayMoneryBtn").show();
		return false;
	});
});
function addPayFunc(){
	$("#addPayDiv").slideDown();
	$("#addPayBtn").hide();
	//$("#buttons").find("input[type=button]").each(function(){
		//$(this).attr("disabled","disabled");
	//});
	return false;
}

function returnBack(){
	window.href="order!selectList.action";
	return false;
}

function cancelOrder(value){
	doCancelOrder(value,function(data){
		self.location="/manage/order!toEdit.action?e.id="+value;
	})
}
function addNotesyFunc(){
$("#addNotesDiv").slideDown();
	$("#addNotesBtn").hide();
	//$("#buttons").find("input[type=button]").each(function(){
		//$(this).attr("disabled","disabled");
	//});
	return false;

}
function updatePayMoneryFunc(){
	$("#updatePayMoneryDiv").slideDown();
	$("#updatePayMoneryBtn").hide();
	return false;
}

function confirmPayMoney(obj,tip){
		console.log("submitIDs...");
		if(confirm(tip)){
			var _form = $("form");
			_form.attr("action",$(obj).attr("method"));
			_form.submit();
		}
		return false;
}

function onSubmit(obj){
	if($(obj).attr("disabled")=='disabled'){
		alert("disabled不可点击");
		return false;
	}
	var cRes=confirm("确认本次操作(请不要重复提交次操作)?");
	return cRes;
}

function onPassSubmit(obj){
	
	if($(obj).attr("disabled")=='disabled'){
		return false;
	}
	var expressCompanyName=$("#expressCompanyName").val();
	

	$(obj).attr("href",$(obj).attr("href")+"&expressCompanyName="+expressCompanyName);
	
	return confirm("确认本次操作?");
}
 
</script>
</body>
</html>
