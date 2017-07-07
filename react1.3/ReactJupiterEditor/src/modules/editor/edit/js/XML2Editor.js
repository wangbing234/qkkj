/***************************************************
 * 时间: 16/5/4 16:18
 * 作者: zhongxia
 * 说明: 解析工作流XMl的数据 to 工作流框架需要的数据格式
 ***************************************************/

/**
 * 解析数据返回指定格式的数据格式
 * @param data   已有工作流的配置
 * @param config 节点的配置
 * @returns {{}}
 */
function getData(data, config) {
  let allData = {};
  allData['links'] = _getLinksFromXML(data, config);
  allData['nodes'] = _getShapesFromXML(data, config);
  return allData;
}

/***
 * 从XML获取线节点
 * @param data
 * @returns {Array}
 */
function _getLinksFromXML(data, config) {
  let links = [];
  let shapes = data.getElementsByTagName('sequenceFlow');
  for (let i = 0, length = shapes.length; i < length; i++) {
    let id = _getXMLValue(shapes[i].attributes['id']);
    let name = _getXMLValue(shapes[i].attributes['name']);
    let sourceRef = _getXMLValue(shapes[i].attributes['sourceRef']);
    let targetRef = _getXMLValue(shapes[i].attributes['targetRef']);
    let lineConfig = config.line;
    let link = {
      id: id,
      label: name,
      start: sourceRef,
      end: targetRef,
      config: lineConfig,
      shape: shapes[i]
    }
    links.push(link);
  }
  return links;
}

/**
 * 从XML中获取图元节点数据
 * @returns {Array}
 */
function _getShapesFromXML(data, config) {
  let nodes = [];
  let shapes = data.getElementsByTagName('BPMNShape');
  let servicesTasks = data.getElementsByTagName('serviceTask');

  for (let i = 0, length = shapes.length; i < length; i++) {
    let bound = shapes[i].getElementsByTagName('Bounds')[0];
    let x = _getXMLValue(bound.attributes['x']);
    let y = _getXMLValue(bound.attributes['y']);
    let id = _getXMLValue(shapes[i].attributes['bpmnElement']);
    let task = servicesTasks[id] || {};
    let nodeConfig = _getNodeConfigByXML(config, task);

    let src = (nodeConfig && nodeConfig.image) || "src/common/imgs/editor/DataAudit.png";
    let label = _getXMLValue(task.attributes && task.attributes['name']);
    let node = {
      id: id,
      x: parseInt(x),
      y: parseInt(y),
      src: src,
      label: label,
      config: nodeConfig,
      shape: shapes[i],  //节点信息
      task: task  //相关的逻辑信息
    }
    nodes.push(node);
  }
  return nodes;
}

/**
 * 根据所有图元,线段的节点数据,反解析成 后端所需的数据格式
 * @param cells 所有图元
 * @returns {type[]}
 */
function saveData(cells) {
  let id = 'ryantest130';
  let targetTagName = {
    "html.Element": "BPMNPlane",
    "erd.Line": "process"
  }
  const nodeTypeName = "html.Element";
  let lineTypeName = "erd.Line";

  let xmlStr = [
    '<definitions id="review-definitions" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://activiti.org/bpmn20" xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:activiti="http://activiti.org/bpmn">',
    '<process id="' + id + '" name="' + id + '"></process>',
    '<bpmndi:BPMNDiagram id="BPMNDiagram_' + id + '">',
    '<bpmndi:BPMNPlane bpmnElement="' + id + '" id="BPMNPlane_' + id + '"></bpmndi:BPMNPlane>',
    '</bpmndi:BPMNDiagram>',
    '</definitions>'
  ].join('');

  let xmlDoc = _str2xml(xmlStr);

  for (var i = 0; i < cells.length; i++) {
    let nodeXML;
    let model = cells[i].attributes;
    let config = cells[i].attributes.data.config;
    let type = model.type;
    if (config) {
      //图元
      if (type === nodeTypeName) {
        nodeXML = _nodeSerializer(model);
        let serviceTask = config.serializer && config.serializer(model);
        if (serviceTask) {
          let serviceTaskXMLNode = xmlDoc.getElementsByTagName(targetTagName[lineTypeName])[0];
          serviceTaskXMLNode && serviceTaskXMLNode.appendChild(serviceTask);
        }
      }
      //线段
      else if (type === lineTypeName) {
        nodeXML = config.serializer && config.serializer(model);
      }

      //序列化成XML不为空,则汇入总XML中
      if (nodeXML) {
        let targetXmlNode = xmlDoc.getElementsByTagName(targetTagName[type])[0];
        targetXmlNode && targetXmlNode.appendChild(nodeXML);
      }
    }
  }
  return xmlDoc;
}

/**
 * 反序列化，把JSON转换指定格式的XML
 * @param json
 */
function _nodeSerializer(model) {
  let position = model.position;
  let xmlStr = [
    `<BPMNShape id="BPMNShape_${model.id}" bpmnElement="${model.id}" >`,
    `   <Bounds height="60" width="60" x="${position.x}" y="${position.y}"></Bounds>`,
    `</BPMNShape>`
  ].join(' ');
  return XML.str2xml(xmlStr).getElementsByTagName('BPMNShape')[0];
}

function _str2xml(xmlStr) {
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

/**
 * 根据XML数据，用解析器去解析，判断是哪一个类型数据
 */
function _getNodeConfigByXML(config, xml) {
  let nodes = config.node || [];
  for (let i = 0, length = nodes.length; i < length; i++) {
    if (nodes[i].parser && (typeof(nodes[i].parser) === "function")) {
      if (nodes[i].parser(xml)) {
        return nodes[i];
      }
    }
  }
  return null;
}

/**
 * 获取XML节点的值，兼容多种浏览器
 * @param xmlNode
 * @returns {*}
 */
function _getXMLValue(xmlNode) {
  let value;
  if (xmlNode) {
    value = xmlNode.value || xmlNode.nodeValue || xmlNode.textContent;
  }
  return value;
}

export default {
  getData: getData,
  saveData: saveData
}