$(function(){
	
	//登陆效果
	$(".dl_but").click(function(){
		$(".tip_dlkk_box").show(); 	
		});
		$(".tip_dlbj").click(function(){
		$(".tip_dlkk_box").hide(); 	
		});
		
		//设计师信息显示隐藏
		$(".user_tx").hover(function(){
			$(this).children(".user_info_box").show();
			},function(){
				$(this).children(".user_info_box").hide();
				});
				
				//滚动显示
		$(window).scroll(function(){
		   var win_scroll = $(this).scrollTop();
		  if(win_scroll>=500){
			$(".goto").fadeIn(500);
		}else {$(".goto").fadeOut(500);
		} 
		});
		
		 //返回顶部 
		$(".goto").click(function(){
			$("html,body").animate({scrollTop: 0},800);
		}); 
		
	  //banner区域开始
	$(".focus").hover(function(){
		$(this).find(".prev,.next").fadeTo("show",1);
	},function(){
		$(this).find(".prev,.next").hide();
	})
	$(".prev,.next").hover(function(){
		$(this).fadeTo("show",1);
	},function(){
		$(this).fadeTo("show",0.1);
	})
	$(".focus").slide({
		titCell:".num ul",
		mainCell:".focuspic",
		effect:"left", //fade：渐显；|| left：左滚动；|| fold：淡入淡出
		autoPlay:true,
		delayTime:700,
		autoPage:true
	});
	//banner区域结束
	
		//排列li显示4个
		var li_z = $(".ppli_4 li").length; 	
 for(var i=1 ;i<=li_z; i++){
		 if(i%4==0){
				//alert(i);
				$(".ppli_4 li").eq(i-1).addClass("cl_right");
				} 
		}
		
		//排列li显示2个
		var li_z = $(".ppli_2 li").length; 	
 for(var i=1 ;i<=li_z; i++){
		 if(i%2==0){
				//alert(i);
				$(".ppli_2 li").eq(i-1).addClass("cl_right");
				} 
		}
		
			//弹出框
	$(".tjzl").click(function(){
		$(".ny_tip_box").show(); 	
		});
		$(".nytip_bj").click(function(){
		$(".ny_tip_box").hide(); 	
		});
		
		//展开收起
		$(".gdny_more").click(function(){
			$(".xxqaq_box").hide();
			$(".xxqaq_box_xx").show();
			});
				$(".gdny_sqsq").click(function(){
					$(".xxqaq_box_xx").hide();
			  $(".xxqaq_box").show();			
			});
			
			
			//表单优化/////////////////////////////
  $(".select").each(function(){  
		var s=$(this);
		var z=parseInt(s.css("z-index"));
		var dt=$(this).children("dt");
		var dd=$(this).children("dd");
		var _show=function(){dd.slideDown(200);dt.addClass("cur");s.css("z-index",z+1);};   //展开效果
		var _hide=function(){dd.slideUp(200);dt.removeClass("cur");s.css("z-index",z);};    //关闭效果
		dt.click(function(){dd.is(":hidden")?_show():_hide();});
		dd.find("a").click(function(){dt.html($(this).html());_hide();});     //选择效果（如需要传值，可自定义参数，在此处返回对应的"value"值 ）
		$("body").click(function(i){ !$(i.target).parents(".select").first().is(s) ? _hide():"";});
	})			
	
	//左右高度一样
	var left_h = $(".js_height_l").height();
	var right_h = $(".js_height_r").height();
	//alert(right_h);
	if(left_h >= right_h){
		$(".js_height_r").css({"height":left_h});
		}else{
			$(".js_height_l").css({"height":right_h});
			}
		
		
		
})