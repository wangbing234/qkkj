/****************************************************
 * create by qing.feng
 * time 2016/7/21 16:15
 * desc：项目配置- 后端请求方法类
*****************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest.js'
/*获取基本配置信息*/
function getBaseConfigInfo( param, successHandle, faultHandle ) {
  let url = `${Server.dataFactory}project/baseConfigInfo`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle )
}

/*保存基本配置信息*/
function saveBaseConfigInfo( param, successHandle, faultHandle ) {
  let url = `${Server.dataFactory}project/baseConfigSave`;
  BfdRequest.ajaxPost( url, param, function ( data ) {
    successHandle( data );
  }, function ( data ) {
    handSessionLose();
  } )
}

function handSessionLose() {
  message.danger( 'Session失效,请重新登录!', function () {
    top.location.href = Server.sessionLose;
  } )
}

/*开发规范列表查询*/
function getDevelopConfigList( param, successHandle, faultHandle ) {
  let url = `${Server.dataFactory}ide/taskTemplates`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*查看规范内容*/
function getDevelopConfigInfo( param, successHandle, faultHandle ) {
  let url = `${Server.dataFactory}ide/taskTemplateInfo`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*保存规范内容*/
function saveDevelopConfigInfo( param, successHandle, faultHandle ) {
  let url = `${Server.dataFactory}ide/taskTemplateSave`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*层级列表*/
function getLevelList( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}uml/hierarchy/list`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*层级列表-删除*/
function deleteLevel( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}uml/hierarchy/del`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*层级列表-保存*/
function saveLevel( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}uml/hierarchy/save`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*主题域列表*/
function getDomainList( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}uml/subject/list`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*主题域列表-删除*/
function deleteDomain( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}uml/subject/del`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*主题域列表-保存*/
function saveDomain( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}uml/subject/save`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*主题域分页全部列表*/
function getDomainPageList( param, successHandle, faultHandle ){
  let url = `${Server.dataFactory}uml/subject/viewPage`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取hive库列表*/
function getHiveList( param, successHandle, faultHandle ){
  let url = `${Server.dataSource}hiveNameSpaces`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取hbase源列表*/
function getHbaseSourceList( param, successHandle, faultHandle ){
  let url = `${Server.dataSource}commonResources`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}

/*获取hbase库列表*/
function getHbaseDatabaseList( param, successHandle, faultHandle ){
  let url = `${Server.dataSource}hbaseNamespace`;
  BfdRequest.ajaxPost( url, param, successHandle, faultHandle );
}


export default {
  getBaseConfigInfo,
  saveBaseConfigInfo,
  getDevelopConfigList,
  getDevelopConfigInfo,
  saveDevelopConfigInfo,
  getLevelList,
  deleteLevel,
  saveLevel,
  getDomainList,
  deleteDomain,
  saveDomain,
  getDomainPageList,
  getHiveList,
  getHbaseSourceList,
  getHbaseDatabaseList
}