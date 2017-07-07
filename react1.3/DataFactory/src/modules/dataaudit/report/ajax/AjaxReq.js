import BfdRequest from 'CommonComponent/request/AjaxRequest.js'
/*获取稽核报告统计信息*/
function getReportCountInfo( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/result/getRunState`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle )
}

/*获取稽核报告charts数据*/
function getChartsList( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/result/selectGroups`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle )
}

/*获取稽核报告列表数据*/
function getReportList( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/result/selectPage`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle )
}

/*获取稽核报告单个任务的详情信息*/
function getReportDetail( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/result/reportDetail`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle )
}

export default {
  getReportCountInfo,
  getChartsList,
  getReportList,
  getReportDetail
}