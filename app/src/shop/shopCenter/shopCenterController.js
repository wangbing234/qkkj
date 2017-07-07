var app = require('../../app.js');

app.controller("shopCenterController", function($scope, $rootScope, $http, ls) {
    $scope.account = ls.data.account;
    $scope.user = ls.data.user;
});