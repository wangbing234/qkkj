var app = require('./app.js');

app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('login');

	$stateProvider
		.state("main", {
			url: "/main",
			abstract:true,
			templateUrl: "./main.html",
			cache:false
		})

		// 互捐
		.state("main.donation", {
			url: "/donation",
			views:{
				'main-donation':{
					templateUrl:'./donation/donation/donation.html',
					controller:'donationController'
				}
			},
			cache:false
		})
		// 提供捐助
		.state("provideDonation", {
			url: "/provideDonation",
			templateUrl: "./donation/provideDonation/provideDonation.html",
			controller: "provideDonationController",
			cache:false
		})
		// 打款信息
		.state("provideInformation", {
			url: "/provideInformation/{id}",
			templateUrl: "./donation/provideInformation/provideInformation.html",
			controller: "provideInformationController",
			params:{ id: ''},
			cache:false
		})
		// 了解鼎烨
		.state("aboutUs", {
			url: "/aboutUs",
			templateUrl: "./donation/aboutUs/aboutUs.html",
			cache:false
		})
		// 得到捐助
		.state("getDonation", {
			url: "/getDonation",
			templateUrl: "./donation/getDonation/getDonation.html",
			controller: "getDonationController",
			cache:false
		})
		// 等待对方打款信息
		.state("getInformation", {
			url: "/getInformation/{id}",
			templateUrl: "./donation/getInformation/getInformation.html",
			controller: "getInformationController",
			params:{ id: ''},
			cache:false
		})
		// 得到捐助确认
		.state("getDonationConfirm", {
			url: "/getDonationConfirm",
			templateUrl: "./donation/getDonation/confirm.html",
			controller: "getDonationConfirmController",
			cache:false
		})
		// 钱包列表
		.state("walletList", {
			url: "/walletList",
			templateUrl: "./donation/walletList/walletList.html",
			controller: "walletListController",
			cache:false
		})
		// 钱包明细
		.state("walletDetail", {
			templateUrl: "./donation/walletDetail/walletDetail.html",
			url: "/walletDetail/{walletId}",
			controller: "walletDetailController",
			params:{ walletId: ''},
			cache:false
		})
		// 等待打款
		.state("waitMoney", {
			templateUrl: "./donation/waitMoney/waitMoney.html",
			url: "/waitMoney/{id}",
			controller: "waitMoneyController",
			params:{ id: ''},
			cache:false
		})
		// 确认收款
		.state("getMoney", {
			templateUrl: "./donation/getMoney/getMoney.html",
			url: "/getMoney/{id}",
			controller: "getMoneyController",
			params:{ id: ''},
			cache:false
		})


		// 推广
		.state("main.spread", {
			url: "/spread",
			views:{
				'main-spread':{
					templateUrl:'./spread/spread/spread.html',
					controller:'spreadController'
				}
			},
			cache:false
		})
		// 发放记录
		.state("spreadRecord", {
			url: "/spreadRecord",
			templateUrl: "./spread/spreadRecord/spreadRecord.html",
			controller: "spreadRecordController",
			cache:false
		})

		// 商城
		.state("main.shop", {
			url: "/shop",
			views:{
				'main-shop':{
					templateUrl:'./shop/shop/shop.html',
					controller:'shopController'
				}
			},
			cache:false
		})
		// 购物车
		.state("shopCenter",{
			url: "/shopCenter",
			templateUrl: "./shop/shopCenter/shopCenter.html",
			controller: "shopCenterController",
			cache:false
		})
		// 购物车
		.state("cart",{
			url: "/cart",
			templateUrl: "./shop/cart/cart.html",
			controller: "cartController",
			cache:false
		})
		// 商品详情
		.state("goodsDetail",{
			url: "/goodsDetail/{id}",
			templateUrl: "./shop/goodsDetail/goodsDetail.html",
			controller: "goodsDetailController",
			params: {'id': null},
			cache:false
		})
		// 商城商品订单
		.state("order",{
			url: "/order",
			templateUrl: "./shop/order/order.html",
			controller: "orderController",
			cache:false
		})
		// 订单详情
		.state("orderDetail",{
			url: "/orderDetail/{id}",
			templateUrl: "./shop/orderDetail/orderDetail.html",
			controller: "orderDetailController",
			params: {'id': null},
			cache:false
		})
		// 订单提交
		.state("orderSubmit",{
			url: "/orderSubmit",
			templateUrl: "./shop/orderSubmit/orderSubmit.html",
			controller: "orderSubmitController",
			cache:false
		})
		// 订单支付
		.state("orderPay",{
			url: "/orderPay/{id}",
			templateUrl: "./shop/orderPay/orderPay.html",
			controller: "orderPayController",
			params: {'id': null},
			cache:false
		})
		// 商品列表
		.state("goodsList",{
			url: "/goodsList/{type}",
			templateUrl: "./shop/goodsList/goodsList.html",
			controller: "goodsListController",
			cache:true
		})
		// 我的收藏
		.state("favorite",{
			url: "/favorite",
			templateUrl: "./shop/favorite/favorite.html",
			controller: "favoriteController",
			cache:false
		})
		
		// 用户
		.state("main.user", {
			url: "/user",
			views:{
				'main-user':{
					templateUrl:'./user/user/user.html',
					controller:'userController'
				}
			},
			cache:false
		})
		// 登录
		.state("login",{
			url: "/login",
			templateUrl: "./user/login/login.html",
			controller: "loginController",
			cache:false
		})
		// 注册
		.state("register",{
			url: "/register",
			templateUrl: "./user/register/register.html",
			controller: "registerController",
			cache:false
		})
		// 忘记密码
		.state("forget",{
			url: ROOTCONFIG.host + "/forget",
			templateUrl: "./user/forget/forget.html",
			controller: "forgetController",
			cache:false
		})
		// 用户协议
		.state("agreements",{
			url: "/agreements",
			templateUrl: "./user/agreements/agreements.html",
			cache:false
		})
		// 反馈（用户留言）
		.state("feedback",{
			url: ROOTCONFIG.host + "/feedback",
			templateUrl: "./user/feedback/feedback.html",
			controller: "feedbackController",
			cache:false
		})
		// 新闻
		.state("news",{
			url: "/news",
			templateUrl: "./user/news/news.html",
			cache:false
		})
		// 注意事项
		.state("notice",{
			url: "/notice/{noticeId}",
			templateUrl: "./user/notice/notice.html",
			params:{ noticeId: ''},
			cache:false
		})
		// 收货地址
		.state("address",{
			url: "/address",
			templateUrl: "./user/address/address.html",
			controller: "addressController",
			cache:false
		})
		// 账户设定
		.state("account",{
			url: "/account",
			templateUrl: "./user/account/account.html",
			controller: "accountController",
			cache:false
		})
		// 更新账户信息
		.state("addAccount",{
			url: "/addAccount",
			templateUrl: "./user/addAccount/addAccount.html",
			controller: "addAccountController",
			params:{ bankNum: '', depositBank: '', detailBank:  '', bankNum2: '', depositBank2: '', detailBank2: ''},
			cache:false
		})
		// 设置
		.state("setting",{
			url: "/setting",
			templateUrl: "./user/setting/setting.html",
			controller: "settingController",
			cache:false
		})
		// 签到
		.state("signin",{
			url: "/signin",
			templateUrl: "./user/signin/signin.html",
			controller: "signinController",
			cache:false
		})
		// 实名认证
		.state("authentication",{
			url: "/authentication",
			templateUrl: "./user/authentication/authentication.html",
			controller: "authenticationController",
			cache:false
		})
		// 解冻
		.state("freeze",{
			url: ROOTCONFIG.host + "/freeze",
			templateUrl: "./user/freeze/freeze.html",
			controller: "freezeController",
			cache:false
		})
		// 新手指南引导页
		.state("guide",{
			url: "/guide",
			templateUrl: "./user/guide/guide.html",
			cache:false
		})
		// 新手指南(鼎烨APP注册与认证操作说明)
		.state("guide_1",{
			url: "/guide_1",
			templateUrl: "./user/guide/guide_1.html",
			controller: "guideSwiperController",
			cache:false
		})
		// 新手指南(鼎烨APP注册与认证操作说明)
		.state("guide_2",{
			url: "/guide_2",
			templateUrl: "./user/guide/guide_2.html",
			controller: "guideSwiperController",
			cache:false
		})
}]);