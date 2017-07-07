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
$(".sure button").on(ev.touchstart, function() {
	var oerror = $("#error span");
	oerror.hide().html("");
	var txt = $("#phoneR").val(); //邮箱或手机号
	var pwd1 = $("#pwd1").val(); //第一次密码
	var hash = hex_md5(pwd1);
	var pwd2 = $("#pwd2").val(); //第二次密码
	var mail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	var txt2 = $("#phoneY").val(); //邀请人号码
	var phoneNum = /^[1][34578][0-9]{9}$/;
	var bool1 = mail.test(txt); //邮箱
	var bool2 = phoneNum.test(txt); //手机号
	var yzm = $("#yaz").val();
	var yzpwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,30}$/
	var yzyzm=/^\d{6}\b/;
	var bool3 = yzpwd.test(pwd1); //密码
	var bool4 = phoneNum.test(txt2);
	var useNmae = $("#useName").val()
	var reg = /^[\u4E00-\u9FA5]{2,10}$/;
	var bool5 = reg.test(useNmae);
	var bool6 = yzyzm.test(yzm);
	if(txt == "" || pwd1 == "" || pwd2 == "") {

		oerror.html("请填写完整信息").fadeIn(500, function() {
			$(this).fadeOut(500);
		});
	} else if((!bool1) && (!bool2)) {
		oerror.html("注册手机号格式有误").fadeIn(500, function() {
			$(this).fadeOut(400);
		});
	} else if(!bool6) {
		oerror.html("验证码为6位数字").fadeIn(500, function() {
			$(this).fadeOut(400);
		});
	} else if((!bool3)) {
		oerror.html("密码由数字和字母组成").fadeIn(2000, function() {
			$(this).fadeOut(400);
		});
	} else if(!(pwd1 === pwd2)) {
		oerror.html("两次密码输入不一致").fadeIn(2000, function() {
			$(this).fadeOut(400);
		});
	} else if(!bool5) {
		oerror.html("请输入有效姓名").fadeIn(2000, function() {
			$(this).fadeOut(400);
		});
	} else if(!bool4) {
		oerror.html("邀请人手机号码格式有误").fadeIn(2000, function() {
			$(this).fadeOut(400);
		});
		//	ajax链接数据接口
	} else if(txt === txt2) {
		oerror.html("注册手机号和邀请人手机号不能相同").fadeIn(2000, function() {
			$(this).fadeOut(400);
		});

	}else {
		localStorage.setItem("phoneNum", txt);
	
		$.ajax({
			type: 'post',						
			timeout:3000,
			url: ROOTCONFIG.host + "/f1/reg",
			data: {
				pwd: hash,
				phone: txt,
				name: useNmae,
				referee:txt2,
				yzm:yzm
				
			},
			
			dataType: 'json', //主要是这里和原来的json改变了！	
			success: function(ret) {
				
				if(ret.success) {
						localStorage.setItem("phoneNum", txt);
					oerror.html("注册成功,即将前往登录界面").fadeIn(2000, function() {
						$(this).fadeOut(400, function() {
							window.location.href = "login.html";
						});
					});
				} else {
					oerror.html(ret.msg).fadeIn(2000, function() {
						$(this).fadeOut(400);
					});
				}
			}
		});
	}
});

//验证码发送时间限定
var btn = document.getElementById("setBtn");
var p = document.getElementById("lastTime")
var count = 60;
var timer = null;

var say = function() {
	var txtss=$("#phoneR").val()*1
	//1:第一步点击按钮 获取内容放到视频块最右边
	//      发送注册验证码 链接端口发送注册验证码 60秒之内不能重复点击发送
		$.ajax({
	type : "post",
	timeout : 3000,
	url : "/f1/yzm",
	data : {
		phone : txtss,
		
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
alert(ret.msg)
		}
	},
	error : function() {
		// 超时或后台报错
	}
});

	btn.removeEventListener('click', say, false)
	timer = setInterval(function() {
		count--
		btn.style.background = "gray";

		if(count == 0) {
			clearInterval(timer)
			btn.addEventListener('click', say, false);
			btn.style.background = "#e27b02"
			count = 60;
			$("#lastTime").hide()
		} else {
			$("#lastTime").show()
			p.innerHTML = count
		}
	}, 1000)

}
btn.addEventListener("click", say, false)

//    btn.addEventListener("click",say,false)
/*软键盘BUG*/
var heigHt=window.innerHeight;
$("#phoneR").focus(function(){
	$("#wrap").css({"height":heigHt});
}).blur(function(){
	$("#wrap").css({"height":"100%"});
});
$("#yaz").focus(function(){
	$("#wrap").css({"height":heigHt});
}).blur(function(){
	$("#wrap").css({"height":"100%"});
});
$("#pwd1").focus(function(){
	$("#wrap").css({"height":heigHt});
}).blur(function(){
	$("#wrap").css({"height":"100%"});
});
$("#pwd2").focus(function(){
	$("#wrap").css({"height":heigHt});
}).blur(function(){
	$("#wrap").css({"height":"100%"});
});
$("#useName").focus(function(){
	$("#wrap").css({"height":heigHt});
}).blur(function(){
	$("#wrap").css({"height":"100%"});
});
$("#phoneY").focus(function(){
	$("#wrap").css({"height":heigHt});
}).blur(function(){
	$("#wrap").css({"height":"100%"});
});

