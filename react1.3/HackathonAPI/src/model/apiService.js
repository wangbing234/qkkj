import {BfdRequest} from 'CommonComponent'
import URL from './url'

/**
 * 获取指定API的详细信息
 * */
function getAPIDetailInfo(id, callback) {
  let url = URL.viewAPI
  BfdRequest.ajaxPost(url, {id: id}, callback)
}

/**
 * 获取API列表
 * */
function getAPIs(callback) {
  let url = URL.getAPIs
  BfdRequest.ajaxPost(url, {}, callback)
}


export default {
  getAPIDetailInfo: getAPIDetailInfo,
  getAPIs: getAPIs
}