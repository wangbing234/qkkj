/**
 * 反序列化，把JSON转换指定格式的XML
 * @param json
 */
export default function (model) {
  let xmlStr = [
    `<serviceTask id="${model.id}" name="${model.label}" xmlns:activiti="http://activiti.org/bpmn">`,
    `<extensionElements>`,
    `<activiti:field name="type">`,
    `<activiti:expression>BusinessScript</activiti:expression>`,
    `</activiti:field>`,
    `<activiti:field name="params">`,
    `<activiti:expression>{"taskId":"629","scriptType":null,"scriptTypeId":"2","scriptPara":"","resultInfo":"returnInfo","nodeErrorRepeatTimes":0,"projectId":"30616","projectName":"BI_Demo","resultName":"returnVar"}</activiti:expression>`,
    `</activiti:field>`,
    `<activiti:field name="remark">`,
    `<activiti:expression></activiti:expression>`,
    `</activiti:field>`,
    `<activiti:field name="message">`,
    `<activiti:expression>{"mailGroup":0,"messageType":"","smsGroup":0,"executionTime":0,"monitorType":""}</activiti:expression>`,
    `</activiti:field>`,
    `</extensionElements>`,
    `</serviceTask>`
  ].join(' ');
  return XML.str2xml(xmlStr).getElementsByTagName('serviceTask')[0];
}