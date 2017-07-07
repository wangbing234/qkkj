/***************************************************
 * 时间: 2016/7/28 15:21
 * 作者: lijun.feng
 * 说明: 后台交互类
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest'

const serverUrl = window.Server.dataManager;
const europaUrl = window.Server.jupiterEuropa;

/*********************查找工作流************************/
/**
 * 获取左侧树
 * **/
function getLeftTree (data,callback){
  let url = `${serverUrl}findWorkflow/listProject?tenant=${data.tenant}` ;
  return BfdRequest.ajaxPostData(url, null, callback)
}

/**
 * 获取头部项目描述信息
 * **/
function getProjectDescInfo (data,callback){
  let url = `${serverUrl}findWorkflow/info?projectCode=${data.projectCode}&tenant=${data.tenant}` ;
  return BfdRequest.ajaxPostData(url, null, callback)
}

/**
 * 获取头部工作流描述信息
 * **/
function getWorkFlowDescInfo (data,callback){
  let url = `${europaUrl}home/getDefInfo.do?projectCode=${data.projectCode}&processKey=${data.processKey}` ;
  return BfdRequest.ajaxGetData(url, callback);
}

/**
 * 获取工作流列表
 * **/
function getWorkFlowList (data,callback){
  //getAllDef.do?tenantId=&projectCode=&processKey=test&currentPage=1&pageSize=10
  //let url = `${europaUrl}home/getDefList.do?projectCode=${data.projectCode}&processKey=${data.processKey}&currentPage=${data.currentPage}&pageSize=${data.pageSize}` ;
  let url = `${europaUrl}home/getAllDef.do`;
  return BfdRequest.ajaxPostData(url,data, callback);
}

/**
 * 获取工作流运行情况
 * **/
function getWfRunningInfo (data,callback){
  let url = `${europaUrl}monitor/getProcessHistoryList.do?projectCode=${data.projectCode}&pageSize=${data.pageSize}&currentPage=${data.currentPage}&processKey=${data.processKey}&startTime=${data.startTime}&endTime=${data.endTime}` ;
  return BfdRequest.ajaxGetData(url, callback);
}

/**
 * 获取工作流变更信息
 * **/
function getWfChangeInfo (data,callback){
  let url = `${europaUrl}diagram/getDefHistoryList.do?projectCode=${data.projectCode}&pageSize=${data.pageSize}&currentPage=${data.currentPage}&processKey=${data.processKey}` ;
  return BfdRequest.ajaxGetData(url, callback);
}

/*********************查找工作流************************/



export default {
  getLeftTree:getLeftTree,
  getProjectDescInfo:getProjectDescInfo,
  getWorkFlowDescInfo:getWorkFlowDescInfo,
  getWorkFlowList:getWorkFlowList,
  getWfChangeInfo:getWfChangeInfo,
  getWfRunningInfo:getWfRunningInfo
}