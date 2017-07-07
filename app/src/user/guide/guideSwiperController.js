var app = require('../../app.js');

app.controller("guideSwiperController",function($scope, $rootScope, $http, $location, $state) {
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent) ||
                window.innerWidth < 500;
    }
    function setScale() {
        if (window.top !== window) {
            return;
        }
        var pageScale = 1;

        var width = document.documentElement.clientWidth || 320;
        var height = document.documentElement.clientHeight || 486;
        if (width / height >= 320 / 486) {
            pageScale = height / 486;
            var margin = ($(".swiper-slide").width()/pageScale-$("ul").width())/2;
            $("ul").css("margin-top",0);
            $("ul").css("margin-left",margin);
        } else {
            pageScale = width / 320;
            var margin = ($(".swiper-slide").height()/pageScale-$("ul").height())/2;
            $("ul").css("margin-top",margin);
        }
        var content = 'width=320, initial-scale=' + pageScale + ', maximum-scale=' + pageScale + ', user-scalable=no';
        document.getElementById('viewport').setAttribute('content', content);
    }
    if (isMobile()){setScale();}

    $scope.$on('$destroy',function(){
        document.getElementById('viewport').setAttribute('content', 'width=320, initial-scale=1, maximum-scale=1, user-scalable=no');
    })

    var animations;
    var mySwiper = new Swiper ('.swiper-container', {
        direction: 'vertical',
        loop: true,
        onSlideChangeStart: function(swiper){
            var pages = $(".swiper-slide");
            var currentPage = $(pages[swiper.activeIndex]);
            var elements = currentPage.children("ul").children("li").children("div");
            animations = [];
            for(var i = 0 ; i < elements.length ; i++){
                var element = $(elements[i]);
                var animation = element.css("animation-name")+ " " +
                                element.css("animation-duration")+ " " +
                                element.css("animation-delay")+ " " +
                                element.css("animation-iteration-count")+ " " +
                                element.css("animation-direction")+ " " +
                                element.css("animation-fill-mode")+ " " +
                                element.css("animation-play-state");
                animations.push(animation);
                if(element.css("animation-name").indexOf("fadeIn")>=0 ||
                    element.css("animation-name").indexOf("bounceIn")>=0){
                    element.css("opacity",0);
                }
                element.css("animation","none");
            }
        },
        onSlideChangeEnd:function(swiper){
            var pages = $(".swiper-slide");
            var currentPage = $(pages[swiper.activeIndex]);
            var elements = currentPage.children("ul").children("li").children("div");
            for(var i = 0 ; i < elements.length ; i++){
                var element = $(elements[i]);
                var animation = animations[i];
                element.css("animation",animation);
            }
        },
    });
});