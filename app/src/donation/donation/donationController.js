var app = require('../../app.js');

app.controller("donationController", function($scope, $rootScope, $http, $ionicLoading, $timeout, $parse, $ionicSlideBoxDelegate, $ionicModal, $state) {
	$scope.baseRate = localStorage.getItem("baseRate");
    $scope.pointRate = localStorage.getItem("pointRate");
	var slideBox;
	
	$scope.$on('$ionicView.loaded', function () {
		$timeout(function () {
			slideBox = $ionicSlideBoxDelegate._instances.filter(function (s) {
				if (!s.$$delegateHandle) return false;
				return $parse(s.$$delegateHandle.slice(2, -2));
			})[0];
		}).then(function () {
			slideBox.enableSlide(false);
		});
	});

	if(!$rootScope.adsShowed){
		$rootScope.adsShowed = true;
		$ionicModal.fromTemplateUrl('./donation/donation/ads.html', {
			scope: $scope,
			animation: 'fadeIn'
		}).then(function (modal) {
			$scope.ADSModal = modal;
			$scope.ADSModal.show();
		});
	}

	$scope.closeAds = function(){
		$scope.ADSModal.remove();
	};

	$scope.tab = function(index){
		$scope.tabIndex = index;
		if(slideBox){slideBox.slide(index);}
	};

	$scope.activeTab = function(index){
		$scope.tabIndex = index;
	};

	$scope.waitHandler = function(index){
		var type = $scope.waitList[index].type;
		switch(type){
			case 1:
				break;
			case 2:
				break;
			case 3:
				$state.go("provideInformation",{"id":$scope.waitList[index].id});
				break;
			case 4:
				$state.go("getInformation",{"id":$scope.waitList[index].id});
				break;
		}
	}

	$scope.todoHandler = function(index){
		var type = $scope.todoList[index].type;
		switch(type){
			case 1:
				$state.go("waitMoney",{"id":$scope.todoList[index].id});
				break;
			case 2:
				$state.go("getMoney",{"id":$scope.todoList[index].id});
				break;
		}
	}
	
	$scope.finishHandler = function(index){
		var type = $scope.finishList[index].type;
		switch(type){
			case 1:
				$state.go("provideInformation",{"id":$scope.finishList[index].id});
				break;
			case 2:
				$state.go("getInformation",{"id":$scope.finishList[index].id});
				break;
		}
	}

	$ionicLoading.show({ template: '数据加载中...' });
	$http({
		url: ROOTCONFIG.host + "/f/matchList",
		method:"post",
	}).success(function(ret){
		if(ret.success) {
			$scope.todoList = ret.data.todoList;
			$scope.waitList = ret.data.waitList;
			$scope.finishList = ret.data.finishList;
			if($scope.todoList.length>0){
				$scope.tab(1);
			}else if($scope.waitList.length>0){
				$scope.tab(0);
			}else if($scope.finishList.length>0){
				$scope.tab(2);
			}else{
				$scope.tab(0);
			}
			if(slideBox){slideBox.update();}
		} else {
			console.log(ret.msg);
		}
		$ionicLoading.hide();
	}).error(function(ret){
		$ionicLoading.hide();
		console.log("超时或后台报错");
	});
});
