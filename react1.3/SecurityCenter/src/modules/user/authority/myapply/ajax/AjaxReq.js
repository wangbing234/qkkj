/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:我的申请Ajax
 *
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest'
import message from 'CommonComponent/component/bdosmessage'

/**
 * 获取审批列表
 * @param param
 * @param successHandle
 */
function authApproveList(param,successHandle) {
  let url=`${Server.securityCenterAegis}authApprove/apply/list`;
  BfdRequest.ajaxPost(url,param,successHandle);
}


/**
 * 获取申请详细信息
 * @param param
 * @param successHandle
 */
function applyDetailInfo(param,successHandle) {
  let url=`${Server.securityCenterAegis}authApprove/apply/info`;
  BfdRequest.ajaxPost(url,param,successHandle,null,false);
}


/**
 * 获取审批列表
 * @param param
 * @param successHandle
 */
function listHiveResource(param,successHandle) {
  let url=`${Server.dataSource}commonResources?typeName=${param}`;
  BfdRequest.ajaxGetData(url,successHandle,null,false);
}

export default {
  authApproveList,
  listHiveResource,
  applyDetailInfo
}