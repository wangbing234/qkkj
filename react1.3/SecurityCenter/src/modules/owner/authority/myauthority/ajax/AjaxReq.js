/***************************************************
 * 时间: 2016/7/21 15:46
 * 作者: bing.wang
 * 说明: 我的权限ajax
 *
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest'
import message from 'CommonComponent/component/bdosmessage'

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function listPolicysByThree(param,successHandle) {
  let url=Server.securityCenterAegis+"policy/listPolicyByTenant.do";
  BfdRequest.ajaxPostStrData(url,param,successHandle);
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
function listResourceByType(dbType,successHandle){
  let url=Server.dataSource+`commonResources?typeName=${dbType}`;
  BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function viewTenantOwnerMyResourceTree(parms,successHandle){
  let url=Server.securityCenterAegis+"auth/viewTenantOwnerMyResourceTree";
  BfdRequest.ajaxPostStrData(url,parms,successHandle);
}

/**
 * 资源权限树
 * @param param
 * @param successHandle
 */
function applyAuth(param,successHandle) {
  let url=`${Server.securityCenterAegis}authApprove/apply/create`;
  BfdRequest.ajaxPost(url,param,successHandle);
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
 * 判断对应的数据库是否正确
 * @param param
 * @param successHandle
 */
function checkIfExists(param,successHandle){
  let url=Server.securityCenterAegis+`policy/database/checkIfExists`;
  BfdRequest.ajaxAsyncPost(url,param,successHandle);
}


export default {
  listPolicysByThree,
  listHiveatabase,
  listHbaseDatabase,
  listResourceByType,
  viewTenantOwnerMyResourceTree,
  applyAuth,
  checkIfExists
}