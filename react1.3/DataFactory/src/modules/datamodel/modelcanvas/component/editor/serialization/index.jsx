/***************************************************
 * 时间: 2016年6月14日11:08:22
 * 作者: bing.wang
 * 说明: 序列化json数据
 ***************************************************/
const nodeTypeName = "html.Element";
const lineTypeName = "erd.Line";
/**
 * @param cells 所有图元
 * @returns {type[]}
 */
function serialization(cells,_Config) {
  let nodeArray = [];
  let lineArray = [];
  let sRoot={};
  for (var i = 0; i < cells.length; i++) {
    let nodeXML;
    let model = cells[i].attributes;
    let config = cells[i].attributes.data ?cells[i].attributes.data.config:"1";
    let type = model.type;
    if (config) {
      //图元
      let newModel;
      if (type === nodeTypeName) {
        let newModel = (new config.serializer).serializer(model);
        if (newModel) {
          nodeArray.push(newModel);
        }
      }
      //线段
      else if (type === lineTypeName) {
        newModel = (new _Config.line.serializer).serializer(model);
        if (newModel) {
          lineArray.push(newModel);
        }
      }
    }
  }
  sRoot.nodes=nodeArray;
  sRoot.links=lineArray;
  return {root:sRoot};
}
export default serialization