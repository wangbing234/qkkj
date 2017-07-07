var app = require('../../app.js');

app.controller("getMoneyController",function($scope, $rootScope, $http, $location, $stateParams, $ionicPopup, $state) {
    ImagesZoom.init({"elem": ".primary"});
	
    //加载打款人信息
    var oids = $stateParams.id;

    $http({
		url: ROOTCONFIG.host + "/f/confirmView",
		method:"post",
        data: $.param({ 'id':oids }),
        headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
	}).success(function(ret){
		if (ret.success) {
			console.log(ret)
            $scope.entryName = ret.data.entryName;
            $scope.entryPhone = ret.data.entryPhone;
            $scope.refName = ret.data.refName;
            $scope.refPhone = ret.data.refPhone;
            $scope.amount = ret.data.amount;
            $scope.transTime = ret.data.transTime;
            $scope.transRemark = ret.data.transRemark;
            $scope.transImg = ret.data.transImg;
        } else {
            // 执行成功，结果错误
            console.log("加载打款人信息失败")
            $scope.alert(ret.msg);
        }
	}).error(function(ret){
		console.log("超时或后台报错");
        $scope.alert(ret.msg);
	});

    $(".sure button").click(function(){
        $("#motait").show();
    });
    $("#xx").on("touchstart",function(){
        $("#motait").hide();
    });
    $("#aas1").on("click",function(){
        $("#motait").hide();
    });

    $scope.confirm = function(){
        $ionicPopup.show({
            template: '<div id="tishi">您确定收款吗?</div>',
            scope: $scope,
            buttons: [
                { text: '取消' },
                {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        $scope.submit();
                    }
                },
            ]
        });
    };

    $scope.submit = function(){
        $http({
            url: ROOTCONFIG.host + "/f/confirm",
            method:"post",
            data: $.param({ 'id':oids }),
            headers: {"Content-type": 'application/x-www-form-urlencoded; charset=UTF-8'},
        }).success(function(ret){
            if (ret.success) {
                $scope.alert(ret.msg);
                $state.go('main.donation');
            } else {
                $scope.alert(ret.msg);
            }
        }).error(function(ret){
            console.log("超时或后台报错");
            $scope.alert(ret.msg);
        });	
    };
});