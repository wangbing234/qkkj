//把对象拼接成URL，应用于post改为url
//1：层级，2：主题域，3：文件夹，4，表
import TypeConst from './TypeConst'
function  getIcon(item){
  switch (item.type){
    case 1:
      return "align-justify"
      break;
    case 2:
      return "align-right"
      break;
    case 3:
      return "folder"
      break;
    case 4:
      return "table"
      break;
    case -1:
      return "database"
    default:
      return "folder"
      break;
  }
}


/**
 * 开始拖拽
 * @param item
 * @param ev
 */
function handleDragStart(item,iconType,ev) {
  let itemObject=$.extend(true,{},item);
  if(iconType==2)//其它项目
  {
    itemObject.code=itemObject.tableCode;
  }
  const data = {
    format:TypeConst.DRAG_FORMAT.MODEL,//重从具栏中拖拽
    ...itemObject,
    iconType
  }
  let dataJsonString=JSON.stringify(data);
  ev.dataTransfer.setData('data', dataJsonString);
  console.log("dragData",data)
}






export default {
  getIcon,
  handleDragStart
}