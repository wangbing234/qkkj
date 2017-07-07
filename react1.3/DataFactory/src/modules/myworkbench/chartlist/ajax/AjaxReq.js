import BfdRequest from 'CommonComponent/request/AjaxRequest.js'

/*获取稽核报告charts数据*/
function getChartsList( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/result/selectGroups`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle )
}

/*获取任务监控charts数据*/
function getTaskMonitorCharts( param, successHandle, faultHandle ) {
  let url = `${Server.workflow}home/getTaskCount.do`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*获取执行时长charts数据*/
function getRunningTimeCharts( param, successHandle, faultHandle ) {
  let url = `${Server.workflow}home/getRunTime.do`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取数据增长趋势数据*/
function getDataGrowCharts( param, successHandle, faultHandle ){
  let url = `${Server.dataManager}view/projectQs`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取脚本分布charts数据*/
function getScriptFbCharts( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}scriptsDayManager/scriptDistribution`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

export default {
  getChartsList,
  getTaskMonitorCharts,
  getRunningTimeCharts,
  getDataGrowCharts,
  getScriptFbCharts
}