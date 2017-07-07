/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:调用后台ajax类
 *
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest'
import CommonUtil from 'CommonComponent/utils/CommonUtil'

/**
 * 获取DDL
 * @param successHandle
 * @param param
 */
function getDDLData(param,successHandle) {
  let url=`${Server.dataFactory}uml/table/showDDL`;
  return BfdRequest.ajaxAsyncPost(url,param,successHandle);
}


/**
 * 获取DDL
 * @param successHandle
 * @param param
 */
function queryHierarchyCode(successHandle) {
  let url=`${Server.dataFactory}uml/hierarchy/combo`;
  return  BfdRequest.ajaxPostData(url,{projectCode:window.projectCode},successHandle);
}

/**
 * 获取DDL
 * @param successHandle
 * @param param {{hierarchyCode:window.projectCode}
 */
function querySubjectByCode(parms,successHandle){
  let url=`${Server.dataFactory}uml/subject/combo`;
  return BfdRequest.ajaxPostData(url,{hierarchyCode:parms.hierarchyCode},successHandle);
}

/**
 * 获取DDL
 * @param successHandle
 * @param param {{hierarchyCode:window.projectCode}
 */
function queryFolderByCode(parms,successHandle){
  let url=`${Server.dataFactory}uml/tree/getFolder`;
  return BfdRequest.ajaxPostData(url,{subjectCode:parms.subjectCode},successHandle);
}


/**
 * 获取DDL
 * @param successHandle
 * @param param {{hierarchyCode:window.projectCode}
 */
function loadTable(parms,successHandle){
   delete parms.pagingConfigList;
  let urlString= CommonUtil.objectToURL(parms)
  let url=`${Server.dataFactory}uml/table/loadTable?${urlString}`;
  return  BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 获取DDL
 * @param successHandle
 * @param param
 */
function queryModeTree(successHandle) {
  let url=`${Server.dataFactory}uml/tree/getChildren`;
  return queryModeTreeByUrl(url,successHandle);
}

/**
 * 获取DDL
 * @param successHandle
 * @param param
 */
function queryModeTreeByUrl(url,successHandle) {
  return BfdRequest.ajaxPostData(url,{"projectCode":window.projectCode},successHandle);
}

/**
 * 获取DDL
 * @param successHandle
 * @param param
 */
function queryModeTreeByUrlAsync(url,successHandle) {
  return  BfdRequest.ajaxAsyncPost(url,{"projectCode":window.projectCode},successHandle);
}

/**
 * 获取DDL
 * @param successHandle
 * @param param
 */
function listImportTree(successHandle) {
  let url=`${Server.dataFactory}uml/import/list`;
  return BfdRequest.ajaxPostData(url,{"projectCode":window.projectCode},successHandle);
}

/**
 * 获取DDL
 * @param successHandle
 * @param param
 */
function getShareTables(successHandle) {
  let url=`${Server.dataFactory}uml/table/getShareTables`;
  return  BfdRequest.ajaxPostData(url,{"projectCode":window.projectCode},successHandle);
}


/**所有租户列表**/
function getTenantList(callback){
  let url = `${Server.securityCenterUser}tenant/listAll.action`;
  //方法名：listAll
  return BfdRequest.ajaxGetData(url,callback);
}

/**选择项目*/
function selectProject(parms,callback){
  
  let parmsObj={tenant:parms.tenant,"currentProject":window.projectCode}
  let url = `${Server.dataFactory}uml/import/selectProject`;
  return BfdRequest.ajaxPostData(url,parmsObj,callback);
}

/**选择项目列表*/
function selectList(parmsObj,callback){
  let url = `${Server.dataFactory}uml/import/selectList`;
  return BfdRequest.ajaxPostData(url,{projectCode:parmsObj.currentProject,currentProject:window.projectCode,tenant:parmsObj.tenant,
    tableName:parmsObj.tableName,
    currentPage:parmsObj.currentPage,pageSize:parmsObj.pageSize},callback);
}

/**报错其它项目表*/
function saveOtherProjectTable(parmsObj,callback){
  parmsObj.currentProject=window.projectCode;
  let url = `${Server.dataFactory}uml/import/save`;
  return BfdRequest.ajaxPostData(url,parmsObj,callback);
}


/**报错其它项目表*/
function saveModel(parmsObj,callback){
  parmsObj.currentProject=window.projectCode;
  let url = `${Server.dataFactory}uml/table/saveModel`;
  return BfdRequest.ajaxPostData(url,parmsObj,callback);
}

/**报错其它项目表*/
function deleteTableTree(parmsObj,callback){
  let url = `${Server.dataFactory}uml/tree/del`;
  return BfdRequest.ajaxPostData(url,{code:parmsObj},callback);
}

/**新建文件夹*/
function addTreeNode(parmsObj,callback){

  parmsObj.projectCode=window.projectCode;
  let url = `${Server.dataFactory}uml/tree/add`;
  return BfdRequest.ajaxPostData(url,parmsObj,callback);
}

/**新建文件夹*/
function renameTreeNode(parmsObj,callback){
  let url = `${Server.dataFactory}uml/tree/rename`;
  return BfdRequest.ajaxPostData(url,parmsObj,callback);
}


/**新建文件夹*/
function treeHasChildren(parmsObj,callback){
  let url = `${Server.dataFactory}uml/tree/hasChildren`;
  return BfdRequest.ajaxPostData(url,parmsObj,callback);
}

/**新建文件夹*/
function moveTreeNode(parmsObj,callback){
  let url = `${Server.dataFactory}uml/tree/move`;
  return BfdRequest.ajaxPostData(url,parmsObj,callback);
}

/**
 * 显示分区值
 * @param param
 * @param successHandle
 */
function viewTableByCode(item,successHandle)
{
  let url=`${Server.dataFactory}/uml/table/view`;
  return BfdRequest.ajaxPostData(url,item,successHandle);
}
//
///**
// * 查询当前拖拽
// * @param param
// * @param successHandle
// */
//function checkExsit(item,successHandle)
//{
//  let url=`${Server.dataFactory}/uml/table/checkExsit`;
//  BfdRequest.ajaxPostData(url,item,successHandle);
//}

/**
 * 查询模型树根目录
 * @param param
 * @param successHandle
 */
function queryRootTree(successHandle)
{
  let url= `${Server.dataFactory}uml/tree/getChildren?projectCode=${window.projectCode}&hasTable=true`;
  return BfdRequest.ajaxPostData(url,{},successHandle);
}

/**
 * 查询模型树根目录
 * @param param
 * @param successHandle
 */
function queryTableRelation(parms,successHandle)
{
  let url= `${Server.dataFactory}uml/tree/getChildren?projectCode=${window.projectCode}&hasTable=true`;
  // return BfdRequest.ajaxPostData(url,parms,successHandle);
}

/**
 * 查询模型画布
 * @param param
 * @param successHandle
 */
function queryModelCanvas(parms,successHandle)
{
  let url= `${Server.dataFactory}uml/icon/loadByProjectCode`;
  return  BfdRequest.ajaxPostData(url,parms,successHandle);
}

/**
 * 查询模型画布
 * @param param
 * @param successHandle
 */
function saveUML(parms,successHandle)
{
  let url= `${Server.dataFactory}uml/icon/save`;
  return BfdRequest.ajaxPostData(url,parms,successHandle);
}

/**
 * 删除表
 * @param param
 * @param successHandle
 */
function delByCode(parms,successHandle)
{
  let url= `${Server.dataFactory}uml/icon/delByTableCode`;
  return BfdRequest.ajaxPostData(url,parms,successHandle);
}

/**
 * 彻底删除表
 * @param param
 * @param successHandle
 */
function delByCodeDid(parms,successHandle)
{
  let url= `${Server.dataFactory}uml/table/delByCode`;
  return BfdRequest.ajaxPostData(url,parms,successHandle);
}



/**
 * 查询几级关系
 * @param param
 * @param successHandle
 */
function loadByTableCode(parms,successHandle)
{
  if(!parms.projectCode)
  {
    parms.projectCode=window.projectCode;
  }
  let url= `${Server.dataFactory}uml/icon/loadByTableCode`;
  return BfdRequest.ajaxPostData(url,parms,successHandle);
}


/**
 * 通过table，database查询血缘关系
 * @param param
 * @param successHandle
 */
function loadByDataaseAndTablename(parms,successHandle)
{
  let url= `${Server.dataFactory}uml/icon/loadByDataaseAndTablename`;
  return BfdRequest.ajaxPostData(url,parms,successHandle);
}


/**
 * 通过主题域或目录查询uml
 * @param param
 * @param successHandle
 */
function loadByCode(parms,successHandle)
{
  let url= `${Server.dataFactory}uml/icon/loadByCode`;
  return BfdRequest.ajaxPostData(url,parms,successHandle);
}






/**
 * 获取DDL
 * @param successHandle
 * @param param
 */
function saveLoadTable(item,successHandle) {
  item.projectCode=window.projectCode;
  let url=`${Server.dataFactory}uml/table/saveLoadTable`;
  return BfdRequest.ajaxPostData(url,item,successHandle);
}

//configCenterApi


/**
 * 通过类型获取数据库类型
 * @param successHandle
 * @param param
 */
/*获取关系型数据源列表*/
function getRelativeDataSourceList( param, successHandle, faultHandle ){
  let url = `${Server.dataSource}rdbmsDataBases`;
  return BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*根据数据源id获取表列表*/
function getTableList( param, successHandle, faultHandle ) {
  let url = `${Server.dataSource}rdbmsTablesNoDatabase`;
  return  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

export default {
  getDDLData,
  loadTable,
  queryRootTree,
  queryHierarchyCode,
  querySubjectByCode,
  queryFolderByCode,
  queryModeTree,
  queryModeTreeByUrl,
  queryModeTreeByUrlAsync,
  getShareTables,
  listImportTree,
  getTenantList,
  selectProject,
  selectList,
  saveOtherProjectTable,
  saveModel,
  delByCode,
  loadByTableCode,
  loadByCode,
  delByCodeDid,
  deleteTableTree,
  addTreeNode,
  renameTreeNode,
  treeHasChildren,
  moveTreeNode,
  viewTableByCode,
  //checkExsit,
  queryTableRelation,
  queryModelCanvas,
  saveLoadTable,
  saveUML,
  getRelativeDataSourceList,
  getTableList,
  loadByDataaseAndTablename
}