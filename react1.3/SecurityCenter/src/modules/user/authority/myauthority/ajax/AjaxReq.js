/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:我的权限Ajax
 *
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest.js'
import message from 'CommonComponent/component/bdosmessage'

/**
 * 获取审批列表
 * @param param
 * @param successHandle
 */
function listHbaseResource(param,successHandle) {
  let url=Server.dataSource+"commonResources?typeName=hbase";
  BfdRequest.ajaxGetData(url,successHandle);
}



/**
 * 获取hbase数据列簇
 * @param param
 * @param successHandle
 */
function listHbaseColumnfamily(param,successHandle){
  let tableName="";
  if( param.table instanceof  Array && param.table.length==0)
    return;
  if(param.table && param.table instanceof  Array && param.table.length==1)
  {
    tableName=param.table[0];
  }
  else {
    tableName=param.table;
  }
  if(tableName) {
    let url = Server.dataSource + `hbaseColumnFamilys?hbaseId=${param.resourceId}&nameSpace=${param.database}&table=${tableName}`;
    BfdRequest.ajaxGetData(url, successHandle);
  }
}

/**
 * 获取审批列表
 * @param param
 * @param successHandle
 */
function queryColumn(param,successHandle) {
  let tableName="";
  if(param.table instanceof  Array && param.table==0)
    return;
  if(param.table && param.table instanceof  Array && param.table.length==1)
  {
    tableName=param.table[0];
  }
  else {
    tableName=param.table;
  }
  if(tableName)
  {
    let url=Server.dataSource+`hiveColumns?hiveId=${param.resourceId}&nameSpace=${param.database}&table=${tableName}`;
    BfdRequest.ajaxGetData(url,successHandle);
  }
}

/**
 * 获取审批列表
 * @param param
 * @param successHandle
 */
function listHiveResource(param,successHandle) {
  let url=`${Server.dataSource}commonResources?typeName=${param}`;
  BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 租户列表
 * @param param
 * @param successHandle
 */
 function listByTenant(param,successHandle) {
   let url=`${Server.securityCenterAegis}user/listByTenant`;
   BfdRequest.ajaxPostStrData(url,param,successHandle);
 }

/**
 * 功能权限树
 * @param param
 * @param successHandle
 */
function viewMyFunctionTree(param,successHandle) {
  let url=`${Server.securityCenterAegis}auth/viewMyFunctionTree`;
  BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function viewTenantOwnerFunctionTree(parms,successHandle){
  let url=Server.securityCenterAegis+"auth/viewTenantOwnerFunctionTree";
  BfdRequest.ajaxPostStrData(url,parms,successHandle);
}

/**
 * 资源权限树
 * @param param
 * @param successHandle
 */
function viewMyResourceTree(param,successHandle) {
  let url=`${Server.securityCenterAegis}auth/viewMyResourceTree`;
  BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 资源权限树
 * @param param
 * @param successHandle
 */
function viewTenantOwnerMyResourceTree(param,successHandle) {
  let url=`${Server.securityCenterAegis}auth/viewTenantOwnerMyResourceTree`;
  BfdRequest.ajaxPostStrData(url,param,successHandle);
}


/**
 * 新增申请
 * @param param
 * @param successHandle
 */
function applyAuth(param,successHandle) {
  let url=`${Server.securityCenterAegis}authApprove/apply/create`;
  BfdRequest.ajaxPost(url,param,successHandle);
}

/**
 * 获取hbase数据列簇
 * @param param
 * @param successHandle
 */
function queryColumnFamily(param,successHandle){
  let tableName="";
  if( param.table instanceof  Array && param.table.length==0)
    return;
  if(param.table && param.table instanceof  Array && param.table.length==1)
  {
    tableName=param.table[0];
  }
  else {
    tableName=param.table;
  }
  if(tableName) {
    let url = Server.dataSource + `hbaseColumnFamilys?hbaseId=${param.resourceId}&nameSpace=${param.database}&table=${tableName}`;
    BfdRequest.ajaxGetData(url, successHandle);
  }
}


/**
 * 获取hbase数据库
 * @param param
 * @param successHandle
 */
function listHbaseDatabase(param,successHandle){
  let url=Server.dataSource+`hbaseNamespace?hbaseId=${param.resourceId}`;
  BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 获取hbase数据库
 * @param param
 * @param successHandle
 */
function hbaseTenantNamespace(param,successHandle){
  let url=Server.dataSource+`hbaseTenantNamespace?hbaseId=${param.resourceId}`;
  BfdRequest.ajaxGetData(url,successHandle);
}


/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function listHiveatabase(param,successHandle){
  let url=Server.dataSource+`hiveNameSpaces?hiveId=${param.resourceId}`;
  BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function hiveTenantNameSpaces(param,successHandle){
  let url=Server.dataSource+`hiveTenantNameSpaces?hiveId=${param.resourceId}`;
  BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 获取hive表
 * @param param
 * @param successHandle
 */
function listHiveTable(param,successHandle) {
  let url=Server.dataSource+`hiveTables?hiveId=${param.resourceId}&nameSpace=${param.database}`;
  BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 获取hbase数据表
 * @param param
 * @param successHandle
 */
function listHbaseTable(param,successHandle){
  let url=Server.dataSource+`hbaseTables?hbaseId=${param.resourceId}&nameSpace=${param.database}`;
  BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 获取hive列
 * @param param
 * @param successHandle
 */
function listHiveColumn(param,successHandle) {
  let tableName="";
  if(param.table instanceof  Array && param.table==0)
    return;
  if(param.table && param.table instanceof  Array && param.table.length==1)
  {
    tableName=param.table[0];
  }
  else {
    tableName=param.table;
  }
  if(tableName)
  {
    let url=Server.dataSource+`hiveColumns?hiveId=${param.resourceId}&nameSpace=${param.database}&table=${tableName}`;
    BfdRequest.ajaxGetData(url,successHandle);
  }
}


/**
 * 获取hbase数据列簇
 * @param param
 * @param successHandle
 */
function listHbaseColumnfamily(param,successHandle){
  let tableName="";
  if( param.table instanceof  Array && param.table.length==0)
    return;
  if(param.table && param.table instanceof  Array && param.table.length==1)
  {
    tableName=param.table[0];
  }
  else {
    tableName=param.table;
  }
  if(tableName) {
    let url = Server.dataSource + `hbaseColumnFamilys?hbaseId=${param.resourceId}&nameSpace=${param.database}&table=${tableName}`;
    BfdRequest.ajaxGetData(url, successHandle);
  }
}


/**
 * 判断策略名称是否重名
 * 输入参数：策略名称
 * **/
function checkPermission(data,callback){
  let url = `${Server.securityCenterAegis}policy/hdfs/checkPermission`;
  BfdRequest.ajaxAsyncPost(url, data, callback)
}



export default {
  listHbaseResource,
  queryColumnFamily,
  queryColumn,
  listHiveResource,
  listByTenant,
  viewMyFunctionTree,
  viewMyResourceTree,
  viewTenantOwnerFunctionTree,
  listHbaseDatabase,
  listHiveatabase,
  hiveTenantNameSpaces,
  listHiveTable,
  listHbaseTable,
  hbaseTenantNamespace,
  listHiveColumn,
  listHbaseColumnfamily,
  viewTenantOwnerMyResourceTree,
  applyAuth,
  checkPermission
}