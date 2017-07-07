var app = require('../../app.js');

app.controller("shopSearchController", function ($scope, $rootScope, $ionicLoading, $http, $state) {
    $scope.searchContent = "";

    $scope.search = function () {
        $ionicLoading.show({ template: '数据加载中...' });
        $('input').blur();
        $http({
            url: ROOTCONFIG.host + "/shop/product!loadProducts.action?catalogCode=&orderBy=0&special=&key="+$scope.searchContent+"&pager.offset=0",
            method:"post",
        }).success(function(ret){
            $ionicLoading.hide();
            if( ret.data && ret.data.length>0 ){ 
                $scope.productList = ret.data;
            }else{
                $scope.alert('未搜索到相关产品');
            }
        }).error(function(ret){
            $ionicLoading.hide();
            console.log("超时或后台报错");
        });
    };

    $scope.clearSearch = function(){
        $scope.searchContent = "";
        $scope.productList = [];
    };

    $scope.gotoCart = function(){
        $scope.closeModal();
        $state.go('cart');
    };

});