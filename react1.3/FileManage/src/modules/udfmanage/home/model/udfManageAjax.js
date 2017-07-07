import BfdRequest from 'CommonComponent/request/AjaxRequest'

const BASE = window.Server.fileManage
/**
 * 获取UDF列表
 * */
function getUdf(param, callback) {
  let url = `${BASE}ide/task/udfPage`
  return BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 删除UDF
 * @param udfId udfId
 * @param isDeleteJar 是否删除Jar包
 * @param callback
 */
function delUdf(udfId, isDeleteJar, callback) {
  let url = `${BASE}ide/task/udfDel`
  return BfdRequest.ajaxPost(url, {ids: udfId, delJar: isDeleteJar}, callback)
}

/**
 * 判断UDF名是否重复
 * @param udfName 校验文件名
 * @param id 编辑的时候传id, 新增不传
 * @param callback
 */
function validateUdfName(udfName, id) {
  let url = `${BASE}ide/task/udfCheck`
  let result = BfdRequest.ajaxAsyncPost(url, {
    name: udfName,
    id: id
  }).responseJSON;
  return result.data;
}

/**
 * 判断文件名是否重复
 * @param fileName 文件名是否重复
 */
function udfCheckFile(fileName) {
  let url = `${BASE}ide/task/udfCheckFile`
  let result = BfdRequest.ajaxAsyncPost(url, {fileName: fileName}).responseJSON
  return result.data
}

/**
 * 回显
 * @param id
 * @param callback
 */
function udfView(id, callback) {
  let url = `${BASE}ide/task/udfView`
  return BfdRequest.ajaxPost(url, {id: id}, callback)
}

/**
 * 添加
 * @param id
 * @param callback
 */
function addUdf(param, callback) {
  let url = `${BASE}ide/task/udfAdd`
  return BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 添加
 * @param id
 * @param callback
 */
function updateUdf(param, callback) {
  let url = `${BASE}ide/task/udfUpdate`
  return BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 获取Jar包列表
 * @param id
 * @param callback
 */
function udfListJar(callback) {
  let url = `${BASE}ide/task/udfListJar`
  return BfdRequest.ajaxPost(url, {}, callback, null, false)
}

/**
 * 获取库名
 * @param id
 * @param callback
 */
function udfHiveDb(callback) {
  let url = `${BASE}dataSource/hiveNameSpaces`
  return BfdRequest.ajaxPost(url, {}, callback, null, false)
}

/**
 * 获取上传文件的目录
 * @returns {*}
 */
function getUploadSrc() {
  return `${BASE}ide/task/udfUpload`;
}

/**
 * 判断是否有权限上传UDF
 */
function udfCheckPermission() {
  let url = `${BASE}ide/task/udfCheckPermission`
  let result = BfdRequest.ajaxAsyncPost(url, {}).responseJSON;
  return result.data;
}

export default {
  getUdf: getUdf,
  delUdf: delUdf,
  udfCheckFile: udfCheckFile,
  udfView: udfView,
  addUdf: addUdf,
  updateUdf: updateUdf,
  udfListJar: udfListJar,
  udfHiveDb: udfHiveDb,
  validateUdfName: validateUdfName,
  getUploadSrc: getUploadSrc,
  udfCheckPermission: udfCheckPermission
}