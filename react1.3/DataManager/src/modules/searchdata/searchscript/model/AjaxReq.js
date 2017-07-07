/**
 * Created by liujingjing on 16/7/28.
 */

import BfdRequest from 'CommonComponent/request/AjaxRequest.js'

//获取All的上部基本信息列表
function getAllInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}findScript/allInfo`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

//获取项目的上部基本信息列表
function getProjectInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}findScript/projectInfo`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

//获取列表信息
function getList(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}scriptsDayManager/taskList`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

//获取列表信息
function getListOrder(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}scriptsDayManager/taskList`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

//获取脚本页面的上部基本信息列表
function getScriptInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}scriptsDayManager/taskInfo`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 左侧树
function getLeftTreeList(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}findScript/listProject`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 运行情况【王峰】
function getTaskInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}scriptsDayManager/taskInfoEx`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 脚本代码【王峰】
function getTaskCommand(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}scriptsDayManager/taskCommand`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 变更信息【姜楠】
function getTaskHistory(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}ide/history`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 查看日志
function seeExecuteLog(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}ide/executeLog`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

export default {
    getAllInfo: getAllInfo,
    getProjectInfo: getProjectInfo,
    getList: getList,
    getScriptInfo: getScriptInfo,
    getLeftTreeList: getLeftTreeList,
    getTaskInfo: getTaskInfo,
    getTaskCommand: getTaskCommand,
    getTaskHistory: getTaskHistory,
    seeExecuteLog: seeExecuteLog,
    getListOrder:getListOrder
};