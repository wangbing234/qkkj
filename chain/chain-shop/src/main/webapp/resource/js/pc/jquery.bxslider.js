(function(a){var c={},b={mode:"horizontal",slideSelector:"",infiniteLoop:true,hideControlOnEnd:false,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:false,captions:false,ticker:false,tickerHover:false,adaptiveHeight:false,adaptiveHeightSpeed:500,video:false,useCSS:true,preloadImages:"visible",responsive:true,touchEnabled:true,swipeThreshold:50,oneToOneTouch:true,preventDefaultSwipeX:true,preventDefaultSwipeY:false,pager:true,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:true,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:false,startText:"Start",stopText:"Stop",autoControlsCombine:false,autoControlsSelector:null,auto:false,pause:4e3,autoStart:true,autoDirection:"next",autoHover:false,autoDelay:0,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,onSliderLoad:function(){},onSlideBefore:function(){},onSlideAfter:function(){},onSlideNext:function(){},onSlidePrev:function(){}};a.fn.bxSlider=function(p){if(this.length==0)return this;if(this.length>1){this.each(function(){a(this).bxSlider(p)});return this}var d={},e=this;c.el=this;var x=a(window).width(),v=a(window).height(),z=function(){d.settings=a.extend({},b,p);d.settings.slideWidth=parseInt(d.settings.slideWidth);d.children=e.children(d.settings.slideSelector);if(d.children.length<d.settings.minSlides)d.settings.minSlides=d.children.length;if(d.children.length<d.settings.maxSlides)d.settings.maxSlides=d.children.length;if(d.settings.randomStart)d.settings.startSlide=Math.floor(Math.random()*d.children.length);d.active={index:d.settings.startSlide};d.carousel=d.settings.minSlides>1||d.settings.maxSlides>1;if(d.carousel)d.settings.preloadImages="all";d.minThreshold=d.settings.minSlides*d.settings.slideWidth+(d.settings.minSlides-1)*d.settings.slideMargin;d.maxThreshold=d.settings.maxSlides*d.settings.slideWidth+(d.settings.maxSlides-1)*d.settings.slideMargin;d.working=false;d.controls={};d.interval=null;d.animProp=d.settings.mode=="vertical"?"top":"left";d.usingCSS=d.settings.useCSS&&d.settings.mode!="fade"&&function(){var c=document.createElement("div"),a=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var b in a)if(c.style[a[b]]!==undefined){d.cssPrefix=a[b].replace("Perspective","").toLowerCase();d.animProp="-"+d.cssPrefix+"-transform";return true}return false}();if(d.settings.mode=="vertical")d.settings.maxSlides=d.settings.minSlides;e.data("origStyle",e.attr("style"));e.children(d.settings.slideSelector).each(function(){a(this).data("origStyle",a(this).attr("style"))});P()},P=function(){e.wrap('<div class="bx-wrapper"><div class="bx-viewport"></div></div>');d.viewport=e.parent();d.loader=a('<div class="bx-loading" />');d.viewport.prepend(d.loader);e.css({width:d.settings.mode=="horizontal"?d.children.length*100+215+"%":"auto",position:"relative"});if(d.usingCSS&&d.settings.easing)e.css("-"+d.cssPrefix+"-transition-timing-function",d.settings.easing);else if(!d.settings.easing)d.settings.easing="swing";var c=h();d.viewport.css({width:"100%",overflow:"hidden",position:"relative"});d.viewport.parent().css({maxWidth:A()});!d.settings.pager&&d.viewport.parent().css({margin:"0 auto 0px"});d.children.css({"float":d.settings.mode=="horizontal"?"left":"none",listStyle:"none",position:"relative"});d.children.css("width",s());d.settings.mode=="horizontal"&&d.settings.slideMargin>0&&d.children.css("marginRight",d.settings.slideMargin);d.settings.mode=="vertical"&&d.settings.slideMargin>0&&d.children.css("marginBottom",d.settings.slideMargin);if(d.settings.mode=="fade"){d.children.css({position:"absolute",zIndex:0,display:"none"});d.children.eq(d.settings.startSlide).css({zIndex:50,display:"block"})}d.controls.el=a('<div class="bx-controls" />');d.settings.captions&&C();d.active.last=d.settings.startSlide==g()-1;d.settings.video&&e.fitVids();var b=d.children.eq(d.settings.startSlide);if(d.settings.preloadImages=="all")b=d.children;if(!d.settings.ticker){d.settings.pager&&L();d.settings.controls&&D();d.settings.auto&&d.settings.autoControls&&B();(d.settings.controls||d.settings.autoControls||d.settings.pager)&&d.viewport.after(d.controls.el)}else d.settings.pager=false;J(b,Q)},J=function(c,b){var d=c.find("img, iframe").length;if(d==0){b();return}var e=0;c.find("img, iframe").each(function(){a(this).one("load",function(){++e==d&&b()}).each(function(){this.complete&&a(this).load()})})},Q=function(){if(d.settings.infiniteLoop&&d.settings.mode!="fade"&&!d.settings.ticker){var b=d.settings.mode=="vertical"?d.settings.minSlides:d.settings.maxSlides,f=d.children.slice(0,b).clone().addClass("bx-clone"),c=d.children.slice(-b).clone().addClass("bx-clone");e.append(f).prepend(c)}d.loader.remove();r();if(d.settings.mode=="vertical")d.settings.adaptiveHeight=true;d.viewport.height(k());e.redrawSlider();d.settings.onSliderLoad(d.active.index);d.initialized=true;d.settings.responsive&&a(window).bind("resize",u);d.settings.auto&&d.settings.autoStart&&O();d.settings.ticker&&M();d.settings.pager&&o(d.settings.startSlide);d.settings.controls&&q();d.settings.touchEnabled&&!d.settings.ticker&&N()},k=function(){var c=0,b=a();if(d.settings.mode!="vertical"&&!d.settings.adaptiveHeight)b=d.children;else if(!d.carousel)b=d.children.eq(d.active.index);else{var e=d.settings.moveSlides==1?d.active.index:d.active.index*j();b=d.children.eq(e);for(i=1;i<=d.settings.maxSlides-1;i++)if(e+i>=d.children.length)b=b.add(d.children.eq(i-1));else b=b.add(d.children.eq(e+i))}if(d.settings.mode=="vertical"){b.each(function(){c+=a(this).outerHeight()});if(d.settings.slideMargin>0)c+=d.settings.slideMargin*(d.settings.minSlides-1)}else c=Math.max.apply(Math,b.map(function(){return a(this).outerHeight(false)}).get());return c},A=function(){var a="100%";if(d.settings.slideWidth>0)if(d.settings.mode=="horizontal")a=d.settings.maxSlides*d.settings.slideWidth+(d.settings.maxSlides-1)*d.settings.slideMargin;else a=d.settings.slideWidth;return a},s=function(){var b=d.settings.slideWidth,a=d.viewport.width();if(d.settings.slideWidth==0||d.settings.slideWidth>a&&!d.carousel||d.settings.mode=="vertical")b=a;else if(d.settings.maxSlides>1&&d.settings.mode=="horizontal")if(a<=d.maxThreshold)if(a<d.minThreshold)b=(a-d.settings.slideMargin*(d.settings.minSlides-1))/d.settings.minSlides;return b},h=function(){var a=1;if(d.settings.mode=="horizontal"&&d.settings.slideWidth>0)if(d.viewport.width()<d.minThreshold)a=d.settings.minSlides;else if(d.viewport.width()>d.maxThreshold)a=d.settings.maxSlides;else{var b=d.children.first().width();a=Math.floor(d.viewport.width()/b)}else if(d.settings.mode=="vertical")a=d.settings.minSlides;return a},g=function(){var a=0;if(d.settings.moveSlides>0)if(d.settings.infiniteLoop)a=d.children.length/j();else{var b=0,c=0;while(b<d.children.length){++a;b=c+h();c+=d.settings.moveSlides<=h()?d.settings.moveSlides:h()}}else a=Math.ceil(d.children.length/h());return a},j=function(){return d.settings.moveSlides>0&&d.settings.moveSlides<=h()?d.settings.moveSlides:h()},r=function(){if(d.children.length>d.settings.maxSlides&&d.active.last&&!d.settings.infiniteLoop){if(d.settings.mode=="horizontal"){var b=d.children.last(),a=b.position();f(-(a.left-(d.viewport.width()-b.width())),"reset",0)}else if(d.settings.mode=="vertical"){var c=d.children.length-d.settings.minSlides,a=d.children.eq(c).position();f(-a.top,"reset",0)}}else{var a=d.children.eq(d.active.index*j()).position();if(d.active.index==g()-1)d.active.last=true;if(a!=undefined)if(d.settings.mode=="horizontal")f(-a.left,"reset",0);else d.settings.mode=="vertical"&&f(-a.top,"reset",0)}},f=function(b,a,h,i){if(d.usingCSS){var g=d.settings.mode=="vertical"?"translate3d(0, "+b+"px, 0)":"translate3d("+b+"px, 0, 0)";e.css("-"+d.cssPrefix+"-transition-duration",h/1e3+"s");if(a=="slide"){e.css(d.animProp,g);e.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){e.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");m()})}else if(a=="reset")e.css(d.animProp,g);else if(a=="ticker"){e.css("-"+d.cssPrefix+"-transition-timing-function","linear");e.css(d.animProp,g);e.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(){e.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd");f(i.resetValue,"reset",0);l()})}}else{var c={};c[d.animProp]=b;if(a=="slide")e.animate(c,h,d.settings.easing,function(){m()});else if(a=="reset")e.css(d.animProp,b);else a=="ticker"&&e.animate(c,speed,"linear",function(){f(i.resetValue,"reset",0);l()})}},t=function(){for(var e="",f=g(),b=0;b<f;b++){var c="";if(d.settings.buildPager&&a.isFunction(d.settings.buildPager)){c=d.settings.buildPager(b);d.pagerEl.addClass("bx-custom-pager")}else{c=b+1;d.pagerEl.addClass("bx-default-pager")}e+='<div class="bx-pager-item"><a href="" data-slide-index="'+b+'" class="bx-pager-link">'+c+"</a></div>"}d.pagerEl.html(e)},L=function(){if(!d.settings.pagerCustom){d.pagerEl=a('<div class="bx-pager" />');if(d.settings.pagerSelector)a(d.settings.pagerSelector).html(d.pagerEl);else d.controls.el.addClass("bx-has-pager").append(d.pagerEl);t()}else d.pagerEl=a(d.settings.pagerCustom);d.pagerEl.find("a").bind("click",E)},D=function(){d.controls.next=a('<a class="bx-next">'+d.settings.nextText+"<span></span></a>");d.controls.prev=a('<a class="bx-prev">'+d.settings.prevText+"<span></span></a>");d.controls.next.bind("click",G);d.controls.prev.bind("click",H);d.settings.nextSelector&&a(d.settings.nextSelector).append(d.controls.next);d.settings.prevSelector&&a(d.settings.prevSelector).append(d.controls.prev);if(!d.settings.nextSelector&&!d.settings.prevSelector){d.controls.directionEl=a('<div class="bx-controls-direction" />');d.controls.directionEl.append(d.controls.prev).append(d.controls.next);d.controls.el.addClass("bx-has-controls-direction").append(d.controls.directionEl)}},B=function(){d.controls.start=a('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+d.settings.startText+"</a></div>");d.controls.stop=a('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+d.settings.stopText+"</a></div>");d.controls.autoEl=a('<div class="bx-controls-auto" />');d.controls.autoEl.delegate(".bx-start","click",F);d.controls.autoEl.delegate(".bx-stop","click",I);if(d.settings.autoControlsCombine)d.controls.autoEl.append(d.controls.start);else d.controls.autoEl.append(d.controls.start).append(d.controls.stop);if(d.settings.autoControlsSelector)a(d.settings.autoControlsSelector).html(d.controls.autoEl);else d.controls.el.addClass("bx-has-controls-auto").append(d.controls.autoEl);n(d.settings.autoStart?"stop":"start")},C=function(){d.children.each(function(){var b=a(this).find("img:first").attr("title");b!=undefined&&(""+b).length&&a(this).append('<div class="bx-caption"><span>'+b+"</span></div>")})},G=function(a){d.settings.auto&&e.stopAuto();e.goToNextSlide();a.preventDefault();e.startAuto()},H=function(a){d.settings.auto&&e.stopAuto();e.goToPrevSlide();a.preventDefault();e.startAuto()},F=function(a){e.startAuto();a.preventDefault()},I=function(a){e.stopAuto();a.preventDefault()},E=function(c){d.settings.auto&&e.stopAuto();var f=a(c.currentTarget),b=parseInt(f.attr("data-slide-index"));b!=d.active.index&&e.goToSlide(b);c.preventDefault()},o=function(b){var c=d.children.length;if(d.settings.pagerType=="short"){if(d.settings.maxSlides>1)c=Math.ceil(d.children.length/d.settings.maxSlides);d.pagerEl.html(b+1+d.settings.pagerShortSeparator+c);return}d.pagerEl.find("a").removeClass("active");d.pagerEl.each(function(d,c){a(c).find("a").eq(b).addClass("active")})},m=function(){if(d.settings.infiniteLoop){var a="";if(d.active.index==0)a=d.children.eq(0).position();else if(d.active.index==g()-1&&d.carousel)a=d.children.eq((g()-1)*j()).position();else if(d.active.index==d.children.length-1)a=d.children.eq(d.children.length-1).position();if(d.settings.mode=="horizontal")f(-a.left,"reset",0);else d.settings.mode=="vertical"&&f(-a.top,"reset",0)}d.working=false;d.settings.onSlideAfter(d.children.eq(d.active.index),d.oldIndex,d.active.index)},n=function(a){if(d.settings.autoControlsCombine)d.controls.autoEl.html(d.controls[a]);else{d.controls.autoEl.find("a").removeClass("active");d.controls.autoEl.find("a:not(.bx-"+a+")").addClass("active")}},q=function(){if(g()==1){d.controls.prev.addClass("disabled");d.controls.next.addClass("disabled")}else if(!d.settings.infiniteLoop&&d.settings.hideControlOnEnd)if(d.active.index==0){d.controls.prev.addClass("disabled");d.controls.next.removeClass("disabled")}else if(d.active.index==g()-1){d.controls.next.addClass("disabled");d.controls.prev.removeClass("disabled")}else{d.controls.prev.removeClass("disabled");d.controls.next.removeClass("disabled")}},O=function(){if(d.settings.autoDelay>0)var a=setTimeout(e.startAuto,d.settings.autoDelay);else e.startAuto();d.settings.autoHover&&e.hover(function(){if(d.interval){e.stopAuto(true);d.autoPaused=true}},function(){if(d.autoPaused){e.startAuto(true);d.autoPaused=null}})},M=function(){var b=0;if(d.settings.autoDirection=="next")e.append(d.children.clone().addClass("bx-clone"));else{e.prepend(d.children.clone().addClass("bx-clone"));var c=d.children.first().position();b=d.settings.mode=="horizontal"?-c.left:-c.top}f(b,"reset",0);d.settings.pager=false;d.settings.controls=false;d.settings.autoControls=false;d.settings.tickerHover&&!d.usingCSS&&d.viewport.hover(function(){e.stop()},function(){var b=0;d.children.each(function(){b+=d.settings.mode=="horizontal"?a(this).outerWidth(true):a(this).outerHeight(true)});var g=d.settings.speed/b,f=d.settings.mode=="horizontal"?"left":"top",c=g*(b-Math.abs(parseInt(e.css(f))));l(c)});l()},l=function(c){speed=c?c:d.settings.speed;var a={left:0,top:0},b={left:0,top:0};if(d.settings.autoDirection=="next")a=e.find(".bx-clone").first().position();else b=d.children.first().position();var g=d.settings.mode=="horizontal"?-a.left:-a.top,h=d.settings.mode=="horizontal"?-b.left:-b.top,i={resetValue:h};f(g,"ticker",speed,i)},N=function(){d.touch={start:{x:0,y:0},end:{x:0,y:0}};d.viewport.bind("touchstart",K)},K=function(b){if(d.working)b.preventDefault();else{d.touch.originalPos=e.position();var a=b.originalEvent;d.touch.start.x=a.changedTouches[0].pageX;d.touch.start.y=a.changedTouches[0].pageY;d.viewport.bind("touchmove",w);d.viewport.bind("touchend",y)}},w=function(c){var a=c.originalEvent,e=Math.abs(a.changedTouches[0].pageX-d.touch.start.x),g=Math.abs(a.changedTouches[0].pageY-d.touch.start.y);if(e*3>g&&d.settings.preventDefaultSwipeX)c.preventDefault();else g*3>e&&d.settings.preventDefaultSwipeY&&c.preventDefault();if(d.settings.mode!="fade"&&d.settings.oneToOneTouch){var b=0;if(d.settings.mode=="horizontal"){var h=a.changedTouches[0].pageX-d.touch.start.x;b=d.touch.originalPos.left+h}else{var h=a.changedTouches[0].pageY-d.touch.start.y;b=d.touch.originalPos.top+h}f(b,"reset",0)}},y=function(g){d.viewport.unbind("touchmove",w);var c=g.originalEvent,b=0;d.touch.end.x=c.changedTouches[0].pageX;d.touch.end.y=c.changedTouches[0].pageY;if(d.settings.mode=="fade"){var a=Math.abs(d.touch.start.x-d.touch.end.x);if(a>=d.settings.swipeThreshold){d.touch.start.x>d.touch.end.x?e.goToNextSlide():e.goToPrevSlide();e.stopAuto()}}else{var a=0;if(d.settings.mode=="horizontal"){a=d.touch.end.x-d.touch.start.x;b=d.touch.originalPos.left}else{a=d.touch.end.y-d.touch.start.y;b=d.touch.originalPos.top}if(!d.settings.infiniteLoop&&(d.active.index==0&&a>0||d.active.last&&a<0))f(b,"reset",200);else if(Math.abs(a)>=d.settings.swipeThreshold){a<0?e.goToNextSlide():e.goToPrevSlide();e.stopAuto()}else f(b,"reset",200)}d.viewport.unbind("touchend",y)},u=function(){var c=a(window).width(),b=a(window).height();if(x!=c||v!=b){x=c;v=b;e.redrawSlider()}};e.goToSlide=function(c,h){if(d.working||d.active.index==c)return;d.working=true;d.oldIndex=d.active.index;if(c<0)d.active.index=g()-1;else if(c>=g())d.active.index=0;else d.active.index=c;d.settings.onSlideBefore(d.children.eq(d.active.index),d.oldIndex,d.active.index);if(h=="next")d.settings.onSlideNext(d.children.eq(d.active.index),d.oldIndex,d.active.index);else if(h=="prev")d.settings.onSlidePrev(d.children.eq(d.active.index),d.oldIndex,d.active.index);d.active.last=d.active.index>=g()-1;d.settings.pager&&o(d.active.index);d.settings.controls&&q();if(d.settings.mode=="fade"){d.settings.adaptiveHeight&&d.viewport.height()!=k()&&d.viewport.animate({height:k()},d.settings.adaptiveHeightSpeed);d.children.filter(":visible").fadeOut(d.settings.speed).css({zIndex:0});d.children.eq(d.active.index).css("zIndex",51).fadeIn(d.settings.speed,function(){a(this).css("zIndex",50);m()})}else{d.settings.adaptiveHeight&&d.viewport.height()!=k()&&d.viewport.animate({height:k()},d.settings.adaptiveHeightSpeed);var l=0,b={left:0,top:0};if(!d.settings.infiniteLoop&&d.carousel&&d.active.last)if(d.settings.mode=="horizontal"){var i=d.children.eq(d.children.length-1);b=i.position();l=d.viewport.width()-i.outerWidth()}else{var n=d.children.length-d.settings.minSlides;b=d.children.eq(n).position()}else if(d.carousel&&d.active.last&&h=="prev"){var s=d.settings.moveSlides==1?d.settings.maxSlides-j():(g()-1)*j()-(d.children.length-d.settings.maxSlides),i=e.children(".bx-clone").eq(s);b=i.position()}else if(h=="next"&&d.active.index==0){b=e.find("> .bx-clone").eq(d.settings.maxSlides).position();d.active.last=false}else if(c>=0){var p=c*j();b=d.children.eq(p).position()}if("undefined"!==typeof b){var r=d.settings.mode=="horizontal"?-(b.left-l):-b.top;f(r,"slide",d.settings.speed)}}};e.goToNextSlide=function(){if(!d.settings.infiniteLoop&&d.active.last)return;var a=parseInt(d.active.index)+1;e.goToSlide(a,"next")};e.goToPrevSlide=function(){if(!d.settings.infiniteLoop&&d.active.index==0)return;var a=parseInt(d.active.index)-1;e.goToSlide(a,"prev")};e.startAuto=function(a){if(d.interval)return;d.interval=setInterval(function(){d.settings.autoDirection=="next"?e.goToNextSlide():e.goToPrevSlide()},d.settings.pause);d.settings.autoControls&&a!=true&&n("stop")};e.stopAuto=function(a){if(!d.interval)return;clearInterval(d.interval);d.interval=null;d.settings.autoControls&&a!=true&&n("start")};e.getCurrentSlide=function(){return d.active.index};e.getSlideCount=function(){return d.children.length};e.redrawSlider=function(){d.children.add(e.find(".bx-clone")).outerWidth(s());d.viewport.css("height",k());!d.settings.ticker&&r();if(d.active.last)d.active.index=g()-1;if(d.active.index>=g())d.active.last=true;if(d.settings.pager&&!d.settings.pagerCustom){t();o(d.active.index)}};e.destroySlider=function(){if(!d.initialized)return;d.initialized=false;a(".bx-clone",this).remove();d.children.each(function(){a(this).data("origStyle")!=undefined?a(this).attr("style",a(this).data("origStyle")):a(this).removeAttr("style")});a(this).data("origStyle")!=undefined?this.attr("style",a(this).data("origStyle")):a(this).removeAttr("style");a(this).unwrap().unwrap();d.controls.el&&d.controls.el.remove();d.controls.next&&d.controls.next.remove();d.controls.prev&&d.controls.prev.remove();d.pagerEl&&d.pagerEl.remove();a(".bx-caption",this).remove();d.controls.autoEl&&d.controls.autoEl.remove();clearInterval(d.interval);d.settings.responsive&&a(window).unbind("resize",u)};e.reloadSlider=function(a){if(a!=undefined)p=a;e.destroySlider();z()};z();return this}})(jQuery)