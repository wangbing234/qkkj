var app = require('../../app.js');
require('./confirmController');

app.controller("getDonationController", function($scope, $rootScope, $http, $location, $state) {
    $scope.walletType = 0;
    
    $http({
		url: ROOTCONFIG.host + "/f/wallet",
		method:"post",
	}).success(function(ret){
		if(ret.success) {
			var datas = ret.data;
            $scope.baseFree = ret.data.baseFree;
            $scope.baseTrading = ret.data.baseTrading;
            $scope.baseFreeze = ret.data.baseFreeze;
            $scope.growFree = ret.data.growFree;
            $scope.growTrading = ret.data.growTrading;
		} else {
			$scope.alert(ret.msg);
		}
	}).error(function(ret){
		console.log("超时或后台报错");
	});


    $scope.chooseWalletType = function(type){
        $scope.walletType = type;
    };

    $scope.submit = function(){
        if($scope.walletType===0) {
            localStorage.setItem("qbId",1)
            localStorage.setItem("keyong",$scope.baseFree);
        }else if($scope.walletType===1) {
            localStorage.setItem("qbId",2);
            localStorage.setItem("keyong",$scope.growFree);
        }
        $state.go("getDonationConfirm");
    };
});
