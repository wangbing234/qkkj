import {BfdRequest} from 'CommonComponent'
import URL from './url'

/**
 * 获取API统计
 * @param param
 * @param callback
 */
function getAPIStatistics(param, callback) {
  let url = URL.getAPIStatistics
  //BfdRequest.ajaxGet(url, callback)
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 获取API统计
 * @param param
 * @param callback
 */
function getAPIDayStatistics(param, callback) {
  let url = URL.getAPIDayStatistics
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 获取API统计
 * @param param
 * @param callback
 */
function getAPIHourStatistics(param, callback) {
  let url = URL.getAPIHourStatistics
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 获取用户统计
 * @param param
 * @param callback
 */
function getUserStatistics(param, callback) {
  let url = URL.getUserStatistics
  //BfdRequest.ajaxGet(url, callback)
  BfdRequest.ajaxPost(url, param, callback)
}


/**
 * 获取API统计
 * @param param
 * @param callback
 */
function getUserDayStatistics(param, callback) {
  let url = URL.getUserDayStatistics
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 获取API统计
 * @param param
 * @param callback
 */
function getUserHourStatistics(param, callback) {
  let url = URL.getUserHourStatistics
  BfdRequest.ajaxPost(url, param, callback)
}


export default {
  getAPIStatistics: getAPIStatistics,
  getAPIDayStatistics: getAPIDayStatistics,
  getAPIHourStatistics: getAPIHourStatistics,

  getUserStatistics: getUserStatistics,
  getUserDayStatistics: getUserDayStatistics,
  getUserHourStatistics: getUserHourStatistics
}