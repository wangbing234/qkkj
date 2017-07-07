/***************************************************
 * 时间: 2016/7/21 17:00
 * 作者: bing.wang
 * 说明: 我的权限路由
 *
 ***************************************************/
module.exports = {
    path: 'myauthority',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            console.log('myauthority');
            cb(null, require('./components'))
        })
    }
}