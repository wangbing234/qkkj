var app = require('../../app.js');

app.controller("loginController", function($scope, $rootScope, $http, $location, $state, ls) {
    $scope.phoneNumber = localStorage.getItem("phoneNum");
    $scope.passWord = localStorage.getItem("usePw");
    if($scope.phoneNumber==='null'){ $scope.phoneNumber = ''; }
    if($scope.passWord==='null'){ $scope.passWord = ''; }
    $scope.showErrorMsg = function(msg){
        $(".error1").html(msg).fadeIn(2000, function(){ $(this).fadeOut(400); });
    };
    $scope.login = function(){
        if(!/^[1][34578][0-9]{9}$/.test($scope.phoneNumber)){
            $scope.showErrorMsg("你的登录手机号格式不对,请重新输入");
            return;
        }
        if(!$("#xieyi").prop("checked")) {
            $scope.showErrorMsg("请先勾选用户协议");
        }
        if(!$scope.passWord.length){ return; }
        var hash_password = hex_md5($scope.passWord);
        $http({
            url: ROOTCONFIG.host + "/f1/login",
            method:"post",
            data: $.param({
                'phone':$scope.phoneNumber,
                'pwd':hash_password
            }),
        }).success(function(ret){
            if(ret.success) {
                localStorage.setItem("baseRate",ret.data.baseRate);
                localStorage.setItem("pointRate",ret.data.pointRate);
                if(ret.data.token){
                    localStorage.setItem("token",ret.data.token);
                    $http.defaults.headers.common.token = ret.data.token;
                }
                if($("#rem_pw").prop("checked")) {
                    localStorage.setItem("phoneNum",$scope.phoneNumber);
                    localStorage.setItem("usePw",$scope.passWord);
                } else {
                    localStorage.removeItem("usePw");
                }
                if(ret.redirect=="freeze"){
                    $state.go("freeze");
                }else if(ret.redirect=="oldPwd"){
                    $scope.alert('系统账户安全策略升级，请重新设定您的密码！');
                    $state.go("setting");
                }else{
                    $scope.getUserInfo();
                }
            }  else{
                $scope.showErrorMsg(ret.msg);
            }
        }).error(function(ret){
            $scope.showErrorMsg("超时或后台报错");
        });
    };

    $scope.getUserInfo = function(){
        var style_dict = {
            "正常":{"color":"#94c945"},
            "未实名认证":{"color":"#ba1f2f"},
            "未激活":{"color":"#f9e101"},
            "冻结":{"color":"#2aafda"},
        }
        $http.post(ROOTCONFIG.host + "/f/mebInfo")
        .success(function(ret) {
            if(!ret.data){return;}
            var data = ret.data || {};
            ls.setUser('name',data.name);
            ls.setUser('phone',data.phone);
            ls.setUser('refereePhone',data.refereePhone);
            ls.setUser('regdate',data.regdate.substring(0, 10));
            ls.setUser('level',data.level===1?"白银会员":data.level===2?"黄金会员":data.level===3?"钻石会员":"皇冠会员");
            ls.setUser('levelImg',data.levelImg);
            ls.setUser('userState',data.state);
            ls.setUser('userStateStyle',style_dict[data.state]||{"color":"#e02538"});
            if(data.state === '未激活'){
                $rootScope.showAll = false;
                $state.go('main.shop');
            }else{
                $rootScope.showAll = true;
                $state.go('main.donation');
            }
        });
    }

    /*软键盘BUG*/
    var heigHt = window.innerHeight;
    $("#usePhone").focus(function() {
        $("#wrapss").css({ "height": heigHt });
    }).blur(function() {
        $("#wrapss").css({ "height": "100%" });
    });
    $("#pwdd").focus(function() {
        $("#wrapss").css({ "height": heigHt });
    }).blur(function() {
        $("#wrapss").css({ "height": "100%" });
    });
});