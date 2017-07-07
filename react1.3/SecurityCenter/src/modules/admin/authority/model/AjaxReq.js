import BfdRequest from 'CommonComponent/request/AjaxRequest'

const serverUrl = window.Server.securityCenterAegis;


/**超级管理员查看功能权限**/
function queryFuncTree(callback){
  let url = `${serverUrl}auth/viewFunctionTree`;
  return BfdRequest.ajaxPostData(url,null,callback);
}

/**查询所有的策略 表格用
 * policyName (策略名称)
   resourceType(策略类型：hive，hbase，hdfs)**/
function queryPolicy(data,callback){
  let url = `${serverUrl}policy/listPolicies.do`;
  return BfdRequest.ajaxPostStrData(url,data,callback);
}

/**查询资源（hive、hbase、hdfs）下拉框用
 * 输入参数：
 resourceType(hive,hbase,hdfs)**/
function queryResource(data,callback){
  let url = `${serverUrl}policy/resource/list.do`;
  BfdRequest.ajaxPostStrData(url,data,callback);
}

/**新增策略或修改策略新增id=0**/
function savePolicy(data,callback){
  let url = `${serverUrl}policy/add.do`;
  BfdRequest.ajaxPostStrData(url,data,callback);
}

/**
 * 租户list含分页 hdfs新增用（授权对象下拉框）
 * **/
function getTenantList (data,callback){
  let url = `${serverUrl}tenant/list` ;
  //方法名：list
  BfdRequest.ajaxPostData(url, data, callback)
}


/**
 * 删除策略
 * 输入参数：id
 * **/
function deletePolicy (data,callback){
  let url = `${serverUrl}policy/delete.do` ;
  BfdRequest.ajaxPostStrData(url, data, callback)
}

/**
 * 判断策略名称是否重名
 * 输入参数：策略名称
 * **/
function isExistPolicyName (data,callback){
  let url = `${serverUrl}policy/isExistsPolicyName` ;
  BfdRequest.ajaxPostStrData(url, data, callback)
}

/**
 * 获取权限审批列表
 * **/
function getApprovalList (data,callback){
  let url = `${serverUrl}authApprove/apply/list` ;
  return BfdRequest.ajaxPost(url, data, callback)
}


/**
 * 权限审批
 * **/
function approval (data,callback){
  let url = `${serverUrl}authApprove/approve` ;
  BfdRequest.ajaxPost(url, data, callback)
}

/**
 * 审批详情
 * **/
function approvalInfo (data,callback){
  let url = `${serverUrl}authApprove/apply/info` ;
  BfdRequest.ajaxPost(url, data, callback)
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function listResourceByType(dbType,successHandle){
  let url=Server.dataSource+`commonResources?typeName=${dbType}`;
  BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function addHasPolicyToThis(data,successHandle){
  let url = `${serverUrl}authApprove/approvePolicy`;
  BfdRequest.ajaxPost(url,data,successHandle);
}


export default {
  queryFuncTree:queryFuncTree,
  queryPolicy:queryPolicy,
  queryResource:queryResource,
  savePolicy:savePolicy,
  getTenantList:getTenantList,
  deletePolicy:deletePolicy,
  getApprovalList:getApprovalList,
  approval:approval,
  approvalInfo,
  listResourceByType,
  isExistPolicyName:isExistPolicyName,
  addHasPolicyToThis
}