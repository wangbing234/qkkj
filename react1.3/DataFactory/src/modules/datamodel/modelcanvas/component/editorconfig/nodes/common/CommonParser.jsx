/***************************************************
 * 时间: 2016/7/20 11:12
 * 作者: bing.wang
 * 说明:公用解析器类
 *
 ***************************************************/
import React from 'react'
/**
 * 公用解析类
 */
class CommonParser {
    canParser(model) {
        return false;
    }
     parser(model) {
         return model.data.dataModel;
     }
}
module.exports = CommonParser;