/**
 * ++++++++++++++++++++++++++
 * 商品详细页JS
 * ++++++++++++++++++++++++++
 */
 var detailShowBtn = $(".olexon-prod-detail-show-btn");
$(function() {

	// 产品图全屏展示
	baguetteBox.run('.olexon-banner-scroller', {
		animation: 'fadeIn',
	});
	$('.olexon-prod-pic a').click(function() {
		olexon.waitTip(false);
	})

});
function showProdDetail() {
	$('#olexon-tab-box').removeAttr('style');
	detailShowBtn.hide(300);
	window.location.href="#prod-detail";
}


// 产品评论
function prodCommentHtml(comment, data){
	var li = '';
	
	if(data.list.length < 1) {
		
		li = '<li class="p10"><div class="olexon-nothing"><i class="fa fa-comments"></i><p>没有评论....</p></div></li>';
	} else {
		var list = data.list;
		for(k in list) {
			list[k]['anonymous'] = list[k]['anonymous'] != '0'? '(匿名)':'';
			list[k]['typeName'] = list[k]['type'] == '3'? '差评':(list[k]['type'] == '2'? '中评':'好评');
			li += '<li class="p10"><p class="clearfix"><span class="left level level-'+list[k]['level']+'">'+list[k]['nickName']+list[k]['anonymous']+'：</span></p><p class="content">'+list[k]['content']+'</p>';
			// 标签
			if(list[k]['tag']) {
				li += '<p class="tag clearfix">';
				for(i in list[k]['tag']) {
					li += '<span>'+list[k]['tag'][i]+'</span>';
				}
			}
			li += '<p class="clearfix"><span class="left type">('+list[k]['typeName']+')</span><span class="left star star-'+list[k]['type']+'"></span><span class="right">'+list[k]['createTime']+'</span></p>';
			li += '<i class="fa fa-thumbs-up" onclick="prodCommentNice(this, '+list[k]['id']+')" title="点赞"></i>';
			li += '</li>';
		}
	}
	comment.find('.list').html(li);
}
// 产品评论点赞
function prodCommentNice(obj, id) {
	olexon.waitTip();
	$.getJSON(__API__, {'c':'Product', 'a':'prodCommentNice', 'id': id}, function(data) {
		switch (data.status) {
			case 0:
				olexon.showTip(data.info);
				break;
			case 1:
				$(obj).addClass('on');
				break;
			case 2:
				$(obj).removeClass('on');
				break;
		}
		olexon.waitTip(false);
	});
}
function specaction(){
	
	// 选择尺码

	
	var specJsonStringVal = $("#specJsonString").val();

	//如果规格存在
	if(specJsonStringVal && specJsonStringVal.length>0){
		console.log("specJsonStringVal = " + specJsonStringVal);
		var specJsonStringObject = eval('('+specJsonStringVal+')');
		
		for(var i=0;i<specJsonStringObject.length;i++){
			console.log("颜色specJsonStringObject = " + specJsonStringObject[i].specColor);
		
		}

		//规格被点击，则标记选中和不选中
		

		
		
		$("#specDiv li").click(function(){
			
			
			console.log("specDiv规格被点击。" + $(this).hasClass("on"));
			if($(this).hasClass("specNotAllowed")){
				console.log("由于规格被禁用了，直接返回。");
				return;
			}
			
			$(this).parent().find("li").not(this).each(function(){
				$(this).removeClass("on");
				$(this).attr("disabled","disabled");
				
			});
			if($(this).is(".on")){
				console.log("removeClass on");
				$(this).removeClass("on");
				
				//如果当前点击的是尺寸，则释放所有的颜色的禁用状态；如果点击的是颜色，则释放所有的尺寸禁用状态
				
				 if($(this).parent().attr("id")=="specColor"){
						console.log("当前点击的是颜色。");
						
						//释放所有颜色的鼠标禁用状态
						$("#specSize li").each(function(){
							
							$(this).removeClass("specNotAllowed");
							
							$(this).removeClass("on");
						});
					}
				else{
					console.log("当前点击的是尺码");
					resetProductInfo();
					return ;
				}
			}else{
				
				
				
				console.log("addClass on");							
				$(this).addClass("on");
			}
			
		
			
			var parentID = $(this).parent().attr("id");
			console.log("parentID = " + parentID);
			
		
			
			if($("#specSize li").hasClass("on") && $("#specColor li").hasClass("on")){
		
				console.log("都选中了。");
				
				console.log("选中的文本："+$("#specSize .on").html());
				//找出对应的规格
				for(var i=0;i<specJsonStringObject.length;i++){
					var specItem = specJsonStringObject[i];
					if(specItem.specSize==$("#specSize .on").html() 
							&& specItem.specColor==$("#specColor .on").attr("data-value")){
						console.log("找到了规格对象。");
						
						$("#nowPrice").text(specItem.specPrice);
						//$("#stock_span_id").text(specItem.specStock);
						$("#specIdHidden").val(specItem.id);
						console.log("选中的规格ID="+$("#specIdHidden").val());
						break;
					}
				}
				//specNotAllowed
			}else if($("#specColor li").hasClass("on")){
				resetProductInfo();
			
				//颜色被选中了一个，则将于该颜色不匹配的尺寸禁用掉。
				console.log("颜色被选中了一个，则将于该颜色不匹配的尺寸禁用掉。");
				
				//找出对应的规格
				var sizeArr = [];//与选中的规格相匹配的颜色集合
				for(var i=0;i<specJsonStringObject.length;i++){
					var specItem = specJsonStringObject[i];
					if(specItem.specColor==$("#specColor .on").attr("data-value")){
					
						if(specItem.specStock>0){
						sizeArr.push(specItem.specSize);
						}
						
					}
				}
				
				//释放所有颜色的鼠标禁用状态
				$("#specSize li").each(function(){
					$(this).removeClass("on");
					$(this).removeClass("specNotAllowed");
				
				});
				
				//找出于选择的尺寸不匹配的颜色，将其禁用掉。
				for(var i=0;i<specJsonStringObject.length;i++){
					var specItem = specJsonStringObject[i];
					var hanFind = false;
					for(var j=0;j<sizeArr.length;j++){
						if(specItem.specSize==sizeArr&&specItem.specStock>0){
						
							hanFind = true;
							break;
						}
					}
					
					if(!hanFind){
						console.log("禁掉的尺寸有："+specItem.specSize);
               
						$("#specSize li").each(function(){
							
							console.log("text="+$(this).text());
							
							if($(this).text()==specItem.specSize){
								console.log("找到了。");
								  
								$(this).addClass("specNotAllowed");
								return false;
							}
						});
					}
				}
				
			}else if($("#specSize li").hasClass("on")){
				resetProductInfo();
				//尺寸被选中了一个，则将于该尺寸不匹配的颜色禁用掉。
				console.log("尺寸被选中了一个，则将于该尺寸不匹配的颜色禁用掉。");
				//找出对应的规格
				var colorArr = [];//与选中的规格相匹配的颜色集合
				for(var i=0;i<specJsonStringObject.length;i++){
					var specItem = specJsonStringObject[i];
					if(specItem.specSize==$("#specSize .on").html()){
						colorArr.push(specItem.specColor);
					}
				}
				
				//释放所有颜色的鼠标禁用状态
				$("#specColor li").each(function(){
					$(this).removeClass("specNotAllowed");
					$(this).removeClass("on");
				});
				
				//找出于选择的尺寸不匹配的颜色，将其禁用掉。
				for(var i=0;i<specJsonStringObject.length;i++){
					var specItem = specJsonStringObject[i];
					var hanFind = false;
					for(var j=0;j<colorArr.length;j++){
						if(specItem.specColor==colorArr[j]){
							hanFind = true;
							break;
						}
					}
					
					if(!hanFind){
						console.log("禁掉的颜色有："+specItem.specColor);
						
						$("#specColor li").each(function(){
							console.log("text="+$(this).text());
							if($(this).text()==specItem.specColor){
								console.log("找到了。");
								$(this).addClass("specNotAllowed");
								return false;
							}
						});
					}
				}
				
			}else{
				console.log("都没选中。");
				resetProductInfo();
			}
			if(parentID=="specColor"){
				resetProductInfo();
				
				//颜色被选中了一个，则将于该颜色不匹配的尺寸禁用掉。
				console.log("颜色被选中了一个，则将于该颜色不匹配的尺寸禁用掉。");
				
				//找出对应的规格
				var sizeArr = [];//与选中的规格相匹配的颜色集合
				for(var i=0;i<specJsonStringObject.length;i++){
					var specItem = specJsonStringObject[i];
					if(specItem.specColor==$("#specColor .on").attr("data-value")){
						if(specItem.specStock>0){
						sizeArr.push(specItem.specSize);
						}
					}
				}
				
				//释放所有颜色的鼠标禁用状态
				$("#specSize li").each(function(){
					$(this).removeClass("on");
					$(this).removeClass("specNotAllowed");
				
				});
				
				//找出于选择颜色的不匹配尺寸，将其禁用掉。
				for(var i=0;i<specJsonStringObject.length;i++){
					var specItem = specJsonStringObject[i];
					var hanFind = false;
					for(var j=0;j<sizeArr.length;j++){
					
						if(specItem.specSize==sizeArr[j]){
							hanFind = true;
							break;
						}
					}
					
					if(!hanFind){
						console.log("禁掉的尺寸有："+specItem.specSize);
						
						$("#specSize li").each(function(){
							console.log("text="+$(this).text());
							if($(this).text()==specItem.specSize){
								console.log("找到了。");
							
								$(this).addClass("specNotAllowed");
								return false;
							}
						});
					}
				}
				
				
			}
			
		});
			
		
	}
	
	
	
	
	
	// 购买数量
	$('.buynum').change(function() {
		
		var num = parseInt($(this).val());
		if(isNaN(num)){
			$('.buynum').val(1)
		
		}
		

		if(num < 1) {
			return $(this).val(1);
		}
	
		$('.buynum').val($(this).val());
		
		return true;
	});
	// 增加数量
	$('.olexon-prod-num .add').click(function() {
		var size = $('.olexon-prod-size-list li.on');

		var obj = $('.buynum');
		
		var num = parseInt(obj.val());
	
		if(num < 1) num = 1;

		num++;
		obj.val(num);
		obj.trigger('change');
	});
	// 减少数量
	$('.olexon-prod-num .reduce').click(function() {
		var size = $('.olexon-prod-size-list li.on');
	
		var obj = $('.buynum');
		var num = parseInt(obj.val());
		num--;
		if(num < 1) num = 1;
		obj.val(num);
		obj.trigger('change');
	});
	
	
}
