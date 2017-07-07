import BfdRequest from 'CommonComponent/request/AjaxRequest'

function getTenantList(param, successHandle){
  let url = `${Server.securityCenterUser}tenant/listAll`
  BfdRequest.ajaxPost( url, param, successHandle);
}

export default {
  getTenantList
}