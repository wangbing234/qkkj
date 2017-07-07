/**
 *  取消订单
 */
function doCancelOrder(value,fun){
		if(confirm("确认要取消订单吗?"))
		{
			 $.ajax({
			      type :"post",  //提交方式 
			      url :"order!cancelOrder.action",         //请求链接 
			      data:{"e.id":value},              
			      dataType :"json", //返回数据类型
			      error:function(){ //后台出错，显示提示信息 
			    	  alert("后端出错");
			      }, 
			      success :function(res) {
			    	  if(res.code=="0") {
			    		  fun();
		    		  }
			    	  else{
			    		  alert(res.msg);
			    		  }
					}
			     });
		}
	}

/**
 * 查询订单项目
 * @param id
 * @param con
 * @param exno
 * @returns
 */
function queryEx(id,con,exno){
	layer.open({
    type: 2,
    title: con+":"+exno,
    shadeClose: true,
    shade: 0.8,
    area: ['600px', '90%'],
    content: "/manage/order!expressQuery.action?e.id="+id
	}); 
}