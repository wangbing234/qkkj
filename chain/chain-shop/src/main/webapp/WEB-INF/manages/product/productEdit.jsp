<%@page import="net.onlineshop.services.manage.catalog.bean.Catalog"%>
<%@page import="java.util.List"%>
<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="/resource/common_html_meat.jsp"%>
<%@ include file="/WEB-INF/manages/system/common.jsp"%>
<%@ include file="/resource/common_html_validator.jsp"%>

<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/jquery-jquery-ui/themes/base/jquery.ui.all.css">
<link rel="stylesheet"
	href="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/themes/default/default.css" />
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resource/My97DatePicker/WdatePicker.js"></script>
<style>
#insertOrUpdateMsg {
	border: 0px solid #aaa;
	margin: 0px;
	position: fixed;
	top: 0;
	width: 100%;
	background-color: #d1d1d1;
	display: none;
	height: 30px;
	z-index: 9999;
	font-size: 18px;
	color: red;
}
</style>
<script type="text/javascript">
jQuery(document).ready(function(){

<c:if test="${not empty e.taourl}">
 jQuery("#transport").show();
</c:if>
 	jQuery(":radio[id=transportId]").click(function(){
	    var trans_type=jQuery(this).val();
	    if(trans_type==0){
	     jQuery("#transport").hide();
	     jQuery(".tcbox").attr("checked",false);
	    }else{
	     jQuery("#transport").show();
	    }
   });
  });
</script>
</head>

<body>
	<s:form action="product" id="form" name="form" namespace="/manage"
		theme="simple" enctype="multipart/form-data" method="post">

		<div class="navbar navbar-inverse">
			<div id="insertOrUpdateMsg">
				<s:property value="#session.insertOrUpdateMsg" />
				<%request.getSession().setAttribute("insertOrUpdateMsg", "");//列表页面进行编辑文章的时候,需要清空信息 %>
			</div>
		</div>

		<span id="pifeSpan" class="input-group-addon" style="display: none"><%=SystemManager.systemSetting.getImageRootPath()%></span>
		<input type="hidden" value="<s:property value="e.id"/>" id="productID" />
		<input type="hidden" value="<s:property value="e.catalogID"/>" id="catalogID" />

		<div style="text-align: center;">
			<div id="updateMsg">
				<font color='red'><s:property value="updateMsg" /></font>
			</div>
			<s:if test="e.id=='' or e.id==null">
				<button method="product!insert.action" class="btn btn-success">
					<i class="icon-ok icon-white"></i> 新增
				</button>
			</s:if>
			<s:else>
				<s:if test="e.draft==true">
			（<font color="red">草稿</font>）
			</s:if>
				商品ID：<span class="badge badge-success"><s:property value="e.id" /></span>
			<%-- 	<s:if test="e.activityID!=null">
					活动ID：<span class="badge badge-success"><s:property
							value="e.activityID" /></span>
				</s:if>
								<s:submit method="update" value="保存" cssClass="btn btn-primary"/> --%>
				<button method="product!update.action" class="btn btn-success">
					<i class="icon-ok icon-white"></i> 保存
				</button>
				<s:if test="e.draft!=true">
					<s:if test="e.status!=2">
						<s:a method="updateUpProduct" cssClass="btn btn-warning" onclick="return confirm(\"确定上架商品吗?\");">
							<s:param name="e.id" value="e.id" />
							<i class="icon-arrow-up icon-white"></i> 上架
					</s:a>
					</s:if>

					<s:else>
						<s:a method="updateDownProduct" cssClass="btn btn-warning" onclick="return confirm(\"确定下架商品吗?\");">
							<s:param name="e.id" value="e.id" />
							<i class="icon-arrow-down icon-white"></i> 下架
					</s:a>
					</s:else>
					
				</s:if>


				<!--<a href="javascript:void(0);"
					onclick="toCache('/freemarker!create.action?method=staticProductByID&id=<s:property value="e.id"/>')"
					class="btn btn-warning"> <i class="icon-refresh icon-white"></i>
					静态化
				</a>
			 		<a class="btn btn-info" target="_blank"
					href="/product/<s:property value="e.id"/>.html"> <i
					class="icon-eye-open icon-white"></i> 查看
				</a>-->


				<!-- <font color="red">&nbsp;注:请确保商品已经[静态化]，才可正常[查看]或者[上架]</font>-->
			</s:else>

			<a class="btn btn-default btn-sm" href="product!selectList.action?init=y">返回列表</a>
		</div>

		<div id="tabs">
			<ul>
				<li><a href="#tabs-1">基本信息</a></li>
				<li><a href="#tabs-3">商品图片</a></li>
				<li><a href="#tabs-4">商品参数</a></li>
				<!-- <li><a href="#tabs-5">商品属性</a></li> -->
				<li><a href="#tabs-6">商品库存</a></li>
				<!-- <li><a href="#tabs-7">绑定商品赠品</a></li> -->
			</ul>
			<div id="tabs-1">
				<table class="table table-condensed">
					<tr style="display: none;">
						<td>id</td>
						<td><s:hidden name="e.id" label="id" id="id" /></td>
						<td>&nbsp;</td>
						<td>&nbsp;</td>
					</tr>
					<tr>
						<td style="text-align: right; width: 150px;">名称</td>
						<td style="text-align: left;" colspan="1"><s:textfield
								name="e.name" data-rule="商品名称;required;name;length[0~44];"
								size="44" maxlength="44" style="width: 80%;" id="name" /></td>
								
									<td style="text-align: right;" nowrap="nowrap">页面标题</td>
						<td style="text-align: left;" colspan="3"><s:textfield
								type="text" name="e.title" maxlength="300" size="300"
								style="width: 80%;" /></td>
					</tr>

					 <tr>
						<td style="text-align: right;">商品编码</td>
						<td style="text-align: left;" colspan="1"><s:textfield
								name="e.shortname"
								data-rule="商品短名;required;shortname;length[2~20];" size="7"
								maxlength="20" style="width: 80%;" id="shortname" /></td>
						<td style="text-align: right;">供应商</td>
						<td style="text-align: left;" colspan="1">
						<input type="hidden" value="<s:property value="e.supplierId"/>" id="supplierId" />
					 			 <select  name="e.supplierId" id="supplierIdSelect">
								  <option value="">请选择</option>
									<s:iterator value="#application.supplierList" var="item">
										<option value="<s:property value="id"/>">
											<s:property value="name"/>
										</option>
									</s:iterator>
								</select> 
					 			
						 </td>
					</tr>
					<!--<tr>
						<td style="text-align: right;" nowrap="nowrap">描述</td>
						<td style="text-align: left;" colspan="3"><s:textarea
								name="e.introduce" id="introtuce" style="width: 80%;"></s:textarea>

						</td>
					</tr> -->

					<tr>
						<td style="text-align: right;">商品分类</td>
						<td> 
						<%application.setAttribute("catalogs", SystemManager.catalogs);%>
						 <select onchange="catalogChange(this)" name="e.catalogID" id="catalogSelect">
								<!-- <option value="">请选择</option>  -->
								<s:iterator value="#application.catalogs" var="item">
									<s:iterator value="children">
										<option value="<s:property value="id"/>">
											<s:property value="name" />
										</option>
									</s:iterator>
								</s:iterator>
						</select> 
						</td>
						<td style="text-align: right;" >发货周期(天)</td>
						<td style="text-align: left;">
						<s:textfield  name="e.maxPicture"  data-rule="定价;price;" size="10" maxlength="10"  /></td>
						
						<td style="text-align: right;display: none" >是否推荐</td>
						<td style="text-align: left;display: none"><s:select
								list="#{'n':'否','y':'是'}" id="istui" name="e.istui"
								listKey="key" listValue="value" /></td>
					</tr>

					<tr>
						<td style="text-align: right;">商品类型</td>
						<td style="text-align: left;">
						<!-- headerKey="" headerValue="全部"  -->
								 <s:select name="e.productType" 
					 list="#application.productTypeList" id="productTypeList" listKey="index" listValue="name" cssClass="input-medium" onchange="productTypeChange(this)"></s:select>
				
						</td>
						 <!--  <td style="text-align: right;" id="pointLab"> 返利额度</td>
							 <td id="pointText"> 
								<s:textfield  name="e.point"  data-rule="定价;price;" size="10" maxlength="10"  />
							</td> --> 
					</tr>

					<tr>
						<td style="text-align: right;">主图</td>
						<td style="text-align: left;" colspan="3">
						<input type="button" name="filemanager" value="浏览 图片" class="btn btn-success" />&nbsp;
						<input type="button" class="btn btn-success" id="J_selectImage" value="我要上传" /> 
						<s:textfield type="text" id="picture" name="e.picture" ccc="imagesInput" style="width: 600px;" data-rule="小图;required;maxPicture;" />
							<s:if test="e.picture!=null and e.picture!=''">
								<a target="_blank" href="<%=SystemManager.systemSetting.getImageRootPath()%><s:property value="e.picture" />">
									<img style="max-width: 50px; max-height: 50px;" alt="" src="<%=SystemManager.systemSetting.getImageRootPath()%>
									<s:property value="e.picture" />">
								</a>
							</s:if> <font color="red"> 图片规格 :大于等于400*400的正方形图片</font></td>
					</tr>
					<tr>
						<td style="text-align: right;">原价</td>
						<td style="text-align: left;"><s:textfield name="e.price"
								data-rule="定价;required;price;" size="10" maxlength="10"
								id="price" /></td>
						<td style="text-align: right;">现价</td>
						<td style="text-align: left;"><s:textfield name="e.nowPrice"
								data-rule="现价;required;nowPrice;" size="10" maxlength="10"
								id="nowPrice" /></td>
					</tr>
					<tr>

						<td style="text-align: right;">销量</td>
						<td style="text-align: left;"><s:textfield name="e.sellcount"
								data-rule="销量;required;integer;sellcount;" id="sellcount" /></td>
						<td style="text-align: right;">库存</td>
						<td style="text-align: left;">${e.stock}<font color="red">(根据相应数量规格自动统计)</font></td>
					</tr>
					<!-- 
					<tr>
						<td style="text-align: right;">是否新品</td>
						<td style="text-align: left;"><s:select
								list="#{'n':'否','y':'是'}" id="isnew" name="e.isnew"
								listKey="key" listValue="value" /></td>
						<td style="text-align: right;">是否特价</td>
						<td style="text-align: left;"><s:select
								list="#{'n':'否','y':'是'}" id="pid" name="e.sale" listKey="key"
								listValue="value" /></td>
					</tr>
-->
					<tr>
						<td style="text-align: right;">是否秒杀</td>
						<td style="text-align: left;"><s:select
								list="#{'n':'否','y':'是'}" id="ismiao" name="e.ismiao"
								listKey="key" listValue="value" /></td>
						<td style="text-align: right;">秒杀价</td>
						<td style="text-align: left;"><s:textfield name="e.miaoPrice"
								size="10" maxlength="10" id="miaoPrice" /></td>

					</tr>
					<tr>
						<td style="text-align: right;">开始时间</td>
						<td style="text-align: left;"><input id="d4311"
							class="Wdate search-query " type="text" name="e.miaoSta"
							value="${fn:substring(e.miaoSta,0,10) }"
							onFocus="WdatePicker({maxDate:'#F{$dp.$D(\'d4312\')||\'2025-10-01\'}'})" />

						</td>
						<td style="text-align: right;">结束时间</td>
						<td style="text-align: left;"><input id="d4312"
							class="Wdate search-query" type="text" name="e.miaoEnd"
							value="${fn:substring(e.miaoEnd,0,10) }"
							onFocus="WdatePicker({minDate:'#F{$dp.$D(\'d4311\')}',maxDate:'2025-10-01'})" />
						</td>
					</tr> 


					<tr style="display: none">
						<td style="text-align: right;">商品运费</td>
						<td colspan="3"><input name="transportId" type="radio"
							value="0"
							<c:if test="${empty e.taourl }">     checked="checked" </c:if>
							id="transportId"> 卖家包邮 <input name="transportId"
							type="radio" value="1"
							<c:if test="${not empty e.taourl }"> checked="checked"</c:if>
							id="transportId"> 买家承担 <br />
							<div style="display: none; border: #ccc 1px solid; padding: 5px;" id="transport">
								<p>选择物流模板：</p>
								<c:forEach items="${transportList}" var="transt">
 										<input name="e.taourl" type="radio" class="tcbox" value="${transt.id }"
										<c:if test="${e.taourl==transt.id }"> checked="checked" </c:if> />${transt.trans_name}
								</c:forEach>
								<c:if test="${empty transportList}">
									<p style="padding-left: 5px; padding-top: 5px">
										您还没设置物流模板<a href="/manage/transport!toAdd.action">[设置物流模板]</a>
									</p>
								</c:if>
							</div></td>
					</tr>
				<!-- 	<tr>
						<td style="text-align: right;" nowrap="nowrap">商品关键字<br />
						<font color="red">多个以逗号隔开</font></td>
						<td style="text-align: left;" colspan="3"><s:textfield
								type="text" name="e.keywords" id="keywords"
								data-rule="商品关键字;required;keywords;length[0~300];"
								maxlength="300" size="300" style="width: 80%;" /></td>
					</tr> -->

					<tr>
						<td style="text-align: right;">商品介绍</td>
						<td colspan="3"><s:textarea
								data-rule="商品介绍;required;productHTML;" id="productHTML"
								name="e.productHTML"
								style="width:100%;height:500px;visibility:hidden;"></s:textarea>
						</td>
					</tr>
					
					<tr style="display: none">
						<td style="text-align: right;" nowrap="nowrap">页面描述</td>
						<td style="text-align: left;" colspan="3"><s:textfield
								type="text" name="e.description" maxlength="300" size="300"
								style="width: 80%;" /></td>
					</tr>
 
					<tr>
						<td style="text-align: right;" nowrap="nowrap">其他信息</td>
						<td style="text-align: left;" colspan="3">录入人：<a
							style="text-decoration: underline;" target="_blank"
							href="user!show?account=<s:property value="e.createAccount"/>"><s:property
									value="e.createAccount" /></a> 录入时间：<s:property
								value="e.createtime" /><br> 最后修改人：<a
							style="text-decoration: underline;" target="_blank"
							href="user!show?account=<s:property value="e.createAccount"/>"><s:property
									value="e.updateAccount" /></a> 最后修改时间：<s:property
								value="e.updatetime" />
						</td>
					</tr>
				</table>
			</div>
			<!-- 			<div id="tabs-2"> -->

			<!-- 			</div> -->
			<div id="tabs-3">
				<div>
					<h4>
						<div class="alert alert-info">图片列表</div>
					</h4>
					<font color="red"> 图片规格 :大于等于400*400的正方形图片</font>
					<table class="table table-bordered">
						<tr>
							<td colspan="11"><input style="display: none;"
								onclick="addTrFunc();" value="添加" class="btn btn-warning"
								type="button" /> <%-- <s:submit method="deleteImageByImgPaths" onclick="return deleteImageByImgPaths();"
											value="删除" cssClass="btn btn-primary"/> --%>

								<button method="product!deleteImageByImgPaths.action"
									class="btn btn-danger"
									onclick="return deleteImageByImgPaths();">
									<i class="icon-remove-sign icon-white"></i>删除
								</button></td>
						</tr>
						<tr style="background-color: #dff0d8">
							<th width="20"><input type="checkbox" id="firstCheckbox" /></th>
							<th>图片地址</th>
						</tr>
						<s:iterator value="e.imagesList" var="img">
							<tr>
								<td><input type="checkbox" name="imagePaths"
									value="<s:property value="img"/>" /></td>
								<td><a
									href="<%=SystemManager.systemSetting.getImageRootPath()%><s:property value="img"/>"
									target="_blank"> <img
										style="max-width: 100px; max-height: 100px;" alt=""
										src="<%=SystemManager.systemSetting.getImageRootPath()%><s:property value="img"/>">

								</a></td>
							</tr>
						</s:iterator>
					</table>
				</div>
				<br>
				<table class="table table-bordered">
					<tr style="background-color: #dff0d8">
						<td>文件</td>
					</tr>
					<tr id="firstTr">
						<td>
							<%for(int i=0;i<5;i++){ %>
							<div>
								<input type="button" name="filemanager" value="浏览图片"
									class="btn btn-warning" /> <input type="text" ccc="imagesInput"
									name="e.images" style="width: 60%;" /> <span class="imgdiv"></span>
							</div> <%} %>
						</td>
					</tr>
				</table>
			</div>
			<!-- 商品参数 -->
			<div id="tabs-4">
				<table class="table">
					<s:iterator value="e.parameterList" var="item">
						<tr>
							<th style="display: none;"><s:hidden name="id" /></th>
							<th style="text-align: right;"><s:property value="name" /></th>
							<th><s:textfield name="parameterValue" /></th>
						</tr>
					</s:iterator>
				</table>
			</div>

			<!-- 商品属性 -->
			<div id="tabs-5">
				<table class="table table-bordered">
					<s:iterator value="e.attrList" var="item">
						<tr>
							<td nowrap="nowrap" style="text-align: right;"><s:property
									value="name" /></td>
							<td><s:select list="attrList" id="attrSelectIds"
									name="e.attrSelectIds" value="selectedID" headerKey=""
									headerValue="--请选择--" listKey="id" listValue="name" /></td>
						</tr>
					</s:iterator>
				</table>
			</div>

			<!-- 商品规格 -->
			<div id="tabs-6">

				<!-- <input onclick="addtr()" type="button" value="增加5行" style="float:right;" class="btn"> -->
				<table class="table" id="spertable">
					<tr>
						<th style="display: none;">id</th>
						<th style="display:none">品质</th>
						<th style="display:none">规格</th>
						<th>库存数</th>
						 <th style="display:none">价格</th>
						<th style="display:none">是否显示</th>
					</tr>
					<s:if test="e.specList!=null and 1==1">
						<s:iterator value="e.specList" var="item" status="stat">
							<tr>
								<th style="display: none;"><s:hidden name="e.specList[%{#stat.index}].id" /></th>
								<th style="display:none"><s:textfield cssStyle="display:none"
										name="e.specList[%{#stat.index}].specColor"
										cssClass="search-query input-small" /></th>
								<th style="display:none"><s:textfield name="e.specList[%{#stat.index}].specSize" cssStyle="display:none"
										cssClass="search-query input-small" /></th>
								<th><s:textfield
										name="e.specList[%{#stat.index}].specStock"
										cssClass="search-query input-small" /></th>
								<th style="display:none"><s:textfield name="e.specList[%{#stat.index}].specPrice"   cssClass="search-query input-small"/></th> 
								<th style="display:none">
									<s:select name="e.specList[%{#stat.index}].specStatus" value="y"
										list="#{'y':'显示','n':'不显示'}"  
										cssClass="search-query input-small" /></th>

							</tr>
						</s:iterator>
					</s:if>
					<s:else>
						<tr>
							<th style="display: none;"><s:hidden name="id" /></th>
						   	<th style="display:none"><s:textfield name="e.specList[0].specSize" cssClass="search-query input-small" /></th>
							<th style="display:none"><s:textfield name="e.specList[0].specColor" cssClass="search-query input-small" /></th> 
							<th><s:textfield name="e.specList[0].specStock" cssClass="search-query input-small" /></th>
							<th style="display:none"><s:textfield name="e.specList[0].specPrice" cssClass="search-query input-small"  /></th> 
							<th style="display:none"><input type="button" name="filemanager" value="浏览图片" style="display:none" class="btn btn-warning" />
							 <s:textfield ccc="imagesInput" name="e.specList[0].picurl" style="width:200px" />
							<div class="imgdiv"></div></th>
							<th style="display:none">
							<s:select name="e.specList[0].specStatus" cssStyle="display:none" list="#{'y':'显示','n':'不显示'}" cssClass="search-query input-small" /></th>
						</tr>
					</s:else>
				</table>
			</div>


		</div>
	</s:form>

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
	//alert($("#insertOrUpdateMsg").html());
	if($("#insertOrUpdateMsg").html()!='' && $("#insertOrUpdateMsg").html().trim().length>0){
		$("#insertOrUpdateMsg").slideDown(1000).delay(1500).slideUp(1000);
	}
	
	selectDefaultCatalog();
	
	$("#removePife").click(function(){
		clearRootImagePath();
	});
	
	$("#productTypeList").change();
});
//删除图片主路径
function clearRootImagePath(picInput){
	var _pifeSpan = $("#pifeSpan").text();
	var _imgVal = picInput.val();
	console.log("1===>_imgVal = "+_imgVal);
	picInput.val(_imgVal.substring(_imgVal.indexOf("/attached/")));
}
function deleteImageByImgPaths(){
	if ($("input:checked").size() == 0) {
		alert("请选择要删除的图片！");
		return false;
	}
	return confirm("确定删除选择的图片吗?");
}

function selectDefaultCatalog(){
	var _catalogID = $("#catalogID").val();
	var _supplierId = $("#supplierId").val();
	if(_catalogID!='' && _catalogID>0){
		$("#catalogSelect").val(_catalogID);
	}
	
	if(_supplierId){
		$("#supplierIdSelect").val(_supplierId);
	}
}

function productTypeChange(obj){
	var _val= $(obj).find("option:selected").val();
	if(_val=="38" || _val=="31")
		{
			$("#pointText").show();
			$("#pointLab").show();
		}
	else
		{
			$("#pointText").hide();
			$("#pointLab").hide();
		}
	
}

function catalogChange(obj){
	var _pid = $(obj).find("option:selected").attr("pid");
	if(_pid==0){
		alert("不能选择大类!");
		selectDefaultCatalog();
		return false;
	}
	var _productID = $("#productID").val();
	if($("#name").val()==""){
	alert("请先输入商品名称");
			$("#catalogSelect").val("");
	return false;
	}
        if(_productID==""){
        		document.form.action = "/manage/product!updateProductCatalog.action?e.id="+_productID+"&chanageCatalog=true&catalog="+$(obj).val();
				document.form.submit();
        }else{
					if(confirm("修改商品类别会清空该商品的属性和参数，确认要这样做吗？")){
						$.blockUI({ message: "正在切换商品目录，请稍候...",css: { 
				            border: 'none', 
				            padding: '15px', 
				            backgroundColor: '#000', 
				            '-webkit-border-radius': '10px', 
				            '-moz-border-radius': '10px', 
				            opacity: .5, 
				            color: '#fff' 
				        }});
						document.form.action = "/manage/product!updateProductCatalog.action?e.id="+_productID+"&chanageCatalog=true&catalog="+$(obj).val();
						document.form.submit();
					}else{
						selectDefaultCatalog();
					}
	}
        
}

function addtr(){
var trlen=$("#spertable").find("tr").length-1;
for(i=0;i<5;i++){
	var arrayObj = new Array();
arrayObj.push('<tr>');
							 arrayObj.push('<th style="display: none;"><input type="text" name="e.specList['+(trlen+i)+'].id"  value="" id="form_e_specList_0__id" /></th>');
								arrayObj.push('<th><input type="text" name="e.specList['+(trlen+i)+'].specColor"  value="" class="search-query input-small" id="form_e_specList_'+(trlen+i)+'__specColor"/></th>');
							    arrayObj.push('<th><input type="text" name="e.specList['+(trlen+i)+'].specSize" value="" class="search-query input-small" id="form_e_specList_'+(trlen+i)+'__specSize"/></th>');
								arrayObj.push('<th><input type="text" name="e.specList['+(trlen+i)+'].specStock"  value="" class="search-query input-small" id="form_e_specList_'+(trlen+i)+'__specStock"/></th>');
								//arrayObj.push('<th><input type="text" name="e.specList['+(trlen+i)+'].specPrice"  value="" class="search-query input-small" id="form_e_specList_'+(trlen+i)+'__specPrice"/></th>');
								arrayObj.push('<th>');
								arrayObj.push('<input type="button" name="filemanager" onclick="showfilemanager(this)" value="浏览图片" class="btn btn-warning"/>');
								arrayObj.push(' <input type="text"  name="e.specList['+(trlen+i)+'].picurl" ccc="imagesInput"  value="" id="form_e_specList_'+(trlen+i)+'__picurl" style="width:200px" />');
								arrayObj.push('<div class="imgdiv"></div>');
								arrayObj.push('</th>');
								arrayObj.push('<th><select name="e.specList['+(trlen+i)+'].specStatus" id="form_e_specList_'+(trlen+i)+'__specStatus" class="search-query input-small"><option value="y">显示</option><option value="n">不显示</option></select></th>');
							arrayObj.push('</tr>');
$("#spertable").append(arrayObj.join("")); 
}




}
function showfilemanager(obj){
		var imagesInputObj = $(obj).parent().children("input[ccc=imagesInput]");
			var imagesdiv = $(obj).parent().children(".imgdiv");
		editor.loadPlugin('filemanager', function() {
			editor.plugin.filemanagerDialog({
				viewType : 'VIEW',
				dirName : 'image',
				clickFn : function(url, title) {
					//K('#picture').val(url);
					//alert(url);
					imagesInputObj.val(url);
					imagesdiv.html("");
					imagesdiv.append('<img src="' +url + '" width="50" >');
					editor.hideDialog();
					clearRootImagePath(imagesInputObj);//$("#picture"));
				}
			});
		});

	

}
</script>

	<script charset="utf-8"
		src="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/kindeditor-min.js"></script>
	<script charset="utf-8"
		src="<%=request.getContextPath() %>/resource/kindeditor-4.1.7/lang/zh_CN.js"></script>
	<script>
	var editor;
	KindEditor.ready(function(K) {
		editor = K.create('textarea[name="e.productHTML"]', {
		
			allowFileManager : true
		});
		K('input[name=getHtml]').click(function(e) {
			alert(editor.html());
		});
		K('input[name=isEmpty]').click(function(e) {
			alert(editor.isEmpty());
		});
		K('input[name=getText]').click(function(e) {
			alert(editor.text());
		});
		K('input[name=selectedHtml]').click(function(e) {
			alert(editor.selectedHtml());
		});
		K('input[name=setHtml]').click(function(e) {
			editor.html('<h3>Hello KindEditor</h3>');
		});
		K('input[name=setText]').click(function(e) {
			editor.text('<h3>Hello KindEditor</h3>');
		});
		K('input[name=insertHtml]').click(function(e) {
			editor.insertHtml('<strong>插入HTML</strong>');
		});
		K('input[name=appendHtml]').click(function(e) {
			editor.appendHtml('<strong>添加HTML</strong>');
		});
		K('input[name=clear]').click(function(e) {
			editor.html('');
		});
		var editor1 = K.editor({

					allowFileManager : true
				});
				K('#J_selectImage').click(function() {
					editor1.loadPlugin('multiimage', function() {
						editor1.plugin.multiImageDialog({
							clickFn : function(urlList) {
								var div = K('#J_imageView');
								div.html('');
								K.each(urlList, function(i, data) {
									div.append('<img src="' + data.url + '">');
								});
								editor1.hideDialog();
							}
						});
					});
				});
		
	});
	
	function addTrFunc(){
		var cc = $("#firstTr").clone();
		$("#firstTr").after(cc);
		
		cc.find("a").show();
	}
	
	function removeThis(t){
		$(t).parent().parent().remove();
		return false;
	}
</script>

	<script>
KindEditor.ready(function(K) {
	var editor = K.editor({

	});
	K('input[name=filemanager]').click(function() {
		var imagesInputObj = $(this).parent().children("input[ccc=imagesInput]");
			var imagesdiv = $(this).parent().children(".imgdiv");
		editor.loadPlugin('filemanager', function() {
			editor.plugin.filemanagerDialog({
				viewType : 'VIEW',
				dirName : 'image',
				clickFn : function(url, title) {
					//K('#picture').val(url);
					//alert(url);
					imagesInputObj.val(url);
					imagesdiv.html("");
					imagesdiv.append('<img src="' +url + '" width="50" >');
					editor.hideDialog();
					clearRootImagePath(imagesInputObj);//$("#picture"));
				}
			});
		});
	});
	
});
</script>

	<link rel="stylesheet"
		href="<%=request.getContextPath()%>/resource/uploadify/uploadify.css"
		type="text/css">
	<%-- 	 <script type="text/javascript" src="<%=request.getContextPath() %>/resource/js/jquery-1.9.1.min.js"></script> --%>
	<script type="text/javascript"
		src="<%=request.getContextPath() %>/resource/uploadify/jquery.uploadify.min.js"></script>

	<script type="text/javascript">
	$(document).ready(function() {
	
		ajaxLoadImgList();
		var url = '<%=request.getContextPath() %>/uploadify.do?id='+$("#id").val();
		//alert(url);
		$("#uploadify").uploadify({
			//'auto'           : false,
           'swf'       	 : '<%=request.getContextPath() %>/resource/uploadify/uploadify.swf',
           'uploader'       : url,//后台处理的请求
           'queueID'        : 'fileQueue',//与下面的id对应
           //'queueSizeLimit' :100,
           //'fileTypeDesc'   : 'rar文件或zip文件',
           //'fileTypeExts' 	 : '*.jpg;*.jpg', //控制可上传文件的扩展名，启用本项时需同时声明fileDesc
           //'fileTypeExts'   : '*.rar;*.zip', //控制可上传文件的扩展名，启用本项时需同时声明fileDesc  
           
           
           //'fileTypeDesc' : '图片文件' , //出现在上传对话框中的文件类型描述
//'fileTypeExts' : '*.jpg;*.bmp;*.png;*.gif', //控制可上传文件的扩展名，启用本项时需同时声明filedesc

           'multi'          : true,
           'buttonText'     : '上传',
           
           onUploadSuccess:function(file, data, response){
				//alert("上传成功,data="+data+",file="+file+",response="+response);      
				ajaxLoadImgList();
           },
           onUploadError:function(file, errorCode, errorMsg) {
        	   alert("上传失败,data="+data+",file="+file+",response="+response);   
           }
	 	});
	});
	
	//ajax加载内容图片列表
	function ajaxLoadImgList(){
		if($("#id").val()==''){
			 $("#fileListDiv").html("");
			 return;
		}
		
		 $("#fileListDiv").html("");
		var _url = "/manage/product!ajaxLoadImgList.action?id="+$("#id").val();
		$.ajax({
		  type: 'POST',
		  url: _url,
		  data: {},
		  success: function(data){
			  var _tableHtml = "<table class='table table-bordered' style='border:0px solid red;'>";
				  _tableHtml += "<tr style='background-color: #dff0'>";
				  _tableHtml += "<td>图片地址</td><td>设为默认图片</td><td>操作</td>";
				  _tableHtml += "</tr>";
			  $.each(data,function(i,row){
				  _tableHtml += "<tr>";
				  var str = "<a target='_blank' href='"+row+"'>"+row+"</a>";
				  _tableHtml += "<td>"+str+"</td><td><input type='radio' onclick='setProductImageToDefault(\""+row+"\")' name='abcdef123'/></td><td><input type='button' Class='btn btn-danger' value='删除' onclick='deleteImageByProductID(\""+row+"\")'/></td>";
				  _tableHtml += "</tr>";
				  //$("#fileListDiv").append("<a target='_blank' href='"+row+"'>"+row+"</a><br>");
			  });
			  _tableHtml += "</table>";
			  $("#fileListDiv").append(_tableHtml);
		  },
		  dataType: "json",
		  error:function(){
			alert("加载图片列表失败！");
		  }
		});
	}
	
	//产品图片设置为默认图片
	function setProductImageToDefault(imageUrl){
		var _url = "/manage/product!setProductImageToDefault.action?id="+$("#id").val()+"&imageUrl="+imageUrl;
		$.ajax({
		  type: 'POST',
		  url: _url,
		  data: {},
		  success: function(data){
			  //alert("设置成功!");
			  $("#showMessage").append("设置成功！").fadeTo(2000, 1, function(){
				   //alert("Animation Done.");
				   $("#showMessage").html("").hide();
			  });
		  },
		  dataType: "text",
		  error:function(){
			alert("设置失败！");
		  }
		});
	}
	
	//产品图片设置为默认图片
	function deleteImageByProductID(imageUrl){
		if(!confirm("确定删除选择的记录?")){
			return ;
		}
		var _url = "/manage/product!deleteImageByProductID.action?id="+$("#id").val()+"&imageUrl="+imageUrl;
		$.ajax({
		  type: 'POST',
		  url: _url,
		  data: {},
		  success: function(data){
				  	ajaxLoadImgList();
			  //$("#showMessage").append("删除成功！").fadeTo(2000, 1, function(){
				//   $("#showMessage").html("").hide();
			  //});
			  
		  },
		  dataType: "text",
		  error:function(){
			alert("删除失败！");
		  }
		});
	}
	</script>
</body>
</html>
