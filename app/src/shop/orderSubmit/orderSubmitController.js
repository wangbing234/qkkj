var app = require('../../app.js');

app.controller("orderSubmitController", function($scope, $rootScope, $http, $location, $state, $ionicLoading, $ionicModal, $ionicHistory, ls) {
    $scope.buyNumber = 0;
    $scope.amount = 0;
    
    $http({
        url: ROOTCONFIG.host + "/shop/order/confirmOrders.html",
        method:"post",
    }).success(function(ret){
        if(ret.code !== 0 || !ret.data ){ return; }
        $scope.updateProductList(ret.data);
        $scope.addressList = ret.data.addressList;
        $scope.defaultAddress = $scope.addressList[0];
        if(!$scope.errorMessage && $scope.addressList.length<=0 ){
            $scope.errorMessage = "请添加收货地址";
        }
    }).error(function(ret){
        console.log("超时或后台报错");
    });

    $scope.updateProductList = function(data){
        $scope.buyNumber = 0;
        $scope.amount = 0;
        $scope.productList = data.productList;
        for(var i in $scope.productList){
            var product = $scope.productList[i];
            $scope.buyNumber = $scope.buyNumber + product.buyCount;
            $scope.amount = $scope.amount + product.buyCount * parseInt(product.nowPrice);
        }
        $scope.errorMessage = data.scoreProxy.oldMessage || '';
        $scope.totalExchangeMoney = data.scoreProxy.cutMoney;
        $scope.totalExchangeWallet = data.scoreProxy.cutWallet;
        $scope.totalExchangeScore = data.scoreProxy.cutScore;
        localStorage.setItem('productList', JSON.stringify($scope.productList));
    }

    $scope.deleteItem = function(index){
        $http({
            url: ROOTCONFIG.host + "/shop/cart/delete.html?id=" + $scope.productList[index].id,
            method:"get",
        }).success(function(ret){
            if(ret.code !== 0 || !ret.data ){ return; }
            $scope.updateProductList(ret.data);
        }).error(function(ret){
            console.log("超时或后台报错");
        });
    };

    $scope.submit = function(){
        if($scope.errorMessage){ return; }
        if(!$scope.productList || $scope.productList.length<=0){ return; }

        $ionicLoading.show({ template: '数据加载中...' });
        $http({
            url: ROOTCONFIG.host + "/shop/order/submitOrders.html",
            data: $.param({ 'e.selectAddressID':$scope.defaultAddress.id, }),
            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
            method:"post",
        }).success(function(ret){
            $ionicLoading.hide();
            ls.setAccount('cartNumber',0);
            $state.go('orderPay',{id:ret.data.id});
        }).error(function(ret){
            $ionicLoading.hide();
        });
    };

    $scope.chooseAddress = function(){
        $ionicModal.fromTemplateUrl('./shop/orderSubmit/addressSelect.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.addressModal = modal;
            $scope.addressModal.show();
        });
    };

    $scope.closeModal = function(){
        $scope.addressModal.hide();
    };

    $scope.selectAddress = function(index){
        $scope.defaultAddress = $scope.addressList[index];
        $scope.addressModal.hide();
    };

});