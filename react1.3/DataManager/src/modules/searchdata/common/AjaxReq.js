/****************************************
 * 时间: 16/7/27
 * 作者: liujingjing
 * 说明: 左侧树LeftTree接口
 *
 ****************************************/

import BfdRequest from 'CommonComponent/request/AjaxRequest.js'

function getLeftTreeList(param, successHandle, faultHandle ) {
    let url = `http://192.168.188.162:8080/jupiter-data-manager/findTables/listProject`;
    BfdRequest.ajaxPostStrData( url, param, successHandle, faultHandle )
}

export default {
    getLeftTreeList: getLeftTreeList
};