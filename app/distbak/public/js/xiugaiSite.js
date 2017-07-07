var bgdiRid=localStorage.getItem("bgdiRid");
var ming9=$(".ming9").val();
var phone4=$(".phone4").val();
var youbian=$(".youbian").val();
var addr=$(".addr").val();
var xAddr=$(".xAddr").val();

$.ajax({
	type : "post",
	timeout : 3000,
	url : "/f/addrUp",
	data : {
		rid : bgdiRid,
		name : ming9,
		phone : phone4,
		addr:xAddr
	},
	datatype : "json",
	success : function(ret) {
		if (ret.success) {
			// 执行成功，返回正确结果
			window.history.back();
		} else {
			// 执行成功，结果错误
		}
	},
	error : function() {
		// 超时或后台报错
	}
});

