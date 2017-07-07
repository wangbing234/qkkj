/***************************************************
 * 时间: 2016/7/21 15:57
 * 作者: bing.wang
 * 说明: 角色路由
 *
 ***************************************************/
module.exports = {
    path: 'user',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./authority')
            ])
        })
    }
}