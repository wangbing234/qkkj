var app = require('../app.js');

app.directive("numberInput", function () {
    return {
        require: "ngModel",
        link: function(scope,element,attrs,ngModel){
            element.bind('keyup',function(e){
                this.value = this.value.replace(/[^0-9|\.]/g,'');
                if(/^[0]*$/.test(this.value)){
                    this.value = 0;// 全部都是0
                }else if(/^[0]+\d*$/.test(this.value)){
                    this.value = this.value.replace(/^[0]+/,'')// 以0开头的数字
                }
                if(/^[0-9]+[.]{1}[0-9]{1,4}/.test(this.value)){
                    this.value = this.value.match(/^[0-9]+[.]{1}[0-9]{1,4}/)[0];
                }
                
                // 光标移动到最后
                var len = this.value.length;
                if (this.createTextRange) { 
                    var range = input.createTextRange(); 
                    range.collapse(true); 
                    range.moveEnd('character', len); 
                    range.moveStart('character', len); 
                    range.select(); 
                } else if (this.setSelectionRange) { 
                    this.focus(); 
                    this.setSelectionRange(len, len); 
                } 

                var method = element.attr("number-input");
                method = method + "(" + this.value + ")";
                scope.$apply(method);
            });
        }
    }
});