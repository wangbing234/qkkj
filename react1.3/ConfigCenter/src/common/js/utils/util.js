/**
 * window的Ready 函数，文档流加载结束触发
 * @type {Window.ready}
 */
var ready = window.ready = function (fn) {
    if (document.addEventListener) { //兼容非IE  
        document.addEventListener("DOMContentLoaded", function () {
            //注销事件，避免反复触发  
            document.removeEventListener("DOMContentLoaded", arguments.callee, false);
            fn(); //调用参数函数  
        }, false);
    } else if (document.attachEvent) { //兼容IE  
        document.attachEvent("onreadystatechange", function () {
            if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                fn();
            }
        });
    }
}

//convert string to xml object
function stringToxml(xmlString) {
    // for IE
    var xmlobject;
    if (window.DOMParser) { // Mozilla Explorer
        var parser = new DOMParser();
        xmlobject = parser.parseFromString(xmlString, "text/xml");
    } else { // Internet Explorer
        xmlobject = new ActiveXObject("Microsoft.XMLDOM");
        xmlobject.async = "false";
        xmlobject.loadXML(xmlString);
    }
    return xmlobject;
}
//convert xml object to string
function xmlToString(xmlObject) {
    // for IE
    if (window.ActiveXObject) {
        return xmlObject.xml;
    }
    // for other browsers
    else {
        return (new XMLSerializer()).serializeToString(xmlObject);
    }
}

// Changes XML to JSON
function xmlToObject(xml,obj) {
    //debugger;
    // Create the return object
    if(!obj){
        obj = {};
    }
    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj[attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }
    // do children
    if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if(item.nodeType == 3){
                continue;
            }
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = {};
                let _obj = xmlToObject(item,obj[nodeName]);
            } else {
                if(!obj[nodeName].length){
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToObject(item));
            }
        }
    }
    return obj;
};

function getValueFromArr(arr,flagKey,flagValue,valueKey){
    let filterItem = arr.filter((item) =>{
        return item[flagKey] == flagValue
    });
    console.log(filterItem);
    return filterItem[0][valueKey];
}
export default {
    stringToxml:stringToxml,
    xmlToString:xmlToString,
    xmlToObject:xmlToObject,
    getValueFromArr:getValueFromArr
}
