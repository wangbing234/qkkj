var app = require('../../app.js');

app.controller("userController",function($scope, $rootScope, $http, $location, $state, $ionicPopup, ls) {
	$scope.user = ls.data.user;
		
	$scope.message = "尊敬的会员您好:请先激活您的会员账户,然后进行实名认证并且填写您的银行卡信息,请确保无误,祝您体验愉快!!!";
	$scope.hideMotai = function(){
		$("#motai").hide();
	}
	$scope.showMotai = function(){
		$("#motai").show();
	}
	$scope.authentication = function(){
		if(!$scope.user.userState || $scope.user.userState===""){
			return;
		}
		switch($scope.user.userState){
			case "正常":
				$scope.alert("您的账户已经实名,请不要重复实名");
				break;
			case "未实名认证":
				$state.go("authentication");
				break;
			case "未激活":
				$scope.alert("请先激活您的会员账户,然后进行实名认证");
				break;
		}
	};

	$scope.logout = function(){
		$ionicPopup.show({
			template: '您确定要退出吗?',
			scope: $scope,
			buttons: [
				{ text: '取消' },
				{
					text: '确定',
					type: 'button-positive',
					onTap: function(e) {
						$scope.logout_action();
					}
				},
			]
		});
	};
	$scope.news=function(){
		$scope.alert("暂无新的新闻消息")
	}
	$scope.logout_action = function(){
		var phone=localStorage.getItem("phoneNum");
		var pwssord=localStorage.getItem("usePw");
		localStorage.clear();
		localStorage.setItem("phoneNum",phone);
		localStorage.setItem("usePw",pwssord);
		$state.go("login");
		$http.post(ROOTCONFIG.host + "/f/bye")
		.success(function(ret){
		})
		.error(function(ret){
		});
	}

	$scope.showalert = function(){
		$scope.alert("暂无新手指南");
	};
});