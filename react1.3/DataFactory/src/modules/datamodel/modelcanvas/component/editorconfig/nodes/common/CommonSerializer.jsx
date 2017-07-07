/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:公用序列化类
 *
 ***************************************************/
import React from 'react'



/**
 * 公用序列化类
 */
class CommonSerializer {
     serializer(model) {
         let tType;
         if(model.data.shape.dataModel) {
             tType=model.data.shape.dataModel.tableType;
         }
         else if(model.data.shape.uiModel){
             tType=model.data.shape.uiModel.type;
         }
         else{
             tType=model.data.id;
         }

         var uiModel={
             id:model.id,
             code:model.id,
             type:tType.toLowerCase(),
             infoCode:model.data.infoCode,
             keyId:model.data.keyId,
             edit:model.data.edit,
             iconType:this.iconType(model),
             name:model.label,
             position: model.position};
         return {uiModel:uiModel};
     }

    iconType(model){
            return model.data.iconType?model.data.iconType:1;
    }
}
module.exports = CommonSerializer;
   //"id":"328c728c60f1432ca6f51f82fff5f200", //前端生成唯一标识
   // "code": "328c728c60f1432ca6f51f82fff5f200",//与id一致用于后台数据库保存，和前端lines渲染
   // "type": "hive",//表的类型
   // "keyId":0,//0表示新建 有值则表示edit。用于后端保存到数据库中的id
   // "infoCode":"328c728c60f1432ca6f51f82fff5f200",//表示表的外键code，可以用该code 异步加载表的信息。
   // "iconType":1,//图标类型 1项目内布标、2引入外部表、3共享表、4汇聚
   // "position": {//图标的位置
   // "x": 134,
   //     "y": 67
