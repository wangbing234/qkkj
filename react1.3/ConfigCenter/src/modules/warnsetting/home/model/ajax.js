import message from 'CommonComponent/component/bdosmessage'
import {BfdRequest} from 'CommonComponent'
import URL from './url'

/**
 * 保存报警配置
 * **/
function saveWarnSetting(data,callback){
  let url = URL.SAVECONFIG;
  BfdRequest.ajaxPostData(url, data, callback)
}

/**
 * 获取报警列表
 * **/
function getWarnList(data,callback){
  let url = URL.GETWARNLIST;
  BfdRequest.ajaxPostData(url, data, callback);
}

/**获取集群**/
function getCluster(callback){
  let url = URL.GETCLUSTER;
  BfdRequest.ajaxGetData(url,callback);
}

/**获取组**/
function getGroup(param,callback){
  let url = `${URL.GETGROUP}${param}`;
  BfdRequest.ajaxGetData(url,callback);
}

/**获取监控项**/
function getWarnItem(param,callback){
  let url = `${URL.GETWARNITEM}${param}`;
  BfdRequest.ajaxGetData(url,callback);
}

/**获取主机**/
function getHost(param,callback){
  let url = `${URL.GETHOST}${param}`;
  BfdRequest.ajaxGetData(url,callback);
}

/**删除监控项**/
function delWarnItem(data,callback){
  let url = URL.DELWARNITEM;
  BfdRequest.ajaxPostData(url,data,callback);
}

/**获取邮件组**/
function getEmailGroup(callback){
  let url = URL.GETEMAILGROUP;
  BfdRequest.ajaxGetData(url,callback);
}

/**获取短信组**/
function getSmsGroup(callback){
  let url = URL.GETMSGGROUP;
  BfdRequest.ajaxGetData(url,callback);
}

export default {
  saveWarnSetting:saveWarnSetting,
  getWarnList:getWarnList,
  getCluster:getCluster,
  getGroup:getGroup,
  getWarnItem:getWarnItem,
  delWarnItem:delWarnItem,
  getEmailGroup:getEmailGroup,
  getSmsGroup:getSmsGroup,
  getHost:getHost

}