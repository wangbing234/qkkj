/*
*
* 作者：高雄    时间：2016.07.19 19:34
*
* Mobile:13916654519 Mail:gaoxiong513@126.com
*
* Description：用于首页
*
*/
var ibt = 0,
    ibn = 0,
    ibcount = 0;
function ibChangeFocus() {
    ibn = ibn >= (ibcount - 1) ? 0 : ++ibn;
    $(".indexs a").eq(ibn).trigger('click');
}
var t = 0,
    n = 0,
    count = 0;
function changeFocus() {
    n = n >= (count - 1) ? 0 : ++n;
    $(".iden a").eq(n).trigger('click');
}
(function ($) {
    $.fn.indexNew = function (p) {
        var publicMethods = {
        };
        if (typeof p == 'string') {
            if (publicMethods[p]) {
                var args = $.makeArray(arguments).slice(1);
                return publicMethods[p].apply(this, args);
            } else return false;
        }
        p = $.extend(true, {
            uploadFileUrl: false,
            serachparam: { title: '', pageNo: 1, pageSize: 15, isonline: true, order: 'createDate:desc' }
        }, p || {});
        return this.each(function () {
            var container = $(this);
            var g = {
                _initFrame: function () {
                    g.initrzb();
                    g.initMaxBanner();
                },
                initMaxBanner: function () {
                    var maxbanner = $('.maxbanner', container),
                        items = $('.items', maxbanner),
                        indexs = $('.indexs', maxbanner);
                    ibcount = $('>a', indexs).length;
                    var itemsw = $(maxbanner).width();
                    $(indexs).width(itemsw);
                    $('a', items).width(itemsw);
                    var tw = ibcount * itemsw + 100;
                  
                    $(items).width(tw);
                    $('a', indexs).on('click', function () {
                        var i = parseInt($(this).attr('index')) - 1,
                            ibn = i;
                        if (i >= ibcount) return;
                        var targetleft = itemsw * ibn;
                        $(items).animate({ left: (-targetleft) + 'px' });
                        $(this).css({ "background": "#cf6108" }).siblings().css({ "background": "#282d30" });
                    });
                    $(maxbanner).hover(function () {
                        clearInterval(ibt);
                    }, function () {
                        ibt = setInterval("ibChangeFocus()", 4000);
                    });
                    ibt = setInterval("ibChangeFocus()", 4000);
                },
                initrzb: function () {
                    var rzb = $('.rzb', container),
                        items = $('.items', rzb);
                    count = $('>a', items).length;
                    if (count % 4 != 0) {
                        count = parseInt(count / 4) + 1;
                    } else {
                        count = parseInt(count / 4);
                    }
                    var itemsw = $(rzb).width();
                    var tw = count * itemsw;
                    $(items).width(tw);
                    if ($('>a', items).length > 4) {
                        var itsh = items.html();
                        $(items).append(itsh);
                        $(items).width(tw * 2);
                    }
                    var iden = $('.iden', rzb);
                    for (var j = 1; j <= count; j++) {
                        $(iden).append('<a index="' + j + '"></a>');
                    }
                    $('a', iden).on('click', function () {
                        var i = parseInt($(this).attr('index')) - 1,
                            n = i;
                        if (i >= count) return;
                        var targetleft = itemsw * n;
                        $(items).animate({
                            left: -targetleft + 'px'
                        });
                        $(this).css({ "background": "#cf6108" }).siblings().css({ "background": "#282d30" });
                    });
                    $(rzb).hover(function () {
                        clearInterval(t);
                        $(this).trigger('click');
                    }, function () {
                        t = setInterval("changeFocus()", 4000);
                    });
                    t = setInterval("changeFocus()", 4000);
                }
            };
            g._initFrame();
        });
    };
})(jQuery);