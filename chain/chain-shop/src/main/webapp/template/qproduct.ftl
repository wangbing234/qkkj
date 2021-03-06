
<!DOCTYPE html>
<html>
<head>




<meta http-equiv="Content-Type" content="text/html; charset=gbk">
<meta charset="UTF-8">
<meta content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0" name="viewport">
<meta content="yes" name="apple-mobile-web-app-capable">
<meta content="yes" name="apple-touch-fullscreen">
<meta content="black" name="apple-mobile-web-app-status-bar-style">
<meta content="320" name="MobileOptimized">
<meta content="telephone=no" name="format-detection">
<link rel="stylesheet" href="/mobile/css/qdwap.css">
<script> addEventListener("load", function() { setTimeout(hideURLbar, 0); }, false); function hideURLbar(){ window.scrollTo(0,1); }</script>
<title>${e.name}</title>
<script type="text/javascript" src="/mobile/js/jquery.min.js"></script>
<script type="text/javascript" src="/mobile/js/scroll.js"></script>
<script src="/mobile/js/time.js"></script>

<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "//hm.baidu.com/hm.js?09f49173bb906845048a7e52f2cf42e2";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>
<!--在线QQ客服开始-->
<!--需要其它风格，可导入“style/”目录下的其它样式表文件-->
<!--<link rel="stylesheet" type="text/css" href="QQZXKF/style/red.css"/>
<script type="text/javascript" src="QQZXKF/js/jquery-1.7.2.min.js"></script>
<script language="javascript" src="QQZXKF/js/jquery.Sonline.js"></script>
<script type="text/javascript">
$(function(){
	$("body").Sonline({
		Position:"right",//left或right
		Top:200,//顶部距离，默认200px
		Effect:true, //滚动或者固定两种方式，布尔值：true或false
		DefaultsOpen:true, //默认展开：true,默认收缩：false
		Qqlist:"855005267|客服01" //多个QQ用','隔开，QQ和客服名用'|'隔开
	});
})	
</script>-->
<!--在线QQ客服结束-->

</head>

<body>
<div id="page">
  <header>
   <h1 style="text-align: center;display: inline-block;">欧蓝森官方旗舰店</h1>
   
  </header>
  <div class="banner"><img src="${e.picture}"></div>
  <section class="buy">
                          <h2 class="title">
    ${e.name}
</h2>

<div class="biztag ">
                        <label>全场包邮</label>
                    <label>货到付款</label>
                <label>零风险购物</label>
    </div>
  
  
    <br/>
  
    <div class="row1" id="pricediv"> <strong id="nowPrice" >￥${nowPrice}</strong>
      <ol>
        <li>
         <span id="price" style="text-decoration: line-through;">
          ￥${price}</span></li>
        <li>
        <a href="/order/quickOrder.html?productID=${e.id}" id="buybutqiang" class="buyaction"><span>马上抢</span></a>
         </li>
      
       
      </ol>
    </div>

    <article class="des"></article>
   </section>
  <article class="showcontent">
    <h2> 抢购描述</h2>
    <div style="padding:5px">${introduce}</div>
    <h2> 购买流程</h2>
    <img src="/mobile/images/gmlc.jpg">
    <h2> 产品简介</h2>
${e.productHTML}
<img src="/attached/image/20151121/1448097420927_3.jpg" />
<img src="/attached/image/20151121/1448097421208_3.jpg" />
<img src="/attached/image/20151121/1448097421442_3.jpg"/>

    <h2> 客户服务</h2>
    <p class="myinfo">${e.name}，优惠价${nowPrice}元，全国货到付款,免运费！</p>
 <div class="btn"> <a class="btn" href="tel:${tel}">热线咨询：${tel}</a>
      </div>
   <p class="myinfo">【上班时间：9:00-22:00】注意：电话拨入过多，接通率低，请尽量短信订购。</p>
 
   
   <#if comment!='<ul></ul>'>
     <br/>
  <article id="buy">
    <h2>顾客评论</h2>
  

<div class="list_lh">
${comment}
</div>

    </article>
    </#if>
</div>
 <div class="copy"> <span class="foot">${icp},${icpz}</span><br/>©苍南乐森商贸有限公司2016 olexon</div>

<div class="in_bot2">
  <div class="wz1"> <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=855005269&site=qq&menu=yes"> <span class="wz1a"><img src="/mobile/images/qq.jpg" alt=""></span> <span class="wz1b">QQ咨询</span> </a> </div>
  <div class="wz3"> <a href="/order/quickOrder.html?productID=${e.id}" id="buybut"> 立即购买 </a> </div>
  <div class="right"> <a target="_blank" href="/" id="homeUrl"> <span class="wz1a" style="font-size:22px;"><i class="icon-home" ></i></span> <span class="wz1b">返回首页</span> </a> </div>
</div>
  <a href="tel:${tel}" title="${tel}" ><div id="floatCart" class="cart_check" style="right: 0px; display: block;"><img src="/mobile/images/tel.gif" width="46"/></div></a>      
     <script type="text/javascript"> 

 function getParameter(param)  
    {  
        var query = window.location.search;  
        var iLen = param.length;
        var iStart = query.indexOf(param);
        if (iStart == -1)
            return "";  
        iStart += iLen + 1;  
        var iEnd = query.indexOf("&", iStart);
        if (iEnd == -1)
            return query.substring(iStart);
        return query.substring(iStart, iEnd);
    }  
  
    function init() {  

    
        var param = getParameter("gzid");  
        
        if(param!=""){
        document.getElementById("buybut").href=document.getElementById("buybut").href+"&gzid="+param;
      document.getElementById("buybutqiang").href= document.getElementById("buybut").href;
       document.getElementById("homeUrl").href=document.getElementById("homeUrl").href+"?gzid="+param+"&gzidType=quick&quality=${e.quality}";
       
       }
    } 
    function countp(){
  $.ajax({ 
	      type :"post",  //提交方式 
	      url :"/api.action" ,         //请求链接 
	       data:{"pid":${e.id},"a":"getSellCount"},              
	      dataType :"json", //返回数据类型
	      error:function(){   //后台出错，显示提示信息 
	          
	      }, 
	      success :function(res) {
	
	      if(res.mess==0){
	      
	      $("#countp").html("<span class='sell'>"+res.count+"</span>人已抢购");
	          $("#price").text(" ￥"+res.price);
	          $("#nowPrice").text(" ￥"+res.nowPrice);
	          $("#zhe").text(res.zhe);
	      $("#sheng").text(" ￥"+res.sheng);
	      } 
	      
      }});
    }

    $(function(){
     init(); 
  

    	$("div.list_lh").myScroll({
		speed:40, //数值越大，速度越慢
		rowHeight:39 //li的高度
	});
    });
    
    
   

   
</script>    
        
</body>

</html>