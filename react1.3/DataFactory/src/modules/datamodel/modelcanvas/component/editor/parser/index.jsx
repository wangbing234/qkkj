/***************************************************
 * 时间: 2016年6月14日15:23:50
 * 作者: bing.wang
 * 说明: 解析工作流XMl的数据
 ***************************************************/

function parserData(data, config) {
  if(data)
  {
    let allData = {};
    allData.nodes = _getShapesFromXML(data, config);
    allData.links = _getLinksFromXML(data, config);
    return allData;
  }
  else {
    console.log("解析数据为空。。。");
  }

}

/***
 * 从XML获取线节点
 * @param data
 * @returns {Array}
 */
function _getLinksFromXML(data, config) {
  let links = [];
  let shapes = data.root.links;
  if(!shapes)
    return links;
  for (let _shape of shapes) {
    let id =_shape.id;
    let name =_shape.name;
    let sourceRef =_shape.sourceRef;
    let targetRef =_shape.targetRef;
    let lineConfig = config.line;
    let link = {
      id: id,
      label: name,
      start: sourceRef,
      end: targetRef,
      config: lineConfig,
      shape: _shape
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
  let shapes = data.root.nodes;
  var task={};
  if(!shapes)
    return nodes;
  for (let _shape of shapes) {
    let _uiModel=_shape.uiModel;
    let _dataModel=_shape.dataModel;
    //debugger
    let chinaName= (_uiModel.name?_uiModel.name:"---")
    let nodeConfig = _getNodeConfigByXML(config, _uiModel);
    if(!nodeConfig)
    {
      console.log("_uiModel  通过配置找不到文件",_uiModel);
      continue;
    }
    let node = {
      id: _uiModel.id,
      position:_uiModel.position,
      src: nodeConfig.image,
      label: chinaName,
      config: nodeConfig,
      shape: _shape,  //节点信息
      task: task,  //相关的逻辑信息
      infoCode:_shape.uiModel.infoCode,
      iconType:_shape.uiModel.iconType,
      keyId:_shape.uiModel.keyId
    }
    nodes.push(node);
  }
  return nodes;
}

/**
 * 根据XML数据，用解析器去解析，判断是哪一个类型数据
 */
function _getNodeConfigByXML(config, node) {
  let nodes = config.node;

  for (let _node of nodes) {
    let Parser=new _node.parser;
    if (Parser) {
      if (Parser.canParser(node)) {
        return _node;
      }
    }
  }
  return null;
}


export default parserData;