/***************************************************
 * 时间: 2016/7/21 15:19
 * 作者: bing.wang
 * 说明: ajax类
 *
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest.js'
import message from 'CommonComponent/component/bdosmessage'

/**
 * 查询租户资源树
 * @param param
 * @param successHandle
 */
function viewTenantOwnerResourceTree(param,successHandle) {
  let url=Server.securityCenterAegis+"auth/viewTenantOwnerResourceTree";
  BfdRequest.ajaxPostStrData(url,null,successHandle);
}

/**获取用户角色**/
function getRoles(param,successHandle){
  let url=Server.securityCenterAegis+"auth/getRoleNamesByResourceId";
  BfdRequest.ajaxPostData(url,param,successHandle);
}

/**获取用户**/
function getUsers(param,successHandle){
  let url=Server.securityCenterAegis+"auth/getUserNamesByResourceId";
  BfdRequest.ajaxPostData(url,param,successHandle);
}

export default {
  viewTenantOwnerResourceTree,
  getRoles,
  getUsers
}