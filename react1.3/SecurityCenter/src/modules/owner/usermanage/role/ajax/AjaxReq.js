/***************************************************
 * 时间: 2016/7/21 15:57
 * 作者: bing.wang
 * 说明: 角色ajax
 *
 ***************************************************/
import BfdRequest from 'CommonComponent/request/AjaxRequest'
import message from 'CommonComponent/component/bdosmessage'

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function deleteRoleList(param,successHandle) {
    let url=`${Server.securityCenterAegis}role/delete`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function editRole(param,successHandle) {
    let url=`${Server.securityCenterAegis}role/edit`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 模型页面获取列表
 * @param param
 * @param successHandle
 */
function editRoleAssociateUser(param,successHandle) {
    let url=`${Server.securityCenterAegis}role/save`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 *租户列表
 * @param param
 * @param successHandle
 */
function listByTenant(param,successHandle) {
    let url=`${Server.securityCenterAegis}role/listByTenant`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 增加角色权限
 * @param param
 * @param successHandle
 */
function addRoleToPolicy(param,successHandle) {
    let url=`${Server.securityCenterAegis}policy/addRolesToPolicy.do`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 给角色赋值功能权限
 * @param param
 * @param successHandle
 */
function assignRoleFunctionTree(param,successHandle) {
    let url=`${Server.securityCenterAegis}auth/assignRoleFunctionTree`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 给角色赋值资源权限
 * @param param
 * @param successHandle
 */
function assignRoleResourceTree(param,successHandle) {
    let url=`${Server.securityCenterAegis}auth/assignRoleResourceTree`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}


/**
 * 获取资源类型
 * @param param
 * @param successHandle
 */
function listPolicyResourceByType(param,successHandle) {
    let url=Server.dataSource+`commonResources?typeName=${param.type}`;
    BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 获取hive数据库
 * @param param
 * @param successHandle
 */
function listHiveDatabase(param,successHandle) {
    let url=Server.dataSource+`hiveNameSpaces?typeName=${param.resourceId}`;
    BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 获取hive表
 * @param param
 * @param successHandle
 */
function listHiveTable(param,successHandle) {
    let url=Server.dataSource+`hiveTables?hiveId=${param.resourceId}&nameSpace=${param.database}`;
    BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 获取hive列
 * @param param
 * @param successHandle
 */
function listHiveColumn(param,successHandle) {
    let tableName="";
    if(param.table instanceof  Array && param.table==0)
     return;
    if(param.table && param.table instanceof  Array && param.table.length==1)
    {
        tableName=param.table[0];
    }
    else {
        tableName=param.table;
    }
    if(tableName)
    {
        let url=Server.dataSource+`hiveColumns?hiveId=${param.resourceId}&nameSpace=${param.database}&table=${tableName}`;
        BfdRequest.ajaxGetData(url,successHandle);
    }
}

/**
 * 获取hbase数据库
 * @param param
 * @param successHandle
 */
function listHbaseDatabase(param,successHandle){
    let url=Server.dataSource+`hbaseNamespace?hbaseId=${param.resourceId}`;
    BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 获取hbase数据表
 * @param param
 * @param successHandle
 */
function listHbaseTable(param,successHandle){
    let url=Server.dataSource+`hbaseTables?hbaseId=${param.resourceId}&nameSpace=${param.database}`;
    BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 获取hbase数据列簇
 * @param param
 * @param successHandle
 */
function listHbaseColumnfamily(param,successHandle){
    let tableName="";
    if( param.table instanceof  Array && param.table.length==0)
        return;
    if(param.table && param.table instanceof  Array && param.table.length==1)
    {
        tableName=param.table[0];
    }
    else {
        tableName=param.table;
    }
    if(tableName) {
        let url = Server.dataSource + `hbaseColumnFamilys?hbaseId=${param.resourceId}&nameSpace=${param.database}&table=${tableName}`;
        BfdRequest.ajaxGetData(url, successHandle);
    }
}

/**
 * 获取hbase数据列
 * @param param
 * @param successHandle
 */
function listHbaseColumn(param,successHandle){
    let url=Server.securityCenterAegis+`policy/hbase/column/list.do?resourceId=${param.resourceId}&database=${param.database}&table=${param.table}&columnfamily=${param.columnfamily}`;
    BfdRequest.ajaxGetData(url,successHandle);
}

/**
 * 获取获取角色用户
 * @param param
 * @param successHandle
 */
function listUsersByRoleId(param,successHandle){
    let url=`${Server.securityCenterAegis}user/listUsersByRoleId`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}

/**
 * 获取租户用户，不包含本租户
 * @param param
 * @param successHandle
 */
function listTenantUsersNotTenantOwner(param,successHandle){
    let url=`${Server.securityCenterAegis}user/listTenantUsersNotTenantOwner`;
    BfdRequest.ajaxPostStrData(url,null,successHandle);
}


function listUsersByTenant(param,successHandle){
    let url=`${Server.securityCenterAegis}user/listUsersByTenant`;
    BfdRequest.ajaxPostStrData(url,param,successHandle);
}


/**
 * 是否有相同的策略名称
 * @param param
 * @param successHandle
 */
function hasSamePolicyName(param,successHandle){
    let url=`${Server.securityCenterAegis}policy/hasSamePolicyName.do`;
     let data= BfdRequest.ajaxAsyncPost(url,param,successHandle).responseJSON;
    successHandle(data)
}

/**
 * 变更租户所有者
 * @param param
 * @param successHandle
 */
function changeTenantOwner(data,callback){
    let url = `${Server.securityCenterAegis}tenant/changeTenantOwner.action`;
    BfdRequest.ajaxPostStrData(url,data,callback);
}

function roleIsExists(data,callback){
    let url = `${Server.securityCenterAegis}role/isExistsRoleName?roleName=${data.roleName}`;
    BfdRequest.ajaxGetData(url,callback,null,false);
}

/**
 * 判断策略名称是否重名
 * 输入参数：策略名称
 * **/
function isExistPolicyName (data,callback){
    let url = `${Server.securityCenterAegis}policy/isExistsPolicyName` ;
    BfdRequest.ajaxAsyncPost(url, {data: JSON.stringify(data)}, callback)
}

export default {
    deleteRoleList,
    editRole,
    listByTenant,
    editRoleAssociateUser,
    addRoleToPolicy,
    assignRoleFunctionTree,
    assignRoleResourceTree,
    listPolicyResourceByType,
    listHiveDatabase,
    listHiveTable,
    listHiveColumn,
    listHbaseDatabase,
    listHbaseTable,
    listHbaseColumnfamily,
    listHbaseColumn,
    listUsersByRoleId,
    listUsersByTenant,
    listTenantUsersNotTenantOwner,
    hasSamePolicyName,
    changeTenantOwner,
    roleIsExists,
    isExistPolicyName
}