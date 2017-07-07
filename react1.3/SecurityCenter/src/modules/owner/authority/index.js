/***************************************************
 * 时间: 2016/7/21 17:00
 * 作者: bing.wang
 * 说明: 权限管理路由
 *
 ***************************************************/
module.exports = {
    path: 'authority',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./authoritysp'),
                require('./datapolicy'),
                require('./authoritysview'),
                require('./myauthority')
            ])
        })
    }
}