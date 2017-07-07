var start_x = 0,start_y = 0;

function getOSAndBrowser() {
	var v = {os: 'pc', type:'pc', browser: ''}
	var userAgent = navigator.userAgent.toLowerCase();
	do {
		if(userAgent.match(/ipad/i) == "ipad") {
			v = {type: 'apply', os: 'ipad'}
			break;
		}
		if(userAgent.match(/iphone/i) == "iphone") {
			v = {type: 'apply',os: 'iphone'}
			break;
		}
		if(userAgent.match(/midp/i) == "midp") {
			v = {type: 'java',os: 'midp'}
			break;
		}
		if(userAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4" || userAgent.match(/ucweb/i) == "ucweb") {
			v = {type: 'uc',os: 'uc', browser:'uc'}
			break;
		}
		if(userAgent.match(/android/i) == "android") {
			v = {type: 'android',os: 'android'}
			break;
		}
		if(userAgent.match(/windows ce/i) == "windows ce") {
			v = {type: 'windows',os: 'windows ce'}
			break;
		}
		if(userAgent.match(/windows mobile/i) == "windows mobile") {
			v = {type: 'windows',os: 'windows mobile'}
			break;
		}
	} while(false);
	do {
		if(userAgent.match(/webkit/i) == "webkit") {
			v.browser = 'webkit';
			break;
		}
		if(userAgent.match(/safari/i) == "safari") {
			v.browser = 'safari';
			break;
		}
		if(userAgent.match(/opera/i) == "opera") {
			v.browser = 'opera';
			break;
		}
	} while(false);
	return v;
}
function loading(show) {
	return show? $('#loading').show():$('#loading').hide();
}
/**
 * 验证数据
 * @param value
 * @param type
 * @returns
 */
function validator(value, type) {
	var mobile = /^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/,
	email = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
	date = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/,
	pass = /^.{6,20}$/;
	
	//if(!type) {type = value.indexOf('@') > -1? 'email':'mobile';}
	switch (type) {
		case 'mobile':
			return mobile.test(value);
		case 'email':
			return email.test(value);
		case 'date':
			return date.test(value);
		case 'pass':
			return pass.test(value);
		default:
			return mobile.test(value);
	}
}
function setFocusTip(obj, tip) {
	//obj.focus();
	if(tip != '') showTip(tip);
	return;
}
function showTip(tip) {
	olexonWap.base.showWapTip({msg:tip,autoHide:true,time:2000})
}
function formJson(form) {
	var _this, type, name, radio = {}, checkbox = {}, json = {};
	
	$('input,select', form).each(function() {
		_this = $(this);
		type = _this.attr('type');
		name = _this.attr('name');
		if(name && !_this.attr("disabled")) {
			switch (type) {
				case 'radio':
					radio[name] = 1;
					break;
				case 'checkbox':
					checkbox[name] = "y";
					break;
				default:
					json[name] = _this.val();
			}
		}
	});
	for(k in radio) {
		json[k] = $('input[name='+k+']').val();
	}
	for(k in checkbox) {
		if($('input[name='+k+']').is(":checked")){
		json[k] = $('input[name='+k+']:checked').val();
		}
	}
	
	return json;
}
/** 
 * 返回上一层页面
 */
function historyBack(url) {
	if(!document.referrer) return window.location.href=url;
	window.history.back();
}
function getStatusReload(url) {
	$('#closeTip').trigger('click');
	$.getJSON(url, {}, function(data) {
			showTip(data.info);
			if(data.status == 1) {
				if(data.url) {
					window.location.href = data.url;
				} else {
					setTimeout(function() {
						window.location.reload(true);
					}, 1000);
				}
			}
	});
	return true;
}
/**
 * 绑定账户
 */
function bindAccount(obj, edit) {
	var type = $(obj).data('type');
	$.getJSON('?c=Info&a=relation', {'type': type, 'edit':edit}, function(data) {
		if(data.status) {
			$('#user-relation-form').html(data.info).show();
			$('body').scrollTop($('#user-relation-form').offset().top-44);
			$('.bindFrom input[name=name]').focus();
			$('.bindFrom input[name=name').unbind('blur').live('blur', function() {
				var _thie = $(this);
				var val = _thie.val();
				if(!val) return showTip('请填写'+(type == 'email'? '邮箱！':'手机号码！'));
				
				$.getJSON('user.php?c=User&a=checkUserName', {'param': val}, function(data) {
					if(data.status == 0) {
						return showTip((type == 'email'? '邮箱':(type == 'mobile')? '手机号码':'用户名')+'已存在！');
					}
					return true;
				});
			});
		} else {
			showTip(data.info);
		}
	})
}
/**
 * 提交绑定信息
 * @returns {Boolean}
 */
function sumbitBindAccount(type, edit) {
	var bindFrom = $('.bindFrom');
	var name = $('input[name=name', bindFrom);
	var value = name.val();
	var code = $('input[name=code', bindFrom).val();
	if(value == '' || code == '' || !type) return showTip('请填写信息！');
	
	switch(type) {
		case 'name':
			if(validator(value)) return setFocusTip(name, '不能为邮箱、手机号等纯数字格式！');
			if(value.replace(/[^\x00-\xff]/g, "**").length < 4 || value.replace(/[^\x00-\xff]/g, "**").length > 20) {
				return setFocusTip(name, '用户名长度在4-20个字符，可由中英文、数字组成！');
			}
			var reg = new RegExp("^([a-zA-Z0-9_-]|[\\u4E00-\\u9FFF])+$", "g");
			if (!reg.test(value))  return setFocusTip(name, '用户名格式不正确！');
			break;
		case 'email':
			if(!validator(value, 'email')) return setFocusTip(name, '邮箱格式格式不正确！');
			break;
		case 'mobile':
			if(!validator(value, 'mobile')) return setFocusTip(name, '手机号码格式格式不正确！');
			break;
		default:
			return showTip('请求失败！');
	}
	
	$.post('user.php?c=Info&a=relation&type='+type, {'name': value, 'code': code, 'edit':edit}, function(data2) {
		showTip(data2.info);
		if(data2.status == 0) {
			return false;
		}
		
		setTimeout(function() {
			window.location.reload(true);
		}, 800);
	}, 'json');
	return false;
}
/**
 * 获取绑定验证码
 * @returns {Boolean}
 */
function getBindVerifyCode(obj, type) {
	var name = $('input[name=name', '.bindFrom');
	var nameVal = name.val();
	if(!nameVal) return setFocusTip(name, '请填写' + (type == 'email'? '邮箱！':'手机号码！'));
	
	$.getJSON('?c=Info&a=getVerifyCode', {'name': nameVal, 'type': type}, function(data) {
		showTip(data.info);
		if(data.status == 1) {
			timedCount($(obj), 120);
		}
		
		return true;
	});
}
function timedCount(obj, count) {
	if(!obj.is(':disabled')) {
		obj.attr("disabled",true);
	}
	count--;
	if(count >= 0){
		setTimeout(function() {
			obj.text('等待'+count+'秒');
			timedCount(obj, count);
		}, 1000);
	} else {
		obj.text(obj.data('title'));
		obj.removeAttr("disabled");
		return true;
	}
}