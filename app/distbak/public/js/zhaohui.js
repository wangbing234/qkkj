	
		var $IS = {
			isPC: function() { //判断是pc还是移动
				var Agents = ["Android", "BB10", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]; //主流的手机
				var usergent = navigator.userAgent; //获取用户代理信息
				var isFlag = true;
				for(var i = 0; i < Agents.length; i++) {
					if(usergent.indexOf(Agents[i]) != -1) {
						isFlag = false;
						break;
					}
				}
				return isFlag;
			},
			webEvent: function() { //事件处理
				var touchEvent = { //初始化事件
					touchstart: "touchstart", //mousedown
					touchmove: "touchmove", //mousemove
					touchend: "touchend" //mouseup
				}
				if(this.isPC()) { //如果是PC端讲事件进行更新
					touchEvent.touchstart = "mousedown";
					touchEvent.touchmove = "mousemove";
					touchEvent.touchend = "mouseup";
				}
				return touchEvent;
			}
	};
		var ev = $IS.webEvent();
			$(".goback").on(ev.touchstart, function() {
			window.history.back()
		})
			
		
//		点击触发找回密码事件	

//验证码发送时间限定

    var btn = document.getElementById("setBtn");
    var p=document.getElementById("lastTime")
    var count =60;
    var timer = null;
    var say = function () {
        //1:第一步点击按钮 获取内容放到视频块最右边
//      验证码发送,链接端口发送对应修改密码的验证码,设定60秒之内不能重复点击
      var txt = $("#phoneZ").val()*1;
      var min=$("#seys").val();
      
					      $.ajax({
						type : "post",
						timeout : 3000,
						url : "/f1/yzm2",
						data : {
							phone : txt,
							name:min
							
						},
						datatype : "json",
						success : function(ret) {
							if (ret.success) {
								// 执行成功，返回正确结果
								console.log(ret.msg)
								alert(ret.msg)
							} else {
					// 执行成功，结果错误
					console.log(ret.msg);
					alert("请同时输入手机号和姓名发送验证码")
							}
						},
						error : function() {
							// 超时或后台报错
						}
					});
        btn.removeEventListener('click', say, false)
        timer = setInterval(function () {
            count--
           
            btn.style.background="gray";
            
            if (count == 0) {
                clearInterval(timer)
                btn.addEventListener('click', say, false);
                btn.style.background="#e27b02"
                count = 60
            } 
            
           
           
            p.innerHTML=count
        }, 1000)
      
    }
    btn.addEventListener("click", say, false)
    
    
    
    
		$("#ffff").on("click", function() {
		
	var oerror = $("#error2 span");

	var txt = $("#phoneZ").val()*1; //邮箱或手机号
	var pwd1 = $("#pwd3").val(); //第一次密码
	var pwd2 = $("#pwd4").val(); //第二次密码
	var hash = hex_md5(pwd2);
	var mail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	
	var phoneNum = /^[1][3578][0-9]{9}$/;
	var bool1 = mail.test(txt); //邮箱
	var bool2 = phoneNum.test(txt); //手机号
	var yzpwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/;
	
	var bool3 = yzpwd.test(pwd1); //密码
	var min=$("#seys").val();
	var yan=$("#sey").val();
	
	if((txt == "" || pwd1 == "") || (pwd2 == ""||min=="")) {

		oerror.html("请填写完整信息").fadeIn(2000, function() {
			$(this).fadeOut(500);
		});
	} 
	else if((!bool1) && (!bool2)) {
		oerror.html("注册手机号格式有误").fadeIn(2000, function() {
			$(this).fadeOut(500);
		});
	} else if(!bool3) {
		oerror.html("密码不少于6位且不可输入特殊字符").fadeIn(2000, function() {
			$(this).fadeOut(500);
		});
	} else if(!(pwd1 === pwd2)) {
		oerror.html("两次密码输入不一致").fadeIn(2000, function() {
			$(this).fadeOut(500);
		});
	}else{
		 localStorage.setItem("phoneNum", txt);
		
	
	
//	ajax链接数据接口 找回密码数据接口
	
		$.ajax({
			type : "post",
			timeout : 3000,
			url: ROOTCONFIG.host + "/f1/forget",
				data : {
					phone : txt,
					name : min,
					yzm : yan,
					pwd:hash
					},

				success : function(ret) {
						if (ret.success) {
							// 执行成功，返回正确结果
							alert(ret.msg)
							location.href="login.html"
						} else {
							// 执行成功，结果错误
               alert(ret.msg)
						}
					},
					error : function() {
						// 超时或后台报错
					}
				});

	}
});

    
    
    
    
/*软键盘BUG*/
					var heigHt=window.innerHeight;
					$("#phoneZ").focus(function(){
						$("#wrap").css({"height":heigHt});
					}).blur(function(){
						$("#wrap").css({"height":"100%"});
					});
					$("#sey").focus(function(){
						$("#wrap").css({"height":heigHt});
					}).blur(function(){
						$("#wrap").css({"height":"100%"});
					});
					$("#pwd3").focus(function(){
						$("#wrap").css({"height":heigHt});
					}).blur(function(){
						$("#wrap").css({"height":"100%"});
					});
						$("#pwd4").focus(function(){
						$("#wrap").css({"height":heigHt});
					}).blur(function(){
						$("#wrap").css({"height":"100%"});
					});
					/*软键盘BUG结束*/

    //    btn.addEventListener("click",say,false)



