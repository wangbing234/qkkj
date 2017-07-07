import BfdRequest from 'CommonComponent/request/AjaxRequest.js'
import message from 'CommonComponent/component/bdosmessage'
/*查询工作流监控列表*/
function getProcessList( param, successHandle, faultHandle ) {
  let url = `${Server.workflow}monitor/getProcessList.do`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle )
}

/*工作流监控列表- 恢复*/
function resumeWorkflow( param, successHandle, faultHandle) {
  let url = `${Server.workflow}monitor/resume.do`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle )
}

/*工作流监控列表- 结束*/
function endWorkflow( param, successHandle, faultHandle ) {
  let url = `${Server.workflow}monitor/end.do`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*工作流监控列表- 暂停*/
function pauseWorkflow( param, successHandle, faultHandle ) {
  let url = `${Server.workflow}monitor/suspend.do`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*工作流监控列表- 重跑*/
function rerunWorkflow( param, successHandle, faultHandle ) {
  let url = `${Server.workflow}monitor/rerun.do`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*工作流监控- 双击行- 获取节点实例list*/
function getTaskInfoList( param, successHandle, faultHandle ){
  let url = `${Server.workflow}monitor/getTaskInfoList.do`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*工作流监控- 双击行- 节点实例list-查看*/
function getProcessById( param, successHandle, faultHandle ){
  let url = `${Server.workflow}monitor/getNodeLog.do`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

export default {
  getProcessList,
  resumeWorkflow,
  endWorkflow,
  pauseWorkflow,
  rerunWorkflow,
  getTaskInfoList,
  getProcessById
}