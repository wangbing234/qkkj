/**
 * ==============
 * olexon MOBILE V3
 * ==============
 */
$(function() {
	$("#fbox-top").click(function() {
		$("html, body").animate({ scrollTop: 0 }, 100);
	});
	olexonMobileV3.load();
});
var olexonMobileV3 = {
	load: function() {
		
	},


	// 显示分类
	getolexonCate: function(type) {
		olexon.waitTip();
		
		if(!'__CATE_'+type+'__') {
			$.get(__API__, {'c':'Main','a':'getMobileCate', 'type':type}, function(html) {
				
				__CATE__ = html;
				
				 sessionStorage.setItem('__CATE_'+type+'__', html);
				
                if(type=='home')
                    olexonMobileV3.dialogHome('分类', __CATE__);
                else
				    olexonMobileV3.dialog('分类', __CATE__);
				olexon.waitTip(false);
			})
		} else {
			olexonMobileV3.dialog('分类', __CATE__);
			olexon.waitTip(false);
		}
	},
	// 切换
	toggleCateHandle: function(obj) {
		var li = $(obj).parents('li');
		var ul = li.parent('ul');
		var span = $('span', li);
        ul.find('strong').removeClass('current');
		if(span.is(':hidden')) {
			ul.find('li span').hide();
			ul.find('i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
            $(obj).addClass('current');
			span.css({'display': 'block'});
			$(obj).find('i').removeClass('fa-plus-circle').addClass('fa-minus-circle');
		} else {
			span.hide(50);
			$(obj).find('i').removeClass('fa-minus-circle').addClass('fa-plus-circle');
		}
	},
	selectItem:function(obj){
		if($(obj).attr('class')=='select')
			$(obj).parent().find("em").removeAttr('class');
		else
			$(obj).addClass('select');
	},
	resetButton:function(){
		$(".olexon-sub-item em").removeClass('select');
		$(".olexon-sub-item input").val('');
	},
	toggleButton:function(type){
		if(type=='close')
			$(".condition-search").hide();
		else
			$(".condition-search").show();
	},

	inArray:function (needle,array,bool){
	if(typeof needle=="string"||typeof needle=="number"){
			for(var i in array){
				if(needle===array[i]){
					if(bool){
						return i;
					}
					return true;
				}
			}
			return false;
		}
	},
	showTop:function(){
		$('#olexon-top-cate-scroll').removeClass('vh').show();
		
	},

    dialogHome: function(tip, content) {
    	 
        var dialog = $('.olexon-home');
      
        var body = $('.olexon-home-body', dialog);
     
        var title = $('.olexon-dialog2-title', dialog);
        var h,w,_h;
        $(".baguetteBox-overlay").show();
        // box
       
        if(body.length < 1) {
        	
            $('body').append('<div  class="visible baguetteBox-overlay" style="display:block"><div class="olexon-home"><div class="olexon-home-box"><div class="olexon-home-body"></div><i class="fa fa-times-circle"></i></div></div></div>');
            dialog = $('.olexon-home');
            body = $('.olexon-home-body', dialog);
            // 隐藏事件
            $('.fa-angle-up,.fa-times-circle', dialog).click(function() {
                setTimeout(function() {
                    dialog.removeAttr('style');
					dialog.find('span').hide();
					$(".baguetteBox-overlay").hide();
                }, 200);
                return dialog.animate({'top' : '-'+dialog.height()}, 100);
            });
        }
        // 隐藏
        if(dialog.is(':visible') && title.text() == tip) {
            return $('.fa-angle-up', dialog).trigger('click');
        }
        tip? title.text(tip).css({'display':'block'}):title.text(tip).css({'display':'none'});
        body.html(content);
        h = dialog.height();
        w = dialog.width()/2;
        _h = $(window).height()-70;
        //
        dialog.css({'top': '-'+ h +'px', 'display': 'block', 'margin-left': '-'+w+'px'});
        body.css({'max-height': _h+'px'});
        //
        $(window).resize(function() {
            w = dialog.width()/2;
            _h = $(window).height()-70;
            dialog.css({'margin-left': '-'+w+'px'});
            body.css({'max-height': _h+'px'});
        });
        // 动画效果
        return dialog.animate({'top' : 45,}, 150);
    },
	// Dialog
	dialog: function(tip, content) {
		var dialog = $('.olexon-dialog2');
		var body = $('.olexon-dialog2-body', dialog);
		var title = $('.olexon-dialog2-title', dialog);
		var h,w,_h;
		// box
		if(body.length < 1) {
			$('body').append('<div class="olexon-dialog2"><div class="olexon-dialog2-box"><h3 class="olexon-dialog2-title">提示</h3><div class="olexon-dialog2-body"></div><i class="fa fa-angle-up"></i><i class="fa fa-times-circle"></i></div></div>');
			dialog = $('.olexon-dialog2');
			body = $('.olexon-dialog2-body', dialog);
			title = $('.olexon-dialog2-title', dialog);
			// 隐藏事件
			$('.fa-angle-up,.fa-times-circle', dialog).click(function() {
				setTimeout(function() {
					dialog.removeAttr('style');
				}, 200);
				return dialog.animate({'top' : '-'+dialog.height()}, 100);
			});
		}
		// 隐藏
		if(dialog.is(':visible') && title.text() == tip) {
			return $('.fa-angle-up', dialog).trigger('click');
		}
		tip? title.text(tip).css({'display':'block'}):title.text(tip).css({'display':'none'});
		body.html(content);
		h = dialog.height();
		w = dialog.width()/2;
		_h = $(window).height()-70;
		// 
		dialog.css({'top': '-'+ h +'px', 'display': 'block', 'margin-left': '-'+w+'px'});
		body.css({'max-height': _h+'px'});
		// 
		$(window).resize(function() {
			w = dialog.width()/2;
			_h = $(window).height()-70;
			dialog.css({'margin-left': '-'+w+'px'});
			body.css({'max-height': _h+'px'});
		});
		// 动画效果
		return dialog.animate({'top' : 0,}, 150);
	},
	// closeDialog
	closeDialog: function() {
		$('.olexon-dialog2 .fa-angle-up','').trigger('click');
	}
}
