var app = require('../../app.js');

app.controller("getInformationController", function ($scope, $rootScope, $state, $stateParams) {
    var id = $stateParams.id;
    $.ajax({
        type: "post",
        timeout: 3000,
        url: "/f/confirmView",//3.5
        data: {
            id: id
        },
        datatype: "json",
        success: function (ret) {
            if (ret.success) {
                showOfferInfo(ret);
            } else {
                alert(ret.msg)
            }
        },
        error: function () {
            console.log("超时或后台报错")
            $scope.alert(ret.msg);
        }
    });

    //渲染打款人信息
    var showOfferInfo = function (ret) {
        var data = ret.data;
        var entryName = data.entryName;
        var entryPhone = data.entryPhone;
        var refName = data.refName;
        var refPhone = data.refPhone;
        var Amount = data.amount;
        var bankNum = data.bankNum;
        var transImg = data.transImg;

        $("#entryName").html(entryName);
        $("#entryPhone").html(entryPhone);
        $("#refName").html(refName);
        $("#refPhone").html(refPhone);
        $("#Amount").html(Amount);
        $("#bankNum").html(bankNum);
        $("#transImg").prop("src", transImg);
    }

});