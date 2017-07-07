var olexonWap={};
olexonWap={
base:{
	showWapTip:function(opt){
		var opt = $.extend({
			msg:'',
			title:'',
			autoHide:false,
			time:800,
			isOkButton:false,
			okButtonTxt:'知道了',
			button:null,
			type:'tip',
			confirmCallback:null,
			confirmButton:'确定',
			isCloseButton:true
		},opt||{});
		var str='<div class="waptip"><div class="hd">'+opt.title+'</div><div class="bd"></div><div class="ft"></div></div>';
		$('body').append(str);
		var waptip = $('.waptip'),bd =$('.waptip .bd'),ft=$('.waptip>.ft');
		bd.html(opt.msg);
		if(opt.button){
			ft.append(opt.button);
		}				
		if(opt.type=='tip'){
			if(opt.isOkButton){
				ft.append('<span class="btn_org" id="closeTip">'+opt.okButtonTxt+'</span>');
			}
		}
		if(opt.type=='confirm'){
			ft.append('<span class="btn_org" id="waptip_confirmok">'+opt.confirmButton+'</span>');
			if(opt.isCloseButton){
				ft.append('<span class="btn_org" id="closeTip">取消</span>');
			}
			if(opt.confirmCallback){
				$('#waptip_confirmok').click(function(){
					opt.confirmCallback();
				});
			}
		}
		//关闭
		$('#closeTip').on('click',function(){
			waptip.remove();
		});
		
		waptip.css('margin-top',-waptip.height()/2);
		//按钮
		
		//自动消失
		if(opt.autoHide){
			setTimeout(function(){								
				waptip.remove();
			},opt.time);
		}
	}
  }
}