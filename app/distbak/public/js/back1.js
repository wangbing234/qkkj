//退出按钮
	document.addEventListener("plusready", function() {  
    // 注册返回按键事件  
    plus.key.addEventListener('backbutton', function() {  
        // 事件处理  
      
		$("#motai").show();
	
	$(".aa1").on("touchstart",function(){
		$("#motai").hide();
	})
	$(".aa2").on("touchstart",function(){
			
		$.ajax({
			type: "post",
			timeout: 3000,
			url: ROOTCONFIG.host + "/f/bye",
			datatype: "json",
		success : function(ret) {
		if (ret.success) {
			// 执行成功，返回正确结果
			console.log("您已退出");
			localStorage.clear();
			window.location.href="login.html"
//				window.location.href = "./login.html";
		} else {
			// 执行成功，结果错误
		}
	},
	error : function() {
		// 超时或后台报错
	}
});




	})
    }, false);  
});  