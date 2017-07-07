var app = require('../../app.js');

app.controller("payController", function ($scope, $rootScope, $http, $location, $state, Util, $stateParams, $ionicLoading, $timeout) {
	var imgFile ;

	$scope.img_upload = function (files) {
		imgFile = files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			$scope.$apply(function(){
				$scope.imgSrc = e.target.result
			});
		};
		reader.readAsDataURL(files[0]);
	};

	$scope.submit= function(){
		if(!$scope.imgSrc){ return; }
		if(imgFile.size/1024 > 2000){
			$scope.alert("图片不能大于2M");
			return;
		}
		var data = new FormData();      //以下为像后台提交图片数据
		data.append('file', imgFile);
		data.append('isSaveScore', $scope.vm.keepPoint?1:0 );
		data.append('userScore', $scope.vm.useScore);
		data.append('userScoreTicket', $scope.vm.useScoreTicket);

		$ionicLoading.show({ template: '数据加载中...' });
		$http({
			method: 'post',
			url: ROOTCONFIG.host + '/shop/order/payOrders.html?e.id=' + $scope.vm.id + '&e.status=sure',
			data: data,
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		}).success(function (ret) {
			$ionicLoading.hide();
			if(ret.code === 0){
				$scope.paySuccess(ret);
			}
		}).error(function(ret){
			$ionicLoading.hide();
			$scope.alert(ret);
		});
	};

});