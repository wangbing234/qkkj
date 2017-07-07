/***************************************************
 * 时间: 7/25/16 19:58
 * 作者: zhongxia
 * 说明: Header组件,
 *
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest'

const BASEURL = window.Server.securityCenterUser;
//const BASEURL = 'http://bdosdev.com/aegis-user/';

//const _currentUser = {userName: 'jupiter'}//window._currentUser.userName;   //当前用户


//--------------联调:召新  START-----------------------
/**
 * 获取用户的所有信息
 */
function getUserAllInfo(callback) {
  var url = `${BASEURL}oauth/token/getUser`;
  BfdRequest.ajaxAsyncPost(url, {}, callback, null, false)
}


//--------------联调:占位  START-----------------------
/**
 * 获取用户信息
 */
function getUserInfo(userName, callback) {
  var url = `${BASEURL}user/getUserByName`;
  //var url = `http://192.168.172.177:8080/aegis-user/user/getUserByName`;
  BfdRequest.ajaxPost(url, {
      userName: userName
    },
    callback
  )
}

/**
 * 更新用户信息
 * @param param
 * @param callback
 */
function updateUserInfo(param, callback) {
  var url = `${BASEURL}user/edit`;
  //var url = `http://192.168.172.177:8080/aegis-user/user/edit`;
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 修改密码
 * @param param
 * @param callback
 */
function changePassword(param, callback) {
  var url = `${BASEURL}user/changePassword`;
  BfdRequest.ajaxPost(url, param, callback)
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
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 删除Accesskey
 * @param id
 * @param callback
 */
function delAccesskey(id, callback) {
  var url = `${BASEURL}access/delete`;
  //var url = `http://192.168.172.233:8080/aegis-user/access/delete`;
  BfdRequest.ajaxPost(url, {
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
  BfdRequest.ajaxPost(url, {
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
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 生成AccessKey
 * @param id
 * @param callback
 */
function generateAccesskey(param, callback) {
  var url = `${BASEURL}access/generate`;
  //var url = `http://192.168.172.233:8080/aegis-user/access/generate`;
  BfdRequest.ajaxPost(url, param, callback)
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