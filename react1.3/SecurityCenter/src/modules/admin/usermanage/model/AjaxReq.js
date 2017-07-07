import BfdRequest from 'CommonComponent/request/AjaxRequest'

const serverUrl = window.Server.securityCenterAegis;
/**
 * 用户list
 * **/
function getUserList (data,callback){
  let url = `${serverUrl}user/list` ;
  //方法名：listByAdmin
  return BfdRequest.ajaxPostData(url, data, callback)
}


/**所有租户列表**/
function getTenantList(callback){
  let url = `${serverUrl}tenant/listAll.action`;
  //方法名：listAll
  return BfdRequest.ajaxGetData(url,callback);
}

/**新增用户**/
function addUser(data,callback){
  let url = `${serverUrl}user/add.action`;
  BfdRequest.ajaxPostData(url,data,callback);
}

/**编辑用户 edit 编辑时，传递一个type类型，如果为0表示编辑，1表示禁用，2表示启用，
 * 3表示重置密码，4表示解锁**/
function editUser(data,callback){
  let url = `${serverUrl}user/edit.action`;
  BfdRequest.ajaxPostData(url,data,callback);
}

/**变更租户**/
function changeTenant(data,callback){
  let url = `${serverUrl}auth/changeTenant.action`;
  //方法名：changeTenant
  BfdRequest.ajaxPostData(url,data,callback);
}

/**用户名是否重复**/
function userIsExist(data,callback){
  let url = `${serverUrl}user/isExistsUserName.action`;
  BfdRequest.ajaxPostData(url,data,callback,null,null,false);
}

/**
 * 启用禁用
 * @param param
 * @param successHandle
 */
function changeStatus(param,successHandle) {
  let url=`${serverUrl}user/changeStatus`;
  BfdRequest.ajaxPost(url,param,successHandle);
}


/**
 * 启用禁用
 * @param param
 * @param successHandle
 */
function changePassword(param,successHandle) {
  let url=`${serverUrl}user/changePassword`;
  BfdRequest.ajaxPost(url,param,successHandle);
}
//

export default {
  getUserList:getUserList,
  getTenantList:getTenantList,
  addUser:addUser,
  editUser:editUser,
  changeStatus,
  changePassword,
  changeTenant:changeTenant,
  userIsExist:userIsExist
}