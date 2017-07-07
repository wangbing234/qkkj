/*
*
* 作者：高雄    时间：2016.08.18 16:27
*
* Mobile:13916654519 Mail:gaoxiong513@126.com
*
* Description：用于手机端扶贫认种页面
*
*/
(function ($) {
    $.fn.toPlant = function (p) {
        var publicMethods = {
        };
        if (typeof p == 'string') {
            if (publicMethods[p]) {
                var args = $.makeArray(arguments).slice(1);
                return publicMethods[p].apply(this, args);
            } else return false;
        }
        p = $.extend(true, {
        }, p || {});
        return this.each(function () {
            var container = $(this);
            var g = {
                _initFrame: function () {
                    g.setEvent();
                },
                setEvent: function () {
                    var rzzj = $('#rzzj', container);
                    $('.close', rzzj).on('click', function () {
                        if (!$(rzzj).hasClass('showerror')) {
                            $(rzzj).hide();
                            $('.mask', container).remove();
                        }
                    });
                    $('#btnsubmit', rzzj).on('click', function () {
                        if ($(rzzj).hasClass('showerror')) {
                            return false;
                        }
                    });
                    $('.form_goods_box', container).each(function () {
                        var itempanel = $(this);
                        $('.form_goods_input', itempanel)
                            .on('keyup', function () {
                                var pn = $(this).val();
                                $(this).val(pn.replace(/[^\d]/g, '') || 1);
                                $(this).trigger('change');
                            })
                            .on('change', function () {
                                var pn = parseInt($(this).val()),
                                    unitprice = parseFloat($(this).attr('unitprice'));
                                var pe = eval(pn + '*' + unitprice);
                                $('input[name="price"]', itempanel).val(pe);
                                $('.form_goods_price', itempanel).html('￥' + pe).attr('price', pe);
                                var checkmax = $(this).attr('checkmax');
                                if (checkmax) {
                                    var maxprice = parseFloat($('#' + checkmax, container).val());
                                    var totalprice = 0;
                                    $('.form_goods_price', rzzj).each(function (i, fgp) {
                                        console.log($(fgp).attr('price'));
                                        totalprice += parseFloat($(this).attr('price') || 0);
                                    });
                                    if (maxprice < totalprice) {
                                        $(rzzj).addClass('showerror');
                                    } else {
                                        $(rzzj).removeClass('showerror');
                                    }
                                }
                            });
                        $('.form_goods_minus', itempanel).on('click', function () {
                            var formgoodscount = $(this).parent();
                            var plantNum = $('.form_goods_input', formgoodscount);
                            var pn = parseInt($(plantNum).val());
                            if (pn > 0) {
                                pn = pn - 1;
                            }
                            $(plantNum).val(pn);
                            $('.form_goods_input', itempanel).trigger('change');
                        });
                        $('.form_goods_plus', itempanel).on('click', function () {
                            var formgoodscount = $(this).parent();
                            var plantNum = $('.form_goods_input', formgoodscount);
                            var pn = parseInt($(plantNum).val());
                            pn = pn + 1;
                            $(plantNum).val(pn);
                            $('.form_goods_input', itempanel).trigger('change');
                        });
                        $('input[name="submit"]', itempanel).on('click', function () {
                        });
                        $('#testsubmit', itempanel).on('click', function () {
                            var mask = $('.mask', container);
                            if (mask.length === 0) {
                                $(container).append('<div class="mask"></div>');
                            }
                            var showTarget = $(rzzj).show();
                            var ww = $(window).width();
                            var wh = $(document).height();
                            var dt = $(document).scrollTop();
                            var left = (ww - $(showTarget).width()) / 2;
                            var sth = $(showTarget).height();
                            var top = 0;
                            if (wh > (sth + dt)) {
                                top = (wh - sth) / 2;
                            } 
                            $(showTarget).css({ 'top': top + 'px', 'left': left + 'px', 'right': left + 'px' });
                        });
                    });

                }
            };
            g._initFrame();
        });
    };
})(jQuery);