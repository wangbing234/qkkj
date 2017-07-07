import BfdRequest from 'CommonComponent/request/AjaxRequest.js'
import message from 'CommonComponent/component/bdosmessage'
/*查询工作流管理列表*/
function getProjectList( param, successHandle, faultHandle ) {
  let url = `${Server.workflow}diagram/getDefList.do`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*工作流管理列表- 启动*/
function startWorkflow( param, successHandle, faultHandle) {
  let url = `${Server.workflow}manage/start.do`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle )
}

/*工作流管理列表- 删除*/
function deleteWorkflow( param, successHandle, faultHandle ) {
  let url = `${Server.workflow}manage/deleteBatch.do`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*获取定时信息*/
function getTimerInfo( param, successHandle, faultHandle ) {
  let url = `${Server.workflow}manage/getTimer.do`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*新建保存定时信息*/
function saveTimerInfo( param, successHandle, faultHandle ){
  let url = `${Server.workflow}manage/saveTimer.do`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*更新保存定时信息*/
function updateTimerInfo( param, successHandle, faultHandle ){
  let url = `${Server.workflow}manage/updateTimer.do`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*已定时的流程下线*/
function deleteTimerInfo( param, successHandle, faultHandle ){
  let url = `${Server.workflow}manage/deleteTimer.do`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}
/*导入工作流*/
function importWorkflow( param, successHandle, faultHandle ){
  let url = `${Server.workflow}fileUpload.do`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*导出工作流*/
function exportWorkflow( param, successHandle, faultHandle ){
  let url = `${Server.workflow}fileDownload`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*定时界面- 脚本tab- 执行*/
function runScript( param, successHandle, faultHandle ){
  let url = `${Server.workflow}manage/getExecuteTime.do`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*解锁工作流*/
function lockTask( param, successHandle, faultHandle ){
  let url = `${Server.workflow}diagram/lock.do`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*发布工作流*/
function releaseWorkFlow( param, successHandle, faultHandle ){
  let url = `${Server.workflow}diagram/release.do`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取工作流历史版本*/
function getWorkflowHistoryList( param, successHandle, faultHandle ){
  let url = `${Server.workflow}diagram/getReleaseList.do`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}
/*工作流回滚*/
function rollbackWorkflow( param, successHandle, faultHandle ){
  let url = `${Server.workflow}diagram/rollback.do`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

export default {
  getProjectList,
  startWorkflow,
  deleteWorkflow,
  getTimerInfo,
  saveTimerInfo,
  updateTimerInfo,
  deleteTimerInfo,
  importWorkflow,
  exportWorkflow,
  runScript,
  lockTask,
  releaseWorkFlow,
  getWorkflowHistoryList,
  rollbackWorkflow
}