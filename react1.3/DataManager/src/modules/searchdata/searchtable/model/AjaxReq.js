/****************************************
 * 时间: 16/7/27
 * 作者: liujingjing
 * 说明: 查找表的接口
 *
 ****************************************/

import BfdRequest from 'CommonComponent/request/AjaxRequest.js'

//获取All的上部基本信息列表
function getAllInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}findTables/allInfo`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

//获取项目的上部基本信息列表
function getProjectInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}findTables/projectInfo`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

//获取数据库的上部基本信息列表
function getDatabaseInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}findTables/databaseInfo`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

//获取列表信息
function getList(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}findTables/tableList`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

//获取租户下的列表信息 (点击左侧树All加载的列表)
function getTenantList(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}findTables/tableList_`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}


//查询表是否存在，如果存在返回数据
function tableIsExists(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}tableDayManager/tables`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}


//获取表页面的上部基本信息列表
function getTableInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}findTables/tableInfo`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 左侧树
function getLeftTreeList(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}findTables/listProject`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 详细信息-字段信息(王峰)
function getColumnsInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}tableDayManager/columns`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 详细信息-分区信息(王峰)
function getPatitionsInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}tableDayManager/patitions`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 详细信息-存储信息
function getStoreInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}findTables/storeInfo`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 详细信息-血缘关系


// 详细信息-产出信息
function getOutputInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}findTables/outputInfo`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 详细信息-变更信息
function getTableOptHistoryInfo(param, successHandle, faultHandle ) {
    let url = `${Server.securityCenterAudit}history/tableOptHistory.do`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 详细信息-DDL语句(王峰)
function getDDLInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}tableDayManager/getDDL`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 详细信息-高级设置(王峰)
function getSeniorInfo(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}tableDayManager/senior`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 表共享
function submitShareData(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}shareData/submitShareTable`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 表取消共享
function removeShareTable(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}shareData/removeShareTable`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

// 表收藏/取消收藏
function collectData(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}uml/favorite/collect`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}


export default {
    getAllInfo: getAllInfo,
    getProjectInfo: getProjectInfo,
    getDatabaseInfo: getDatabaseInfo,
    getList: getList,
    getTableInfo: getTableInfo,
    getLeftTreeList: getLeftTreeList,
    getColumnsInfo: getColumnsInfo,
    getPatitionsInfo: getPatitionsInfo,
    getStoreInfo: getStoreInfo,
    getOutputInfo: getOutputInfo,
    getSeniorInfo: getSeniorInfo,
    getTableOptHistoryInfo: getTableOptHistoryInfo,
    getDDLInfo: getDDLInfo,
    getTenantList: getTenantList,
    submitShareData: submitShareData,
    removeShareTable: removeShareTable,
    collectData: collectData,
    tableIsExists:tableIsExists
};