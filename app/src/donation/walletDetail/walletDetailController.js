var app = require('../../app.js');

app.controller("walletDetailController", function($scope, $rootScope, $http, $location, $stateParams) {
    var walletId = $stateParams.walletId;
    $scope.walletId = walletId;
    switch(walletId){
        case "1":
            $scope.head_title = "公益钱包明细";
            break;
        case "2":
            $scope.head_title = "推广钱包明细";
            break;
        case "3":
            $scope.head_title = "消费钱包明细";
            break;
        default:
            $state.go("home");
            break;
    }

    $http({
		url: ROOTCONFIG.host + "/f/walletDetail",
		method:"post",
        data: $.param({ id: walletId })
	}).success(function(ret){
		if(ret.success) {
            $scope.list = ret.data;
        }
	}).error(function(ret){
		console.log("超时或后台报错");
	});

    $http({
		url: ROOTCONFIG.host + "/f/wallet",
		method:"post",
	}).success(function(ret){
		console.log(ret)
		if(ret.success) {
            $scope.baseProfit = ret.data.profit;
            $scope.growProfit = ret.data.growProfit;
		} else {
			$scope.alert(ret.msg);
		}
	}).error(function(ret){
		console.log("超时或后台报错");
	});

});