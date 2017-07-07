var app = require('../../app.js');

app.controller("freezeController",function($scope, $rootScope, $http, $location, $state) {
    $(function(){
        $(".tuiG:last").css("border","0").css("margin-bottom","-0.05rem");			
    });
    
    $.ajax({
		type: "post",
		timeout: 3000,
		url: ROOTCONFIG.host + "/f/matchList", //3.2
		datatype: "json",
		success: function(ret) {
			if(ret.success) {
				console.log(ret)
				var todo = ret.data.todoList;
				var todoLen = todo.length;
				var writeTimes=function(left,i){
                var days=parseInt(left/60/60/24);
                var hours=parseInt((left-days*24*60*60)/60/60);
                var mins=parseInt((left-hours*60*60-days*24*60*60)/60);
                var secs=left-days*24*60*60-hours*60*60-mins*60;
                var timeArr=[days,hours,mins,secs];
                if(days!=0){
                    return  $("#seconds"+i).html(days+"天"+hours+"时"+mins+"分"+secs+"秒");
                }else if(days==0){
                    return $("#seconds"+i).html(hours+"小时"+mins+"分"+secs+"秒");
                }else if(hours==0){
                    return $("#seconds"+i).html(mins+"分"+secs+"秒");
                }else if(mins==0){
                    return $("#seconds"+i).html(secs+"秒");
                }else{
                    return $("#seconds"+i).html(0+"秒");
                }
            }
            var timesCount=function(left,i){
                    setInterval(function(){
                        if(left>0){
                            left--;
                            writeTimes(left,i);
                        }else{
                            return;
                        }
                    },1000);
                }
            for(var i = 0; i < todoLen; i++) {
                if(todo[i].type == 1) {
                    var left=todo[i].left;
                    console.log(todo[0].desc)
                    var $offLi = $("<div class='pre tuiG'><div class='shalou'></div><div class='message'><p><strong>等待您打款,信息如下:</strong></p><p class='mes_right'>"+ todo[i].desc + "</p><b id='seconds"+i+"'></b></div></div>");													
                    $(".daiban").append($offLi);
                    timesCount(left,i);						
                    $('.pre').on("click", function() {
                        var index = $(this).index();
                        $state.go('waitMoney',{'id':todo[index].id});		
                    });
                } else if(todo[i].type == 2) {
                    var left=todo[i].left;
                    var $getLi = $("<div class='next tuiG'><div class='shalou'></div><div class='message'><p><strong>等待您打款,信息如下:</strong></p><p class='mes_right'>"+ todo[i].desc + "</p><b id='seconds"+i+"'></b></div></div>");						
                    $(".daiban").append($getLi);
                    timesCount(left,i);   
                    $('.next').on("click", function() {
                        var index = $(this).index();					
                        $state.go('getMoney',{'id':todo[index].id});		
                    });
                };
            }
            } else {
                // 执行成功，结果错误
                console.log(ret.msg)
            }
        },
        error: function() {
            // 超时或后台报错
            console.log("超时或后台报错");
            $scope.alert(ret.msg+"请先退出后重新登录");
        }
	});
});