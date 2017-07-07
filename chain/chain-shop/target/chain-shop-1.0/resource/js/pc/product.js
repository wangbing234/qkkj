/**
 * 商品javascript，对购买商品的一些控制和提示
 * 
 */
function removeCartProd(obj,pid){
	
	
	var _result = "是否从购物车中移除此商品？";
	  olexon.removeTip(_result,1,2000,function(){
		  
			var _obj = $(obj).parent().find(".inputBuyNum");
			
			
			var _url = "/cart/delete.html?id="+pid;
			$.ajax({
			  type: 'POST',
			  url: _url,
			  data: {},
			  success: function(data){
				
				if(data.result==0){
				
					
					 olexon.showTip('删除成功',1);
					 
					 $("#product"+pid).remove();
					 
					 $(".total0").text(data.total);
					  if(addrids!=""){
						  selectAdd(addrids);
					  
					  }
					 
					    if($("#payCode")!=null){
						$("#payCode").val("");
						$("#show_pay_ul").find("a").removeClass("lalx");
					    }
					
					 if(data.total=="0.00"){
						 window.location.href="/cart/cart.html";
					 }
					
				}else{
		
					
					//$("a[name=stockErrorTips]").attr("data-original-title",data.tips).tooltip('show');
					olexon.showTip('删除失败');
				}
			  },
			  dataType: "json",
			  error:function(e){
				
				  
					olexon.showTip('删除失败！请联系客服寻求解决办法。');
					return false;
				
			  }
			});

		  
	  });
	  return false;



	
}
//增加购买商品数
function addFunc(obj,notifyCartFlg){
	var _obj = $(obj).parent().parent().find("#inputBuyNum");
	var quantity = _obj.text();
	//console.log("_obj="+_obj+",notifyCartFlg="+Flg+",quantity="+quantity+",pid="+_obj.attr("pid"));
	if (/^\d*[1-9]\d*$/.test(quantity)) {
		_obj.text(parseInt(quantity) + 1);
	} else {
		_obj.text(1);
	}
	if(notifyCartFlg){
		notifyCart(_obj);
	}
}
//减少购买商品数
function subFunc(obj,notifyCartFlg){
	var _obj = $(obj).parent().parent().find("#inputBuyNum");
	var quantity = _obj.text();
	if (/^\d*[1-9]\d*$/.test(quantity)) {
		if(quantity>1){
			_obj.text(parseInt(quantity) - 1);
		}else{
			_obj.text(1);
		}
	} else {
		_obj.val(1);
	}
	
	//console.log("notifyCartFlg="+notifyCartFlg);
	if(notifyCartFlg){
		notifyCart(_obj);
	}
}
//判断是否是正整数
function IsNum(s)
{
    if(s!=null){
        var r,re;
        re = /\d*/i; //\d表示数字,*表示匹配多个数字
        r = s.match(re);
        return (r==s)?true:false;
    }
    return false;
}
//键盘按下的时候对字符进行检查，只能是数字
$("input[name=inputBuyNum]").keydown(function(event) {
	var key = event.keyCode ? event.keyCode : event.which;
	//console.log("key="+key+",value="+_obj.val()+"isNaN="+isNaN(_obj.val())+",IsNum="+IsNum(_obj.val()));
	if ((key >= 48 && key <= 57) || key==8) {
	//if (IsNum(_obj.val())) {
		var _obj = $(this);

		//库存字符检查
		if($.trim(_obj.val())=='' || parseInt(_obj.val())<=0){
			_obj.val("1");
		}
		checkStockFunc();
		return true;
	} else {
		return false;
	}
});

//键盘抬起来的时候对库存进行检查
$("input[name=inputBuyNum]").keyup(function(event) {
	var key = event.keyCode ? event.keyCode : event.which;

	if ((key >= 48 && key <= 57) || key==8) {
		var _obj = $(this);
		if($.trim(_obj.val())=='' || parseInt(_obj.val())<=0){
			_obj.val("1");
		}
		checkStockFunc();

		var _pid = _obj.attr("pid");

		if(_pid){
			notifyCart(_obj);
		}
		return true;
	} else {
		return false;
	}
});

//检查库存是否超出数量
function checkStockFunc(){
	
	
	return true;
}

//通知购物车
function notifyCart(_obj){
	var _url = "/cart/notifyCart.html?currentBuyNumber="+_obj.text()+"&productID="+_obj.attr("pid")+"&buySpecID="+_obj.attr("buySpecID")+"&radom="+Math.random();

	$.ajax({
	  type: 'POST',
	  url: _url,
	  data: {},
	  cache:false,
	  success: function(data){
	

		  if(data.code=='notThisProduct'){
			
			  
			  olexon.showTip(data.msg);
			
		  }else  if(data.code=='buyMore'){
	
				olexon.showTip(data.msg);
		
				$(_obj).val(data.stock);
		  }else  if(data.code=='ok'){
		
			
			 // $("#totalPayMonery").text(data.amount);
			  //积分
			  //$("#totalExchangeScore").text(data.amountExchangeScore);

			  $(".total0").text(data.amount);
			  if($("#total_"+_obj.attr("buySpecID"))){
			  $("#total_"+_obj.attr("buySpecID")).text("￥ "+data.total0);
			  }
			  if(addrids!=""){
				  selectAdd(addrids);
			  
			  }
		
			  
			    if($("#payCode")!=null){
					$("#payCode").val("");
					$("#show_pay_ul").find("a").removeClass("lalx");
				    }
			
		  }
	  },
	  dataType: "json",
	  error:function(er){
	
	
	  }
	});
}

//加入购物车
function addToCart(){
	var _specIdHidden = $("#specIdHidden").val();
	var specJsonStringVal =eval($("#specJsonString").val());
	//如果规格存在

	if(specJsonStringVal && specJsonStringVal.length>0){
		
		
		if(!_specIdHidden || _specIdHidden==''){
	
			var prod = selectProdSize(2);
			if(!prod) return false;
			
		}
	}
	
//	if(!checkStockFunc()){
//		return false;
//	}
	

	var _url = "/cart!addToCart.action?productID="+$("#productID").val()+"&buyCount="+$("#inputBuyNum").val()+"&buySpecID="+$("#specIdHidden").val();
	$.ajax({
	  type: 'POST',
	  url: _url,
	  data: {},
	  success: function(data){
	
		if(data==0){
		
			toCart();
			// olexon.showTip('加入购物车成功',1);
			 $("#specIdHidden").val("");
			 
			//释放所有颜色的鼠标禁用状态
				$("#specColor li").each(function(){
					//$(this).removeClass("specNotAllowed");
					$(this).removeClass("on");
				});
				$("#specSize li").each(function(){
					$(this).addClass("specNotAllowed");
					
					$(this).removeClass("on");
				});
			 
			 $(".buynum").val(1);
			
		}else{
		
		
			olexon.showTip(data.tips);
			resetProductInfo();
			//$("a[name=stockErrorTips]").attr("data-original-title",data.tips).tooltip('show');
			//olexon.showTip('加入购物车失败！请联系客服寻求解决办法。');
		}
	  },
	  dataType: "json",
	  error:function(e){
	
		  
			olexon.showTip('加入购物车失败！请联系客服寻求解决办法。');
			return false;
		
	  }
	});
}
//去购物车结算
function toCart(){
	window.location.href = "/cart/cart.html";
}
function buy(){
	
	  alert("buy");
	
	var _specIdHidden = $("#specIdHidden").val();
	var specJsonStringVal = eval($("#specJsonString").val());
	//如果规格存在

	if(specJsonStringVal && specJsonStringVal.length>0){
		if(!_specIdHidden || _specIdHidden==''){
		
			
			var prod = selectProdSize(1);
			if(!prod) return false;
			
		}
	}
	
	if(!checkStockFunc()){
		return false;
	} 
	var _url = "/cart!addToCart.action?productID="+$("#productID").val()+"&buyCount="+$("#inputBuyNum").val()+"&buySpecID="+$("#specIdHidden").val();
	$.ajax({
	  type: 'POST',
	  url: _url,
	  data: {},
	  success: function(data){
		
		if(data==0){
			var confirm=checkStockLastTime();
			if(confirm){window.location.href = "/order/confirmOrder.html";}
		}else{
			olexon.showTip(data.tips);
		
			//$("a[name=stockErrorTips]").attr("data-original-title",data.tips).tooltip('show');
			
		}
	  },
	  dataType: "json",
	  error:function(e){
		
		  
		  olexon.showTip('立即购买失败！请联系客服寻求解决办法');
		  resetProductInfo();
			return false;
	  }
	});
}

//选择商品尺码
function selectProdSize(type) {

var aaa=$("#specDiv").clone(true);
$(aaa).attr("id","newspecDiv");
$(aaa).find("#specColor").attr("id","newspecColor");
$(aaa).find("#specSize").attr("id","newspecSize");
if(($(aaa).find("button")!=null))
	
	$(aaa).find("button").remove();

	
	aaa=$(aaa).append('<button type="button" style="width:100%" onclick="'+(type==1?"buy()":"addToCart()")+'" class="btn bg_red olexon-btn-primary">确定</button>');

		$.olexonDialog("<div id='newspecDiv'>"+aaa.html()+"</div>",{'title':'请选择颜色和尺码！','bakEvent':false});
		$(".closebtn").click(function(){resetProductInfo()});
		specChoose();
		return false;
		
	
}

//添加商品收藏
function addToFavorite(pid){

	var _url = "/product/addToFavorite.html?productID="+pid+"&radom="+Math.random();

	$.ajax({
	  type: 'POST',
	  url: _url,
	  data: {},
	  success: function(data){
	
		  var _result = "商品已成功添加到收藏夹！";
		 
		  if(data=="0"){
			  _result = "商品已成功添加到收藏夹！";
			  
			  olexon.showTip(_result,1);
			  return false
			 
		  }else if(data=='1'){
			  _result = "已添加，无需重复添加！";
			  
			  olexon.showTip(_result,1);
			  return false;
			  
		  }else if(data=='-1'){//提示用户要先登陆
			  _result = "使用此功能需要先登陆！";
			  olexon.showTip(_result,-1,2000,function(){
				  
				  window.location.href='/user/login.html?directUrl='+$("#directUrl").val();
				  
			  });
			  return false;
		  }else{
			  
			  olexon.showTip(_result,1);
			  return false
		  }
		  
		 
	  },
	  dataType: "text",
	  error:function(er){
	
	  }
	});
}
//重置商品信息
function resetProductInfo(){

	//设置值为商品原价格
	$("#nowPrice").text("￥"+$("#nowPriceHidden").val());
	//$("#stock_span_id").text($("#stockHidden").val());
	$("#specIdHidden").val("");
	 $(".buynum").val(1);
}
//最后一次检查库存
function checkStockLastTime(){
	var _url = "/cart/checkStockLastTime.html?radom="+Math.random();
	

	var result;
	$.ajax({
	  type: 'POST',
	  url: _url,
	  data: {},
	  async:false,
	  cache:false,
	  success: function(data){
		
		  if(data.code=='result'){
			  if(!data.list && !data.error){
				
				 result = true;
			  }else{
				  $.each(data.list,function(index,value){
					
					  olexon.showTip(value.tips);
					 
				
				  });
				  console.log("false");
				
				  result = false;
			  }
		  }
	  },
	  dataType: "json",
	  error:function(er){
		
		  result = false;
	  }
	});
	return result;
}
function  specChoose(){


	
	var specJsonStringVal = $("#specJsonString").val();

	//如果规格存在
	if(specJsonStringVal && specJsonStringVal.length>0){
	
		var specJsonStringObject = eval('('+specJsonStringVal+')');
		
	
	
	$("#newspecDiv li").click(function(){
		
	
		if($(this).hasClass("specNotAllowed")){
		
			return;
		}
		
		$(this).parent().find("li").not(this).each(function(){
			$(this).removeClass("on");
			$(this).attr("disabled","disabled");
			
		});
		if($(this).is(".on")){
			
		
			$(this).removeClass("on");
			
			//如果当前点击的是尺寸，则释放所有的颜色的禁用状态；如果点击的是颜色，则释放所有的尺寸禁用状态
			
			 if($(this).parent().attr("id")=="newspecColor"){
				
					
					//释放所有颜色的鼠标禁用状态
					$("#newspecSize li").each(function(){
						
						$(this).removeClass("specNotAllowed");
						
						$(this).removeClass("on");
					});
				}
			else{
			
				resetProductInfo();
				return ;
			}
		}else{
			
			
			
						
			$(this).addClass("on");
		}
		
	
		
		var parentID = $(this).parent().attr("id");
	
		
	
		
		if($("#newspecSize li").hasClass("on") && $("#newspecColor li").hasClass("on")){
	
		
			//找出对应的规格
			for(var i=0;i<specJsonStringObject.length;i++){
				var specItem = specJsonStringObject[i];
				if(specItem.specSize==$("#newspecSize .on").html() 
						&& specItem.specColor==$("#newspecColor .on").attr("data-value")){
				
					
					$("#nowPrice").text(specItem.specPrice);
					//$("#stock_span_id").text(specItem.specStock);
					$("#specIdHidden").val(specItem.id);
				
					break;
				}
			}
			//specNotAllowed
		}else if($("#newspecColor li").hasClass("on")){
			resetProductInfo();
		
		
			
			//找出对应的规格
			var sizeArr = [];//与选中的规格相匹配的颜色集合
			for(var i=0;i<specJsonStringObject.length;i++){
				var specItem = specJsonStringObject[i];
				
				if(specItem.specColor==$("#newspecColor .on").attr("data-value")){
				
					if(specItem.specStock>0){
					sizeArr.push(specItem.specSize);
					}
					
				}
			}
			
			//释放所有尺寸的鼠标禁用状态
			$("#newspecSize li").each(function(){
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
				
           
					$("#newspecSize li").each(function(){
						
					
						if($(this).text()==specItem.specSize){
						
							  
							$(this).addClass("specNotAllowed");
							return false;
						}
					});
				}
			}
			
		}else if($("#newspecSize li").hasClass("on")){
			resetProductInfo();
		
			//找出对应的规格
			var colorArr = [];//与选中的规格相匹配的颜色集合
			for(var i=0;i<specJsonStringObject.length;i++){
				var specItem = specJsonStringObject[i];
				if(specItem.specSize==$("#newspecSize .on").html()){
					colorArr.push(specItem.specColor);
				}
			}
			
			//释放所有颜色的鼠标禁用状态
			$("#newspecColor li").each(function(){
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
				
					
					$("#newspecColor li").each(function(){
						
						if($(this).text()==specItem.specColor){
						
							$(this).addClass("specNotAllowed");
							return false;
						}
					});
				}
			}
			
		}else{
		
			resetProductInfo();
		}
		if(parentID=="newspecColor"){
			resetProductInfo();
			
		
			
			//找出对应的规格
			var sizeArr = [];//与选中的规格相匹配的颜色集合
			for(var i=0;i<specJsonStringObject.length;i++){
				var specItem = specJsonStringObject[i];
				if(specItem.specColor==$("#newspecColor .on").attr("data-value")){
					if(specItem.specStock>0){
					sizeArr.push(specItem.specSize);
					}
				}
			}
			
			//释放所有颜色的鼠标禁用状态
			$("#newspecSize li").each(function(){
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
				
					
					$("#newspecSize li").each(function(){
					
						if($(this).text()==specItem.specSize){
						
						
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