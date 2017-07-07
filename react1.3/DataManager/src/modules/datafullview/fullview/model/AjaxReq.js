/****************************************
 * 时间: 16/7/21
 * 作者: liujingjing
 * 说明: 数据全景部分接口
 *
 ****************************************/

import BfdRequest from 'CommonComponent/request/AjaxRequest.js'

/*获取上部基本信息 表存储量数据*/
function getData(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}view/index`;
    BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*获取项目TOP5数据*/
function getProjectTopData(param, successHandle, faultHandle ) {
    let url = `${Server.dataManager}view/projectTop`;
    return BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*获取脚本运行时长TOP5数据(除一进来默认Top5)(王峰)*/
function getScriptTopData(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}scriptsDayManager/taskExecList`;
    return BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*获取脚本运行时长TOP5数据(一进来默认Top5)(王峰)*/
function getScriptTopDefaultData(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}scriptsDayManager/scriptTopFive`;
    return BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*获取热门表数据(海俊)*/
function getHotTableData(param, successHandle, faultHandle ) {
    let url = `${Server.dataFactory}uml/favorite/top?num=5`;
    return BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

export default {
    getData:getData,
    getProjectTopData:getProjectTopData,
    getHotTableData:getHotTableData,
    getScriptTopData:getScriptTopData,
    getScriptTopDefaultData: getScriptTopDefaultData
};