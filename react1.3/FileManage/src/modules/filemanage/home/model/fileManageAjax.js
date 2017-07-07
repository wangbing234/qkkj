import BfdRequest from 'CommonComponent/request/AjaxRequest'

const BASE = window.Server.fileManage

/** *******************************************************
 * 查询文件列表
 * getListData(path,callback)   //根据路径获取数据列表
 * getListData(path,fileName,callback)   //根据路径和文件名
 * @param flag 是否使用 Loading 效果
 *********************************************************/
function getListData(path, fileName, successCallback, errorCallback, flag, pageSize, currentPage) {
  let url = `${BASE}hdfs/browser`
  return BfdRequest.ajaxPost(url, {
    path: path,
    fileName: fileName,
    pageSize: pageSize,
    currentPage: currentPage
  }, successCallback, errorCallback, flag)
}

/** *******************************************************
 * 判断文件是否存在
 * @param path 路径
 * @param fileName 文件名
 * @param callback 回调函数
 *********************************************************/
function checkFileExist(path, fileName, callback) {
  let url = `${BASE}hdfs/checkFileExsit`
  return BfdRequest.ajaxPost(url, {
    path: path,
    fileName: fileName
  }, callback)
}

/** *******************************************************
 * 同步检查文件是否文件
 * @param path 路径
 * @param fileName 文件名
 *********************************************************/
function checkAsyncFileExist(path, fileName) {
  let url = `${BASE}hdfs/checkFileExsit`
  let result = BfdRequest.ajaxAsyncPost(url, {path: path, fileName: fileName}).responseJSON
  return result.data
}

/** *******************************************************
 * 同步检查是否有写权限 [ 及上传权限 ]
 * @param path 路径
 *********************************************************/
function checkAsyncFileWrite(path) {
  let url = `${BASE}hdfs/checkFileWrite`
  let result = BfdRequest.ajaxAsyncPost(url, {path: path}).responseJSON
  return result.data
}

/** *******************************************************
 * 检查是否有权限下载文件
 * @param path 路径 (路径+文件名)
 * @param callback 回调函数
 *********************************************************/
function checkFileDownload(path, callback) {
  let url = `${BASE}hdfs/checkFileDownload`
  return BfdRequest.ajaxPost(url, {
    path: path
  }, callback)
}

/** *******************************************************
 * 添加文件夹
 * @param path
 * @param fileName
 * @param callback
 *********************************************************/
function addDir(path, fileName, callback) {
  let url = `${BASE}hdfs/mkdirToHdfs`
  return BfdRequest.ajaxPost(url, {
    path: path,
    newPath: fileName
  }, callback)
}

/** *******************************************************
 * 重命名文件夹
 * @param path 路径
 * @param oldPath 旧文件名
 * @param newPath 新文件名
 * @param callback 回调
 *********************************************************/
function renameDir(path, oldPath, newPath, callback) {
  let url = `${BASE}hdfs/renameToHdfs`
  return BfdRequest.ajaxPost(url, {
    path: path,
    oldPath: oldPath,
    newPath: newPath
  }, callback)
}

/** *******************************************************
 * 下载指定目录下的文件
 * @param path
 * @param callback
 *********************************************************/
function downloadFromHdfs(path, fileName) {
  var newTab = window.open('about:blank')
  path = `${path}/${fileName}`
  checkFileDownload(path, function (result) {
    if (result.data) {
      let url = `${BASE}hdfs/downloadFromHdfs`
      url += '?path=' + path
      newTab.location.href = url;
    }
  })
}

/**
 * 返回上传文件的目录
 * @returns {*}
 */
function getUploadUrl() {
  return `${BASE}hdfs/uploadToHdfs`;
}

/** *******************************************************
 * 删除指定目录下的文件或者文件夹
 * @param path
 * @param callback
 *********************************************************/
function deleteHdfs(path, fileName, callback) {
  let url = `${BASE}hdfs/deleteHdfs`
  path = `${path}/${fileName}`
  return BfdRequest.ajaxPost(url, {
    path: path
  }, callback)
}

/**
 * 检查文件是否有写的权限
 * */
function checkFileWrite(path, callback) {
  let url = `${BASE}hdfs/checkFileWrite`
  return BfdRequest.ajaxPost(url, {path: path}, callback)
}


export default {
  getListData: getListData,
  checkFileExist: checkFileExist,
  checkAsyncFileExist: checkAsyncFileExist,
  checkAsyncFileWrite: checkAsyncFileWrite,
  renameDir: renameDir,
  downloadFromHdfs: downloadFromHdfs,
  deleteHdfs: deleteHdfs,
  addDir: addDir,
  checkFileDownload: checkFileDownload,
  checkFileWrite: checkFileWrite,
  getUploadUrl: getUploadUrl,
}