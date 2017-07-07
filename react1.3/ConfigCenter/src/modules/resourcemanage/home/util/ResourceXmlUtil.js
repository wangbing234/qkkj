function setItemXML(xmlDoc,name,cpname,value) {
    value=value?value:"";
    let itemXml = xmlDoc.createElement("item");
    if(name){
        itemXml.setAttribute("name",name);
    }
    itemXml.setAttribute("cpname",cpname);
    itemXml.setAttribute("value",value);
    return itemXml;
}

function setModelXML(xmlDoc,name,type,title) {
    let modelXML = xmlDoc.createElement("model");
    modelXML.setAttribute("name",name);
    modelXML.setAttribute("type",type);
    if(title){
        modelXML.setAttribute("title",title);
    }
    return modelXML;
}

module.exports={
    setItemXML,
    setModelXML
}