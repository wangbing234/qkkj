/***************************************************
 * 时间: 2016/7/21 16:04
 * 作者: bing.wang
 * 说明: 改变租户所有者页面
 *
 ***************************************************/
import CommonUtil from 'CommonComponent/utils/CommonUtil'


/**
 * 获取资源的数据
 * @param tArray
 * @returns {Array}
 */
function getResourceData(tArray){
    let rArray=[];
    for (let cTab of tArray){
        if(cTab)
        {
            let objectArray=  CommonUtil.fifterArrayByValue(cTab.state.dataJson.totalList,"selected",true);
            let idArray= CommonUtil.getStringArrayByObjectArray(objectArray,"id");
            rArray= rArray.concat(idArray);
        }
    }
   return rArray;
}

export default {
    getResourceData
}