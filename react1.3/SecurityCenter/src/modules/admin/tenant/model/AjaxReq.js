import BfdRequest from 'CommonComponent/request/AjaxRequest'

const serverUrl = window.Server.securityCenterAegis;

/**
 * 租户list含分页
 * **/
function getTenantList (data,callback){
  let url = `${serverUrl}tenant/list.action` ;
  //方法名：list
  return BfdRequest.ajaxPostData(url, data, callback)
}



/**新增租户基本信息**/
function addTenantBaseInfo(data,callback){
  let url = `${serverUrl}tenant/save`;
  BfdRequest.ajaxPostData(url,data,callback);
}

/**编辑租户基本信息**/
function editTenantBaseInfo(data,callback){
  let url = `${serverUrl}tenant/edit.action`;
  BfdRequest.ajaxPostData(url,data,callback);
}


/**变更租户所有者**/
function changeTenantOwner (data,callback){
  let url = `${serverUrl}tenant/changeTenantOwner.action`;
  BfdRequest.ajaxPostStrData(url,data,callback);
}

/**listUsersByTenantId 某一租户下的全部用户列表（全部用户，包括租户所有者）
 * 根据租户Id查询**/
function getUsersByTenantId(data,callback){
  let url = `${serverUrl}user/listUsersByTenant`;
  BfdRequest.ajaxPostData(url,data,callback);
}

/**获取队列等级**/
function getQueueList(callback){
  let url = `${serverUrl}queue/list.action`;
  BfdRequest.ajaxPostData(url,null,callback);
}



/**是否存在租户**/
function isExistsTenant(data,callback){
  let url = `${serverUrl}tenant/isExistsTenant`;
  BfdRequest.ajaxPostStrData(url,data,callback);
}

/*/!**是否存在租户Id**!/
function isExistTenantId(data,callback){
  let url = `${serverUrl}tenant/isExistsTenantId.action`;
  BfdRequest.ajaxPostStrData(url,data,callback);
}

/!**是否存在租户名称**!/
function isExistTenantName(data,callback){
  let url = `${serverUrl}tenant/isExistsTenantName.action`;
  BfdRequest.ajaxPostStrData(url,data,callback);
}*/

/**查询功能授权**/
function queryFuncAuthority(data,callback){
  let url = `${serverUrl}auth/viewFunctionTreeFirstDir.action`;
  BfdRequest.ajaxPostData(url,data,callback);
}

/**保存功能授权**/
function saveFuncAuthority(data,callback){
  let url = `${serverUrl}auth/assignFunctionTreeFirstDir.action`;
  BfdRequest.ajaxPostData(url,data,callback);
}

/**数据授权：根据租户ID查询hive和hbase策略**/
function queryDataAuthority(data,callback){
  let url = `${serverUrl}policy/tenant/default/policies`;
  BfdRequest.ajaxPostStrData(url,data,callback);
}

/**同时保存hive和hbase策略**/
function saveDataAuthority(data,callback){
  let url = `${serverUrl}policy/savePolicies.do`;
  BfdRequest.ajaxPostStrData(url,data,callback);
}

/**根据数据源查询所有数据库(获取hive数据库)**/
function queryDatabase(data,callback){
  let url = `${serverUrl}policy/hive/database/list.do`;
  //let url = 'http://bdosdev.com/jupiter-project/dataSource/hiveNameSpaces';
  BfdRequest.ajaxPostStrData(url,data,callback);
}

/**查询资源（hive、hbase、hdfs）下拉框用
 * 输入参数：
 resourceType(hive,hbase,hdfs)**/
function queryResource(data,callback){
  let url = `${serverUrl}policy/resource/list.do`;
  //let url = 'http://bdosdev.com/jupiter-project/dataSource/commonResources';
  BfdRequest.ajaxPostStrData(url,data,callback);
}

/**查看租户-数据授权
 * 输入参数：
 **/
function seeDataAuthority(data,callback){
  let url = `${serverUrl}policy/tenant/list.do`;
  BfdRequest.ajaxPostStrData(url,data,callback);
}

export default {
  getTenantList:getTenantList,
  addTenantBaseInfo:addTenantBaseInfo,
  editTenantBaseInfo:editTenantBaseInfo,
  changeTenantOwner:changeTenantOwner,
  getUsersByTenantId:getUsersByTenantId,
  getQueueList:getQueueList,
  isExistsTenant:isExistsTenant,
  /*isExistTenantId:isExistTenantId,
  isExistTenantName:isExistTenantName,*/
  queryFuncAuthority:queryFuncAuthority,
  saveFuncAuthority:saveFuncAuthority,
  queryDataAuthority:queryDataAuthority,
  saveDataAuthority:saveDataAuthority,
  queryDatabase:queryDatabase,
  queryResource:queryResource,
  seeDataAuthority:seeDataAuthority

}