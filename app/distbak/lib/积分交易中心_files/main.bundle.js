/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(3);

	//directives
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);

	//services
	__webpack_require__(7);
	__webpack_require__(8);

	//controllers
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);
	__webpack_require__(12);
	__webpack_require__(14);
	__webpack_require__(15);
	__webpack_require__(16);
	__webpack_require__(17);
	__webpack_require__(18);
	__webpack_require__(19);
	__webpack_require__(20);
	__webpack_require__(21);
	__webpack_require__(22);
	__webpack_require__(23);

	__webpack_require__(24);
	__webpack_require__(25);

	__webpack_require__(26);
	__webpack_require__(27);
	__webpack_require__(28);
	__webpack_require__(29);
	__webpack_require__(30);
	__webpack_require__(31);
	__webpack_require__(32);
	__webpack_require__(33);
	__webpack_require__(34);
	__webpack_require__(35);
	__webpack_require__(36);
	__webpack_require__(37);

	__webpack_require__(38);
	__webpack_require__(39);
	__webpack_require__(40);
	__webpack_require__(41);
	__webpack_require__(42);
	__webpack_require__(43);
	__webpack_require__(44);
	__webpack_require__(45);
	__webpack_require__(46);
	__webpack_require__(47);
	__webpack_require__(48);
	__webpack_require__(49);
	__webpack_require__(50);
	__webpack_require__(51);

	__webpack_require__(52);
	__webpack_require__(53);
	__webpack_require__(54);
	__webpack_require__(55);
	__webpack_require__(56);
	__webpack_require__(57);
	__webpack_require__(58);
	__webpack_require__(59);
	__webpack_require__(60);
	__webpack_require__(61);
	__webpack_require__(62);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	function toFixed(num, s) {
	    var times = Math.pow(10, s)
	    var des = num * times + 0.5
	    des = parseInt(des, 10) / times
	    return des + ''
	}

	window.ROOTCONFIG = {
	    // host: "http://106.14.206.109:8889"
	    host:''
	};

	if(/Android [4-6]/.test(navigator.appVersion)) {
	    window.addEventListener("resize", function() {
	        if(document.activeElement.tagName=="INPUT" || document.activeElement.tagName=="TEXTAREA") {
	            window.setTimeout(function() {
	                document.activeElement.scrollIntoViewIfNeeded();
	            },0);
	        }
	    })
	}

	var app = angular.module("zx", ['ionic','ngWebSocket','angular-echarts']);

	app.run(function ($rootScope, $state, $stateParams, $ionicPopup, ls, $ionicHistory) {
	    $('#loading_spinner').hide();

	    $rootScope.$state = $state;
	    $rootScope.$stateParams = $stateParams;
	    
	    $rootScope.adsShowed = true; //是否已经弹出过广告
	    $rootScope.host = window.ROOTCONFIG.host;

	    ls.loadStorage();
	    if(!ls.data.user.userState){
	        // window.location = window.location.origin + window.location.pathname + '#/login';
	        $rootScope.showAll = true;
	    }else{
	        if(ls.data.user.userState === '未激活'){
	            $rootScope.showAll = false;
	        }else{
	            $rootScope.showAll = true;
	        }
	    }

	    $rootScope.alert = function (msg) {
	        if (!msg) { return; }
	        $ionicPopup.alert({ template: msg, okText: '确定' });
	    };
	    $rootScope.$ionicGoBack = $ionicHistory.goBack;

	    if(window.plus){
	        plus.key.addEventListener('backbutton', function() {
	            if($state.$current.self.name.indexOf('main.')>=0){
	                $ionicPopup.show({
	                    template: '您确定要退出应用吗？',
	                    buttons: [
	                        { text: '取消' },
	                        {
	                            text: '确定',
	                            type: 'button-positive',
	                            onTap: function(e) {
	                                plus.runtime.quit();
	                            }
	                        },
	                    ]
	                });
	            }else{
	                window.history.back();
	            }
	        }, false);
	    }
	    
	    document.addEventListener("deviceready", function () {
	        
	    }, false);

	}).config(function ($ionicConfigProvider, $httpProvider) {
	    $ionicConfigProvider.views.maxCache(1);
	    $ionicConfigProvider.views.swipeBackEnabled(false);
	    $ionicConfigProvider.platform.ios.tabs.style('standard');
	    $ionicConfigProvider.platform.ios.tabs.position('bottom');
	    $ionicConfigProvider.platform.android.tabs.style('standard');
	    $ionicConfigProvider.platform.android.tabs.position('standard');
	    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

	    var headers = { 
	        "Content-type": 'application/x-www-form-urlencoded; charset=UTF-8',
	        "token": localStorage.getItem("token"),
	        "X-Requested-With": "XMLHttpRequest"
	    };
	    $httpProvider.defaults.headers.common = headers;
	    // 拦截器
	    $httpProvider.interceptors.push('httpInterceptor');
	});
	app.factory("httpInterceptor", ["$q", "$injector", function ($q, $injector) {
	    return {
	        "response": function (response) {
	            if(response.config.url.indexOf("./")<0){
	                var rootScope = $injector.get('$rootScope');
	                if(response && response.data && response.data.code){
	                    if(response.data.code === -1){
	                        rootScope.alert("登录已过期");
	                        rootScope.$state.go("main.shop");
	                    }else if(response.data.code !== 0){
	                        rootScope.alert(response.data.msg);
	                    }
	                }
	                if(response && response.data && response.data.redirect){
	                    if(response.data.redirect === "noLogin"){
	                        // rootScope.alert("登录已过期");
	                        // localStorage.clear();
	                        // rootScope.$state.go("login");
	                    }
	                }
	            }
	            return response;
	        }
	    };
	}]);

	module.exports = app;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
	    $urlRouterProvider.otherwise('login');

	    $stateProvider
	        .state("main", {
	            url: "/main",
	            abstract: true,
	            templateUrl: "./main.html",
	            cache: false
	        })

	        // 互捐
	        .state("main.donation", {
	            url: "/donation",
	            views: {
	                'main-donation': {
	                    templateUrl: './donation/donation/donation.html',
	                    controller: 'donationController'
	                }
	            },
	            cache: false
	        })
	        // 提供捐助
	        .state("provideDonation", {
	            url: "/provideDonation",
	            templateUrl: "./donation/provideDonation/provideDonation.html",
	            controller: "provideDonationController",
	            cache: false
	        })
	        // 打款信息
	        .state("provideInformation", {
	            url: "/provideInformation/{id}",
	            templateUrl: "./donation/provideInformation/provideInformation.html",
	            controller: "provideInformationController",
	            params: { id: '' },
	            cache: false
	        })
	        // 了解鼎烨
	        .state("aboutUs", {
	            url: "/aboutUs",
	            templateUrl: "./donation/aboutUs/aboutUs.html",
	            cache: false
	        })
	        // 得到捐助
	        .state("getDonation", {
	            url: "/getDonation",
	            templateUrl: "./donation/getDonation/getDonation.html",
	            controller: "getDonationController",
	            cache: false
	        })
	        // 等待对方打款信息
	        .state("getInformation", {
	            url: "/getInformation/{id}",
	            templateUrl: "./donation/getInformation/getInformation.html",
	            controller: "getInformationController",
	            params: { id: '' },
	            cache: false
	        })
	        // 得到捐助确认
	        .state("getDonationConfirm", {
	            url: "/getDonationConfirm",
	            templateUrl: "./donation/getDonation/confirm.html",
	            controller: "getDonationConfirmController",
	            cache: false
	        })
	        // 钱包列表
	        .state("walletList", {
	            url: "/walletList",
	            templateUrl: "./donation/walletList/walletList.html",
	            controller: "walletListController",
	            cache: false
	        })
	        // 钱包积分明细
	        .state("pointDetail", {
	            templateUrl: "./donation/pointDetail/pointDetail.html",
	            url: "/pointDetail",
	            controller: "pointDetailController",
	            cache: false
	        })
	        // 钱包明细
	        .state("walletDetail", {
	            templateUrl: "./donation/walletDetail/walletDetail.html",
	            url: "/walletDetail/{walletId}",
	            controller: "walletDetailController",
	            params: { walletId: '' },
	            cache: false
	        })
	        // 等待打款
	        .state("waitMoney", {
	            templateUrl: "./donation/waitMoney/waitMoney.html",
	            url: "/waitMoney/{id}",
	            controller: "waitMoneyController",
	            params: { id: '' },
	            cache: false
	        })
	        // 确认收款
	        .state("getMoney", {
	            templateUrl: "./donation/getMoney/getMoney.html",
	            url: "/getMoney/{id}",
	            controller: "getMoneyController",
	            params: { id: '' },
	            cache: false
	        })
	        // 钱包消费券明细
	        .state("couponDetail", {
	            templateUrl: "./donation/couponDetail/couponDetail.html",
	            url: "/couponDetail",
	            controller: "couponDetailController",
	            cache: false
	        })
	        // 公益钱包提现
	        .state("charityWithdraw", {
	            templateUrl: "./donation/charityWithdraw/charityWithdraw.html",
	            url: "/charityWithdraw",
	            controller: "charityWithdrawController",
	            cache: false
	        })
	        // 公益钱包收益详情
	        .state("gyshouyiDetail", {
	            templateUrl: "./donation/gyshouyiDetail/gyshouyiDetail.html",
	            url: "/gyshouyiDetail/{walletId}",
	            controller: "gyshouyiDetailController",
	            params: { walletId: '' },
	            cache: false
	        })
	        // 公益钱包详情
	        .state("charityDetail", {
	            templateUrl: "./donation/charityDetail/charityDetail.html",
	            url: "/charityDetail",
	            controller: "charityDetailController",
	            cache: false
	        })
	        // 推广钱包详情
	        .state("spreadDetail", {
	            templateUrl: "./donation/spreadDetail/spreadDetail.html",
	            url: "/spreadDetail",
	            controller: "spreadDetailController",
	            cache: false
	        })
	        // 推广钱包提现
	        .state("spreadWithdraw", {
	            templateUrl: "./donation/spreadWithdraw/spreadWithdraw.html",
	            url: "/spreadWithdraw",
	            controller: "spreadWithdrawController",
	            cache: false
	        })

	        // 推广
	        .state("main.spread", {
	            url: "/spread",
	            views: {
	                'main-spread': {
	                    templateUrl: './spread/spread/spread.html',
	                    controller: 'spreadController'
	                }
	            },
	            cache: false
	        })
	        // 发放记录
	        .state("spreadRecord", {
	            url: "/spreadRecord",
	            templateUrl: "./spread/spreadRecord/spreadRecord.html",
	            controller: "spreadRecordController",
	            cache: false
	        })

	        // 积分交易平台
	        .state("main.integralTrading", {
	            url: "/integralTrading",
	            views: {
	                'main-integralTrading': {
	                    templateUrl: './integralTrading/integralTrading/integralTrading.html',
	                    controller: 'integralTradingController'
	                }
	            },
	            cache: false
	        })
	        // 积分买入
	        .state("purchase", {
	            url: "/purchase",
	            templateUrl: "./integralTrading/purchase/purchase.html",
	            controller: "purchaseController",
	            cache: false
	        })
	        // 积分卖出
	        .state("sellOut", {
	            url: "/sellOut",
	            templateUrl: "./integralTrading/sellOut/sellOut.html",
	            controller: "sellOutController",
	            cache: false
	        })
	        // 积分交易中心-撤单
	        .state("killOrder", {
	            url: "/killOrder",
	            templateUrl: "./integralTrading/killOrder/killOrder.html",
	            controller: "killOrderController",
	            cache: false
	        })
	        // 积分交易中心-成交
	        .state("deal", {
	            url: "/deal",
	            templateUrl: "./integralTrading/deal/deal.html",
	            controller: "dealController",
	            cache: false
	        })
	        // 资金管理
	        .state("management", {
	            url: "/management",
	            templateUrl: "./integralTrading/management/management.html",
	            controller: "managementController",
	            cache: false
	        })
	        // 资金转入
	        .state("fundTransfer", {
	            url: "/fundTransfer",
	            templateUrl: "./integralTrading/fundTransfer/fundTransfer.html",
	            controller: "fundTransferController",
	            cache: false
	        })
	        // 资金转出
	        .state("fundRollOut", {
	            url: "/fundRollOut",
	            templateUrl: "./integralTrading/fundRollOut/fundRollOut.html",
	            controller: "fundRollOutController",
	            cache: false
	        })
	        // 转账流水
	        .state("accountsFlow", {
	            url: "/accountsFlow",
	            templateUrl: "./integralTrading/accountsFlow/accountsFlow.html",
	            controller: "accountsFlowController",
	            cache: false
	        })
	        // 转账流水查询
	        .state("accountsFlowSelect", {
	            url: "/accountsFlowSelect",
	            templateUrl: "./integralTrading/accountsFlowSelect/accountsFlowSelect.html",
	            controller: "accountsFlowSelectController",
	            cache: false
	        })
	        // 交易流水
	        .state("tradeFlow", {
	            url: "/tradeFlow",
	            templateUrl: "./integralTrading/tradeFlow/tradeFlow.html",
	            controller: "tradeFlowController",
	            cache: false
	        })

	        // 商城
	        .state("main.shop", {
	            url: "/shop",
	            views: {
	                'main-shop': {
	                    templateUrl: './shop/shop/shop.html',
	                    controller: 'shopController'
	                }
	            },
	            cache: false
	        })
	        // 购物车
	        .state("shopCenter", {
	            url: "/shopCenter",
	            templateUrl: "./shop/shopCenter/shopCenter.html",
	            controller: "shopCenterController",
	            cache: false
	        })
	        // 购物车
	        .state("cart", {
	            url: "/cart",
	            templateUrl: "./shop/cart/cart.html",
	            controller: "cartController",
	            cache: false
	        })
	        // 商品详情
	        .state("goodsDetail", {
	            url: "/goodsDetail/{id}",
	            templateUrl: "./shop/goodsDetail/goodsDetail.html",
	            controller: "goodsDetailController",
	            params: { 'id': null },
	            cache: false
	        })
	        // 商城商品订单
	        .state("order", {
	            url: "/order",
	            templateUrl: "./shop/order/order.html",
	            controller: "orderController",
	            cache: false
	        })
	        // 订单详情
	        .state("orderDetail", {
	            url: "/orderDetail/{id}",
	            templateUrl: "./shop/orderDetail/orderDetail.html",
	            controller: "orderDetailController",
	            params: { 'id': null },
	            cache: false
	        })
	        // 订单提交
	        .state("orderSubmit", {
	            url: "/orderSubmit",
	            templateUrl: "./shop/orderSubmit/orderSubmit.html",
	            controller: "orderSubmitController",
	            cache: false
	        })
	        // 订单支付
	        .state("orderPay", {
	            url: "/orderPay/{id}",
	            templateUrl: "./shop/orderPay/orderPay.html",
	            controller: "orderPayController",
	            params: { 'id': null },
	            cache: false
	        })
	        // 商品列表
	        .state("goodsList", {
	            url: "/goodsList/{type}",
	            templateUrl: "./shop/goodsList/goodsList.html",
	            controller: "goodsListController",
	            cache: true
	        })
	        // 我的收藏
	        .state("favorite", {
	            url: "/favorite",
	            templateUrl: "./shop/favorite/favorite.html",
	            controller: "favoriteController",
	            cache: false
	        })

	        // 用户
	        .state("main.user", {
	            url: "/user",
	            views: {
	                'main-user': {
	                    templateUrl: './user/user/user.html',
	                    controller: 'userController'
	                }
	            },
	            cache: false
	        })
	        // 登录
	        .state("login", {
	            url: "/login",
	            templateUrl: "./user/login/login.html",
	            controller: "loginController",
	            cache: false
	        })
	        // 注册
	        .state("register", {
	            url: "/register",
	            templateUrl: "./user/register/register.html",
	            controller: "registerController",
	            cache: false
	        })
	        // 忘记密码
	        .state("forget", {
	            url: ROOTCONFIG.host + "/forget",
	            templateUrl: "./user/forget/forget.html",
	            controller: "forgetController",
	            cache: false
	        })
	        // 用户协议
	        .state("agreements", {
	            url: "/agreements",
	            templateUrl: "./user/agreements/agreements.html",
	            cache: false
	        })
	        // 反馈（用户留言）
	        .state("feedback", {
	            url: ROOTCONFIG.host + "/feedback",
	            templateUrl: "./user/feedback/feedback.html",
	            controller: "feedbackController",
	            cache: false
	        })
	        // 新闻
	        .state("news", {
	            url: "/news",
	            templateUrl: "./user/news/news.html",
	            cache: false
	        })
	        // 注意事项
	        .state("notice", {
	            url: "/notice/{noticeId}",
	            templateUrl: "./user/notice/notice.html",
	            params: { noticeId: '' },
	            cache: false
	        })
	        // 收货地址
	        .state("address", {
	            url: "/address",
	            templateUrl: "./user/address/address.html",
	            controller: "addressController",
	            cache: false
	        })
	        // 账户设定
	        .state("account", {
	            url: "/account",
	            templateUrl: "./user/account/account.html",
	            controller: "accountController",
	            cache: false
	        })
	        // 更新账户信息
	        .state("addAccount", {
	            url: "/addAccount",
	            templateUrl: "./user/addAccount/addAccount.html",
	            controller: "addAccountController",
	            params: { bankNum: '', depositBank: '', detailBank: '', bankNum2: '', depositBank2: '', detailBank2: '' },
	            cache: false
	        })
	        // 设置
	        .state("setting", {
	            url: "/setting",
	            templateUrl: "./user/setting/setting.html",
	            controller: "settingController",
	            cache: false
	        })
	        // 签到
	        .state("signin", {
	            url: "/signin",
	            templateUrl: "./user/signin/signin.html",
	            controller: "signinController",
	            cache: false
	        })
	        // 实名认证
	        .state("authentication", {
	            url: "/authentication",
	            templateUrl: "./user/authentication/authentication.html",
	            controller: "authenticationController",
	            cache: false
	        })
	        // 解冻
	        .state("freeze", {
	            url: ROOTCONFIG.host + "/freeze",
	            templateUrl: "./user/freeze/freeze.html",
	            controller: "freezeController",
	            cache: false
	        })
	        // 新手指南引导页
	        .state("guide", {
	            url: "/guide",
	            templateUrl: "./user/guide/guide.html",
	            cache: false
	        })
	        // 新手指南(鼎烨APP注册与认证操作说明)
	        .state("guide_1", {
	            url: "/guide_1",
	            templateUrl: "./user/guide/guide_1.html",
	            controller: "guideSwiperController",
	            cache: false
	        })
	        // 新手指南(鼎烨APP注册与认证操作说明)
	        .state("guide_2", {
	            url: "/guide_2",
	            templateUrl: "./user/guide/guide_2.html",
	            controller: "guideSwiperController",
	            cache: false
	        })
	}]);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.filter('thousandBitSeparator',function(){
	    return function(num){
	        var s = num.toString();
	        if(s.indexOf('.') > 0) {
	            return s.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
	        } else {
	            return s.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
	        }
	    }
	}).filter('delcommafy',function(){
	    return function(num){
	        return num.replace(/,/gi, '');
	    }
	}).filter('orderClass',function(){
	    return function(str){
	        switch(str){
	            case "init":
	                return 'state-color1';
	            case "sure":
	                return 'state-color2';
	            case "pass":
	                return 'state-color2';
	            case "send":
	                return 'state-color3';
	            case "sign":
	                return 'state-color4';
	            case "cancel":
	                return 'state-color5';
	        }
	        return str;
	    }
	});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.directive('ngBack', function($window) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs){
	            element.bind("touchstart", onTouchStart);
	            function onTouchStart(event) {
	                $window.history.back();
	            }
	        }
	    };
	});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.directive('countDown', function($window) {
	    return {
	        controller: ["$scope", "$element", function ($scope, $element) {
	            var arr = $element.attr("count-down").split('.');
	            var left = $scope;
	            while(arr.length > 0){
	                left = left[arr.shift()];
	            }
	            var secondsLeft=function(endTime){
	                var divNum = 1000;
	                var p=function(s){
	                    return s < 10 ? '0' + s: s;
	                }
	                var sTime = new Date();
	                endTime = endTime.replace(/-/g,'/');
	                var eTime = new Date(endTime);
	                return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
	            }
	            left = secondsLeft(left);
	            
	            var timesCount=function(left,i){
	                setInterval(function(){
	                    if(left>0){
	                        left--;
	                        writeTimes(left);
	                    }else{
	                        clearInterval(timesCount);
	                        return;
	                    }
	                },1000);
	            }
	            var writeTimes=function(left){
	                var days=parseInt(left/60/60/24);
	                var hours=parseInt((left-days*24*60*60)/60/60);
	                var mins=parseInt((left-hours*60*60-days*24*60*60)/60);
	                var secs=left-days*24*60*60-hours*60*60-mins*60;
	                var timeArr=[days,hours,mins,secs];
	                if(days!=0){
	                    return $element.html(days+"天"+hours+"时"+mins+"分"+secs+"秒");
	                }else if(days==0){
	                    return $element.html(hours+"小时"+mins+"分"+secs+"秒");
	                }else if(hours==0){
	                    return $element.html(mins+"分"+secs+"秒");
	                }else if(mins==0){
	                    return $element.html(secs+"秒");
	                }else{
	                    return $element.html(0+"秒");
	                }
	            }
	            writeTimes(left);
	            timesCount(left);
	        }]
	    }
	});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.directive("numberInput", function () {
	    return {
	        require: "ngModel",
	        link: function(scope,element,attrs,ngModel){
	            element.bind('keyup',function(e){
	                this.value = this.value.replace(/[^0-9|\.]/g,'');
	                if(/^[0]*$/.test(this.value)){
	                    this.value = 0;// 全部都是0
	                }else if(/^[0]+\d*$/.test(this.value)){
	                    this.value = this.value.replace(/^[0]+/,'')// 以0开头的数字
	                }
	                if(/^[0-9]+[.]{1}[0-9]{1,4}/.test(this.value)){
	                    this.value = this.value.match(/^[0-9]+[.]{1}[0-9]{1,4}/)[0];
	                }
	                
	                // 光标移动到最后
	                var len = this.value.length;
	                if (this.createTextRange) { 
	                    var range = input.createTextRange(); 
	                    range.collapse(true); 
	                    range.moveEnd('character', len); 
	                    range.moveStart('character', len); 
	                    range.select(); 
	                } else if (this.setSelectionRange) { 
	                    this.focus(); 
	                    this.setSelectionRange(len, len); 
	                } 

	                var method = element.attr("number-input");
	                method = method + "(" + this.value + ")";
	                scope.$apply(method);
	            });
	        }
	    }
	});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.factory('ls', ['$window', function ($window) {
	    var share_data = {
	        user:{},
	        account:{
	            cartNumber: 0
	        }
	    };

	    return {
	        data: share_data,
	        setUser: function (key, value) {
	            share_data.user[key] = value;
	            $window.localStorage['user'] = JSON.stringify(share_data.user);
	        },
	        setAccount: function (key, value) {
	            share_data.account[key] = value;
	            $window.localStorage['account'] = JSON.stringify(share_data.account);
	        },
	        loadStorage: function(){
	            angular.forEach(Object.keys(share_data),function(key) {
	                var data = share_data[key];
	                var obj = JSON.parse($window.localStorage[key] || '{}');
	                angular.forEach(Object.keys(obj),function(key) {
	                    data[key] = obj[key];
	                });
	            });
	        }
	    }
	}]);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.service('Util', function ($q) {

	    var dataURItoBlob = function (dataURI) {
	        // convert base64/URLEncoded data component to raw binary data held in a string 
	        var byteString;
	        if (dataURI.split(',')[0].indexOf('base64') >= 0)
	            byteString = atob(dataURI.split(',')[1]);
	        else
	            byteString = unescape(dataURI.split(',')[1]);

	        // separate out the mime component 
	        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	        // write the bytes of the string to a typed array 
	        var ia = new Uint8Array(byteString.length);
	        for (var i = 0; i < byteString.length; i++) {
	            ia[i] = byteString.charCodeAt(i);
	        }

	        return new Blob([ia], {
	            type: mimeString
	        });
	    };

	    var resizeFile = function (file) {
	        var deferred = $q.defer();
	        var img = document.createElement("img");
	        try {
	            var reader = new FileReader();
	            reader.onload = function (e) {
	                img.src = e.target.result;

	                //resize the image using canvas 
	                var canvas = document.createElement("canvas");
	                var ctx = canvas.getContext("2d");
	                ctx.drawImage(img, 0, 0);
	                var MAX_WIDTH = 800;
	                var MAX_HEIGHT = 800;
	                var width = img.width;
	                var height = img.height;
	                if (width > height) {
	                    if (width > MAX_WIDTH) {
	                        height *= MAX_WIDTH / width;
	                        width = MAX_WIDTH;
	                    }
	                } else {
	                    if (height > MAX_HEIGHT) {
	                        width *= MAX_HEIGHT / height;
	                        height = MAX_HEIGHT;
	                    }
	                }
	                canvas.width = width;
	                canvas.height = height;
	                var ctx = canvas.getContext("2d");
	                ctx.drawImage(img, 0, 0, width, height);

	                //change the dataUrl to blob data for uploading to server 
	                var dataURL = canvas.toDataURL('image/jpeg');
	                var blob = dataURItoBlob(dataURL);

	                deferred.resolve(dataURL);
	                // deferred.resolve(blob);
	            };
	            reader.readAsDataURL(file);
	        } catch (e) {
	            deferred.resolve(e);
	        }
	        return deferred.promise;

	    };
	    return {
	        resizeFile: resizeFile
	    };

	}); 

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("donationController", function($scope, $rootScope, $http, $ionicLoading, $timeout, $parse, $ionicSlideBoxDelegate, $ionicModal, $state) {
		$scope.baseRate = localStorage.getItem("baseRate");
	    $scope.pointRate = localStorage.getItem("pointRate");
		var slideBox;
		
		$scope.$on('$ionicView.loaded', function () {
			$timeout(function () {
				slideBox = $ionicSlideBoxDelegate._instances.filter(function (s) {
					if (!s.$$delegateHandle) return false;
					return $parse(s.$$delegateHandle.slice(2, -2));
				})[0];
			}).then(function () {
				slideBox.enableSlide(false);
			});
		});

		if(!$rootScope.adsShowed){
			$rootScope.adsShowed = true;
			$ionicModal.fromTemplateUrl('./donation/donation/ads.html', {
				scope: $scope,
				animation: 'fadeIn'
			}).then(function (modal) {
				$scope.ADSModal = modal;
				$scope.ADSModal.show();
			});
		}

		$scope.closeAds = function(){
			$scope.ADSModal.remove();
		};

		$scope.tab = function(index){
			$scope.tabIndex = index;
			if(slideBox){slideBox.slide(index);}
		};

		$scope.activeTab = function(index){
			$scope.tabIndex = index;
		};

		$scope.waitHandler = function(index){
			var type = $scope.waitList[index].type;
			switch(type){
				case 1:
					break;
				case 2:
					break;
				case 3:
					$state.go("provideInformation",{"id":$scope.waitList[index].id});
					break;
				case 4:
					$state.go("getInformation",{"id":$scope.waitList[index].id});
					break;
			}
		}

		$scope.todoHandler = function(index){
			var type = $scope.todoList[index].type;
			switch(type){
				case 1:
					$state.go("waitMoney",{"id":$scope.todoList[index].id});
					break;
				case 2:
					$state.go("getMoney",{"id":$scope.todoList[index].id});
					break;
			}
		}
		
		$scope.finishHandler = function(index){
			var type = $scope.finishList[index].type;
			switch(type){
				case 1:
					$state.go("provideInformation",{"id":$scope.finishList[index].id});
					break;
				case 2:
					$state.go("getInformation",{"id":$scope.finishList[index].id});
					break;
			}
		}

		$ionicLoading.show({ template: '数据加载中...' });
		$http({
			url: ROOTCONFIG.host + "/f/matchList",
			method:"post",
		}).success(function(ret){
			if(ret.success) {
				$scope.todoList = ret.data.todoList;
				$scope.waitList = ret.data.waitList;
				$scope.finishList = ret.data.finishList;
				if($scope.todoList.length>0){
					$scope.tab(1);
				}else if($scope.waitList.length>0){
					$scope.tab(0);
				}else if($scope.finishList.length>0){
					$scope.tab(2);
				}else{
					$scope.tab(0);
				}
				if(slideBox){slideBox.update();}
			} else {
				console.log(ret.msg);
			}
			$ionicLoading.hide();
		}).error(function(ret){
			$ionicLoading.hide();
			console.log("超时或后台报错");
		});
	});


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

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

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("provideInformationController", function ($scope, $rootScope, $http, $state, $stateParams) {
	    var id = $stateParams.id;

	    $http({
				url: ROOTCONFIG.host + "/f/payView",
				method:"post",
		        data:$.param({"id": id})
		}).success(function(ret){
			if(ret.success) {
	//			console.log(ret)
				ret = ret.data;
	            $("#a1").html(ret.exitName)
	            $("#a2").html(ret.exitPhone)
	            $("#a3").html(ret.refName)
	            $("#a4").html(ret.refPhone)
	            $("#a5").html(ret.amount)
	            $("#a6").html(ret.bankNum)
	            $("#a7").html(ret.depositBank)
	            $("#a8").html(ret.bankNum2)
	            $("#a9").html(ret.depositBank2)
			} else {
				$scope.alert(ret.msg);
			}
		}).error(function(ret){
				$scope.alert(ret.msg);
		});

	//  		var beizhu = $("#a7").val()
	});


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);
	__webpack_require__(13);

	app.controller("getDonationController", function($scope, $rootScope, $http, $location, $state) {
	    $scope.walletType = 0;
	    
	    $http({
			url: ROOTCONFIG.host + "/f/wallet",
			method:"post",
		}).success(function(ret){
			if(ret.success) {
				var datas = ret.data;
	            $scope.baseFree = ret.data.baseFree;
	            $scope.baseTrading = ret.data.baseTrading;
	            $scope.baseFreeze = ret.data.baseFreeze;
	            $scope.growFree = ret.data.growFree;
	            $scope.growTrading = ret.data.growTrading;
			} else {
				$scope.alert(ret.msg);
			}
		}).error(function(ret){
			console.log("超时或后台报错");
		});


	    $scope.chooseWalletType = function(type){
	        $scope.walletType = type;
	    };

	    $scope.submit = function(){
	        if($scope.walletType===0) {
	            localStorage.setItem("qbId",1)
	            localStorage.setItem("keyong",$scope.baseFree);
	        }else if($scope.walletType===1) {
	            localStorage.setItem("qbId",2);
	            localStorage.setItem("keyong",$scope.growFree);
	        }
	        $state.go("getDonationConfirm");
	    };
	});


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("getDonationConfirmController", ["$scope", "$rootScope", "$http", "$location", function($scope, $rootScope, $http, $location) {
	    var qbId = parseInt(localStorage.getItem("qbId"));
	    var keyong;

	    $scope.vm = {
	        amount:''
	    };

	    $http({
			url: ROOTCONFIG.host + "/f/toExit",
			method:"post",
		}).success(function(ret){
			if(ret.success) {
	            var data = ret.data;
	            $scope.limit = ret.data.limit;
	            if(qbId == 1) {
	                keyong = data.baseFree;
	            }else if(qbId == 2) {
	                keyong = data.growFree;
	            }
			} else {
				$scope.alert(ret.msg);
			}
		}).error(function(ret){
			console.log("超时或后台报错");
		});

	    $scope.submit = function(){
	        if(!/^[1-9]\d*00$/.test($scope.vm.amount)){
	            $(".err1").html("请输入100的整数倍金额").fadeIn(2000, function() {
	                $(this).fadeOut(4000);
	            });
	            return;
	        }
	        if(parseInt($scope.amount)>parseInt(keyong)){
	            $(".err1").html("余额不足").fadeIn(2000, function() {
	                $(this).fadeOut(4000);
	            });
	            return;
	        }
	        $http({
	            url: ROOTCONFIG.host + "/f/exit",
	            method:"post",
	            data: $.param({
	                'id':qbId,
	                'amount': $scope.vm.amount,
	            }),
	            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
	        }).success(function(ret){
	            if(ret.success) {
	                $scope.alert(ret.msg);
	                $state.go('main.donation');
	            } else {
	                $scope.alert(ret.msg);
	            }
	        }).error(function(ret){
	            console.log("超时或后台报错");
	        });
	    };
	   
	}]);

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("getInformationController", function ($scope, $rootScope, $state, $stateParams) {
	    var id = $stateParams.id;
	    $.ajax({
	        type: "post",
	        timeout: 3000,
	        url: "/f/confirmView",//3.5
	        data: {
	            id: id
	        },
	        datatype: "json",
	        success: function (ret) {
	            if (ret.success) {
	                showOfferInfo(ret);
	            } else {
	                alert(ret.msg)
	            }
	        },
	        error: function () {
	            console.log("超时或后台报错")
	            $scope.alert(ret.msg);
	        }
	    });

	    //渲染打款人信息
	    var showOfferInfo = function (ret) {
	        var data = ret.data;
	        var entryName = data.entryName;
	        var entryPhone = data.entryPhone;
	        var refName = data.refName;
	        var refPhone = data.refPhone;
	        var Amount = data.amount;
	        var bankNum = data.bankNum;
	        var transImg = data.transImg;

	        $("#entryName").html(entryName);
	        $("#entryPhone").html(entryPhone);
	        $("#refName").html(refName);
	        $("#refPhone").html(refPhone);
	        $("#Amount").html(Amount);
	        $("#bankNum").html(bankNum);
	        $("#transImg").prop("src", transImg);
	    }

	});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("walletListController",function($scope, $state, $rootScope, $http, $location) {
		function thousandBitSeparator(num) {
			var number = num.toFixed(2)
			var s = number.toString();
			if(s.indexOf('.') > 0) {
				return s.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
			} else {
				return s.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
			}
		}
		
		$http({
			url: ROOTCONFIG.host + "/f/wallet",
			method:"post",
		}).success(function(ret){
			if(ret.success) {
				console.log(ret)
				var datas = ret.data;
				//公益钱包
				$scope.baseFree = thousandBitSeparator(datas.baseFree);
				$scope.baseTrading = thousandBitSeparator(datas.baseTrading);
				$scope.baseFreeze = thousandBitSeparator(datas.baseFreeze);
				//推广钱包
				$scope.growFree = thousandBitSeparator(datas.growFree);
				$scope.growTrading = thousandBitSeparator(datas.growTrading);
				//消费钱包
				$scope.shopFree = thousandBitSeparator(datas.shopFree);
				$scope.shopTrading = thousandBitSeparator(datas.shopTrading);
				$scope.shopFreeze = thousandBitSeparator(datas.shopFreeze);
				$scope.shopShopping = thousandBitSeparator(datas.shopShopping);
				//推荐钱包
				$scope.rewardShopping = thousandBitSeparator(datas.rewardShopping);
				$scope.rewardFree = thousandBitSeparator(datas.rewardFree);
				//交易积分钱包
				$scope.pointInactive = thousandBitSeparator(datas.pointInactive);
				$scope.pointFree = thousandBitSeparator(datas.pointFree);
				//消费积分钱包
				$scope.point2Free = thousandBitSeparator(datas.point2Free);
				$scope.point2Shopping = datas.point2Shopping;
			} else {
				$scope.alert(ret.msg);
			}
		}).error(function(ret){
			console.log("超时或后台报错");
		});

	});

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("pointDetailController", function($scope, $state, $rootScope, $http, $location, $stateParams, $ionicModal, $ionicLoading) {
	    var reasonHash = {
	        '81': {
	            'reason': '自己注册',
	            'iconClass': 'day3',
	            'prefix': '+'
	        },
	        '82': {
	            'reason': '团队会员升级',
	            'iconClass': 'day3',
	            'prefix': '+'
	        },
	        '6': {
	            'reason': '确认订单',
	            'iconClass': 'day4',
	            'prefix': ''
	        },
	        '5': {
	            'reason': '下单',
	            'iconClass': 'day5',
	            'prefix': '-'
	        },
	        '7': {
	            'reason': '满额捐赠',
	            'iconClass': 'day6',
	            'prefix': '+'
	        },
	        'c': {
	            'reason': '取消订单',
	            'iconClass': 'day7',
	            'prefix': '+'
	        },
	        'b': {
	            'reason': '确认收货',
	            'iconClass': 'day8',
	            'prefix': '+'
	        },
	        'd': {
	            'reason': ' 钱包规则变更',
	            'iconClass': 'day9',
	            'prefix': '+'
	        }
	    };

	    $scope.list = [];
	    $ionicLoading.show({ template: '数据加载中...' });
	    $http({
	        url: ROOTCONFIG.host + "/f/walletDetail2?id=pointBase",
	        method:"post",
	    }).success(function(ret){
	        $ionicLoading.hide();
	        if(ret.success) {
	            if(ret.data && ret.data.length>0){
	                $scope.list = ret.data;
	                for(var i in $scope.list){
	                    $scope.list[i].createTime = new Date($scope.list[i].time);
	                    var reasonObj = reasonHash[$scope.list[i].reason];
	                    $scope.list[i].changeAmount = reasonObj.prefix + Math.abs(parseInt($scope.list[i].amount));
	                    $scope.list[i].changeReason = reasonObj.reason;
	                    $scope.list[i].iconClass = reasonObj.iconClass;
	                }
	            }else{
	                $scope.list = null;
	            }
	        } else {
	            console.log(ret.msg);
	        }
	    }).error(function(ret){
	        $ionicLoading.hide();
	    });

	    $scope.showFilter = function(){
	        $ionicModal.fromTemplateUrl('./donation/pointDetail/pointDetailFilter.html', {
	            scope: $scope,
	            animation: 'slide-in-up'
	        }).then(function (modal) {
	            $scope.filterModal = modal;
	            $scope.filterModal.show();
	        });
	    };

	    $scope.closeModal = function(){
	        $scope.filterModal.hide();
	    };

	    $scope.filter = function(filter_type){
	        $scope.list = [];
	        $scope.filterModal.hide();
	        $scope.filter_type = filter_type;

	        $ionicLoading.show({ template: '数据加载中...' });
	        $http({
	            url: ROOTCONFIG.host + "/f/walletDetail2?id=point" + filter_type,
	            method:"post",
	        }).success(function(ret){
	            $ionicLoading.hide();
	            if(ret.success) {
	                if(ret.data && ret.data.length>0){
	                    $scope.list = ret.data;
	                    for(var i in $scope.list){
	                        $scope.list[i].createTime = new Date($scope.list[i].time);
	                        var reasonObj = reasonHash[$scope.list[i].reason];
	                        $scope.list[i].changeAmount = reasonObj.prefix + Math.abs(parseInt($scope.list[i].amount));
	                        $scope.list[i].changeReason = reasonObj.reason;
	                        $scope.list[i].iconClass = reasonObj.iconClass;
	                    }
	                }else{
	                    $scope.list = null;
	                }
	            } else {
	                console.log(ret.msg);
	            }
	        }).error(function(ret){
	            $ionicLoading.hide();
	        });
	    };

	});

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("gyshouyiDetailController", function($scope, $state, $rootScope, $http, $location, $stateParams) {
	    var walletId = $stateParams.walletId;
	    switch(walletId){
	        case "1":
	            $scope.head_title = "公益钱包明细";
	            break;
	        case "2":
	            $scope.head_title = "推广钱包明细";
	            break;
	        case "3":
	            $scope.head_title = "消费钱包明细";
	            break;
	        default:
	//          $state.go("home");
	            break;
	    }
	   
	    $.ajax({
	        type: "post",
	        timeout: 3000,
	        url: ROOTCONFIG.host + "/f/walletDetail",
	        data: { id: walletId },
	        datatype: "json",
	        success: function(ret) {
	            if(ret.success) {
	                // 执行成功，返回正确结果
	                $scope.list = ret.data;
	            } else {
	                // 执行成功，结果错误
	            }
	        },
	        error: function() {
	            // 超时或后台报错
	        }
	    });
	});

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("spreadDetailController", function ($scope, $rootScope, $http, $stateParams, $ionicLoading, $state, $ionicModal) {
	    var reasonHash = {
	        '5': {
	            'reason': '下单',
	            'prefix': ''
	        },
	        '2': {
	            'reason': '提现',
	            'prefix': '-'
	        },
	        '31': {
	            'reason': '确认收款',
	            'prefix': '+'
	        },
	        'c': {
	            'reason': '取消订单',
	            'prefix': ''
	        }
	    };
	    
	    var getGrowRecord = function(filter_type){
	        $http({
	            url: ROOTCONFIG.host + "/f/walletDetail2?id=grow" + filter_type,
	            method: "post",
	        }).success(function (ret) {
	            $ionicLoading.hide();
	            if (ret.success) {
	                $scope.list = ret.data;
	                for(var i in $scope.list){
	                    $scope.list[i].time = new Date($scope.list[i].createTime);
	                }
	            } else {
	                $scope.alert(ret.msg);
	                $scope.$ionicGoBack();
	            }
	        }).error(function (ret) {
	            $ionicLoading.hide();
	            console.log("超时或后台报错");
	        });
	    };
	    
	    $ionicLoading.show({ template: '数据加载中...' });
	    $http({
	        url: ROOTCONFIG.host + "/f/wallet",
	        method:"post",
	    }).success(function(ret){
	        if(ret.success) {
	            $scope.growFree = ret.data.growFree;
	            $scope.growTrading = ret.data.growTrading;
	            getGrowRecord('Base');
	        } else {
	            $scope.alert(ret.msg);
	        }
	    }).error(function(ret){
	        console.log("超时或后台报错");
	    });

	    $scope.showFilter = function(){
	        $ionicModal.fromTemplateUrl('./donation/spreadDetail/spreadDetailFilter.html', {
	            scope: $scope,
	            animation: 'slide-in-up'
	        }).then(function (modal) {
	            $scope.filterModal = modal;
	            $scope.filterModal.show();
	        });
	    };

	    $scope.closeModal = function(){
	        $scope.filterModal.hide();
	    };

	    $scope.$on('$destroy', function () {
	        if($scope.filterModal){$scope.filterModal.remove();}
	    });

	    $scope.filter = function(filter_type){
	        $scope.list = [];
	        $scope.filterModal.hide();
	        $scope.filter_type = filter_type;

	        $ionicLoading.show({ template: '数据加载中...' });
	        $http({
	            url: ROOTCONFIG.host + "/f/walletDetail2?id=grow" + filter_type,
	            method:"post",
	        }).success(function(ret){
	            $ionicLoading.hide();
	            if(ret.success) {
	                if(ret.data && ret.data.length>0){
	                    $scope.list = ret.data;
	                    for(var i in $scope.list){
	                        $scope.list[i].createTime = new Date($scope.list[i].time);
	                        var reasonObj = reasonHash[$scope.list[i].reason];
	                        $scope.list[i].changeAmount = reasonObj.prefix + Math.abs(parseInt($scope.list[i].amount));
	                        $scope.list[i].changeReason = reasonObj.reason;
	                    }
	                }else{
	                    $scope.list = null;
	                }
	            } else {
	                console.log(ret.msg);
	            }
	        }).error(function(ret){
	            $ionicLoading.hide();
	        });
	    };

	});

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("gongyiProvideController", function ($scope, $rootScope, $http, $timeout, $ionicLoading, $state, $filter, $ionicPopup) {
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

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("charityDetailController", function($scope, $state, $rootScope, $http, $location, $stateParams, $ionicModal, $ionicLoading) {
	    var reasonHash = {
	        '11': {
	            'reason': '主动捐赠',
	            'backgroundColor': '#e7654a',
	            'shorReason': '开',
	            'prefix': ''
	        },
	        '4': {
	            'reason': '利息解冻',
	            'backgroundColor': '#8393de',
	            'shorReason': '收',
	            'prefix': '+'
	        },
	        '2': {
	            'reason': '提现',
	            'backgroundColor': '#ffab0a',
	            'shorReason': '提',
	            'prefix': '-'
	        },
	        '12': {
	            'reason': '推广复投',
	            'backgroundColor': '#fe8c8c',
	            'shorReason': '推',
	            'prefix': ''
	        },
	        'a': {
	            'reason': '返还激活码',
	            'backgroundColor': '#b487ca',
	            'shorReason': '其',
	            'prefix': '+'
	        }
	    };

	    $http({
	        url: ROOTCONFIG.host + "/f/walletDetail2?id=baseBase",
	        method:"post",
	    }).success(function(ret){
	        if(ret.success) {
	            $scope.list = ret.data;
	        } else {
	            console.log(ret.msg);
	        }
	    }).error(function(ret){
	        console.log("超时或后台报错");
	    });

	    $scope.showFilter = function(){
	        $ionicModal.fromTemplateUrl('./donation/charityDetail/charityDetailFilter.html', {
	            scope: $scope,
	            animation: 'slide-in-up'
	        }).then(function (modal) {
	            $scope.filterModal = modal;
	            $scope.filterModal.show();
	        });
	    };

	    $scope.closeModal = function(){
	        $scope.filterModal.hide();
	    };

	    $scope.$on('$destroy', function () {
	        if($scope.filterModal){$scope.filterModal.remove();}
	    });


	    $scope.filter = function(filter_type){
	        $scope.list = [];
	        $scope.filterModal.hide();
	        $scope.filter_type = filter_type;

	        $ionicLoading.show({ template: '数据加载中...' });
	        $http({
	            url: ROOTCONFIG.host + "/f/walletDetail2?id=base" + filter_type,
	            method:"post",
	        }).success(function(ret){
	            $ionicLoading.hide();
	            if(ret.success) {
	                if(ret.data && ret.data.length>0){
	                    $scope.list = ret.data;
	                    for(var i in $scope.list){
	                        $scope.list[i].createTime = new Date($scope.list[i].time);
	                        var reasonObj = reasonHash[$scope.list[i].reason];
	                        $scope.list[i].changeAmount = reasonObj.prefix + Math.abs(parseInt($scope.list[i].amount));
	                        $scope.list[i].changeReason = reasonObj.reason;
	                        $scope.list[i].backgroundColor = reasonObj.backgroundColor;
	                        $scope.list[i].shorReason = reasonObj.shorReason;
	                    }
	                }else{
	                    $scope.list = null;
	                }
	            } else {
	                console.log(ret.msg);
	            }
	        }).error(function(ret){
	            $ionicLoading.hide();
	        });
	    };

	});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("couponDetailController", function($scope, $state, $rootScope, $http, $location, $stateParams, $ionicModal, $ionicLoading) {
	    var reasonHash = {
	        '1': {
	            'reason': '捐赠',
	            'iconClass': 'day1',
	            'prefix': ''
	        },
	        '4': {
	            'reason': '利息解冻',
	            'iconClass': 'day1',
	            'prefix': '+'
	        },
	        '7': {
	            'reason': '满额捐赠',
	            'iconClass': 'day1',
	            'prefix': '+'
	        },
	        '31': {
	            'reason': '确认收款',
	            'iconClass': 'day1',
	            'prefix': '+'
	        },
	        '5': {
	            'reason': '下单',
	            'iconClass': 'day1',
	            'prefix': '-'
	        },
	        'c': {
	            'reason': '取消订单',
	            'iconClass': 'day1',
	            'prefix': '+'
	        },
	        'd': {
	            'reason': '钱包规则变更',
	            'iconClass': 'day1',
	            'prefix': '+'
	        }
	    };

	    $http({
	        url: ROOTCONFIG.host + "/f/walletDetail2?id=newPointBase",
	        method:"post",
	    }).success(function(ret){
	        if(ret.success) {
	            console.log(ret);
	            $scope.list = ret.data;
	            for(var i in $scope.list){
	                $scope.list[i].time = new Date($scope.list[i].createTime);
	                $scope.list[i].reason = reasonHash[$scope.list[i].changeReason].reason;
	                $scope.list[i].iconClass = reasonHash[$scope.list[i].changeReason].iconClass;
	            }
	        } else {
	            console.log(ret.msg);
	        }
	    }).error(function(ret){
	        console.log("超时或后台报错");
	    });

	    $scope.showFilter = function(){
	        $ionicModal.fromTemplateUrl('./donation/couponDetail/couponDetailFilter.html', {
	            scope: $scope,
	            animation: 'slide-in-up'
	        }).then(function (modal) {
	            $scope.filterModal = modal;
	            $scope.filterModal.show();
	        });
	    };

	    $scope.closeModal = function(){
	        $scope.filterModal.hide();
	    };

	    $scope.$on('$destroy', function () {
	        if($scope.filterModal){$scope.filterModal.remove();}
	    });

	    $scope.filter = function(filter_type){
	        $scope.list = [];
	        $scope.filterModal.hide();
	        $scope.filter_type = filter_type;

	        $ionicLoading.show({ template: '数据加载中...' });
	        $http({
	            url: ROOTCONFIG.host + "/f/walletDetail2?id=newPoint" + filter_type,
	            method:"post",
	        }).success(function(ret){
	            $ionicLoading.hide();
	            if(ret.success) {
	                if(ret.data && ret.data.length>0){
	                    $scope.list = ret.data;
	                    for(var i in $scope.list){
	                        $scope.list[i].createTime = new Date($scope.list[i].time);
	                        var reasonObj = reasonHash[$scope.list[i].reason];
	                        $scope.list[i].changeAmount = reasonObj.prefix + Math.abs(parseInt($scope.list[i].amount));
	                        $scope.list[i].changeReason = reasonObj.reason;
	                        $scope.list[i].iconClass = reasonObj.iconClass;
	                    }
	                }else{
	                    $scope.list = null;
	                }
	            } else {
	                console.log(ret.msg);
	            }
	        }).error(function(ret){
	            $ionicLoading.hide();
	        });
	    };

	});

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("spreadWithdrawController", function ($scope, $rootScope, $http, $timeout, $ionicLoading, $state, $filter, $ionicPopup) {
	    $scope.vm = {
	        amount: 0
	    };
	    var amount = 0;

	    $ionicLoading.show({ template: '数据加载中...' });
	    $http({
	        url: ROOTCONFIG.host + "/f/wallet",
	        method: "post",
	    }).success(function (ret) {
	        $ionicLoading.hide();
	        if (ret.success) {
	            $scope.walletGrowFree = ret.data.growFree;
	            $scope.entryMin = 100;
	            $scope.entryMax = parseInt((ret.data.growFree/100))*100;

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
	        $timeout(function(){
	            if($scope.entryMin > $scope.entryMax){
	                $ionicPopup.show({
	                    template: '钱包余额不足',
	                    scope: $scope,
	                    buttons: [
	                        { text: '取消' },
	                        {
	                            text: '<b>确定</b>',
	                            type: 'button-positive',
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
	            url: ROOTCONFIG.host + "/f/exit",
	            method: "post",
	            data: $.param({ 'id':2 , "amount": $scope.vm.amount }),
	        }).success(function (ret) {
	            if (ret.success) {
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

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("charityWithdrawController", function ($scope, $rootScope, $http, $timeout, $ionicLoading, $state, $filter, $ionicPopup) {
	    $scope.vm = {
	        amount: 0
	    };
	    var amount = 0;

	    $ionicLoading.show({ template: '数据加载中...' });
	    $http({
	        url: ROOTCONFIG.host + "/f/wallet",
	        method: "post",
	    }).success(function (ret) {
	        $ionicLoading.hide();
	        if (ret.success) {
	            $scope.walletBaseFree = ret.data.baseFree;
	            $scope.entryMin = 100;
	            $scope.entryMax = parseInt((ret.data.baseFree/100))*100;

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
	        $timeout(function(){
	            if($scope.entryMin > $scope.entryMax){
	                $ionicPopup.show({
	                    template: '钱包余额不足',
	                    scope: $scope,
	                    buttons: [
	                        { text: '取消' },
	                        {
	                            text: '<b>确定</b>',
	                            type: 'button-positive',
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
	            url: ROOTCONFIG.host + "/f/exit",
	            method: "post",
	            data: $.param({ 'id':1 , "amount": $scope.vm.amount }),
	        }).success(function (ret) {
	            if (ret.success) {
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

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("spreadController", function($scope, $rootScope, $http, $location, $ionicPopup) {
		$http({
			url: ROOTCONFIG.host + "/f/mebTeam",
			method:"post",
		}).success(function(ret){
			if(ret.success) {
				$scope.activeCoinNum = ret.data.activeCoinNum;
				$scope.gameCoinNum = ret.data.gameCoinNum;
				$scope.group1Num = ret.data.group1Num;
				$scope.group2Num = ret.data.group2Num;
				$scope.group3Num = ret.data.group3Num;
				$scope.groupList = ret.data.groupList;
			} else {
				$scope.alert(ret.msg);
			}
		}).error(function(ret){
			$scope.alert(ret.msg||''+"请先退出后重新登录");
		});

		$scope.selectPerson = function(index){
			$scope.personIndex = index;
			$scope.memberId = $scope.groupList[index].id;
			$scope.phoneNum = $scope.groupList[index].phone;
			$scope.giveNumber = 1;
		};

		$scope.give = function(type){
			if(!$scope.phoneNum || !$scope.giveNumber){
				$scope.alert("输入手机号和赠送数量!");return;
			}
			if($scope.giveNumber <= 0){
				$scope.alert("请重新输入您的发送数量!");return;
			}
			var itemStr = type==='activationCode'?"激活服务":type==='coin'?"互捐服务":'';
			if(itemStr===''){return;}
			$ionicPopup.show({
				template: '您确定赠送<b id="amount3" style="color:#d22d19;font-weight:600">'+$scope.giveNumber+'</b>次<span id="amount4">'+itemStr+'</span>吗?',
				scope: $scope,
				buttons: [
					{ text: '取消' },
					{
						text: '<b>确定</b>',
						type: 'button-positive',
						onTap: function(e) {
							$scope.submit(type);
						}
					},
				]
			});
		}

		$scope.submit = function(type){
			var urls = type==='activationCode'?ROOTCONFIG.host + "/f/activeGive2":type==='coin'?ROOTCONFIG.host + "/f/gameCoinGive":'';
			if(urls===''){return;}
			$http({
				url: urls,
				method:"post",
				data: $.param({
	                'phone':$scope.phoneNum,
	                'count':$scope.giveNumber
	            }),
	            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
			}).success(function(ret){
				if(ret.success) {
					$scope.alert(ret.msg);
					if(type==='activationCode'){
						$scope.activeCoinNum = $scope.activeCoinNum - $scope.giveNumber;
						for(var i in $scope.groupList){
							if($scope.groupList[i].phone === $scope.phoneNum && $scope.groupList[i].state==='未激活'){
								$scope.groupList[i].state = '未实名认证';
							}
						}
					}else if(type==='coin'){
						$scope.gameCoinNum = $scope.gameCoinNum - $scope.giveNumber;
					}
					$scope.phoneNum = '';
					$scope.giveNumber = '';
				} else {
					$scope.phoneNum = '';
					$scope.giveNumber = '';
					$scope.alert(ret.msg);
				}
			}).error(function(ret){
				console.log("超时或后台报错");
			});
		};
		
	});

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("spreadRecordController", function($scope, $rootScope, $http, $location) {
	    $(".tab").on("touchstart",function(){
	        var index=$(this).index();
	        $(this).addClass("active7").siblings().removeClass("active7");
	        $(".sss1").eq(index).show().siblings().hide();
	    })
			
	    $.ajax({
	        type: "post",
	        timeout: 3000,
	        url: ROOTCONFIG.host + "/f/activeLog",
	        datatype: "json",
	        success: function(ret) {
	            if(ret.success) {
	                console.log("查询激活码交易记录成功");
	                var data = ret.data;
	                console.log(data);
	                for(var i in data) {
	                    var hh;
	                    if(data[i].receiverName==null){
	                        hh="本人激活消耗";
	                    }else{
	                        hh=data[i].receiverName;
	                    }
	                    $("#faWrap").append('<div class="notes"><ul><li><span>' + '发' + '&nbsp;' + '送' + '&nbsp;' + '人:' + '&nbsp;&nbsp;' + '</span><span>' + data[i].senderName + '</span><li><li><span>' + '获' + '&nbsp;' + '赠' + '&nbsp;' + '人:' +'&nbsp;&nbsp;' + '</span><span>' + hh + '</span><li><li><span>' + '数          量:' + '&nbsp;&nbsp;' + '</span><span>' + data[i].transCount + '个' + '<span></li><li><li><span>' + '发放时间:' + "&nbsp;&nbsp;" + '</span><span>' + data[i].createTime + '<span></li></ul><div>')
	                }
					var lengths=$("#faWrap .notes").length;
	                $(".conJh").html(lengths);
	                if(lengths>0){
	                    $(".jiHuoMa").addClass("active7");
	                    $("#faWrap").show();
	                    $("#faWrap1").hide();
	                }
	            } else {
	                console.log("查询激活码交易记录失败");
	            }
	        },
	        error: function() {
	            // 超时或后台报错
	            console.log("超时或后台报错");
	            $scope.alert(ret.msg+"请重新登录");
	            $state.go("login");
	        }
	    });
						
	    $.ajax({
	        type : "post",
	        timeout : 3000,
	        url : "/f/coinLog",
	        datatype : "json",
	        success : function(ret) {
	            if (ret.success) {
	                console.log(ret);
	                var data = ret.data;
	                console.log(data);
	                for(var i in data) {
	                  					var hh;
										var ss;
										if(data[i].receiverName==null){
											hh="本人排单消耗";
											
										}else{
											hh=data[i].receiverName;
										}
											if(data[i].senderName==null){
											ss="系统发放";
											
										}else{
											ss=data[i].senderName;
										}
	                    $("#faWrap1").append('<div class="notes"><ul><li><span>' + '发' + '&nbsp;' + '送' + '&nbsp;' + '人:' + '&nbsp;&nbsp;' + '</span><span>' + ss+ '</span><li><li><span>' + '获' + '&nbsp;' + '赠' + '&nbsp;' + '人:' +'&nbsp;&nbsp;' + '</span><span>' + hh + '</span><li><li><span>' + '数          量:' + '&nbsp;&nbsp;' + '</span><span>' + data[i].transCount + '个' + '<span></li><li><li><span>' + '发放时间:' + "&nbsp;&nbsp;" + '</span><span>' + data[i].createTime + '<span></li></ul><div>')
	                }
					var lengths=$("#faWrap1 .notes").length;
						$(".conPd").html(lengths);
						if(lengths==0){
							$(".jiHuoMa").addClass("active7");
							$("#faWrap").show();
							$("#faWrap1").hide();
						}
	                // 执行成功，返回正确结果
	            } else {
	                // 执行成功，结果错误
	            }
	        },
	        error : function() {
	            // 超时或后台报错
	        }
	    });
	});

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("shopController", function($scope, $rootScope, $http, $timeout, $parse, $location, $state, $ionicSlideBoxDelegate, ls, $ionicModal) {
		$scope.account = ls.data.account;
		var slideBox;
		$scope.$on('$ionicView.loaded', function () {
			$timeout(function () {
				slideBox = $ionicSlideBoxDelegate._instances.filter(function (s) {
					if (!s.$$delegateHandle) return false;
					return $parse(s.$$delegateHandle.slice(2, -2));
				})[0];
			});
		});
		
		var userPhoneNumber = localStorage.getItem('phoneNum');

		$scope.getShopIndexData = function(callback){
			$scope.hot_billing_product = null;
			$scope.hot_donation_product = null;
			$scope.hot_point_product = null;
			$http({
				url: ROOTCONFIG.host + "/shop/user/toShop.html?rid="+userPhoneNumber,
				method:"get",
			}).success(function(ret){
				if(ret.code !== 0 || !ret.data ){ return; }
				ls.setAccount('point',ret.data.point.point_free);
				ls.setAccount('ticket',ret.data.point.point2_free);
				$scope.carousel = ret.data.indexImage;
				if(slideBox){
					slideBox.update();
					slideBox.loop(true);
				}
				var catalogsItems = ret.data.catalogsItems;
				$scope.point_product = catalogsItems;
				var hotProduct = ret.data.hotProduct;
				for(var i in hotProduct){
					switch(hotProduct[i].productType){
						case 31:
							if(!$scope.hot_donation_product){
								$scope.hot_donation_product = hotProduct[i];//重销热门
							}
							break;
						case 37:
							if(!$scope.hot_point_product){
								$scope.hot_point_product = hotProduct[i];//积分热门
							}
							break;
						case 38:
							if(!$scope.hot_billing_product){
								$scope.hot_billing_product = hotProduct[i];//开单热门
							}
							break;
					}
				}
				if(callback)callback();
			}).error(function(ret){
				console.log("超时或后台报错");
			});
		};

		$scope.getShopIndexData();

		$scope.doRefresh = function(){
			$scope.getShopIndexData(function(){
				$scope.$broadcast('scroll.refreshComplete');
			});
		}

		$scope.goodDetail = function(param){
			if( !param ){ return; }
			if( $scope.searchModal ){ $scope.searchModal.remove(); }
			var id;
			if(typeof(param)==='string'){
				switch(param){
					case "hot_donation_product":
						id = $scope.hot_donation_product && $scope.hot_donation_product.id;
						break;
					case "hot_billing_product":
						id = $scope.hot_billing_product && $scope.hot_billing_product.id;
						break;
					case "hot_point_product":
						id = $scope.hot_point_product && $scope.hot_point_product.id;
						break;
				}
			}else if(typeof(param)==='number'){
				id = param;
			}
			if(!id ){ return; }
			$state.go('goodsDetail',{'id':id});
		};

		$scope.search = function(){
			$ionicModal.fromTemplateUrl('./shop/shop/search.html', {
	            scope: $scope,
	        }).then(function (modal) {
	            $scope.searchModal = modal;
	            $scope.searchModal.show();
	        });
		};
		
		$scope.closeModal = function(){
			$scope.searchModal.hide();
		};

	});

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

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

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("shopCenterController", function($scope, $rootScope, $http, ls) {
	    $scope.account = ls.data.account;
	    $scope.user = ls.data.user;
	});

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

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

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

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

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("orderController", function($scope, $rootScope, $http, $location,$timeout, $state, $ionicTabsDelegate, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicModal) {
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
	            url: ROOTCONFIG.host + "/shop/orders!signOrder.action?e.id="+order.id+"&e.orderdetailID="+order.orderdetailID,
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

	    $scope.queryExpress = function(product, $event){
	        $event.stopPropagation();
	        $http({
	            url: ROOTCONFIG.host + "/shop/order/searchkuaiDiInfo.html?expressCompanyName="+product.expressCompanyName+"&expressNo="+product.expressNo,
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
	        console.log(123);
	        $scope.ExpressModal.hide();
	    };

	});


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("orderSubmitController", function($scope, $rootScope, $http, $location, $state, $ionicLoading, $ionicModal, $ionicHistory, ls) {
	    $scope.buyNumber = 0;
	    $scope.amount = 0;
	    $scope.vm = {
	        'otherRequirement': ''
	    }
	    
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
	            data: $.param({ 'e.selectAddressID':$scope.defaultAddress.id, 'e.otherRequirement':$scope.vm.otherRequirement }),
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

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("payController", function ($scope, $rootScope, $http, $location, $state, Util, $stateParams, $ionicLoading, $timeout) {
		var imgFile ;

		$scope.img_upload = function (files) {
			imgFile = files[0];
			var reader = new FileReader();
			reader.onload = function(e){
				$scope.$apply(function(){
					$scope.imgSrc = e.target.result
				});
			};
			reader.readAsDataURL(files[0]);
		};

		$scope.submit= function(){
			if(!$scope.imgSrc){ return; }
			if(imgFile.size/1024 > 2000){
				$scope.alert("图片不能大于2M");
				return;
			}
			var data = new FormData();      //以下为像后台提交图片数据
			data.append('file', imgFile);
			data.append('isSaveScore', $scope.vm.keepPoint?1:0 );
			data.append('isPayTicket', $scope.vm.isPayTicket?1:0 );
			data.append('payType', 4);

			$ionicLoading.show({ template: '数据加载中...' });
			$http({
				method: 'post',
				url: ROOTCONFIG.host + '/shop/order/payOrders.html?e.id=' + $scope.vm.id + '&e.status=sure',
				data: data,
				transformRequest: angular.identity,
				headers: { 'Content-Type': undefined }
			}).success(function (ret) {
				$ionicLoading.hide();
				if(ret.code === 0){
					$scope.paySuccess(ret);
				}
			}).error(function(ret){
				$ionicLoading.hide();
				$scope.alert(ret);
			});
		};

	});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("orderPayController", function($scope, $rootScope, $http, $window, $timeout, $stateParams, $state, $ionicLoading, $ionicModal, $ionicHistory, $ionicPopup) {
	    var id = $stateParams.id;
	    if(!id){ $state.go('main.shop'); }

	    $scope.vm = {
	        'id': $stateParams.id,
	        'keepPoint': true,
	        'isPayTicket': true,
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
	        }else if(payCode==='alipayescow'){
	            $http({
	                method: 'post',
	                url: ROOTCONFIG.host + '/shop/order/alipayPay.html?e.id=' + id + '&e.status=pass',
	                data: $.param({
	                    'isSaveScore': $scope.vm.keepPoint?1:0 ,
	                    'isPayTicket': $scope.vm.isPayTicket?1:0,
	                    'payType': 1
	                }),
	                headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
	            }).success(function (ret) {
	                if(ret.data){
	                    document.body.innerHTML = ret.data;
	                    document.forms[0].submit(); 
	                }
	            }).error(function(ret){
	            });
	        }else if(payCode==='weixin'){
	            $http({
	                method: 'post',
	                url: ROOTCONFIG.host + '/shop/order/alipayPay.html?e.id=' + id + '&e.status=pass',
	                data: $.param({
	                    'isSaveScore': $scope.vm.keepPoint?1:0 ,
	                    'isPayTicket': $scope.vm.isPayTicket?1:0,
	                    'payType': 2
	                }),
	                headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
	            }).success(function (ret) {
	                $ionicPopup.show({
	                    template: '<img style="width:100%;" src="data:image/png;base64,'+ ret.retsign + '"/>',
	                    title: '请用微信扫描二维码支付',
	                    buttons: [
	                       { text: '关闭',type: 'button-positive' }
	                    ]
	                });
	                if(ret.data){
	                    console.log(ret);
	                }
	            }).error(function(ret){
	            });
	        }else{
	            $http({
	                method: 'post',
	                url: ROOTCONFIG.host + '/shop/order/payOrders.html?e.id=' + id + '&e.status=pass',
	                data: $.param({
	                    'isSaveScore': $scope.vm.keepPoint?1:0 ,
	                    'isPayTicket': $scope.vm.isPayTicket?1:0,
	                    'payType': 3
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

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

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

	    $scope.queryExpress = function(product){
	        $http({
	            url: ROOTCONFIG.host + "/shop/order/searchkuaiDiInfo.html?expressCompanyName="+product.expressCompanyName+"&expressNo="+product.expressNo,
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


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

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


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

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

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("userController",function($scope, $rootScope, $http, $location, $state, $ionicPopup, ls) {
		$scope.user = ls.data.user;
			
		$scope.message = "尊敬的会员您好:请先激活您的会员账户,然后进行实名认证并且填写您的银行卡信息,请确保无误,祝您体验愉快!!!";
		$scope.hideMotai = function(){
			$("#motai").hide();
		}
		$scope.showMotai = function(){
			$("#motai").show();
		}
		$scope.authentication = function(){
			if(!$scope.user.userState || $scope.user.userState===""){
				return;
			}
			switch($scope.user.userState){
				case "正常":
					$scope.alert("您的账户已经实名,请不要重复实名");
					break;
				case "未实名认证":
					$state.go("authentication");
					break;
				case "未激活":
					$scope.alert("请先激活您的会员账户,然后进行实名认证");
					break;
			}
		};

		$scope.logout = function(){
			$ionicPopup.show({
				template: '您确定要退出吗?',
				scope: $scope,
				buttons: [
					{ text: '取消' },
					{
						text: '确定',
						type: 'button-positive',
						onTap: function(e) {
							$scope.logout_action();
						}
					},
				]
			});
		};
		$scope.news=function(){
			$scope.alert("暂无新的新闻消息")
		}
		$scope.logout_action = function(){
			var phone=localStorage.getItem("phoneNum");
			var pwssord=localStorage.getItem("usePw");
			localStorage.clear();
			localStorage.setItem("phoneNum",phone);
			localStorage.setItem("usePw",pwssord);
			$state.go("login");
			$http.post(ROOTCONFIG.host + "/f/bye")
			.success(function(ret){
			})
			.error(function(ret){
			});

			$http.post(ROOTCONFIG.host + "/shop/account!loginout.action")
			.success(function(ret){
			})
			.error(function(ret){
			});
		}

		$scope.showalert = function(){
			$scope.alert("暂无新手指南");
		};
	});

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("loginController", function($scope, $rootScope, $http, $location, $state, ls) {
	    $scope.phoneNumber = localStorage.getItem("phoneNum");
	    $scope.passWord = localStorage.getItem("usePw");
	    if($scope.phoneNumber==='null'){ $scope.phoneNumber = ''; }
	    if($scope.passWord==='null'){ $scope.passWord = ''; }
	    $scope.showErrorMsg = function(msg){
	        $(".error1").html(msg).fadeIn(2000, function(){ $(this).fadeOut(400); });
	    };
	    $scope.login = function(){
	        if(!/^[1][34578][0-9]{9}$/.test($scope.phoneNumber)){
	            $scope.showErrorMsg("你的登录手机号格式不对,请重新输入");
	            return;
	        }
	        if(!$("#xieyi").prop("checked")) {
	            $scope.showErrorMsg("请先勾选用户协议");
	        }
	        if(!$scope.passWord.length){ return; }
	        var hash_password = hex_md5($scope.passWord);
	        $http({
	            url: ROOTCONFIG.host + "/f1/login",
	            method:"post",
	            data: $.param({
	                'phone':$scope.phoneNumber,
	                'pwd':hash_password
	            }),
	        }).success(function(ret){
	            if(ret.success) {
	                localStorage.setItem("baseRate",ret.data.baseRate);
	                localStorage.setItem("pointRate",ret.data.pointRate);
	                if(ret.data.token){
	                    localStorage.setItem("token",ret.data.token);
	                    $http.defaults.headers.common.token = ret.data.token;
	                }
	                if($("#rem_pw").prop("checked")) {
	                    localStorage.setItem("phoneNum",$scope.phoneNumber);
	                    localStorage.setItem("usePw",$scope.passWord);
	                } else {
	                    localStorage.removeItem("usePw");
	                }
	                if(ret.redirect=="freeze"){
	                    $state.go("freeze");
	                }else if(ret.redirect=="oldPwd"){
	                    $scope.alert('系统账户安全策略升级，请重新设定您的密码！');
	                    $state.go("setting");
	                }else{
	                    $scope.getUserInfo();
	                }
	            }  else{
	                $scope.showErrorMsg(ret.msg);
	            }
	        }).error(function(ret){
	            $scope.showErrorMsg("超时或后台报错");
	        });
	    };

	    $scope.getUserInfo = function(){
	        var style_dict = {
	            "正常":{"color":"#94c945"},
	            "未实名认证":{"color":"#ba1f2f"},
	            "未激活":{"color":"#f9e101"},
	            "冻结":{"color":"#2aafda"},
	        }
	        $http.post(ROOTCONFIG.host + "/f/mebInfo")
	        .success(function(ret) {
	            if(!ret.data){return;}
	            var data = ret.data || {};
	            ls.setUser('name',data.name);
	            ls.setUser('phone',data.phone);
	            ls.setUser('refereePhone',data.refereePhone);
	            ls.setUser('regdate',data.regdate.substring(0, 10));
	            ls.setUser('level',data.level===1?"白银会员":data.level===2?"黄金会员":data.level===3?"钻石会员":"皇冠会员");
	            ls.setUser('levelImg',data.levelImg);
	            ls.setUser('userState',data.state);
	            ls.setUser('userStateStyle',style_dict[data.state]||{"color":"#e02538"});
	            if(data.state === '未激活'){
	                $rootScope.showAll = false;
	                $state.go('main.shop');
	            }else{
	                $rootScope.showAll = true;
	                $state.go('main.donation');
	            }
	        });
	    }

	    /*软键盘BUG*/
	    var heigHt = window.innerHeight;
	    $("#usePhone").focus(function() {
	        $("#wrapss").css({ "height": heigHt });
	    }).blur(function() {
	        $("#wrapss").css({ "height": "100%" });
	    });
	    $("#pwdd").focus(function() {
	        $("#wrapss").css({ "height": heigHt });
	    }).blur(function() {
	        $("#wrapss").css({ "height": "100%" });
	    });
	});

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("registerController",function($scope, $rootScope, $interval, $http, $location, $state) {
		$scope.countDown = 0;
		$scope.vm = {
			'userAccount':'',
			'verifyCode':'',
			'pwd1':'',
			'pwd2':'',
			'userName':'',
			'inviterAccount':'',
		};

		$scope.getVerifyCode = function(){
			if($scope.countDown!==0){return;}
			if($scope.vm.userAccount==""){
				$scope.showErrorMsg("请填写手机号");return;
			}
			if((!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.vm.userAccount))
				&&(!/^[1][3578][0-9]{9}$/.test($scope.vm.userAccount))){
				$scope.showErrorMsg("请填写正确的手机号");return;
			}
			
			$scope.countDown = 60;
			var timer = $interval(function(){
				if($scope.countDown - 1 === 0){
					$scope.countDown = 0;
				}else{
					$scope.countDown = $scope.countDown - 1;
				}
			}, 1000, 60);

			$http({
	            url: ROOTCONFIG.host + "/f1/yzm",
	            method:"post",
	            data: $.param({
					phone : $scope.vm.userAccount,
	            }),
	            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
	        }).success(function(ret){
	           if (ret.success) {
					$scope.alert(ret.msg);
				} else {
					$scope.alert(ret.msg);
				}
	        }).error(function(ret){
	            $scope.showErrorMsg("请求超时");
	        });
		};
		
		$scope.showErrorMsg = function(msg){
			$("#error span").html(msg).fadeIn(500, function(){ $(this).fadeOut(500); });
		};
		
		$scope.register = function(){
			if($scope.vm.userAccount==""||$scope.vm.pwd1==""||$scope.vm.pwd2==""||$scope.vm.userName==""||$scope.vm.verifyCode==""){
				$scope.showErrorMsg("请填写完整信息");return;
			}
			if((!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.vm.account))
				&&(! /^[1][34578][0-9]{9}$/.test($scope.vm.userAccount))){
				$scope.showErrorMsg("注册手机号格式有误");return;
			}
			if(!/^\d{6}\b/.test($scope.vm.verifyCode)){
				$scope.showErrorMsg("验证码为6位数字");return;
			}
			if(!/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,36}$/.test($scope.vm.pwd1)){
				$scope.showErrorMsg("密码由大写字母，小写字母和数字组成且长度在8-36位之间");return;
			}
			if($scope.vm.pwd1 !== $scope.vm.pwd2){
				$scope.showErrorMsg("两次密码输入不一致");return;
			}
			if(!/^[\u4E00-\u9FA5]{2,10}$/.test($scope.vm.userName)){
				$scope.showErrorMsg("请输入有效姓名");return;
			}
			if(!/^[1][34578][0-9]{9}$/.test($scope.vm.inviterAccount)){
				$scope.showErrorMsg("邀请人手机号码格式有误");return;
			}
			if($scope.userAccount === $scope.vm.inviterAccount){
				$scope.showErrorMsg("注册手机号和邀请人手机号不能相同");return;
			}

			$http({
	            url: ROOTCONFIG.host + "/f1/reg",
	            method:"post",
	            data: $.param({
	                pwd: hex_md5($scope.vm.pwd1),
					phone: $scope.vm.userAccount,
					name: $scope.vm.userName,
					referee: $scope.vm.inviterAccount,
					yzm: $scope.vm.verifyCode
	            }),
	            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
	        }).success(function(ret){
	            if(ret.success) {
					$scope.alert("注册成功");
					setTimeout(function(){ $state.go('login'); },1000);
				} else {
					$scope.showErrorMsg(ret.msg);
				}
	        }).error(function(ret){
	            $scope.showErrorMsg("请求超时");
	        });
		};

		/*软键盘BUG*/
		var heigHt=window.innerHeight;
		$("#phoneR").focus(function(){
			$("#wrap").css({"height":heigHt});
		}).blur(function(){
			$("#wrap").css({"height":"100%"});
		});
		$("#yaz").focus(function(){
			$("#wrap").css({"height":heigHt});
		}).blur(function(){
			$("#wrap").css({"height":"100%"});
		});
		$("#pwd1").focus(function(){
			$("#wrap").css({"height":heigHt});
		}).blur(function(){
			$("#wrap").css({"height":"100%"});
		});
		$("#pwd2").focus(function(){
			$("#wrap").css({"height":heigHt});
		}).blur(function(){
			$("#wrap").css({"height":"100%"});
		});
		$("#useName").focus(function(){
			$("#wrap").css({"height":heigHt});
		}).blur(function(){
			$("#wrap").css({"height":"100%"});
		});
		$("#phoneY").focus(function(){
			$("#wrap").css({"height":heigHt});
		}).blur(function(){
			$("#wrap").css({"height":"100%"});
		});


	});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("forgetController",function($scope, $rootScope, $interval, $http, $location, $state) {
		$scope.countDown = 0;
		$scope.vm = {
			'userAccount':'',
			'userName':'',
			'verifyCode':'',
			'pwd1':'',
			'pwd2':'',
		};

		$scope.getVerifyCode = function(){
			if($scope.countDown!==0){return;}
			if($scope.vm.userAccount==""||$scope.vm.userName==""){
				$scope.showErrorMsg("请填写手机号和真实姓名");return;
			}
			if((!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.vm.userAccount))
				&&(!/^[1][3578][0-9]{9}$/.test($scope.vm.userAccount))){
				$scope.showErrorMsg("请填写正确的手机号和姓名");return;
			}

			$scope.countDown = 60;
			var timer = $interval(function(){
				if($scope.countDown - 1 === 0){
					$scope.countDown = 0;
				}else{
					$scope.countDown = $scope.countDown - 1;
				}
			}, 1000, 60);

			$http({
	            url: ROOTCONFIG.host + "/f1/yzm2",
	            method:"post",
	            data: $.param({
					phone : $scope.vm.userAccount,
					name: $scope.vm.userName
	            }),
	            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
	        }).success(function(ret){
	           if (ret.success) {
					$scope.alert(ret.msg);
				} else {
					$scope.alert(ret.msg);
				}
	        }).error(function(ret){
	            $scope.showErrorMsg("请求超时");
	        });
		};

		$scope.showErrorMsg = function(msg){
			$("#error2 span").html(msg).fadeIn(500, function(){ $(this).fadeOut(500); });
		};

	    $scope.changePassword = function(){
			if($scope.vm.userAccount==""||$scope.vm.pwd1==""||$scope.vm.pwd2==""||$scope.vm.userName==""||$scope.vm.verifyCode==""){
				$scope.showErrorMsg("请填写完整信息");return;
			}
			if((!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test($scope.vm.userAccount))
				&&(!/^[1][3578][0-9]{9}$/.test($scope.vm.userAccount))){
				$scope.showErrorMsg("注册手机号格式有误");return;
			}
			if(!/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,36}$/.test($scope.vm.pwd1)){
				$scope.showErrorMsg("密码由大写字母，小写字母和数字组成且长度在8-36位之间");return;
			}
			if(!/^\d{6}\b/.test($scope.vm.verifyCode)){
				$scope.showErrorMsg("验证码为6位数字");return;
			}
			if($scope.vm.pwd1 !== $scope.vm.pwd2){
				$scope.showErrorMsg("两次密码输入不一致");return;
			}
			if(!/^[\u4E00-\u9FA5]{2,10}$/.test($scope.vm.userName)){
				$scope.showErrorMsg("请输入有效姓名");return;
			}

			$http({
	            url: ROOTCONFIG.host + "/f1/forget",
	            method:"post",
	            data: $.param({
	                pwd: hex_md5($scope.vm.pwd1),
					phone: $scope.vm.userAccount,
					name: $scope.vm.userName,
					yzm: $scope.vm.verifyCode
	            }),
	            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
	        }).success(function(ret){
	            if (ret.success) {
					$scope.alert(ret.msg);
					$state.go("login");
				} else {
					$scope.alert(ret.msg);
				}
	        }).error(function(ret){
	            $scope.showErrorMsg("请求超时");
	        });
		};
		
		/*软键盘BUG*/
		var heigHt=window.innerHeight;
		$("#phoneZ").focus(function(){
			$("#wrap").css({"height":heigHt});
		}).blur(function(){
			$("#wrap").css({"height":"100%"});
		});
		$("#sey").focus(function(){
			$("#wrap").css({"height":heigHt});
		}).blur(function(){
			$("#wrap").css({"height":"100%"});
		});
		$("#pwd3").focus(function(){
			$("#wrap").css({"height":heigHt});
		}).blur(function(){
			$("#wrap").css({"height":"100%"});
		});
		$("#pwd4").focus(function(){
			$("#wrap").css({"height":heigHt});
		}).blur(function(){
			$("#wrap").css({"height":"100%"});
		});
		/*软键盘BUG结束*/
	});

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("feedbackController",function($scope, $rootScope, $http, $location, $state) {
	    var ridMsg;
	    $.ajax({
	        type: "post",
	        timeout: 3000,
	        url: ROOTCONFIG.host + "/f/msgType",
	        datatype: "json",
	        success: function(ret) {
	            console.log(ret)
	            if(ret.success) {
	                console.log(ret)
	                var data = ret.data;
	                for(var i in data) {
	                    $("#xuze").append("<span class='weni'>" + data[i].typeName + "</span>")
	                }
	                $(".weni").on("touchstart", function() {
	                    var index = $(this).index();
	                    $(this).addClass("active").siblings().removeClass("active");
	                    ridMsg = data[index].rid;
	                })
	            } else {
	                // 执行成功，结果错误
	            }
	        },
	        error: function() {
	            // 超时或后台报错
	        }
	    });

	    $("#btnss").click(function() {
	        var vs = $("#seMsg").val();
	        ridMsg=ridMsg;
	        console.log(ridMsg)
	        if(vs==""){
	            $scope.alert("请输入您的留言");
	        }else if(ridMsg==undefined){
	            $scope.alert("请选择您的问题类型");
	        }else{		
	            send(ridMsg,vs)
	        }
	    })
	    function send(ridMsg,vs){	
	        $.ajax({
	            type: "post",
	            timeout: 3000,
	            url: ROOTCONFIG.host + "/f/msg",
	            data: {
	                typeId: ridMsg,
	                msg: vs
	            },
	            datatype: "json",
	            success: function(ret) {
	                if(ret.success) {
	                    console.log(ret);
	                    // 执行成功，返回正确结果
	                    $scope.alert(ret.msg);
	                } else {
	                    // 执行成功，结果错误
	                    console.log(ret.msg)
	                }
	            },
	            error: function() {
	                // 超时或后台报错
	            }
	        });
	    }
	});

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("addAddressController", function ($scope, $rootScope, $http, $state, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicLoading, $timeout) {
	    $scope.onerror = function (msg) {
	        $("#error3").html(msg).fadeIn(2000, function () { $(this).fadeOut(4000); });
	    };

	    $scope.vm = $scope.$parent.addAddressVM ;

	    $scope.submit = function () {
	        if (!$scope.vm.phoneNumber || !$scope.vm.name || !$scope.vm.zip || !$scope.vm.address) { $scope.onerror("请填写完整信息"); return; }
	        if (!/^[1][34578][0-9]{9}$/.test($scope.vm.phoneNumber)) { $scope.onerror("注册手机号格式有误"); return; }
	        if (!/^[\u4E00-\u9FA5]{2,10}$/.test($scope.vm.name)) { $scope.onerror("请输入有效中文姓名"); return; }
	        if (!/^\d{6}$/.test($scope.vm.zip)) { $scope.onerror("邮编为6位数字"); return; }
	        if(!$scope.vm.selectedAddress){ $scope.onerror("请选择城市"); return; }
	        $http({
	            url: ROOTCONFIG.host + "/shop/user/saveAddress.html",
	            method: "post",
	            data: $.param({
	                'address.id': $scope.vm.id || "",
	                'address.name': $scope.vm.name,
	                'address.address': $scope.vm.address,
	                'address.zip': $scope.vm.zip,
	                'address.mobile': $scope.vm.phoneNumber,
	                "address.isdefault": 'y',
	                "address.province": $scope.vm.selectedAddress.province.code,
	                "address.city": $scope.vm.selectedAddress.city.code,
	                "address.area": $scope.vm.selectedAddress.area.code,
	            }),
	            headers: { "Content-type": 'application/x-www-form-urlencoded; charset=UTF-8' },
	        }).success(function (ret) {
	            if (ret.code !== 0 || !ret.data) { return; }
	            if($scope.vm.index !== undefined){
	                var parent_data = $scope.$parent.addressList[$scope.vm.index];
	                parent_data.name = $scope.vm.name;
	                parent_data.mobile = $scope.vm.phoneNumber;
	                parent_data.address = $scope.vm.address;
	            }else{
	            	$scope.$parent.addressList.push({
	            		'name': $scope.vm.name,
	            		'mobile': $scope.vm.phoneNumber,
	            		'address': $scope.vm.address,
	                    'pcadetail': $scope.vm.selectedAddress.province.name + " " + $scope.vm.selectedAddress.city.name + " " + $scope.vm.selectedAddress.area.name
	            	});
	            }
	            $timeout(function(){
	                $scope.closeModal();
	            },1000);
	            $ionicLoading.show({ template: ret.data, duration: 1000, noBackdrop: true });
	        }).error(function (ret) {
	            console.log("超时或后台报错");
	        });
	    };

	    var selectedAddress = {};
	    $scope.chooseArea = function () {
	        $ionicLoading.show({ template: '数据加载中...' });
	        $http({
	            url: ROOTCONFIG.host + "/shop/user/getAllProvinces.html",
	            method: "get",
	        }).success(function (ret) {
	            $ionicLoading.hide();
	            if (ret.code !== 0 || !ret.data) { return; }
	            $scope.provincesData = [];
	            angular.forEach(Object.keys(ret.data), function (item, index) {
	                $scope.provincesData.push(ret.data[item]);
	            });
	            $ionicModal.fromTemplateUrl('./user/addAddress/cirySelect-modal.html', {
	                scope: $scope,
	                animation: 'slide-in-up'
	            }).then(function (modal) {
	                $scope.PCTModal = modal;
	                $scope.PCTModal.show();
	            });
	        }).error(function (ret) {
	            $ionicLoading.hide();
	            console.log("超时或后台报错");
	        });
	    };

	    $scope.chooseProvince = function (index) {
	        $scope.citiesData = [];
	        selectedAddress.province = $scope.provincesData[index];
	        $ionicLoading.show({ template: '数据加载中...' });
	        $http({
	            url: ROOTCONFIG.host + "/shop/user/selectCitysByProvinceCode.html?provinceCode=" + $scope.provincesData[index].code,
	            method: "get",
	        }).success(function (ret) {
	            $ionicLoading.hide();
	            if (ret.code !== 0 || !ret.data) { return; }
	            $scope.citiesData = JSON.parse(ret.data);
	            $scope.showBackBtn = true;
	            $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').next();
	            $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').update();
	            $ionicScrollDelegate.$getByHandle('PCTSelectCity').scrollTop();
	        }).error(function (ret) {
	            $ionicLoading.hide();
	            console.log("超时或后台报错");
	        });
	    };

	    $scope.chooseCity = function (index) {
	        $scope.townData = $scope.citiesData[index].children;
	        selectedAddress.city = $scope.citiesData[index];
	        $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').next();
	        $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').update();
	        $ionicScrollDelegate.$getByHandle('PCTSelectCity').scrollTop();
	    };

	    $scope.chooseTown = function (index) {
	        selectedAddress.area = $scope.townData[index];
	        $scope.vm.selectedAddress = selectedAddress;
	        $timeout(function () { $scope.PCTModal.hide(); }, 200);
	    };
	    
	});

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("addressController", function($scope, $rootScope, $http, $ionicModal, $state, $stateParams) {
		 $scope.addressList = [];
		 
		 $http({
	        url: ROOTCONFIG.host + "/shop/user/addressList.html",
	        method:"post",
	    }).success(function(ret){
	        if(ret.code !== 0 || !ret.data ){ return; }
			$scope.addressList = ret.data;
			for(var i in $scope.addressList){
				if($scope.addressList[i].isDefault==='y'){$scope.defaultAddressIndex = i;break;}
			}
	    }).error(function(ret){
	        console.log("超时或后台报错");
	    });

		$scope.changeDefault = function(index){
			if($scope.defaultAddressIndex===index){return;}
			var rid = $scope.addressList[index].rid;
			var addr = $scope.addressList[index].addr;
			$http({
				url: ROOTCONFIG.host + "/f/addrDefUp",
				method: "post",
				data: $.param({ id: rid }),
	            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
			}).success(function(ret){
				$scope.addressList[index].isDefault=1;
			}).error(function(ret){
				
			});
		};
		
		$scope.addAddressVM = {};
	 	// 修改地址
		$scope.changeAddress = function(index){
			var data = $scope.addressList[index];
			$scope.addAddressVM = {
				'name': data.name,
				'address': data.address,
				'zip': data.zip,
				'phoneNumber': data.mobile,
				'selectedAddress':{
					'province':{ 'code':data.province, 'name':data.pcadetail.split(' ')[0] },
					'city':{ 'code':data.city, 'name':data.pcadetail.split(' ')[1] },
					'area':{ 'code':data.area, 'name':data.pcadetail.split(' ')[2] }
				},
				'id': data.id,
				'index': index
			}
			$ionicModal.fromTemplateUrl('./user/address/addAddress.html', {
				scope:$scope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$scope.editAddressModal = modal;
				$scope.editAddressModal.show();
			});
		}

		$scope.addAddress = function(){
			$scope.addAddressVM = {}
			$ionicModal.fromTemplateUrl('./user/address/addAddress.html', {
				scope:$scope,
				animation: 'slide-in-up'
			}).then(function (modal) {
				$scope.editAddressModal = modal;
				$scope.editAddressModal.show();
			});
		}
		
		$scope.closeModal = function(){
	        $scope.editAddressModal.remove();
	    };

		// 删除地址
		$scope.deleteAddress = function(index){
			if($scope.defaultAddressIndex===index){$scope.alert("默认地址不能删除");return;}
	        $http({
				url: ROOTCONFIG.host + "/shop/user/deleteAddressAjax.html?id=" + $scope.addressList[index].id,
				method: "get",
			}).success(function(ret){
				if(ret.code === 0){
					$scope.addressList.splice(index,1);
				}
			}).error(function(ret){
				
			});          
		}

	});



/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("accountController", function($scope, $rootScope, $http, $location, $state, $stateParams) {
	    $.ajax({
	        url: ROOTCONFIG.host + "/f/mebAccQry",		
	        type: 'get',
	        dataType: 'json', //主要是这里和原来的json改变了！	
	        success: function(ret) {
	            console.log(ret)
	            var data=ret.data;
	//          var leng=data.length;
	            if(ret.success) {
	                var kh=data.bankNum;
	                var yh=data.depositBank;
	                var xh=data.detailBank;
	                var kh1=data.bankNum2;
	                var yh1=data.depositBank2;
	                var xh1=data.detailBank2;
	                 var zhifubao=data.alipayId;
	                $(".kh").html(kh);
	                $(".yh").html(yh);
	                $(".xh").html(xh);			
	                $(".kh1").html(kh1);			
	                $(".yh1").html(yh1);
	                $(".xh1").html(xh1);
	                $(".account_zhifubao").html(zhifubao);
					$(".account_xiugai").on("touchstart",function(){
				
	                    $state.go("addAccount",{ bankNum: data.bankNum, depositBank: data.depositBank, detailBank: data.detailBank, bankNum2: data.bankNum2, depositBank2: data.depositBank2, detailBank2: data.detailBank2});			 					
	                });
	            }
	        }
	    });
	   
	    $('.account_more').on("touchstart",function(){
	        $state.go("addAccount");
	    })
	});

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("addAccountController", function($scope, $rootScope, $http, $location, $state, $stateParams) {

	    
	    $scope.vm = {
	    	'bankNum': $stateParams.bankNum,
	    	'depositBank':$stateParams.depositBank,
	    	'detailBank':$stateParams.detailBank,
	    	'bankNum2':$stateParams.bankNum2,
	    	'depositBank2':$stateParams.depositBank2,
	    	'detailBank2':$stateParams.detailBank2,
			'alipayId':$stateParams.alipayId,
	    };
	    
	    $scope.showErrorMsg = function(msg){
	        $("#addAccount_error span").html(msg).fadeIn(500, function(){ $(this).fadeOut(4000); });
	    }
	    $scope.submit = function(){
	        if(!/^\d{16,19}$/.test($scope.vm.bankNum)){
	            $scope.alert("请输入正确银行卡号");
	            return;
	        }
	        if($scope.vm.depositBank=="" || $scope.vm.detailBank=="" ){
	            $scope.alert("开户行和详细支行都不能为空");
	            return;
	        }
	        $http({
	            url: ROOTCONFIG.host + "/f/mebAccUp",
	            method:"post",
	            data: $.param({
	                bankNum: $scope.vm.bankNum,
	                depositBank: $scope.vm.depositBank,
	                detailBank: $scope.vm.detailBank,
	                bankNum2: $scope.vm.bankNum2,
	                depositBank2: $scope.vm.depositBank2,
	                detailBank2: $scope.vm.detailBank2,
	                alipayId:$scope.vm.alipayId
	            }),
	            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
	        }).success(function(ret){
	            if(ret.success) {
	                $scope.alert("您的银行卡信息更新成功");
	                setTimeout(function(){
	                    $state.go("account");
	                },1000);
	            } else {
	                $scope.alert(ret.msg);
	            }
	        }).error(function(ret){
	            $scope.showErrorMsg("超时或后台报错");
	        });
	    }
	});

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("settingController",function($scope, $rootScope, $http, $location, $state) {
	    $("#qued").click(function(){
	        var yzpwd =/^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*).{8,36}$/
	        var phoneNum = /^[1][34578][0-9]{9}$/;
	        var oldPwd=$("#oldPwd").val();
	        var hashOld = hex_md5(oldPwd);
	        var newPwd=$("#pwd3").val();
	        var newPwd1=$("#pwd4").val();
	        var phoneZ=$("#phoneZ").val();
	        var hashNew=hex_md5(newPwd);
	        var bool3=yzpwd.test(newPwd);
	        var bool4 = phoneNum.test(phoneZ);
	        var oerror = $("#error2 span");
	        oerror.hide().html("");
	    	if(phoneZ == "" || oldPwd == "" || newPwd == "") {
	            oerror.html("请填写完整信息").fadeIn(2000, function() {
	                $(this).fadeOut(100);
	            });
		    } else if(!bool4) {
	            oerror.html("注册手机号格式有误").fadeIn(2000, function() {
	                $(this).fadeOut(100);
	            });
		    }else if(!bool3) {
	            oerror.html("密码由大写字母，小写字母和数字组成且长度在8-36位之间").fadeIn(2000, function() {
	                $(this).fadeOut(100);
	            });
	        }else if(!(newPwd === newPwd1)) {
	            oerror.html("两次密码输入不一致").fadeIn(2000, function() {
	                $(this).fadeOut(100);
	            });
	        }else{
	    		$.ajax({
	                type : "post",
	                timeout : 3000,
	                url : "/f/pwd",
	                data : {
	                    oldPwd : hashOld,
	                    newPwd : hashNew
	                },
	                datatype : "json",
	                success : function(ret) {
	                    console.log(ret);
	                    if (ret.success) {
	                        $scope.alert(ret.msg);
	                        // 执行成功，返回正确结果
	                        window.history.back();
	                    } else {
	                        $scope.alert(ret.msg);
	                        // 执行成功，结果`错误
	                    }
	                },
	                error : function() {
	                    // 超时或后台报错
	                    $scope.alert(ret.msg);
	                }
	            });
	        }
	    })
	});

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("signinController",function($scope, $rootScope, $http, $location, $state) {
		$scope.signState = '签&nbsp;&nbsp;到'; 

		$scope.submit = function(){
			$http({
				url: ROOTCONFIG.host + "/f/signMember",
				method:"post",
			}).success(function(ret){
				if(ret.success) {
					var data=ret.data;
					if(data=='null'){
						$scope.alert(ret.msg);	
					}else{
						window.location.reload();
					}
				}
			}).error(function(ret){
				$scope.alert("请求出错");
			});
		};

		$http({
			url: ROOTCONFIG.host + "/f/getSignData",
			method:"post",
		}).success(function(ret){
			if(ret.success) {
				$scope.signState = ret.data.isSign?'已签到':'签&nbsp;&nbsp;到'; 
				
				var num = ret.data.days;
				if(num >=999){
					num = 999;
				}else{
					var len = num.toString().length;  
					while(len < 3) {  
						num = "0" + num;  
						len++;  
					}
				}
				$scope.days = num;

				$scope.signDays2 = ret.data.bonusList[0].signDays2; //签到天数
				$scope.signDays = ret.data.bonusList[0].signDays; //要求签到天数
				var percent = (($scope.signDays2 / $scope.signDays) * 100);
				var progress = (percent > 100 ? 100 : percent) +"%";
				$('.ah').css('width',progress);

				$scope.bonusSum = ret.data.bonusList[0].bonusSum; //已获奖励数量
			}
		}).error(function(ret){
			$scope.showErrorMsg("请求出错");
		});

	});

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("authenticationController",function($scope, $rootScope, $http, $ionicLoading, $location, $state, $ionicPopup, ls) {
		document.addEventListener("DOMContentLoaded", function(event) {
	        ImagesZoom.init({
	            "elem": ".primary"
	        });
	    }, false);

	    var picSrc;
	    var idCard;
	    var trueName;
	    var bankNum ;
	    var depositBank1;
	    var depositBank2;
	    var picSrc1;

	    $scope.user = ls.data.user;
	    var useName1= $scope.user.name;
	    $("#zh").localResizeIMG({
	        quality: 0.1,
	        success: function (result) {
	            var img = new Image();
	            img.src = result.base64;
	            $("#oomg").prop("src",result.base64);
	        }
	    });
	    $("#zh1").localResizeIMG({
	        quality: 0.1,
	        success: function (result) {
	            var img1 = new Image();
	            img1.src = result.base64;
	            $("#oomg1").prop("src",result.base64);
	        }
	    });

	    var isLoading = false;
	    $scope.submit_action = function(){
	        if( isLoading ){ return; }
	        isLoading = true;
	        $ionicLoading.show({ template: '数据加载中...' });
	        $http({
	            url: ROOTCONFIG.host + "/f/auth",
	            method:"post",
	            data: $.param({
	                bankNum: bankNum,
	                depositBank: depositBank1,
	                detailBank:depositBank2,                            
	                name: trueName,
	                id: idCard,
	                pic:picSrc,
	                pic2:picSrc1
	            }),
	        }).success(function(ret){
	            $ionicLoading.hide();
	            isLoading = false;
	            if(ret.success) {
	                $scope.alert(ret.msg + "请等待审核");
	            } else {
	                $scope.alert(ret.msg);
	            }
	            window.history.back();
	        }).error(function(ret){
	            $ionicLoading.hide();
	            isLoading = false;
	            $scope.alert(ret);
	            console.log("超时或后台报错");
	        });
	    };

	    $scope.submit = function(){
	        picSrc=$("#oomg").attr("src");
	        picSrc1=$("#oomg1").attr("src");
	        idCard = $("#nz").val(); //获取身份证号
	        trueName = $("#ns").val();//姓名
	        bankNum = $("#creditCardNew").val();//银行卡号
	        depositBank1=$("#openNew").val();//开户行
	        depositBank2=$("#openNews").val();//详细支行
	        if(trueName == "") {
	            $scope.alert("姓名不能为空");
	        } else if(trueName.search(/^[\u4e00-\u9fa5]{1,10}$/) == -1 && trueName != '') {
	            $scope.alert("姓名格式不正确");
	        } else if(idCard == "") {
	            $scope.alert("请输入身份证号!");
	        } else if(idCard.search(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/) == -1) {
	            $scope.alert("请输入有效身份证号!");
	        } else if(bankNum == "") {
	            $scope.alert("银行卡号必须填写");
	        } else if(bankNum.search(/^(\d{16,19})$/) == -1) {
	            $scope.alert("银行卡号格式错误！");
	        } else if(depositBank1 == ""||depositBank2=="") {
	            $scope.alert("开户行和详细支行不能为空");   
	        }else if(picSrc==""){
	            $scope.alert("请上传您的身份证正面照片")
	        }else if(picSrc1==""){
	            $scope.alert("请上传本人自拍照")
	        }else if(trueName!=useName1){
	            $ionicPopup.show({
	                template: '您输入的姓名<strong id="xingming1">'+trueName+'</strong>?和注册姓名<strong id="xingming2">'+useName1+'</strong>不一致,您确定改名吗?',
	                scope: $scope,
	                buttons: [
	                    { text: '取消' },
	                    {
	                        text: '确定',
	                        type: 'button-positive',
	                        onTap: function(e) {
	                            $scope.submit_action();
	                        }
	                    },
	                ]
	            });
	        }
	        else {
	            $ionicPopup.show({
	                template: '您确定提交吗?',
	                scope: $scope,
	                buttons: [
	                    { text: '取消' },
	                    {
	                        text: '确定',
	                        type: 'button-positive',
	                        onTap: function(e) {
	                            $scope.submit_action();
	                        }
	                    },
	                ]
	            });
	        }
	    };
	});

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("freezeController",function($scope, $rootScope, $http, $location, $state) {
	    $(function(){
	        $(".tuiG:last").css("border","0").css("margin-bottom","-0.05rem");			
	    });
	    
	    $.ajax({
			type: "post",
			timeout: 3000,
			url: ROOTCONFIG.host + "/f/matchList", //3.2
			datatype: "json",
			success: function(ret) {
				if(ret.success) {
					console.log(ret)
					var todo = ret.data.todoList;
					var todoLen = todo.length;
					var writeTimes=function(left,i){
	                var days=parseInt(left/60/60/24);
	                var hours=parseInt((left-days*24*60*60)/60/60);
	                var mins=parseInt((left-hours*60*60-days*24*60*60)/60);
	                var secs=left-days*24*60*60-hours*60*60-mins*60;
	                var timeArr=[days,hours,mins,secs];
	                if(days!=0){
	                    return  $("#seconds"+i).html(days+"天"+hours+"时"+mins+"分"+secs+"秒");
	                }else if(days==0){
	                    return $("#seconds"+i).html(hours+"小时"+mins+"分"+secs+"秒");
	                }else if(hours==0){
	                    return $("#seconds"+i).html(mins+"分"+secs+"秒");
	                }else if(mins==0){
	                    return $("#seconds"+i).html(secs+"秒");
	                }else{
	                    return $("#seconds"+i).html(0+"秒");
	                }
	            }
	            var timesCount=function(left,i){
	                    setInterval(function(){
	                        if(left>0){
	                            left--;
	                            writeTimes(left,i);
	                        }else{
	                            return;
	                        }
	                    },1000);
	                }
	            for(var i = 0; i < todoLen; i++) {
	                if(todo[i].type == 1) {
	                    var left=todo[i].left;
	                    console.log(todo[0].desc)
	                    var $offLi = $("<div class='pre tuiG'><div class='shalou'></div><div class='message'><p><strong>等待您打款,信息如下:</strong></p><p class='mes_right'>"+ todo[i].desc + "</p><b id='seconds"+i+"'></b></div></div>");													
	                    $(".daiban").append($offLi);
	                    timesCount(left,i);						
	                    $('.pre').on("click", function() {
	                        var index = $(this).index();
	                        $state.go('waitMoney',{'id':todo[index].id});		
	                    });
	                } else if(todo[i].type == 2) {
	                    var left=todo[i].left;
	                    var $getLi = $("<div class='next tuiG'><div class='shalou'></div><div class='message'><p><strong>等待您打款,信息如下:</strong></p><p class='mes_right'>"+ todo[i].desc + "</p><b id='seconds"+i+"'></b></div></div>");						
	                    $(".daiban").append($getLi);
	                    timesCount(left,i);   
	                    $('.next').on("click", function() {
	                        var index = $(this).index();					
	                        $state.go('getMoney',{'id':todo[index].id});		
	                    });
	                };
	            }
	            } else {
	                // 执行成功，结果错误
	                console.log(ret.msg)
	            }
	        },
	        error: function() {
	            // 超时或后台报错
	            console.log("超时或后台报错");
	            $scope.alert(ret.msg+"请先退出后重新登录");
	        }
		});
	});

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("guideSwiperController",function($scope, $rootScope, $http, $location, $state) {
	    function isMobile() {
	        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent) ||
	                window.innerWidth < 500;
	    }
	    function setScale() {
	        if (window.top !== window) {
	            return;
	        }
	        var pageScale = 1;

	        var width = document.documentElement.clientWidth || 320;
	        var height = document.documentElement.clientHeight || 486;
	        if (width / height >= 320 / 486) {
	            pageScale = height / 486;
	            var margin = ($(".swiper-slide").width()/pageScale-$("ul").width())/2;
	            $("ul").css("margin-top",0);
	            $("ul").css("margin-left",margin);
	        } else {
	            pageScale = width / 320;
	            var margin = ($(".swiper-slide").height()/pageScale-$("ul").height())/2;
	            $("ul").css("margin-top",margin);
	        }
	        var content = 'width=320, initial-scale=' + pageScale + ', maximum-scale=' + pageScale + ', user-scalable=no';
	        document.getElementById('viewport').setAttribute('content', content);
	    }
	    if (isMobile()){setScale();}

	    $scope.$on('$destroy',function(){
	        document.getElementById('viewport').setAttribute('content', 'width=320, initial-scale=1, maximum-scale=1, user-scalable=no');
	    })

	    var animations;
	    var mySwiper = new Swiper ('.swiper-container', {
	        direction: 'vertical',
	        loop: true,
	        onSlideChangeStart: function(swiper){
	            var pages = $(".swiper-slide");
	            var currentPage = $(pages[swiper.activeIndex]);
	            var elements = currentPage.children("ul").children("li").children("div");
	            animations = [];
	            for(var i = 0 ; i < elements.length ; i++){
	                var element = $(elements[i]);
	                var animation = element.css("animation-name")+ " " +
	                                element.css("animation-duration")+ " " +
	                                element.css("animation-delay")+ " " +
	                                element.css("animation-iteration-count")+ " " +
	                                element.css("animation-direction")+ " " +
	                                element.css("animation-fill-mode")+ " " +
	                                element.css("animation-play-state");
	                animations.push(animation);
	                if(element.css("animation-name").indexOf("fadeIn")>=0 ||
	                    element.css("animation-name").indexOf("bounceIn")>=0){
	                    element.css("opacity",0);
	                }
	                element.css("animation","none");
	            }
	        },
	        onSlideChangeEnd:function(swiper){
	            var pages = $(".swiper-slide");
	            var currentPage = $(pages[swiper.activeIndex]);
	            var elements = currentPage.children("ul").children("li").children("div");
	            for(var i = 0 ; i < elements.length ; i++){
	                var element = $(elements[i]);
	                var animation = animations[i];
	                element.css("animation",animation);
	            }
	        },
	    });
	});

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.factory('pointData', function($rootScope, $websocket, $http, $interval) {
	    var dataStream;
	    var collection = {
	        'market': {},
	        'wallet': {},
	        'groupData': []
	    };
	    var _isConnected = false;
	    var _k = false;
	    var _lastTime = new Date();
	    var _heartBeat = new Date();
	    var msgHandler = function(message) {
	        var data = JSON.parse(message.data);
	        if (data.msg === "market") {
	            collection.market.buyQueue = data.data.buyQueue;
	            collection.market.sellQueue = data.data.sellQueue;
	            collection.market.curPrice = data.data.curPrice;
	            collection.market.maxPrice = data.data.maxPrice;
	            collection.market.minPrice = data.data.minPrice;
	            collection.market.limitUpPrice = data.data.limitUpPrice;
	            collection.market.limitDownPrice = data.data.limitDownPrice;
	            collection.market.closePrice = data.data.closePrice;
	            collection.market.buyFeeMin = data.data.buyFeeMin;
	            collection.market.todayTotal = data.data.todayTotal; //当天交易总金额
	            collection.market.todayTradeAmount = data.data.todayTradeAmount; //当天交易数量总额
	            collection.market.memberPositionAmount = data.data.memberPositionAmount; //会员持仓总数
	            collection.market.buyFeeRatio = Number(data.data.buyFeeRatio);
	            if (_k) {
	                collection.groupData.push([new Date(), data.data.curPrice]);
	                _lastTime = new Date();
	            }
	        }else if(data.msg === "wallet") {
	            collection.wallet.wallet = data.data.wallet;
	            collection.wallet.point = data.data.point;
	            collection.wallet.wallet2 = data.data.wallet2;
	            collection.wallet.point2 = data.data.point2;
	            collection.wallet.pointAvg = data.data.pointAvg;
	            collection.wallet.profit = data.data.profit;
	        }else if(data.msg === "hb"){
	            _heartBeat = new Date();
	        }
	        collection.totalMarketValue = collection.market.curPrice * (collection.wallet.point + collection.wallet.point2);
	        collection.totalMoney = collection.wallet.wallet + collection.wallet.wallet2 + collection.totalMarketValue;
	        collection.priceChanges = (collection.market.curPrice - collection.market.closePrice).toFixed(2);
	        collection.priceChangesPercentage = ((collection.priceChanges / collection.market.closePrice) * 100).toFixed(2) + '%';
	        collection.todayChanges = ((collection.market.curPrice - collection.market.closePrice) * (collection.wallet.point+collection.wallet.point2)).toFixed(2) + collection.wallet.profit;
	        collection.tradeRate = (((collection.market.todayTradeAmount / collection.market.memberPositionAmount) / 100) * 100).toFixed(2) + '%'; //换手率
	    };

	    var methods = {
	        collection: collection,
	        ws: function(num){
	            // dataStream = $websocket('ws://106.14.206.109:8889/ws/' + num);
	            dataStream = $websocket('ws://192.168.1.6:8080/ws/' + num);
	            dataStream.onMessage(msgHandler);
	            dataStream.onOpenCallbacks.push(function(){
	                _heartBeat = new Date();
	                _isConnected = true;
	            });
	        },
	        connect: function(num) {
	            var that = this;
	            $http({
	                url: ROOTCONFIG.host + "/p1/reg",
	                method: "post",
	                data: $.param({ 'uid': num }),
	            }).success(function(ret) {
	                that.ws(num);
	                $interval(function(){
	                    if(!_isConnected){return;}

	                	var nowTime = new Date();
	                	var timeDiff = nowTime - _lastTime;
	                	if(timeDiff > 5000){
	                		_lastTime = nowTime;
	                		if(_k && collection.market.curPrice){ collection.groupData.push([nowTime, collection.market.curPrice]); }
	                	}

	                    var heartDiff = nowTime - _heartBeat;
	                    console.log(heartDiff);
	                    if(heartDiff > 10000){
	                        $rootScope.alert('您已断开链接');
	                        _isConnected = false;
	                        that.ws(num);
	                    }
	                },1000);
	            }).error(function(ret) {
	                $rootScope.alert('您已断开链接');
	                console.log("超时或后台报错");
	            });
	        },
	        isConnected: function() {
	            return _isConnected;
	        },
	        is_K_pushed: function() {
	            return _k;
	        },
	        k_pushed: function() {
	            _k = true;
	        }
	    };

	    return methods;
	});

	app.directive('barCharts', function() {
	    return {
	        restrict: 'AE',
	        template: '<div></div>',
	        link: function(scope, element, attr) {
	            var chart = element.find('div')[0];
	            var parent = element.parentNode;
	            $(chart).width($(document).width());
	            $(chart).height($(element).height());
	            
	            var option = {
	                title: {},
	                tooltip: {},
	                grid: {
	                    top: 30,
	                    left: '10%',
	                    right: '5%',
	                },
	                dataZoom: [{
	                    type: 'inside',
	                    zoomLock: true
	                }],
	                xAxis: {
	                    type: 'time',
	                    scale: true,
	                    boundaryGap: false,
	                    axisLine: { onZero: false },
	                    splitLine: { show: false },
	                    axisLine: {
	                        lineStyle: {
	                            color: '#fff'
	                        }
	                    },
	                },
	                yAxis: {
	                    scale: true,
	                    splitArea: {
	                        show: true
	                    },
	                    axisLine: {
	                        lineStyle: {
	                            color: '#fff'
	                        }
	                    },
	                },
	                textStyle: {
	                    color: '#fff'
	                },
	                series: [{
	                    name: '时K',
	                    type: 'line',
	                    data: [],
	                }],
	                animation: false,
	                progressiveThreshold: 10,
	                progressiveThreshold: 1000
	            };

	            var myChart = echarts.init(chart);
	            scope.$parent.myChart = myChart;
	            myChart.setOption(option);
	            if (attr.source) {
	                scope.$watch(attr['source'], function() {
	                    var data = scope.$eval(attr.source);
	                    var date = new Date();
	                    myChart.setOption({
	                        xAxis:{
	                            max: date,
	                            min: date.getTime() - 3600 * 1000
	                        },
							series: [{
								data: data
							}]
						});
	                }, true);
	            }

	        }
	    }
	});

	app.controller("integralTradingController", function($scope, $rootScope, $http, $state, $stateParams, pointData, $ionicPopup, $timeout) {
	    $scope.data = pointData.collection;

	    if (!pointData.isConnected()) {
	        $ionicPopup.show({
	            template: '<input id="testNumber"/><br>',
	            title: '请输入测试编号',
	            scope: $scope,
	            buttons: [{
	                text: '确定',
	                type: 'button-positive',
	                onTap: function(e) {
	                    pointData.connect($("#testNumber").val());
	                }
	            }]
	        });
	    }


	    $scope.vm = {
	        'groupData': pointData.collection.groupData
	    };

	    if (!pointData.is_K_pushed()) {
	        $http({
	            url: ROOTCONFIG.host + "/p1/statisticsCurPrice",
	            method: "post",
	        }).success(function(ret) {
	            for (var i in ret.data) {
	                pointData.collection.groupData.push([ret.data[i].createTime, ret.data[i].curPrice]);
	            }
	            pointData.k_pushed();
	        }).error(function(ret) {
	        });
	    };

	    $scope.chart = function(type){
	        if(!$scope.myChart){return;}
	        if(type==='now'){
	            $scope.myChart.setOption({
	                dataZoom: [{
	                    start: 99.9,
	                    end: 100,
	                }],
	            });
	        }else if(type==='all'){
	            $scope.myChart.setOption({
	                dataZoom: [{
	                    start: 0,
	                    end: 100,
	                }],
	            });
	        }
	    };

	});


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("purchaseController", function($scope, $rootScope, $http, $state, $stateParams, pointData, $timeout, $ionicLoading) {
		if(!pointData.isConnected()){
	        $state.go('main.integralTrading');
	    }

	    $scope.data = pointData.collection;
		$scope.vm = {
			'price': pointData.collection.market.curPrice || 0,
			'amount': 10,
	        'percentage': 10
		};
		var price = pointData.collection.market.curPrice || 0;
		var amount = 10;
	    var percentage = 10;

		$scope.calc = function(){
			var value = $scope.vm.price + '';
			value = value.replace(/[^0-9|\.]/g,'');
	        if(/^[0]*$/.test(value)){
	            value = 0;// 全部都是0
	        }else if(/^[0]+\d*$/.test(value)){
	            value = value.replace(/^[0]+/,'')// 以0开头的数字
	        }
	        if(/^[0-9]+[.]{1}[0-9]{1,2}/.test(value)){
	            value = value.match(/^[0-9]+[.]{1}[0-9]{1,2}/)[0];
	        }
	        $scope.vm.price = value;

			if(/^[0-9]*0$/.test($scope.vm.amount)){
	            amount = $scope.vm.amount;
	        }else{
	            $scope.vm.amount = parseInt(amount);
	        }

			$scope.tradeVolume = ($scope.vm.price * $scope.vm.amount).toFixed(2);
	        var commission = Number(($scope.tradeVolume * pointData.collection.market.buyFeeRatio).toFixed(2));
	        $scope.commission = commission > pointData.collection.market.buyFeeMin ? commission : pointData.collection.market.buyFeeMin;
	        $scope.maxBuyNumber = ((($scope.data.wallet.wallet/($scope.vm.price * (1+pointData.collection.market.buyFeeRatio)))/10).toFixed(0))*10;
		};
	    $scope.calc();

	    $scope.changePercentage = function(val){
	        $scope.vm.percentage = parseInt($scope.vm.percentage) + val;
	        $scope.checkValid();
	    };

	    $scope.checkValid = function(){
	        if(/^[0-9]*$/.test($scope.vm.percentage)){
	            if($scope.vm.percentage>=100){
	                $scope.vm.percentage = 100;
	            }else if($scope.vm.percentage<=0){
	                $scope.vm.percentage = 0;
	            }
	            percentage = parseInt($scope.vm.percentage);
	        }else{
	            $scope.vm.percentage = percentage;
	        }
	        $scope.vm.amount  = (($scope.maxBuyNumber*($scope.vm.percentage/100)/10).toFixed(0))*10;
	        $scope.calc();
	    };

		$scope.buy = function(){
			$ionicLoading.show({ template: '数据加载中...' });
	        $http({
	            url: ROOTCONFIG.host + "/p/buy",
	            method:"post",
	            data: $.param({
	                'price':$scope.vm.price,
	                'amount':$scope.vm.amount,
	                'pwd': $scope.vm.password
	            }),
	        }).success(function(ret){
	            $ionicLoading.hide();
	            if(ret.success){
	                $scope.alert('买入成功');
	                $scope.vm.password = '';
	            }else{
	                $scope.alert(ret.msg);
	            }
	        }).error(function(ret){
	            $ionicLoading.hide();
	        });
		};

	})
		

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("sellOutController", function ($scope, $rootScope, $http, $state, $stateParams, pointData, $ionicLoading) {
		if(!pointData.isConnected()){
	        $state.go('main.integralTrading');
	    }

	    $scope.data = pointData.collection;
		$scope.vm = {
			'price': pointData.collection.market.curPrice || 0,
			'amount': 10,
	        'percentage': 10
		};
		var price = pointData.collection.market.curPrice || 0;
		var amount = 10;
	    var percentage = 10;

		$scope.calc = function(){
			var value = $scope.vm.price + '';
			value = value.replace(/[^0-9|\.]/g,'');
	        if(/^[0]*$/.test(value)){
	            value = 0;// 全部都是0
	        }else if(/^[0]+\d*$/.test(value)){
	            value = value.replace(/^[0]+/,'')// 以0开头的数字
	        }
	        if(/^[0-9]+[.]{1}[0-9]{1,2}/.test(value)){
	            value = value.match(/^[0-9]+[.]{1}[0-9]{1,2}/)[0];
	        }
	        $scope.vm.price = value;

			if(/^[0-9]*0$/.test($scope.vm.amount)){
	            amount = $scope.vm.amount;
	        }else{
	            $scope.vm.amount = parseInt(amount);
	        }

			$scope.tradeVolume = ($scope.vm.price * $scope.vm.amount).toFixed(2);
	        var commission = Number(($scope.tradeVolume * pointData.collection.market.buyFeeRatio).toFixed(2));
	        $scope.commission = commission > pointData.collection.market.buyFeeMin ? commission : pointData.collection.market.buyFeeMin;
	        $scope.maxSellNumber = pointData.collection.wallet.point;
		};
	    $scope.calc();

	    $scope.changePercentage = function(val){
	        $scope.vm.percentage = parseInt($scope.vm.percentage) + val;
	        $scope.checkValid();
	    };

	    $scope.checkValid = function(){
	        if(/^[0-9]*$/.test($scope.vm.percentage)){
	            if($scope.vm.percentage>=100){
	                $scope.vm.percentage = 100;
	            }else if($scope.vm.percentage<=0){
	                $scope.vm.percentage = 0;
	            }
	            percentage = parseInt($scope.vm.percentage);
	        }else{
	            $scope.vm.percentage = percentage;
	        }
	        $scope.vm.amount = (($scope.maxSellNumber*($scope.vm.percentage/100)/10).toFixed(0))*10;
	        $scope.calc();
	    };

		$scope.sell = function(){
			$ionicLoading.show({ template: '数据加载中...' });
	        $http({
	            url: ROOTCONFIG.host + "/p/sell",
	            method:"post",
	            data: $.param({
	                'price': $scope.vm.price,
	                'amount': $scope.vm.amount,
	                'pwd': $scope.vm.password
	            }),
	        }).success(function(ret){
	            $ionicLoading.hide();
	            if(ret.success){
	                $scope.alert('卖出成功');
	                $scope.vm.password = '';
	            }else{
	                $scope.alert(ret.msg);
	            }
	        }).error(function(ret){
	            console.log("超时或后台报错");
	        });
		};
	});


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("managementController", function($scope, $state, $rootScope, $http, $location, $stateParams) {
	   
	});

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("fundTransferController", function($scope, $state, $rootScope, $http, $location, $stateParams) {
	   
	});

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("fundRollOutController", function($scope, $state, $rootScope, $http, $location, $stateParams) {
	   
	});

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("accountsFlowController", function($scope, $state, $rootScope, $http, $location, $stateParams) {
	    var walletId = $stateParams.walletId;
	    switch(walletId){
	        case "1":
	            $scope.head_title = "公益钱包明细";
	            break;
	        case "2":
	            $scope.head_title = "推广钱包明细";
	            break;
	        case "3":
	            $scope.head_title = "消费钱包明细";
	            break;
	        default:
	//          $state.go("home");
	            break;
	    }
	   
	    $.ajax({
	        type: "post",
	        timeout: 3000,
	        url: ROOTCONFIG.host + "/f/walletDetail2",
	        data: { id: walletId },
	        datatype: "json",
	        success: function(ret) {
	        	console.log(ret)
	            if(ret.success) {
	                // 执行成功，返回正确结果
	                $scope.list = ret.data;
	            } else {
	                // 执行成功，结果错误
	            }
	        },
	        error: function() {
	            // 超时或后台报错
	        }
	    });
	});

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("accountsFlowSelectController", function($scope, $state, $rootScope, $http, $location, $stateParams) {
	    var walletId = $stateParams.walletId;
	    switch(walletId){
	        case "1":
	            $scope.head_title = "公益钱包明细";
	            break;
	        case "2":
	            $scope.head_title = "推广钱包明细";
	            break;
	        case "3":
	            $scope.head_title = "消费钱包明细";
	            break;
	        default:
	//          $state.go("home");
	            break;
	    }
	   
	    $.ajax({
	        type: "post",
	        timeout: 3000,
	        url: ROOTCONFIG.host + "/f/walletDetail",
	        data: { id: walletId },
	        datatype: "json",
	        success: function(ret) {
	            if(ret.success) {
	                // 执行成功，返回正确结果
	                $scope.list = ret.data;
	            } else {
	                // 执行成功，结果错误
	            }
	        },
	        error: function() {
	            // 超时或后台报错
	        }
	    });
	});

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("tradeFlowController", function($scope, $state, $rootScope, $http, $location, $stateParams) {
	    var walletId = $stateParams.walletId;
	    switch(walletId){
	        case "1":
	            $scope.head_title = "公益钱包明细";
	            break;
	        case "2":
	            $scope.head_title = "推广钱包明细";
	            break;
	        case "3":
	            $scope.head_title = "消费钱包明细";
	            break;
	        default:
	//          $state.go("home");
	            break;
	    }
	   
	    $.ajax({
	        type: "post",
	        timeout: 3000,
	        url: ROOTCONFIG.host + "/f/walletDetail2",
	        data: { id: walletId },
	        datatype: "json",
	        success: function(ret) {
	        	console.log(ret)
	            if(ret.success) {
	                // 执行成功，返回正确结果
	                $scope.list = ret.data;
	            } else {
	                // 执行成功，结果错误
	            }
	        },
	        error: function() {
	            // 超时或后台报错
	        }
	    });
	});

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("killOrderController", function ($scope, $rootScope, $http, $state, $stateParams, pointData, $ionicLoading) {
		if(!pointData.isConnected()){
	        $state.go('main.integralTrading');
	    }

	    $ionicLoading.show({ template: '数据加载中...' });
	    $http({
	        url: ROOTCONFIG.host + "/p/getToTrades",
	        method:"post",
	    }).success(function(ret){
	        $ionicLoading.hide();
	        $scope.list = ret.data;
	        for(var i in $scope.list){
	        	$scope.list[i].time = new Date(($scope.list[i].createTime).replace(/-/g,'/'));
	        }
	    }).error(function(ret){
	        console.log("超时或后台报错");
	    });

	    $scope.cancelSell = function(order,index){
	        if(order.isBuy==='1'){
	            $ionicLoading.show({ template: '数据加载中...' });
	            $http({
	                url: ROOTCONFIG.host + "/p/cancelBuy",
	                method:"post",
	                data: $.param({ 'id': order.id }),
	            }).success(function(ret){
	                $ionicLoading.hide();
	                if(ret.success){
	                    $scope.alert('撤出买单成功');
	                    $scope.list.splice(index,1);
	                }
	            }).error(function(ret){
	                $ionicLoading.hide();
	                console.log("超时或后台报错");
	            });
	        }else{
	            $ionicLoading.show({ template: '数据加载中...' });
	            $http({
	                url: ROOTCONFIG.host + "/p/cancelSell",
	                method:"post",
	                data: $.param({ 'id': order.id }),
	            }).success(function(ret){
	                $ionicLoading.hide();
	                if(ret.success){
	                    $scope.alert('撤出卖单成功');
	                    $scope.list.splice(index,1);
	                }
	            }).error(function(ret){
	                $ionicLoading.hide();
	                console.log("超时或后台报错");
	            });
	        }
	    };

	});


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	var app = __webpack_require__(1);

	app.controller("dealController", function ($scope, $rootScope, $http, $state, $stateParams) {
		$scope.tab_index = 0;

		$scope.tab = function(index){
			$scope.tab_index = index;
		};

		$http({
	        url: ROOTCONFIG.host + "/p/getOrders",
	        method:"post",
	    }).success(function(ret){
	        $scope.waitList = ret.data;
	        for(var i in $scope.waitList){
	        	$scope.waitList[i].time = new Date(($scope.waitList[i].createTime).replace(/-/g,'/'));
	        }
	    }).error(function(ret){
	        console.log("超时或后台报错");
	    });

	    $http({
	        url: ROOTCONFIG.host + "/p/getTrades",
	        method:"post",
	    }).success(function(ret){
	        $scope.completeList = ret.data;
	        for(var i in $scope.completeList){
	        	$scope.completeList[i].time = new Date(($scope.completeList[i].createTime).replace(/-/g,'/'));
	        }
	    }).error(function(ret){
	        console.log("超时或后台报错");
	    });

	});


/***/ })
/******/ ]);