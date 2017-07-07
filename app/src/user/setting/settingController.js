var app = require('../../app.js');

app.controller("settingController",function($scope, $rootScope, $http, $location, $state) {
    $("#qued").click(function(){
        var yzpwd =/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,36}$/
        var phoneNum = /^[1][34578][0-9]{9}$/;
        var oldPwd=$("#oldPwd").val();
        var hashOld = hex_md5(oldPwd);
        var newPwd=$("#pwd3").val();
        var newPwd1=$("#pwd4").val();
        var phoneZ=$("#phoneZ").val();
        var hashNew=hex_md5(newPwd);
        var bool3=yzpwd.test(newPwd);
        var bool4 = phoneNum.test(phoneZ);
        var oerror = $("#error2 span");
        oerror.hide().html("");
        if(phoneZ == "" || oldPwd == "" || newPwd == "") {
            oerror.html("请填写完整信息").fadeIn(2000, function() {
                $(this).fadeOut(100);
            });
        } else if(!bool4) {
            oerror.html("注册手机号格式有误").fadeIn(2000, function() {
                $(this).fadeOut(100);
            });
        }else if(!bool3) {
            oerror.html("密码由大写字母，小写字母和数字组成且长度在8-36位之间").fadeIn(2000, function() {
                $(this).fadeOut(100);
            });
        }else if(!(newPwd === newPwd1)) {
            oerror.html("两次密码输入不一致").fadeIn(2000, function() {
                $(this).fadeOut(100);
            });
        }else{
            $http({
                url: ROOTCONFIG.host + "/f/pwd",
                method:'POST',
                data: $.param({
                    'phone': phoneZ,
                    'oldPwd': hashOld,
                    'newPwd': hashNew
                }),
            }).success(function(ret){
                if (ret.success) {
                    $scope.alert(ret.msg);
                    // 执行成功，返回正确结果
                    window.history.back();
                } else {
                    $scope.alert(ret.msg);
                    // 执行成功，结果`错误
                }
            }).error(function(ret){
                $scope.alert(ret.msg);
            });
        }
    })
});