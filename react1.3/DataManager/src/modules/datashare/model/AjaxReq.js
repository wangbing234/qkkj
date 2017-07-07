/***************************************************
 * 时间: 2016/7/26 15:21
 * 作者: lijun.feng
 * 说明: 后台交互类
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest'

const serverUrl = Server.dataManager;

/**
 * 共享清单-获取共享清单
 * **/
function getShareList( param, callback ) {
  let url = `${serverUrl}shareData/listShareTable`;
  return BfdRequest.ajaxPost( url, param, callback );
}

/**
 * 共享清单-租户所有者-申请/批量申请
 * **/
function getShareListApply( data, callback ) {
  let url = `${serverUrl}shareData/applyUser`;
  return BfdRequest.ajaxPost( url, data, callback )
}
/**
 * 共享清单-租户所有者-申请/批量申请保存
 * **/
function saveShareListApply( data, callback ) {
  let url = `${serverUrl}shareData/applyTable`;
  return BfdRequest.ajaxPost( url, data, callback )
}

/**
 * 我共享的表-获取我共享的表
 * **/
function getMyShareTableList( data, callback ) {
  let url = `${serverUrl}shareData/listMyShareTable`;
  return BfdRequest.ajaxPost( url, data, callback )
}

/**
 * 我共享的表-取消共享
 * **/
function cancelShareTable( data, callback ) {
  let url = `${serverUrl}shareData/unshareTable`;
  return BfdRequest.ajaxPost( url, data, callback )
}

/**
 * 申请的表-获取申请的表列表
 * **/
function getApplysTable( data, callback ) {
  let url = `${serverUrl}shareData/applicationTable`;
  return BfdRequest.ajaxPost( url, data, callback )
}


/**
 * 申请的表-分享
 * **/
function shareToOther( data, callback ) {
  let url = `${serverUrl}`;
  //return BfdRequest.ajaxPost(url, data, callback)
}

/**
 * 申请的表-分享-用户-源
 * **/
function getSourceUser( data, callback ) {
  let url = `${Server.securityCenterUser}user/getTenantUsersNotTenantOwner`;
  return BfdRequest.ajaxPost( url, data, callback )
}
/**
 * 申请的表-分享-用户-目标
 * **/
function getTargetUser( data, callback ) {
  let url = `${serverUrl}shareData/getAuthorizedUser`;
  return BfdRequest.ajaxPost( url, data, callback )
}

/**
 * 申请的表-分享-角色-目标
 * **/
function getTargetRole( data, callback ) {
  let url = `${serverUrl}shareData/getAuthorizedRole`;
  return BfdRequest.ajaxPost( url, data, callback )
}

/**
 * 申请的表-分享-角色-源
 * **/
function getSourceRole( data, callback ) {
  let url = `${Server.securityCenterUser}role/listRolesByTenant`;
  return BfdRequest.ajaxPost( url, data, callback )
}

/**
 * 申请的表-分享-保存
 * **/
function saveShareUsers( data, callback ) {
  let url = `${serverUrl}shareData/innerShare`;
  return BfdRequest.ajaxPost( url, data, callback )
}

/**
 * 我审批的表-获取我审批的表
 * **/
function getMyApprovalsTable( data, callback ) {
  let url = `${serverUrl}shareData/listMyVerifyTable`;
  return BfdRequest.ajaxPost( url, data, callback )
}

/**
 * 我审批的表-查看 - 同意提交
 * **/
function submitApplyTable( data, callback ) {
  let url = `${serverUrl}shareData/submitApplyTable`;
  return BfdRequest.ajaxPost( url, data, callback )
}

/**
 * 我审批的表-批量同意
 * **/
function passApplyTable( data, callback ) {
  let url = `${serverUrl}shareData/passApplyTable`;
  return BfdRequest.ajaxPost( url, data, callback )
}

/**
 * 我审批的表-批量驳回
 * **/
function rejectApplyTable( data, callback ) {
  let url = `${serverUrl}shareData/rejectApplyTable`;
  return BfdRequest.ajaxPost( url, data, callback )
}

/**
 * 我审批的表-批量收回
 * **/
function backApplyTable( data, callback ) {
  let url = `${serverUrl}shareData/getBackApplyTable`;
  return BfdRequest.ajaxPost( url, data, callback )
}

/*
 * 我的审批- 查看
 * */
function getApplyDetail( data, callback ) {
  let url = `${serverUrl}shareData/getApplyDetail`;
  return BfdRequest.ajaxPost( url, data, callback )
}


export default {
  getShareList,
  getShareListApply,
  saveShareListApply,
  getMyShareTableList,
  cancelShareTable,
  getApplysTable,
  shareToOther,
  getSourceUser,
  getSourceRole,
  saveShareUsers,
  getTargetUser,
  getTargetRole,
  getMyApprovalsTable,
  submitApplyTable,
  rejectApplyTable,
  backApplyTable,
  passApplyTable,
  getApplyDetail
}