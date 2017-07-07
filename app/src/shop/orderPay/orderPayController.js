var app = require('../../app.js');

app.controller("orderPayController", function($scope, $rootScope, $http, $window, $timeout, $stateParams, $state, $ionicLoading, $ionicModal, $ionicHistory) {
    var id = $stateParams.id;
    if(!id){ $state.go('main.shop'); }

    $scope.vm = {
        'id': $stateParams.id,
        'keepPoint': true,
        'useScore': 0,
        'useScoreTicket': 0,
    }

    $scope.useScoreChanged = function(value){
        if($scope.vm.useScore > $scope.userScore){
            $scope.vm.useScore = $scope.userScore;
        }
        if($scope.vm.useScore >= $scope.point_cost){
            $scope.vm.useScore = $scope.point_cost;
            $scope.vm.useScoreTicket = 0;
        }else{
            if(($scope.point_cost - $scope.vm.useScore) > $scope.userScoreTicket){
                $scope.vm.useScoreTicket = $scope.userScoreTicket;
                $scope.vm.useScore = ($scope.point_cost - $scope.vm.useScoreTicket);
            }else{
                $scope.vm.useScoreTicket = ($scope.point_cost - $scope.vm.useScore);
            }
        }
    };

    $scope.useScoreTicketChanged = function(){
        if($scope.vm.useScoreTicket > $scope.userScoreTicket){
            $scope.vm.useScoreTicket = $scope.userScoreTicket;
        }
        if($scope.vm.useScoreTicket >= $scope.point_cost){
            $scope.vm.useScoreTicket = $scope.point_cost;
            $scope.vm.useScore = 0;
        }else{
            if(($scope.point_cost - $scope.vm.useScoreTicket) > $scope.userScore){
                $scope.vm.useScore = $scope.userScore;
                $scope.vm.useScoreTicket = ($scope.point_cost - $scope.vm.useScore);
            }else{
                $scope.vm.useScore = ($scope.point_cost - $scope.vm.useScoreTicket);
            }
        }
    };

    $scope.max = function(type){
        if(type === 'useScore'){
            if($scope.userScore >= $scope.point_cost){
                $scope.vm.useScore = $scope.point_cost;
                $scope.vm.useScoreTicket = 0;
            }else{
                $scope.vm.useScore = $scope.userScore;
                $scope.vm.useScoreTicket = $scope.point_cost - $scope.vm.useScore;
            }
        }else if(type === 'useScoreTicket'){
            if($scope.userScoreTicket >= $scope.point_cost){
                $scope.vm.useScoreTicket = $scope.point_cost;
                $scope.vm.useScore = 0;
            }else{
                $scope.vm.useScoreTicket = $scope.userScoreTicket;
                $scope.vm.useScore = $scope.point_cost - $scope.vm.useScoreTicket;
            }
        }
    };

    $scope.nextScene = function(){
        var preScene = $scope.currentScene;
        $scope.currentScene = $scope.sceneList.shift();
        if(preScene){$scope.historyScene.push(preScene);}
    };
    
    $scope.sceneBack = function(){
        var currentScene = $scope.currentScene;
        if($scope.historyScene.length <= 0){
            $scope.currentScene = '';
            $state.go('main.shop');
        }else{
            $scope.currentScene = $scope.historyScene.shift();
            $scope.sceneList.unshift(currentScene);
        }
    };

    $http({
        url: ROOTCONFIG.host + "/shop/order/getNopayOrder.html",
        method:"post",
        data: $.param({ 'e.id':id, }),
        headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
    }).success(function(ret){
        if(ret.code !== 0 || !ret.data ){ return; }
        if(ret.data.paystatus === 'y'){
            $scope.alert('该订单已经支付过了！');
            $state.go('main.shop');
        }
        $scope.paystatus = ret.data.paystatus;
        $scope.productList = ret.data.orders;
        $scope.updateProductList();

        $scope.ordership = ret.data.ordership;
        
        $scope.errorMessage = ret.data.scoreProxy.oldMessage || '';
        $scope.totalExchangeMoney = ret.data.scoreProxy.cutMoney;
        $scope.totalExchangeWallet = ret.data.scoreProxy.cutWallet;
        $scope.totalExchangeScore = ret.data.scoreProxy.cutScore;
        // 推荐钱包
        $scope.userWalletRewardLeft = ret.data.scoreProxy.oldWalletReward - ret.data.scoreProxy.cutWalletReward;
        $scope.userWalletRewardLost = ret.data.scoreProxy.cutWalletReward;
        // 消费钱包
        $scope.userWalletShopLeft = ret.data.scoreProxy.oldWalletShop - ret.data.scoreProxy.cutWalletShop;
        $scope.userWalletShopLost = ret.data.scoreProxy.cutWalletShop;
        // 用户积分 用户消费券
        $scope.userScore = ret.data.scoreProxy.oldPointScore;
        $scope.userScoreTicket = ret.data.scoreProxy.oldPoint2Score;
        // 获得积分／额度 购买后累计额度 购买后可以捐赠额度
        $scope.totalMoneyReurnScore = ret.data.scoreProxy.returnScore;
        $scope.afterBuyScore = ret.data.scoreProxy.afterBuyScore;
        $scope.expectScore = ret.data.scoreProxy.expectScore;

        $scope.point_cost = ret.data.scoreProxy.cutScore;
        $scope.max('useScore');//默认全部使用积分
    }).error(function(ret){
        console.log("超时或后台报错");
    });

    $scope.updateProductList = function(){
        $scope.donation_product = [];
        $scope.donation_buyNumber = 0;
        $scope.donation_amount = 0;
        
        $scope.point_product = [];
        $scope.point_buyNumber = 0;
        $scope.point_amount = 0;
        $scope.point_cost = 0;

        $scope.billing_product = [];
        $scope.billing_buyNumber = 0;
        $scope.billing_amount = 0;
        if(!$scope.productList || $scope.productList.length<=0){ return; }
        for(var i in $scope.productList){
            var product = $scope.productList[i];
            switch(product.productType){
                case "31":
                    $scope.donation_product.push(product);//重销商城
                    $scope.donation_buyNumber = $scope.donation_buyNumber + product.productNumber;
                    $scope.donation_amount = $scope.donation_amount + product.productNumber * parseInt(product.price);
                    break;
                case "37":
                    $scope.point_product.push(product);//积分商品
                    $scope.point_buyNumber = $scope.point_buyNumber + product.productNumber;
                    $scope.point_amount = $scope.point_amount + product.productNumber * parseInt(product.price);
                    break;
                case "38":
                    $scope.billing_product.push(product);//开单商品
                    $scope.billing_buyNumber = $scope.billing_buyNumber + product.productNumber;
                    $scope.billing_amount = $scope.billing_amount + product.productNumber * parseInt(product.price);
                    break;
            }
        }
        $scope.sceneList = [];
        $scope.historyScene = [];
        if($scope.donation_buyNumber > 0){$scope.sceneList.push('donation');}
        if($scope.point_buyNumber > 0){$scope.sceneList.push('point');}
        if($scope.billing_buyNumber > 0){$scope.sceneList.push('billing');}
        $scope.nextScene();
    };
    
    $scope.keepPoint = function(bool){
        if($scope.vm.keepPoint !== bool){
            if(bool){
                $scope.billing_amount = $scope.billing_amount + $scope.totalMoneyReurnScore;
            }else{
                $scope.billing_amount = $scope.billing_amount - $scope.totalMoneyReurnScore;
            }
        }
        $scope.vm.keepPoint=bool;
    };

    $scope.pay = function(payCode){
        if(payCode==='afterpay'){
            $ionicModal.fromTemplateUrl('./shop/orderPay/pay.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.payModal = modal;
                $scope.payModal.show();
            });
        }else{
            if(payCode==='alipayescow' || payCode==='weixin'){
                return;
            }
            $http({
                method: 'post',
                url: ROOTCONFIG.host + '/shop/order/payOrders.html?e.id=' + id + '&e.status=pass',
                data: $.param({
                    'isSaveScore': $scope.vm.keepPoint?1:0 ,
                    'userScore': $scope.vm.useScore,
                    'userScoreTicket': $scope.vm.useScoreTicket
                }),
                headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
            }).success(function (ret) {
                if(ret.code === 0){
                    $scope.paySuccess(ret);
                }
            }).error(function(ret){
            });
        }
    };

    $scope.closePayModal = function(){
        $scope.payModal.remove();
    };

    $scope.paySuccess = function(ret){
        if($scope.payModal){ $scope.payModal.remove(); }

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

        //开单详情
        $scope.payImg = ret.data.imagesPath;
        $scope.isSaveScore = ret.data.isSaveScore==="0"?"否":"是";
        $scope.amount = ret.data.amount;
        $scope.quantity = ret.data.quantity;
        $scope.totalMoneyReurnScore = ret.data.scoreProxy.returnScore;

        localStorage.setItem('productList',[]);

        $ionicModal.fromTemplateUrl('./shop/orderPay/payFinished.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.payFinishedModal = modal;
            $scope.payFinishedModal.show();
        });
    };

    $scope.payFinishedConfirm = function(){
        $scope.payFinishedModal.remove();
        $state.go('main.shop');
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