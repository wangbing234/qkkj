import {BfdRequest} from 'CommonComponent'
import URL from './url'

/**
 * 获取API列表列表
 * sourceType 区分 0是mysql  1是hbase
 * */
function getTable(param, callback) {
  let url = URL.getAPIInfo
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 添加
 * @param HbaseData
 * @param callback
 */
function add(param, callback) {
  let url = URL.addAPIInfo
  BfdRequest.ajaxPost(url, param, callback)
}


/**
 * 更新
 * @param HbaseData
 * @param callback
 */
function update(param, callback) {
  let url = URL.updateAPIInfo
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 删除
 * @param ids
 * @param callback
 */
function del(ids, callback) {
  let url = URL.delAPIInfo
  BfdRequest.ajaxPost(url, {ids: ids}, callback)
}

/**
 * 回显
 * @param id
 * @param callback
 */
function view(id, callback) {
  let url = URL.viewAPIInfo
  BfdRequest.ajaxPost(url, {id: id}, callback)
}

/**
 * 获取数据源列表  下拉框
 * @param type  0表示 mysql  1 表示hbase
 * @param callback
 */
function getDbSource(type, callback) {
  let url = URL.getDbSource
  BfdRequest.ajaxPost(url, {type: type}, callback, null, false)
}

/**
 * 获取表 下拉框
 * @param configId  数据源id
 * @param callback
 */
function getTableSource(configId, callback) {
  let url = URL.getTableSource
  BfdRequest.ajaxPost(url, {configId: configId}, callback, null, false)
}

/**
 * 获取Hbase表
 * @param alias 别名
 * @param callback
 */
function getHbaseTable(alias, callback) {
  let url = URL.getHbaseTable
  BfdRequest.ajaxPost(url, {alias: alias}, callback, null, false)
}


/**
 * 获取表格列  下拉框
 * @param param  参数对象
 * @param callback
 */
function getColSource(param, callback) {
  let url = URL.getColSource
  BfdRequest.ajaxPost(url, param, callback, null, false)
}

/**
 * 发布API
 * @param API id, 多个 逗号隔开
 * @param callback
 */
function pubishAPI(ids, callback) {
  let url = URL.pubishAPI
  BfdRequest.ajaxPost(url, {ids: ids}, callback)
}

/**
 * 撤销发布API
 * @param ids  API id,多个 逗号隔开
 * @param callback
 */
function revockAPI(ids, callback) {
  let url = URL.revockAPI
  BfdRequest.ajaxPost(url, {ids: ids}, callback)
}


export default {
  getTable: getTable,
  add: add,
  update: update,
  del: del,
  view: view,
  getDbSource: getDbSource,
  getTableSource: getTableSource,
  getHbaseTable: getHbaseTable,
  getColSource: getColSource,
  pubishAPI: pubishAPI,
  revockAPI: revockAPI,
}