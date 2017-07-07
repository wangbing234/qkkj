var app = require('../../app.js');

app.controller("waitMoneyController",function($scope, $rootScope, $http, $location, $stateParams, $ionicPopup, $state, $ionicLoading) {
    ImagesZoom.init({ "elem": ".primary" });

    var oidd = $stateParams.id;
    $.ajax({
        url: ROOTCONFIG.host + "/f/payView",
        data: { id: oidd },
        type: 'post',
        dataType: 'json', //主要是这里和原来的json改变了！	
        success: function(ret) {
            if(ret.success) {
                console.log("加载待打款人信息成功")
                console.log(ret);
                //console.log(ret.msg);
                //调用展示清单方法
                ret = ret.data
                $("#a1").html(ret.exitName);
                $("#a2").html(ret.exitPhone);
                $("#a3").html(ret.refName);
                $("#a4").html(ret.refPhone);
                $("#a5").html(ret.amount);
                $("#a6").html(ret.bankNum);
                $("#a7").html(ret.depositBank);
                $("#a8").html(ret.bankNum2);
                $("#a9").html(ret.depositBank2);
                $("#a11").html(ret.alipayId);
                $("#a12").html(ret.detailBank);
                if(ret.bankNum2 == "") {
                    $(".bei1").hide();
                }
                if(ret.alipayId == "") {
                    $(".bei2").hide();
                }
            } else {
                // 执行成功，结果错误
                console.log("加载打款人信息失败")
                $scope.alert(ret.msg);
            }
        },
        error: function() {
            // 超时或后台报错
            console.log("超时或后台报错")
            $scope.alert(ret.msg);
        }
    })

    $("input:file").localResizeIMG({
        quality: 0.5,
        success: function(result) {
            var img = new Image();
            img.src = result.base64;
            $("#oomg").prop("src", result.base64);
        }
    });
				
    $(".sure button").click(function() {
        if($("#oomg").attr("src")==""){
            $scope.alert("请上传您的打款截图!");
        }else{
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
    });

    $scope.submit_action = function(){
        var beizhu = $("#a10").val();
        var pic=$("#oomg").attr("src");
        if(beizhu == "") {
            beizhu = "无备注"
        } else {
            beizhu = beizhu;
        }
        $ionicLoading.show({ template: '数据加载中...' });
        $http({
            url: ROOTCONFIG.host + "/f/pay",
            method:"post",
            data: $.param({
                id: oidd,
                remark: beizhu,
                pic: pic
            }),
        }).success(function(ret){
            $ionicLoading.hide();
            if(ret.success) {
                $scope.alert(ret.msg);
                $state.go("main.donation");
            } else {
                // 执行成功，结果错误
                $scope.alert(ret.msg);
            }
        }).error(function(ret){
            $ionicLoading.hide();
            console.log("超时或后台报错");
            $scope.alert(ret.msg);
        });
    };

});