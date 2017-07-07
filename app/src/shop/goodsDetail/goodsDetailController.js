var app = require('../../app.js');

app.controller("goodsDetailController", function($scope, $rootScope, $http, $location, $state, $stateParams, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicLoading, ls) {
    $scope.account = ls.data.account;

    $scope.vm = {
        amount: 1
    };

    $scope.tabIndex = 0; 
    $scope.tab = function(index){
        $scope.tabIndex = index;
        $ionicScrollDelegate.resize();
    }

    $scope.changeAmount = function(val){
        $scope.vm.amount += val;
        $scope.checkValid();
    };

    $scope.checkValid = function(val){
        if(!$scope.vm.amount){
            $scope.vm.amount = 1;
        }
    };

    $scope.opacity = 1;
    $scope.scrollHandler = function(){
        var top = $ionicScrollDelegate.getScrollPosition().top;
        if(top<0){
            $scope.opacity = 1;
        }else if(top >44){
            $scope.opacity = 0;
        }else{
            $scope.opacity = (44 - top)/44;
        }
        $scope.$evalAsync();
    };

    $scope.scrollTop = function(){
        $ionicScrollDelegate.scrollTop();
    }

    $http({
        url: ROOTCONFIG.host + "/shop/product/productDetail.html?e.id="+$stateParams.id,
        method:"get",
    }).success(function(ret){
        if(ret.code !== 0 || !ret.data ){ return; }
        $scope.goodData = ret.data;
        $scope.productHTML = ret.data.productHTML;
        $scope.productImageList = ret.data.productImageList;
        $scope.isFavorate = ret.data.favoriteed;
        $ionicSlideBoxDelegate.update();
        $ionicSlideBoxDelegate.loop(true);
    }).error(function(ret){
        console.log("超时或后台报错");
    });

    $http({
        url: ROOTCONFIG.host + "/shop/api.action?a=getProduct&pid="+$stateParams.id,
        method:"get",
    }).success(function(ret){
        if(ret.code !== 0 || !ret.data ){ return; }
        $scope.goodProperty = ret.data;
    }).error(function(ret){
        console.log("超时或后台报错");
    });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                

    $scope.addToCart = function(redirect){
        if(!$scope.goodData){return;}
        var specs = JSON.parse($scope.goodData.specJsonString);
        $http({
            url: ROOTCONFIG.host + "/shop/cart!addToCart.action?productID="+$stateParams.id+"&buyCount="+$scope.vm.amount+"&buySpecID="+(specs&&specs.length>0?specs[0].id:'0'),
            method:"get",
        }).success(function(ret){
            if(ret.code === 0){
                ls.setAccount('cartNumber',$scope.account.cartNumber + $scope.vm.amount);
                $ionicLoading.show({ template: '加入购物车成功', duration: 1000, noBackdrop: true });
                if(redirect){ $state.go('cart'); }
            }
        }).error(function(ret){
            console.log("超时或后台报错");
        });
    };

    $scope.addToFavorite = function(){
        if($scope.isFavorate){
            $http({
                url: ROOTCONFIG.host + "/shop/user/deleteFavoriteAjax.html?id="+$stateParams.id,
                method:"get",
            }).success(function(ret){
                if(ret.code === 0){
                    $ionicLoading.show({ template: '取消收藏成功', duration: 1000, noBackdrop: true });
                    $scope.isFavorate = false;
                }
            }).error(function(ret){
                console.log("超时或后台报错");
            });
        }else{
            $http({
                url: ROOTCONFIG.host + "/shop/product/addToFavorite.html?productID="+$stateParams.id+"&radom="+Math.random(),
                method:"get",
            }).success(function(ret){
                if(ret.code === 0){
                    $ionicLoading.show({ template: '加入收藏成功', duration: 1000, noBackdrop: true });
                    $scope.isFavorate = true;
                }
            }).error(function(ret){
                console.log("超时或后台报错");
            });
        }
    };

});