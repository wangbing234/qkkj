var app = require('../../app.js');

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
