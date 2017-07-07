/***************************************************
 * 时间: 2016/7/21 15:57
 * 作者: bing.wang
 * 说明: 用户ajax
 *
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest.js'
import message from 'CommonComponent/component/bdosmessage'

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function assignUserFunctionTree(param,successHandle) {
    let url=`${Server.securityCenterAegis}auth/assignUserFunctionTree`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 功能权限列表
 * @param param
 * @param successHandle
 */
function viewRoleFunctionTree(param,successHandle) {
    let url=`${Server.securityCenterAegis}auth/viewRoleFunctionTree`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 给角色赋值资源权限
 * @param param
 * @param successHandle
 */
function viewRoleResourceTree(param,successHandle) {
    let url=`${Server.securityCenterAegis}auth/viewRoleResourceTree`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}


/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function assignRoleFunctionTree(param,successHandle) {
    let url=`${Server.securityCenterAegis}auth/assignRoleFunctionTree`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function assignUserResourceTree(param,successHandle) {
    let url=`${Server.securityCenterAegis}auth/assignUserResourceTree`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function listRolesByTenant(param,successHandle) {
    let url=`${Server.securityCenterAegis}role/listRolesByTenant`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function listByTenant(param,successHandle) {
    let url=`${Server.securityCenterAegis}user/listByTenant`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

function isExistsUserName(params,successHandle) {
    let url=`${Server.securityCenterAegis}user/isExistsUserName`;
    BfdRequest.ajaxAsyncPost(url,{data: JSON.stringify(params)},successHandle).responseJSON;
}

/**
 * 启用禁用
 * @param param
 * @param successHandle
 */
function changeStatus(param,successHandle) {
    let url=`${Server.securityCenterAegis}user/changeStatus`;
    BfdRequest.ajaxPost(url,param,successHandle);
}


/**
 * 启用禁用
 * @param param
 * @param successHandle
 */
function changePassword(param,successHandle) {
    let url=`${Server.securityCenterAegis}user/changePassword`;
    BfdRequest.ajaxPost(url,param,successHandle);
}

/**
 * 编辑用户 edit 编辑时
 * @param param
 * @param successHandle
 */
function editUser(param,successHandle) {
    let url=`${Server.securityCenterAegis}user/editUserPointRole`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function viewUserFunctionTree(param,successHandle) {
    let url=`${Server.securityCenterAegis}auth/viewUserFunctionTree`;
    BfdRequest.ajaxPostData(url,param,successHandle);
}

function viewRoleFunctionTree(param,successHandle) {
    let url=`${Server.securityCenterAegis}auth/viewRoleFunctionTree`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}


/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function viewUserResourceTree(param,successHandle) {
    let url=`${Server.securityCenterAegis}auth/viewUserResourceTree`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function listRolesByUserName(param,successHandle) {
    let url=`${Server.securityCenterAegis}role/listRolesByUserName`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**新增用户**/
function addUser(param,callback){
    let url = `${Server.securityCenterAegis}user/add`;
    BfdRequest.ajaxPostStrData(url,param,callback);
}

/**
 * 给角色赋值资源权限
 * @param param
 * @param successHandle
 */
function assignRoleResourceTree(param,successHandle) {
    let url=`${Server.securityCenterAegis}auth/assignRoleResourceTree`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}


export default {
    assignUserFunctionTree,
    assignUserResourceTree,
    assignRoleResourceTree,
    assignRoleFunctionTree,
    listRolesByTenant,
    listByTenant,
    editUser,
    changeStatus,
    changePassword,
    addUser,
    viewRoleFunctionTree,
    viewRoleResourceTree,
    viewUserFunctionTree,
    viewUserResourceTree,
    listRolesByUserName,
    isExistsUserName
}