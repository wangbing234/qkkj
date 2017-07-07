var app = require('../../app.js');

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