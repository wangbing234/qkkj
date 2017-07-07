import message from 'CommonComponent/component/bdosmessage'
import {BfdRequest} from 'CommonComponent'

//通用数据源
const serverUrl = window.Server.dataSource;
/**
 * 根据typeName获取通用数据源
 * typeName：资源类型
 * **/
function getCommonResources (data,callback){
  let url = `${serverUrl}commonResources?typeName=${data.type}`;
  BfdRequest.ajaxGetData(url,callback);
}



/**
 * 获取hive数据库
 * @param data
 * @param callback
 */
function getHiveDb(data,callback) {
  let url = `${Server.dataSource}hiveNameSpaces?typeName=${data.resourceId}`;
  BfdRequest.ajaxGetData(url,callback);
}

/**
 * 获取hbase数据库
 * @param data
 * @param callback
 */
function getHbaseDb(data,callback) {
  let url = `${Server.dataSource}hbaseNamespace?hbaseId=${data.resourceId}`;
  BfdRequest.ajaxGetData(url,callback);
}

export default {
  getCommonResources:getCommonResources,
  getHiveDb:getHiveDb,
  getHbaseDb:getHbaseDb
}