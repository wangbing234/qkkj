import BfdRequest from 'CommonComponent/request/AjaxRequest'
import message from 'CommonComponent/component/bdosmessage'

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function queryIdeListByPage(param,successHandle) {
  let url=`${Server.dataFactory}uml/table/page?`+param;
  return BfdRequest.ajaxPostData(url,null,successHandle);
}

/**
 * 增加hive表
 * @param param
 * @param successHandle
 */
function addHiveTable(item,ui,successHandle)
{

  let url;
  if(ui && ui.infoCode)
  {
    url=`${Server.dataFactory}uml/table/update`;
  }
  else {
    url=`${Server.dataFactory}uml/table/add`;
  }
  return BfdRequest.ajaxPostData(url,item,successHandle);
}

/**
 * 获取DDL
 * @param successHandle
 * @param param
 */
function deleteList(param,successHandle) {
  let url=`${Server.dataFactory}uml/table/del`;
  return BfdRequest.ajaxPostData(url,{ids :param},successHandle);
}

/**
 * 数据模型编辑页面查询
 * @param param
 * @param successHandle
 */
function getDataTableByID(item,successHandle) {
  let url=`${Server.dataFactory}uml/table/get?id=${item.id}`;
  return BfdRequest.ajaxPostData(url,null,successHandle);
}


/**
 * 获取DDL
 * @param successHandle
 * @param param
 */
function queryHierarchyCode(successHandle) {
  let url=`${Server.dataFactory}uml/hierarchy/combo`;
  return BfdRequest.ajaxPostData(url,{projectCode:window.projectCode},successHandle);
}

/**
 * 获取DDL
 * @param successHandle
 * @param param
 */
function favoriteSave(item,successHandle) {
  let url=`${Server.dataFactory}uml/favorite/save`;
  return BfdRequest.ajaxPostData(url,item,successHandle);
}


/**
 * 获取DDL
 * @param successHandle
 * @param param
 */
function showPartition(item,successHandle) {
  let url=`${Server.dataFactory}uml/table/showPartition`;
  return BfdRequest.ajaxPostData(url,item,successHandle);
}


/**
 * 增加分区
 * @param param
 * @param successHandle
 */
function addPartitionValue(item,successHandle)
{
  let url=`${Server.dataFactory}uml/table/addPartitionValue`;
  return BfdRequest.ajaxPostData(url,item,successHandle);
}


/**
 * 显示分区值
 * @param param
 * @param successHandle
 */
function showPartitionValue(item,successHandle)
{
  let url=`${Server.dataFactory}uml/table/showPartitionValue`;
  return BfdRequest.ajaxPostData(url,item,successHandle);
}



export default {
  queryIdeListByPage,
  queryHierarchyCode,
  getDataTableByID,
  addHiveTable,
  favoriteSave,
  showPartition,
  showPartitionValue,
  addPartitionValue,
  deleteList
}