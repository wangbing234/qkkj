$(function(){ 
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
		 
		//排列li显示4个
		var li_z = $(".ppli_4 li").length; 	
 for(var i=1 ;i<=li_z; i++){
		 if(i%4==0){
				//alert(i);
				$(".ppli_4 li").eq(i-1).addClass("cl_right");
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
			
 //左边点击显示隐藏
	$(".left_nav li .wdlc").click(function(){
		$(this).find(".jt").addClass("jt_xz").parent(".wdlc").parent("li").siblings().find(".jt").removeClass("jt_xz");
		$(this).parent("li").find(".left_ejdh").show().parent("li").siblings().find(".left_ejdh").hide();
		});
		
		
})