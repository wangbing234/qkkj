var app = require('../../app.js');

app.controller("goodsListController", function($scope, $rootScope, $http, $timeout, $state, $stateParams, $ionicTabsDelegate, $ionicScrollDelegate, $ionicSlideBoxDelegate, ls) {
    if(!$stateParams.type){ $state.go('main.shop'); }
    $scope.type = $stateParams.type;
    $scope.title = $scope.type === 'billing'?'开单商品':$scope.type === 'donation'?'重销商品':$scope.type === 'point'?'积分商品':'';
    $scope.account = ls.data.account;
    
    $scope.billingGoods = [];
    $scope.billingPage = 0;

    $scope.pointGoods = [];
    $scope.pointPage = 0;

    $scope.donationGoods = [];
    $scope.donationPage = 0;

    $scope.getGoodsData = function(type){
        if(type === 'billing'){ if($scope.billingLoading){ return; }else{ $scope.billingLoading = true; } }
        if(type === 'donation'){ if($scope.donationLoading){ return; }else{ $scope.donationLoading = true; } }
        if(type === 'point'){ if($scope.pointLoading){ return; }else{ $scope.pointLoading = true; } }
        var productType = type==='billing'?'38':type==='donation'?'31':'37';
        var page = type==='billing'?$scope.billingPage:type==='donation'?$scope.donationPage:$scope.pointPage;
        // orderBy 0id排序 1点击量降序 -1点击量升序 2价格降序 -2价格升序 3销售量降序 -3销售量升序
        $http({
            url: ROOTCONFIG.host + "/shop/product!loadProducts.action?catalogCode=&&orderBy=-2&special=&pager.offset="+(page*12)+"&productType="+productType,
            method:"get",
        }).success(function(ret){
            if(!ret.data){ return; }
            if(type==='billing'){
                if(ret.data.length <= 0){ $scope.billingLoaded = true; }
                $scope.billingGoods = $scope.billingGoods.concat(ret.data);
                $scope.billingPage = $scope.billingPage + 1;
                $scope.billingLoading = false;
            }else if(type==='donation'){
                if(ret.data.length <= 0){ $scope.donationLoaded = true; }
                $scope.donationGoods = $scope.donationGoods.concat(ret.data);
                $scope.donationPage = $scope.donationPage + 1;
                $scope.donationLoading = false;
            }else if(type==='point'){
                if(ret.data.length <= 0){ $scope.pointLoaded = true; }
                $scope.pointGoods = $scope.pointGoods.concat(ret.data);
                $scope.pointPage = $scope.pointPage + 1;
                $scope.pointLoading = false;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }).error(function(ret){
            console.log("超时或后台报错");
        });
    };

    $scope.goodsDetail = function(id){
        $state.go('goodsDetail',{'id':id});
    };

    $scope.toShopIndex = function(){
        $state.go('main.shop');
    };

});
