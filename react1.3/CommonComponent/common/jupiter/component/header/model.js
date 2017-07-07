/***************************************************
 * 时间: 7/25/16 19:58
 * 作者: zhongxia
 * 说明: Header组件,
 *
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest'

const BASEURL = window.Server.securityCenterUser;
//const BASEURL = 'http://bdosdev.com/aegis-user/';

//--------------联调:召新  START-----------------------
/**
 * 获取用户的所有信息
 */
function getUserAllInfo(callback) {
  var url = `${BASEURL}oauth/token/getUser`;
  return BfdRequest.ajaxAsyncPost(url, {}, callback, null, false)
}


//--------------联调:占位  START-----------------------
/**
 * 获取用户信息
 */
function getUserInfo(userName, callback) {
  var url = `${BASEURL}user/getUserByName`;
  //var url = `http://192.168.172.177:8080/aegis-user/user/getUserByName`;
  return BfdRequest.ajaxPost(url, {
    userName: userName
  }, callback)
}

/**
 * 更新用户信息
 * @param param
 * @param callback
 */
function updateUserInfo(param, callback) {
  var url = `${BASEURL}user/edit`;
  //var url = `http://192.168.172.177:8080/aegis-user/user/edit`;
  return BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 修改密码[只需要传用户名和新密码,不需要传旧密码,因为后端不用做验证, 和产品确定过了]
 * @param param
 * @param callback
 */
function changePassword(param, callback) {
  var url = `${BASEURL}user/changePassword`;
  return BfdRequest.ajaxPost(url, param, callback)
}


/**
 * 验证用户密码是否正确
 * @param userName 用户名称
 * @param password 密码
 * @param callback
 */
function validatePassword(userName, password) {
  var url = `${BASEURL}user/validatePassword`;
  //var url = `http://192.168.172.177:8080/aegis-user/user/validateOldPassword`;
  let result = BfdRequest.ajaxAsyncPost(url, {
    userName: userName,
    userPassword: password
  }, null, null, false).responseJSON;
  return result && result.data;
}


//--------------联调:小鱼-----------------------
/**
 * 获取AccessKey
 * @param param 参数
 */
function getAccessKey(param, callback) {
  var url = `${BASEURL}access/list`;
  //var url = `http://192.168.172.233:8080/aegis-user/access/list`;
  return BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 删除Accesskey
 * @param id
 * @param callback
 */
function delAccesskey(id, callback) {
  var url = `${BASEURL}access/delete`;
  //var url = `http://192.168.172.233:8080/aegis-user/access/delete`;
  return BfdRequest.ajaxPost(url, {
    id: id
  }, callback)
}

/**
 * 删除禁用
 * @param id
 * @param callback
 */
function updateAccesskey(id, status, callback) {
  var url = `${BASEURL}access/update`;
  //var url = `http://192.168.172.233:8080/aegis-user/access/update`;
  return BfdRequest.ajaxPost(url, {
    id: id,
    status: status
  }, callback)
}

/**
 * 生成AccessKey
 * @param id
 * @param callback
 */
function createAccesskey(param, callback) {
  var url = `${BASEURL}access/create`;
  //var url = `http://192.168.172.233:8080/aegis-user/access/create`;
  return BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 生成AccessKey
 * @param id
 * @param callback
 */
function generateAccesskey(param, callback) {
  var url = `${BASEURL}access/generate`;
  //var url = `http://192.168.172.233:8080/aegis-user/access/generate`;
  return BfdRequest.ajaxPost(url, param, callback)
}


export default {
  getUserAllInfo,

  getUserInfo,
  updateUserInfo,
  validatePassword,
  changePassword,

  getAccessKey,
  delAccesskey,
  updateAccesskey,
  generateAccesskey,
  createAccesskey
}