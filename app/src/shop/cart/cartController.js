var app = require('../../app.js');

app.controller("cartController", function($scope, $rootScope, $http, $location, $state, $ionicLoading, ls) {
    $scope.amount = 0;
    $scope.buyNumber = 0;
    $scope.account = ls.data.account;
    $scope.productList = [];
    
    $http({
        url: ROOTCONFIG.host + "/shop/cart/cartDetail.html",
        method:"get",
    }).success(function(ret){
        if(ret.code !== 0 ){ return; }
        $scope.updateProductList(ret.data);
    }).error(function(ret){
        console.log("超时或后台报错");
    });

    $scope.updateProductList = function(data){
        $scope.amount = 0;
        $scope.buyNumber = 0;
        $scope.productList = data && data.productList || [];
        for(var i in $scope.productList){
            $scope.buyNumber = $scope.buyNumber + $scope.productList[i].buyCount;
            $scope.amount = $scope.amount + $scope.productList[i].buyCount * parseInt($scope.productList[i].nowPrice);
        }
        localStorage.setItem('productList', JSON.stringify($scope.productList));
        ls.setAccount('cartNumber',$scope.buyNumber);
    };
    
    $scope.changeNumber = function(index,val){
        var product = $scope.productList[index];
        if(product.buyCount <= 1 && val < 0){ return; }
        $ionicLoading.show({ template: '数据加载中...' });
        var buyNumber = product.buyCount + val;
        $http({
            url: ROOTCONFIG.host + "/shop/cart/changeCartNum.html?currentBuyNumber="+buyNumber+"&productID="+product.id+"&buySpecID="+product.buySpecInfo.id+"&radom="+Math.random(),
            method:"get",
        }).success(function(ret){
            $ionicLoading.hide();
            if(ret.code !== 0 ){ return; }
            $scope.updateProductList(ret.data);
        }).error(function(ret){
            $ionicLoading.hide();
            console.log("超时或后台报错");
        });
    };

    $scope.deleteItem = function(index){
        $ionicLoading.show({ template: '数据加载中...' });
        $http({
            url: ROOTCONFIG.host + "/shop/cart/delete.html?id=" + $scope.productList[index].id,
            method:"get",
        }).success(function(ret){
            $ionicLoading.hide();
            if(ret.code !== 0 ){ return; }
            $scope.updateProductList(ret.data);
        }).error(function(ret){
            $ionicLoading.hide();
            console.log("超时或后台报错");
        });
    };
    
    $scope.orderSubmit = function(){
        if(!$scope.productList || $scope.productList.length<=0){ return; }
        $state.go('orderSubmit');
    };

});