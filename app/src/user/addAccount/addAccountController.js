var app = require('../../app.js');

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