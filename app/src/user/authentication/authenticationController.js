var app = require('../../app.js');

app.controller("authenticationController",function($scope, $rootScope, $http, $ionicLoading, $location, $state, $ionicPopup, ls) {
	document.addEventListener("DOMContentLoaded", function(event) {
        ImagesZoom.init({
            "elem": ".primary"
        });
    }, false);

    var picSrc;
    var idCard;
    var trueName;
    var bankNum ;
    var depositBank1;
    var depositBank2;
    var picSrc1;

    $scope.user = ls.data.user;
    var useName1= $scope.user.name;
    $("#zh").localResizeIMG({
        quality: 0.1,
        success: function (result) {
            var img = new Image();
            img.src = result.base64;
            $("#oomg").prop("src",result.base64);
        }
    });
    $("#zh1").localResizeIMG({
        quality: 0.1,
        success: function (result) {
            var img1 = new Image();
            img1.src = result.base64;
            $("#oomg1").prop("src",result.base64);
        }
    });

    var isLoading = false;
    $scope.submit_action = function(){
        if( isLoading ){ return; }
        isLoading = true;
        $ionicLoading.show({ template: '数据加载中...' });
        $http({
            url: ROOTCONFIG.host + "/f/auth",
            method:"post",
            data: $.param({
                bankNum: bankNum,
                depositBank: depositBank1,
                detailBank:depositBank2,                            
                name: trueName,
                id: idCard,
                pic:picSrc,
                pic2:picSrc1
            }),
        }).success(function(ret){
            $ionicLoading.hide();
            isLoading = false;
            if(ret.success) {
                $scope.alert(ret.msg + "请等待审核");
            } else {
                $scope.alert(ret.msg);
            }
            window.history.back();
        }).error(function(ret){
            $ionicLoading.hide();
            isLoading = false;
            $scope.alert(ret);
            console.log("超时或后台报错");
        });
    };

    $scope.submit = function(){
        picSrc=$("#oomg").attr("src");
        picSrc1=$("#oomg1").attr("src");
        idCard = $("#nz").val(); //获取身份证号
        trueName = $("#ns").val();//姓名
        bankNum = $("#creditCardNew").val();//银行卡号
        depositBank1=$("#openNew").val();//开户行
        depositBank2=$("#openNews").val();//详细支行
        if(trueName == "") {
            $scope.alert("姓名不能为空");
        } else if(trueName.search(/^[\u4e00-\u9fa5]{1,10}$/) == -1 && trueName != '') {
            $scope.alert("姓名格式不正确");
        } else if(idCard == "") {
            $scope.alert("请输入身份证号!");
        } else if(idCard.search(/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/) == -1) {
            $scope.alert("请输入有效身份证号!");
        } else if(bankNum == "") {
            $scope.alert("银行卡号必须填写");
        } else if(bankNum.search(/^(\d{16,19})$/) == -1) {
            $scope.alert("银行卡号格式错误！");
        } else if(depositBank1 == ""||depositBank2=="") {
            $scope.alert("开户行和详细支行不能为空");   
        }else if(picSrc==""){
            $scope.alert("请上传您的身份证正面照片")
        }else if(picSrc1==""){
            $scope.alert("请上传本人自拍照")
        }else if(trueName!=useName1){
            $ionicPopup.show({
                template: '您输入的姓名<strong id="xingming1">'+trueName+'</strong>?和注册姓名<strong id="xingming2">'+useName1+'</strong>不一致,您确定改名吗?',
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
        else {
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
    };
});