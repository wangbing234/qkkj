import EventName from 'EventName'
/***************************************************
 * 时间: 2016/7/29 11:48
 * 作者: lijun.feng
 * 说明: 
 ***************************************************/
//查看表详情,obj:传入标识table信息的tableName?或别的
function seeTableDetails( obj ) {
  let record = {
    href: "/searchData/searchTable?tableName="+obj,
    title: "查找表",
    "data-icon": "search"
  };
  EventEmitter.dispatch(EventName.addTab, record);
}



export default {
  seeTableDetails
}