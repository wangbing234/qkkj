/**
 * 反序列化，把JSON转换指定格式的XML
 * @param json
 */
export default function (model) {
  let label = model.labels[0] && model.labels[0].attrs.text.text;
  let xmlStr = `<sequenceFlow sourceRef="${model.source.id}" targetRef="${model.target.id}" id="${model.id}" name="${model.label}" />`;
  return XML.str2xml(xmlStr).getElementsByTagName('sequenceFlow')[0];
}