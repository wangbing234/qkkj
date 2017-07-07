/****************************************************
 * create by qing.feng
 * time 2016/8/1 16:40
 * desc：公用组件的请求
*****************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest'

/*获取已经授权的租户列表*/
function getAuthorizedTenantList(param,successFunc){
  let url = `${Server.dataManager}shareData/getAuthTenant`;
  return BfdRequest.ajaxPost(url, param, successFunc);
}

export default {
  getAuthorizedTenantList
}