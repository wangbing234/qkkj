var app = require('../../app.js');

app.controller("feedbackController",function($scope, $rootScope, $http, $location, $state) {
    var ridMsg;
    $.ajax({
        type: "post",
        timeout: 3000,
        url: ROOTCONFIG.host + "/f/msgType",
        datatype: "json",
        success: function(ret) {
            console.log(ret)
            if(ret.success) {
                console.log(ret)
                var data = ret.data;
                for(var i in data) {
                    $("#xuze").append("<span class='weni'>" + data[i].typeName + "</span>")
                }
                $(".weni").on("touchstart", function() {
                    var index = $(this).index();
                    $(this).addClass("active").siblings().removeClass("active");
                    ridMsg = data[index].rid;
                })
            } else {
                // 执行成功，结果错误
            }
        },
        error: function() {
            // 超时或后台报错
        }
    });

    $("#btnss").click(function() {
        var vs = $("#seMsg").val();
        ridMsg=ridMsg;
        console.log(ridMsg)
        if(vs==""){
            $scope.alert("请输入您的留言");
        }else if(ridMsg==undefined){
            $scope.alert("请选择您的问题类型");
        }else{		
            send(ridMsg,vs)
        }
    })
    function send(ridMsg,vs){	
        $.ajax({
            type: "post",
            timeout: 3000,
            url: ROOTCONFIG.host + "/f/msg",
            data: {
                typeId: ridMsg,
                msg: vs
            },
            datatype: "json",
            success: function(ret) {
                if(ret.success) {
                    console.log(ret);
                    // 执行成功，返回正确结果
                    $scope.alert(ret.msg);
                } else {
                    // 执行成功，结果错误
                    console.log(ret.msg)
                }
            },
            error: function() {
                // 超时或后台报错
            }
        });
    }
});