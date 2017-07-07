/***************************************************
 * 时间: 2016/7/20 14:51
 * 作者: lijun.feng
 * 说明:
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest'

const serverUrl = window.Server.securityCenterAegis;

/**获取数据审计列表**/
function getDataAuditList(data,callback){
  let url = `${serverUrl}audit/data/list.do`;
  return BfdRequest.ajaxPostStrData(url,data,callback);
}

/**获取平台审计列表**/
function getPlateformAuditList(data,callback){
  let url = `${serverUrl}audit/platform/list.do`;
  return BfdRequest.ajaxPostStrData(url,data,callback);
}

export default {
  getDataAuditList:getDataAuditList,
  getPlateformAuditList:getPlateformAuditList
}