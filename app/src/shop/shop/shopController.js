var app = require('../../app.js');

app.controller("shopController", function($scope, $rootScope, $http, $timeout, $parse, $location, $state, $ionicSlideBoxDelegate, ls, $ionicModal) {
	$scope.account = ls.data.account;
	var slideBox;
	$scope.$on('$ionicView.loaded', function () {
		$timeout(function () {
			slideBox = $ionicSlideBoxDelegate._instances.filter(function (s) {
				if (!s.$$delegateHandle) return false;
				return $parse(s.$$delegateHandle.slice(2, -2));
			})[0];
		});
	});
	
	var userPhoneNumber = localStorage.getItem('phoneNum');

	$scope.getShopIndexData = function(callback){
		$scope.hot_billing_product = null;
		$scope.hot_donation_product = null;
		$scope.hot_point_product = null;
		$http({
			url: ROOTCONFIG.host + "/shop/user/toShop.html?rid="+userPhoneNumber,
			method:"get",
		}).success(function(ret){
			if(ret.code !== 0 || !ret.data ){ return; }
			ls.setAccount('point',ret.data.point.point_free);
			ls.setAccount('ticket',ret.data.point.point2_free);
			$scope.carousel = ret.data.indexImage;
			if(slideBox){
				slideBox.update();
				slideBox.loop(true);
			}
			var catalogsItems = ret.data.catalogsItems;
			$scope.point_product = catalogsItems;
			var hotProduct = ret.data.hotProduct;
			for(var i in hotProduct){
				switch(hotProduct[i].productType){
					case 31:
						if(!$scope.hot_donation_product){
							$scope.hot_donation_product = hotProduct[i];//重销热门
						}
						break;
					case 37:
						if(!$scope.hot_point_product){
							$scope.hot_point_product = hotProduct[i];//积分热门
						}
						break;
					case 38:
						if(!$scope.hot_billing_product){
							$scope.hot_billing_product = hotProduct[i];//开单热门
						}
						break;
				}
			}
			if(callback)callback();
		}).error(function(ret){
			console.log("超时或后台报错");
		});
	};

	$scope.getShopIndexData();

	$scope.doRefresh = function(){
		$scope.getShopIndexData(function(){
			$scope.$broadcast('scroll.refreshComplete');
		});
	}

	$scope.goodDetail = function(param){
		if( !param ){ return; }
		if( $scope.searchModal ){ $scope.searchModal.remove(); }
		var id;
		if(typeof(param)==='string'){
			switch(param){
				case "hot_donation_product":
					id = $scope.hot_donation_product && $scope.hot_donation_product.id;
					break;
				case "hot_billing_product":
					id = $scope.hot_billing_product && $scope.hot_billing_product.id;
					break;
				case "hot_point_product":
					id = $scope.hot_point_product && $scope.hot_point_product.id;
					break;
			}
		}else if(typeof(param)==='number'){
			id = param;
		}
		if(!id ){ return; }
		$state.go('goodsDetail',{'id':id});
	};

	$scope.search = function(){
		$ionicModal.fromTemplateUrl('./shop/shop/search.html', {
            scope: $scope,
        }).then(function (modal) {
            $scope.searchModal = modal;
            $scope.searchModal.show();
        });
	};
	
	$scope.closeModal = function(){
		$scope.searchModal.hide();
	};

});