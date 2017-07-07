var app = require('../../app.js');

app.controller("spreadRecordController", function($scope, $rootScope, $http, $location) {
    $(".tab").on("touchstart",function(){
        var index=$(this).index();
        $(this).addClass("active7").siblings().removeClass("active7");
        $(".sss1").eq(index).show().siblings().hide();
    })
		
    $.ajax({
        type: "post",
        timeout: 3000,
        url: ROOTCONFIG.host + "/f/activeLog",
        datatype: "json",
        success: function(ret) {
            if(ret.success) {
                console.log("查询激活码交易记录成功");
                var data = ret.data;
                console.log(data);
                for(var i in data) {
                    var hh;
                    if(data[i].receiverName==null){
                        hh="本人激活消耗";
                    }else{
                        hh=data[i].receiverName;
                    }
                    $("#faWrap").append('<div class="notes"><ul><li><span>' + '发' + '&nbsp;' + '送' + '&nbsp;' + '人:' + '&nbsp;&nbsp;' + '</span><span>' + data[i].senderName + '</span><li><li><span>' + '获' + '&nbsp;' + '赠' + '&nbsp;' + '人:' +'&nbsp;&nbsp;' + '</span><span>' + hh + '</span><li><li><span>' + '数          量:' + '&nbsp;&nbsp;' + '</span><span>' + data[i].transCount + '个' + '<span></li><li><li><span>' + '发放时间:' + "&nbsp;&nbsp;" + '</span><span>' + data[i].createTime + '<span></li></ul><div>')
                }
				var lengths=$("#faWrap .notes").length;
                $(".conJh").html(lengths);
                if(lengths>0){
                    $(".jiHuoMa").addClass("active7");
                    $("#faWrap").show();
                    $("#faWrap1").hide();
                }
            } else {
                console.log("查询激活码交易记录失败");
            }
        },
        error: function() {
            // 超时或后台报错
            console.log("超时或后台报错");
            $scope.alert(ret.msg+"请重新登录");
            $state.go("login");
        }
    });
					
    $.ajax({
        type : "post",
        timeout : 3000,
        url : "/f/coinLog",
        datatype : "json",
        success : function(ret) {
            if (ret.success) {
                console.log(ret);
                var data = ret.data;
                console.log(data);
                for(var i in data) {
                  					var hh;
									var ss;
									if(data[i].receiverName==null){
										hh="本人排单消耗";
										
									}else{
										hh=data[i].receiverName;
									}
										if(data[i].senderName==null){
										ss="系统发放";
										
									}else{
										ss=data[i].senderName;
									}
                    $("#faWrap1").append('<div class="notes"><ul><li><span>' + '发' + '&nbsp;' + '送' + '&nbsp;' + '人:' + '&nbsp;&nbsp;' + '</span><span>' + ss+ '</span><li><li><span>' + '获' + '&nbsp;' + '赠' + '&nbsp;' + '人:' +'&nbsp;&nbsp;' + '</span><span>' + hh + '</span><li><li><span>' + '数          量:' + '&nbsp;&nbsp;' + '</span><span>' + data[i].transCount + '个' + '<span></li><li><li><span>' + '发放时间:' + "&nbsp;&nbsp;" + '</span><span>' + data[i].createTime + '<span></li></ul><div>')
                }
				var lengths=$("#faWrap1 .notes").length;
					$(".conPd").html(lengths);
					if(lengths==0){
						$(".jiHuoMa").addClass("active7");
						$("#faWrap").show();
						$("#faWrap1").hide();
					}
                // 执行成功，返回正确结果
            } else {
                // 执行成功，结果错误
            }
        },
        error : function() {
            // 超时或后台报错
        }
    });
});