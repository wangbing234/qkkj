require('./app.js');
require('./routers.js');
require('./filter.js');

//directives
require('./directives/ng-back');
require('./directives/count-down');
require('./directives/number-input');

//services
require('./services/localStorage');
require('./services/Util');

//controllers
require('./donation/donation/donationController.js');
require('./donation/provideDonation/provideDonationController.js');
require('./donation/provideInformation/provideInformationController.js');
require('./donation/getDonation/getDonationController.js');
require('./donation/getInformation/getInformationController.js');
require('./donation/walletList/walletListController.js');
require('./donation/walletDetail/walletDetailController.js');
require('./donation/waitMoney/waitMoneyController.js');
require('./donation/getMoney/getMoneyController.js');

require('./spread/spread/spreadController.js');
require('./spread/spreadRecord/spreadRecordController.js');

require('./shop/shop/shopController.js');
require('./shop/shop/shopSearchController.js');
require('./shop/shopCenter/shopCenterController.js');
require('./shop/cart/cartController.js');
require('./shop/goodsDetail/goodsDetailController.js');
require('./shop/order/orderController.js');
require('./shop/orderSubmit/orderSubmitController.js');
require('./shop/orderPay/payController.js');
require('./shop/orderPay/orderPayController.js');
require('./shop/orderDetail/orderDetailController.js');
require('./shop/goodsList/goodsListController.js');
require('./shop/favorite/favoriteController.js');

require('./user/user/userController.js');
require('./user/login/loginController.js');
require('./user/register/registerController.js');
require('./user/forget/forgetController.js');
require('./user/feedback/feedbackController.js');
require('./user/address/addAddressController.js');
require('./user/address/addressController.js');
require('./user/account/accountController.js');
require('./user/addAccount/addAccountController.js');
require('./user/setting/settingController.js');
require('./user/signin/signinController.js');
require('./user/authentication/authenticationController.js');
require('./user/freeze/freezeController.js');
require('./user/guide/guideSwiperController.js');