		$('.goback').on("touchstart",function(){
			window.history.back()
		})	
		
	   
	   	$('.sure button').on("touchstart",function(){
	   
	   	var oerror = $("#error3");
	oerror.hide().html("");
	var txt = $(".phone4").val(); //邮箱或手机号
	console.log(txt)
	var phoneNum = /^[1][34578][0-9]{9}$/;		
	var yzyb = $(".youbian").val();
	var yzpyb = /^\d{6}$/;	
	var bool4 = phoneNum.test(txt);
	var ming9 = $(".ming9").val()
	
	var reg = /^[\u4E00-\u9FA5]{2,10}$/;
	var bool5 = reg.test(ming9);
	var bool6 = yzpyb.test(yzyb);
	var xAddr=$("#ms3").val()+$(".xAddr").val();
	if(txt == "") {

		oerror.html("请填写完整信息").fadeIn(2000, function() {
			$(this).fadeOut(4000);
		});
	} else if(!bool4 ) {
		oerror.html("注册手机号格式有误").fadeIn(2000, function() {
			$(this).fadeOut(4000);
		});
	} else if((!bool6)) {
		oerror.html("邮编为6位数字").fadeIn(2000, function() {
			$(this).fadeOut(4000);
		});
	}  else if(!bool5) {
		oerror.html("请输入有效中文姓名").fadeIn(2000, function() {
			$(this).fadeOut(4000);
		});
	} else if(xAddr=="") {
		oerror.html("详细地址不能为空").fadeIn(2000, function() {
			$(this).fadeOut(4000);
		});
		//	ajax链接数据接口
	} else{	 
	   $.ajax({
			url: ROOTCONFIG.host + "/f/addrInst",
			data: {				
				name: ming9,
				phone: txt,
				addr: xAddr				
			},
			type: 'post',
			dataType: 'json', //主要是这里和原来的json改变了！	
			success: function(ret) {
				
				console.log(ret)
				
				
//				data = JSON.parse(ret);
				
				if(ret.success) {
					var data=ret.data;
					var morenaddId=data.addrId;
					var isDefalut=data.isDefalut;
					localStorage.setItem("morenaddId",morenaddId);
					localStorage.setItem("moren",xAddr);
					localStorage.setItem("addrId",data.addrId)
					  console.log(morenaddId)
							$.ajax({
						type: "post",
						timeout: 3000,
						url: ROOTCONFIG.host + "/f/addrDefUp",
						data: {
							id:morenaddId
						},
						datatype: "json",
						success: function(ret) {
						
							if(ret.success) {
								
								console.log(ret)
								
								// 执行成功，返回正确结果
							} else {
								// 执行成功，结果错误
							
							}
						},
						error: function() {
							// 超时或后台报错
						}
					});
						$scope.alert(ret.msg);
				window.history.back();

				} else {
					$scope.alert(ret.msg);
				}
			}
		});
	   }
	   })
/*软键盘BUG*/
					var heigHt=window.innerHeight;
					$("#ms").focus(function(){
						$("#wrap").css({"height":heigHt});
					}).blur(function(){
						$("#wrap").css({"height":"100%"});
					});
					$("#ms1").focus(function(){
						$("#wrap").css({"height":heigHt});
					}).blur(function(){
						$("#wrap").css({"height":"100%"});
					});
					$("#ms2").focus(function(){
						$("#wrap").css({"height":heigHt});
					}).blur(function(){
						$("#wrap").css({"height":"100%"});
					});
					$("#ms3").focus(function(){
						$("#wrap").css({"height":heigHt});
					}).blur(function(){
						$("#wrap").css({"height":"100%"});
					});
					$("#ms4").focus(function(){
						$("#wrap").css({"height":heigHt});
					}).blur(function(){
						$("#wrap").css({"height":"100%"});
					});
					/*软键盘BUG结束*/