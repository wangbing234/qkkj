var app = require('../app.js');

app.directive('ngBack', function($window) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
            element.bind("touchstart", onTouchStart);
            function onTouchStart(event) {
                $window.history.back();
            }
        }
    };
});