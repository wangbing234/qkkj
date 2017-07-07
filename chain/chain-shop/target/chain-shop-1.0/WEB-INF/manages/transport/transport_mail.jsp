<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!--快递 开始-->
<div class="db_box_main">
	<div class="db_box_main_input">
		<label> <input name="trans_express" type="checkbox"
			id="trans_express" value="true"
			<c:if test="${obj.trans_express}"> checked="checked"  </c:if> /> 快递
		</label>
	</div>
	<div class="db_box_main_rdinary" id="trans_express_info"
		<c:if test="${!obj.trans_express}"> style="display:none;"  </c:if>>
		<div class="rdinary_top">
			默认运费： <input name="express_trans_weight" type="text"
				id="express_trans_weight" value='${express_trans_weight}' size="5" />
			件内， <input name="express_trans_fee" type="text"
				id="express_trans_fee" value='${express_trans_fee}' size="8" /> 元，
			每增加 <input name="express_trans_add_weight" type="text"
				id="express_trans_add_weight" value='${express_trans_add_weight}'
				size="5" /> 件，增加运费 <input name="express_trans_add_fee" type="text"
				id="express_trans_add_fee" value='${express_trans_add_fee}' size="8" />
			元
		</div>

		<div class="rdinary_ul"
			<c:if test="${empty express_trans_list }">  style="display:none;" </c:if>
			id="express_trans_city_info">
			<table width="100%" cellpadding="0" cellspacing="0">
				<tr bgcolor="#f5f5f5">
					<td width="46%" align="center"><span class="width1">运送到</span></td>
					<td width="11%"><span class="width2">首件（件）</span></td>
					<td width="13%"><span class="width2">首费（元）</span></td>
					<td width="11%"><span class="width2">续件（件）</span></td>
					<td width="12%"><span class="width2">续费（元）</span></td>
					<td width="7%"><span class="width3">操作</span></td>
				</tr>


				<c:forEach items="${express_trans_list}" var="info" varStatus="vs">
					<c:if test="${vs.index>0 }">
						<tr index="${vs.index}">
							<td><span class="width2"><i> <input
										id="trans_ck_${vs.index}" name="trans_ck_${vs.index}"
										type="checkbox" value="" style="display: none;" />
								</i> <input id="express_city_ids${vs.index}"
									name="express_city_ids${vs.index}" type="hidden"
									value='${info.city_id}' /> <input
									id="express_city_names${vs.index}"
									name="express_city_names${vs.index}" type="hidden"
									value='${info.city_name}' /> <a href="javascript:void(0);"
									onclick="edit_trans_city(this);" trans_city_type="express">编辑</a></span><span
								class="width1" id="express${vs.index}">${info.city_name}</span></td>
							<td><input type="text" value='${info.trans_weight}'
								class="in" id="express_trans_weight${vs.index}"
								name="express_trans_weight${vs.index}" /></td>
							<td><input type="text" value='${info.trans_fee}' class="in"
								id="express_trans_fee${vs.index}"
								name="express_trans_fee${vs.index}" /></td>
							<td><input type="text" value='${info.trans_add_weight}'
								class="in" id="express_trans_add_weight${vs.index}"
								name="express_trans_add_weight${vs.index}" /></td>
							<td><input type="text" value='${info.trans_add_fee}'
								class="in" id="express_trans_add_fee${vs.index}"
								name="express_trans_add_fee${vs.index}" /></td>
							<td><span class="width3"><a
									href="javascript:void(0);"
									onclick="if(confirm('确认要删除当前地区的设置么？'))remove_trans_city(this)">删除</a></span></td>
						</tr>
					</c:if>
				</c:forEach>
			</table>
		</div>
		<div class="rdinary_ul_bottom" style="display: none;"
			id="express_trans_city_op">
			<label> <input name="express_trans_all"
				id="express_trans_all" type="checkbox" value="" /> 全选
			</label> &nbsp; <a href="javascript:void(0);" id="batch_config_express"
				style="display: none;">批量设置</a> &nbsp; <a href="javascript:void(0);"
				id="batch_del_express">批量删除</a>
		</div>
		<div class="rdinary_ul_bottom">
			<a href="javascript:void(0);" onclick="trans_city('express')">为指定地区城市设置运费</a>&nbsp;<a
				href="javascript:void(0);" id="batch_set_express"
				trans_type="express">批量操作</a>&nbsp; <a href="javascript:void(0);"
				id="batch_cancle_express" trans_type="express"
				style="display: none;">取消批量</a>
		</div>
	</div>
</div>
<!--快递 结束-->

<!--平邮 开始-->
<div class="db_box_main">
	<div class="db_box_main_input">
		<label> <input name="trans_mail" type="checkbox"
			id="trans_mail" value="true"
			<c:if test="${obj.trans_mail}"> checked="checked"  </c:if> /> 平邮
		</label>
	</div>
	<div class="db_box_main_rdinary" id="trans_mail_info"
		<c:if test="${!obj.trans_mail}">  style="display:none;" </c:if>>
		<div class="rdinary_top">
			默认运费： <input name="mail_trans_weight" type="text"
				id="mail_trans_weight" value='${mail_trans_weight}' size="5" /> 件内，
			<input name="mail_trans_fee" type="text" id="mail_trans_fee"
				value='${mail_trans_fee}' size="8" /> 元， 每增加 <input
				name="mail_trans_add_weight" type="text" id="mail_trans_add_weight"
				value='${mail_trans_add_weight}' size="5" /> 件，增加运费 <input
				name="mail_trans_add_fee" type="text" id="mail_trans_add_fee"
				value='${mail_trans_add_fee}' size="8" /> 元
		</div>




		<div class="rdinary_ul"
			<c:if test="${empty mail_trans_list }">  style="display:none;" </c:if>
			id="mail_trans_city_info">
			<table width="100%" cellpadding="0" cellspacing="0">
				<tr bgcolor="#f5f5f5">
					<td width="46%" align="center"><span class="width1">运送到</span></td>
					<td width="11%"><span class="width2">首件（件）</span></td>
					<td width="13%"><span class="width2">首费（元）</span></td>
					<td width="11%"><span class="width2">续件（件）</span></td>
					<td width="12%"><span class="width2">续费（元）</span></td>
					<td width="7%"><span class="width3">操作</span></td>
				</tr>


				<c:forEach items="${mail_trans_list}" var="info" varStatus="vs">

					<c:if test="${vs.index>0 }">
						<tr index="${vs.index}">
							<td><span class="width2"><i> <input
										id="trans_ck_${vs.index}" name="trans_ck_${vs.index}"
										type="checkbox" value="" style="display: none;" />
								</i> <input id="mail_city_ids${vs.index}"
									name="mail_city_ids${vs.index}" type="hidden"
									value='${info.city_id}' /> <input
									id="mail_city_names${vs.index}"
									name="mail_city_names${vs.index}" type="hidden"
									value='${info.city_name}' /> <a href="javascript:void(0);"
									onclick="edit_trans_city(this);" trans_city_type="mail">编辑</a></span><span
								class="width1" id="mail${vs.index}">${info.city_name}</span></td>
							<td><input type="text" value='${info.trans_weight}'
								class="in" id="mail_trans_weight${vs.index}"
								name="mail_trans_weight${vs.index}" /></td>
							<td><input type="text" value='${info.trans_fee}' class="in"
								id="mail_trans_fee${vs.index}" name="mail_trans_fee${vs.index}" /></td>
							<td><input type="text" value='${info.trans_add_weight}'
								class="in" id="mail_trans_add_weight${vs.index}"
								name="mail_trans_add_weight${vs.index}" /></td>
							<td><input type="text" value='${info.trans_add_fee}'
								class="in" id="mail_trans_add_fee${vs.index}"
								name="mail_trans_add_fee${vs.index}" /></td>
							<td><span class="width3"><a
									href="javascript:void(0);"
									onclick="if(confirm('确认要删除当前地区的设置么？'))remove_trans_city(this)">删除</a></span></td>
						</tr>
					</c:if>
				</c:forEach>
			</table>
		</div>
		<div class="rdinary_ul_bottom" style="display: none;"
			id="mail_trans_city_op">
			<label> <input name="mail_trans_all" id="mail_trans_all"
				type="checkbox" value="" /> 全选
			</label> &nbsp; <a href="javascript:void(0);" id="batch_config_mail"
				style="display: none;">批量设置</a> &nbsp; <a href="javascript:void(0);"
				id="batch_del_mail">批量删除</a>
		</div>
		<div class="rdinary_ul_bottom">
			<a href="javascript:void(0);" onclick="trans_city('mail')">为指定地区城市设置运费</a>&nbsp;<a
				href="javascript:void(0);" id="batch_set_mail" trans_type="mail">批量操作</a>&nbsp;
			<a href="javascript:void(0);" id="batch_cancle_mail"
				trans_type="mail" style="display: none;">取消批量</a>
		</div>
	</div>
</div>
<!--平邮 结束-->
<!--EMS 开始-->
<div class="db_box_main">
	<div class="db_box_main_input">
		<label> <input name="trans_ems" type="checkbox" id="trans_ems"
			value="true"
			<c:if test="${obj.trans_ems}"> checked="checked"  </c:if> /> EMS
		</label>
	</div>
	<div class="db_box_main_rdinary" id="trans_ems_info"
		<c:if test="${!obj.trans_ems}"> style="display:none;" </c:if>>
		<div class="rdinary_top">
			默认运费： <input name="ems_trans_weight" type="text"
				id="ems_trans_weight" value='${ems_trans_weight}' size="5" /> 件内， <input
				name="ems_trans_fee" type="text" id="ems_trans_fee"
				value='${ems_trans_fee}' size="8" /> 元， 每增加 <input
				name="ems_trans_add_weight" type="text" id="ems_trans_add_weight"
				value='${ems_trans_add_weight}' size="5" /> 件，增加运费 <input
				name="ems_trans_add_fee" type="text" id="ems_trans_add_fee"
				value='${ems_trans_add_fee}' size="8" /> 元
		</div>

		<div class="rdinary_ul"
			<c:if test="${empty ems_trans_list}">  style="display:none;" </c:if>
			id="ems_trans_city_info">
			<table width="100%" cellpadding="0" cellspacing="0">
				<tr bgcolor="#f5f5f5">
					<td width="46%" align="center"><span class="width1">运送到</span></td>
					<td width="11%"><span class="width2">首件（件）</span></td>
					<td width="13%"><span class="width2">首费（元）</span></td>
					<td width="11%"><span class="width2">续件（件）</span></td>
					<td width="12%"><span class="width2">续费（元）</span></td>
					<td width="7%"><span class="width3">操作</span></td>
				</tr>
				<c:forEach items="${ems_trans_list}" var="info" varStatus="vs">
					<c:if test="${vs.index>0 }">
						<tr index="${vs.index}">
							<td><span class="width2"><i> <input
										id="trans_ck_${vs.index}" name="trans_ck_${vs.index}"
										type="checkbox" value="" style="display: none;" />
								</i> <input id="ems_city_ids${vs.index}"
									name="ems_city_ids${vs.index}" type="hidden"
									value='${info.city_id}' /> <input
									id="ems_city_names${vs.index}" name="ems_city_names${vs.index}"
									type="hidden" value='${info.city_name}' /> <a
									href="javascript:void(0);" onclick="edit_trans_city(this);"
									trans_city_type="ems">编辑</a></span><span class="width1"
								id="ems${vs.index}">${info.city_name}</span></td>
							<td><input type="text" value='${info.trans_weight}'
								class="in" id="ems_trans_weight${vs.index}"
								name="ems_trans_weight${vs.index}" /></td>
							<td><input type="text" value='${info.trans_fee}' class="in"
								id="ems_trans_fee${vs.index}" name="ems_trans_fee${vs.index}" /></td>
							<td><input type="text" value='${info.trans_add_weight}'
								class="in" id="ems_trans_add_weight${vs.index}"
								name="ems_trans_add_weight${vs.index}" /></td>
							<td><input type="text" value='${info.trans_add_fee}'
								class="in" id="ems_trans_add_fee${vs.index}"
								name="ems_trans_add_fee${vs.index}" /></td>
							<td><span class="width3"><a
									href="javascript:void(0);"
									onclick="if(confirm('确认要删除当前地区的设置么？'))remove_trans_city(this)">删除</a></span></td>
						</tr>
					</c:if>
				</c:forEach>
			</table>
		</div>
		<div class="rdinary_ul_bottom" style="display: none;"
			id="ems_trans_city_op">
			<label> <input name="ems_trans_all" id="ems_trans_all"
				type="checkbox" value="" /> 全选
			</label> &nbsp; <a href="javascript:void(0);" id="batch_config_ems"
				style="display: none;">批量设置</a> &nbsp; <a href="javascript:void(0);"
				id="batch_del_ems">批量删除</a>
		</div>
		<div class="rdinary_ul_bottom">
			<a href="javascript:void(0);" onclick="trans_city('ems')">为指定地区城市设置运费</a>&nbsp;<a
				href="javascript:void(0);" id="batch_set_ems" trans_type="ems">批量操作</a>&nbsp;
			<a href="javascript:void(0);" id="batch_cancle_ems" trans_type="ems"
				style="display: none;">取消批量</a>
		</div>
	</div>
</div>
<!--EMS 结束-->
