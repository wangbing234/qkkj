import BfdRequest from 'CommonComponent/request/AjaxRequest.js'
import message from 'CommonComponent/component/bdosmessage'
/*获取稽核任务列表*/
function getTaskList( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/task/listTask`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle )
}

/*获取稽核任务-详情数据*/
function getTaskDescInfo( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/task/getTaskDetail`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle )
}

/*校验稽核任务-名称是否重复*/
function validateNameRepeat( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/task/isExits`;
  BfdRequest.ajaxAsyncPost( url, param, successHandle, faultHandle )
}

/*校验稽核任务-名称是否重复*/
function validateRuleNameRepeat( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/rule/isExits`;
  BfdRequest.ajaxAsyncPost( url, param, successHandle, faultHandle )
}

/*保存基本配置信息*/
function saveTaskInfo( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/task/add`;
  BfdRequest.ajaxPostStrData( url, param, function ( data ) {
    successHandle( data );
  }, function ( data ) {
    handSessionLose();
  } )
}

/*获取邮件组/短信组*/
function getGroups( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/task/notice`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle )
}

function handSessionLose() {
  message.danger( 'Session失效,请重新登录!', function () {
    top.location.href = Server.sessionLose;
  } )
}

/*获取单个稽核任务信息*/
function getTaskInfo( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/task/getTask`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*删除稽核任务*/
function deleteTask( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/task/del`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*稽核任务-列表界面-运行*/
function excuteTask( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/task/execute`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*稽核任务-列表界面-结束*/
function stopTask( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/task/stop`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*获取规则配置列表*/
function getRuleList( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/rule/listRule`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*获取规则类型列表*/
function getRuleTypeList( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/rule/ruleTypes`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}
/*获取源数据库列表*/
function getSourceDatabase( param, successHandle, faultHandle ) {
  let url = `${Server.dataSource}hiveNameSpaces`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}
/*获取数据源列表*/
function getDataSourceList( param, successHandle, faultHandle ) {
  let url = `${Server.dataSource}commonResources`;
  return BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}
/*获取源表名列表*/
function getSourceTableList( param, successHandle, faultHandle ) {
  let url = `${Server.dataSource}hiveTables`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}
/*获取源表字段列表*/
function getSourceTableFieldList( param, successHandle, faultHandle ) {
  let url = `${Server.dataSource}hiveColumns`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取含分区字段的字段列表*/
function getDateFieldList( param, successHandle, faultHandle ){
  let url = `${Server.dataSource}hiveColumnsWithPart`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取关系型数据库列表*/
function getRelationDatabaseList( param, successHandle, faultHandle ){
  let url = `${Server.dataSource}rdbmsDataBases`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取关系型数据库table列表*/
function getRelationTableList( param, successHandle, faultHandle ){
  let url = `${Server.dataSource}rdbmsTablesNoDatabase`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}
/*获取关系型数据库table字段列表*/
function getRelationTableFieldList( param, successHandle, faultHandle ){
  let url = `${Server.dataSource}rdbmsColumnsNoDatabase`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}
/*规则新增/编辑保存*/
function saveRule( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/rule/add`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*获取单个规则的信息*/
function getRuleInfo( param, successHandle, faultHandle ) {
  let url = `${Server.dataAudit}dataAudit/rule/getRule`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*删除规则*/
function deleteRules( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/rule/del`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*执行规则*/
function executeRule( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/rule/execute`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*结束规则*/
function stopRule( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/rule/stop`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}
/*禁用规则*/
function disableRule( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/rule/disenable`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}
/*启用规则*/
function enableRule( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/rule/enable`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*获取字段函数列表*/
function getFieldFuncList( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/rule/ruleDic`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*获取任务-查看结果数据*/
function getTaskResult( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/task/getAuditResult`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

/*获取规则-查看结果数据*/
function getRuleResult( param, successHandle, faultHandle ){
  let url = `${Server.dataAudit}dataAudit/rule/getAuditResult`;
  BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle );
}

export default {
  getTaskList,
  getTaskDescInfo,
  validateNameRepeat,
  validateRuleNameRepeat,
  getTaskResult,
  saveTaskInfo,
  getGroups,
  getTaskInfo,
  deleteTask,
  excuteTask,
  stopTask,
  getRuleList,
  getRuleTypeList,
  getRuleResult,
  saveRule,
  deleteRules,
  executeRule,
  stopRule,
  disableRule,
  enableRule,
  getRuleInfo,
  getFieldFuncList,
  getSourceDatabase,
  getDataSourceList,
  getSourceTableList,
  getSourceTableFieldList,
  getDateFieldList,
  getRelationDatabaseList,
  getRelationTableList,
  getRelationTableFieldList
}