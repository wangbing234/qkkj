var app = require('../../app.js');

app.controller("orderController", function($scope, $rootScope, $http, $location,$timeout, $state, $ionicTabsDelegate, $ionicSlideBoxDelegate, $ionicScrollDelegate) {
    $scope.orderAllCount = 0;// 全部
    $scope.orderAllList = [];
    $scope.orderAllPage = 0;

    $scope.orderWaitPayCount = 0;// 待支付
    $scope.orderWaitPayList = [];
    $scope.orderWaitPayPage = 0;

    $scope.orderWaitSendCount = 0;// 待发货
    $scope.orderWaitSendList = [];
    $scope.orderWaitSendPage = 0;

    $scope.orderWaitReceiveCount = 0;// 待签收
    $scope.orderWaitReceiveList = [];
    $scope.orderWaitReceivePage = 0;

    $scope.orderCompleteCount = 0;// 已完成
    $scope.orderCompleteList = [];
    $scope.orderCompletePage = 0;

    $timeout(function(){
		$ionicSlideBoxDelegate.enableSlide(false);
	});

    $http({
        url: ROOTCONFIG.host + "/shop/user/userSimpleReport.html",
        method:"get",
    }).success(function(ret){
        if(ret.code !== 0 || !ret.data ){ return; }
        $scope.orderWaitPayCount = ret.data.orderWaitPayCount;
        $scope.orderWaitSendCount = ret.data.orderWaitSendCount;
        $scope.orderWaitReceiveCount = ret.data.orderWaitReceiveCount;
        $scope.orderCompleteCount = ret.data.orderCompleteCount;
        $scope.orderAllCount = ret.data.orderWaitPayCount + ret.data.orderWaitSendCount + ret.data.orderWaitReceiveCount + ret.data.orderCompleteCount;
    }).error(function(ret){
        console.log("超时或后台报错");
    });

    $scope.getOrderData = function(states){
        if(states === ''){ if($scope.orderAllLoading){ return; }else{ $scope.orderAllLoading = true; } }
        if(states === 'waitPay'){ if($scope.orderWaitPayLoading){ return; }else{ $scope.orderWaitPayLoading = true; } }
        if(states === 'waitSend'){ if($scope.orderWaitSendLoading){ return; }else{ $scope.orderWaitSendLoading = true; } }
        if(states === 'waitReceive'){ if($scope.orderWaitReceiveLoading){ return; }else{ $scope.orderWaitReceiveLoading = true; } }
        if(states === 'waitRate'){ if($scope.orderCompleteLoading){ return; }else{ $scope.orderCompleteLoading = true; } }
        var page = states === ''?$scope.orderAllPage:states === 'waitPay'?$scope.orderWaitPayPage:states === 'waitSend'?$scope.orderWaitSendPage:states === 'waitReceive'?$scope.orderWaitReceivePage:$scope.orderCompletePage;
        $http({
            url: ROOTCONFIG.host + "/shop/user/getOrdersList.html",
            method:"post",
            data: $.param({
                'pager.offset':page*10,
                'states':states
            }),
            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
        }).success(function(ret){
            if(ret.code !== 0 || !ret.data ){ return; }
            if(states === ''){
                if(ret.data.list.length <= 0){ $scope.orderAllLoaded = true; }
                $scope.orderAllList = $scope.orderAllList.concat(ret.data.list);
                $scope.orderAllPage = $scope.orderAllPage + 1;
                $scope.orderAllLoading = false;
            }else if(states === 'waitPay'){
                if(ret.data.list.length <= 0){ $scope.orderWaitPayLoaded = true; }
                $scope.orderWaitPayList = $scope.orderWaitPayList.concat(ret.data.list);
                $scope.orderWaitPayPage = $scope.orderWaitPayPage + 1;
                $scope.orderWaitPayLoading = false;
            }else if(states === 'waitSend'){
                if(ret.data.list.length <= 0){ $scope.orderWaitSendLoaded = true; }
                $scope.orderWaitSendList = $scope.orderWaitSendList.concat(ret.data.list);
                $scope.orderWaitSendPage = $scope.orderWaitSendPage + 1;
                $scope.orderWaitSendLoading = false;
            }else if(states === 'waitReceive'){
                if(ret.data.list.length <= 0){ $scope.orderWaitReceiveLoaded = true; }
                $scope.orderWaitReceiveList = $scope.orderWaitReceiveList.concat(ret.data.list);
                $scope.orderWaitReceivePage = $scope.orderWaitReceivePage + 1;
                $scope.orderWaitReceiveLoading = false;
            }else if(states === 'waitRate'){
                if(ret.data.list.length <= 0){ $scope.orderCompleteLoaded = true; }
                $scope.orderCompleteList = $scope.orderCompleteList.concat(ret.data.list);
                $scope.orderCompletePage = $scope.orderCompletePage + 1;
                $scope.orderCompleteLoading = false;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }).error(function(ret){
            console.log("超时或后台报错");
        });
    };  

    $scope.sign = function(order){
        $http({
            url: ROOTCONFIG.host + "/shop/orders!signOrder.action?e.id="+order.id,
            method:"get",
        }).success(function(ret){
            if(ret.code === 0 ){ 
                $scope.alert('订单签收成功');
            }
        }).error(function(ret){
            console.log("超时或后台报错");
        });
    };

    $scope.tab = function(index){
        $ionicTabsDelegate.$getByHandle('order_tab').select(index);
        $ionicSlideBoxDelegate.slide(index);
    };

    $scope.activeTab = function(index){
        $scope.tabIndex = index;
        $ionicTabsDelegate.$getByHandle('order_tab').select(index);
    };

    $scope.orderHandler = function(orderState, orderId){
        if(orderState === 'init'){
            $state.go('orderPay',{'id':orderId});
        }else {
            $state.go('orderDetail',{'id':orderId});
        }
    };

});
