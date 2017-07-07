var app = require('../../app.js');

app.controller("provideDonationController", function ($scope, $rootScope, $http, $timeout, $ionicLoading, $state, $filter, $ionicPopup) {
    $scope.vm = {
        amount: 0
    };
    var amount = 0;

    $ionicLoading.show({ template: '数据加载中...' });
    $http({
        url: ROOTCONFIG.host + "/f/toEntry",
        method: "post",
    }).success(function (ret) {
        $ionicLoading.hide();
        if (ret.success) {
            $scope.entryMin = ret.data.entryMin;
            $scope.entryMax = ret.data.entryMax;
            $scope.limit = ret.data.limit;
            $scope.game = ret.data.game;
            $scope.entryStage = ret.data.entryStage;
            $scope.entryLast = ret.data.entryLast;

            amount = $scope.entryMin;
            $scope.vm.amount = $scope.entryMin;
        } else {
            $scope.alert(ret.msg);
            $scope.$ionicGoBack();
        }
    }).error(function (ret) {
        $ionicLoading.hide();
        console.log("超时或后台报错");
    });

    $scope.changeAmount = function(val){
        if($scope.entryMin > $scope.entryMax){ return; }//捐单额度不足
        var amount_changed = parseInt($scope.vm.amount) + val;
        if(amount_changed < $scope.entryMin){
            $scope.vm.amount = $scope.entryMin;
        }else if(amount_changed > $scope.entryMax){
            $scope.vm.amount = $scope.entryMax;
        }else{
            $scope.vm.amount = amount_changed;
        }
    };

    $scope.checkValid = function(){
        if($scope.entryMin > $scope.entryMax){ $scope.vm.amount = parseInt(amount);return; }//捐单额度不足
        if($scope.vm.amount < $scope.entryMin){
            $scope.vm.amount = $scope.entryMin;
        }else if($scope.vm.amount > $scope.entryMax){
            $scope.vm.amount = $scope.entryMax;
        }
        if(/^[0-9]*00$/.test($scope.vm.amount)){
            amount = $scope.vm.amount;
        }else{
            $scope.vm.amount = parseInt(amount);
        }
    };

    $scope.checkAmount = function () {
        $scope.alert("系统暂时暂停该服务");
        return;
        $timeout(function(){
            if($scope.entryMin > $scope.entryMax){
                $ionicPopup.show({
                    template: '捐单额度不足，是否前往开单商城提额？',
                    scope: $scope,
                    buttons: [
                        { text: '取消' },
                        {
                            text: '<b>确定</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                $state.go('goodsList',{'type':'billing'});
                            }
                        },
                    ]
                });
            }else{
                $ionicPopup.show({
                    template: '<div id="tishi">请确认您所捐赠的金额<b id="amount1"></b><span style="color:#d22d19;font-weight:600">' + $filter('thousandBitSeparator')($scope.vm.amount) + '</span>元?</div>',
                    scope: $scope,
                    buttons: [
                        { text: '取消' },
                        {
                            text: '<b>确定</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                $scope.submit();
                            }
                        },
                    ]
                });
            }
        });
    };

    $scope.submit = function () {
        $http({
            url: ROOTCONFIG.host + "/f/entry",
            method: "post",
            data: $.param({ "amount": $scope.vm.amount }),
            headers: { "Content-type": 'application/x-www-form-urlencoded; charset=UTF-8' },
        }).success(function (ret) {
            if (ret.success) {
            	console.log(ret.msg)
                $state.go("main.donation");
                $ionicPopup.alert({ template: ret.msg });
            } else {
                $ionicPopup.alert({ template: ret.msg });
            }
        }).error(function (ret) {
            console.log("超时或后台报错");
        });
    };

});