(function(a){var e={show:false,params:"",type:"",targetID:"",spantime:""},b=[];a.fn.processshow=function(b){var c=a(this).find("img[js]");a.each(c,function(d,c){f(c,a(c).attr("js"),b)})};function f(f,m,l){var g=m.split("^"),b=a.extend({},e,l||{});if(g.length==2){var n=g[0],i=g[1];switch(n){case"CountDown":var j=new Date(b.params),k=new Date(i);spantime=(k-j)/1e3;var d=a.guid++,h="<div style='font-size:45pt;position: absolute;top: 350px;left: 340px;color: #706E6C;display: inline-block;' id='"+d+"'></div>";a(f).before(h);a(f).parents("a").css("text-decoration","none");b.targetID=d;b.spantime=spantime;c(b);a.processshow.TimedCount(d);break;case"CumulativeTotal":var d=a.guid++,h="<div style='width:150px;font-size:20pt;position: absolute;top: 319px;left: 930px;color: #C14948;display: inline-block;' key='"+d+"'><label>0</label></div><div style='width:150px;font-size:20pt;position: absolute;top: 368px;left: 930px;color: #C14948;display: inline-block;' key='"+d+"'><label>0</label></div>";a(f).before(h);a(f).parents("a").css("text-decoration","none");b.total=0;b.targetID=d;b.params=i;c(b);a.processshow.CumulativeTotal(d)}}}function c(d){var e=false,g,f;b!=undefined&&a.each(b,function(b,a){if(d.targetID==a.key){f=a;f.value=d;e=true;g=b;return false}});if(!e){var c='{"key":"","value":""}';c=a.parseJSON(c);c.key=d.targetID;c.value=d;b.push(c)}else b[g]=f;return e}var d=5;a.processshow={TimedCount:function(e){var b=a.processshow.GetRegisterSettings(e);b.spantime--;var f=Math.floor(b.spantime/(24*3600)),g=Math.floor(b.spantime%(24*3600)/3600),h=Math.floor(b.spantime%3600/60),i=Math.floor(b.spantime%60),d=a("#"+b.targetID);if(b.spantime>0){d.text(g+f*24+" \u6642 "+h+" \u5206 "+i+" \u79d2");c(b);setTimeout("$.processshow.TimedCount("+e+")",1e3)}else d.text("0 \u6642 0 \u5206 0 \u79d2")},CumulativeTotal:function(e){var b=a.processshow.GetRegisterSettings(e);a.get("/Home/Counter?arg="+encodeURIComponent(b.params),function(f){if(f!=undefined&&f!=null&&f!=NaN){var h=a("div[key="+b.targetID+"]").eq(0).find("label"),g=a("div[key="+b.targetID+"]").eq(1).find("label");h.animateNumber(parseInt(f),{symbol:","});g.animateNumber(parseInt(f)*100,{symbol:","});c(b);d--;d>0&&setTimeout("$.processshow.CumulativeTotal("+e+")",1e4)}})},GetRegisterSettings:function(d){var c;a.each(b,function(b,a){if(a.key==d){c=a.value;return false}});return c}}})(jQuery)