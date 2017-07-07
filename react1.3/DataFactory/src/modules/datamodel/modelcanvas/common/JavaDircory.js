/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:java字典数据
 *
 ***************************************************/
//数据类型
let DATA_TYPE=[{name:"INT"},{name:"BIGINT"},{name:"BOOLEAN"},{name:"DOUBLE"},{name:"STRING"},{name:"TIMESTAMP"}]

let DATA_TYPE_ARRAY=DATA_TYPE.concat([{name:"ARRAY",type:"array"},{name:"MAP",type:"array"},{name:"STRUCT",type:"array"}])

//文件格式
let FILE_FORMAT=["TEXTFILE","SEQUENCEFILE","RCFILE"];

//存储格式
let STORE_FORMAT=["MANAGED"];

//列分割符
let FIELD_SPILD=["\\001","\\t",","];

//查询其它项目事件
let LIST_IMPORTTREE_QUERY=["\\001","\\t"];

export default {
  DATA_TYPE,DATA_TYPE_ARRAY,FILE_FORMAT,STORE_FORMAT,FIELD_SPILD,LIST_IMPORTTREE_QUERY
}