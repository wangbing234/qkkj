	$('.goback').on("touchstart",function() {
	window.history.back()
})
//var ming8 = $(".ming8").html();
//var phone3 = $(".phone3").html();
//var youbian = $(".youbian").val();
//var addr = $(".addr").val();
//var add1 = $(".add1").html();
//查询会员默认配送地址
var morenaddId = localStorage.getItem("morenaddId");

//查询所有会员配送地址
$.ajax({
	url: ROOTCONFIG.host + "/f/addrQry",
	type: 'post',
	timeout: 3000,
	dataType: 'json', //主要是这里和原来的json改变了！	
	success: function(ret) {
		console.log(ret)

		
		var data = ret.data;
		var rid = localStorage.getItem("morenaddId");
		if(ret.success) {
				console.log(ret)
						
			for(var i in data) {

          //label
          	if(data[i].isDefault == 1) {
					$("#moWrapBox").append("<div class='moWrap'>" + "<div class='mo1'>" + "<span class='ming8'>"+ data[i]["linkName"] + "</span>" + "<span class='phone3'>" + data[i]["linkTel"] + "</span>" + "<p class='add1'>" + data[i]["linkAddr"] + "</p>" + "</div>" + "<div class='mo2'>" + "<div class='checkMo' id='aa1'>"+"</div>" + "<span class='morenDi' for='aa1'>" + "默认地址" + "</span>" +"<a class='shanchu'>" + "删除" + "</a>" + "<a class='xiugai'>" + "修改" + "</a>"+ "</div>" + "</div>");
				} else {
					$("#moWrapBox").append("<div class='moWrap'>" + "<div class='mo1'>" + "<span class='ming8'>"+ data[i]["linkName"] + "</span>" + "<span class='phone3'>" + data[i]["linkTel"] + "</span>" + "<p class='add1'>"+ data[i]["linkAddr"] + "</p>" + "</div>" + "<div class='mo2'>" + "<div class='checkMo' id='aa2'>"+"</div>" + "<span class='morenDi' for='aa2'>" + "设为默认" + "</span>"+"<a class='shanchu'>" + "删除" + "</a>"+ "<a class='xiugai'>" + "修改" + "</a>"+"</div>" + "</div>");

				}
          

			}	
				$('.checkMo').click(function() {
				var index = $(this).parent().parent().index();
				$(this).addClass("acss").parent().parent().siblings().find(".checkMo").removeClass("acss");
				console.log(data)
				var rid = data[index].rid;
				console.log(rid)
				var addr = data[index].addr;
				$.ajax({
					type: "post",
					timeout: 3000,
					url: ROOTCONFIG.host + "/f/addrDefUp",
					data: {
						id: rid
					},
					datatype: "json",
					success: function(ret) {
						if(ret.success) {
							console.log(ret)						
							
								// 执行成功，返回正确结果
							$.ajax({
								url: ROOTCONFIG.host + "/f/addrQry",
								type: 'post',
								timeout: 3000,
								dataType: 'json', //主要是这里和原来的json改变了！	
								success: function(ret) {
									
									var adata = ret.data;
									//		var rid=localStorage.getItem("morenaddId");
									if(ret.success) {
										console.log(data[index].rid)
							
						if(data[index].rid == rid) {
							var adata = ret.data;
							console.log(adata)
							var neAddr=adata[index].linkAddr
							console.log(neAddr)
							$(".moWrap").eq(index).find(".morenDi").html("默认地址 ").parent().parent().siblings().find(".morenDi").html("设为默认");
							
							
                             localStorage.setItem("moren",neAddr)
                             window.location.reload();
											} 
											

										
									}
								}
							})
							

						} else {
							// 执行成功，结果错误
							
						}
					},
					error: function() {
						// 超时或后台报错
					}
				});

				console.log(this)
			
			});
			//修改地址
			
				$('.xiugai').on("touchstart",function(){
				var index = $(this).parent().parent().index();
				var rid = data[index].rid;
				localStorage.setItem("bgdiRid",rid)
				console.log(rid)
			 window.location.href="addSite.html"
								
			})
			//删除地址

	$('.shanchu').on("touchstart",function() {
console.log(data)

var index = $(this).parent().parent().index();
var isDefault=data[index].isDefault;
var rid = data[index].rid;
	  console.log(isDefault)
	  if(isDefault==1){
	  	$scope.alert("默认地址不能删除");
	  }else{
	  		$.ajax({
		type: "post",
		timeout: 3000,
		url: ROOTCONFIG.host + "/f/addrDel", //3.23
		data: {
			id: rid
		},
		datatype: "json",
		success: function() {
		
			console.log("删除地址成功")
			$(this).parent().parent().remove($(".moWrap").eq(index))
			
//				$("#moWrapBox").removeChild($(".moWrap").eq(index));
			window.location.reload();
			
		},
		error: function() {
			// 超时或后台报错
			console.log("超时或后台报错")

		}
	});
	  }

})
			
			
			

			var leng = $(".moWrap").length
			if(leng >= 5) {
				$(".more").hide()

			} else {
				
				$(".more").on("touchstart",function() {
					window.location.href = "addSite.html"
					$(".more").show()
				})
			};
		} else {
			
				$(".more").on("touchstart",function() {
					window.location.href = "addSite.html"
			
				})
				console.log(ret.msg)
		}
	}
});

