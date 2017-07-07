import {BfdRequest} from 'CommonComponent'
import URL from './url'

/**
 * 获取用户列表
 * */
function getUser(param, callback) {
  let url = URL.getTableUser
  //BfdRequest.ajaxGet(url, callback)
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 添加用户
 * @param userData
 * @param callback
 */
function addUser(param, callback) {
  let url = URL.addUser
  BfdRequest.ajaxPost(url, param, callback)
}


/**
 * 更新用户
 * @param userData
 * @param callback
 */
function updateUser(param, callback) {
  let url = URL.updateUser
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 删除用户
 * @param id
 * @param callback
 */
function delUser(id, callback) {
  let url = URL.delUser
  BfdRequest.ajaxPost(url, {userId: id}, callback)
}

/**
 * 获取角色列表
 * */
function getRole(param, callback) {
  let url = URL.getTableRole
  //BfdRequest.ajaxGet(url, callback)
  BfdRequest.ajaxPost(url, param, callback)
}


/**
 * 添加角色
 * @param param
 * @param callback
 */
function addRole(param, callback) {
  let url = URL.addRole
  BfdRequest.ajaxPost(url, param, callback)
}


/**
 * 更新角色
 * @param param
 * @param callback
 */
function updateRole(param, callback) {
  let url = URL.updateRole
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 删除角色
 * @param id
 * @param callback
 */
function delRole(id, callback) {
  let url = URL.delRole
  BfdRequest.ajaxPost(url, {roleId: id}, callback)
}

/**
 * 授权列表
 * @param param 参数对象
 * @param callback
 */
function authRole(param, callback) {
  let url = URL.authRole
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 提交授权
 * @param param 参数对象
 * @param callback
 */
function grantRole(param, callback) {
  let url = URL.grantRole
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 用户角色, 添加用户
 * @param param 参数对象
 * @param callback
 */
function addUserRole(param, callback) {
  let url = URL.addUserRole
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 用户角色, 添加用户 左边列表
 * @param param 参数对象
 * @param callback
 */
function getAllUser(param, callback) {
  let url = URL.getAllUser
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 用户角色, 添加用户 右边列表
 * @param param 参数对象
 * @param callback
 */
function getRoleUser(param, callback) {
  let url = URL.getRoleUser
  BfdRequest.ajaxPost(url, param, callback)
}

export default {
  getUser: getUser,
  addUser: addUser,
  updateUser: updateUser,
  delUser: delUser,

  getRole: getRole,
  addRole: addRole,
  updateRole: updateRole,
  delRole: delRole,

  authRole: authRole,
  grantRole: grantRole,

  addUserRole: addUserRole,
  getAllUser: getAllUser,
  getRoleUser: getRoleUser,
}