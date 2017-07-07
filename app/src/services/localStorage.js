var app = require('../app.js');

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