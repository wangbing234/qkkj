/***************************************************
 * 时间: 2016/7/21 15:58
 * 作者: bing.wang
 * 说明: 用户子路由
 *
 ***************************************************/
import './css/index.less'
module.exports = {
    path: 'authority',
    //子路由
    getChildRoutes(location, cb) {
        require.ensure([], (require) => {
            cb(null, [
                require('./myauthority'),
                require('./myapply')
            ])
        })
    }
}