/***************************************************
 * 时间: 2016/7/21 15:51
 * 作者: bing.wang
 * 说明: 基本信息ajax
 *
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest.js'
import message from 'CommonComponent/component/bdosmessage'

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function getTenantInfo(param,successHandle) {
    let url=Server.securityCenterAegis+`tenant//getTenantInfo`;
    BfdRequest.ajaxPostStrData(url,null,successHandle);
}

export default {
    getTenantInfo
}