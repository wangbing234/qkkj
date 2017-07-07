/***************************************************
 * 时间: 2016/7/21 15:46
 * 作者: bing.wang
 * 说明: 数据权限ajax
 *
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest.js'
import message from 'CommonComponent/component/bdosmessage'

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function deletePolicy(param,successHandle) {
  let url=Server.securityCenterAegis+`policy/delete.do`;
  BfdRequest.ajaxPostStrData(url,param,successHandle);
}


/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function addPolicy(param,successHandle) {
  let url=Server.securityCenterAegis+"policy/add.do";
  BfdRequest.ajaxPostStrData(url,param,successHandle);
}


/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function listPolicysByThree(param,successHandle) {
  let url=Server.securityCenterAegis+"policy/tenant/list.do";
  BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function listPolicyByRole(param,successHandle) {
  let url=Server.securityCenterAegis+"policy/listPolicyByRole.do";
  BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function listPolicysUserByThree(param,successHandle) {
  let url=Server.securityCenterAegis+"policy/user/list.do";
  BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function listRolesByTenant(param,successHandle) {
  let urlAll=`${Server.securityCenterAegis}role/listRolesByTenant`;
  BfdRequest.ajaxPostStrData(urlAll,param,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function listUsersByTenant(param,successHandle) {
  let urlAll=`${Server.securityCenterAegis}user/listUsersByTenant`;
  BfdRequest.ajaxPostStrData(urlAll,param,successHandle);
}


/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function listTenantUsersNotTenantOwner(param,successHandle) {
  let urlAll=`${Server.securityCenterUser}user/listTenantUsersNotTenantOwner`;
  BfdRequest.ajaxPostStrData(urlAll,param,successHandle);
}




export default {
  deletePolicy,
  listPolicysByThree,
  listPolicysUserByThree,
  listRolesByTenant,
  addPolicy,
  listPolicyByRole,
  listTenantUsersNotTenantOwner,
  listUsersByTenant
}