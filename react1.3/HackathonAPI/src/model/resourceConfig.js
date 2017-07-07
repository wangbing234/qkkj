import {BfdRequest} from 'CommonComponent'
import URL from './url'

/**
 * 获取资源配置表信息
 * */
function getTable(param, callback) {
  let url = URL.getTableResourceConfig
  BfdRequest.ajaxPost(url, param, callback)
}

/**
 * 添加
 * @param data
 * @param callback
 */
function add(data, callback) {
  let url = URL.addResourceConfig
  BfdRequest.ajaxPost(url, data, callback)
}

/**
 * 编辑
 * @param data
 * @param callback
 */
function update(data, callback) {
  let url = URL.updateResourceConfig
  BfdRequest.ajaxPost(url, data, callback)
}

/**
 * 删除
 * @param id
 * @param callback
 */
function del(ids, callback) {
  let url = URL.delResourceConfig
  BfdRequest.ajaxPost(url, {ids: ids}, callback)
}

/**
 * 回显资源配置
 * @param id
 * @param callback
 */
function view(id, callback) {
  let url = URL.viewResourceConfig
  BfdRequest.ajaxPost(url, {id: id}, callback)
}

/**
 * 测试连接
 * @param id
 * @param callback
 */
function testConn(data, callback) {
  let url = URL.testConn
  BfdRequest.ajaxPost(url, data, callback)
}


export default {
  getTable: getTable,
  add: add,
  update: update,
  del: del,
  view: view,
  testConn: testConn
}