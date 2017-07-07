var app = require('../../app.js');

app.controller("accountController", function($scope, $rootScope, $http, $location, $state, $stateParams) {
    $.ajax({
        url: ROOTCONFIG.host + "/f/mebAccQry",		
        type: 'get',
        dataType: 'json', //主要是这里和原来的json改变了！	
        success: function(ret) {
            console.log(ret)
            var data=ret.data;
//          var leng=data.length;
            if(ret.success) {
                var kh=data.bankNum;
                var yh=data.depositBank;
                var xh=data.detailBank;
                var kh1=data.bankNum2;
                var yh1=data.depositBank2;
                var xh1=data.detailBank2;
                 var zhifubao=data.alipayId;
                $(".kh").html(kh);
                $(".yh").html(yh);
                $(".xh").html(xh);			
                $(".kh1").html(kh1);			
                $(".yh1").html(yh1);
                $(".xh1").html(xh1);
                $(".account_zhifubao").html(zhifubao);
				$(".account_xiugai").on("touchstart",function(){
			
                    $state.go("addAccount",{ bankNum: data.bankNum, depositBank: data.depositBank, detailBank: data.detailBank, bankNum2: data.bankNum2, depositBank2: data.depositBank2, detailBank2: data.detailBank2});			 					
                });
            }
        }
    });
   
    $('.account_more').on("touchstart",function(){
        $state.go("addAccount");
    })
});