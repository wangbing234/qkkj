window.ROOTCONFIG = {
    // host: "http://106.14.206.109:9999"
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

var app = angular.module("zx", ['ionic']);

app.run(function ($rootScope, $state, $stateParams, $ionicPopup, ls, $ionicHistory) {
    $('#loading_spinner').hide();

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    
    $rootScope.adsShowed = true; //是否已经弹出过广告
    $rootScope.host = window.ROOTCONFIG.host;

    ls.loadStorage();
    if(!ls.data.user.userState){
        window.location = window.location.origin + window.location.pathname + '#/login';
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
                        rootScope.alert("登录已过期");
                        localStorage.clear();
                        rootScope.$state.go("login");
                    }
                }
            }
            return response;
        }
    };
}]);

module.exports = app;