/***************************************************
 * 时间: 2016/7/21 16:04
 * 作者: bing.wang
 * 说明: 角色路由
 *
 ***************************************************/
module.exports = {
    path:'role',
    getComponent(location,callbackFunc){
        require.ensure([],(require) => {
            callbackFunc(null,require('./component/RoleManage'));
        });
    }
}