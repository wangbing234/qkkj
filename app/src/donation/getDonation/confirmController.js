var app = require('../../app.js');

app.controller("getDonationConfirmController", ["$scope", "$rootScope", "$http", "$location", function($scope, $rootScope, $http, $location) {
    var qbId = parseInt(localStorage.getItem("qbId"));
    var keyong;

    $scope.vm = {
        amount:''
    };

    $http({
		url: ROOTCONFIG.host + "/f/toExit",
		method:"post",
	}).success(function(ret){
		if(ret.success) {
            var data = ret.data;
            $scope.limit = ret.data.limit;
            if(qbId == 1) {
                keyong = data.baseFree;
            }else if(qbId == 2) {
                keyong = data.growFree;
            }
		} else {
			$scope.alert(ret.msg);
		}
	}).error(function(ret){
		console.log("超时或后台报错");
	});

    $scope.submit = function(){
        $scope.alert("系统暂时暂停该服务");
        return;
        if(!/^[1-9]\d*00$/.test($scope.vm.amount)){
            $(".err1").html("请输入100的整数倍金额").fadeIn(2000, function() {
                $(this).fadeOut(4000);
            });
            return;
        }
        if(parseInt($scope.amount)>parseInt(keyong)){
            $(".err1").html("余额不足").fadeIn(2000, function() {
                $(this).fadeOut(4000);
            });
            return;
        }
        $http({
            url: ROOTCONFIG.host + "/f/exit",
            method:"post",
            data: $.param({
                'id':qbId,
                'amount': $scope.vm.amount,
            }),
            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
        }).success(function(ret){
            if(ret.success) {
                $scope.alert(ret.msg);
                $state.go('main.donation');
            } else {
                $scope.alert(ret.msg);
            }
        }).error(function(ret){
            console.log("超时或后台报错");
        });
    };
   
}]);