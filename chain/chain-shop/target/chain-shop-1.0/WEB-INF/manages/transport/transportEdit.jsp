<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>运费模板</title>



<link href="/resource/css/user.css" type="text/css" rel="stylesheet" />
<link href="/resource/css/seller.css" type="text/css" rel="stylesheet" />
<link href="/resource/css/overlay.css" type="text/css" rel="stylesheet" />
<script src="/resource/js/jquery-1.6.2.js"></script>
<script src="/resource/js/jquery-ui-1.8.21.js"></script>
<script src="/resource/js/jquery.shop.common.js"></script>
<script src="/resource/js/jquery.validate.min.js"></script>
<script>
var mail_city_count=0;
var express_city_count=0
var ems_city_count=0;
var mail_batch=0;
var express_batch=0;
var ems_batch=0;
jQuery(document).ready(function(){
	 mail_city_count=jQuery("#mail_trans_city_info table tr").length-1;
	 express_city_count=jQuery("#express_trans_city_info table tr").length-1;
	 ems_city_count=jQuery("#ems_trans_city_info table tr").length-1;
	 jQuery("#mail_city_count").val(mail_city_count);
	 jQuery("#express_city_count").val(express_city_count);
	 jQuery("#ems_city_count").val(ems_city_count);
     jQuery("#theForm").validate({
       rules: {
			trans_name:{required:true},
		    // trans_time:{required:true},
			mail_trans_weight:{required:true,digits:true,range:[1,999]},
			mail_trans_fee:{required:true,number:true},
			mail_trans_add_weight:{required:true,digits:true,range:[1,999]},
			mail_trans_add_fee:{required:true,number:true},
			express_trans_weight:{required:true,digits:true,range:[1,999]},
			express_trans_fee:{required:true,number:true},
			express_trans_add_weight:{required:true,digits:true,range:[1,999]},
			express_trans_add_fee:{required:true,number:true},
			ems_trans_weight:{required:true,digits:true,range:[1,999]},
			ems_trans_fee:{required:true,number:true},
			ems_trans_add_weight:{required:true,digits:true,range:[1,999]},
			ems_trans_add_fee:{required:true,number:true}
		  },
	   messages: {
		    trans_name:{required:"模板名称不能为空"},
		    //trans_time:{required:"请选择发货时间"},
			mail_trans_weight:{required:"不能为空",digits:"只能为整数",range:"只能为1-999的数字"},
			mail_trans_fee:{required:"不能为空",number:"只能为数字"},
			mail_trans_add_weight:{required:"不能为空",digits:"只能为整数",range:"只能为1-999的数字"},
			mail_trans_add_fee:{required:"不能为空",number:"只能为数字"},
			express_trans_weight:{required:"不能为空",digits:"只能为整数",range:"只能为1-999的数字"},
			express_trans_fee:{required:"不能为空",number:"只能为数字"},
			express_trans_add_weight:{required:"不能为空",digits:"只能为整数",range:"只能为1-999的数字"},
			express_trans_add_fee:{required:"不能为空",number:"只能为数字"},
			ems_trans_weight:{required:"不能为空",digits:"只能为整数",range:"只能为1-999的数字"},
			ems_trans_fee:{required:"不能为空",number:"只能为数字"},
			ems_trans_add_weight:{required:"不能为空",digits:"只能为整数",range:"只能为1-999的数字"},
			ems_trans_add_fee:{required:"不能为空",number:"只能为数字"}
		}
  });
  jQuery(":checkbox").live("click",function(){
     var ck=jQuery(this).attr("checked");
	 if(ck=="checked"){
       var id=jQuery(this).attr("id");
	   jQuery("#"+id+"_info").show();
	 }else{
	    var id=jQuery(this).attr("id");
	   jQuery("#"+id+"_info").hide();
	 }
   });
  jQuery("a[id^=batch_set_]").live("click",function(){
     jQuery(this).parent().parent().find(":checkbox").show();
	 var type=jQuery(this).attr("trans_type");
	 jQuery("#"+type+"_trans_city_op").show();
	 jQuery(this).hide();
	 jQuery("#batch_cancle_"+type).show();
	 if(type=="mail"){
	   mail_batch=1;
	 }
	 if(type=="express"){
       express_batch=1;
	 }
	 if(type=="ems"){
	    ems_batch=1;
	 }
  });
  jQuery("a[id^=batch_cancle_]").live("click",function(){
     jQuery(this).parent().parent().find(":checkbox").hide();
	 var type=jQuery(this).attr("trans_type");
	 jQuery("#"+type+"_trans_city_op").hide();
	 jQuery(this).hide();
	 jQuery("#batch_set_"+type).show();
	 if(type=="mail"){
	   mail_batch=0;
	 }
	 if(type=="express"){
       express_batch=0;
	 }
	 if(type=="ems"){
	    ems_batch=0;
	 }
  });
  jQuery("a[id^=batch_del_]").live("click",function(){
     jQuery(this).parent().parent().find(":checkbox[checked=true][id^=trans_ck]").each(function(){
	     jQuery(this).parent().parent().parent().parent().remove();
	 });
	 jQuery("#mail_trans_all").attr("checked",false);
  });
  jQuery("a[id^=batch_config_]").click(function(){
     
  });
  jQuery(":checkbox[id$=mail_trans_all]").live("click",function(){
	 var ck=jQuery(this).attr("checked");
	 if(ck=="checked"){
       jQuery(this).parent().parent().parent().find(":checkbox").attr("checked",true);
	 }else{
	   jQuery(this).parent().parent().parent().find(":checkbox").attr("checked",false);
	 }
  });
  jQuery(":radio[id=trans_type]").click(function(){
     if(confirm("正在切换计价方式，确定继续么？")){
	     var trans_type=jQuery(this).val();
		 if(trans_type=="0"){
			trans_type="mail";
		 }
		 if(trans_type=="1"){
			 trans_type="express";
		 }
		 if(trans_type=="2"){
			 trans_type="ems";
		 }
		 jQuery.ajax({type:'POST',url:'/manage/transport!transport_info.action',data:{"id":"${obj.id}","type":trans_type},
					   success:function(data){
					       jQuery("#trans_detail").empty().html(data);
					   }
		 });
	  }
   });

  
  <c:choose>
  
  <c:when test="${obj.trans_mail}">
      jQuery("#trans_mail_info").show();
  
  </c:when>
  
    <c:when test="${obj.trans_express}">
       jQuery("#trans_express_info").show();
  
  </c:when>
  
     <c:when test="${obj.trans_ems}">
        jQuery("#trans_ems_info").show();
  
  </c:when>
  
  </c:choose>
  
   jQuery("#trans_time").val("${obj.trans_time}");
  jQuery(":radio[value=${obj.trans_type}]").attr("checked",true);

 
});
function trans_city(id){
  var the_id="";
  var s="";
  if(id=="express"){
    express_city_count=express_city_count+1;
	the_id="express"+express_city_count;
	jQuery("#express_city_count").val(express_city_count);
	if(express_batch==1){
       s='<tr index="'+express_city_count+'"><td><span class="width2"><i><input id="trans_ck_'+express_city_count+'" name="trans_ck_'+express_city_count+'" type="checkbox" value="" /></i><input id="express_city_ids'+express_city_count+'" name="express_city_ids'+express_city_count+'" type="hidden" value="" /><input id="express_city_names'+express_city_count+'" name="express_city_names'+express_city_count+'" type="hidden" value="" /><a  href="javascript:void(0);" onclick="edit_trans_city(this);" trans_city_type="'+id+'">编辑</a></span><span class="width1" id="'+the_id+'">未添加地区</span></td><td><input type="text" value="1" class="in" id="express_trans_weight'+express_city_count+'" name="express_trans_weight'+express_city_count+'" /></td><td><input type="text" value="1" class="in" id="express_trans_fee'+express_city_count+'" name="express_trans_fee'+express_city_count+'" /></td><td><input type="text" value="1" class="in" id="express_trans_add_weight'+express_city_count+'" name="express_trans_add_weight'+express_city_count+'" /></td><td><input type="text" value="1" class="in" id="express_trans_add_fee'+express_city_count+'" name="express_trans_add_fee'+express_city_count+'" /></td><td><span class="width3"><a href="javascript:void(0);" onclick="if(confirm(\'确认要删除当前地区的设置么？\'))remove_trans_city(this)">删除</a></span></td></tr>';
	}else{
      s='<tr index="'+express_city_count+'"><td><span class="width2"><i><input id="trans_ck_'+express_city_count+'" name="trans_ck_'+express_city_count+'" type="checkbox" value="" style="display:none;" /></i><input id="express_city_ids'+express_city_count+'" name="express_city_ids'+express_city_count+'" type="hidden" value="" /><input id="express_city_names'+express_city_count+'" name="express_city_names'+express_city_count+'" type="hidden" value="" /><a  href="javascript:void(0);" onclick="edit_trans_city(this);" trans_city_type="'+id+'">编辑</a></span><span class="width1" id="'+the_id+'">未添加地区</span></td><td><input type="text" value="1" class="in" id="express_trans_weight'+express_city_count+'" name="express_trans_weight'+express_city_count+'" /></td><td><input type="text" value="1" class="in" id="express_trans_fee'+express_city_count+'" name="express_trans_fee'+express_city_count+'" /></td><td><input type="text" value="1" class="in" id="express_trans_add_weight'+express_city_count+'" name="express_trans_add_weight'+express_city_count+'" /></td><td><input type="text" value="1" class="in" id="express_trans_add_fee'+express_city_count+'" name="express_trans_add_fee'+express_city_count+'" /></td><td><span class="width3"><a href="javascript:void(0);" onclick="if(confirm(\'确认要删除当前地区的设置么？\'))remove_trans_city(this)">删除</a></span></td></tr>';
   }  
  jQuery("#"+id+"_trans_city_info table tr:last").after(s);
  jQuery("#"+id+"_trans_city_info").show();
   
  }
  if(id=="ems"){

    ems_city_count=ems_city_count+1;
	the_id="ems"+ems_city_count;
	jQuery("#ems_city_count").val(ems_city_count);
	

    if(ems_batch==1){
       s='<tr index="'+ems_city_count+'"><td><span class="width2"><i><input id="trans_ck_'+ems_city_count+'" name="trans_ck_'+ems_city_count+'" type="checkbox" value="" /></i><input id="ems_city_ids'+ems_city_count+'" name="ems_city_ids'+ems_city_count+'" type="hidden" value="" /><input id="ems_city_names'+ems_city_count+'" name="ems_city_names'+ems_city_count+'" type="hidden" value="" /><a  href="javascript:void(0);" onclick="edit_trans_city(this);" trans_city_type="'+id+'">编辑</a></span><span class="width1" id="'+the_id+'">未添加地区</span></td><td><input type="text" value="1" class="in" id="ems_trans_weight'+ems_city_count+'" name="ems_trans_weight'+ems_city_count+'" /></td><td><input type="text" value="1" class="in" id="ems_trans_fee'+ems_city_count+'" name="ems_trans_fee'+ems_city_count+'" /></td><td><input type="text" value="1" class="in" id="ems_trans_add_weight'+ems_city_count+'" name="ems_trans_add_weight'+ems_city_count+'" /></td><td><input type="text" value="1" class="in" id="ems_trans_add_fee'+ems_city_count+'" name="ems_trans_add_fee'+ems_city_count+'" /></td><td><span class="width3"><a href="javascript:void(0);" onclick="if(confirm(\'确认要删除当前地区的设置么？\'))remove_trans_city(this)">删除</a></span></td></tr>';
	}else{
      s='<tr index="'+ems_city_count+'"><td><span class="width2"><i><input id="trans_ck_'+ems_city_count+'" name="trans_ck_'+ems_city_count+'" type="checkbox" value="" style="display:none;" /></i><input id="ems_city_ids'+ems_city_count+'" name="ems_city_ids'+ems_city_count+'" type="hidden" value="" /><input id="ems_city_names'+ems_city_count+'" name="ems_city_names'+ems_city_count+'" type="hidden" value="" /><a  href="javascript:void(0);" onclick="edit_trans_city(this);" trans_city_type="'+id+'">编辑</a></span><span class="width1" id="'+the_id+'">未添加地区</span></td><td><input type="text" value="1" class="in" id="ems_trans_weight'+ems_city_count+'" name="ems_trans_weight'+ems_city_count+'" /></td><td><input type="text" value="1" class="in" id="ems_trans_fee'+ems_city_count+'" name="ems_trans_fee'+ems_city_count+'" /></td><td><input type="text" value="1" class="in" id="ems_trans_add_weight'+ems_city_count+'" name="ems_trans_add_weight'+ems_city_count+'" /></td><td><input type="text" value="1" class="in" id="ems_trans_add_fee'+ems_city_count+'" name="ems_trans_add_fee'+ems_city_count+'" /></td><td><span class="width3"><a href="javascript:void(0);" onclick="if(confirm(\'确认要删除当前地区的设置么？\'))remove_trans_city(this)">删除</a></span></td></tr>';
  
   
   }  
    

  jQuery("#"+id+"_trans_city_info table tr:last").after(s);
  jQuery("#"+id+"_trans_city_info").show();	
  

  }
  if(id=="mail"){
    mail_city_count=mail_city_count+1;
	the_id="mail"+mail_city_count;
	jQuery("#mail_city_count").val(mail_city_count);
	if(mail_batch==1){
       s='<tr index="'+mail_city_count+'"><td><span class="width2"><i><input id="trans_ck_'+mail_city_count+'" name="trans_ck_'+mail_city_count+'" type="checkbox" value="" /></i><input id="mail_city_ids'+mail_city_count+'" name="mail_city_ids'+mail_city_count+'" type="hidden" value="" /><input id="mail_city_names'+mail_city_count+'" name="mail_city_names'+mail_city_count+'" type="hidden" value="" /><a  href="javascript:void(0);" onclick="edit_trans_city(this);" trans_city_type="'+id+'">编辑</a></span><span class="width1" id="'+the_id+'">未添加地区</span></td><td><input type="text" value="1" class="in" id="mail_trans_weight'+mail_city_count+'" name="mail_trans_weight'+mail_city_count+'" /></td><td><input type="text" value="1" class="in" id="mail_trans_fee'+mail_city_count+'" name="mail_trans_fee'+mail_city_count+'" /></td><td><input type="text" value="1" class="in" id="mail_trans_add_weight'+mail_city_count+'" name="mail_trans_add_weight'+mail_city_count+'" /></td><td><input type="text" value="1" class="in" id="mail_trans_add_fee'+mail_city_count+'" name="mail_trans_add_fee'+mail_city_count+'" /></td><td><span class="width3"><a href="javascript:void(0);" onclick="if(confirm(\'确认要删除当前地区的设置么？\'))remove_trans_city(this)">删除</a></span></td></tr>';
	}else{
      s='<tr index="'+mail_city_count+'"><td><span class="width2"><i><input id="trans_ck_'+mail_city_count+'" name="trans_ck_'+mail_city_count+'" type="checkbox" value="" style="display:none;" /></i><input id="mail_city_ids'+mail_city_count+'" name="mail_city_ids'+mail_city_count+'" type="hidden" value="" /><input id="mail_city_names'+mail_city_count+'" name="mail_city_names'+mail_city_count+'" type="hidden" value="" /><a  href="javascript:void(0);" onclick="edit_trans_city(this);" trans_city_type="'+id+'">编辑</a></span><span class="width1" id="'+the_id+'">未添加地区</span></td><td><input type="text" value="1" class="in" id="mail_trans_weight'+mail_city_count+'" name="mail_trans_weight'+mail_city_count+'" /></td><td><input type="text" value="1" class="in" id="mail_trans_fee'+mail_city_count+'" name="mail_trans_fee'+mail_city_count+'" /></td><td><input type="text" value="1" class="in" id="mail_trans_add_weight'+mail_city_count+'" name="mail_trans_add_weight'+mail_city_count+'" /></td><td><input type="text" value="1" class="in" id="mail_trans_add_fee'+mail_city_count+'" name="mail_trans_add_fee'+mail_city_count+'" /></td><td><span class="width3"><a href="javascript:void(0);" onclick="if(confirm(\'确认要删除当前地区的设置么？\'))remove_trans_city(this)">删除</a></span></td></tr>';
	}
	  
  jQuery("#"+id+"_trans_city_info table tr:last").after(s);
  jQuery("#"+id+"_trans_city_info").show();

  }  
}
function edit_trans_city(obj){	
 var trans_city_type=jQuery(obj).attr("trans_city_type");
 var trans_index=jQuery(obj).parent().parent().parent().attr("index");
 jQuery.ajax({type:'POST',url:'/manage/transport!transport_area.action',data:{"trans_city_type":trans_city_type,"trans_index":trans_index},
			  success:function(data){
			  
			 
			             jQuery(".main").append(data);
						 var left=jQuery(obj).offset().left-380;
						 var top=jQuery(obj).offset().top+32;
						 jQuery(".area_box").css({"top":top+"px","left":left+"px"}).show();
					  }
			})
}
function remove_trans_city(obj){
  jQuery(obj).parent().parent().parent().remove();
}
function subaa(){
var flag=false;
if($("#trans_express").prop("checked"))
flag=true;
if($("#trans_ems").prop("checked"))
flag=true;
if($("#trans_mail").prop("checked"))
flag=true;

if(flag!=true){
alert("请选择设置邮费");
return false;
}else{
return true;
}
}
</script>
</head>
<body>
	<div class="main">
		<div class="user_center">
			<table width="98%" border="0" cellspacing="0" cellpadding="0"
				class="user_table">
				<tr>
					<td id="centerbg" valign="top">
						<div class="productmain">
							<div class="ordernav">
								<ul class="orderul">
									<li><a href="/manage/transport!list.action?init=y">物流模板</a></li>
									<li class="this"><span class="position">添加运费模板</span></li>
								</ul>
							</div>
							<div class="ordercon">
								<form action="/manage/transport!add.action" method="post"
									name="theForm" id="theForm" onsubmit="return subaa()">
									<input name="trans_type" type="hidden" id="trans_type"
										value="0" />

									<div class="db_box">
										<div class="db_box_top">
											<ul>
												<li><span class="li_left">模板名称:</span> <span
													class="li_right"> <input name="trans_name"
														type="text" id="trans_name" value="${obj.trans_name}" />
														<input name="id" type="hidden" id="id" value="${obj.id}" />
												</span> <input type="hidden" name="mail_city_count"
													id="mail_city_count" /> <input type="hidden"
													name="express_city_count" id="express_city_count" /> <input
													type="hidden" name="ems_city_count" id="ems_city_count" />
												</li>
												<!--                       <li> <span class="li_left">发货时间:</span> <span class="li_right_font"> -->
												<!--                         <select name="trans_time" id="trans_time"> -->
												<!--                           <option value="" selected="selected">请选择</option> -->
												<!--                           <option value="12">12小时内</option> -->
												<!--                           <option value="24">24小时内</option> -->
												<!--                           <option value="48">48小时内</option> -->
												<!--                           <option value="72">72小时内</option> -->

												<!--                         </select> -->
												<!--                         承诺买家付款后该时间内录入物流信息并发货，以物流公司收单信息为准</span> -->
												<!--                        </li> -->
												<!--                       <li> <span class="li_left">计价方式:</span> <span class="li_right_font"> -->
												<!--                         <label> -->
												<!--                           <input name="trans_type" type="radio" id="trans_type" value="0"  /> -->
												<!--                           按件数 </label> -->
												<!--                         <label> -->
												<!--                           <input type="radio" name="trans_type" id="trans_type" value="1" /> -->
												<!--                           按重量 </label> -->
												<!--                         <label> -->
												<!--                           <input type="radio" name="trans_type" id="trans_type" value="2" /> -->
												<!--                           按体积 </label> -->
												<!--                         </span> </li> -->
												<li><span class="li_left">运送方式:</span> <span
													class="li_right_font">除指定地区外，其他地区的运费采用“默认运费”</span></li>
											</ul>
										</div>
										<div id="trans_detail">


											<c:if test="${not empty obj}">

												<c:choose>
													<c:when test="${obj.trans_type==0}">

														<jsp:include
															page="/WEB-INF/manages/transport/transport_mail.jsp" />
													</c:when>
													<c:when test="${obj.trans_type==1}">

														<jsp:include
															page="/WEB-INF/manages/transport/transport_express.jsp" />

													</c:when>
													<c:when test="${obj.trans_type==2}">

														<jsp:include
															page="/WEB-INF/manages/transport/transport_ems.jsp" />

													</c:when>
													<c:otherwise>
														<jsp:include
															page="/WEB-INF/manages/transport/transport_mail.jsp" />

													</c:otherwise>

												</c:choose>


											</c:if>
											<c:if test="${empty obj}">
												<jsp:include
													page="/WEB-INF/manages/transport/transport_mail.jsp" />
											</c:if>
										</div>
										<div class="db_box_save">
											<input name="提交" type="submit" value="保存" />
										</div>
									</div>
								</form>
							</div>
						</div>
					</td>
				</tr>
			</table>
		</div>
	</div>

</body>
</html>

