var app = require('./app.js');

app.filter('thousandBitSeparator',function(){
    return function(num){
        var s = num.toString();
        if(s.indexOf('.') > 0) {
            return s.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        } else {
            return s.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        }
    }
}).filter('delcommafy',function(){
    return function(num){
        return num.replace(/,/gi, '');
    }
}).filter('orderClass',function(){
    return function(str){
        switch(str){
            case "init":
                return 'state-color1';
            case "sure":
                return 'state-color2';
            case "pass":
                return 'state-color2';
            case "send":
                return 'state-color3';
            case "sign":
                return 'state-color4';
            case "cancel":
                return 'state-color5';
        }
        return str;
    }
});