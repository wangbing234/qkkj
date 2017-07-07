/**
 * 解析XML数据,解析成功，返回对象，解析失败返回null
 * @param xml
 * @returns {object}
 */
export default function (xml) {
  if (xml && xml.tagName === "sequenceFlow") {
    return XML.xml2Json(xml);
  }
  return null;
}