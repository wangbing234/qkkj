var app = require('../../app.js');

app.controller("favoriteController", function($scope, $rootScope, $http, $location, $state, $ionicLoading) {
     $http({
        url: ROOTCONFIG.host + "/shop/user/getFavoriteList.html",
        method:"get",
    }).success(function(ret){
        if(ret.code !== 0 || !ret.data ){ return; }
        $scope.favoriteList = ret.data.list;
        console.log(ret.data);
    }).error(function(ret){
        console.log("超时或后台报错");
    });

    $scope.deleteFavorite = function(index){
        console.log( $scope.favoriteList[index]);
        $http({
            url: ROOTCONFIG.host + "/shop/user/deleteFavoriteAjax.html?id="+$scope.favoriteList[index].id,
            method:"get",
        }).success(function(ret){
            if(ret.code === 0 ){
                $scope.favoriteList.splice(index,1);
                $ionicLoading.show({ template: '取消收藏成功', duration: 1000, noBackdrop: true });
            }
        }).error(function(ret){
            console.log("超时或后台报错");
        });
        
    };

});