/***************************************************
 * 时间: 2016/7/21 15:58
 * 作者: bing.wang
 * 说明: 角色子路由
 *
 ***************************************************/
module.exports = {
    path: 'owner',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./authority'),
                require('./tenant'),
                require('./useraudit'),
                require('./usermanage')
            ])
        })
    }
}