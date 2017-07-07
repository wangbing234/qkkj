<%-- <link rel="stylesheet" href="<%=request.getContextPath()%>/resource/bootstrap2.3.1/bootstrap.min.css"  type="text/css"> --%>
<%-- <link rel="stylesheet" href="<%=request.getContextPath()%>/resource/css/base.css"  type="text/css"> --%>
<%@ page contentType="text/html; charset=UTF-8"%>
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/resource/bootstrap/css/bootstrap.min.css"
	type="text/css">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/resource/css/base.css"
	type="text/css">


<script type="text/javascript"
	src="<%=request.getContextPath() %>/resource/js/jquery-1.9.1.min.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath() %>/resource/js/jquery.blockUI.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath() %>/resource/bootstrap/js/bootstrap.min.js"></script>

<script type="text/javascript" src="/resource/js/manage.js"></script>


<script type="text/javascript">

function toCache(url){
$.ajax({
	  type: 'post',
	  url: url,
	  dataType:"text",
	  //async:false,
	  success: function(data){
		  if(!data){alert("发生错误")}
		  else if(data.replace(/(^\s*)|(\s*$)/g, "")=="success"){
		  
		  alert("加载成功")
		  }
		  console.log("data="+data);
		
	  },
	  error:function(){
		  console.log("加载数据失败，请联系管理员。");
	  }
	});

}




</script>