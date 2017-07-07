var app = require('../../app.js');

app.controller("addressController", function($scope, $rootScope, $http, $ionicModal, $state, $stateParams) {
	 $scope.addressList = [];
	 
	 $http({
        url: ROOTCONFIG.host + "/shop/user/addressList.html",
        method:"post",
    }).success(function(ret){
        if(ret.code !== 0 || !ret.data ){ return; }
		$scope.addressList = ret.data;
		for(var i in $scope.addressList){
			if($scope.addressList[i].isDefault==='y'){$scope.defaultAddressIndex = i;break;}
		}
    }).error(function(ret){
        console.log("超时或后台报错");
    });

	$scope.changeDefault = function(index){
		if($scope.defaultAddressIndex===index){return;}
		var rid = $scope.addressList[index].rid;
		var addr = $scope.addressList[index].addr;
		$http({
			url: ROOTCONFIG.host + "/f/addrDefUp",
			method: "post",
			data: $.param({ id: rid }),
            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
		}).success(function(ret){
			$scope.addressList[index].isDefault=1;
		}).error(function(ret){
			
		});
	};
	
	$scope.addAddressVM = {};
 	// 修改地址
	$scope.changeAddress = function(index){
		var data = $scope.addressList[index];
		$scope.addAddressVM = {
			'name': data.name,
			'address': data.address,
			'zip': data.zip,
			'phoneNumber': data.mobile,
			'selectedAddress':{
				'province':{ 'code':data.province, 'name':data.pcadetail.split(' ')[0] },
				'city':{ 'code':data.city, 'name':data.pcadetail.split(' ')[1] },
				'area':{ 'code':data.area, 'name':data.pcadetail.split(' ')[2] }
			},
			'id': data.id,
			'index': index
		}
		$ionicModal.fromTemplateUrl('./user/address/addAddress.html', {
			scope:$scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.editAddressModal = modal;
			$scope.editAddressModal.show();
		});
	}

	$scope.addAddress = function(){
		$scope.addAddressVM = {}
		$ionicModal.fromTemplateUrl('./user/address/addAddress.html', {
			scope:$scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.editAddressModal = modal;
			$scope.editAddressModal.show();
		});
	}
	
	$scope.closeModal = function(){
        $scope.editAddressModal.remove();
    };

	// 删除地址
	$scope.deleteAddress = function(index){
		if($scope.defaultAddressIndex===index){$scope.alert("默认地址不能删除");return;}
        $http({
			url: ROOTCONFIG.host + "/shop/user/deleteAddressAjax.html?id=" + $scope.addressList[index].id,
			method: "get",
		}).success(function(ret){
			if(ret.code === 0){
				$scope.addressList.splice(index,1);
			}
		}).error(function(ret){
			
		});          
	}

});

