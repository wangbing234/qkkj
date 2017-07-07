var app = require('../../app.js');

app.controller("orderDetailController", function($scope, $rootScope, $http, $state, $stateParams, $ionicModal) {
     $http({
        url: ROOTCONFIG.host + "/shop/order/getPayedOrder.html",
        method:"post",
        data: $.param({
            'e.id': $stateParams.id,
        }),
    }).success(function(ret){
        if(ret.code === 0){
            $scope.address = ret.data.ordership;
            $scope.productList = ret.data.orders;
            
            $scope.donation_product = [];
            $scope.donation_buyNumber = 0;
            $scope.donation_amount = 0;

            $scope.billing_product = [];
            $scope.billing_buyNumber = 0;
            $scope.billing_amount = 0;
            for(var i in $scope.productList){
                var product = $scope.productList[i];
                switch(product.productType){
                    case "31":
                        $scope.donation_product.push(product);//重销商城
                        $scope.donation_buyNumber = $scope.donation_buyNumber + product.productNumber;
                        $scope.donation_amount = $scope.donation_amount + product.productNumber * parseInt(product.price);
                        break;
                    case "38":
                        $scope.billing_product.push(product);//开单商品
                        $scope.billing_buyNumber = $scope.billing_buyNumber + product.productNumber;
                        $scope.billing_amount = $scope.billing_amount + product.productNumber * parseInt(product.price);
                        break;
                }
            }

            $scope.cutScorePoint = ret.data.cutScorePoint;//积分
            $scope.cutScoreTicket = ret.data.cutScore - ret.data.cutScorePoint;//消费券
            $scope.cutWallet = ret.data.cutWallet - ret.data.cutWalletReward;//消费钱包
            $scope.cutWalletReward = ret.data.cutWalletReward;//推广钱包
            $scope.cutMoney = ret.data.cutMoney;//现金

            $scope.orderNo = ret.data.orderNo;
            $scope.createdate = ret.data.createdate;
            $scope.paydate = ret.data.paydate;
            $scope.senddate = ret.data.senddate;
            $scope.signdate = ret.data.senddate;

            $scope.expressCompanyChinaName = ret.data.expressCompanyChinaName;
            $scope.expressCompanyName = ret.data.expressCompanyName;
            $scope.expressNo = ret.data.expressNo;
            $scope.senddate = ret.data.senddate;

            //开单详情
            $scope.payImg = ret.data.imagesPath;
            $scope.isSaveScore = ret.data.isSaveScore==="0"?"否":"是";
            $scope.amount = ret.data.amount;
            $scope.quantity = ret.data.quantity;
            $scope.totalMoneyReurnScore = ret.data.scoreProxy.returnScore;
        }
    }).error(function(ret){
        console.log("超时或后台报错");
    });

    $scope.queryExpress = function(){
        $http({
            url: ROOTCONFIG.host + "/shop/order/searchkuaiDiInfo.html?e.expressCompanyName="+$scope.expressCompanyName+"&e.expressNo="+$scope.expressNo,
            method:"post",
        }).success(function(ret){
            $scope.express = ret.data;
            $ionicModal.fromTemplateUrl('./shop/orderDetail/express.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.ExpressModal = modal;
                $scope.ExpressModal.show();
            });
        }).error(function(ret){
            console.log("超时或后台报错");
        });
    };

    $scope.closeExpress = function(){
        $scope.ExpressModal.hide();
    };

    $scope.billingDetail = function(){
        $ionicModal.fromTemplateUrl('./shop/orderDetail/billingDetails.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.billingDetailModal = modal;
            $scope.billingDetailModal.show();
        });
    };

    $scope.donationDetail = function(){
        $ionicModal.fromTemplateUrl('./shop/orderDetail/donationDetail.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.donationDetailModal = modal;
            $scope.donationDetailModal.show();
        });
    };

    $scope.closeBilling = function(){
        $scope.billingDetailModal.remove();
    };

    $scope.closeDonation = function(){
        $scope.donationDetailModal.remove();
    };

});
