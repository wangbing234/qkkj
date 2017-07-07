/***************************************************
 * 时间: 7/28/16 17:14
 * 作者: zhongxia
 * 说明: IDE的所有相关接口
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest'
import Util from 'CommonComponent/utils/CommonUtil'

//let projectCode = 'dff06c5e55dd402192b5862d6ddca6a1'
const BASEURL = window.Server.dataFactory;
const SECUTRITYBASEURL = window.Server.securityCenterUser;
//const BASEURL = "http://192.168.164.175:8080/";  //wf

/*----------------------左侧树功能接口 START----------------------------*/
/**
 * 获取脚本树
 * @param name 脚本名称 [目前接口没有查询功能]
 * @param callback 回调函数
 */
function getScriptsTree(name, callback) {
  let url = `${BASEURL}ide/folder/tree`
  //let url = `http://192.168.164.175:8080/ide/folder/tree`
  return BfdRequest.ajaxPost(url, {
    projectCode: projectCode
  }, callback, null, false)
}

/**
 * 获取数据库表树[联调:wf]
 * @param name 表格名称[目前接口没有查询功能]
 * @param callback 回调函数
 */
function getTablesTree(name, callback) {
  let url = `${BASEURL}tableDayManager/getTableTree`;
  return BfdRequest.ajaxPost(url, {
    projectCode: projectCode//'ce83f89ec2594ef79e93ab0420e2475a'
  }, callback, null, false)
}

/**
 * 获取UDF列表
 * @param name UDF名称[目前接口没有查询功能]
 * @param callback 回调函数
 */
function getUDFList(name, callback) {
  let url = `${BASEURL}ide/task/udfList`;
  return BfdRequest.ajaxPost(url, {
    projectCode: projectCode
  }, callback, null, false)
}

/**
 * 获取脚本列表
 * @param type 脚本类型
 * @param pid 目录id
 * @param limit 每页显示条数
 * @param pageNum 当前页数
 * @param callback 回调函数
 */
function getScriptlist(type, pid, limit, pageNum, callback) {
  let url = `${BASEURL}ide/task/list`;
  //let url = `http://192.168.164.175:8080/ide/task/list`
  return BfdRequest.ajaxPost(url, {
    projectCode: projectCode,
    typeCode: type,
    limit: limit,
    pid: pid,
    pageNum: pageNum
  }, callback)
}

/**
 * 获取脚本类型
 * @param callback 回调函数
 */
function getScriptTypes(callback) {
  let url = `${BASEURL}ide/task/types`;
  return BfdRequest.ajaxPost(url, {}, callback, null, false)
}


/*----------------------脚本列表功能接口 START----------------------------*/

/**
 * 导入脚本文件 [TODO:替换地址]
 * @param treeCode 树节点code
 * @param exportType 导出类型  general 最新版本 publish 发布版本
 * @param callback 回调函数
 */
function getImportUrl() {
  return `${BASEURL}ideExport/imp`
  //return `http://192.168.172.229:8080/jupiter-project/ideExport/imp`
}

/**
 * 导出脚本
 * @param treeCode 树节点code
 * @param exportType 导出类型  general 最新版本 publish 发布版本
 * @param callback 回调函数
 */
function exportScript(treeCode, exportType, callback) {
  let newTab = window.open('about:blank')
  let url = `${BASEURL}ideExport/exp`
  let param = {
    projectCode: projectCode,
    exportType: exportType,
    treeCode: treeCode || '',
  };
  url += '?' + Util.objectToURL(param)
  newTab.location.href = url;
}

/**
 * 导出脚本(脚本列表)
 * @param treeCode 树节点code
 * @param exportType 导出类型  general 最新版本 publish 发布版本
 * @param callback 回调函数
 */
function exportScriptList(codes, exportType, callback) {
  let newTab = window.open('about:blank')
  let url = `${BASEURL}idExport/expList`
  let param = {
    projectCode: projectCode,
    exportType: exportType,
    codes: codes || [],
  };
  url += '?' + Util.objectToURL(param)
  newTab.location.href = url;
}


/**
 * 删除脚本
 * @param code 脚本code标识, 是一个数组
 * @param callback
 */
function deleteScript(code, callback) {
  let url = `${BASEURL}ide/task/delete`
  return BfdRequest.ajaxPost(url, {
    codes: code
  }, callback)
}

/**
 * 删除脚本树节点
 * @param code 脚本code标识
 * @param callback
 */
function deleteScriptTree(code, callback) {
  let url = `${BASEURL}ide/folder/delete`
  return BfdRequest.ajaxPost(url, {
    code: code
  }, callback)
}


/**
 * 发布脚本
 * @param taskCodes 脚本标识
 * @param callback
 */
function publishScript(taskCodes, callback) {
  let url = `${BASEURL}ide/publish`
  return BfdRequest.ajaxPost(url, {
    taskCodes: taskCodes
  }, callback)
}

/**
 * 锁定脚本
 */
function lockScript(code, callback) {
  let url = `${BASEURL}ide/task/lock`
  return BfdRequest.ajaxPost(url, {
    code: code
  }, callback)
}

/**
 * 发布脚本
 * @param id 脚本id
 * @param callback
 */
function unlockScript(code, callback) {
  let url = `${BASEURL}ide/task/unlock`
  return BfdRequest.ajaxPost(url, {
    code: code
  }, callback)
}

/**
 * 获取脚本信息
 * @param id
 * @param callbak
 */
function getScriptInfo(id, callback) {
  let url = `${BASEURL}ide/task/show`
  return BfdRequest.ajaxPost(url, {
    code: id
  }, callback, null, false)
}

/**
 * 获取UDF信息
 * @param id
 * @param callbak
 */
function getUDFInfo(id, callback) {
  let url = `${BASEURL}ide/task/udfInfo`
  return BfdRequest.ajaxPost(url, {
    code: id
  }, callback, null, false)
}

/**
 * 判断UDF脚本是否存在
 * @param id
 * @param callback
 */
function udfIsExist(id, callback) {
  let url = `${BASEURL}ide/task/udfValidate`
  let result = BfdRequest.ajaxAsyncPost(url, {
    id: id,
  }, callback).responseJSON
  return result.data ? true : false;
}

//=======================脚本树右键菜单 START===================================
/**
 * 创建文件夹
 * @param id
 * @param callbak
 */
function createDir(code, pid, treeName, callback) {
  let url = `${BASEURL}ide/folder/save`
  //let url = `http://192.168.164.175:8080/ide/folder/save`
  return BfdRequest.ajaxPost(url, {
    projectCode: projectCode,
    code: code,
    treeName: treeName,
    pid: pid
  }, callback)
}

/**
 * 验证文件夹名称
 */
function validateDir(code, pid, treeName, callback) {
  let url = `${BASEURL}ide/folder/validate`
  let result = BfdRequest.ajaxAsyncPost(url, {
    projectCode: projectCode,
    code: code,
    treeName: treeName,
    pid: pid
  }, callback).responseJSON
  return result.data
}

/*----------------------IDE编辑器相关接口 START----------------------------*/
/**
 * 保存脚本
 * @param name 脚本名称
 * @param callback 回调函数
 */
function saveScript(scriptData, callback) {
  let url = `${BASEURL}ide/task/save`;
  return BfdRequest.ajaxPost(url, {
    projectCode: projectCode,
    typeCode: scriptData.typeCode || 1,
    code: scriptData.code,
    name: scriptData.name,
    queue: scriptData.queue,
    priority: scriptData.priority,
    mr: scriptData.mr || 0,
    remark: scriptData.remark,
    pid: scriptData.pid == "0" ? '' : scriptData.pid,
    command: scriptData.command
  }, callback)
}

/**
 * 获取保存路径, 导入脚本, 目录下拉框
 * @param callback
 */
function getSavePath(callback) {
  let url = `${BASEURL}ide/folder/folderTree`;
  return BfdRequest.ajaxPost(url, {
    projectCode: projectCode,
  }, callback, null, false)
}

/**
 * 验证文件夹名称
 * @param name 所属目录
 * @param name 脚本名称
 */
function validateScriptName(code, name) {
  let url = `${BASEURL}ide/task/validate`
  //let url = `http://192.168.164.175:8080/ide/task/save`;
  let result = BfdRequest.ajaxAsyncPost(url, {
    projectCode: projectCode,
    code: code,
    name: name
  }).responseJSON
  return result.data;
}

/**
 * [安全中心]获取队列列表
 * @param callback
 */
function getQueueList(callback) {
  let url = `${SECUTRITYBASEURL}queue/list`;
  return BfdRequest.ajaxPost(url, {}, callback)
}


/**
 * 获取MR程序下拉树
 * @param callback 回调函数
 */
function getMr(callback) {
  let url = `${BASEURL}ide/task/mrFiles`;
  //let url = `http://172.18.1.70:8081/jupiter-project/ide/task/mrFiles`;
  return BfdRequest.ajaxPost(url, {}, callback, null, false)
}

/*----------------------运行结果相关日志 START---------------------------*/

/**
 * 获取脚本树
 * @param code 运行脚本
 * @param callback 回调函数
 */
function taskExecute(param, callback) {
  param = param || {};
  param.projectCode = projectCode;
  let url = `${BASEURL}ide/taskExecute`;
  return BfdRequest.ajaxPost(url, param, callback, null, false)
}

/**
 * 停止运行
 * @param uuid
 * @param callback
 */
function stopExecute(uuid, callback) {
  let url = `${BASEURL}ide/stopExecute`
  return BfdRequest.ajaxPost(url, {
    projectCode: projectCode,
    execName: uuid
  }, callback, null, false)
}

/**
 * 获取过程日志
 * @param execName 执行标识,随机生成一个UUID传过去
 * @param lineFrom 起始行数
 * @param lineTo   结束行数
 * @param callback 回调
 */
function getProcessLog(execName, lineFrom, lineTo, callback) {
  let url = `${BASEURL}ide/executeLog`;
  //url = `http://172.18.1.70:8081/jupiter-project/ide/executeLog`;
  return BfdRequest.ajaxPost(url, {
    execName: execName,
    lineFrom: lineFrom,
    lineTo: lineTo,
    echoType: 'PROCESS'
  }, callback, null, false)
}

/**
 * 获取结果日志
 * @param execName 执行标识,随机生成一个UUID传过去
 * @param lineFrom 起始行数
 * @param lineTo   结束行数  [这里传一个最大值, int 的最大值]
 * @param callback 回调
 */
function getResultLog(execName, lineFrom, lineTo, callback) {
  let url = `${BASEURL}ide/executeLog`;
  //url = `http://172.18.1.70:8081/jupiter-project/ide/executeLog`;
  return BfdRequest.ajaxPost(url, {
    execName: execName,
    lineFrom: lineFrom,
    lineTo: lineTo,
    echoType: 'RESULT'
  }, callback, null, false)
}


/**
 * 根据数据库名查询表[IDE代码提示]
 * @param dbName
 * @param callback
 */
function getHiveTables(hiveDbName, callback) {
  let url = `${BASEURL}/dataSource/hiveTables`;
  return BfdRequest.ajaxPost(url, {
    nameSpace: hiveDbName
  }, callback, null, false)
}

/**
 * 获取当前项目的所有脚本信息[目前没有用]
 */
function getAllScriptInfo(callback) {
  let url = `${BASEURL}ide/task/list`;
  return BfdRequest.ajaxAsyncPost(url, {
    projectCode: projectCode,
    limit: 9999999,
  }, callback, null, false)
}

/**
 * 导出Hive,SparkSQL执行的结果
 */
function exportTableData(uuid) {
  let url = `${BASEURL}ide/exportLog`;
  let newTab = window.open('about:blank')
  //lineForm   lineTo 这两个字段没有实际作用
  let param = {
    execName: uuid,
    lineFrom: 0,
    lineTo: 999999
  };
  url += '?' + Util.objectToURL(param)
  newTab.location.href = url;
}


/*----------------------新增脚本,获取脚本模板 START---------------------------*/

/**
 * 获取脚本模板
 */
function getTaskTemplateInfo(typeCode, callback) {
  let url = `${BASEURL}ide/taskTemplateInfo`;
  //let url = `http://bdosdev.com/jupiter-project/ide/taskTemplateInfo?projectCode=ce83f89ec2594ef79e93ab0420e2475a&typeCode=3`;
  let result = BfdRequest.ajaxAsyncPost(url, {
    projectCode: projectCode,
    typeCode: typeCode
  }).responseJSON
  return result.data;
}

export default {
  //获取左侧树,列表树, 导入导出
  getScriptsTree: getScriptsTree,
  getTablesTree: getTablesTree,
  getUDFList: getUDFList,
  getScriptlist: getScriptlist,
  getScriptTypes: getScriptTypes,
  exportScript: exportScript,
  exportScriptList: exportScriptList,
  getImportUrl: getImportUrl,


  //左侧树右键菜单功能接口
  deleteScript: deleteScript,
  deleteScriptTree: deleteScriptTree,
  publishScript: publishScript,
  lockScript: lockScript,
  unlockScript: unlockScript,
  getScriptInfo: getScriptInfo,
  createDir: createDir,
  updateNodeLocation: createDir,  //拖拽修改节点位置,和创建文件夹一样的接口
  validateDir: validateDir,
  getUDFInfo: getUDFInfo,
  udfIsExist: udfIsExist,

  //脚本保存接口
  saveScript: saveScript,
  getSavePath: getSavePath,
  validateScriptName: validateScriptName,
  getMr: getMr,
  getQueueList: getQueueList,


  //IDE执行
  taskExecute: taskExecute,
  stopExecute: stopExecute,
  getProcessLog: getProcessLog,
  getResultLog: getResultLog,
  exportTableData: exportTableData,

  //IDE编辑器提示
  getHiveTables: getHiveTables,

  //用于脚本名称生成规则
  getAllScriptInfo: getAllScriptInfo,

  //新建脚本,获取模板
  getTaskTemplateInfo: getTaskTemplateInfo,
}