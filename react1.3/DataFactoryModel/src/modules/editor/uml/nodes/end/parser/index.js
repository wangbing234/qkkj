/**
 * 解析XML数据,解析成功，返回对象，解析失败返回null
 * @param xml
 * @returns {object}
 */
export default function (xml) {
  //【测试】目前就简单的判断下，是否为 业务节点
  if (xml && xml.tagName === "serviceTask") {
    let node = xml.getElementsByTagName('expression');
    if (!node.length) node = xml.getElementsByTagName('activiti:expression');
    let nodeType = node[0].innerHTML;
    if (nodeType === "BusinessScript") {
      try {
        return XML.xml2Json(xml);
      } catch (e) {
        //    TODO:解析报错的处理，目前没有
      }
    }
  }
  return null;
}