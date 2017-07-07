/**
 * 反序列化，把JSON转换指定格式的XML
 * @param json
 */
export default function (model) {
  let position = model.position;
  let xmlStr = [
    `<BPMNShape id="BPMNShape_${model.id}" bpmnElement="${model.id}" >`,
    `   <Bounds height="60" width="60" x="${position.x}" y="${position.y}"></Bounds>`,
    `</BPMNShape>`
  ].join(' ');
  return XML.str2xml(xmlStr).getElementsByTagName('BPMNShape')[0];
}