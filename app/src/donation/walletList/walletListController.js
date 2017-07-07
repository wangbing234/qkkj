var app = require('../../app.js');

app.controller("walletListController", ["$scope", "$rootScope", "$http", "$location", function($scope, $rootScope, $http, $location) {
    setInterval(function() {
		$(".youjiantou").fadeOut(1000).fadeIn(1000);
	}, 500);
	
	function thousandBitSeparator(num) {
		var number = num.toFixed(2)
		var s = number.toString();
		if(s.indexOf('.') > 0) {
			return "￥" + s.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
		} else {
			return "￥" + s.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
		}
	}
	
	$http({
		url: ROOTCONFIG.host + "/f/wallet",
		method:"post",
	}).success(function(ret){
		if(ret.success) {
			var datas = ret.data;
			//公益钱包
			$scope.baseFree = thousandBitSeparator(datas.baseFree);
			$scope.baseTrading = thousandBitSeparator(datas.baseTrading);
			$scope.baseFreeze = thousandBitSeparator(datas.baseFreeze);
			//推广钱包
			$scope.growFree = thousandBitSeparator(datas.growFree);
			$scope.growTrading = thousandBitSeparator(datas.growTrading);
			//消费钱包
			$scope.shopFree = thousandBitSeparator(datas.shopFree);
			$scope.shopTrading = thousandBitSeparator(datas.shopTrading);
			$scope.shopFreeze = thousandBitSeparator(datas.shopFreeze);
			$scope.shopShopping = thousandBitSeparator(datas.shopShopping);
			//推荐钱包
			$scope.rewardShopping = thousandBitSeparator(datas.rewardShopping);
			$scope.rewardFree = thousandBitSeparator(datas.rewardFree);
			//交易积分钱包
			$scope.pointInactive = datas.pointInactive;
			$scope.pointFree = datas.pointFree;
			//消费积分钱包
			$scope.point2Free = datas.point2Free;
			$scope.point2Shopping = datas.point2Shopping;
		} else {
			$scope.alert(ret.msg);
		}
	}).error(function(ret){
		console.log("超时或后台报错");
	});

}]);