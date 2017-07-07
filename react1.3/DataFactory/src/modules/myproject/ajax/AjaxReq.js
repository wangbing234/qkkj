import BfdRequest from 'CommonComponent/request/AjaxRequest.js'
import message from 'CommonComponent/component/bdosmessage'
/*查询项目列表*/
function getProjectList(param, successHandle, faultHandle) {
  let url = `${Server.dataFactory}project/list`;
  BfdRequest.ajaxPost(url, param, successHandle, faultHandle)
}

/*新增项目- 项目编码校验*/
function validateProjectCode(param, successHandle, faultHandle) {
  let url = `${Server.dataFactory}project/validate`;
  BfdRequest.ajaxAsyncPost(url, param, successHandle, faultHandle);
}

/*新增项目- 项目名称  CNName*/
function validateCnName(param, successHandle, faultHandle) {
  let url = `${Server.dataFactory}project/validateCnName`;
  BfdRequest.ajaxAsyncPost(url, param, successHandle, faultHandle);
}

function handSessionLose() {
  message.danger('Session失效,请重新登录!', function () {
    top.location.href = Server.sessionLose;
  })
}

/*保存项目*/
function saveProject(param, successHandle, faultHandle) {
  let url = `${Server.dataFactory}project/save`;
  BfdRequest.ajaxPost(url, param, successHandle, faultHandle);
}

/*删除某个资源*/
function deleteProject(param, successHandle, faultHandle) {
  let url = `${Server.dataFactory}project/delete`;
  BfdRequest.ajaxPost(url, param, successHandle, faultHandle);
}

/*获取项目信息*/
function getProjectInfo(param, successHandle, faultHandle) {
  let url = `${Server.dataFactory}project/info`;
  BfdRequest.ajaxPost(url, param, successHandle, faultHandle);
}

export default {
  getProjectList,
  validateProjectCode,
  saveProject,
  deleteProject,
  getProjectInfo,
  validateCnName
}