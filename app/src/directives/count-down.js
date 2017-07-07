var app = require('../app.js');

app.directive('countDown', function($window) {
    return {
        controller: ["$scope", "$element", function ($scope, $element) {
            var arr = $element.attr("count-down").split('.');
            var left = $scope;
            while(arr.length > 0){
                left = left[arr.shift()];
            }
            var secondsLeft=function(endTime){
                var divNum = 1000;
                var p=function(s){
                    return s < 10 ? '0' + s: s;
                }
                var sTime = new Date();
                endTime = endTime.replace(/-/g,'/');
                var eTime = new Date(endTime);
                return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
            }
            left = secondsLeft(left);
            
            var timesCount=function(left,i){
                setInterval(function(){
                    if(left>0){
                        left--;
                        writeTimes(left);
                    }else{
                        clearInterval(timesCount);
                        return;
                    }
                },1000);
            }
            var writeTimes=function(left){
                var days=parseInt(left/60/60/24);
                var hours=parseInt((left-days*24*60*60)/60/60);
                var mins=parseInt((left-hours*60*60-days*24*60*60)/60);
                var secs=left-days*24*60*60-hours*60*60-mins*60;
                var timeArr=[days,hours,mins,secs];
                if(days!=0){
                    return $element.html(days+"天"+hours+"时"+mins+"分"+secs+"秒");
                }else if(days==0){
                    return $element.html(hours+"小时"+mins+"分"+secs+"秒");
                }else if(hours==0){
                    return $element.html(mins+"分"+secs+"秒");
                }else if(mins==0){
                    return $element.html(secs+"秒");
                }else{
                    return $element.html(0+"秒");
                }
            }
            writeTimes(left);
            timesCount(left);
        }]
    }
});