import BfdRequest from 'CommonComponent/request/AjaxRequest.js'
import message from 'CommonComponent/component/bdosmessage'
/*获取资源类型*/
function getResourceTypes(successHandle,faultHandle) {
    var typeUrl = `${Server.configCenter}configCenterApi/getResourceTypes`;
    BfdRequest.ajaxGet(typeUrl,successHandle,faultHandle)
}

/*获取新增/编辑资源类型*/
function getSubTypes(successHandle,faultHandle) {
    var typeUrl = `${Server.configCenter}configCenterApi/getSubTypes`;
    BfdRequest.ajaxGet(typeUrl,successHandle,faultHandle)
}

/*获取当前用户名*/
function getUserName(successHandle,faultHandle) {
    var typeUrl = `${Server.configCenter}configCenterApi/getUserName`;
    BfdRequest.ajaxGet(typeUrl,successHandle,faultHandle)
}

function handSessionLose(){
    message.danger('Session失效,请重新登录!', function () {
        top.location.href=Server.sessionLose;
    })
}

/*获取资源列表*/
function getResourceList(currentPage,pageSize,resourceId,resourceName,successHandle,faultHandle) {
    var listUrl = `${Server.configCenter}configCenterApi/getConfigCenterByQuery/${currentPage}/${pageSize}?resourceType=${resourceId}`;
    if(resourceName){
        listUrl += `&resourceName=${resourceName}`;
    }
    BfdRequest.ajaxGet(listUrl,successHandle,faultHandle);
}

/*删除某个资源*/
function deleteResourceItem(item,successHandle,faultHandle) {
    var delUrl = `${Server.configCenter}configCenterApi/deleteConfigCenterByIds/${item.id}`;
    BfdRequest.ajaxPost(delUrl,null,successHandle,faultHandle);
}

/*检查hive是否已经配置*/
function checkHive(resourceId,successHandle,faultHandle) {
    var url = `${Server.configCenter}configCenterApi/getConfigCenterByQuery/0/13?resourceType=${resourceId}`;
    BfdRequest.ajaxGet( url,successHandle,faultHandle);
}

/*保存资源配置*/
function saveResourceConfig(param,successHandle,faultHandle) {
    var typeUrl = Server.configCenter+"configCenterApi/saveConfigCenter";
    BfdRequest.ajaxPost( typeUrl, param,successHandle,faultHandle);
}

/*测试连接*/
function testConfigConnect(param,successHandle,faultHandle) {
    var typeUrl = Server.configCenter+"configCenterApi/testConfigCenterById";
    BfdRequest.ajaxPost( typeUrl, param,successHandle,faultHandle);
}

/*获取集群数组*/
function getJiqun(successHandle,faultHandle) {
    var typeUrl = Server.configCenter+"configCenterApi/getResourceConfigList/zookeeper";
    BfdRequest.ajaxGet(typeUrl,successHandle,faultHandle);
}

export default {
    getResourceTypes,
    getSubTypes,
    getUserName,
    getResourceList,
    deleteResourceItem,
    checkHive,
    saveResourceConfig,
    testConfigConnect,
    getJiqun
}