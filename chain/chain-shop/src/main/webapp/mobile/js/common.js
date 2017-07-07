/* baguetteBox.js https://github.com/feimosi/baguetteBox.js */
var baguetteBox=function(){function t(t,n){L.transforms=f(),L.svg=p(),e(),D=document.querySelectorAll(t),[].forEach.call(D,function(t){var e=t.getElementsByTagName("a");e=[].filter.call(e,function(t){return j.test(t.href)});var o=S.length;S.push(e),S[o].options=n,[].forEach.call(S[o],function(t,e){h(t,"click",function(t){t.preventDefault?t.preventDefault():t.returnValue=!1,i(o),a(e)})})})}function e(){return(b=v("baguetteBox-overlay"))?(k=v("baguetteBox-slider"),w=v("previous-button"),C=v("next-button"),void(T=v("close-button"))):(b=y("div"),b.id="baguetteBox-overlay",document.getElementsByTagName("body")[0].appendChild(b),k=y("div"),k.id="baguetteBox-slider",b.appendChild(k),w=y("button"),w.id="previous-button",w.innerHTML=L.svg?E:"&lt;",b.appendChild(w),C=y("button"),C.id="next-button",C.innerHTML=L.svg?x:"&gt;",b.appendChild(C),T=y("button"),T.id="close-button",T.innerHTML=L.svg?B:"X",b.appendChild(T),w.className=C.className=T.className="baguetteBox-button",void n())}function n(){h(b,"click",function(t){t.target&&"IMG"!==t.target.nodeName&&"FIGCAPTION"!==t.target.nodeName&&s()}),h(w,"click",function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,c()}),h(C,"click",function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,u()}),h(T,"click",function(t){t.stopPropagation?t.stopPropagation():t.cancelBubble=!0,s()}),h(b,"touchstart",function(t){N=t.changedTouches[0].pageX}),h(b,"touchmove",function(t){H||(t.preventDefault?t.preventDefault():t.returnValue=!1,touch=t.touches[0]||t.changedTouches[0],touch.pageX-N>40?(H=!0,c()):touch.pageX-N<-40&&(H=!0,u()))}),h(b,"touchend",function(){H=!1}),h(document,"keydown",function(t){switch(t.keyCode){case 37:c();break;case 39:u();break;case 27:s()}})}function i(t){if(A!==t){for(A=t,o(S[t].options);k.firstChild;)k.removeChild(k.firstChild);X.length=0;for(var e,n=0;n<S[t].length;n++)e=y("div"),e.className="full-image",e.id="baguette-img-"+n,X.push(e),k.appendChild(X[n])}}function o(t){t||(t={});for(var e in P)I[e]=P[e],"undefined"!=typeof t[e]&&(I[e]=t[e]);k.style.transition=k.style.webkitTransition="fadeIn"===I.animation?"opacity .4s ease":"slideIn"===I.animation?"":"none","auto"===I.buttons&&("ontouchstart"in window||1===S[A].length)&&(I.buttons=!1),w.style.display=C.style.display=I.buttons?"":"none"}function a(t){"block"!==b.style.display&&(M=t,r(M,function(){g(M),m(M)}),d(),b.style.display="block",setTimeout(function(){b.className="visible"},50))}function s(){"none"!==b.style.display&&(b.className="",setTimeout(function(){b.style.display="none"},500))}function r(t,e){var n=X[t];if("undefined"!=typeof n){if(n.getElementsByTagName("img")[0])return void(e&&e());imageElement=S[A][t],imageCaption=imageElement.getAttribute("data-caption")||imageElement.title,imageSrc=l(imageElement);var i=y("figure"),o=y("img"),a=y("figcaption");n.appendChild(i),i.innerHTML='<div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>',o.onload=function(){var n=document.querySelector("#baguette-img-"+t+" .spinner");i.removeChild(n),!I.async&&e&&e()},o.setAttribute("src",imageSrc),i.appendChild(o),I.captions&&imageCaption&&(a.innerHTML=imageCaption,i.appendChild(a)),I.async&&e&&e()}}function l(t){var e=imageElement.href;if(t.dataset){var n=[];for(var i in t.dataset)"at-"!==i.substring(0,3)||isNaN(i.substring(3))||(n[i.replace("at-","")]=t.dataset[i]);keys=Object.keys(n).sort(function(t,e){return parseInt(t)<parseInt(e)?-1:1});for(var o=window.innerWidth*window.devicePixelRatio,a=0;a<keys.length-1&&keys[a]<o;)a++;e=n[keys[a]]||e}return e}function u(){M<=X.length-2?(M++,d(),g(M)):I.animation&&(k.className="bounce-from-right",setTimeout(function(){k.className=""},400))}function c(){M>=1?(M--,d(),m(M)):I.animation&&(k.className="bounce-from-left",setTimeout(function(){k.className=""},400))}function d(){var t=100*-M+"%";"fadeIn"===I.animation?(k.style.opacity=0,setTimeout(function(){L.transforms?k.style.transform=k.style.webkitTransform="translate3d("+t+",0,0)":k.style.left=t,k.style.opacity=1},400)):L.transforms?k.style.transform=k.style.webkitTransform="translate3d("+t+",0,0)":k.style.left=t}function f(){var t=y("div");return"undefined"!=typeof t.style.perspective||"undefined"!=typeof t.style.webkitPerspective}function p(){var t=y("div");return t.innerHTML="<svg/>","http://www.w3.org/2000/svg"==(t.firstChild&&t.firstChild.namespaceURI)}function g(t){t-M>=I.preload||r(t+1,function(){g(t+1)})}function m(t){M-t>=I.preload||r(t-1,function(){m(t-1)})}function h(t,e,n){t.addEventListener?t.addEventListener(e,n,!1):t.attachEvent("on"+e,n)}function v(t){return document.getElementById(t)}function y(t){return document.createElement(t)}var b,k,w,C,T,N,E='<svg width="44" height="60"><polyline points="30 10 10 30 30 50" stroke="rgba(255,255,255,0.5)" stroke-width="4"stroke-linecap="butt" fill="none" stroke-linejoin="round"/></svg>',x='<svg width="44" height="60"><polyline points="14 10 34 30 14 50" stroke="rgba(255,255,255,0.5)" stroke-width="4"stroke-linecap="butt" fill="none" stroke-linejoin="round"/></svg>',B='<svg width="30" height="30"><g stroke="rgb(160, 160, 160)" stroke-width="4"><line x1="5" y1="5" x2="25" y2="25"/><line x1="5" y1="25" x2="25" y2="5"/></g></svg>',I={},P={captions:!0,buttons:"auto",async:!1,preload:2,animation:"slideIn"},L={},M=0,A=-1,H=!1,j=/.+\.(gif|jpe?g|png|webp)/i,D=[],S=[],X=[];return[].forEach||(Array.prototype.forEach=function(t,e){for(var n=0;n<this.length;n++)t.call(e,this[n],n,this)}),[].filter||(Array.prototype.filter=function(t,e,n,i,o){for(n=this,i=[],o=0;o<n.length;o++)t.call(e,n[o],o,n)&&i.push(n[o]);return i}),{run:t}}();
/* TouchSlide v1.1 http://www.SuperSlide2.com/TouchSlide/ */
var TouchSlide=function(a){a=a||{};var b={slideCell:a.slideCell||"#touchSlide",titCell:a.titCell||".hd li",mainCell:a.mainCell||".bd",effect:a.effect||"left",autoPlay:a.autoPlay||!1,delayTime:a.delayTime||200,interTime:a.interTime||2500,defaultIndex:a.defaultIndex||0,titOnClassName:a.titOnClassName||"on",autoPage:a.autoPage||!1,prevCell:a.prevCell||".prev",nextCell:a.nextCell||".next",pageStateCell:a.pageStateCell||".pageState",pnLoop:"undefined "==a.pnLoop?!0:a.pnLoop,startFun:a.startFun||null,endFun:a.endFun||null,switchLoad:a.switchLoad||null},c=document.getElementById(b.slideCell.replace("#",""));if(!c)return!1;var d=function(a,b){a=a.split(" ");var c=[];b=b||document;var d=[b];for(var e in a)0!=a[e].length&&c.push(a[e]);for(var e in c){if(0==d.length)return!1;var f=[];for(var g in d)if("#"==c[e][0])f.push(document.getElementById(c[e].replace("#","")));else if("."==c[e][0])for(var h=d[g].getElementsByTagName("*"),i=0;i<h.length;i++){var j=h[i].className;j&&-1!=j.search(new RegExp("\\b"+c[e].replace(".","")+"\\b"))&&f.push(h[i])}else for(var h=d[g].getElementsByTagName(c[e]),i=0;i<h.length;i++)f.push(h[i]);d=f}return 0==d.length||d[0]==b?!1:d},e=function(a,b){var c=document.createElement("div");c.innerHTML=b,c=c.children[0];var d=a.cloneNode(!0);return c.appendChild(d),a.parentNode.replaceChild(c,a),m=d,c},g=function(a,b){!a||!b||a.className&&-1!=a.className.search(new RegExp("\\b"+b+"\\b"))||(a.className+=(a.className?" ":"")+b)},h=function(a,b){!a||!b||a.className&&-1==a.className.search(new RegExp("\\b"+b+"\\b"))||(a.className=a.className.replace(new RegExp("\\s*\\b"+b+"\\b","g"),""))},i=b.effect,j=d(b.prevCell,c)[0],k=d(b.nextCell,c)[0],l=d(b.pageStateCell)[0],m=d(b.mainCell,c)[0];if(!m)return!1;var N,O,n=m.children.length,o=d(b.titCell,c),p=o?o.length:n,q=b.switchLoad,r=parseInt(b.defaultIndex),s=parseInt(b.delayTime),t=parseInt(b.interTime),u="false"==b.autoPlay||0==b.autoPlay?!1:!0,v="false"==b.autoPage||0==b.autoPage?!1:!0,w="false"==b.pnLoop||0==b.pnLoop?!1:!0,x=r,y=null,z=null,A=null,B=0,C=0,D=0,E=0,G=/hp-tablet/gi.test(navigator.appVersion),H="ontouchstart"in window&&!G,I=H?"touchstart":"mousedown",J=H?"touchmove":"",K=H?"touchend":"mouseup",M=m.parentNode.clientWidth,P=n;if(0==p&&(p=n),v){p=n,o=o[0],o.innerHTML="";var Q="";if(1==b.autoPage||"true"==b.autoPage)for(var R=0;p>R;R++)Q+="<li>"+(R+1)+"</li>";else for(var R=0;p>R;R++)Q+=b.autoPage.replace("$",R+1);o.innerHTML=Q,o=o.children}"leftLoop"==i&&(P+=2,m.appendChild(m.children[0].cloneNode(!0)),m.insertBefore(m.children[n-1].cloneNode(!0),m.children[0])),N=e(m,'<div class="tempWrap" style="overflow:hidden; position:relative;"></div>'),m.style.cssText="width:"+P*M+"px;"+"position:relative;overflow:hidden;padding:0;margin:0;";for(var R=0;P>R;R++)m.children[R].style.cssText="display:table-cell;vertical-align:top;width:"+M+"px";var S=function(){"function"==typeof b.startFun&&b.startFun(r,p)},T=function(){"function"==typeof b.endFun&&b.endFun(r,p)},U=function(a){var b=("leftLoop"==i?r+1:r)+a,c=function(a){for(var b=m.children[a].getElementsByTagName("img"),c=0;c<b.length;c++)b[c].getAttribute(q)&&(b[c].setAttribute("src",b[c].getAttribute(q)),b[c].removeAttribute(q))};if(c(b),"leftLoop"==i)switch(b){case 0:c(n);break;case 1:c(n+1);break;case n:c(0);break;case n+1:c(1)}},V=function(){M=N.clientWidth,m.style.width=P*M+"px";for(var a=0;P>a;a++)m.children[a].style.width=M+"px";var b="leftLoop"==i?r+1:r;W(-b*M,0)};window.addEventListener("resize",V,!1);var W=function(a,b,c){c=c?c.style:m.style,c.webkitTransitionDuration=c.MozTransitionDuration=c.msTransitionDuration=c.OTransitionDuration=c.transitionDuration=b+"ms",c.webkitTransform="translate("+a+"px,0)"+"translateZ(0)",c.msTransform=c.MozTransform=c.OTransform="translateX("+a+"px)"},X=function(a){switch(i){case"left":r>=p?r=a?r-1:0:0>r&&(r=a?0:p-1),null!=q&&U(0),W(-r*M,s),x=r;break;case"leftLoop":null!=q&&U(0),W(-(r+1)*M,s),-1==r?(z=setTimeout(function(){W(-p*M,0)},s),r=p-1):r==p&&(z=setTimeout(function(){W(-M,0)},s),r=0),x=r}S(),A=setTimeout(function(){T()},s);for(var c=0;p>c;c++)h(o[c],b.titOnClassName),c==r&&g(o[c],b.titOnClassName);0==w&&(h(k,"nextStop"),h(j,"prevStop"),0==r?g(j,"prevStop"):r==p-1&&g(k,"nextStop")),l&&(l.innerHTML="<span>"+(r+1)+"</span>/"+p)};if(X(),u&&(y=setInterval(function(){r++,X()},t)),o)for(var R=0;p>R;R++)!function(){var a=R;o[a].addEventListener("click",function(){clearTimeout(z),clearTimeout(A),r=a,X()})}();k&&k.addEventListener("click",function(){(1==w||r!=p-1)&&(clearTimeout(z),clearTimeout(A),r++,X())}),j&&j.addEventListener("click",function(){(1==w||0!=r)&&(clearTimeout(z),clearTimeout(A),r--,X())});var Y=function(a){clearTimeout(z),clearTimeout(A),O=void 0,D=0;var b=H?a.touches[0]:a;B=b.pageX,C=b.pageY,m.addEventListener(J,Z,!1),m.addEventListener(K,$,!1)},Z=function(a){if(!H||!(a.touches.length>1||a.scale&&1!==a.scale)){var b=H?a.touches[0]:a;if(D=b.pageX-B,E=b.pageY-C,"undefined"==typeof O&&(O=!!(O||Math.abs(D)<Math.abs(E))),!O){switch(a.preventDefault(),u&&clearInterval(y),i){case"left":(0==r&&D>0||r>=p-1&&0>D)&&(D=.4*D),W(-r*M+D,0);break;case"leftLoop":W(-(r+1)*M+D,0)}null!=q&&Math.abs(D)>M/3&&U(D>-0?-1:1)}}},$=function(a){0!=D&&(a.preventDefault(),O||(Math.abs(D)>M/10&&(D>0?r--:r++),X(!0),u&&(y=setInterval(function(){r++,X()},t))),m.removeEventListener(J,Z,!1),m.removeEventListener(K,$,!1))};m.addEventListener(I,Y,!1)};
/* jquery.scrollLoading.js by zhangxinxu  http://www.zhangxinxu.com */
(function($){$.fn.scrollLoading=function(options){var defaults={attr:"data-url",container:$(window),callback:$.noop};var params=$.extend({},defaults,options||{});params.cache=[];$(this).each(function(){var node=this.nodeName.toLowerCase(),url=$(this).attr(params["attr"]);var data={obj:$(this),tag:node,url:url};params.cache.push(data)});var callback=function(call){if($.isFunction(params.callback)){params.callback.call(call.get(0))}};var loading=function(){var contHeight=params.container.height();if($(window).get(0)===window){contop=$(window).scrollTop()}else{contop=params.container.offset().top}$.each(params.cache,function(i,data){var o=data.obj,tag=data.tag,url=data.url,post,posb;if(o){post=o.offset().top-contop,post+o.height();if((post>=0&&post<contHeight)||(posb>0&&posb<=contHeight)){if(url){if(tag==="img"){callback(o.attr("src",url))}else{o.load(url,{},function(){callback(o)})}}else{callback(o)}data.obj=null}}})};loading();params.container.bind("scroll",loading)}})(jQuery);
/*TouchWipe y EddyZhang (张勇辉) http://www.uedcool.com */
(function(a){a.fn.touchwipe=function(c){var b={min_move_x:20,min_move_y:20,wipeLeft:function(){},wipeRight:function(){},wipeUp:function(){},wipeDown:function(){},wipe:function(){},wipehold:function(){},preventDefaultEvents:true};if(c){a.extend(b,c)}this.each(function(){var h;var g;var j=false;var i=false;var e;function m(){this.removeEventListener("touchmove",d);h=null;j=false;clearTimeout(e)}function d(q){if(b.preventDefaultEvents){q.preventDefault()}if(j){var n=q.touches[0].pageX;var r=q.touches[0].pageY;var p=h-n;var o=g-r;if(Math.abs(p)>=b.min_move_x){m();if(p>0){b.wipeLeft()}else{b.wipeRight()}}else{if(Math.abs(o)>=b.min_move_y){m();if(o>0){b.wipeUp()}else{b.wipeDown()}}}}}function k(){clearTimeout(e);if(!i&&j){b.wipe()}i=false}function l(){i=true;b.wipehold()}function f(n){if(n.touches.length==1){h=n.touches[0].pageX;g=n.touches[0].pageY;j=true;this.addEventListener("touchmove",d,false);e=setTimeout(l,750)}}if("ontouchstart" in document.documentElement){this.addEventListener("touchstart",f,false);this.addEventListener("touchend",k,false)}});return this};a.extend(a.fn.touchwipe,{version:"2.0",author:"张勇辉"})})(jQuery);
/* Bootstrap: modal.js v3.2.0 */

if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(t){"use strict";function e(e,o){return this.each(function(){var i=t(this),n=i.data("bs.modal"),a=t.extend({},s.DEFAULTS,i.data(),"object"==typeof e&&e);n||i.data("bs.modal",n=new s(this,a)),"string"==typeof e?n[e](o):a.show&&n.show(o)})}var s=function(e,s){this.options=s,this.$body=t(document.body),this.$element=t(e),this.$backdrop=this.isShown=null,this.scrollbarWidth=0,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,t.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};s.VERSION="3.2.0",s.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},s.prototype.toggle=function(t){return this.isShown?this.hide():this.show(t)},s.prototype.show=function(e){var s=this,o=t.Event("show.bs.modal",{relatedTarget:e});this.$element.trigger(o),this.isShown||o.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.$body.addClass("modal-open"),this.setScrollbar(),this.escape(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',t.proxy(this.hide,this)),this.backdrop(function(){var o=t.support.transition&&s.$element.hasClass("fade");

s.$element.parent().length||s.$element.appendTo(s.$body),s.$element.show().scrollTop(0),o&&s.$element[0].offsetWidth,s.$element.addClass("in").attr("aria-hidden",!1),s.enforceFocus();var i=t.Event("shown.bs.modal",{relatedTarget:e});o?s.$element.find(".modal-dialog").one("bsTransitionEnd",function(){s.$element.trigger("focus").trigger(i)}).emulateTransitionEnd(300):s.$element.trigger("focus").trigger(i)}))},s.prototype.hide=function(e){e&&e.preventDefault(),e=t.Event("hide.bs.modal"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()&&(this.isShown=!1,this.$body.removeClass("modal-open"),this.resetScrollbar(),this.escape(),t(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),t.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",t.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},s.prototype.enforceFocus=function(){t(document).off("focusin.bs.modal").on("focusin.bs.modal",t.proxy(function(t){this.$element[0]===t.target||this.$element.has(t.target).length||this.$element.trigger("focus")},this))},s.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",t.proxy(function(t){27==t.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},s.prototype.hideModal=function(){var t=this;this.$element.hide(),this.backdrop(function(){t.$element.trigger("hidden.bs.modal")})},s.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},s.prototype.backdrop=function(e){var s=this,o=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var i=t.support.transition&&o;if(this.$backdrop=t('<div class="modal-backdrop '+o+'" />').appendTo(this.$body),this.$element.on("mousedown.dismiss.bs.modal",t.proxy(function(t){t.target===t.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!e)return;i?this.$backdrop.one("bsTransitionEnd",e).emulateTransitionEnd(150):e()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var n=function(){s.removeBackdrop(),e&&e()};t.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",n).emulateTransitionEnd(150):n()}else e&&e()},s.prototype.checkScrollbar=function(){document.body.clientWidth>=window.innerWidth||(this.scrollbarWidth=this.scrollbarWidth||this.measureScrollbar())},s.prototype.setScrollbar=function(){var t=parseInt(this.$body.css("padding-right")||0,10);this.scrollbarWidth&&this.$body.css("padding-right",t+this.scrollbarWidth)},s.prototype.resetScrollbar=function(){this.$body.css("padding-right","")},s.prototype.measureScrollbar=function(){var t=document.createElement("div");t.className="modal-scrollbar-measure",this.$body.append(t);var e=t.offsetWidth-t.clientWidth;return this.$body[0].removeChild(t),e};var o=t.fn.modal;t.fn.modal=e,t.fn.modal.Constructor=s,t.fn.modal.noConflict=function(){return t.fn.modal=o,this},t(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(s){var o=t(this),i=o.attr("href"),n=t(o.attr("data-target")||i&&i.replace(/.*(?=#[^\s]+$)/,"")),a=n.data("bs.modal")?"toggle":t.extend({remote:!/#/.test(i)&&i},n.data(),o.data());o.is("a")&&s.preventDefault(),n.one("show.bs.modal",function(t){t.isDefaultPrevented()||n.one("hidden.bs.modal",function(){o.is(":visible")&&o.trigger("focus")})}),e.call(n,a,this)})}(jQuery);
/*olexonDialog*/
(function($){var olexonDialogHtml='<div class="modal fade" id="olexon-modal" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header clearfix"><h4 class="modal-title left" id="myModalLabel"></h4><button type="button"  class="close right closebtn" data-dismiss="modal">&times;</button></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn_silver left olexon-btn-default" data-dismiss="modal">关闭</button><button type="button" class="btn bg_red olexon-btn-primary">确定</button></div>';+'</div>';+'</div>';+'</div>';$.olexonDialog=function(content,options){var defaults={'title':'操作提示！','bakEvent':true,'okBtn':'确定','cancelBtn':'关闭','width':'auto','ok':null,'cancel':null};var settings=$.extend(defaults,options);if($('#olexon-modal').length==0){$('body').append(olexonDialogHtml)}var modal=$('#olexon-modal');modal.find('.modal-title').html(settings.title);modal.find('.modal-body').html(content);




if(settings.bakEvent){modal.find('.modal-footer .olexon-btn-default').text(settings.cancelBtn);modal.find('.modal-footer .olexon-btn-primary').text(settings.okBtn);modal.find('.modal-footer').show()}else{modal.find('.modal-footer').hide()}modal.find('.olexon-btn-primary').unbind('click').click(function(){if(settings.ok!=null){if(settings.ok()){modal.modal('hide')}}else{modal.modal('hide')}});modal.modal({'backdrop':'static'}).modal('show');

var vtop= ($(window).height()-$(".modal-content").height()) / 2;
$("#olexon-modal").css({top:vtop});
return true};$.olexonDialogClose=function(){$('#olexon-modal').modal('hide')}})(jQuery);
$(function() {
	olexon.load();
});
var __API__ = '/api.action';
var __AREA__ = '';
var __CATE__ = '';
var olexon = {
	load: function() {
		
		this.headerPositionBox();
		// this.initArea();
	
		CatePosition.load();
		__AREA__ = sessionStorage.getItem('__AREA__');
		__CATE__ = sessionStorage.getItem('__CATE__');
	},
	initArea: function() {
		var area = olexon.getCookie('area');
		if(area) {
			area = $.parseJSON(area);
			$('.olexon-my-area span').text(area.city_name);
		}
	},
	initLinkLoading: function() {
		// 选择区域
		$('.olexon-main a[href^="http"]').on('click',function(){olexon.waitTip();setTimeout(function(){olexon.waitTip(false);},1500)});
	},
	
	headerPositionBox: function() {
		$('.olexon-header-right a').on('click',function(e){var type=$(this).data('type');if(type){var position=$('.olexon-header-position-'+type);if(position.is(':hidden')){$('.olexon-header-position').css('display','none');position.css('display','block')}else{position.css('display','none')}}});
	},
	// 返回上一层页面
	historyBack: function(url) {
		if(!document.referrer) return window.location.href=url;
		window.history.back();
	},
	
	// 显示分类
	getolexonCate: function() {
		var option={'title':'分类','bakEvent':false,};olexon.waitTip();if(!__CATE__){$.get(__API__,{'c':'Main','a':'getMobileCate'},function(html){__CATE__=html;sessionStorage.setItem('__CATE__', html);$.olexonDialog(__CATE__,option);olexon.waitTip(false)})}else{$.olexonDialog(__CATE__,option);olexon.waitTip(false)}
	},

	// 分类筛选
	selectionCate: function(obj) {
		if($(".olexon-prod-select-btn").is('.current'))
			$(".olexon-prod-select-btn").removeClass('current');
		else
			$(".olexon-prod-select-btn").addClass('current');
		obj=obj||'#olexon-cate-search';olexon.waitTip();if($(obj).html().length<1){var cate='<em>×</em>';cate+='<div class="mt20 mb20"><div class="olexon-search">'+$('.olexon-search').html()+'</div><div class="olexon-cate-search-list"></div></div>';if(!__CATE__){$.get(__API__,{'c':'Main','a':'getMobileCate'},function(html){__CATE__=html;$(obj).html(cate+__CATE__)})}else{$(obj).html(cate+__CATE__)}setTimeout(function(){
			$(obj).find('em').click(function(){
				$(".olexon-header,.olexon-index").find('.olexon-prod-select-btn').trigger('click');
			});$(obj).find('#keyword').on('keyup change',function(){var keyword=$(this).val();var cate=[];if(!keyword){return $('.olexon-cate-search-list',$(obj)).html('')}$('.olexon-modal-cate a',$(obj)).each(function(){var c=$(this).text();if(c.toLowerCase().indexOf(keyword.toLowerCase())>-1){cate[$(this).index()]=[c,$(this).attr('href')]}var list='';if(cate.length>0){for(k in cate){list+='<a href="'+cate[k][1]+'">'+cate[k][0]+'</a></li>'}}else{list='<a href="javascript:void(0)">没有检索到分类</a>'}$('.olexon-cate-search-list',$(obj)).html(list)})})},300)}$(obj).toggleClass('hide');olexon.waitTip(false);if($(obj).is(':visible')){window.location.href="#screening"}/*setTimeout(function(){olexon.swapScroll('.olexon-prod-sort-item','.vanoon-top-action-index')},300)*/;
	},
	swapScroll: function(box, position) {
		var w_t=0;var offset=$(box).offset();$(window).scroll(function(){w_t=$(this).scrollTop();if(w_t>offset.top){$(position).css({"position":"fixed","z-index":"1000","top":"0"})}else{$(position).css({"position":"static"})}});
	},

	/**
	 * 提示
	 * @param tip 提示内容
	 * @param status 状态
	 * @param time 时间
	 */
	showTip: function(tip, status, time, callbak) {
		time=parseInt(time);if(!time||time<1){time=2;}status=parseInt(status)==1?'<i class="fa fa-check-circle-o"></i>':'<i class="fa fa-close"></i>';bakEvent=typeof callbak=='function'?true:false;var option={'title':'提示','bakEvent':bakEvent,'ok':callbak};tip='<div class="olexon-modal-tip clearfix">'+status+tip+'</div>';$.olexonDialog(tip,option);setTimeout(function(){$.olexonDialogClose()},time*1000);return;
	},
	Tip: function(tip, status, time, callbak) {
		time=parseInt(time);if(!time||time<1){time=2;}status=parseInt(status)==1?'<i class="fa fa-check-circle-o"></i>':'<i class="fa fa-close"></i>';bakEvent=typeof callbak=='function'?true:false;var option={'title':'提示','bakEvent':bakEvent,'ok':callbak};tip='<div class="olexon-modal-tip clearfix">'+status+tip+'</div>';$.olexonDialog(tip,option);setTimeout(function(){$.olexonDialogClose()},time*1000);return;
	},
	addCartTip: function(tip, status, time, callbak) {
		time=parseInt(time);if(!time||time<1){time=2;}status=parseInt(status)==1?'<i class="fa fa-check-circle-o"></i>':'<i class="fa fa-shopping-cart"></i>';bakEvent=typeof callbak=='function'?true:false;var option={'title':'提示','bakEvent':bakEvent,'ok':callbak};tip='<div class="olexon-modal-tip clearfix">'+status+tip+'</div>';$.olexonDialog(tip,option);setTimeout(function(){$.olexonDialogClose()},time*1000);return;
	},
	removeTip:function(tip, status, time, callbak){
		time=parseInt(time);if(!time||time<1){time=2;}status=parseInt(status)==1?'':'<i class="fa fa-close"></i>';bakEvent=typeof callbak=='function'?true:false;var option={'title':'提示','bakEvent':bakEvent,'ok':callbak};tip='<div class="olexon-modal-tip clearfix">'+status+tip+'</div>';$.olexonDialog(tip,option);setTimeout(function(){$.olexonDialogClose()},time*1000);return;
		
	},
	waitTip: function(status) {
		status === false? $('.olexon-wait-tip').addClass('hide'):$('.olexon-wait-tip').removeClass('hide');
	},
	// 验证数据
	validator: function(value, type) {
		var mobile=/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|18[0-9]{9}$/,email=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,date=/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/,pass=/^.{6,20}$/;if(!type){type=value.indexOf('@')>-1?'email':'mobile'}switch(type){case'mobile':return mobile.test(value);case'email':return email.test(value);case'date':return date.test(value);case'pass':return pass.test(value);default:return email.test(value)}
	},
	getOSAndBrowser: function() {
		var v={os:'pc',type:'pc',browser:''};var userAgent=navigator.userAgent.toLowerCase();do{if(userAgent.match(/ipad/i)=="ipad"){v={type:'apply',os:'ipad',};break;}if(userAgent.match(/iphone/i)=="iphone"){v={type:'apply',os:'iphone',};break;}if(userAgent.match(/midp/i)=="midp"){v={type:'java',os:'midp',};break;}if(userAgent.match(/rv:1.2.3.4/i)=="rv:1.2.3.4"||userAgent.match(/ucweb/i)=="ucweb"){v={type:'uc',os:'uc',browser:'uc'};break;}if(userAgent.match(/android/i)=="android"){v={type:'android',os:'android',};break;}if(userAgent.match(/windows ce/i)=="windows ce"){v={type:'windows',os:'windows ce',};break;}if(userAgent.match(/windows mobile/i)=="windows mobile"){v={type:'windows',os:'windows mobile',};break;}}while(false);do{if(userAgent.match(/webkit/i)=="webkit"){v.browser='webkit';break;}if(userAgent.match(/safari/i)=="safari"){v.browser='safari';break;}if(userAgent.match(/opera/i)=="opera"){v.browser='opera';break;}}while(false);return v;
	},
	getCookie: function(name){	 
		var cookieArray=document.cookie.split("; ");var cookie=new Object();for(var i=0;i<cookieArray.length;i++){var arr=cookieArray[i].split("=");if(arr[0]==name)return unescape(arr[1])}return"";
	},
	
	// 价格筛选
	priceFilter: function(obj) {
		var min = parseInt($('#priceMin').val(), 10);var max = parseInt($('#priceMax').val(), 10);
		if(isNaN(min) && isNaN(max)) { return alert('请输入筛选的价格！');}
		window.location.href = $(obj).data('url').replace('__PRICE__', min+','+max);
	},
}
/**
 * ==============
 * 分页定位
 * ==============
 */
var CatePosition = {
	detail:"#olexon-detail-scroll",
	widget: '.olexon-top-cate-scroll',
	box: '.olexon-top-cate-scroll .box',
	ul: '.olexon-top-cate-scroll ul',
	li: '.olexon-top-cate-scroll li.current',
	liWidth: function() {
		return $('li', this.ul).eq(0).outerWidth(true);
	},
	first: function() {
		return $('li', this.ul).first();
	},
	last: function() {
		return $('li', this.ul).last();
	},
	totalWidth: function() {
		return $('li', this.ul).length*this.liWidth();
	},
	boxWidth: function() {
		return $(this.box).width();
	},
	load: function(num) {
		
		if($(CatePosition.widget).length < 1) {
			return ;
		}
		this.srcoll(num);
		this.currentPositionRedress();
		$(CatePosition.ul).touchwipe({
			min_move_x: 20,
			min_move_y: 20,
			wipeLeft: function() {
				CatePosition.left();
			},
			wipeRight: function() {
				CatePosition.right();
			}
		});
	},
	srcoll: function(num) {
		num = num || $(CatePosition.widget).next('div').offset().top+100;
		detailNum =0;
		if($(CatePosition.detail).offset()!=null&&$(CatePosition.detail).offset()!='undefined'){
			
		detailNum = $(CatePosition.detail).offset().top;
	
		}
		$(window).bind("scroll", function() {
			$(this).scrollTop() > num? $('.olexon-top-cate-scroll').removeClass('vh'):$('.olexon-top-cate-scroll').addClass('vh');
			if($(CatePosition.detail).offset()!=null&&$(CatePosition.detail).offset()!='undefined'){
			$(this).scrollTop()>detailNum?$("#olexon-detail-scroll").addClass("olexon-detail-scroll"):$("#olexon-detail-scroll").removeClass("olexon-detail-scroll");
			}
		});
	},
	left: function() {
		if(CatePosition.last().position().left < CatePosition.boxWidth()) {
			var a = 0;
			if(CatePosition.last().position().left+CatePosition.liWidth() != CatePosition.boxWidth()) {
				a = (CatePosition.last().position().left-CatePosition.boxWidth()+CatePosition.liWidth())
			}
			a += 20;
			$(CatePosition.ul).animate({
				'margin-left': '-='+a
			}, 100+a, 'swing').animate({
				'margin-left': '+=20'
			}, 100, 'swing');
			return ;
		}
		$(CatePosition.ul).animate({
			'margin-left': '-=' + CatePosition.liWidth()
		}, 200, 'swing');
	},
	right: function() {
		if(CatePosition.first().position().left+ CatePosition.liWidth() > 0) {
			if(CatePosition.first().position().left != 0) {
				$(CatePosition.ul).animate({
					'margin-left': 0
				}, 100, 'swing');
			}
			$(CatePosition.ul).animate({
				'margin-left': '+=20'
			}, 100, 'swing').animate({
				'margin-left': '-=20'
			}, 100, 'swing');
			return ;
		}
		$(CatePosition.ul).animate({
			'margin-left': '+=' + CatePosition.liWidth()
		}, 200, 'swing');
	},
	// 当前菜单位置矫正
	currentPositionRedress: function() {
		if($(CatePosition.li).length < 1) return ;
		var liPosition = $(CatePosition.li).position();

		if(liPosition.left+CatePosition.liWidth() > CatePosition.boxWidth()) {
			var next = $(CatePosition.li).next('li');
			if(next.length == 0) {
				$(CatePosition.ul).animate({
					'margin-left': '-=' + (liPosition.left-CatePosition.boxWidth()+CatePosition.liWidth())
				}, 200, 'swing');
			} else {
				$(CatePosition.ul).animate({
					'margin-left': '-=' + (next.position().left-CatePosition.boxWidth()+CatePosition.liWidth())
				}, 200, 'swing');
			}
		}
	}
};



/**
 * 商品列表（同类商品切换）
 */
function prodListItem(obj) {
	if(!obj) obj = $('.pres-list');

	$('.proitem', obj).each(function(){
		var that=$(this);
		// 列表换大图颜色
		var li=$('.proitem-sku>em',$(this));
		li.click(function(){
			$(this).addClass('on').siblings().removeClass('on');
			var json=$(this).attr("data-rel");
			json=json.replace(/_#_/g,'"');
			json=eval('('+json+')');
			$('.img-sku',that).attr('src','http://u.img.olexon.net/'+json.pic_i); // 改变大图URL
			var url=json.url;
			that.find(".proitem-img").attr("href",url);
			that.find(".proitem-img img").attr("src",'http://u.img.olexon.net/'+json.pic_i);
			that.find(".prod-name").html('<a href="'+url+'" target="_blank">'+json.prodName+'</a><br /><span >款号:'+json.prodNo+'</span>');
			that.find(".proitem-price").html('￥'+json.NewPrice)
				.end().children("del").html('￥'+json.oldPrice);

		});
	});


}