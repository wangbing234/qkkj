var XML = (function() {
    /**
     * 把字符串转换成 XMLDOC 对象
     * @param  {[type]} xmlStr [description]
     * @return {[type]}        [description]
     */
    function str2xml(xmlStr) {
        //跨浏览器，ie和火狐解析xml使用的解析器是不一样的。
        var xmlStrDoc = null;
        if (window.DOMParser) { // Mozilla Explorer
            var parser = new DOMParser();
            xmlStrDoc = parser.parseFromString(xmlStr, "text/xml");
        } else { // Internet Explorer
            xmlStrDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlStrDoc.async = "false";
            xmlStrDoc.loadXML(xmlStr);
        }
        return xmlStrDoc;
    }

    /*===============================XML2JSON START==========================*/
    /**
     * XML 转成 JSON 对象
     * @param  {[type]} xml [description]
     * @return {[type]}     [description]
     */
    function xml2Json(xml) {
        // Create the return object
        var obj = {};
        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }
        // do children
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = xml2Json(item);
                } else {
                    if (typeof(obj[nodeName].length) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push ? obj[nodeName].push(xml2Json(item)) : obj[nodeName] = xml2Json(item);
                }
            }
        }
        return obj;
    };

    return {
        str2xml: str2xml,
        xml2Json: xml2Json,
    }
})();