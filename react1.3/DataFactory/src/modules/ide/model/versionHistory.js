import BfdRequest from 'CommonComponent/request/AjaxRequest'

const BASEURL = window.Server.dataFactory;

/**
 * 获取版本历史
 * @param param 参数
 * @param callback  回调函数
 */
function getVersionHistory(param, callback) {
  let url = `${BASEURL}ide/history`
  return BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 获取版本历史
 * @param id 脚本id
 */
function getScriptInfo(param, callback) {
  let url = `${BASEURL}ide/historyContent`
  return BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 回滚代码
 * @param id 脚本id
 */
function rollbackScript(param, callback) {
  let url = `${BASEURL}ide/rollback`
  return BfdRequest.ajaxPost(url, param, callback)
}

export default {
  getVersionHistory: getVersionHistory,
  getScriptInfo: getScriptInfo,
  rollbackScript: rollbackScript,
}