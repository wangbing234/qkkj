var app = require('../../app.js');

app.controller("signinController",function($scope, $rootScope, $http, $location, $state) {
	$scope.signState = '签&nbsp;&nbsp;到'; 

	$scope.submit = function(){
		$http({
			url: ROOTCONFIG.host + "/f/signMember",
			method:"post",
		}).success(function(ret){
			if(ret.success) {
				var data=ret.data;
				if(data=='null'){
					$scope.alert(ret.msg);	
				}else{
					window.location.reload();
				}
			}
		}).error(function(ret){
			$scope.alert("请求出错");
		});
	};

	$http({
		url: ROOTCONFIG.host + "/f/getSignData",
		method:"post",
	}).success(function(ret){
		if(ret.success) {
			$scope.signState = ret.data.isSign?'已签到':'签&nbsp;&nbsp;到'; 
			
			var num = ret.data.days;
			if(num >=999){
				num = 999;
			}else{
				var len = num.toString().length;  
				while(len < 3) {  
					num = "0" + num;  
					len++;  
				}
			}
			$scope.days = num;

			$scope.signDays2 = ret.data.bonusList[0].signDays2; //签到天数
			$scope.signDays = ret.data.bonusList[0].signDays; //要求签到天数
			var percent = (($scope.signDays2 / $scope.signDays) * 100);
			var progress = (percent > 100 ? 100 : percent) +"%";
			$('.ah').css('width',progress);

			$scope.bonusSum = ret.data.bonusList[0].bonusSum; //已获奖励数量
		}
	}).error(function(ret){
		$scope.showErrorMsg("请求出错");
	});

});