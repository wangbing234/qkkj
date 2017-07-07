var app = require('../../app.js');

app.controller("addAddressController", function ($scope, $rootScope, $http, $state, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicLoading, $timeout) {
    $scope.onerror = function (msg) {
        $("#error3").html(msg).fadeIn(2000, function () { $(this).fadeOut(4000); });
    };

    $scope.vm = $scope.$parent.addAddressVM ;

    $scope.submit = function () {
        if (!$scope.vm.phoneNumber || !$scope.vm.name || !$scope.vm.zip || !$scope.vm.address) { $scope.onerror("请填写完整信息"); return; }
        if (!/^[1][34578][0-9]{9}$/.test($scope.vm.phoneNumber)) { $scope.onerror("注册手机号格式有误"); return; }
        if (!/^[\u4E00-\u9FA5]{2,10}$/.test($scope.vm.name)) { $scope.onerror("请输入有效中文姓名"); return; }
        if (!/^\d{6}$/.test($scope.vm.zip)) { $scope.onerror("邮编为6位数字"); return; }
        if(!$scope.vm.selectedAddress){ $scope.onerror("请选择城市"); return; }
        $http({
            url: ROOTCONFIG.host + "/shop/user/saveAddress.html",
            method: "post",
            data: $.param({
                'address.id': $scope.vm.id || "",
                'address.name': $scope.vm.name,
                'address.address': $scope.vm.address,
                'address.zip': $scope.vm.zip,
                'address.mobile': $scope.vm.phoneNumber,
                "address.isdefault": 'y',
                "address.province": $scope.vm.selectedAddress.province.code,
                "address.city": $scope.vm.selectedAddress.city.code,
                "address.area": $scope.vm.selectedAddress.area.code,
            }),
            headers: { "Content-type": 'application/x-www-form-urlencoded; charset=UTF-8' },
        }).success(function (ret) {
            if (ret.code !== 0 || !ret.data) { return; }
            if($scope.vm.index !== undefined){
                var parent_data = $scope.$parent.addressList[$scope.vm.index];
                parent_data.name = $scope.vm.name;
                parent_data.mobile = $scope.vm.phoneNumber;
                parent_data.address = $scope.vm.address;
            }else{
            	$scope.$parent.addressList.push({
            		'name': $scope.vm.name,
            		'mobile': $scope.vm.phoneNumber,
            		'address': $scope.vm.address,
                    'pcadetail': $scope.vm.selectedAddress.province.name + " " + $scope.vm.selectedAddress.city.name + " " + $scope.vm.selectedAddress.area.name
            	});
            }
            $timeout(function(){
                $scope.closeModal();
            },1000);
            $ionicLoading.show({ template: ret.data, duration: 1000, noBackdrop: true });
        }).error(function (ret) {
            console.log("超时或后台报错");
        });
    };

    var selectedAddress = {};
    $scope.chooseArea = function () {
        $ionicLoading.show({ template: '数据加载中...' });
        $http({
            url: ROOTCONFIG.host + "/shop/user/getAllProvinces.html",
            method: "get",
        }).success(function (ret) {
            $ionicLoading.hide();
            if (ret.code !== 0 || !ret.data) { return; }
            $scope.provincesData = [];
            angular.forEach(Object.keys(ret.data), function (item, index) {
                $scope.provincesData.push(ret.data[item]);
            });
            $ionicModal.fromTemplateUrl('./user/addAddress/cirySelect-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.PCTModal = modal;
                $scope.PCTModal.show();
            });
        }).error(function (ret) {
            $ionicLoading.hide();
            console.log("超时或后台报错");
        });
    };

    $scope.chooseProvince = function (index) {
        $scope.citiesData = [];
        selectedAddress.province = $scope.provincesData[index];
        $ionicLoading.show({ template: '数据加载中...' });
        $http({
            url: ROOTCONFIG.host + "/shop/user/selectCitysByProvinceCode.html?provinceCode=" + $scope.provincesData[index].code,
            method: "get",
        }).success(function (ret) {
            $ionicLoading.hide();
            if (ret.code !== 0 || !ret.data) { return; }
            $scope.citiesData = JSON.parse(ret.data);
            $scope.showBackBtn = true;
            $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').next();
            $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').update();
            $ionicScrollDelegate.$getByHandle('PCTSelectCity').scrollTop();
        }).error(function (ret) {
            $ionicLoading.hide();
            console.log("超时或后台报错");
        });
    };

    $scope.chooseCity = function (index) {
        $scope.townData = $scope.citiesData[index].children;
        selectedAddress.city = $scope.citiesData[index];
        $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').next();
        $ionicSlideBoxDelegate.$getByHandle('PCTSelectDelegate').update();
        $ionicScrollDelegate.$getByHandle('PCTSelectCity').scrollTop();
    };

    $scope.chooseTown = function (index) {
        selectedAddress.area = $scope.townData[index];
        $scope.vm.selectedAddress = selectedAddress;
        $timeout(function () { $scope.PCTModal.hide(); }, 200);
    };
    
});