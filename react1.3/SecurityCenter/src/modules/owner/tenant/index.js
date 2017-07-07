/***************************************************
 * 时间: 2016/7/21 17:05
 * 作者: bing.wang
 * 说明: 租户配置路由
 *
 ***************************************************/
module.exports = {
    path: 'tenant',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./tenantconfig'),
                require('./tenantbaseinfo')
            ])
        })
    }

}