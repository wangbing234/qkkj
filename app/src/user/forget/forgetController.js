var app = require('../../app.js');

app.controller("forgetController",function($scope, $rootScope, $interval, $http, $location, $state) {
	$scope.countDown = 0;
	$scope.vm = {
		'userAccount':'',
		'userName':'',
		'verifyCode':'',
		'pwd1':'',
		'pwd2':'',
	};

	$scope.getVerifyCode = function(){
		if($scope.countDown!==0){return;}
		if($scope.vm.userAccount==""||$scope.vm.userName==""){
			$scope.showErrorMsg("请填写手机号和真实姓名");return;
		}
		if((!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.vm.userAccount))
			&&(!/^[1][3578][0-9]{9}$/.test($scope.vm.userAccount))){
			$scope.showErrorMsg("请填写正确的手机号和姓名");return;
		}

		$scope.countDown = 60;
		var timer = $interval(function(){
			if($scope.countDown - 1 === 0){
				$scope.countDown = 0;
			}else{
				$scope.countDown = $scope.countDown - 1;
			}
		}, 1000, 60);

		$http({
            url: ROOTCONFIG.host + "/f1/yzm2",
            method:"post",
            data: $.param({
				phone : $scope.vm.userAccount,
				name: $scope.vm.userName
            }),
            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
        }).success(function(ret){
           if (ret.success) {
				$scope.alert(ret.msg);
			} else {
				$scope.alert(ret.msg);
			}
        }).error(function(ret){
            $scope.showErrorMsg("请求超时");
        });
	};

	$scope.showErrorMsg = function(msg){
		$("#error2 span").html(msg).fadeIn(500, function(){ $(this).fadeOut(500); });
	};

    $scope.changePassword = function(){
		if($scope.vm.userAccount==""||$scope.vm.pwd1==""||$scope.vm.pwd2==""||$scope.vm.userName==""||$scope.vm.verifyCode==""){
			$scope.showErrorMsg("请填写完整信息");return;
		}
		if((!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.vm.userAccount))
			&&(!/^[1][3578][0-9]{9}$/.test($scope.vm.userAccount))){
			$scope.showErrorMsg("注册手机号格式有误");return;
		}
		if(!/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,36}$/.test($scope.vm.pwd1)){
			$scope.showErrorMsg("密码由大写字母，小写字母和数字组成且长度在8-36位之间");return;
		}
		if(!/^\d{6}\b/.test($scope.vm.verifyCode)){
			$scope.showErrorMsg("验证码为6位数字");return;
		}
		if($scope.vm.pwd1 !== $scope.vm.pwd2){
			$scope.showErrorMsg("两次密码输入不一致");return;
		}
		if(!/^[\u4E00-\u9FA5]{2,10}$/.test($scope.vm.userName)){
			$scope.showErrorMsg("请输入有效姓名");return;
		}

		$http({
            url: ROOTCONFIG.host + "/f1/forget",
            method:"post",
            data: $.param({
                pwd: hex_md5($scope.vm.pwd1),
				phone: $scope.vm.userAccount,
				name: $scope.vm.userName,
				yzm: $scope.vm.verifyCode
            }),
            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
        }).success(function(ret){
            if (ret.success) {
				$scope.alert(ret.msg);
				$state.go("login");
			} else {
				$scope.alert(ret.msg);
			}
        }).error(function(ret){
            $scope.showErrorMsg("请求超时");
        });
	};
	
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
});