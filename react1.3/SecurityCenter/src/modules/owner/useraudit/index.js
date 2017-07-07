/***************************************************
 * 时间: 2016/7/21 15:53
 * 作者: bing.wang
 * 说明: 审计主页面路由
 *
 ***************************************************/
module.exports = {
    path: 'useraudit',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./dataaudit'),
                require('./loginaudit'),
                require('./platformaudit')
            ])
        })
    }

}