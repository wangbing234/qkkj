import BfdRequest from 'CommonComponent/request/AjaxRequest.js'

/*获取数据接入-列表数据*/
function getList( param, successHandle, faultHandle ) {
  let url = `${Server.dataFactory}access/dataAccess/list`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*获取数据导出-列表数据*/
function getExportList( param, successHandle, faultHandle ) {
  let url = `${Server.dataFactory}access/dataExport/list`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*获取数据库类型列表*/
function getDatabaseTypeList( param, successHandle, faultHandle ) {
  let url = `${Server.dataSource}rdbmsTypes`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取列表界面-数据源列表*/
function getDataSourceList( param, successHandle, faultHandle ) {
  let url = `${Server.dataSource}commonResources`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取关系型数据源列表*/
function getRelativeDataSourceList( param, successHandle, faultHandle ){
  let url = `${Server.dataSource}rdbmsDataBases`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*根据数据源获取数据库*/
function getDatabaseList( param, successHandle, faultHandle ) {
  let url = `${Server.dataSource}rdbmsSchemasNoDatabase`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*根据数据源id获取表列表*/
function getTableByDbList( param, successHandle, faultHandle ) {
  let url = `${Server.dataSource}rdbmsTables`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*根据数据源id获取表列表*/
function getTableList( param, successHandle, faultHandle ) {
  let url = `${Server.dataSource}rdbmsTablesNoDatabase`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取hive 表 列表*/
function getHiveTableList( param, successHandle, faultHandle ) {
  let url = `${Server.dataSource}hiveTables`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取hive表分区列表*/
function getHiveTablePartiList( param, successHandle, faultHandle ){
  let url = `${Server.dataSource}hivePartitions`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle,false );
}

function getSourceColumnList( param, successHandle, faultHandle ){
  let url = `${Server.dataSource}rdbmsColumnsNoDatabase`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle,false );
}

/*获取hive数据库列表*/
function getHiveDatabase( param, successHandle, faultHandle ) {
  let url = `${Server.dataSource}hiveNameSpaces`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*删除*/
function deleteAccess( param, successHandle, faultHandle ) {
  let url = `${Server.dataFactory}access/delete`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*获取单个资源信息*/
function getAccessInfo( param, successHandle, faultHandle ) {
  let url = `${Server.dataFactory}access/info`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}
/*获取队列列表*/
function getQueueList( param, successHandle, faultHandle ) {
  let url = `${Server.securityCenterUser}queue/list`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*DB保存*/
function saveInfo( param, successHandle, faultHandle ) {
  let url = `${Server.dataFactory}access/save`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*脚本执行*/
function excuteScript( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}ide/taskExecute`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*脚本停止*/
function stopScript( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}ide/stopExecute`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*获取脚本执行结果/日志*/
function getResult( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}ide/executeLog`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle,false )
}

/*校验名称重复*/
function validateNameRepeat( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}access/dataAccess/validate`;
  BfdRequest.ajaxAsyncPost( url, param, successHandle, faultHandle )
}

/*获取sqoop脚本字符串*/
function getSqoopScript( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}access/displaySqoop`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

export default {
  getList,
  getExportList,
  getDatabaseTypeList,
  getDataSourceList,
  getRelativeDataSourceList,
  getDatabaseList,
  getTableList,
  getSourceColumnList,
  getHiveTablePartiList,
  getHiveDatabase,
  getTableByDbList,
  getHiveTableList,
  deleteAccess,
  getAccessInfo,
  getQueueList,
  saveInfo,
  excuteScript,
  stopScript,
  getResult,
  validateNameRepeat,
  getSqoopScript
}